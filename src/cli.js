import * as cheerio from 'cheerio';
import { proxies } from './lib/config/proxies';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

const argv = yargs.options({
  baseUrl: {
    alias: 'b',
    description: 'Base URL for the website',
    type: 'string',
    required: true,
  },
  firstPageUrl: {
    alias: 'f',
    description: 'URL for the first page of results',
    type: 'string',
    required: true,
  },
  cardSelector: {
    alias: 'c',
    description: 'CSS selector for the product cards',
    type: 'string',
    required: true,
  },
  contentSelectors: {
    alias: 's',
    description:
      'Comma-separated list of CSS selectors for product info (name, price, sku, etc.)',
    type: 'string',
    required: true,
  },
  output: {
    alias: 'o',
    description: 'Output file path',
    type: 'string',
    default: 'products.json',
  },
  help: {
    alias: 'h',
  },
}).argv;

const BASEURLPRODUCT = argv.baseUrl;
const BASEURLPAGINATION = `${argv.baseUrl}/search`;

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
async function parseAllContentPages(links, contentSelectors) {
  console.log('🚀 ~ parseAllContentPages ~ links:', links);
  let products = [];
  for (const link of links) {
    console.log(`🚀 ~ contentPageLoop ~ link: ${link}`);
    const { html } = await getPage(BASEURLPRODUCT + link);

    const product = await parseContent(html, contentSelectors);

    products.push(product);

    console.log(`🚀 ~ contentPageLoop ~ product: ${JSON.stringify(product)}`);
  }

  return products;
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

  while (true) {
    const { html, nextPageUrl } = await getPage(url);

    let productLinks = await parseLinks(html, argv.cardSelector);

    const contentSelectors = argv.contentSelectors
      .split(',')
      .reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});

    const products = await parseAllContentPages(productLinks, contentSelectors);

    // Write products to JSON file
    const filePath = path.join(__dirname, argv.output);
    await writeProductsToJson(products, filePath);

    if (!nextPageUrl) {
      break;
    } else {
      url = BASEURLPAGINATION + nextPageUrl;
      console.log(url);
    }
  }
}

(async function main() {
  paginationLoop(argv.firstPageUrl);
})();
