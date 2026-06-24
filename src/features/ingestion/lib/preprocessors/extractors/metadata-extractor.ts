import { JSDOM } from "jsdom";
import { Metadata } from "../types";

export function extractMetadata(dom: JSDOM): Metadata {
  const document = dom.window.document;

  const getMeta = (name: string) =>
    document
      .querySelector(`meta[name="${name}"]`)
      ?.getAttribute("content")
      ?.trim();

  const getProperty = (property: string) =>
    document
      .querySelector(`meta[property="${property}"]`)
      ?.getAttribute("content")
      ?.trim();

  const canonical = document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute("href")
    ?.trim();

  return {
    title: document.title || undefined,
    description: getMeta("description"),
    keywords: getMeta("keywords"),
    language: document.documentElement.lang || undefined,
    canonical,

    openGraph: {
      title: getProperty("og:title"),
      description: getProperty("og:description"),
      type: getProperty("og:type"),
      url: getProperty("og:url"),
    },
  };
}
