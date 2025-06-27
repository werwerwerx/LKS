import { FormEvent } from "react"

let isSubmitting = false

export const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  
  if (isSubmitting) {
    return
  }
  
  const form = e.currentTarget
  const formData = new FormData(form)
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string

  if (!name?.trim() || !phone?.trim()) {
    showNotification("Пожалуйста, заполните все поля", "error")
    return
  }

  isSubmitting = true
  const originalButtonText = submitButton?.textContent || "ОТПРАВИТЬ"
  
  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = "ОТПРАВКА..."
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const data = await response.json()
    
    if (response.ok) {
      showNotification(data.message || "Сообщение отправлено! Мы свяжемся с вами в ближайшее время.", "success")
      form.reset()
    } else {
      if (response.status === 429) {
        showNotification("Слишком много запросов. Попробуйте позже.", "error")
      } else {
        showNotification(data.message || "Ошибка отправки сообщения", "error")
      }
    }
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof Error && error.name === 'AbortError') {
      showNotification("Время ожидания истекло. Попробуйте еще раз.", "error")
    } else {
      showNotification("Произошла ошибка при отправке сообщения", "error")
    }
  } finally {
    isSubmitting = false
    if (submitButton) {
      submitButton.disabled = false
      submitButton.textContent = originalButtonText
    }
  }
}

function showNotification(message: string, type: "success" | "error") {
  const existingNotification = document.getElementById('form-notification')
  if (existingNotification) {
    existingNotification.remove()
  }

  const notification = document.createElement('div')
  notification.id = 'form-notification'
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    ${type === "success" 
      ? "background-color: #10b981; color: white;" 
      : "background-color: #ef4444; color: white;"
    }
  `
  
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}