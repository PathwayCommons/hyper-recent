import fetch from 'node-fetch';
import _ from 'lodash';

const SERVER_BIORXIV = 'biorxiv';
const SERVER_MEDRXIV = 'medrxiv';
const BASE_URL = 'https://api.biorxiv.org/';
const CONTENT_DETAIL_BASE_URL = `${BASE_URL}details/`;
const STATUS_OK = 'ok';

// ********* Helpers *********** //

const failOnBadStatus = res => {
  if (!res.ok) {
    throw new Error(`Fetch failed due to bad status code : ${res.statusText} : ${res.url}`);
  } else {
    return res;
  }
};

async function safeFetch (url, options) {
  return fetch(url, options).then(failOnBadStatus);
}

function asMetadata (messages, collection) {
  const meta = {
    count: 0,
    cursor: 0,
    total: 0,
    error: null
  };
  const msg = _.first(messages);
  if (msg.status === STATUS_OK) {
    if (_.has(msg, ['count']) && _.has(msg, ['total'])) {
      _.assign(meta, _.pick(msg, ['total', 'count', 'cursor']));
    } else {
      _.set(meta, 'total', collection.length);
      _.set(meta, 'count', collection.length);
    }
  } else {
    _.set(meta, 'error', _.get(msg, ['status']));
  }

  return meta;
}

// async function delay (duration) {
//   return new Promise(resolve => setTimeout(resolve, duration));
// }

function validateServer (server) {
  if (server !== SERVER_BIORXIV && server !== SERVER_MEDRXIV) {
    throw new Error(`Unsupported server: ${server}`);
  }
}

function validateDate (dateStr) {
  if (dateStr == null || !dateStr.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
    throw new Error(`Unsupported date (must use YYYY-MM-DD): ${dateStr}`);
  }
}

function strIsPositiveInteger (str) {
  const num = Number(str);
  if (Number.isInteger(num) && num > 0) {
    return true;
  }
  return false;
}

function validateDay (N) {
  let isValid = false;
  if (typeof N === 'string') {
    let number = N;
    const lastChar = N.slice(-1);
    if (lastChar === 'd') {
      number = N.slice(0, -1);
    }
    isValid = strIsPositiveInteger(number);
  } else {
    isValid = Number.isInteger(N) && N > 0;
  }

  if (!isValid) {
    throw new Error(`Unsupported N (must be positive number/'number[d]'): ${N}`);
  }
}

export async function getNormalized (url, opts) {
  const toJson = res => res.json();
  try {
    const response = await safeFetch(url, opts);
    const { messages, collection } = await toJson(response);
    const metadata = asMetadata(messages, collection);
    return _.assign(metadata, { collection });
  } catch (err) {
    console.error(`Error in getJsonData: ${err}`);
    throw err;
  }
};

/**
 * getRecent
 *
 * Get metadata for latest N(days) articles posted to server
 * NB: Undocumented limits
 *   Case 1: If N is number, maxes out at 100
 *   Case 2: If N is string (postfixed 'd'), maxes out at 2 days
 * @param {string} server one of SERVER_BIORXIV or SERVER_MEDRXIV
 * @param {number|string} N the number of posts OR days of posts (number followed by letter 'd')
 * @param {object} [opts] fetch opts
 * @returns { array } normalized metadata: If N is number, max items is 100, else not sure
 */
async function getRecent (server, N, opts) { // eslint-disable-line no-unused-vars
  validateDay(N);
  return getNormalized(`${CONTENT_DETAIL_BASE_URL}/${server}/${N}`, opts);
};

/**
 * getDateRange
 *
 * Get metadata for articles between the specified dates
 * NB: 'Where metadata for multiple papers is returned, results are paginated with 100 papers served in a call.'
 *   - see {@link http://api.biorxiv.org/}
 * @param {string} server one of SERVER_BIORXIV or SERVER_MEDRXIV
 * @param {string} start date (yyyy-mm-dd)
 * @param {string} end date (yyyy-mm-dd)
 * @param {number} [offset] cursor-like index to start return from (default 0)
 * @param {object} [opts] fetch opts
 * @returns { object } normalized metadata
 */
async function getDateRange (server, start, end, offset = 0, opts) {
  validateDate(start);
  validateDate(end);
  const url = `${CONTENT_DETAIL_BASE_URL}${server}/${start}/${end}/${offset}/json`;
  return getNormalized(url, opts);
};

// ********* Public API *********** //

/**
 * download
 *
 * Get metadata for articles between the specified dates
 * @param {string} server one of SERVER_BIORXIV or SERVER_MEDRXIV
 * @param {string} start date (yyyy-mm-dd)
 * @param {string} end date (yyyy-mm-dd)
 * @returns {array} list of normalized article metadata items
 */
export async function download (server, start, end) {
  validateServer(server);
  const FETCH_OPTS = {
    method: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      Host: 'api.biorxiv.org',
      Pragma: 'no-cache',
      'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36'
    }
  };

  try {
    let N = 0;
    let offset = 0;
    let items = [];

    // use cursor to iterate over total
    do {
      const { count, total, collection } = await getDateRange(server, start, end, offset, FETCH_OPTS);
      N = total;
      offset += count;
      items = items.concat(collection);
    } while (offset < N);

    return items;
  } catch (err) {
    console.error(`Error in download: ${err}`);
    throw err;
  }
}
