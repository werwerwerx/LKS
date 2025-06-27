"use client"

import Image from "next/image"
import { ModelCard } from "@/components/model-card/model-card"

const modelsData = [
  {
    name: "Олеся",
    age: 23,
    imgSrc: [
      "/imgs/OLESYA1.webp",
      "/imgs/OLESYA2.jpg", 
      "/imgs/OLESYA3.jpg"
    ]
  },
  {
    name: "Вероника", 
    age: 25,
    imgSrc: [
      "/imgs/veronika.webp",
      "/imgs/veronika2.webp",
      "/imgs/VERONIKA3.jpg",
      "/imgs/VERONIKA4.webp"
    ]
  },
  {
    name: "Катя",
    age: 22, 
    imgSrc: [
      "/imgs/KATYA1.webp",
      "/imgs/KATYA2.webp",
      "/imgs/KATYA3.jpg"
    ]
  }
]

export default function WhatIsModeling() {
  return (
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">ЧТО ТАКОЕ МОДЕЛЬНЫЕ УСЛУГИ?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Модельные услуги — это профессиональные услуги сопровождения для фотосессий, показов мод и мероприятий,
            которые позволяют не только насладиться обществом красивой девушки, но и подчеркнуть ваш статус на важных
            мероприятиях. Модельные услуги предоставляют возможность добавить в вашу жизнь вдохновляющие моменты,
            разделенные с девушками, обладающими безупречным вкусом, презентабельной внешностью и умением поддержать
            разговор. Это идеальный выбор для тех, кто ценит высокий уровень сервиса, конфиденциальность и
            индивидуальный подход.
          </p>
        </div>

        <h3 className="text-2xl md:text-4xl font-bold text-center mb-12">ВЫБЕРИ СВОЮ МОДЕЛЬ</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {modelsData.map((model, index) => (
              <ModelCard
                key={index}
                imgSrc={model.imgSrc}
                name={model.name}
                age={model.age}
              />
            ))}
          </div>
      </div>
    </section>
  )
}
