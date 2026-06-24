export interface AnalysisInput {
  url: string;
  metadata: Metadata;
  framework: FrameworkInfo;
  importantScripts: ImportantScript[];
  html: HtmlContent;
}

export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string;
  language?: string;
  canonical?: string;

  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
  };
}

export interface FrameworkInfo {
  name?: "next" | "nuxt" | "react" | "vue" | "angular" | "astro" | "svelte";

  version?: string;
}

export const IMPORTANT_SCRIPT_TYPE = {
  JSON_LD: "application/ld+json",
  NEXT_DATA: "__NEXT_DATA__",
  NUXT_DATA: "__NUXT_DATA__",
  NUXT: "__NUXT__",
  INITIAL_STATE: "__INITIAL_STATE__",
  PRELOADED_STATE: "__PRELOADED_STATE__",
  APOLLO_STATE: "__APOLLO_STATE__",
} as const;

export type ImportantScriptType =
  (typeof IMPORTANT_SCRIPT_TYPE)[keyof typeof IMPORTANT_SCRIPT_TYPE];

export interface ImportantScript {
  type: ImportantScriptType;
  content: string;
}

export interface HtmlContent {
  head: string;
  body: string;
  main?: string;
}
