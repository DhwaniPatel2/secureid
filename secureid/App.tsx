
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { getCurrentUser, logout } from './services/authService';
import { UserProfile } from './types';

const Navbar: React.FC<{ user: UserProfile | null; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-halved text-white"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                SecureID
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:block text-sm text-gray-500 mr-2">
                  Welcome, <span className="font-semibold text-gray-900">{user.fullName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleAuthChange = () => {
    setUser(getCurrentUser());
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onAuthSuccess={handleAuthChange} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onAuthSuccess={handleAuthChange} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SecureID Identity Microservice Simulation. Built with AES-256 and JWT.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
