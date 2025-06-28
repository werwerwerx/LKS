import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lks-models.ru'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/*',
        '/api/*',
        '/login',
        '/uploads/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
} 