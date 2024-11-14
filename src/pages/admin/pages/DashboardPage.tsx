import { useAuth } from '../../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Users, FileText, Bell, BarChart2, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const { user } = useAuth()

  // Dummy data for demonstration
  const stats = {
    totalEvents: 124,
    pendingApproval: 7,
    totalUsers: 1503,
    activeUsers: 892
  }

  const recentActivities = [
    { id: 1, action: 'Yeni etkinlik oluşturuldu', time: '2 saat önce' },
    { id: 2, action: 'Kullanıcı kaydı onaylandı', time: '3 saat önce' },
    { id: 3, action: 'Etkinlik güncellendi', time: '5 saat önce' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kontrol Paneli</h1>
      <p className="text-lg">Merhaba, {user?.name || 'Yönetici'}! EventGo yönetim paneline hoş geldiniz.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Etkinlikler</CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApproval} onay bekleyen
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} aktif kullanıcı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Raporlar</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Yeni rapor mevcut
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bildirimler</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Yeni bildirim
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>Sık kullanılan yönetici işlemleri</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full">
              <Link to="/admin/events-pending">
                <FileText className="mr-2 h-4 w-4" /> Onay Bekleyen Etkinlikler
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" /> Kullanıcı Yönetimi
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/admin/settings">
                <Settings className="mr-2 h-4 w-4" /> Sistem Ayarları
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>Sistemdeki son değişiklikler</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="flex justify-between items-center">
                  <span>{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage