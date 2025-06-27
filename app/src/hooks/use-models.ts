'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

interface CreateModelData {
  name: string
  age: number
  description?: string
  price?: number
  photos: string[]
  is_active: boolean
}

interface UpdateModelData extends CreateModelData {
  id: number
}

const MODELS_QUERY_KEY = ['models']

export function useModels() {
  return useQuery({
    queryKey: MODELS_QUERY_KEY,
    queryFn: async (): Promise<{ models: Model[] }> => {
      const response = await fetch('/api/admin/models')
      if (!response.ok) {
        throw new Error('Ошибка загрузки моделей')
      }
      return response.json()
    },
  })
}

export function useCreateModel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateModelData) => {
      const response = await fetch('/api/admin/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка создания модели')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEY })
    },
  })
}

export function useUpdateModel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateModelData) => {
      const response = await fetch(`/api/admin/models/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка обновления модели')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEY })
    },
  })
}

export function useDeleteModels() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch('/api/admin/models', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка удаления моделей')
      }

      return response.json()
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: MODELS_QUERY_KEY })
      
      const previousModels = queryClient.getQueryData<{ models: Model[] }>(MODELS_QUERY_KEY)
      
      queryClient.setQueryData<{ models: Model[] }>(MODELS_QUERY_KEY, (old) => {
        if (!old) return old
        return {
          models: old.models.filter(model => !ids.includes(model.id))
        }
      })

      return { previousModels }
    },
    onError: (error, ids, context) => {
      if (context?.previousModels) {
        queryClient.setQueryData(MODELS_QUERY_KEY, context.previousModels)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEY })
    },
  })
}

export function useAddModelPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ modelId, photoUrls }: { modelId: number; photoUrls: string[] }) => {
      const response = await fetch(`/api/admin/models/${modelId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrls }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка добавления фотографий')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEY })
    },
  })
}

export function useDeleteModelPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ modelId, photoUrl }: { modelId: number; photoUrl: string }) => {
      const response = await fetch(`/api/admin/models/${modelId}/photos?url=${encodeURIComponent(photoUrl)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка удаления фотографии')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
} 