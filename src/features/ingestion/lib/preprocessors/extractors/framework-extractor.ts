import { JSDOM } from "jsdom";
import { FrameworkInfo } from "../types";

export function extractFramework(dom: JSDOM): FrameworkInfo {
  const document = dom.window.document;

  // Next.js
  if (document.getElementById("__NEXT_DATA__")) {
    return { name: "next" };
  }

  // Nuxt
  if (
    document.getElementById("__NUXT_DATA__") ||
    document.getElementById("__NUXT__")
  ) {
    return { name: "nuxt" };
  }

  // Astro
  if (document.querySelector("astro-island")) {
    return { name: "astro" };
  }

  // Angular
  if (
    document.querySelector("[ng-version]") ||
    document.querySelector("app-root")
  ) {
    return { name: "angular" };
  }

  // Svelte
  if (document.querySelector("[data-sveltekit]")) {
    return { name: "svelte" };
  }

  // Vue
  if (
    document.querySelector("[data-v-app]") ||
    document.getElementById("__VUE_DEVTOOLS_GLOBAL_HOOK__")
  ) {
    return { name: "vue" };
  }

  // React
  if (
    document.querySelector("[data-reactroot]") ||
    document.querySelector("[data-reactid]")
  ) {
    return { name: "react" };
  }

  return {};
}
