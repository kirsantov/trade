import { 
  FileText, Award, Wine, Car
} from 'lucide-react';
import { RegistryLink } from './registry-link';

export function ServicesGrid() {
  const services = [
    {
      icon: FileText,
      title: "Декларации и сертификаты соответствия ТР ТС/ЕАЭС",
      description: "Реестр деклараций и сертификатов соответствия техническим регламентам Таможенного союза и ЕАЭС",
      href: "http://swis.trade.kg/Registry/CertificateOfConformity"
    },
    {
      icon: FileText,
      title: "Декларации и сертификаты соответствия КР",
      description: "Реестр деклараций и сертификатов соответствия техническим регламентам Кыргызской Республики",
      href: "http://swis.trade.kg/Registry/DeclarationOfConformity-KGZ-National"
    },
    {
      icon: Award,
      title: "Свидетельства о государственной регистрации",
      description: "Реестр свидетельств о государственной регистрации лекарственных средств и медицинских изделий",
      href: "https://registry.trade.kg/registries/3"
    },
    {
      icon: Wine,
      title: "Лицензии на алкогольную продукцию",
      description: "Реестр лицензий на производство и оборот алкогольной и спиртосодержащей продукции",
      href: "https://registry.trade.kg/registries/15"
    },
    {
      icon: Car,
      title: "Свидетельство о безопасности конструкции транспортного средства",
      description: "Реестр свидетельств о безопасности конструкции транспортных средств и их компонентов",
      href: "https://inspection.trade.kg/registry"
    }
  ];

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Реестры
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Доступ к официальным реестрам и базам данных для участников внешнеэкономической деятельности
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <RegistryLink
                key={index}
                href={service.href}
                title={service.title}
                className="group p-4 md:p-6 rounded-lg border border-gray-200 hover:border-[#1F4E94] hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-gray-100 group-hover:bg-[#1F4E94] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="h-4 md:h-5 w-4 md:w-5 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#1F4E94] mb-1 md:mb-2 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </RegistryLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}