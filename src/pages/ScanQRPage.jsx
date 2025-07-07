import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../config/api.jsx';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanQRPage = () => {
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [qrString, setQrString] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [recentScans, setRecentScans] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = React.useRef(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/my-classes');
      setClasses(response.data.classes || []);
      if (response.data.classes && response.data.classes.length > 0) {
        setSelectedClass(response.data.classes[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      showMessage('Erro ao carregar turmas', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleScanQR = async (e) => {
    e.preventDefault();
    
    if (!qrString.trim()) {
      showMessage('Por favor, insira o código QR', 'error');
      return;
    }

    if (!selectedClass) {
      showMessage('Por favor, selecione uma turma', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/qr-code/scan', {
        qrString: qrString.trim(),
        classId: selectedClass
      });

      // Adicionar à lista de escaneamentos recentes
      const newScan = {
        id: Date.now(),
        student: response.data.student,
        class: response.data.class,
        attendance: response.data.attendance,
        timestamp: new Date().toISOString()
      };
      
      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]); // Manter apenas os 10 mais recentes
      
      showMessage(`Presença registrada para ${response.data.student.name}`, 'success');
      setQrString(''); // Limpar o campo
    } catch (error) {
      console.error('Erro ao escanear QR Code:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao registrar presença';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateClassQR = async () => {
    if (!selectedClass) {
      showMessage('Selecione uma turma primeiro', 'error');
      return;
    }

    try {
      const response = await api.get(`/qr-code/class/${selectedClass}`);
      
      // Abrir QR Code em nova janela/modal (implementação simplificada)
      const newWindow = window.open('', '_blank', 'width=400,height=500');
      newWindow.document.write(`
        <html>
          <head><title>QR Code da Aula</title></head>
          <body style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
            <h2>${response.data.class.name}</h2>
            <p>Professor: ${response.data.class.teacher}</p>
            <img src="${response.data.qrCode.dataURL}" style="max-width: 300px;" />
            <p style="font-size: 12px; color: #666;">
              Válido até: ${new Date(response.data.qrCode.expiresAt).toLocaleString('pt-BR')}
            </p>
          </body>
        </html>
      `);
      
      showMessage('QR Code da aula gerado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao gerar QR Code da aula:', error);
      showMessage('Erro ao gerar QR Code da aula', 'error');
    }
  };

  const handleScanQRCode = () => {
    setShowScanner(true);
    setTimeout(() => {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: 250 },
          false
        );
        scannerRef.current.render(
          (decodedText) => {
            setQrString(decodedText);
            setShowScanner(false);
            scannerRef.current.clear();
          },
          (error) => {
            // Ignorar erros de leitura
          }
        );
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Escanear QR Code</h1>
        
        {message && (
          <div className={`px-4 py-3 rounded-md mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Escaneamento */}
          <div className="space-y-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Turma
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma turma</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.subject}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleScanQR} className="space-y-4">
              <div>
                <label htmlFor="qrString" className="block text-sm font-medium text-gray-700 mb-2">
                  Código QR do Aluno
                </label>
                <div className="flex items-center gap-2">
                  <textarea
                    id="qrString"
                    value={qrString}
                    onChange={(e) => setQrString(e.target.value)}
                    placeholder="Cole aqui o código QR escaneado ou digite manualmente"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleScanQRCode}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 flex-shrink-0"
                    title="Ler QR Code pela câmera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25v.75m0 0A2.25 2.25 0 006 8.25h1.5m-3-2.25V6A2.25 2.25 0 016.75 3.75h.75m-3 2.25h.75m12.75 0h.75m0 0A2.25 2.25 0 0121 6.75v.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-.75m3 2.25h-.75M3.75 18.75v-.75m0 0A2.25 2.25 0 006 15.75h1.5m-3 2.25V18A2.25 2.25 0 016.75 20.25h.75m-3-2.25h.75m12.75 0h.75m0 0A2.25 2.25 0 0121 17.25v-.75m0 0V18a2.25 2.25 0 01-2.25 2.25h-.75m3-2.25h-.75" />
                    </svg>
                  </button>
                </div>
                {showScanner && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-xs w-full relative">
                      <div id="qr-reader" style={{ width: '100%' }} />
                      <button
                        type="button"
                        onClick={() => {
                          setShowScanner(false);
                          if (scannerRef.current) {
                            scannerRef.current.clear();
                            scannerRef.current = null;
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processando...' : 'Registrar Presença'}
                </button>
                <button
                  type="button"
                  onClick={generateClassQR}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  QR da Aula
                </button>
              </div>
            </form>

            {/* Instruções */}
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Selecione a turma</li>
                <li>2. Peça para o aluno mostrar seu QR Code</li>
                <li>3. Clique no ícone de QR Code para abrir a câmera</li>
                <li>4. O código será preenchido automaticamente</li>
                <li>5. Clique em "Registrar Presença"</li>
              </ol>
            </div>
          </div>

          {/* Lista de Escaneamentos Recentes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Presenças Registradas Hoje</h3>
            
            {recentScans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma presença registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{scan.student.name}</p>
                        <p className="text-sm text-gray-600">
                          Matrícula: {scan.student.registrationNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(scan.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Presente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;

