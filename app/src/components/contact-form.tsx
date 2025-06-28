"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import { onSubmitForm } from "@/shared/on-submit-form"
import type { SiteSettings } from "@/lib/get-site-settings"

interface ContactFormProps {
  settings: SiteSettings
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    privacy: false
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    privacy: ""
  })

  const validateName = (name: string): string => {
    if (!name.trim()) return "Имя обязательно"
    if (name.trim().length < 2) return "Имя должно содержать минимум 2 символа"
    if (name.trim().length > 50) return "Имя не должно превышать 50 символов"
    if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name.trim())) return "Имя должно содержать только буквы"
    return ""
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Номер телефона обязателен"
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    if (!/^[\+]?[1-9][\d]{9,14}$/.test(cleanPhone)) return "Введите корректный номер телефона"
    return ""
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === "name" && typeof value === "string") {
      const error = validateName(value)
      setErrors(prev => ({ ...prev, name: error }))
    }
    
    if (field === "phone" && typeof value === "string") {
      const error = validatePhone(value)
      setErrors(prev => ({ ...prev, phone: error }))
    }
    
    if (field === "privacy") {
      setErrors(prev => ({ ...prev, privacy: value ? "" : "Необходимо согласие на обработку данных" }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const nameError = validateName(formData.name)
    const phoneError = validatePhone(formData.phone)
    const privacyError = !formData.privacy ? "Необходимо согласие на обработку данных" : ""

    setErrors({
      name: nameError,
      phone: phoneError,
      privacy: privacyError
    })

    if (nameError || phoneError || privacyError) {
      e.preventDefault()
      return
    }

    onSubmitForm(e)
  }

  return (
    <section className="w-full my-20">
      <div className="flex justify-center w-full container mx-auto">
        <div className="flex justify-end">
          <div className="w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary rounded-lg p-3 lg:p-4">
                <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight text-start">
              ОСТАЛИСЬ ВОПРОСЫ?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 lg:mb-12 font-normal text-start">
              Наши менеджеры с удовольствием ответят на них
            </p>
            
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="text-muted-foreground text-start block mb-2">Ваше имя</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ваше имя"
                  className={`h-12 text-base bg-transparent border-muted text-foreground placeholder:text-muted-foreground rounded-lg ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="text-muted-foreground text-start block mb-2">Номер телефона</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className={`h-12 text-base bg-transparent border-muted text-foreground placeholder:text-muted-foreground rounded-lg ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="flex items-start space-x-3 pt-3">
                <Checkbox 
                  id="privacy" 
                  className={`border-muted w-5 h-5 mt-1 ${errors.privacy ? "border-red-500" : ""}`}
                  checked={formData.privacy}
                  onCheckedChange={(checked) => handleInputChange("privacy", checked === true)}
                  required 
                />
                <label htmlFor="privacy" className="text-primary text-base cursor-pointer text-start">
                  Соглашаюсь с политикой обработки данных
                </label>
              </div>
              {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}

              <Button className="w-full h-12" type="submit">
                ОТПРАВИТЬ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
