'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Analytics инициализируется автоматически при импорте
    if (analytics) {
      console.log('Google Analytics initialized');
    }
  }, []);

  return null;
}