import { browser } from "$app/environment";
import { locale } from 'svelte-i18n';
import { createPersistentStore } from "./store-utils";

export type Language = 'ja' | 'en';

const SUPPORTED_LANGUAGES: Language[] = ['ja', 'en'];

function isValidLanguage(lang: unknown): lang is Language {
    return typeof lang === 'string' && SUPPORTED_LANGUAGES.includes(lang as Language);
}

function getBrowserLanguage(): Language {
    if (!browser) {
        const browserLang = navigator.language || navigator.languages?.[0];
        if (browserLang?.startsWith('ja')) return 'ja';
        if (browserLang?.startsWith('en')) return 'en';
    }
    return 'ja';
}

export const language = createPersistentStore<Language>({
    storageKey: 'language',
    defaultValue: getBrowserLanguage(),
    validate: isValidLanguage
});

language.subscribe((lang) => {
    locale.set(lang);
});
