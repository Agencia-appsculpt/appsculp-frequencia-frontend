import React, { useEffect, useState } from 'react';
import api from '../config/api.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const TeacherClasses = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await api.get('/classes/my-classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(response.data.classes || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar turmas');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Turmas</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {classes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Você ainda não possui turmas atribuídas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h2>
              <p className="text-sm text-gray-600 mb-1">Ano letivo: {classItem.schoolYear}</p>
              <p className="text-sm text-gray-600 mb-1">ID da Turma: {classItem.id}</p>
              <p className="text-sm text-gray-600 mb-1">Alunos: {classItem.students?.length || 0}</p>
              <div className="mt-2">
                <h3 className="font-medium text-gray-800 mb-1">Alunos:</h3>
                {classItem.students && classItem.students.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {classItem.students.map((student) => (
                      <li key={student.id}>{student.user?.name || 'Sem nome'} ({student.user?.email || 'Sem email'})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum aluno nesta turma.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses; 