
// import React, { createContext, useEffect, useState, useContext } from 'react';
// import { io } from 'socket.io-client';
// import { AuthContext } from './AuthContext';

// export const SocketContext = createContext(null);

// const SOCKET_URL =
//   import.meta.env.VITE_SOCKET_URL ||
//   import.meta.env.REACT_APP_SOCKET_URL ||
//   'http://localhost:5001';

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [, setIsConnected] = useState(false);
//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     // Initialize Socket Connection
//     const socketInstance = io(SOCKET_URL, {
//       autoConnect: true,
//       auth: {
//         token: token || '',
//       },
//       transports: ['websocket', 'polling'],
//     });

//     socketInstance.on('connect', () => {
//       console.log('⚡ Socket connected:', socketInstance.id);
//       setIsConnected(true);
//     });

//     socketInstance.on('disconnect', (reason) => {
//       console.warn('⚡ Socket disconnected:', reason);
//       setIsConnected(false);
//     });

//     socketInstance.on('connect_error', (error) => {
//       console.error('⚡ Socket connection error:', error.message);
//     });

//     setSocket(socketInstance);

//     // Cleanup connection on unmount
//     return () => {
//       if (socketInstance) {
//         socketInstance.disconnect();
//       }
//     };
//   }, [token]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.REACT_APP_SOCKET_URL ||
  'http://localhost:5001';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      if (socket) socket.disconnect();
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
