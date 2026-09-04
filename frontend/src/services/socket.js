import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.REACT_APP_SOCKET_URL ||
  'http://localhost:5001';

let socketInstance = null;

export const getSocket = (token) => {
  const currentToken = token || localStorage.getItem('token');
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      auth: currentToken ? { token: currentToken } : {},
      transports: ['websocket', 'polling'],
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default getSocket;
