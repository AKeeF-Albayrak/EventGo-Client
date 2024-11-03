import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

export default function RootLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Etkinlik Platformu</h1>
          <button
            onClick={logout}
            className="text-sm text-primary-foreground hover:underline"
          >
            Çıkış Yap
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-secondary text-secondary-foreground py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Etkinlik Platformu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
