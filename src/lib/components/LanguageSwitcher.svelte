<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { currentLanguage, switchLanguage, type Language } from '$lib/stores/language';

  let selectedLanguage = $state<Language>('ja');

  currentLanguage.subscribe((lang) => {
    selectedLanguage = lang;
  });

  function handleLanguageChange(lang: Language) {
    switchLanguage(lang);
  }

  function getCurrentLanguageDisplay() {
    return selectedLanguage === 'ja' ? '日本語' : 'English';
  }
</script>

<div class="dropdown dropdown-end dropdown-bottom">
  <div tabindex="0" role="button" class="btn btn-sm btn-outline w-24">
    {getCurrentLanguageDisplay()}
  </div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-24 p-1 shadow border">
    <li><button class="btn btn-ghost btn-xs h-8" class:bg-base-200={selectedLanguage === 'ja'} onclick={() => handleLanguageChange('ja')}>日本語</button></li>
    <li><button class="btn btn-ghost btn-xs h-8" class:bg-base-200={selectedLanguage === 'en'} onclick={() => handleLanguageChange('en')}>English</button></li>
  </ul>
</div>