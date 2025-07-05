import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

// Páginas públicas
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

// Páginas gerais
import Dashboard from './pages/Dashboard.jsx';
import QRCodePage from './pages/QRCodePage.jsx';
import ScanQRPage from './pages/ScanQRPage.jsx';

// Páginas administrativas
import UserManagement from './pages/admin/UserManagement.jsx';
import ClassManagement from './pages/admin/ClassManagement.jsx';
import Reports from './pages/admin/Reports.jsx';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rotas para alunos */}
            <Route path="/my-qr" element={
              <ProtectedRoute allowedRoles={['aluno']}>
                <Layout>
                  <QRCodePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rotas para professores */}
            <Route path="/scan-qr" element={
              <ProtectedRoute allowedRoles={['professor', 'admin']}>
                <Layout>
                  <ScanQRPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rotas administrativas */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/classes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <ClassManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Rota padrão - redireciona para dashboard */}
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


