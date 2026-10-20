import Link from 'next/link';

export function ProjectsSection() {
  const projects = [
    {
      image: '/images/1-768x564.jpg',
      title: 'Информационная система «единого окна»',
      href: '/projects/single-window-system'
    },
    {
      image: '/images/tehosmotr-avtomobilya-5-960x540-1-768x575.jpg',
      title: 'АИС "Техосмотр автотранспортных средств"',
      href: '/projects/vehicle-inspection'
    },
    {
      image: '/images/portfolio-5-768x576.jpg',
      title: 'Информационно-Торговый портал',
      href: '/projects/trade-portal'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-12">Проекты</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {projects.map((project, index) => (
            <Link key={index} href={project.href} className="group">
              <div className="text-center max-w-sm">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                />
                <h3 className="mt-4 text-xl font-bold text-black group-hover:text-[#1F4E94] transition-colors max-w-xs mx-auto">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}