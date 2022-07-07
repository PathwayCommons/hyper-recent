import fetch from 'node-fetch';

const SRC_BIORXIV = 'biorxiv';
const SRC_MEDRXIV = 'medrxiv';
const BASE_URL = 'https://api.biorxiv.org/pubs';
const STATUS_OK = 'ok';

async function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

function validateSource(source) {
  if (source !== SRC_BIORXIV && source !== SRC_MEDRXIV) {
    throw new Error(`Unsupported source: ${source}`);
  }
}

function validateDate(dateStr) {
  if (dateStr == null || !dateStr.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
    throw new Error(`Unsupported date (must use YYYY-MM-DD): ${dateStr}`);
  }
}

export async function download(source, fromDate, toDate) {
  validateSource(source);
  validateDate(fromDate);
  validateDate(toDate);

  let cursor = 0;
  let articles = [];
  let data;
  let totalArticleCount;
  let startTime = Date.now();

  do {
    const res = await fetch(`${BASE_URL}/${source}/${fromDate}/${toDate}/${cursor}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': 'api.biorxiv.org',
        'Pragma': 'no-cache',
        'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36'
      }
    });

    data = await res.json();

    const { collection, messages } = data;
    const firstMessage = messages[0];
    const status = firstMessage.status;

    if (status !== STATUS_OK) {
      throw new Error('Bad status in response from Biorxiv');
    }

    articles.push(...collection);

    cursor += collection.length;
    totalArticleCount = firstMessage?.total ?? collection.length;

    // await delay(100);
  } while (articles.length < totalArticleCount);

  let endTime = Date.now();
  let duration = (endTime - startTime) / 1000; // seconds

  // console.info(`Downloaded ${articles.length} articles in ${duration}s`);

  return articles;
}
