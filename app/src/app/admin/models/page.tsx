"use client"

import { useState, useEffect } from "react"
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
import { CheckCircle, AlertCircle, Plus, Edit, Trash2, Users } from "lucide-react"
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

  const createModel = async () => {
    if (!formData.name.trim() || !formData.age) {
      showMessage('error', 'Заполните обязательные поля')
      return
    }

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
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Ошибка создания модели')
    }
  }

  const editModel = async () => {
    if (!editingModel || !formData.name.trim() || !formData.age) {
      showMessage('error', 'Заполните обязательные поля')
      return
    }

    try {
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
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Ошибка обновления модели')
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

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({ ...prev, photos }))
  }



  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const isAnyLoading = isLoadingModels || createModelMutation.isPending || updateModelMutation.isPending || deleteModelsMutation.isPending

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление моделями</h1>
        <p className="text-muted-foreground">Создание, редактирование и удаление моделей</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex-1 sm:flex-initial">
              <Plus className="h-4 w-4 mr-2" />
              Создать модель
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            className="flex-1 sm:flex-initial"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить выбранные ({selectedModels.length})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Список моделей ({models.length})
            </span>
            {models.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedModels.length === models.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Выбрать все</Label>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingModels ? (
            <div className="text-center py-8">Загрузка моделей...</div>
          ) : models.length === 0 ? (
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
  onSubmit: () => void
  onCancel: () => void
  loading: boolean
  onPhotosChange: (photos: string[]) => void
  isEdit?: boolean
}

function ModelForm({ formData, setFormData, onSubmit, onCancel, loading, onPhotosChange, isEdit = false }: ModelFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Имя модели *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Введите имя модели"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="age">Возраст *</Label>
          <Input
            id="age"
            type="number"
            min="16"
            max="99"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            placeholder="Введите возраст"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="price">Цена за час (руб.)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="100"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Введите цену за час"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Введите описание модели"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
            disabled={loading}
          />
          <Label htmlFor="is_active">Активная модель</Label>
        </div>
      </div>

      <div>
        <Label>Фотографии</Label>
        <ImageUpload 
          onPhotosChange={onPhotosChange}
          existingPhotos={formData.photos}
          maxFiles={10}
          maxSize={5}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={loading} className="flex-1">
          {isEdit ? 'Обновить' : 'Создать'}
        </Button>
        <Button onClick={onCancel} variant="outline" disabled={loading} className="flex-1">
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
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            disabled={loading}
          />
          <div>
            <h3 className="font-medium">{model.name}</h3>
            <p className="text-sm text-muted-foreground">
              Возраст: {model.age}
              {model.price && ` • ${model.price} руб/час`}
              • Создано: {new Date(model.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={model.is_active ? "default" : "secondary"}>
            {model.is_active ? "Активна" : "Неактивна"}
          </Badge>
          <Link href={`/models/${model.id}`} target="_blank">
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} disabled={loading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {model.description && (
        <p className="text-sm text-muted-foreground">{model.description}</p>
      )}

      {model.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {model.photos.slice(0, 5).map((photo, index) => (
            <div key={index} className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden">
              <img 
                src={photo} 
                alt={`${model.name} фото ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {model.photos.length > 5 && (
            <div className="flex-shrink-0 w-16 h-16 rounded border bg-muted flex items-center justify-center text-xs">
              +{model.photos.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 