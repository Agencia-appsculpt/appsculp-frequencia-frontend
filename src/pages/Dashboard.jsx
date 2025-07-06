import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useApiReady } from '../hooks/use-api-ready.jsx';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { isReady, loading } = useApiReady();

  // Se ainda não está pronto, mostrar loading
  if (!isReady || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const name = userProfile?.name || currentUser?.displayName || 'Usuário';
    const role = userProfile?.role || 'usuário';
    
    switch (role) {
      case 'aluno':
        return `Bem-vindo, ${name}! Aqui você pode visualizar sua frequência e QR Code.`;
      case 'professor':
        return `Bem-vindo, Professor ${name}! Gerencie suas turmas e registre a frequência dos alunos.`;
      case 'admin':
        return `Bem-vindo, ${name}! Você tem acesso completo ao sistema de frequência escolar.`;
      default:
        return `Bem-vindo, ${name}!`;
    }
  };

  const getQuickActions = () => {
    const role = userProfile?.role;
    
    switch (role) {
      case 'aluno':
        return [
          {
            title: 'Meu QR Code',
            description: 'Visualize seu QR Code para registro de presença',
            href: '/qr-code',
            color: 'bg-blue-600'
          },
          {
            title: 'Minha Frequência',
            description: 'Veja seu histórico de presença',
            href: '/my-attendance',
            color: 'bg-green-600'
          }
        ];
      
      case 'professor':
        return [
          {
            title: 'Registrar Presença',
            description: 'Escaneie QR Codes dos alunos',
            href: '/scan-qr',
            color: 'bg-blue-600'
          },
          {
            title: 'Minhas Turmas',
            description: 'Gerencie suas turmas',
            href: '/classes',
            color: 'bg-green-600'
          },
          {
            title: 'Relatórios',
            description: 'Visualize relatórios de frequência',
            href: '/reports',
            color: 'bg-purple-600'
          }
        ];
      
      case 'admin':
        return [
          {
            title: 'Gerenciar Usuários',
            description: 'Adicione e gerencie usuários do sistema',
            href: '/admin/users',
            color: 'bg-blue-600'
          },
          {
            title: 'Gerenciar Turmas',
            description: 'Crie e organize turmas',
            href: '/admin/classes',
            color: 'bg-green-600'
          },
          {
            title: 'Relatórios Gerais',
            description: 'Visualize relatórios completos',
            href: '/admin/reports',
            color: 'bg-purple-600'
          },
          {
            title: 'Configurações',
            description: 'Configure o sistema',
            href: '/admin/settings',
            color: 'bg-gray-600'
          }
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            {getWelcomeMessage()}
          </p>
          
          {userProfile && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Papel:</span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {userProfile.role}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{userProfile.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <a href={action.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics (placeholder for future implementation) */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">--</div>
              <div className="text-sm text-gray-600">Total de Presenças</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">--</div>
              <div className="text-sm text-gray-600">Taxa de Frequência</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">--</div>
              <div className="text-sm text-gray-600">Turmas Ativas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

