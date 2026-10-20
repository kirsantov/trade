"use client";

import Link from 'next/link';
import { ChevronDown, FileText, Users, Truck, Building2, Globe, Shield, Calculator, Phone } from 'lucide-react';
import { useState } from 'react';

export function ServicesMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    { icon: FileText, title: "Лицензирование", description: "Получение лицензий на экспорт/импорт", href: "/services/licensing" },
    { icon: Users, title: "Регистрация участников ВЭД", description: "Регистрация субъектов внешнеэкономической деятельности", href: "/services/registration" },
    { icon: Truck, title: "Таможенное оформление", description: "Декларирование и таможенные процедуры", href: "/services/customs" },
    { icon: Building2, title: "Сертификация", description: "Подтверждение соответствия товаров", href: "/services/certification" },
    { icon: Globe, title: "Валютное регулирование", description: "Валютное законодательство и операции", href: "/services/currency" },
    { icon: Shield, title: "Контроль качества", description: "Санитарно-эпидемиологический контроль", href: "/services/quality" },
    { icon: Calculator, title: "Налогообложение", description: "Налоговые вопросы в сфере ВЭД", href: "/services/taxation" },
    { icon: Phone, title: "Консультации", description: "Получение справочной информации", href: "/services/consultations" },
  ];

  return (
    <div className="bg-[#1F4E94] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-4 text-left font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            Все услуги и сервисы
          </span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 bg-white text-gray-900 shadow-lg border-t z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={index}
                      href={service.href}
                      className="group p-4 rounded-lg hover:bg-blue-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#1F4E94] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#1F4E94] mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/services"
                  className="inline-flex items-center text-[#1F4E94] font-medium hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Просмотреть все услуги
                  <ChevronDown className="h-4 w-4 ml-1 -rotate-90" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}