"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Calendar, ImageIcon, MapPin, Star, MessageCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import SimpleContactForm from "@/components/simple-contact-form"
import OtherModelsSection from "@/components/other-models-section"
import type { Model } from "@/lib/get-models"
import type { SiteSettings } from "@/lib/get-site-settings"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import type { Swiper as SwiperType } from "swiper"

interface ModelPageContentProps {
  model: Model
  settings: SiteSettings
}

export function ModelPageContent({ model, settings }: ModelPageContentProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-muted/20 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/models">
            <Button variant="outline" className="mb-8 hover:bg-primary/5">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к каталогу
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <div className="space-y-6">
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-muted shadow-2xl">
                {model.photos.length > 0 ? (
                  <>
                    <Swiper
                      modules={[Pagination]}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      onSlideChange={swiper => setSelectedPhotoIndex(swiper.activeIndex)}
                      onSwiper={swiper => { swiperRef.current = swiper }}
                      loop={true}
                      initialSlide={selectedPhotoIndex}
                      className="w-full h-full"
                    >
                      {model.photos.map((src, index) => (
                        <SwiperSlide key={index}>
                          <Image
                            src={src}
                            alt={`${model.name} - фото ${index + 1}`}
                            fill
                            className="object-contain transition-all duration-300"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={index === 0}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {model.photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 rounded-full p-2 shadow-md border border-border transition disabled:opacity-40"
                          onClick={() => swiperRef.current && swiperRef.current.slideTo((selectedPhotoIndex - 1 + model.photos.length) % model.photos.length)}
                          disabled={model.photos.length <= 1}
                          tabIndex={0}
                        >
                          <ArrowLeft className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 rounded-full p-2 shadow-md border border-border transition disabled:opacity-40"
                          onClick={() => swiperRef.current && swiperRef.current.slideTo((selectedPhotoIndex + 1) % model.photos.length)}
                          disabled={model.photos.length <= 1}
                          tabIndex={0}
                        >
                          <ArrowRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  {selectedPhotoIndex + 1} / {model.photos.length || 1}
                </div>
              </div>

              {model.photos.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {model.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => swiperRef.current && swiperRef.current.slideTo(index)}
                      className={cn(
                        "aspect-square relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        selectedPhotoIndex === index 
                          ? "border-primary shadow-lg" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Image
                        src={photo}
                        alt={`${model.name} - миниатюра ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 25vw, 16vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Model Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>Премиум модель</span>
                </div>
                
                <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {model.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="px-4 py-2 text-base">
                    <Calendar className="h-4 w-4 mr-2" />
                    Возраст: {model.age} 
                  </Badge>
                  {model.price && (
                    <Badge variant="outline" className="px-4 py-2 text-base border-primary/20">
                      от {model.price} ₽
                    </Badge>
                  )}
                  <Badge variant="outline" className="px-4 py-2 text-base">
                    <MapPin className="h-4 w-4 mr-2" />
                    {settings.city}
                  </Badge>
                </div>
              </div>

              {model.description && (
                <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30">
                  <CardHeader>
                    <CardTitle className="text-xl">О модели</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {model.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="text-xl">Выберите способ связи</CardTitle>
                  <CardDescription className="text-base">
                    Свяжитесь с моделью удобным способом
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <button 
                    onClick={() => window.open(`https://t.me/${settings.telegram.replace('@', '')}`, '_blank')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Telegram</p>
                      <p className="text-sm text-muted-foreground">Напишите ей в мессенджер</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = `tel:${settings.phone}`}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Позвонить</p>
                      <p className="text-sm text-muted-foreground">Обсудите встречу по телефону</p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>


      {/* Other Models Section with Lazy Loading */}
      <OtherModelsSection currentModelId={model.id} maxModels={8} />
      
      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - CTA */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Понравилась модель?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Не упустите возможность провести время с одной из лучших моделей нашего агентства
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Phone className="h-5 w-5 mr-2" />
                  Связаться сейчас
                </Button>
                <Link href="/models">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Посмотреть других моделей
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <Card className="bg-background/95 backdrop-blur-sm border-primary-foreground/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Забронировать встречу
                </CardTitle>
                <CardDescription>
                  Заполните форму и мы свяжемся с вами в течение 15 минут
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 