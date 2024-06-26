import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASEURLPRODUCT = 'https://www.rei.com';

/**
 * Parses links from the given HTML content using Cheerio.
 *
 * @param {string} html - The HTML content to parse links from.
 * @return {Set} A Set containing unique links extracted from the HTML content.
 */
export async function parseLinks(html, selector) {
  // "div#search-results > ul li > a"
  const $ = cheerio.load(html);

  let links = $(selector).get();
  links = new Set(links.map((a) => $(a).attr('href')));

  return links;
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
export async function getPage(url, nextPageUrlSelector) {
  const html = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(html);

  const nextPageUrl = $(nextPageUrlSelector).attr('href');

  return { html, nextPageUrl, $ };
}

export async function parseContent(html, fields) {
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
export async function parseAllContentPages(links) {
  console.log({ parsing_links: links });

  let products = [];
  for (const link of links) {
    const { html } = await getPage(BASEURLPRODUCT + link);

    const product = await parseContent(html, {
      name: 'h1#product-page-title',
      price: 'span#buy-box-product-price',
      sku: 'span#product-item-number',
      rating: 'span.cdr-rating__number_15-0-0',
      features: 'ul.cdr-list_15-0-0',
    });

    product.link = BASEURLPRODUCT + link;

    products.push(product);

    console.log({ parsed_product: product });
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
export async function writeDataToJson(products, fileName) {
  // construct the path
  const filePath = path.join(__dirname, fileName);

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
export async function paginationLoop(url, baseUrl) {
  // parse product name from link
  let productType = url.split('&')[0].split('=')[1];

  url = baseUrl + url;

  while (true) {
    const { html, nextPageUrl } = await getPage(
      url,
      "a[data-id='pagination-test-link-next']",
    );

    let productLinks = await parseLinks(html, 'div#search-results > ul li > a');

    const products = await parseAllContentPages(productLinks);

    // Write products to JSON file
    await writeDataToJson(
      products,
      `/extractedData/${productType}_rei.com.json`,
    );

    if (!nextPageUrl) {
      break;
    } else {
      url = baseUrl + nextPageUrl;
      console.log(url);
    }
  }
}

export async function measureJsonLength(fileName, fullPath) {
  // construct the path
  const filePath = fileName ? path.join(__dirname, fileName) : fullPath;
  // Read JSON file synchronously
  const jsonData = fs.readFileSync(filePath, 'utf8');

  // Convert JSON string to JavaScript object
  const jsonObjectLength = JSON.parse(jsonData).length;
  console.log('🚀 ~ measureJsonLength ~ jsonObjectLength:', jsonObjectLength);

  return jsonObjectLength;
}
