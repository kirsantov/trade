import Link from 'next/link';

export function HeroSection() {
  const quickActions = [
    {
      title: "Информационная система «единого окна»",
      href: "https://swis2.trade.kg",
      image: "/i/customs.jpg",
    },
    {
      title: "АИС \"Техосмотр автотранспортных средств\"",
      href: "https://to.trade.kg/",
      image: "/i/tehosmotr.jpg",
    },
    {
      title: "Информационно-Торговый портал",
      href: "https://info.trade.kg/?l=ru",
      image: "/i/portfolio.jpg",
    },
  ];

  return (
    <section
      className="relative bg-gray-50 min-h-[500px] md:min-h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4), transparent), url('/i/main-customs.jpg')`
      }}
    >
      
      <div className="relative min-h-[400px] md:min-h-[500px]">
        {/* Quick Actions Box - positioned to overlap bottom of image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
            {/* Desktop: horizontal layout, Mobile: vertical */}
            <div className="flex flex-col md:flex-row gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 block rounded-lg border border-gray-200 hover:border-[#1F4E94] hover:shadow-md transition-all group overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={action.image}
                      alt={action.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1F4E94] text-sm md:text-base text-center">
                      {action.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
