import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url) => {
  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      setLastMessage(event.data);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount or url change
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  // Function to send data via WebSocket
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn('WebSocket is not open. Ready state:', socketRef.current?.readyState);
    }
  };

  return { lastMessage, sendMessage, isConnected };
};
