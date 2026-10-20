"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/i/main-customs.jpg',
      title: 'Система единого окна для внешнеэкономической деятельности',
      description: 'Упрощение государственных процедур и сокращение времени оформления документов для участников ВЭД'
    },
    {
      image: '/images/1-1500x1102.jpg',
      title: 'Информационная система «единого окна»',
      description: 'Электронные государственные услуги в сфере внешней торговли'
    },
    {
      image: '/images/2-1500x1102.jpg',
      title: 'АИС «Техосмотр автотранспортных средств»',
      description: 'Автоматизированная система технического осмотра транспортных средств'
    },
    {
      image: '/images/3-1500x1102.jpg',
      title: 'Информационно-торговый портал',
      description: 'Платформа для развития внешнеэкономических связей'
    }
  ];

  const quickActions = [
    {
      title: "Подать заявление на лицензию",
      description: "Электронная подача заявлений на получение лицензий для экспорта/импорта",
      href: "/services/licensing/apply",
    },
    {
      title: "Проверить статус заявления", 
      description: "Отслеживание статуса поданных заявлений и документов",
      href: "/services/status-check",
    },
    {
      title: "Получить консультацию",
      description: "Бесплатная консультация по вопросам внешнеэкономической деятельности",
      href: "/services/consultations",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-gray-50 h-[600px] overflow-hidden">
      {/* Slider Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 h-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Text Content */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#1F4E94] hover:bg-[#1a4280] transition-colors"
              >
                Все услуги
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Войти в портал
              </Link>
            </div>
          </div>

          {/* Quick Actions Box */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Как мне...</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-[#1F4E94] hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1F4E94] mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/services"
                className="text-[#1F4E94] font-medium hover:underline"
              >
                Посмотреть все услуги →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}