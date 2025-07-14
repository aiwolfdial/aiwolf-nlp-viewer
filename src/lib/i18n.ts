import { getLocaleFromNavigator, init, register } from 'svelte-i18n';
import { initializeLanguage } from './stores/language';

register('en', () => import('../i18n/en.json'));
register('ja', () => import('../i18n/ja.json'));

init({
  fallbackLocale: 'ja',
  initialLocale: getLocaleFromNavigator(),
});

initializeLanguage();