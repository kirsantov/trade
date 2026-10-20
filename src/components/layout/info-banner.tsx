import { Info } from 'lucide-react';

export function InfoBanner() {
  return (
    <section className="bg-[#1F4E94] text-white py-6 md:py-8 mt-24 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-6 md:w-8 h-6 md:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Info className="h-4 md:h-5 w-4 md:w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-blue-100 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
              Государственное предприятие «Центр «единого окна» в сфере внешней торговли» при Государственной таможенной службе при Министерстве финансов Кыргызской Республики создано в соответствии с законодательством Кыргызской Республики в целях внедрения системы «единого окна», реализации и продвижения принципа «единого окна» в сфере внешней торговли.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}