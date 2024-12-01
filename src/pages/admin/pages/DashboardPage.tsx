import { useAuth } from '../../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Users, FileText, Bell, BarChart2, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from "@/components/ui/badge"

const DashboardPage = () => {
  const { user } = useAuth()

  // Dummy data for demonstration
  const stats = {
    totalEvents: 124,
    pendingApproval: 7,
    totalUsers: 1503,
    activeUsers: 892,
    totalFeedbacks: 18,
    unreadFeedbacks: 5
  }

  const quickLinks = [
    {
      title: 'Etkinlik Yönetimi',
      items: [
        { name: 'Onay Bekleyen Etkinlikler', path: '/admin/events-pending', icon: CalendarPlus, count: stats.pendingApproval },
        { name: 'Tüm Etkinlikler', path: '/admin/all-events', icon: FileText },
      ]
    },
    {
      title: 'Kullanıcı İşlemleri',
      items: [
        { name: 'Kullanıcı Yönetimi', path: '/admin/users', icon: Users, count: stats.totalUsers },
        { name: 'Geri Bildirimler', path: '/admin/feedbacks', icon: Bell, count: stats.unreadFeedbacks },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { name: 'İstatistikler', path: '/admin/statistics', icon: BarChart2 },
        { name: 'Sistem Ayarları', path: '/admin/settings', icon: Settings },
      ]
    }
  ]

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Kontrol Paneli</h1>
        <p className="text-lg text-muted-foreground">
          Hoş geldiniz, {user?.name || 'Yönetici'}! EventGo yönetim panelinde neler yapmak istersiniz?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((section, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <Button
                  key={itemIdx}
                  asChild
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 relative"
                >
                  <Link to={item.path} className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.count !== undefined && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>Son 24 saat içindeki işlemler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'Yeni etkinlik oluşturuldu', time: '2 saat önce', type: 'event' },
                { text: 'Kullanıcı kaydı onaylandı', time: '3 saat önce', type: 'user' },
                { text: 'Yeni geri bildirim alındı', time: '5 saat önce', type: 'feedback' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <span className="text-sm">{activity.text}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı İstatistikler</CardTitle>
            <CardDescription>Genel sistem durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Toplam Etkinlik</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bekleyen Onay</p>
                <p className="text-2xl font-bold">{stats.pendingApproval}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Yeni Bildirim</p>
                <p className="text-2xl font-bold">{stats.unreadFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage