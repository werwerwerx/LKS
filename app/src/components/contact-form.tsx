"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle } from "lucide-react"
import { onSubmitForm } from "@/shared/on-submit-form"
import type { SiteSettings } from "@/lib/get-site-settings"
import { ContactFormSchema } from "@/lib/validations"
import { z } from "zod"

interface ContactFormProps {
  settings: SiteSettings
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  })

  const validateField = (field: keyof typeof formData, value: string | boolean): string => {
    try {
      if (field === "name" && typeof value === "string") {
        ContactFormSchema.shape.name.parse(value)
      } else if (field === "phone" && typeof value === "string") {
        ContactFormSchema.shape.phone.parse(value)
      }
      return ""
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message
      }
      return "Ошибка валидации"
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const nameError = validateField("name", formData.name)
    const phoneError = validateField("phone", formData.phone)

    setErrors({
      name: nameError,
      phone: phoneError
    })

    if (nameError || phoneError) {
      e.preventDefault()
      return
    }

    onSubmitForm(e)
  }

  return (
    <section className="w-full">
      <div className="flex justify-center w-full container mx-auto max-w-7xl px-6">
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
                <label className="text-primary text-base cursor-pointer text-start">
                  Отправляя заявку, я соглашаюсь с политикой обработки данных
                </label>
              </div>

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
