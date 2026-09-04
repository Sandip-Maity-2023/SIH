
// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import API from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [loading, setLoading] = useState(true);

//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     delete API.defaults.headers.common['Authorization'];
//     setToken(null);
//     setUser(null);
//   }, []);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       if (token) {
//         try {
//           API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//           const { data } = await API.get('/auth/profile');
//           setUser(data.data || data.user || data);
//         } catch (error) {
//           console.error('Session restoration failed:', error);
//           logout();
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, [token, logout]);

//   // Login handler
//   const login = async (credentials) => {
//     const { data } = await API.post('/auth/login', credentials);
//     const authPayload = data.data || data;
//     const authToken = authPayload.token;
//     const userData = authPayload.user || authPayload;

//     localStorage.setItem('token', authToken);
//     API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
//     setToken(authToken);
//     setUser(userData);
//     return data;
//   };

//   // Register handler
//   const register = async (userDataInput) => {
//     const { data } = await API.post('/auth/register', userDataInput);
//     const authPayload = data.data || data;
//     const authToken = authPayload.token;
//     const userData = authPayload.user || authPayload;

//     if (authToken) {
//       localStorage.setItem('token', authToken);
//       API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//       setToken(authToken);
//       setUser(userData);
//     }
//     return data;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         isAuthenticated: !!token,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };















import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (token) {
        try {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await API.get('/auth/profile');
          if (isMounted) {
            setUser(data.data || data.user || data);
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          if (isMounted) logout();
        }
      }
      if (isMounted) setLoading(false);
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    const authPayload = data.data || data;
    const authToken = authPayload.token;
    const userData = authPayload.user || authPayload;

    localStorage.setItem('token', authToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    setUser(userData);
    setToken(authToken);
    return data;
  };

  const register = async (userDataInput) => {
    const { data } = await API.post('/auth/register', userDataInput);
    const authPayload = data.data || data;
    const authToken = authPayload.token;
    const userData = authPayload.user || authPayload;

    if (authToken) {
      localStorage.setItem('token', authToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setUser(userData);
      setToken(authToken);
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};