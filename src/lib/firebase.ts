import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCtbYoCB8fczCrOMEl9HXJ68bptgEfWZls",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tradekg-3f266.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tradekg-3f266",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tradekg-3f266.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "390237362590",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:390237362590:web:13cba6dc02920b2e089e8f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-QT2H4G2N49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (только в браузере)
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };

// Вспомогательные функции для аналитики
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (analytics && typeof window !== 'undefined') {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics!, eventName, parameters);
    });
  }
};

// Специфичные события для Single Window
export const trackPageView = (page_title: string, page_location?: string) => {
  trackEvent('page_view', {
    page_title,
    page_location: page_location || window.location.href,
  });
};

export const trackRegistryAccess = (registry_name: string, registry_url: string) => {
  trackEvent('registry_access', {
    registry_name,
    registry_url,
    event_category: 'engagement',
    event_label: registry_name
  });
};

export const trackContactFormSubmit = (success: boolean, error_message?: string) => {
  trackEvent('contact_form_submit', {
    success,
    error_message,
    event_category: 'form',
    event_label: success ? 'success' : 'error'
  });
};

export const trackSearch = (search_term: string, results_count?: number) => {
  trackEvent('search', {
    search_term,
    results_count,
    event_category: 'engagement'
  });
};