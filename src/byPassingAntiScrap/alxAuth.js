import cheerio from 'cheerio';

const url = 'https://intranet.alxswe.com/projects/1225';
const cookie =
  'userpilot_session_id={"session_id":1712973690783,"last_active":1712973752364}';

fetch(url, {
  headers: {
    Cookie: cookie,
  },
})
  .then((response) => response.text())
  .then((n3tik) => {
    console.log('🚀 ~ .then ~ html:', html);
    const $ = cheerio.load(html);
    const title = $('#curriculum_navigation_content > div > div > h1').text();
    console.log('Title:', title);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
