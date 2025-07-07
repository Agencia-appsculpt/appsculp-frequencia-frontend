import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../config/api.jsx';

const ClassManagement = () => {
  const { userProfile, currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    schoolYear: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setError('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      if (!currentUser) return;
      const token = await currentUser.getIdToken();
      const response = await api.get('/users/professors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users?role=aluno');
      setStudents(response.data.users || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        teacherId: formData.teacherId,
        schoolYear: Number(formData.schoolYear)
      };
      if (editingClass) {
        await api.put(`/classes/${editingClass.id}`, payload);
      } else {
        await api.post('/classes', payload);
      }
      await fetchClasses();
      resetForm();
      setShowAddModal(false);
      setEditingClass(null);
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      console.log('Detalhe do erro:', error.response?.data);
      setError(error.response?.data?.message || 'Erro ao salvar turma');
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      teacherId: classItem.teacherId,
      schoolYear: classItem.schoolYear
    });
    setShowAddModal(true);
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta turma?')) {
      return;
    }

    try {
      await api.delete(`/classes/${classId}`);
      await fetchClasses();
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      setError('Erro ao excluir turma');
    }
  };

  const handleManageStudents = (classItem) => {
    setSelectedClass(classItem);
    setShowStudentsModal(true);
  };

  const handleAddStudentToClass = async (studentId) => {
    try {
      await api.post(`/classes/${selectedClass.id}/students`, { studentId });
      await fetchClasses();
    } catch (error) {
      console.error('Erro ao adicionar aluno à turma:', error);
      setError('Erro ao adicionar aluno à turma');
    }
  };

  const handleRemoveStudentFromClass = async (studentId) => {
    try {
      await api.delete(`/classes/${selectedClass.id}/students/${studentId}`);
      await fetchClasses();
    } catch (error) {
      console.error('Erro ao remover aluno da turma:', error);
      setError('Erro ao remover aluno da turma');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      teacherId: '',
      schoolYear: ''
    });
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.teacherId === teacherId);
    return teacher ? teacher.name : 'Professor não encontrado';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Turmas</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mt-2 md:mt-0"
        >
          Adicionar Turma
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Lista de Turmas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white shadow rounded-lg p-4 flex flex-col h-full">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{classItem.name}</h3>
                <p className="text-sm text-gray-600">{classItem.subject}</p>
              </div>
              <div className="flex space-x-1 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(classItem)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Professor:</strong> {getTeacherName(classItem.teacherId)}</p>
              {classItem.schedule && <p><strong>Horário:</strong> {classItem.schedule}</p>}
              {classItem.room && <p><strong>Sala:</strong> {classItem.room}</p>}
              <p><strong>Alunos:</strong> {classItem.Students?.length || 0}</p>
            </div>

            {classItem.description && (
              <p className="mt-3 text-sm text-gray-700">{classItem.description}</p>
            )}

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleManageStudents(classItem)}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Gerenciar Alunos
              </button>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma turma encontrada</p>
        </div>
      )}

      {/* Modal de Adicionar/Editar Turma */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingClass ? 'Editar Turma' : 'Adicionar Turma'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Turma
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professor
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione um professor</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.name} ({teacher.email}) - Matrícula: {teacher.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano Letivo
                  </label>
                  <input
                    type="number"
                    value={formData.schoolYear}
                    onChange={(e) => setFormData({...formData, schoolYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Ex: 2025"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {editingClass ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingClass(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciar Alunos */}
      {showStudentsModal && selectedClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Gerenciar Alunos - {selectedClass.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alunos Disponíveis */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Alunos Disponíveis</h4>
                  <div className="max-h-64 overflow-y-auto border rounded-md">
                    {students
                      .filter(student => student.student && !selectedClass.Students?.some(s => s.id === student.student.id))
                      .map((student) => (
                        <div key={student.student.id} className="flex justify-between items-center p-3 border-b">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                          <button
                            onClick={() => handleAddStudentToClass(student.student.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Adicionar
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Alunos na Turma */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Alunos na Turma</h4>
                  <div className="max-h-64 overflow-y-auto border rounded-md">
                    {selectedClass.Students?.map((student) => (
                      <div key={student.id} className="flex justify-between items-center p-3 border-b">
                        <div>
                          <p className="font-medium">{student.User.name}</p>
                          <p className="text-sm text-gray-600">{student.User.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveStudentFromClass(student.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    )) || <p className="p-3 text-gray-500">Nenhum aluno na turma</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setShowStudentsModal(false);
                    setSelectedClass(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;

