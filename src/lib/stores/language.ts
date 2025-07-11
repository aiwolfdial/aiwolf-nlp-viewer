import { locale } from 'svelte-i18n';
import { writable } from 'svelte/store';

export type Language = 'ja' | 'en';

export const currentLanguage = writable<Language>('ja');

currentLanguage.subscribe((lang) => {
  locale.set(lang);
});

export function switchLanguage(lang: Language) {
  currentLanguage.set(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

export function initializeLanguage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'ja' || saved === 'en')) {
      currentLanguage.set(saved);
    }
  }
}