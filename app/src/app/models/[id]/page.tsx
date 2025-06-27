"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModelCard } from "@/components/model-card/model-card"
import { Loader2, ArrowLeft, Phone, Calendar, DollarSign, ImageIcon, Heart, MapPin, Star, Mail, MessageCircle, Clock } from "lucide-react"
import { usePublicModel } from "@/hooks/use-public-models"
import { useContacts } from "@/hooks/use-contacts"
import { cn } from "@/lib/utils"
import ContactForm from "@/components/contact-form"
import OtherModelsSection from "@/components/other-models-section"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModelPage({ params }: PageProps) {
  const resolvedParams = await params
  const modelId = parseInt(resolvedParams.id)
  return <ModelPageContent modelId={modelId} />
}


function ModelPageContent({ modelId }: { modelId: number }) {
  const { data, isLoading, error } = usePublicModel(modelId)
  const { contacts } = useContacts()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  
  const model = data?.model

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Загрузка информации о модели...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Модель не найдена</h1>
            <p className="text-muted-foreground mb-6">
              {error?.message || "Модель с указанным ID не существует или была удалена"}
            </p>
            <Link href="/models">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к каталогу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
                  <Image
                    src={model.photos[selectedPhotoIndex]}
                    alt={`${model.name} - фото ${selectedPhotoIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
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
                      onClick={() => setSelectedPhotoIndex(index)}
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
                    {model.age} лет
                  </Badge>
                  {model.price && (
                    <Badge variant="outline" className="px-4 py-2 text-base border-primary/20">
                      <DollarSign className="h-4 w-4 mr-2" />
                      от {model.price} ₽
                    </Badge>
                  )}
                  <Badge variant="outline" className="px-4 py-2 text-base">
                    <MapPin className="h-4 w-4 mr-2" />
                    Москва
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
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Забронировать встречу
                  </CardTitle>
                  <CardDescription className="text-base">
                    Заполните форму и мы свяжемся с вами в течение 15 минут
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>


      {/* Other Models Section with Lazy Loading */}
      <OtherModelsSection currentModelId={modelId} maxModels={8} />
      
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

            {/* Right Column - Contacts */}
            <Card className="bg-background/95 backdrop-blur-sm border-primary-foreground/20">
              <CardHeader>
                <CardTitle className="text-xl">Или напишите нам сами</CardTitle>
                <CardDescription>
                  Свяжитесь с нами любым удобным способом
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Телефон</p>
                    <a href={`tel:${contacts.phone}`} className="text-primary hover:underline">
                      {contacts.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Telegram</p>
                    <a href={`https://t.me/${contacts.telegram.replace('@', '')}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {contacts.telegram}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a href={`https://wa.me/${contacts.whatsapp.replace(/[^0-9]/g, '')}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {contacts.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${contacts.email}`} className="text-primary hover:underline">
                      {contacts.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Время работы</p>
                    <p className="text-muted-foreground text-sm">{contacts.workingHours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-muted-foreground text-sm">{contacts.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 