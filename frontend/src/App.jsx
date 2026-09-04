// // import React, { useContext } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // // Context Providers
// // import { AuthProvider, AuthContext } from './context/AuthContext';
// // import { SocketProvider } from './context/SocketContext';

// // // Navigation Components
// // import Navbar from './components/common/Navbar';
// // import Footer from './components/common/Footer';

// // // Page Views
// // import Marketplace from './pages/Marketplace';
// // import FPODashboard from './pages/FPODashboard';
// // import LogisticsMap from './pages/LogisticsMap';
// // import AuthPage from './pages/AuthPage';
// // import CropDetails from './pages/CropDetails';
// // import BuyerDashboard from './pages/BuyerDashboard';

// // // Protected Route Guard Wrapper
// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated, loading } = useContext(AuthContext);

// //   if (loading) {
// //     return <div className="min-h-screen flex items-center justify-center text-emerald-700 font-bold">Verifying Session...</div>;
// //   }

// //   return isAuthenticated ? children : <Navigate to="/login" replace />;
// // };

// // function AppRoutes() {
// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <Navbar />
// //       <main className="flex-grow">
// //         <Routes>
// //           {/* Public Routes */}
// //           <Route path="/" element={<Navigate to="/marketplace" replace />} />
// //           <Route path="/marketplace" element={<Marketplace />} />
// //           <Route path="/crops/:id" element={<CropDetails />} />
// //           <Route path="/login" element={<AuthPage mode="login" />} />
// //           <Route path="/register" element={<AuthPage mode="register" />} />

// //           <Route
// //             path="/buyer-dashboard"
// //             element={
// //               <ProtectedRoute>
// //                 <BuyerDashboard />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* FPO Pooling Portal */}
// //           <Route
// //             path="/fpo-dashboard"
// //             element={
// //               <ProtectedRoute>
// //                 <FPODashboard />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* Real-Time Logistics Tracking */}
// //           <Route
// //             path="/logistics"
// //             element={
// //               <ProtectedRoute>
// //                 <LogisticsMap />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* Fallback Route */}
// //           <Route path="*" element={<Navigate to="/marketplace" replace />} />
// //         </Routes>
// //       </main>
// //       <Footer />
// //     </div>
// //   );
// // }

// // export default function App() {
// //   return (
// //     <Router>
// //       <AuthProvider>
// //         <SocketProvider>
// //           <AppRoutes />
// //         </SocketProvider>
// //       </AuthProvider>
// //     </Router>
// //   );
// // }







// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Context Providers
// import { AuthProvider, AuthContext } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext';

// // Navigation Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';

// // Page Views
// import Marketplace from './pages/Marketplace';
// import FPODashboard from './pages/FPODashboard';
// import LogisticsMap from './pages/LogisticsMap';
// import AuthPage from './pages/AuthPage';
// import CropDetails from './pages/CropDetails';
// import BuyerDashboard from './pages/BuyerDashboard';

// // Enhanced Protected Route Guard supporting Role-Based Access
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isAuthenticated, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-emerald-700 font-bold">
//         Verifying Session...
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Restrict route if user's role is not allowed
//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/marketplace" replace />;
//   }

//   return children;
// };

// function AppRoutes() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Navigate to="/marketplace" replace />} />
//           <Route path="/marketplace" element={<Marketplace />} />
//           <Route path="/crops/:id" element={<CropDetails />} />
//           <Route path="/login" element={<AuthPage mode="login" />} />
//           <Route path="/register" element={<AuthPage mode="register" />} />

//           {/* Buyer Dashboard (Restricted to Buyers & Farmers) */}
//           <Route
//             path="/buyer-dashboard"
//             element={
//               <ProtectedRoute allowedRoles={['buyer', 'farmer']}>
//                 <BuyerDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* FPO Pooling Portal (Restricted to FPO & Farmers) */}
//           <Route
//             path="/fpo-dashboard"
//             element={
//               <ProtectedRoute allowedRoles={['fpo', 'farmer']}>
//                 <FPODashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Real-Time Logistics Tracking (Accessible to All Authenticated Roles) */}
//           <Route
//             path="/logistics"
//             element={
//               <ProtectedRoute>
//                 <LogisticsMap />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback Route */}
//           <Route path="*" element={<Navigate to="/marketplace" replace />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <SocketProvider>
//           <AppRoutes />
//         </SocketProvider>
//       </AuthProvider>
//     </Router>
//   );
// }




import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';

// Navigation Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Page Views
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Marketplace from './components/buyer/Marketplace';
import CropDetails from './pages/CropDetails';
import AuthPage from './pages/AuthPage';
import FPODashboard from './pages/FPODashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import LogisticsMap from './pages/LogisticsMap';
import NotFoundPage from './pages/NotFoundPage';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import Settings from './components/admin/Settings';
import Profile from './components/common/Profile';
import Cart from './components/buyer/Cart';
import Checkout from './components/buyer/Checkout';
import Analytics from './components/admin/Analytics';
import DisputeTable from './components/admin/DisputeTable';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import OrdersPage from './pages/OrdersPage';
import PayoutsPage from './pages/PayoutsPage';
import ReportsPage from './pages/ReportsPage';
import SchedulePage from './pages/SchedulePage';

// Enhanced Protected Route Guard supporting Role-Based Access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700 font-bold">
        Verifying Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Restrict route if user's role is not allowed
  if (
    allowedRoles &&
    !allowedRoles.map((role) => role.toUpperCase()).includes(String(user?.role || '').toUpperCase())
  ) {
    const role = String(user?.role || '').toUpperCase();
    const fallback = role === 'ADMIN' ? '/admin' : role.includes('LOGISTICS') ? '/logistics' : role === 'BUYER' || role === 'CONSUMER' || role === 'BULK_BUYER' ? '/marketplace' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'consumer', 'bulk_buyer', 'driver', 'logistics', 'logistics_partner', 'farmer', 'fpo', 'admin']}>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route path="/crops/:id" element={<CropDetails />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />

          {/* Role-Based Dynamic Landing Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payouts"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo']}>
                <PayoutsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo', 'admin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'fpo', 'driver', 'logistics', 'logistics_partner', 'admin']}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'consumer', 'bulk_buyer']}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'consumer', 'bulk_buyer']}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/disputes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DisputeTable />
              </ProtectedRoute>
            }
          />

          {/* Buyer Dashboard (Restricted to Buyers & Farmers) */}
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'consumer', 'bulk_buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* FPO Pooling Portal (Restricted to FPO & Farmers) */}
          <Route
            path="/fpo-dashboard"
            element={
              <ProtectedRoute allowedRoles={['fpo', 'farmer']}>
                <FPODashboard />
              </ProtectedRoute>
            }
          />

          {/* Real-Time Logistics Tracking (Accessible to All Authenticated Roles) */}
          <Route
            path="/logistics"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'consumer', 'bulk_buyer', 'farmer', 'fpo', 'driver', 'logistics', 'logistics_partner', 'admin']}>
                <LogisticsMap />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
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
        <CartProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
