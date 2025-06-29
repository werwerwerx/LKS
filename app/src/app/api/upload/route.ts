import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { createHash } from 'crypto'
import path from 'path'
import { existsSync } from 'fs'
import { verifyAdminToken } from '@/lib/auth-middleware'
import sharp from 'sharp'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/bmp'
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif', '.bmp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB после сжатия

export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request)
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Файлы не найдены' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'models')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Проверяем тип файла
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Неподдерживаемый тип файла: ${file.type}. Поддерживаются: JPG, PNG, WebP, AVIF, TIFF, BMP` },
          { status: 400 }
        )
      }

      // Определяем расширение
      let extension = path.extname(file.name).toLowerCase()
      if (!extension) {
        // Если расширения нет, определяем по mime-type
        switch (file.type) {
          case 'image/jpeg':
          case 'image/jpg':
            extension = '.jpg'
            break
          case 'image/png':
            extension = '.png'
            break
          case 'image/webp':
            extension = '.webp'
            break
          case 'image/avif':
            extension = '.avif'
            break
          case 'image/tiff':
            extension = '.tiff'
            break
          case 'image/bmp':
            extension = '.bmp'
            break
          default:
            extension = '.jpg'
        }
      }

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(
          { error: `Недопустимое расширение файла: ${extension}` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const originalBuffer = Buffer.from(bytes)

      // Обрабатываем изображение с помощью Sharp
      let processedBuffer: Buffer
      let outputExtension = extension

      try {
        let sharpInstance = sharp(originalBuffer)
        
        // Получаем метаданные изображения
        const metadata = await sharpInstance.metadata()
        
        // Ограничиваем максимальные размеры (например, 2048px по большей стороне)
        const maxDimension = 2048
        if (metadata.width && metadata.height) {
          if (metadata.width > maxDimension || metadata.height > maxDimension) {
            sharpInstance = sharpInstance.resize(maxDimension, maxDimension, {
              fit: 'inside',
              withoutEnlargement: true
            })
          }
        }

        // Выбираем оптимальный формат и качество
        if (extension === '.png') {
          processedBuffer = await sharpInstance
            .png({ quality: 85, compressionLevel: 9 })
            .toBuffer()
          outputExtension = '.png'
        } else if (extension === '.webp') {
          processedBuffer = await sharpInstance
            .webp({ quality: 85, effort: 6 })
            .toBuffer()
          outputExtension = '.webp'
        } else if (extension === '.avif') {
          processedBuffer = await sharpInstance
            .avif({ quality: 85, effort: 4 })
            .toBuffer()
          outputExtension = '.avif'
        } else {
          // Для всех остальных форматов конвертируем в JPEG
          processedBuffer = await sharpInstance
            .jpeg({ quality: 85, progressive: true })
            .toBuffer()
          outputExtension = '.jpg'
        }

        // Проверяем размер после сжатия
        if (processedBuffer.length > MAX_FILE_SIZE) {
          // Если файл все еще слишком большой, снижаем качество
          if (outputExtension === '.jpg') {
            processedBuffer = await sharp(originalBuffer)
              .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 70, progressive: true })
              .toBuffer()
          } else if (outputExtension === '.webp') {
            processedBuffer = await sharp(originalBuffer)
              .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 70, effort: 6 })
              .toBuffer()
          } else if (outputExtension === '.png') {
            processedBuffer = await sharp(originalBuffer)
              .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
              .png({ quality: 70, compressionLevel: 9 })
              .toBuffer()
          }

          // Если все еще слишком большой, возвращаем ошибку
          if (processedBuffer.length > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: `Файл ${file.name} слишком большой даже после сжатия (максимум 5MB)` },
              { status: 400 }
            )
          }
        }

      } catch (imageError) {
        console.error('Image processing error:', imageError)
        return NextResponse.json(
          { error: `Ошибка обработки изображения ${file.name}: ${imageError}` },
          { status: 400 }
        )
      }

      // Создаем хеш для имени файла
      const hash = createHash('sha256')
      hash.update(processedBuffer)
      const fileHash = hash.digest('hex').substring(0, 16)

      const fileName = `${fileHash}${outputExtension}`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, processedBuffer)

      const publicUrl = `/uploads/models/${fileName}`
      uploadedFiles.push({
        originalName: file.name,
        fileName,
        url: publicUrl,
        size: processedBuffer.length,
        originalSize: file.size,
        type: `image/${outputExtension.slice(1)}`,
        compressed: processedBuffer.length < originalBuffer.length
      })
    }

    return NextResponse.json({
      message: 'Файлы успешно загружены и обработаны',
      files: uploadedFiles
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файлов' },
      { status: 500 }
    )
  }
} 