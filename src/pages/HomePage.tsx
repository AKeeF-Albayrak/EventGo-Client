import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Ana Sayfa</h1>
      <p className="text-lg">Hoş geldiniz, {user?.name || 'Kullanıcı'}! Bu EventGo uygulamasının ana sayfasıdır.</p>
      {/* Add more content for the home page here */}
    </div>
  )
}

export default HomePage