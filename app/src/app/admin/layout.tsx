import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Users, MessageSquare } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen dark min-w-screen">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Панель администратора</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/models">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Модели</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/telegram">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Telegram</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/site-settings">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Настройки сайта</span>
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