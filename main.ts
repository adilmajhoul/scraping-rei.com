// import fs from "fs";
import * as cheerio from "cheerio";

// --------------------EXTRACTION PROCESS-------------------------
interface ScrapedCompany {
  company: string;
  website: string;
  likely_to_outsourc: string;
  tech_stack: string;
  indsutry: string;
  location: string;
  country: string;
  city: string;
  state: string;
  eployee_size: string;
  revenue: string;
  funcding_date: string;
  total_funding: string;
  company_linkedin: string;
  key_dicision_maker_: string;
  source_of_data: string;
}

async function scrapeCrunchbase(url: string = ""): Promise<ScrapedCompany> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const company = $(
    "body > chrome > div > mat-sidenav-container > mat-sidenav-content > div > ng-component > entity-v2 > page-layout > div > div > profile-header > div > header > div > div > div > div.identifier-nav > div.identifier-nav-title.ng-star-inserted > h1"
  ).text();

  const website: string = "";
  const likely_to_outsourc: string = "";
  const tech_stack: string = "";
  const indsutry: string = "";
  const location: string = "";
  const country: string = "";
  const city: string = "";
  const state: string = "";
  const eployee_size: string = "";
  const revenue: string = "";
  const funcding_date: string = "";
  const total_funding: string = "";
  const company_linkedin: string = "";
  const key_dicision_maker_: string = "";
  const source_of_data: string = "";

  console.log(company);

  return {
    company,
    website,
    likely_to_outsourc,
    tech_stack,
    indsutry,
    location,
    country,
    city,
    state,
    eployee_size,
    revenue,
    funcding_date,
    total_funding,
    company_linkedin,
    key_dicision_maker_,
    source_of_data,
  };
}

scrapeCrunchbase("https://www.crunchbase.com/organization/imageryst");

// ---------------------INITIAL SEARCH PROCESS-------------------------
// take search query as input

// fs.readFile("input.txt", "utf8", (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }
//   console.log("File Content:", data);
// });
// perform initial search using serp api using with newest results

// get first 10 links

// for each link, extract the html using GET request

// pass the link to ai api and propmt it to exract data in JSON as a specific format

// data format:
/*{
company:
website:
likely to outsource:
tech stack:
indsutry
location
country
city
state
eployee size
revenue
funcding date
total funding
company linkedin
key dicision maker email
source of data
} */

// store data using prisma in temperary storage

// finishing this proces after extracting 30 companies

// -----------------------REFINING PROCESS------------------------------------

// duplicate check company at index 0 with the whole database if duplicate remove and move to index 1

// fetch company of index 0 in temporary storage

// (make a recent search for this company using serp api or look for already existing companies data api)

// extract data of same company from 5 sources

// pass the sources to ai api and propmt it to get the correct data based on the sources

// store the company data using prisma in permanent storage (for the given day)

// repeat till the last company in tem database

// -------------------------LAST QUALITY CONTROLL CHECK--------------------------------
