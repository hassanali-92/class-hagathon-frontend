import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // Check if logged in
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  // Check Role
  if (allowedRole && userInfo.role !== allowedRole) {
    return <Navigate to={userInfo.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<AdminRegister />} />
        
        {/* Public Profile Page (No Auth Needed) */}
        <Route path="/u/:username" element={<PublicProfile />} />

        {/* Protected User Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole="user">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;