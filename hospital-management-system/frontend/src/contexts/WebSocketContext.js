import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { currentUser, token } = useAuth();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (!currentUser || !token) {
      console.log('User not authenticated, skipping WebSocket connection');
      return;
    }

    console.log('Connecting to WebSocket...');
    
    // Create SockJS connection
    const socket = new SockJS(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/ws`);
    const client = Stomp.over(socket);

    // Configure STOMP client
    client.configure({
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    // Handle connection
    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);
      setStompClient(client);
      reconnectAttempts.current = 0;

      // Subscribe to user-specific notifications
      client.subscribe(`/topic/user/${currentUser.userId}/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('Received notification:', notification);
          
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification if supported
          showBrowserNotification(notification);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      });

      // Subscribe to role-based notifications
      if (currentUser.role) {
        client.subscribe(`/topic/role/${currentUser.role}/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received role notification:', notification);
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            showBrowserNotification(notification);
          } catch (error) {
            console.error('Error parsing role notification:', error);
          }
        });
      }
    };

    // Handle connection errors
    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setConnected(false);
      handleReconnect();
    };

    // Handle WebSocket errors
    client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
      handleReconnect();
    };

    // Handle disconnection
    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
      handleReconnect();
    };

    // Activate the connection
    client.activate();
  };

  const disconnect = () => {
    if (stompClient) {
      console.log('Disconnecting from WebSocket...');
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  const handleReconnect = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttempts.current++;
        connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  };

  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo-mark.jpg',
        tag: `notification-${notification.notificationId}`
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.notificationId === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const fetchInitialNotifications = useCallback(async () => {
    try {
      const response = await api.get('/notifications');
      const data = response.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching initial notifications:', error);
    }
  }, []);

  // Connect when user is authenticated
  useEffect(() => {
    if (currentUser && token) {
      fetchInitialNotifications();
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    connected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestNotificationPermission,
    stompClient
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;