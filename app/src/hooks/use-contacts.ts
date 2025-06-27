import { useState, useEffect } from "react"

interface ContactInfo {
  phone: string
  email: string
  telegram: string
  whatsapp: string
  address: string
  workingHours: string
}

const defaultContacts: ContactInfo = {
  phone: "+7 996 679 44 78",
  email: "info@lks-models.ru",
  telegram: "@lks_models",
  whatsapp: "+7 996 679 44 78",
  address: "Москва, Центральный район",
  workingHours: "Ежедневно с 10:00 до 22:00"
}

export function useContacts() {
  const [contacts, setContacts] = useState<ContactInfo>(defaultContacts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    try {
      const savedContacts = localStorage.getItem('contacts')
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts))
      }
    } catch (error) {
      console.error('Ошибка загрузки контактов:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateContacts = (newContacts: Partial<ContactInfo>) => {
    const updatedContacts = { ...contacts, ...newContacts }
    setContacts(updatedContacts)
    localStorage.setItem('contacts', JSON.stringify(updatedContacts))
  }

  const resetContacts = () => {
    setContacts(defaultContacts)
    localStorage.removeItem('contacts')
  }

  return {
    contacts,
    isLoading,
    updateContacts,
    resetContacts
  }
} 