import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    await verifyAdminToken(request)
    
    // Проверка наличия formData
    let formData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('Error parsing form data:', error)
      return NextResponse.json(
        { error: 'Ошибка обработки формы' },
        { status: 400 }
      )
    }
    
    const files = formData.getAll('files') as File[]

    // Валидация файлов
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Файлы не найдены' },
        { status: 400 }
      )
    }

    // Проверка количества файлов
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Слишком много файлов (максимум 10)' },
        { status: 400 }
      )
    }

    const uploadedFiles = []
    const errors = []

    // Обработка каждого файла отдельно
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Валидация файла
        if (!file || !file.name) {
          errors.push(`Файл ${i + 1}: некорректный файл`)
          continue
        }

        if (file.size === 0) {
          errors.push(`Файл ${file.name}: пустой файл`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.push(`Файл ${file.name}: слишком большой (максимум 10MB)`)
          continue
        }

        // Проверка типа файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']
        if (!file.type || !allowedTypes.includes(file.type)) {
          errors.push(`Файл ${file.name}: неподдерживаемый тип (${file.type})`)
          continue
        }

        // Подготовка данных для отправки
        const uploadFormData = new FormData()
        uploadFormData.append('image', file, file.name)
        uploadFormData.append('filename', file.name)

        const imageServerUrl = 'http://127.0.0.1:5000'
        let response
        
        try {
          // Отправка на image-server с таймаутом
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 секунд

          response = await fetch(`${imageServerUrl}/upload`, {
            method: 'POST',
            body: uploadFormData,
            signal: controller.signal
          })

          clearTimeout(timeoutId)
        } catch (fetchError) {
          console.error(`Fetch error for file ${file.name}:`, fetchError)
          
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            errors.push(`Файл ${file.name}: тайм-аут загрузки`)
          } else if (fetchError instanceof Error && 'code' in fetchError && fetchError.code === 'ECONNREFUSED') {
            errors.push(`Файл ${file.name}: сервер изображений недоступен`)
          } else {
            errors.push(`Файл ${file.name}: ошибка сети`)
          }
          continue
        }

        // Проверка статуса ответа
        if (!response) {
          errors.push(`Файл ${file.name}: отсутствует ответ от сервера`)
          continue
        }

        let result
        try {
          result = await response.json()
        } catch (jsonError) {
          console.error(`JSON parse error for file ${file.name}:`, jsonError)
          errors.push(`Файл ${file.name}: некорректный ответ сервера`)
          continue
        }

        if (!response.ok) {
          console.error(`Upload failed for file ${file.name}:`, result)
          
          // Обработка специфических ошибок от image-server
          const errorMessage = result.error || 'Неизвестная ошибка'
          const errorCode = result.code || 'UNKNOWN'
          
          switch (errorCode) {
            case 'FILE_TOO_LARGE':
              errors.push(`Файл ${file.name}: слишком большой`)
              break
            case 'INVALID_FILENAME':
              errors.push(`Файл ${file.name}: некорректное имя`)
              break
            case 'INVALID_CHARACTERS':
              errors.push(`Файл ${file.name}: недопустимые символы в имени`)
              break
            case 'SAVE_FAILED':
              errors.push(`Файл ${file.name}: ошибка сохранения на сервере`)
              break
            case 'NO_FILE':
              errors.push(`Файл ${file.name}: файл не получен сервером`)
              break
            default:
              errors.push(`Файл ${file.name}: ${errorMessage}`)
          }
          continue
        }

        // Валидация успешного результата
        if (!result.success || !result.filename || !result.url) {
          console.error(`Invalid result for file ${file.name}:`, result)
          errors.push(`Файл ${file.name}: некорректный ответ сервера`)
          continue
        }

        // Добавляем в список успешных
        uploadedFiles.push({
          originalName: file.name,
          filename: result.filename,
          url: result.url,
          size: result.size || file.size,
          success: true
        })

        console.log(`Successfully uploaded: ${file.name} -> ${result.filename}`)

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        errors.push(`Файл ${file.name}: внутренняя ошибка обработки`)
      }
    }

    // Формирование ответа
    const hasSuccessfulUploads = uploadedFiles.length > 0
    const hasErrors = errors.length > 0

    if (!hasSuccessfulUploads && hasErrors) {
      // Все файлы с ошибками
      return NextResponse.json(
        { 
          error: 'Ни один файл не был загружен',
          details: errors,
          files: []
        },
        { status: 400 }
      )
    }

    if (hasSuccessfulUploads && hasErrors) {
      // Частичный успех
      return NextResponse.json({
        message: `Загружено ${uploadedFiles.length} из ${files.length} файлов`,
        files: uploadedFiles,
        errors: errors,
        partial: true
      }, { status: 207 }) // Multi-Status
    }

    if (hasSuccessfulUploads && !hasErrors) {
      // Полный успех
      return NextResponse.json({
        message: 'Все файлы успешно загружены',
        files: uploadedFiles,
        success: true
      })
    }

    // Неожиданный случай
    return NextResponse.json(
      { error: 'Неожиданная ошибка обработки' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Global error in upload route:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Недостаточно прав доступа" }, 
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        message: 'Попробуйте позже или обратитесь к администратору'
      },
      { status: 500 }
    )
  }
} 