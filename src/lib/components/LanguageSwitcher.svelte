<script lang="ts">
  import {
    currentLanguage,
    switchLanguage,
    type Language,
  } from "$lib/stores/language";

  let selectedLanguage = $state<Language>("ja");

  const unsubscribe = currentLanguage.subscribe((lang) => {
    selectedLanguage = lang;
  });

  function handleLanguageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newLang: Language = target.checked ? "en" : "ja";
    switchLanguage(newLang);
  }
</script>

<label class="btn swap">
  <input
    type="checkbox"
    checked={selectedLanguage === "en"}
    onchange={handleLanguageChange}
  />
  <div class="swap-on">EN</div>
  <div class="swap-off">JA</div>
</label>
