import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export function useSignalRNotifications(hubUrl: string) {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("AccessToken") || "", // JWT'yi ekle
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR connected.');

        // Sunucudan bildirim alındığında
        connection.on('ReceiveNotification', (message: string) => {
          console.log("Message received from SignalR:", message); //Burada get request atsın
          setNotifications((prev) => [...prev, message]);
        });
      })
      .catch((err) => console.error('SignalR connection failed: ', err));

    return () => {
      connection.stop().then(() => console.log('SignalR disconnected.'));
    };
  }, [hubUrl]);

  return notifications;
}
