const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Инициализация папок с обработкой ошибок
const uploadsDir = path.join(__dirname, 'uploads')
const modelsDir = path.join(uploadsDir, 'models')

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log(`Created uploads directory: ${uploadsDir}`)
  }
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true })
    console.log(`Created models directory: ${modelsDir}`)
  }
} catch (error) {
  console.error('Error creating directories:', error)
  process.exit(1)
}

// Сервим папку models под путем /uploads/models/
app.use('/uploads/models', express.static(modelsDir))

// Настройка multer с максимальной защитой
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Проверяем что папка существует
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true })
      }
      cb(null, modelsDir)
    } catch (error) {
      console.error('Error setting destination:', error)
      cb(error, null)
    }
  },
  filename: (req, file, cb) => {
    try {
      // Проверяем входные данные
      if (!file) {
        return cb(new Error('No file provided'), null)
      }

      const originalName = file.originalname || 'image'
      const ext = path.extname(originalName) || '.jpg'
      
      // Валидируем расширение
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']
      if (!allowedExts.includes(ext.toLowerCase())) {
        return cb(new Error(`Invalid file extension: ${ext}`), null)
      }
      
      let filename
      if (originalName === 'blob' || !originalName || originalName.length < 2) {
        // Генерируем безопасное имя для blob файлов
        const hash = crypto.createHash('md5')
          .update(Date.now() + Math.random().toString())
          .digest('hex')
          .substring(0, 16)
        filename = `${hash}${ext}`
      } else {
        // Очищаем имя файла от опасных символов
        const safeName = path.basename(originalName, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .substring(0, 50) // Ограничиваем длину
        const timestamp = Date.now()
        filename = `${safeName}_${timestamp}${ext}`
      }
      
      // Проверяем что файл с таким именем не существует
      const filePath = path.join(modelsDir, filename)
      if (fs.existsSync(filePath)) {
        const hash = crypto.createHash('md5')
          .update(filename + Date.now())
          .digest('hex')
          .substring(0, 8)
        const nameWithoutExt = path.basename(filename, ext)
        filename = `${nameWithoutExt}_${hash}${ext}`
      }
      
      console.log(`Generated filename: ${filename}`)
      cb(null, filename)
    } catch (error) {
      console.error('Error generating filename:', error)
      cb(error, null)
    }
  }
})

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    try {
      // Проверяем MIME тип
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 
        'image/webp', 'image/gif', 'image/bmp', 'image/tiff'
      ]
      
      if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid MIME type: ${file.mimetype}`), false)
      }
      
      cb(null, true)
    } catch (error) {
      console.error('Error in file filter:', error)
      cb(error, false)
    }
  }
})

// Загрузка одного файла с максимальной защитой
app.post('/upload', (req, res) => {
  const uploadSingle = upload.single('image')
  
  uploadSingle(req, res, (err) => {
    try {
      if (err) {
        console.error('Multer error:', err)
        
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              error: 'Файл слишком большой (максимум 10MB)',
              code: 'FILE_TOO_LARGE'
            })
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
              error: 'Неожиданное поле файла',
              code: 'UNEXPECTED_FIELD'
            })
          }
        }
        
        return res.status(400).json({ 
          error: err.message || 'Ошибка загрузки файла',
          code: 'UPLOAD_ERROR'
        })
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: 'Файл не найден в запросе',
          code: 'NO_FILE'
        })
      }

      // Проверяем что файл действительно сохранился
      const filePath = path.join(modelsDir, req.file.filename)
      if (!fs.existsSync(filePath)) {
        console.error('File was not saved:', filePath)
        return res.status(500).json({ 
          error: 'Файл не был сохранен',
          code: 'SAVE_FAILED'
        })
      }

      const publicUrl = `/uploads/models/${req.file.filename}`
      
      console.log(`File uploaded successfully: ${req.file.filename}`)
      
      res.json({
        success: true,
        message: 'Файл успешно загружен',
        filename: req.file.filename,
        url: publicUrl,
        size: req.file.size,
        originalName: req.file.originalname
      })
    } catch (error) {
      console.error('Error in upload handler:', error)
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        code: 'INTERNAL_ERROR'
      })
    }
  })
})

// Получение файла по названию с защитой
app.get('/uploads/models/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    
    // Валидация имени файла
    if (!filename || filename.length < 1 || filename.length > 255) {
      return res.status(400).json({ 
        error: 'Некорректное имя файла',
        code: 'INVALID_FILENAME'
      })
    }
    
    // Проверяем на path traversal атаки
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ 
        error: 'Недопустимые символы в имени файла',
        code: 'INVALID_CHARACTERS'
      })
    }
    
    const filePath = path.join(modelsDir, filename)
    
    // Проверяем что файл находится в допустимой директории
    if (!filePath.startsWith(modelsDir)) {
      return res.status(400).json({ 
        error: 'Недопустимый путь к файлу',
        code: 'INVALID_PATH'
      })
    }
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.status(404).json({ 
        error: 'Файл не найден',
        code: 'FILE_NOT_FOUND'
      })
    }
  } catch (error) {
    console.error('Error serving file:', error)
    res.status(500).json({ 
      error: 'Ошибка получения файла',
      code: 'SERVE_ERROR'
    })
  }
})

// Глобальная обработка ошибок
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  res.status(500).json({ 
    error: 'Внутренняя ошибка сервера',
    code: 'GLOBAL_ERROR'
  })
})

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Эндпоинт не найден',
    code: 'NOT_FOUND'
  })
})

// Запуск сервера с обработкой ошибок
try {
  app.listen(PORT, () => {
    console.log(`Image server running on port ${PORT}`)
    console.log(`Uploads directory: ${uploadsDir}`)
    console.log(`Models directory: ${modelsDir}`)
    console.log(`Images available at: /uploads/models/`)
    console.log('Server started successfully!')
  })
} catch (error) {
  console.error('Error starting server:', error)
  process.exit(1)
}