"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import { useRef, useCallback, useState } from "react"
import type { Swiper as SwiperType } from "swiper"
import { useRouter } from "next/navigation"

import "swiper/css"
import "swiper/css/pagination"

export interface IModelCardProps {
  imgSrc: string[]
  name: string
  age: number
  modelId?: number
  goToModelButton?: React.ReactNode
}

const PlaceholderImage = () => (
  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
    <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
  </div>
)

export function ModelCard({
  imgSrc,
  name,
  age,
  modelId,
  goToModelButton,
  ...props
}: IModelCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const router = useRouter()

  const images = imgSrc?.filter(src => src && typeof src === 'string') || []
  const hasValidImages = images.length > 0

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper
  }, [])

  const handleNavigate = useCallback(async (href: string) => {
    setIsLoading(true)
    try {
      router.push(href)
      setTimeout(() => setIsLoading(false), 1000)
    } catch (error) {
      setIsLoading(false)
    }
  }, [router])

  const handleImageError = useCallback((index: number) => {
    console.warn(`Image loading error at index ${index}`)
    setImageErrors(prev => new Set(prev).add(index))
  }, [])

  const renderImage = (src: string, index: number, alt: string) => {
    if (imageErrors.has(index)) {
      return <PlaceholderImage />
    }

    const imageUrl = src.startsWith('http') ? src : src.startsWith('/') ? src : `/${src}`

    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={index === 0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
        loading={index === 0 ? "eager" : "lazy"}
        onError={() => handleImageError(index)}
        onLoadingComplete={(result) => {
          if (result.naturalWidth === 0) {
            handleImageError(index)
          } else if (imageErrors.has(index)) {
            setImageErrors(prev => {
              const newSet = new Set(prev)
              newSet.delete(index)
              return newSet
            })
          }
        }}
      />
    )
  }

  const defaultButton = modelId ? (
    <Button
      variant="default"
      size="lg"
      disabled={isLoading}
      onClick={() => handleNavigate(`/models/${modelId}`)}
      className="rounded-full px-5 py-2 text-sm font-medium bg-white/90 text-black hover:bg-white transition-colors duration-300 backdrop-blur-sm shadow-lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Загрузка...
        </>
      ) : (
        <>
          Подробнее
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  ) : null

  if (!name || age === undefined) {
    return null
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer" {...props}>
      {!hasValidImages ? (
        <PlaceholderImage />
      ) : images.length > 1 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          onSwiper={handleSwiperInit}
          className="w-full h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <div className="relative w-full h-full">
                {renderImage(src, index, `${name} - фото ${index + 1}`)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="relative w-full h-full">
          {renderImage(images[0], 0, `${name} - фото`)}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex justify-between items-end">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-1 drop-shadow-lg">{name}</h3>
            <p className="text-lg text-white/90 font-medium">Возраст: {age}</p>
          </div>
          <div className="ml-4">{goToModelButton || defaultButton}</div>
        </div>
      </div>

      {hasValidImages && images.length > 1 && (
        <style jsx global>{`
          .swiper-pagination {
            top: 20px !important;
            left: 20px !important;
            bottom: auto !important;
            width: auto !important;
            text-align: left !important;
          }
          
          .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            background: rgba(255, 255, 255, 0.4) !important;
            border-radius: 50% !important;
            margin: 0 4px !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
            opacity: 1 !important;
          }
          
          .swiper-pagination-bullet-active {
            background: rgba(255, 255, 255, 0.9) !important;
            transform: scale(1.2) !important;
          }
        `}</style>
      )}
    </div>
  )
} 