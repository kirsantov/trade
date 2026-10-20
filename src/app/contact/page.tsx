"use client";

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { trackContactFormSubmit } from '@/lib/firebase';

export default function ContactPage() {
  const breadcrumbItems = [
    { label: 'Контакты' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Сообщение успешно отправлено!');
        setMessageType('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackContactFormSubmit(true);
      } else {
        const errorMessage = data.error || 'Произошла ошибка при отправке сообщения';
        setMessage(errorMessage);
        setMessageType('error');
        trackContactFormSubmit(false, errorMessage);
      }
    } catch {
      const errorMessage = 'Произошла ошибка при отправке сообщения';
      setMessage(errorMessage);
      setMessageType('error');
      trackContactFormSubmit(false, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Контакты
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Свяжитесь с нами для получения консультаций по вопросам внешнеэкономической деятельности
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Контактная информация
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1F4E94] rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Телефоны</h3>
                  <p className="text-gray-600">+996 312 902 640</p>
                  <p className="text-gray-600">+996 312 902 655</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1F4E94] rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Электронная почта</h3>
                  <a href="mailto:info@trade.kg" className="text-[#1F4E94] hover:underline">
                    info@trade.kg
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1F4E94] rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Адрес</h3>
                  <p className="text-gray-600">Бишкек, пр. Чуй 122</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Юридический адрес: 720002, г. Бишкек, пр. Чуй, 106
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">О предприятии</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Государственное предприятие «Центр «единого окна» в сфере внешней торговли» 
                при Государственной таможенной службе при Министерстве финансов Кыргызской Республики создано в соответствии 
                с законодательством Кыргызской Республики в целях внедрения системы «единого окна», 
                реализации и продвижения принципа «единого окна» в сфере внешней торговли.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Отправить сообщение
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя *"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E94] focus:border-transparent outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ваш адрес эл.почты *"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E94] focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Тема сообщения"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E94] focus:border-transparent outline-none transition-colors"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Текст сообщения"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E94] focus:border-transparent outline-none transition-colors resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1F4E94] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1a3f7a] transition-colors focus:ring-2 focus:ring-[#1F4E94] focus:ring-offset-2 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Отправляется...' : 'Отправить сообщение'}
              </button>
            </form>
            
            <p className="text-gray-500 text-sm mt-4 text-center">
              * Обязательные поля для заполнения
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
