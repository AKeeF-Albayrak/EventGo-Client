import { useAuth } from '../../../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Kontrol Paneli</h1>
      <p className="text-lg mb-4">Merhaba, {user?.name || 'Kullanıcı'}! Bu EventGo uygulamasının kontrol panelidir.</p>
      {/* Add dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Etkinliklerim</h2>
          <p>Henüz etkinlik yok.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Bildirimler</h2>
          <p>Yeni bildiriminiz yok.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Hızlı İşlemler</h2>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">Yeni Etkinlik Oluştur</button>
        </div>
      </div>
    </div>
  )
}
export default HomePage;
