"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Flame, Target, Book, MessageSquare, Trophy, ChevronDown } from 'lucide-react'

interface DailyActivity {
  date: string
  points: number
  activities: {
    type: string
    description: string
    points: number
  }[]
}

const pointHistory: DailyActivity[] = [
  {
    date: "30 Kas 2024",
    points: 5,
    activities: [
      { type: "Mission", description: "Günlük giriş görevi tamamlandı", points: 1 },
      { type: "Challenge", description: "Kolay zorluk seviyesinde problem çözüldü", points: 3 },
      { type: "Contribution", description: "Bir soruya yorum yapıldı", points: 1 },
    ]
  },
  {
    date: "29 Kas 2024",
    points: 2,
    activities: [
      { type: "Mission", description: "Günlük giriş görevi tamamlandı", points: 1 },
      { type: "Study", description: "Algoritma dersini tamamladı", points: 1 },
    ]
  },
  {
    date: "28 Kas 2024",
    points: 4,
    activities: [
      { type: "Mission", description: "Günlük giriş görevi tamamlandı", points: 1 },
      { type: "Challenge", description: "Orta zorluk seviyesinde problem çözüldü", points: 3 },
    ]
  },
  // Daha fazla gün ekleyebilirsiniz...
]

function getActivityIcon(type: string) {
  switch (type) {
    case "Mission":
      return <Target className="h-4 w-4 text-blue-500" />;
    case "Challenge":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "Study":
      return <Book className="h-4 w-4 text-green-500" />;
    case "Contribution":
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <Flame className="h-4 w-4 text-orange-500" />;
  }
}

export default function PointsHistoryPage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [visibleDays, setVisibleDays] = useState(10)
  const weeksCount = Math.ceil(pointHistory.length / 7)

  const currentWeekData = pointHistory.slice(0, visibleDays)

  const loadMore = () => {
    setVisibleDays(prev => Math.min(prev + 10, pointHistory.length))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Puan Geçmişi</h1>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentWeek(prev => Math.max(0, prev - 1))}
            disabled={currentWeek === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Önceki Hafta
          </Button>
          <span className="font-medium">Hafta {currentWeek + 1} / {weeksCount}</span>
          <Button 
            variant="outline" 
            onClick={() => setCurrentWeek(prev => Math.min(weeksCount - 1, prev + 1))}
            disabled={currentWeek === weeksCount - 1}
          >
            Sonraki Hafta
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {currentWeekData.slice(0, 7).map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-sm text-muted-foreground mb-1 text-center">{day.date.split(' ')[0]}</div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-transform hover:scale-110">
                <Flame className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="mt-1 font-medium text-center">{day.points}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {currentWeekData.map((day, dayIndex) => (
            <div key={dayIndex} className="group">
              <h3 className="font-medium mb-2 text-center">{day.date}</h3>
              <div className="bg-gray-50 p-2 rounded-md transition-all duration-300 group-hover:shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Toplam Puan</span>
                  <span className="text-green-500 font-medium flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    +{day.points}
                  </span>
                </div>
                <div
                  className="mt-2 space-y-2 overflow-hidden transition-all duration-500 ease-out opacity-0 max-h-0 delay-100 group-hover:opacity-100 group-hover:max-h-[500px] group-hover:duration-700 group-hover:delay-0"
                >
                  {day.activities.map((activity, actIndex) => (
                    <div
                      key={actIndex}
                      className="flex justify-between items-center py-1 border-b last:border-b-0 rounded-md px-2"
                    >
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="text-sm font-medium">{activity.type}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <span className="text-green-500 font-medium">+{activity.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>                    
          ))}
        </div>
        {visibleDays < pointHistory.length && (
          <div className="mt-6 text-center">
            <Button onClick={loadMore} variant="outline">
              Daha Fazla Yükle
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

