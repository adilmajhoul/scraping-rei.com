const BASEURLPAGINATION = 'https://www.rei.com/search';

// this is the main

async function main() {
  paginationLoop('?q=Backpacks&page=6', BASEURLPAGINATION);
}

main().then(console.error);
