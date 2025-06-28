"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContactFormSchema } from "@/lib/validations"
import { z } from "zod"
import { onSubmitForm } from "@/shared/on-submit-form"

interface SimpleContactFormProps {
  buttonText?: string
  namePlaceholder?: string
  phonePlaceholder?: string
  privacyText?: string
}

export default function SimpleContactForm({ 
  buttonText = "Отправить заявку",
  namePlaceholder = "Ваше имя",
  phonePlaceholder = "+7 (999) 123-45-67",
  privacyText = "Отправляя заявку, я соглашаюсь с политикой обработки данных"
}: SimpleContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: ""
  })

  const validateField = (field: keyof typeof formData, value: string): string => {
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Input
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={namePlaceholder}
          className={`${errors.name ? "border-red-500" : ""}`}
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Input
          name="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder={phonePlaceholder}
          className={`${errors.phone ? "border-red-500" : ""}`}
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="pt-3">
        <p className="text-sm text-muted-foreground text-center">
          {privacyText}
        </p>
      </div>

      <Button className="w-full" type="submit">
        {buttonText}
      </Button>
    </form>
  )
} 