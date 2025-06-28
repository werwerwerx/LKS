"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ContactFormSchema } from "@/lib/validations"
import { z } from "zod"
import { onSubmitForm } from "@/shared/on-submit-form"

export default function SimpleContactForm() {
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

  const validateField = (field: keyof typeof formData, value: string | boolean): string => {
    try {
      if (field === "name" && typeof value === "string") {
        ContactFormSchema.shape.name.parse(value)
      } else if (field === "phone" && typeof value === "string") {
        ContactFormSchema.shape.phone.parse(value)
      } else if (field === "privacy") {
        ContactFormSchema.shape.privacy.parse(value)
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
    const privacyError = validateField("privacy", formData.privacy)

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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Input
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Ваше имя"
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
          placeholder="+7 (999) 123-45-67"
          className={`${errors.phone ? "border-red-500" : ""}`}
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="flex items-start space-x-3 pt-3">
        <label className="text-sm cursor-pointer text-start">
          Отправляя заявку, я соглашаюсь с политикой обработки данных
        </label>
      </div>

      <Button className="w-full" type="submit">
        Отправить заявку
      </Button>
    </form>
  )
} 