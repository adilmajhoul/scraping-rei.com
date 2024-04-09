import * as cheerio from "cheerio";

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

// -----------------------------
// let link = "https://www.rei.com/search?q=Backpacks&page=6";
// const html = await fetch(link).then((res) => res.text());
// parseLinks(html);

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
