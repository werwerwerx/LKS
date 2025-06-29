import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { createHash } from 'crypto'
import path from 'path'
import { existsSync } from 'fs'
import { verifyAdminToken } from '@/lib/auth-middleware'

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

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
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Файл ${file.name} не является изображением` },
          { status: 400 }
        )
      }

      const extension = path.extname(file.name).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(
          { error: `Недопустимое расширение файла: ${extension}` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const hash = createHash('sha256')
      hash.update(buffer)
      const fileHash = hash.digest('hex').substring(0, 16)

      const fileName = `${fileHash}${extension}`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)

      const publicUrl = `/uploads/models/${fileName}`
      uploadedFiles.push({
        originalName: file.name,
        fileName,
        url: publicUrl,
        size: file.size,
        type: file.type
      })
    }

    return NextResponse.json({
      message: 'Файлы успешно загружены',
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