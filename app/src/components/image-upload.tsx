"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Upload, X, Plus, Loader2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { apiUpload } from "@/lib/api-client"
import imageCompression from 'browser-image-compression'

interface ImageUploadProps {
  onPhotosChange?: (photos: string[]) => void
  existingPhotos?: string[]
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadProgress {
  progress: number
  fileName: string
}

export default function ImageUpload({
  onPhotosChange,
  existingPhotos = [],
  maxFiles = Number.POSITIVE_INFINITY,
  maxSize = Number.POSITIVE_INFINITY,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
}: ImageUploadProps) {
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(existingPhotos)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentPhotos(existingPhotos)
  }, [existingPhotos])

  useEffect(() => {
    onPhotosChange?.(currentPhotos)
  }, [currentPhotos, onPhotosChange])

  const addError = (error: string) => {
    setErrors(prev => [...prev, error])
  }

  const clearErrors = () => {
    setErrors([])
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Файл "${file.name}" имеет неподдерживаемый тип (${file.type})`
    }
    return null
  }

  const compressImages = async (files: File[], maxSizeMB: number, maxWidthOrHeight: number) => {
    const compressedFiles: File[] = []
    for (const file of files) {
      let options: any = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true
      }
      if (file.type === 'image/png') {
        options.fileType = 'image/jpeg'
        options.initialQuality = 0.8
      }
      if (file.type === 'image/jpeg' || file.type === 'image/webp') {
        options.initialQuality = 0.8
      }
      const compressed = await imageCompression(file, options)
      if (compressed.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Файл "${file.name}" после сжатия всё равно больше ${maxSizeMB} МБ`)
      }
      compressedFiles.push(compressed)
    }
    return compressedFiles
  }

  const uploadFiles = useCallback(async (files: File[]) => {
    setIsUploading(true)
    clearErrors()

    // Валидация всех файлов перед загрузкой
    const validationErrors: string[] = []
    const validFiles: File[] = []

    files.forEach(file => {
      const validationError = validateFile(file)
      if (validationError) {
        validationErrors.push(validationError)
      } else {
        validFiles.push(file)
      }
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsUploading(false)
      return
    }

    // Инициализация прогресса загрузки
    setUploadProgress(validFiles.map(file => ({ 
      progress: 0, 
      fileName: file.name 
    })))

    try {
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('files', file)
      })

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev.map(item => ({
          ...item,
          progress: Math.min(item.progress + Math.random() * 30, 90)
        })))
      }, 200)

      const response = await apiUpload('/api/upload', formData)
      
      clearInterval(progressInterval)
      
      setUploadProgress(prev => prev.map(item => ({
        ...item,
        progress: 100
      })))

      const result = await response.json()
      const newPhotoUrls = result.files.map((file: any) => file.url)
      
      setCurrentPhotos(prev => [...prev, ...newPhotoUrls])

      setTimeout(() => {
        setUploadProgress([])
        setIsProcessing(false)
      }, 1000)

    } catch (error) {
      console.error('Upload error:', error)
      addError(error instanceof Error ? error.message : 'Ошибка загрузки файлов')
      setIsProcessing(false)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const removePhoto = useCallback((photoUrl: string) => {
    setCurrentPhotos(prev => prev.filter(url => url !== photoUrl))
  }, [])

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setIsProcessing(true)
      const fileArray = Array.from(files)
      let compressedFiles = fileArray
      try {
        compressedFiles = await compressImages(
          fileArray,
          maxSize !== Number.POSITIVE_INFINITY ? Math.min(maxSize, 0.95) : 0.95,
          3000
        )
      } catch (e) {
        addError(e instanceof Error ? e.message : 'Ошибка сжатия изображений')
        setIsProcessing(false)
        return
      }
      for (const file of compressedFiles) {
        if (file.size > (maxSize !== Number.POSITIVE_INFINITY ? Math.min(maxSize, 0.95) : 0.95) * 1024 * 1024) {
          addError(`Файл "${file.name}" слишком большой даже после сжатия`)
          setIsProcessing(false)
          return
        }
      }
      uploadFiles(compressedFiles)
    },
    [uploadFiles, maxSize],
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

  const remainingSlots = Number.POSITIVE_INFINITY

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium text-red-800 dark:text-red-200">Ошибки загрузки:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {(isProcessing || uploadProgress.length > 0) && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/50">
          <CardContent className="p-4 space-y-3">
            {isProcessing && uploadProgress.length === 0 ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Подготовка файлов к загрузке...
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Загрузка файлов...
                </p>
                {uploadProgress.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300">
                      <span className="truncate">{item.fileName}</span>
                      <span>{Math.round(item.progress)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          (isUploading || isProcessing) && "opacity-50 cursor-not-allowed",
          remainingSlots === 0 && "opacity-40 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading && !isProcessing && remainingSlots > 0 ? openFileDialog : undefined}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4">
            {(isUploading || isProcessing) ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <Upload className={cn(
                "h-10 w-10",
                remainingSlots === 0 ? "text-muted-foreground/50" : "text-muted-foreground"
              )} />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {(isUploading || isProcessing)
                ? isProcessing && uploadProgress.length === 0 
                  ? 'Обрабатываем файлы...'
                  : 'Загружаем файлы...'
                : remainingSlots === 0 
                  ? 'Достигнуто максимальное количество файлов'
                  : 'Перетащите изображения сюда или нажмите для выбора'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              Поддерживает JPEG, PNG, WebP, GIF
            </p>
          </div>
          {!isUploading && !isProcessing && remainingSlots > 0 && (
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
        disabled={isUploading || isProcessing || remainingSlots === 0}
      />

      {/* Current Photos */}
      {currentPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Загруженные изображения ({currentPhotos.length}/{maxFiles})
            </h3>
            {currentPhotos.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPhotos([])}
                disabled={isUploading || isProcessing}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Удалить все
              </Button>
            )}
          </div>
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
                        disabled={isUploading || isProcessing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
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
