import { en, Translation } from './en';

// Current locale (can be extended to support multiple languages)
const currentLocale = 'en';
const translations: Record<string, Translation> = { en };

// Client-side translation hook
export function useTranslation() {
  const t = translations[currentLocale];

  // Helper function to replace placeholders like {count}, {plural}
  const format = (text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;

    return Object.entries(params).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }, text);
  };

  return { t, format };
}

// Server-side translation helper for SEO pages
export function getTranslation(locale: string = 'en') {
  const t = translations[locale] || translations['en'];

  // Helper function to replace placeholders like {count}, {theme}
  const format = (text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;

    return Object.entries(params).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }, text);
  };

  return { t, format, locale };
}

// Export translation object for direct access
export { en };
export type { Translation };
