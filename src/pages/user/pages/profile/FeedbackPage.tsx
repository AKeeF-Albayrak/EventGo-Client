import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axiosInstance from '@/contexts/AxiosInstance';

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Lütfen bir mesaj giriniz');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post('/Feedback/SendFeedback', { message });
      toast.success('Geri bildiriminiz başarıyla gönderildi'); // calısmıyho
      setMessage('');
    } catch (error) {
      toast.error('Geri bildirim gönderilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Geri Bildirim</h1>
          <p className="text-muted-foreground">
            Görüş ve önerileriniz bizim için değerli. Lütfen düşüncelerinizi bizimle paylaşın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Textarea
              placeholder="Mesajınızı buraya yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Geri bildiriminiz doğrudan yönetim ekibimize iletilecektir.
            En kısa sürede değerlendirilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}