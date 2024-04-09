import * as cheerio from "cheerio";
import { proxies } from "./lib/config/proxies";

// --- CLI ---
// first page URL
// Base URL
// article card selector (to extract all articles links in a single pagination page)
// article page (article content) selector (to extract article info)
// next page selectors
// select data format json, csv, or db
// proxies array to use
// set timeouts
// beatifull progressive logging

/**
 * Parses links from the given HTML content using Cheerio.
 *
 * @param {string} html - The HTML content to parse links from.
 * @return {Set} A Set containing unique links extracted from the HTML content.
 */
async function parseLinks(html) {
  const $ = cheerio.load(html);

  let links = $("div#search-results > ul li > a").get();
  links = new Set(links.map((a) => $(a).attr("href")));

  console.log("🚀 ~ parseLinks ~ links:", links);

  return links;
}

/**
 * Asynchronously fetches and loads HTML content from a given URL, extracts the next page URL,
 * and returns the body HTML content along with the next page URL.
 *
 * @param {string} url - The URL to fetch the HTML content from.
 * @return {Object} An object containing the body HTML content and the next page URL.
 */
async function paginationLoop(url) {
  const bodyHtml = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(bodyHtml);

  let nextPageUrl = $("a[data-id='pagination-test-link-next']").attr("href");

  console.log("🚀 ~ paginationLoop ~ nextPageUrl:", nextPageUrl);

  return { bodyHtml, nextPageUrl };
}

/**
 * Generates a random proxy from the list of available proxies.
 *
 * @return {Object} The randomly selected proxy.
 */
function getProxy() {
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  return randomProxy;
}

/**
 * Asynchronously gets the text content from the specified HTML using the provided selector and index.
 *
 * @param {string} html - The HTML content to extract text from
 * @param {string} selector - The CSS selector to target the desired element
 * @param {number} index - The index of the matched elements to retrieve the text from
 * @return {string} The text content of the selected element, or an empty string if not found
 */
export async function getText(html, selector, index) {
  const $ = cheerio.load(html);

  const text = $(selector).eq(index).text();

  return text || "";
}

/**
 * Asynchronous function that performs a pagination loop on a given URL, starting from a base URL and iterating through subsequent pages until there are no more pages left to fetch.
 *
 * @return {Promise<void>} This function does not return any value explicitly.
 */
(async function main() {
  let baseUrl = "https://www.rei.com/search";
  let url = "https://www.rei.com/search?q=Backpacks&page=6";

  while (true) {
    let res = await paginationLoop(url);

    if (!res.nextPageUrl) {
      break;
    } else {
      url = baseUrl + res.nextPageUrl;
      console.log(url);
    }
  }
})();
