'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import axiosInstance from '@/contexts/AxiosInstance'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { parseISO, format, isValid } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

interface ChatSectionProps {
  eventId: string
}

export default function ChatSection({ eventId }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/Message/GetMessages', {
        eventId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        const formattedMessages = response.data.messages.map((msg: any) => ({
          id: msg.id,
          userId: msg.senderId,
          userName: msg.username,
          content: msg.text,
          timestamp: msg.sendingTime
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Mesajlar alınamadı:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages()
  }, [eventId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axiosInstance.post('/Message/SendMessage', {
        eventId,
        message: newMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        await fetchMessages();
        setNewMessage('');
      }
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return isValid(date) ? format(date, 'HH:mm', { locale: tr }) : '';
    } catch (error) {
      console.error('Timestamp formatlanırken hata:', timestamp);
      return '';
    }
  };

  const formatDateHeader = (timestamp: string) => {
    const date = parseISO(timestamp);
    return isValid(date) ? format(date, 'd MMMM yyyy', { locale: tr }) : '';
  };

  const isSameDay = (date1: string, date2: string) => {
    const d1 = parseISO(date1);
    const d2 = parseISO(date2);
    return isValid(d1) && isValid(d2) && 
           d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const renderMessages = () => {
    return messages.map((message, index) => {
      const showDateHeader = index === 0 || !isSameDay(messages[index - 1].timestamp, message.timestamp);

      return (
        <div key={message.id}>
          {showDateHeader && (
            <div className="flex justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {formatDateHeader(message.timestamp)}
              </div>
            </div>
          )}
          <div className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
              className={`p-3 rounded-lg inline-block ${
                message.userId === user?.id
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-sm">{message.userName}</p>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
              <p className="text-foreground break-words">{message.content}</p>
            </div>
          </div>
        </div>

      );
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Sohbet</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto space-y-2" aria-live="polite">
          {renderMessages()}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1"
          />
          <Button type="submit">Gönder</Button>
        </form>
      </CardFooter>
    </Card>
  )
}
