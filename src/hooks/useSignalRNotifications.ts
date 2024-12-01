import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface Notification {
  id: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}

export function useSignalRNotifications(hubUrl: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("AccessToken") || "",
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR connected.');

        connection.on('ReceiveNotification', (notification: Notification) => {
          console.log("New notification received:", notification);
          setNotifications(prev => {
            if (prev.some(n => n.id === notification.id)) {
              return prev;
            }
            return [...prev, notification];
          });
        });
      })
      .catch((err) => console.error('SignalR connection failed: ', err));

    return () => {
      setNotifications([]);
      connection.stop().then(() => console.log('SignalR disconnected.'));
    };
  }, [hubUrl]);

  return notifications;
}
