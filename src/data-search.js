#! /usr/bin/env node
import _ from 'lodash';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { format, sub } from 'date-fns';
import { download } from './download.js';
import { Search } from './search.js';
import { DATA_CONFIG, DATA_FILE } from './config.js';

/**
 * Download preprint data from BiorXiv and MedrXiv servers and perform search for preprints in each topic.
 * @returns {collection}, a JSON array of search results for each set topic.
 */
export async function getData () {
  const formatJSON = obj => JSON.stringify(obj, null, 2);
  const writeFormattedJSON = async (obj, file) => await writeFile(file, formatJSON(obj));

  // Set dates for past month
  const now = new Date();
  const startOffset = { months: 1 };
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

    // Filter for multiple versions of the same paper
    const unique = [];
    for (const paper of papers) {
      const exists = unique.find((obj) => obj.title === paper.title);

      if (!exists) {
        const allVersions = papers.filter((obj) => obj.title === paper.title);
        if (allVersions.length > 1) {
          const max = allVersions.reduce((maxObj, obj) => {
            if (obj.version > maxObj.version) {
              return obj;
            } else {
              return maxObj;
            }
          }, { version: -Infinity });
          unique.push(max);
        } else {
          unique.push(paper);
        }
      }
    }

    // Find and save final link for each paper's DOI
    for (const paper of unique) {
      const finalURL = `https://www.${paper.server}.org/content/${paper.doi}v${paper.version}`;
      paper.finalURL = finalURL;
    }
    return _.assign({}, config, { unique });
  };
  const collection = await Promise.all(config.map(doSearches));

  // Output all search result papers into data.json
  await writeFormattedJSON(collection, DATA_FILE);
}

getData();
