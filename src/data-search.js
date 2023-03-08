#! /usr/bin/env node
import _ from 'lodash';
import fs from 'fs';
import { format, sub } from 'date-fns';
import { download } from './download.js';
import { Search } from './search.js';
import { writeFormattedJSON } from './cli.js';

/**
 * Download preprint data from BiorXiv and MedrXiv servers and perform search for preprints in each topic.
 * @returns {collection}, a JSON array of search results for each set topic.
 */
export async function getData () {
  // Set dates for past month
  const now = new Date();
  const startOffset = { months: 1 };
  const start = format(sub(now, startOffset), 'yyyy-MM-dd');
  const end = format(now, 'yyyy-MM-dd');

  // Reading config file for list of topics
  const config = JSON.parse(fs.readFileSync('example-data/data-config.json'));

  // Download all recent papers & combine the arrays
  const data = await Promise.all([
    download('biorxiv', start, end),
    download('medrxiv', start, end)
  ]);

  const articles = _.flatten(data);

  // Search using list of topic objects from config
  const searcher = new Search();

  await searcher.articles(articles);
  const doSearches = async config => {
    const { keywords } = config;
    const papers = await searcher.search(keywords, {
      combineWith: 'AND'
    });
    return _.assign({}, config, { papers });
  };
  const collection = await Promise.all(config.map(doSearches));

  // Output all search result papers into data.json
  const fileHandle = await fs.openSync('example-data/data.json', 'w');
  await writeFormattedJSON(collection, 'example-data/data.json');
  fs.closeSync(fileHandle);

  // return collection;
}

await getData();
