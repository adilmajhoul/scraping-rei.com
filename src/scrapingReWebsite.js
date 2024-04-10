import * as cheerio from 'cheerio';
import { proxies } from './lib/config/proxies';
import fs from 'fs';
import path from 'path';

const BASEURLPRODUCT = 'https://www.rei.com';
const BASEURLPAGINATION = 'https://www.rei.com/search';

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
 * Parses all content pages for the given links.
 *
 * @param {Array} links - An array of links to be parsed
 * @return {Promise} A promise that resolves when all content pages are parsed
 */
async function parseAllContentPages(links) {
  for (const link of links) {
    console.log(`🚀 ~ contentPageLoop ~ link: ${link}`);
    const { html } = await getPage(BASEURLPRODUCT + link);

    const product = await parseContent(html, {
      name: 'h1#product-page-title',
      price: 'span#buy-box-product-price',
      sku: 'span#product-item-number',
    });
    console.log(`🚀 ~ contentPageLoop ~ product: ${JSON.stringify(product)}`);

    return product;
  }
}

/**
 * Writes the given products to a JSON file. If the file already exists,
 * it reads the existing products and appends the new products.
 *
 * @param {Array} products - The array of products to be written to the JSON file
 * @param {string} filePath - The file path where the products will be written
 */
async function writeProductsToJson(products, filePath) {
  // If file already exists, read existing products and concatenate with new products
  let existingProducts = [];
  if (fs.existsSync(filePath)) {
    const json = fs.readFileSync(filePath, 'utf8');
    existingProducts = JSON.parse(json);
  }

  // Concatenate existing products with new products
  const allProducts = existingProducts.concat(products);

  // Write all products to JSON file
  fs.writeFileSync(filePath, JSON.stringify(allProducts, null, 2), 'utf8');
}

/**
 * Asynchronously loops through pagination of a given URL, extracting product information.
 *
 * @param {string} url - The initial URL for pagination
 * @return {void}
 */
async function paginationLoop(url) {
  url = BASEURLPAGINATION + url;
  let products = [];

  while (true) {
    const { html, nextPageUrl } = await getPage(url);

    let productLinks = await parseLinks(html, 'div#search-results > ul li > a');

    const product = await parseAllContentPages(productLinks);
    products = products.concat(product);

    // Write products to JSON file
    const filePath = path.join(__dirname, 'products.json');
    await writeProductsToJson(products, filePath);

    products = [];

    if (!nextPageUrl) {
      break;
    } else {
      url = BASEURLPAGINATION + nextPageUrl;
      console.log(url);
    }
  }
}

// async function paginationLoop(url) {
//   url = BASEURLPAGINATION + url;
//   while (true) {
//     const { html, nextPageUrl } = await getPage(url);

//     let productLinks = await parseLinks(html, 'div#search-results > ul li > a');

//     const product = await parseAllContentPages(productLinks);

//     if (!nextPageUrl) {
//       break;
//     } else {
//       url = BASEURLPAGINATION + nextPageUrl;
//       console.log(url);
//     }
//   }
// }

(async function main() {
  // const { html } = await getPage(
  //   'https://www.rei.com/search?q=Backpacks&page=6',
  // );

  // const productLinks = await parseLinks(html, 'div#search-results > ul li > a');
  // console.log('🚀 ~ main ~ productLinks:', productLinks);

  paginationLoop('?q=Backpacks&page=6');

  // const { html } = await getPage(
  //   'https://www.rei.com/product/213141/backcountry-access-float-e2-25-avalanche-airbag-pack',
  // );

  // const product = await parseContent(html, {
  //   name: 'h1#product-page-title',
  //   price: 'span#buy-box-product-price',
  //   sku: 'span#product-item-number',
  // });

  // console.log(product);

  // const links = [
  //   '/product/213141/backcountry-access-float-e2-25-avalanche-airbag-pack',
  //   '/product/118870/rei-co-op-pack-duffel-bag',
  // ];

  // parseAllContentPages(links);
})();
