import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { createHash } from 'crypto'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Файлы не найдены' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Файл ${file.name} не является изображением` },
          { status: 400 }
        )
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Файл ${file.name} превышает максимальный размер 5MB` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const hash = createHash('sha256')
      hash.update(buffer)
      const fileHash = hash.digest('hex').substring(0, 16)

      const extension = path.extname(file.name)
      const fileName = `${fileHash}${extension}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'models', fileName)

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
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки файлов' },
      { status: 500 }
    )
  }
} 