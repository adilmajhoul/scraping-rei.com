import { paginationLoop } from './utils';

const BASEURLPAGINATION = 'https://www.rei.com/search';

async function main() {
  // scrape bikes and start from page 1 (set what ever category you like and starting page)
  paginationLoop('?q=shoes&page=43', BASEURLPAGINATION);
}

main().then(console.error);
