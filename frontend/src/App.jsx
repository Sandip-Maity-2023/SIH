import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Navigation Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Page Views
import Marketplace from './pages/Marketplace';
import FPODashboard from './pages/FPODashboard';
import LogisticsMap from './pages/LogisticsMap';
import AuthPage from './pages/AuthPage';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-emerald-700 font-bold">Verifying Session...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />

          {/* FPO Pooling Portal */}
          <Route
            path="/fpo-dashboard"
            element={
              <ProtectedRoute>
                <FPODashboard />
              </ProtectedRoute>
            }
          />

          {/* Real-Time Logistics Tracking */}
          <Route
            path="/logistics"
            element={
              <ProtectedRoute>
                <LogisticsMap />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}
