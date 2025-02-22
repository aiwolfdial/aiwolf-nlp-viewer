import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';

export default defineConfig({
	base: "/aiwolf-nlp-viewer/",
	plugins: [tailwindcss(), sveltekit()],
});
