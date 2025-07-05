import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Layout = ({ children }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getNavigationItems = () => {
    const items = [
      { name: 'Dashboard', href: '/', roles: ['aluno', 'professor', 'admin'] }
    ];

    if (userProfile?.role === 'aluno') {
      items.push(
        { name: 'Meu QR Code', href: '/my-qr', roles: ['aluno'] }
      );
    }

    if (userProfile?.role === 'professor' || userProfile?.role === 'admin') {
      items.push(
        { name: 'Escanear QR', href: '/scan-qr', roles: ['professor', 'admin'] }
      );
    }

    if (userProfile?.role === 'admin') {
      items.push(
        { name: 'Usuários', href: '/admin/users', roles: ['admin'] },
        { name: 'Turmas', href: '/admin/classes', roles: ['admin'] },
        { name: 'Relatórios', href: '/admin/reports', roles: ['admin'] }
      );
    }

    return items.filter(item => 
      item.roles.includes(userProfile?.role)
    );
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      professor: 'bg-blue-100 text-blue-800',
      aluno: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      admin: 'Administrador',
      professor: 'Professor',
      aluno: 'Aluno'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">APPSCULP Frequência</h1>
                <p className="text-sm text-gray-600">Sistema de Controle de Frequência Escolar</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile?.name || currentUser?.email}</p>
                <div className="flex items-center space-x-2">
                  {userProfile?.role && getRoleBadge(userProfile.role)}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {getNavigationItems().map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 APPSCULP AGENCIA. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-500">
              Sistema de Frequência Escolar v1.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

