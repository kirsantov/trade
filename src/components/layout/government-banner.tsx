import { Shield } from 'lucide-react';

export function GovernmentBanner() {

  return (
    <div className="bg-gray-100 text-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-2">
          <div className="flex items-center gap-2 text-gray-700 opacity-50">
            <Shield className="h-4 w-4" />
            <span>Официальный сайт государственных органов Кыргызской Республики</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}