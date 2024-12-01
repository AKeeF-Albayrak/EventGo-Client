"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/shared/Header'
import { Badge } from '@/components/ui/badge'
import axiosInstance from '@/contexts/AxiosInstance'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'

interface PointHistoryResponse {
  success: boolean
  message: string
  responseType: number
  points: {
    userId: string
    eventId: string
    score: number
    date: string
    id: string
  }[]
  point: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function PointsHistoryPage() {
  const { user } = useAuth()
  const [pointHistory, setPointHistory] = useState<PointHistoryResponse['points']>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPointHistory = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get<PointHistoryResponse>('/Point/GetPoints', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        if (response.data.success) {
          const sortedPoints = [...response.data.points].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setPointHistory(sortedPoints)
          setTotalPoints(response.data.point)
        }
      } catch (error) {
        console.error('Puan geçmişi yüklenirken hata:', error)
        setPointHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchPointHistory()
    }
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Header 
          title="Puan Geçmişi" 
          subtitle={`Toplam Puanınız: ${totalPoints}`} 
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              Puan Hareketleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Header 
        title="Puan Geçmişi" 
        subtitle={`Toplam Puanınız: ${totalPoints}`} 
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            Puan Hareketleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {pointHistory.map((history) => (
              <motion.div 
                key={history.id} 
                variants={item}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium">Etkinlik Puanı</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(history.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    +{history.score} Puan
                  </Badge>
                </div>
              </motion.div>
            ))}

            {pointHistory.length === 0 && !isLoading && (
              <motion.p 
                variants={item}
                className="text-center text-muted-foreground py-8"
              >
                Henüz puan hareketiniz bulunmuyor.
              </motion.p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

