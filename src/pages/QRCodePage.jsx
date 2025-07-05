import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../config/api.jsx';

const QRCodePage = () => {
  const { userProfile } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyQRCode();
  }, []);

  const fetchMyQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/qr-code/my-qr');
      setQrCode(response.data);
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
      setError(error.response?.data?.message || 'Erro ao carregar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQR = () => {
    fetchMyQRCode();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu QR Code</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {qrCode && (
          <div className="text-center space-y-6">
            {/* Informações do Aluno */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {qrCode.student.name}
              </h3>
              <p className="text-sm text-gray-600">
                Matrícula: {qrCode.student.registrationNumber}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
              <img 
                src={qrCode.qrCode.dataURL} 
                alt="QR Code do Aluno"
                className="w-64 h-64 mx-auto"
              />
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
              <ol className="text-sm text-blue-800 text-left space-y-1">
                <li>1. Mostre este QR Code para o professor</li>
                <li>2. O professor irá escaneá-lo com o celular</li>
                <li>3. Sua presença será registrada automaticamente</li>
              </ol>
            </div>

            {/* Informações Técnicas */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>QR Code ID: {qrCode.qrCode.id}</p>
              <p>Gerado em: {new Date(qrCode.qrCode.generatedAt).toLocaleString('pt-BR')}</p>
            </div>

            {/* Botão de Atualizar */}
            <button
              onClick={handleRefreshQR}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Gerar Novo QR Code
            </button>
          </div>
        )}
      </div>

      {/* Dicas de Segurança */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Dicas de Segurança:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Não compartilhe seu QR Code com outros alunos</li>
          <li>• Gere um novo QR Code se suspeitar que foi comprometido</li>
          <li>• Apenas professores autorizados podem escanear seu código</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodePage;

