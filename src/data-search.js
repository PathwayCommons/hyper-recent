#! /usr/bin/env node
import _ from 'lodash';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { format, sub } from 'date-fns';
import { download } from './download.js';
import { Search } from './search.js';
import { DATA_CONFIG, DATA_FILE } from './config.js';
import { getFinalURL } from './redirects.js';

/**
 * Download preprint data from BiorXiv and MedrXiv servers and perform search for preprints in each topic.
 * @returns {collection}, a JSON array of search results for each set topic.
 */
export async function getData () {
  const formatJSON = obj => JSON.stringify(obj, null, 2);
  const writeFormattedJSON = async (obj, file) => await writeFile(file, formatJSON(obj));

  // Set dates for past month
  const now = new Date();
  const startOffset = { days: 1 };
  const start = format(sub(now, startOffset), 'yyyy-MM-dd');
  const end = format(now, 'yyyy-MM-dd');

  // Reading config file for list of topics
  const config = JSON.parse(fs.readFileSync(DATA_CONFIG));

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

    // Find and save final link for each paper's DOI
    _.forIn(papers, async function (value, key) {
      const finalURL = `https://www.biorxiv.org/content/${value.doi}v${value.version}`;
      value.finalURL = finalURL;
    });
    return _.assign({}, config, { papers });
  };
  const collection = await Promise.all(config.map(doSearches));

  // Output all search result papers into data.json
  await writeFormattedJSON(collection, DATA_FILE);
}

getData();
