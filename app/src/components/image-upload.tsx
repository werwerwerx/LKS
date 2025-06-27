"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface ImageUploadProps {
  onFilesChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export default function ImageUpload({
  onFilesChange,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Тип файла ${file.type} не поддерживается`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Размер файла должен быть меньше ${maxSize}МБ`
    }
    return null
  }

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const validFiles: UploadedFile[] = []
      let errorMessage = ""

      if (uploadedFiles.length + fileArray.length > maxFiles) {
        errorMessage = `Максимум ${maxFiles} файлов разрешено`
        setError(errorMessage)
        return
      }

      fileArray.forEach((file) => {
        const validationError = validateFile(file)
        if (validationError) {
          errorMessage = validationError
          return
        }

        const id = Math.random().toString(36).substring(7)
        const preview = URL.createObjectURL(file)
        validFiles.push({ file, preview, id })
      })

      if (errorMessage) {
        setError(errorMessage)
        return
      }

      setError("")
      const newFiles = [...uploadedFiles, ...validFiles]
      setUploadedFiles(newFiles)
      onFilesChange?.(newFiles.map((f) => f.file))
    },
    [uploadedFiles, maxFiles, maxSize, acceptedTypes, onFilesChange],
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
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [processFiles],
  )

  const removeFile = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => {
        const updated = prev.filter((file) => file.id !== id)
        onFilesChange?.(updated.map((f) => f.file))
        return updated
      })
      setError("")
    },
    [onFilesChange],
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
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Перетащите изображения сюда или нажмите для выбора</p>
            <p className="text-xs text-muted-foreground">Поддерживает JPEG, PNG, WebP, GIF до {maxSize}МБ каждый</p>
            <p className="text-xs text-muted-foreground">Максимум {maxFiles} файлов</p>
          </div>
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
      />

      {/* Error Message */}
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Загруженные изображения ({uploadedFiles.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="relative group overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={uploadedFile.preview || "/placeholder.svg"}
                      alt={uploadedFile.file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(uploadedFile.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add More Button */}
      {uploadedFiles.length > 0 && uploadedFiles.length < maxFiles && (
        <Button type="button" variant="outline" onClick={openFileDialog} className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Добавить еще изображения ({uploadedFiles.length}/{maxFiles})
        </Button>
      )}
    </div>
  )
}
