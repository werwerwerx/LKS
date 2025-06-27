import { useQuery } from "@tanstack/react-query"

interface PublicModel {
  id: number
  name: string
  age: number
  description?: string
  price?: string
  created_at: string
  updated_at: string
  photos: string[]
}

interface PublicModelsResponse {
  models: PublicModel[]
}

interface PublicModelResponse {
  model: PublicModel
}

export function usePublicModels() {
  return useQuery<PublicModelsResponse>({
    queryKey: ["publicModels"],
    queryFn: async () => {
      const response = await fetch("/api/models")
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network error" }))
        throw new Error(errorData.error || "Ошибка загрузки моделей")
      }
      
      return response.json()
    }
  })
}

export function usePublicModel(id: number) {
  return useQuery<PublicModelResponse>({
    queryKey: ["publicModel", id],
    queryFn: async () => {
      const response = await fetch(`/api/models/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network error" }))
        throw new Error(errorData.error || "Ошибка загрузки модели")
      }
      
      return response.json()
    },
    enabled: !!id
  })
} 