"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, AlertCircle, UserPlus } from "lucide-react"
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading, initAdmin, checkAdminExists } = useAuth()
  
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminExists, setAdminExists] = useState<boolean | null>(null)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/admin')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const checkAdmin = async () => {
      const exists = await checkAdminExists()
      setAdminExists(exists)
    }
    checkAdmin()
  }, [checkAdminExists])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.login || !formData.password) {
      setError('Заполните все поля')
      setIsLoading(false)
      return
    }
    
    const result = await initAdmin(formData.login, formData.password)
    
    if (result.success) {
      setAdminExists(true)
      setIsCreatingAdmin(false)
      setError('')
    } else {
      setError(result.error || 'Ошибка создания администратора')
    }
    
    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await login(formData.login, formData.password)
    
    if (result.success) {
      router.push('/admin')
    } else {
      setError(result.error || 'Ошибка входа')
    }
    
    setIsLoading(false)
  }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Вход в админ-панель
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {adminExists === false ? 'Создайте аккаунт администратора' : 'Введите данные для входа'}
          </p>
        </div>

        {adminExists === false && !isCreatingAdmin && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <UserPlus className="h-5 w-5" />
                Первый запуск
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Администратор не найден. Создайте первого администратора для продолжения работы.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsCreatingAdmin(true)} 
                className="w-full"
              >
                Создать администратора
              </Button>
            </CardContent>
          </Card>
        )}

        {(adminExists === false && isCreatingAdmin) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Создание администратора
              </CardTitle>
              <CardDescription>
                Задайте логин и пароль для нового администратора
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Логин</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login"
                      type="text"
                      value={formData.login}
                      onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                      className="pl-10"
                      placeholder="Введите логин (мин. 3 символа)"
                      required
                      disabled={isLoading}
                      minLength={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      placeholder="Введите пароль (мин. 6 символов)"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreatingAdmin(false)
                      setError('')
                      setFormData({ login: '', password: '' })
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Создание...' : 'Создать'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {adminExists && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Авторизация
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Логин</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login"
                      type="text"
                      value={formData.login}
                      onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                      className="pl-10"
                      placeholder="Введите логин"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      placeholder="Введите пароль"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 