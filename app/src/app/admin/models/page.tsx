"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Plus, Edit, Trash2, Users, Loader2 } from "lucide-react"
import ImageUpload from "@/components/image-upload"
import { useModels, useCreateModel, useUpdateModel, useDeleteModels } from "@/hooks/use-models"

interface Model {
  id: number
  name: string
  age: number
  description?: string
  price?: string
  is_active: boolean
  created_at: string
  updated_at: string
  photos: string[]
}

interface Message {
  type: 'success' | 'error'
  text: string
}

interface ModelFormData {
  name: string
  age: number | string
  description: string
  price: number | string
  photos: string[]
  is_active: boolean
}

interface FieldErrors {
  name?: string
  age?: string
  description?: string
  price?: string
  photos?: string
  general?: string
}

export default function ModelsAdminPage() {
  const [selectedModels, setSelectedModels] = useState<number[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingModel, setEditingModel] = useState<Model | null>(null)
  const [message, setMessage] = useState<Message | null>(null)
  
  const { data: modelsData, isLoading: isLoadingModels, error: modelsError } = useModels()
  const createModelMutation = useCreateModel()
  const updateModelMutation = useUpdateModel()
  const deleteModelsMutation = useDeleteModels()
  
  const models = modelsData?.models || []
  
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    age: '',
    description: '',
    price: '',
    photos: [],
    is_active: true
  })

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      description: '',
      price: '',
      photos: [],
      is_active: true
    })
  }

  useEffect(() => {
    if (modelsError) {
      showMessage('error', 'Ошибка загрузки моделей')
    }
  }, [modelsError])

  const createModel = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await createModelMutation.mutateAsync({
        name: formData.name.trim(),
        age: Number(formData.age),
        description: formData.description.trim() || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        photos: formData.photos,
        is_active: formData.is_active
      })

      showMessage('success', 'Модель успешно создана')
      setShowCreateDialog(false)
      resetForm()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания модели'
      return { success: false, error: errorMessage }
    }
  }

  const editModel = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!editingModel) {
        return { success: false, error: 'Модель для редактирования не найдена' }
      }

      await updateModelMutation.mutateAsync({
        id: editingModel.id,
        name: formData.name.trim(),
        age: Number(formData.age),
        description: formData.description.trim() || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        photos: formData.photos,
        is_active: formData.is_active
      })

      showMessage('success', 'Модель успешно обновлена')
      setShowEditDialog(false)
      setEditingModel(null)
      resetForm()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления модели'
      return { success: false, error: errorMessage }
    }
  }

  const deleteModels = async (ids: number[]) => {
    if (ids.length === 0) return

    try {
      await deleteModelsMutation.mutateAsync(ids)
      showMessage('success', `Удалено моделей: ${ids.length}`)
      setSelectedModels([])
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Ошибка удаления моделей')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedModels(models.map(m => m.id))
    } else {
      setSelectedModels([])
    }
  }

  const handleSelectModel = (modelId: number, checked: boolean) => {
    if (checked) {
      setSelectedModels(prev => [...prev, modelId])
    } else {
      setSelectedModels(prev => prev.filter(id => id !== modelId))
    }
  }

  const openEditDialog = async (model: Model) => {
    setEditingModel(model)
    setFormData({
      name: model.name,
      age: model.age,
      description: model.description || '',
      price: model.price || '',
      photos: model.photos,
      is_active: model.is_active
    })
    setShowEditDialog(true)
  }

  const handlePhotosChange = useCallback((photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }))
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const isAnyLoading = isLoadingModels || createModelMutation.isPending || updateModelMutation.isPending || deleteModelsMutation.isPending

  if (isLoadingModels) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Загрузка данных...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Управление моделями</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Создание, редактирование и удаление моделей</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" disabled={isAnyLoading}>
              {createModelMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Создать модель
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Создать новую модель</DialogTitle>
              <DialogDescription>
                Заполните информацию о модели и загрузите фотографии
              </DialogDescription>
            </DialogHeader>
            <ModelForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={createModel}
              onCancel={() => {
                setShowCreateDialog(false)
                resetForm()
              }}
              loading={createModelMutation.isPending}
              onPhotosChange={handlePhotosChange}
            />
          </DialogContent>
        </Dialog>

        {selectedModels.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => deleteModels(selectedModels)}
            disabled={deleteModelsMutation.isPending}
            className="w-full sm:w-auto"
          >
            {deleteModelsMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            <span className="sm:hidden">Удалить ({selectedModels.length})</span>
            <span className="hidden sm:inline">Удалить выбранные ({selectedModels.length})</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-xl">Список моделей ({models.length})</span>
            </span>
            {models.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedModels.length === models.length}
                  onCheckedChange={handleSelectAll}
                  disabled={isAnyLoading}
                />
                <Label className="text-xs sm:text-sm">Выбрать все</Label>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Моделей пока нет. Создайте первую модель!
            </div>
          ) : (
            <div className="space-y-4">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={selectedModels.includes(model.id)}
                  onSelect={(checked) => handleSelectModel(model.id, checked)}
                  onEdit={() => openEditDialog(model)}
                  onDelete={() => deleteModels([model.id])}
                  loading={deleteModelsMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Редактировать модель</DialogTitle>
            <DialogDescription>
              Обновите информацию о модели
            </DialogDescription>
          </DialogHeader>
          <ModelForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={editModel}
            onCancel={() => {
              setShowEditDialog(false)
              setEditingModel(null)
              resetForm()
            }}
            loading={updateModelMutation.isPending}
            onPhotosChange={handlePhotosChange}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ModelFormProps {
  formData: ModelFormData
  setFormData: React.Dispatch<React.SetStateAction<ModelFormData>>
  onSubmit: () => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  loading: boolean
  onPhotosChange: (photos: string[]) => void
  isEdit?: boolean
}

function ModelForm({ formData, setFormData, onSubmit, onCancel, loading, onPhotosChange, isEdit = false }: ModelFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false)

  const validateField = (name: string, value: string | number): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Имя модели обязательно'
        }
        if (typeof value === 'string' && value.length > 100) {
          return 'Имя слишком длинное (максимум 100 символов)'
        }
        break
      case 'age':
        const ageNum = Number(value)
        if (!value || isNaN(ageNum)) {
          return 'Возраст обязателен'
        }
        if (ageNum < 16 || ageNum > 99) {
          return 'Возраст должен быть от 16 до 99 лет'
        }
        break
      case 'description':
        if (typeof value === 'string' && value.length > 500) {
          return 'Описание слишком длинное (максимум 500 символов)'
        }
        break
      case 'price':
        if (value && Number(value) < 0) {
          return 'Цена не может быть отрицательной'
        }
        break
    }
    return undefined
  }

  const handleFieldChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setSubmitError('')
    
    if (name !== 'is_active' && hasTriedSubmit) {
      const error = validateField(name, value as string | number)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async () => {
    setHasTriedSubmit(true)
    const newErrors: FieldErrors = {}
    setSubmitError('')
    
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError
    
    const ageError = validateField('age', formData.age)
    if (ageError) newErrors.age = ageError
    
    const descError = validateField('description', formData.description)
    if (descError) newErrors.description = descError
    
    const priceError = validateField('price', formData.price)
    if (priceError) newErrors.price = priceError
    
    if (formData.photos.length === 0) {
      newErrors.photos = 'Необходимо загрузить хотя бы одну фотографию'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      const result = await onSubmit()
      if (!result.success && result.error) {
        setSubmitError(result.error)
      }
    }
  }

  const shouldShowGeneralError = hasTriedSubmit && Object.keys(errors).length > 0

  return (
    <div className="space-y-6">
      {(shouldShowGeneralError || submitError) && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-1">
              {submitError && (
                <p className="font-medium text-red-800 dark:text-red-200">{submitError}</p>
              )}
              {shouldShowGeneralError && (
                <p className="font-medium text-red-800 dark:text-red-200">
                  Исправьте ошибки в форме перед отправкой
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Имя модели *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Введите имя модели"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="age">Возраст *</Label>
            <Input
              id="age"
              type="number"
              min="16"
              max="99"
              value={formData.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              placeholder="Введите возраст"
              disabled={loading}
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="price">Цена за час (руб.)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="100"
            value={formData.price}
            onChange={(e) => handleFieldChange('price', e.target.value)}
            placeholder="Введите цену за час"
            disabled={loading}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Введите описание модели"
            rows={3}
            disabled={loading}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          <p className="text-xs text-muted-foreground mt-1">
            {formData.description.length}/500 символов
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleFieldChange('is_active', !!checked)}
            disabled={loading}
          />
          <Label htmlFor="is_active">Активная модель</Label>
        </div>
      </div>

      <div>
        <Label className={errors.photos ? 'text-red-500' : ''}>
          Фотографии *
        </Label>
        <ImageUpload 
          onPhotosChange={onPhotosChange}
          existingPhotos={formData.photos}
          maxFiles={10}
          maxSize={5}
          className={errors.photos ? 'border-red-500 rounded-lg' : ''}
        />
        {errors.photos && <p className="text-sm text-red-500 mt-1">{errors.photos}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSubmit} disabled={loading} className="flex-1 order-1">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? 'Обновить' : 'Создать'}
        </Button>
        <Button onClick={onCancel} variant="outline" disabled={loading} className="flex-1 sm:flex-initial order-2">
          Отмена
        </Button>
      </div>
    </div>
  )
}

interface ModelCardProps {
  model: Model
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
  loading: boolean
}

function ModelCard({ model, isSelected, onSelect, onEdit, onDelete, loading }: ModelCardProps) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            disabled={loading}
            className="mt-1 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm sm:text-base">{model.name}</h3>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>Возраст: {model.age}{model.price && ` • ${model.price} руб/час`}</p>
              <p className="hidden sm:block">Создано: {new Date(model.created_at).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <Badge variant={model.is_active ? "default" : "secondary"} className="text-xs">
            {model.is_active ? "Активна" : "Неактивна"}
          </Badge>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href={`/models/${model.id}`} target="_blank">
              <Button size="sm" variant="outline" disabled={loading}>
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={onEdit} disabled={loading}>
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete} disabled={loading}>
              {loading ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {model.description && (
        <p className="text-sm text-muted-foreground">{model.description}</p>
      )}

      {model.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {model.photos.slice(0, 5).map((photo, index) => (
            <div key={index} className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded border overflow-hidden">
              <img 
                src={photo} 
                alt={`${model.name} фото ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {model.photos.length > 5 && (
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded border bg-muted flex items-center justify-center text-xs">
              +{model.photos.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 