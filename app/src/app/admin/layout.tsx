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
      <div className="container mx-auto px-3 sm:px-6 pt-[70px] sm:pt-[60px] pb-3 sm:pb-6">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Панель администратора К.Л.С.</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Привет, {admin?.login}!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <LogOut className="h-4 w-4" />
                <span className="sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <Link href="/admin/models" className="block">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-l-4 border-l-blue-600">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Модели</span>
                    <span className="text-xs text-muted-foreground">Управление каталогом</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/telegram" className="block">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-l-4 border-l-green-600">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Telegram</span>
                    <span className="text-xs text-muted-foreground">Настройка уведомлений</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/site-settings" className="block sm:col-span-2 lg:col-span-1">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-l-4 border-l-orange-600">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Настройки сайта</span>
                    <span className="text-xs text-muted-foreground">Контент и тексты</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6">
          {children}
        </div>
      </div>
    </div>
  )
} 