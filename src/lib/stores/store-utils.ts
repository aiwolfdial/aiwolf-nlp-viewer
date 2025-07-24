import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export interface StoreOptions<T> {
  storageKey: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  validate?: (value: unknown) => value is T;
}

export function createPersistentStore<T>(options: StoreOptions<T>): Writable<T> {
  const { storageKey, defaultValue, serialize, deserialize, validate } = options;

  function loadValue(): T {
    if (!browser) return defaultValue;

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      saveValue(defaultValue);
      return defaultValue;
    }

    try {
      const parsed = deserialize ? deserialize(stored) : JSON.parse(stored);
      if (validate && !validate(parsed)) {
        throw new Error('Invalid stored value');
      }
      return parsed;
    } catch (e) {
      console.error(`Failed to parse ${storageKey}:`, e);
      saveValue(defaultValue);
      return defaultValue;
    }
  }

  function saveValue(value: T): void {
    if (browser) {
      const serialized = serialize ? serialize(value) : JSON.stringify(value);
      localStorage.setItem(storageKey, serialized);
    }
  }

  const store = writable<T>(loadValue());
  store.subscribe(saveValue);

  return store;
}