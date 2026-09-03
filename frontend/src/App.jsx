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

// Placeholder Auth Pages for full route completion
const LoginPlaceholder = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="bg-white p-8 rounded-xl shadow-md border text-center max-w-sm w-full">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">Account Login</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your registered credentials to access your portal.</p>
      <input type="email" placeholder="Email Address" className="w-full mb-3 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
      <input type="password" placeholder="Password" className="w-full mb-4 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
      <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-emerald-700 transition">Sign In</button>
    </div>
  </div>
);

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
          <Route path="/login" element={<LoginPlaceholder />} />

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
