import * as cheerio from 'cheerio';
import { getPage, parseLinks, writeProductsToJson } from './scrapingReWebsite';

async function paginationLoop(startingPageUrl) {
  let url = startingPageUrl;

  let allLinks = [];
  while (true) {
    const { html, nextPageUrl } = await getPage(url, 'div > a.next');

    let links = await parseLinks(html, 'div > div.post-image > a');

    allLinks = [...links, ...allLinks];

    if (!nextPageUrl) {
      break;
    } else {
      url = nextPageUrl;
      console.log(url);
    }
  }

  return allLinks;
}

async function getHeadersOfTable($, selector) {
  const headers = $(selector)
    .map((i, element) => $(element).text().trim())
    .get();

  return headers;
}

function getTableRow(row) {
  const name = row.eq(0).text().trim();
  const site = row.eq(1).text().trim();
  const industry = row.eq(2).text().trim();
  const country = row.eq(3).text().trim();
  const fundingAmount = row.eq(4).text().trim();
  const fundingType = row.eq(5).text().trim();
  const fundingDate = row.eq(6).text().trim();

  const company = {
    name,
    site,
    industry,
    country,
    fundingAmount,
    fundingType,
    fundingDate,
  };

  return company;
}

async function getTableData(link) {
  const { $ } = await getPage(link);

  const tableData = [];

  $('tbody tr').each((i, element) => {
    const row = $(element).find('td');
    const company = getTableRow(row);
    tableData.push(company);
  });

  return tableData;
}

// async function processLinks(links) {
//   const promises = links.map((link) => getTableData(link));
//   const results = await Promise.all(promises);
//   return results.flat(); // Flatten the array of arrays into a single array of objects
// }

// const links = await paginationLoop(
//   'https://growthlist.co/author/admin/page/1/',
// );

// writeProductsToJson(links, 'links.json');

async function processLinks(links) {
  const results = [];

  for (let i = 0; i < links.length; i += 5) {
    const batch = links.slice(i, i + 5);
    const promises = batch.map((link) => getTableData(link));
    const batchResults = await Promise.all(promises);

    writeProductsToJson(batchResults, 'companies.json');

    results.push(...batchResults);
  }

  return results.flat(); // Flatten the array of arrays into a single array of objects
}
// console.time('Process Links');
// processLinks(links)
//   .then((data) => {
//     // console.log('Data:', data);
//     return writeProductsToJson(data, 'companies.json');
//   })
//   .then(() => {
//     console.timeEnd('Process Links');
//     console.log('All data written to companies.json');
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
