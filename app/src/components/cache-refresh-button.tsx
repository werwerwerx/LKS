"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface CacheRefreshButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function CacheRefreshButton({ className, variant = "outline" }: CacheRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const refreshCache = async () => {
    setIsRefreshing(true)
    
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('Токен авторизации не найден')
      }

      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка обновления кеша')
      }

      const result = await response.json()
      console.log('Cache refresh result:', result)
      
      setLastRefresh(new Date())
      toast.success('Кеш успешно обновлен', {
        description: 'Все страницы будут показывать актуальные данные при следующем посещении'
      })
    } catch (error) {
      console.error('Cache refresh error:', error)
      toast.error('Ошибка обновления кеша', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка'
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={refreshCache}
        disabled={isRefreshing}
        variant={variant}
        className={className}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Обновляется...' : 'Обновить кеш'}
      </Button>
      
      {lastRefresh && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          Обновлено: {lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
} 