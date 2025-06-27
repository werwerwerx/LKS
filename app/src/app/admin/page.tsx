import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Plus, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в админ-панель</h2>
        <p className="text-muted-foreground">Управляйте моделями и настройками системы</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Управление моделями
            </CardTitle>
            <CardDescription>
              Создавайте, редактируйте и управляйте моделями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                • Добавление новых моделей с фотографиями<br/>
                • Редактирование информации о моделях<br/>
                • Массовое удаление моделей<br/>
                • Управление статусом активности
              </p>
              <div className="flex gap-2">
                <Link href="/admin/models">
                  <Button>
                    Управлять моделями
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/admin/models">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать модель
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Настройки Telegram
            </CardTitle>
            <CardDescription>
              Управление уведомлениями в Telegram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                • Настройка бота для уведомлений<br/>
                • Управление получателем уведомлений<br/>
                • Мониторинг статуса системы<br/>
                • Настройка автоматических уведомлений
              </p>
              <Link href="/admin/telegram">
                <Button variant="outline" className="w-full">
                  Настроить Telegram
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    
    </div>
  )
} 