import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Search, RefreshCw, ChevronUp, ChevronDown, Mail, MailOpen, User } from 'lucide-react'
import axiosInstance from '@/contexts/AxiosInstance'
import { toast } from 'react-toastify'

interface Feedback {
  id: string
  message: string
  userID: string
  sendingDate: string
  isRead: boolean
}

interface FeedbackResponse {
  success: boolean
  message: string
  responseType: number
  feedbacks: Feedback[]
}

export function FeedbacksContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<FeedbackResponse>('/Feedback/GetFeedBacks')
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks)
      } else {
        toast.error('Geri bildirimler yüklenirken bir hata oluştu')
        setFeedbacks([])
      }
    } catch (error) {
      toast.error('Geri bildirimler yüklenirken bir hata oluştu')
      setFeedbacks([])
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.post('/Feedback/ReadFeedBack', { feedbackID: id })
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === id ? { ...feedback, isRead: true } : feedback
      ))
      toast.success('Geri bildirim okundu olarak işaretlendi')
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu')
    }
  }

  const filteredAndSortedFeedbacks = useMemo(() => {
    return feedbacks
      .filter(feedback => 
        (filterStatus === 'all' || (filterStatus === 'unread' && !feedback.isRead) || (filterStatus === 'read' && feedback.isRead)) &&
        (feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
         feedback.userID.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const dateA = new Date(a.sendingDate).getTime()
        const dateB = new Date(b.sendingDate).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
  }, [feedbacks, searchTerm, filterStatus, sortOrder])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
        <div className="space-y-6 p-6 bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Kullanıcı Geri Bildirimleri</h1>
        <Button onClick={fetchFeedbacks} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="unread">Okunmamış</SelectItem>
            <SelectItem value="read">Okunmuş</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        >
          {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
          Tarih
        </Button>
      </div>

      {filteredAndSortedFeedbacks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-xl text-gray-500 dark:text-gray-400">Henüz geri bildirim bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAndSortedFeedbacks.map((feedback) => (
            <Card 
              key={feedback.id} 
              className={`transition-all duration-300 ${
                feedback.isRead 
                  ? 'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800' 
                  : 'bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 shadow-md'
              }`}
            >
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {feedback.isRead ? (
                          <MailOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Mail className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {feedback.isRead ? 'Okunmuş' : 'Okunmamış'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-gray-800 dark:text-gray-200">{feedback.userID}</span>
                  {!feedback.isRead && (
                    <Badge variant="secondary" className="ml-2 bg-green-600 text-white">
                      Yeni
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {new Date(feedback.sendingDate).toLocaleString('tr-TR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${feedback.isRead ? 'text-blue-800 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}`}>
                  {feedback.message}
                </p>
                <div className="flex justify-end space-x-2">
                  {!feedback.isRead && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => markAsRead(feedback.id)}
                      className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Okundu Olarak İşaretle
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

