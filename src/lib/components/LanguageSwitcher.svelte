<script lang="ts">
  import { language, type Language } from "$lib/stores/language";
  import { onDestroy } from "svelte";

  let selectedLanguage = $state<Language>("ja");

  const unsubscribe = language.subscribe((lang) => {
    selectedLanguage = lang;
  });

  onDestroy(() => {
    unsubscribe();
  });

  function handleLanguageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newLang: Language = target.checked ? "en" : "ja";
    language.set(newLang);
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
