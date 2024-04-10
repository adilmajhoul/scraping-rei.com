import * as cheerio from 'cheerio';
import { proxies } from './lib/config/proxies';

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
async function parseLinks(html, selector) {
  // "div#search-results > ul li > a"
  const $ = cheerio.load(html);

  let links = $(selector).get();
  links = new Set(links.map((a) => $(a).attr('href')));

  console.log('🚀 ~ parseLinks ~ links:', links);

  return links;
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

  return text || '';
}

/**
 * Asynchronously fetches a webpage from the given URL, extracts HTML content using Cheerio, and
 * retrieves the URL for the next page.
 *
 * @param {string} url - The URL of the webpage to fetch
 * @return {Object} An object containing the fetched HTML, the URL of the next page, and the Cheerio object
 */
async function getPage(url) {
  const html = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(html);

  const nextPageUrl = $("a[data-id='pagination-test-link-next']").attr('href');

  return { html, nextPageUrl, $ };
}

async function parseContent(html, fields) {
  const $ = cheerio.load(html);

  const content = {};

  for (const key in fields) {
    content[key] = await getText(html, fields[key], 0);
  }

  return content;
}

/**
 * Asynchronously loops through paginated URLs to fetch data.
 *
 * @param {string} url - The initial URL to start pagination from.
 * @return {void} This function does not return anything.
 */
async function paginationLoop(url) {
  let baseUrl = 'https://www.rei.com/search';

  while (true) {
    const { html } = await getPage(baseUrl + url);

    let productLinks = await parseLinks(html, 'div#search-results > ul li > a');

    for (const link of productLinks) {
      const { html } = await getPage(baseUrl + link);

      const product = await parseContent(html, {
        name: 'h1#product-page-title',
        price: 'span#buy-box-product-price',
        sku: 'span#product-item-number',
      });

      console.log(product);
    }

    let { nextPageUrl } = await getPage(url);

    if (!nextPageUrl) {
      break;
    } else {
      url = baseUrl + nextPageUrl;
      console.log(url);
    }
  }
}

(async function main() {
  paginationLoop('https://www.rei.com/search?q=Backpacks&page=6');

  // const { html } = await getPage(
  //   'https://www.rei.com/product/231468/osprey-talon-pro-20-pack-mens',
  // );

  // const product = await parseContent(html, {
  //   name: 'h1#product-page-title',
  //   price: 'span#buy-box-product-price',
  //   sku: 'span#product-item-number',
  // });

  // console.log(product);
})();
