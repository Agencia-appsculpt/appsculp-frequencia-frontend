import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Layout = ({ children }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <div className="flex items-center">
              <button className="md:hidden mr-3" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - mobile drawer */}
        <div className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
        <nav className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-sm transform transition-transform duration-200 md:static md:translate-x-0 md:shadow-none md:min-h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
          <div className="p-4">
            <button className="md:hidden mb-4" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
              <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ul className="space-y-2">
              {getNavigationItems().map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-8 max-w-full overflow-x-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
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

