import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1>
      <p className="text-lg text-gray-700 mb-6">
        Aradığınız sayfa bulunamadı. Ana sayfaya dönmek için aşağıdaki bağlantıyı kullanın.
      </p>
      <Link to="/" className="text-primary hover:underline text-lg">
        Ana Sayfa
      </Link>
    </div>
  );
}