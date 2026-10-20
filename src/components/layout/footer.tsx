import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1F4E94] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Company Info */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Single Window</h3>
            <p className="text-gray-400 mb-4">
              Государственная система содействия торговле Кыргызской Республики - Единое окно для внешнеэкономической деятельности.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/singlewindowkg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/singlewindow.kg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:flex-1"></div>

          {/* Contact Info */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+996 312 902 640</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@trade.kg</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>Бишкек, пр. Чуй 122</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+996 312 902 655</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Single Window - Единое окно КР. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
