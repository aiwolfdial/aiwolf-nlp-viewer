import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('../i18n/en.json'));
register('ja', () => import('../i18n/ja.json'));

init({
  fallbackLocale: 'ja',
  initialLocale: getLocaleFromNavigator(),
});
