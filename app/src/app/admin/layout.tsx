"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Users, MessageSquare, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, loading, admin, logout } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">Панель администратора</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Привет, {admin?.login}!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link href="/admin/models" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Модели</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/telegram" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Telegram</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/site-settings" className="block sm:col-span-2 lg:col-span-1">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Настройки сайта</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  )
} 