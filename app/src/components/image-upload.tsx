"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Upload, X, Plus, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageUploadProps {
  onPhotosChange?: (photos: string[]) => void
  existingPhotos?: string[]
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export default function ImageUpload({
  onPhotosChange,
  existingPhotos = [],
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
}: ImageUploadProps) {
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(existingPhotos)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentPhotos(existingPhotos)
  }, [existingPhotos])

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Тип файла ${file.type} не поддерживается`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Размер файла должен быть меньше ${maxSize}МБ`
    }
    return null
  }

  const uploadFiles = useCallback(async (files: File[]) => {
    if (currentPhotos.length + files.length > maxFiles) {
      setError(`Максимум ${maxFiles} файлов разрешено`)
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      files.forEach(file => {
        const validationError = validateFile(file)
        if (validationError) {
          throw new Error(validationError)
        }
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка загрузки')
      }

      const result = await response.json()
      const newPhotoUrls = result.files.map((file: any) => file.url)
      
      setCurrentPhotos(prev => {
        const updated = [...prev, ...newPhotoUrls]
        onPhotosChange?.(updated)
        return updated
      })
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Ошибка загрузки файлов')
    } finally {
      setIsUploading(false)
    }
  }, [currentPhotos, maxFiles, onPhotosChange])

  const removePhoto = useCallback((photoUrl: string) => {
    setCurrentPhotos(prev => {
      const updated = prev.filter(url => url !== photoUrl)
      onPhotosChange?.(updated)
      return updated
    })
  }, [onPhotosChange])

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      uploadFiles(fileArray)
    },
    [uploadFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFiles(files)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [processFiles],
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading ? openFileDialog : undefined}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isUploading ? 'Загружаем файлы...' : 'Перетащите изображения сюда или нажмите для выбора'}
            </p>
            <p className="text-xs text-muted-foreground">Поддерживает JPEG, PNG, WebP, GIF до {maxSize}МБ каждый</p>
            <p className="text-xs text-muted-foreground">Максимум {maxFiles} файлов</p>
          </div>
          {!isUploading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                openFileDialog()
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Выбрать изображения
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Error Message */}
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      {/* Current Photos */}
      {currentPhotos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Изображения ({currentPhotos.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentPhotos.map((photoUrl, index) => (
              <Card key={`${photoUrl}-${index}`} className="relative group overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={photoUrl}
                      alt={`Изображение ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(photoUrl)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
