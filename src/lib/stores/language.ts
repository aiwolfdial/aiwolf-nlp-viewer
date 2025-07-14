import { locale } from 'svelte-i18n';
import { writable } from 'svelte/store';

export type Language = 'ja' | 'en';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE: Language = 'ja';
const SUPPORTED_LANGUAGES: Language[] = ['ja', 'en'];

export const currentLanguage = writable<Language>(DEFAULT_LANGUAGE);

currentLanguage.subscribe((lang) => {
    locale.set(lang);
});

function isValidLanguage(lang: string): lang is Language {
    return SUPPORTED_LANGUAGES.includes(lang as Language);
}

function saveLanguage(lang: Language): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
    }
}

export function switchLanguage(lang: Language): void {
    currentLanguage.set(lang);
    saveLanguage(lang);
}

export function initializeLanguage(): void {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && isValidLanguage(saved)) {
            currentLanguage.set(saved);
        } else {
            saveLanguage(DEFAULT_LANGUAGE);
        }
    }
}