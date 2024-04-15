import * as cheerio from 'cheerio';

const url = 'https://www.crunchbase.com/organization/openai/company_financials';

const authHeader =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMTUyMjA1OTM1MiIsImNsaWVudElkIjoiZjZ6dWl6ZHloeHJtN3IiLCJ1c2VySWRUeXBlIjoiTEVBRCIsInNjb3BlIjoibGVhZCIsImlzcyI6IjEwODk4MzYiLCJleHAiOjE3NDQ3MjAyNzYsImlhdCI6MTcxMzE4NDI3Nn0.MTOrpXm5qJz9BNaeA2H1INpKjSWabC204pUsoO74HZ6ucjHi_1XzRGDXECMNLMm3x5YsqNZQOVf5N8sTpTIRpQ';

const html = await fetch(url, {
  headers: {
    Authorization: authHeader,
  },
}).then((res) => res.text());

const $ = cheerio.load(html);

console.log('🚀 ~ html:', html);

// Load HTML content into Cheerio

// Selector for the desired tag
const selector =
  '#mat-tab-nav-panel-11 > div > page-centered-layout > div > div > div.main-content > row-card:nth-child(1) > profile-section > section-card > mat-card > div.section-content-wrapper > list-card > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > field-formatter > span';

// Extract the element using the selector
const element = $(selector).text();
console.log('🚀 ~ element:', element);

// Output the text content of the element
