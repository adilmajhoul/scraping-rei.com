import * as cheerio from 'cheerio';

import { getPage, writeProductsToJson } from './scrapingReWebsite';
import { getQueryHandlerAndSelector } from 'puppeteer';
import path from 'path';

const { $ } = await getPage('https://growthlist.co/b2b-startups-france');
// const $ = cheerio.load(
//   `<ul>
//     <li>Item 1</li>
//     <li>Item 2</li>
//   </ul>`,
// );

// const listItems = $('ul')
//   .find('li')
//   .map((i, el) => $(el).text())
//   .get();

// table selector = "#footable_21233 > tbody"
// table row selector = "tr"
// table cells selectors:
// Name :

// const listItems = $('tbody')
//   .find('tr')
//   .map((index, row) => {
//     return $(row).find('td.ninja_column_0').text();
//   })
//   .get();

// -------------
// my CLI will get access to:
// all rows selector = "tbody tr"
// cells selectors, we gonna use index to access to each cell
// so the input will be like: --selectors "allRows=tbody tr,name=0,site=1,industry=2,country=3,fundingAmount=4,fundingDate=5"
// -------------
let data = [];

const headers = $('thead > tr th')
  .map((i, element) => $(element).text().trim())
  .get();

const comp = {};
$('tbody tr').each((i, element) => {
  const row = $(element).find('td');

  row.each((j, td) => {
    comp[headers[j]] = $(td).text().trim();
    if (i === 0) {
      $(td).text().trim();
      console.log('🚀 ~ headers:', headers[j]);

      console.log('🚀 ~ row.each ~ td.text().trim():', $(td).text().trim());
    }

    if (i === 0) {
      console.log('🚀 ~ comp:', comp);
    }
  });

  const name = row.eq(0).text().trim();
  const site = row.eq(1).text().trim();
  const industry = row.eq(2).text().trim();
  const country = row.eq(3).text().trim();
  const fundingAmount = row.eq(4).text().trim();
  const fundingType = row.eq(5).text().trim();
  const fundingDate = row.eq(6).text().trim();

  // Create a new object without unnecessary references
  const company = {
    name,
    site,
    industry,
    country,
    fundingAmount,
    fundingType,
    fundingDate,
  };

  data.push(company);
});
console.log('🚀 ~ $ ~ data:', data.length);

const filePath = path.join(__dirname, 'companies.json');
console.log('🚀 ~ filePath:', filePath);
await writeProductsToJson(data, filePath);
