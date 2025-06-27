"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import { useRef, useCallback } from "react"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/pagination"

export interface IModelCardProps {
  imgSrc: string[]
  name: string
  age: number
  goToModelButton?: React.ReactNode
}

export function ModelCard({
  imgSrc,
  name,
  age,
  goToModelButton,
  ...props
}: IModelCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const swiperRef = useRef<SwiperType | null>(null)

  const images = imgSrc?.length > 0 ? imgSrc : ["/placeholder.svg"]

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper
  }, [])

  const defaultButton = (
    <Button
      variant="default"
      size="lg"
      className="rounded-full px-5 py-2 text-sm font-medium bg-white/90 text-black hover:bg-white transition-colors duration-300 backdrop-blur-sm shadow-lg"
    >
      Увидеть больше
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  )

  if (!name || age === undefined) {
    return null
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer" {...props}>
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={images.length > 1}
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
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`${name} - фото ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex justify-between items-end">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-1 drop-shadow-lg">{name}</h3>
            <p className="text-lg text-white/90 font-medium">Возраст:{age}</p>
          </div>
          <div className="ml-4">{goToModelButton || defaultButton}</div>
        </div>
      </div>

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
        
        .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.7) !important;
          transform: scale(1.1) !important;
        }
      `}</style>
    </div>
  )
} 