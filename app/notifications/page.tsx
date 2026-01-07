'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle, Calendar, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date
  relatedExamId?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API'den bildirimleri çek
    setLoading(false)
  }, [])

  const markAsRead = async (id: string) => {
    // TODO: API'ye istek gönder
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = async () => {
    // TODO: API'ye istek gönder
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'exam_reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />
      case 'application_deadline':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'result_announced':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz bildiriminiz yok</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border p-6 ${
                notification.isRead
                  ? 'border-gray-200 opacity-75'
                  : 'border-primary-200 bg-primary-50'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Okundu İşaretle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
