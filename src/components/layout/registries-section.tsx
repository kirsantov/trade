import Link from 'next/link';
import Image from 'next/image';

export function RegistriesSection() {
  const registries = [
    {
      icon: '/images/icons/icon1.svg',
      title: 'Декларации и сертификаты соответствия ТР ТС/ЕАЭС',
      href: '/registries/eaeu-certificates'
    },
    {
      icon: '/images/icons/icon2.svg', 
      title: 'Декларации и сертификаты соответствия КР',
      href: '/registries/kg-certificates'
    },
    {
      icon: '/images/icons/icon3.svg',
      title: 'Свидетельства о государственной регистрации',
      href: '/registries/state-registration'
    },
    {
      icon: '/images/icons/icon4.svg',
      title: 'Лицензии на алкогольную продукцию', 
      href: '/registries/alcohol-licenses'
    },
    {
      icon: '/images/icons/icon5.svg',
      title: 'Свидетельство о безопасности конструкции транспортного средства',
      href: '/registries/vehicle-safety'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-12">Реестры</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {registries.map((registry, index) => (
            <Link key={index} href={registry.href} className="group">
              <div className="relative w-96 h-80 bg-white border border-gray-400 hover:border-[#1F4E94] rounded shadow hover:shadow-lg flex flex-col items-center justify-center p-4 text-center gap-4 text-2xl font-semibold text-black transition-all">
                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image src={registry.icon} alt="Иконка" width={64} height={64} className="w-full h-full object-contain" />
                </div>
                <h3 className="group-hover:text-[#1F4E94] transition-colors">
                  {registry.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}