import React from 'react';

const ProtectedRoute = ({ children, isAuthenticated, userRole, allowedRoles, redirectTo = '/login' }) => {
  // Check token / auth status
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 mb-4">You need to be signed in to access this page.</p>
          <a
            href={redirectTo}
            className="inline-block px-4 py-2 bg-green-700 text-white font-medium rounded text-sm hover:bg-green-800"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Check role authorization if allowedRoles array is supplied
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your role ({userRole || 'Guest'}) does not have permission to view this portal area.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-gray-700 text-white font-medium rounded text-sm hover:bg-gray-800"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
