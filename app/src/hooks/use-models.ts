'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client'

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
      const response = await apiGet('/api/admin/models', { requireAuth: true })
      return response.json()
    },
  })
}

export function useCreateModel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateModelData) => {
      const response = await apiPost('/api/admin/models', data, { requireAuth: true })
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
      const response = await apiPut(`/api/admin/models/${data.id}`, data, { requireAuth: true })
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
      const response = await apiDelete('/api/admin/models', { ids }, { requireAuth: true })
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
      const response = await apiPost(`/api/admin/models/${modelId}/photos`, { photoUrls }, { requireAuth: true })
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
      const response = await apiDelete(`/api/admin/models/${modelId}/photos?url=${encodeURIComponent(photoUrl)}`, undefined, { requireAuth: true })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
} 