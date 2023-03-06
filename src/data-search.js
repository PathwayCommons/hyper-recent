#! /usr/bin/env node
import _ from 'lodash';

// import { format, sub } from 'date-fns';
// import fs from 'fs/promises';
// import { download, search, sendOutput } from './cli.js';
import fs from 'fs';
import { download } from './download.js';
import { Search } from './search.js';

// const CATEGORY_ID = 'alzheimers-disease';
// const DATA_DIRECTORY = 'example-data';

// const MEDRXIV_SOURCE = 'medrxiv';
// const BIORXIV_SOURCE = 'biorxiv';

// const now = new Date();
// const startOffset = { days: 1 };
// const START_DATE = format(sub(now, startOffset), 'yyyy-MM-dd');
// const END_DATE = format(now, 'yyyy-MM-dd');

// const BIORXIV_FILE = `${DATA_DIRECTORY}/${END_DATE}_${BIORXIV_SOURCE}.json`;
// const MEDRXIV_FILE = `${DATA_DIRECTORY}/${END_DATE}_${MEDRXIV_SOURCE}.json`;
// const COMBINED_FILE = `${DATA_DIRECTORY}/${END_DATE}.json`;
// const OUTPUT_FILE = `${DATA_DIRECTORY}/${CATEGORY_ID}.json`;

// async function getArticles (articleSource, startDate, endDate, optionsName, fileName) {
//   console.log(`Fetching from ${articleSource} between ${startDate} and ${endDate}`);
//   const fileHandle = await fs.open(fileName, 'w');
//   try {
//     optionsName = {
//       source: articleSource,
//       output: fileName
//     };
//     const data = await download(startDate, endDate, optionsName);
//     return data;
//   } catch (err) {
//     console.error(`Error in download: ${err}`);
//     throw err;
//   } finally {
//     await fileHandle.close();
//   }
// }

// export function combineArticles (dataArray1, dataArray2, fileName) {
//   console.log('Combining results...');
//   // const fileHandle = await fs.open(fileName, 'w');
//   try {
//     const combinedData = dataArray1.concat(dataArray2);
//     // const combinedOptions = {
//     //   output: fileName
//     // };
//     // await sendOutput(combinedData, combinedOptions);
//     return combinedData;
//   } catch (err) {
//     console.error(`Error in combining articles: ${err}`);
//     throw err;
//   }
//   // finally {
//   //   // await fileHandle.close();
//   // }
// }

// async function keywordSearch (query, options, dataArray, searchFile, outputFile, source) {
//   const fileHandle = await fs.open(outputFile, 'w');
//   try {
//     options = {
//       array: dataArray,
//       input: searchFile,
//       output: outputFile,
//       dataSource: source
//     };
//     console.log(`Searching for ${query}`);
//     const searchHits = await search(query, options);
//     const numSearchHits = searchHits.length;
//     console.log(`Found ${numSearchHits} hits`);
//     return searchHits;
//   } catch (err) {
//     console.error(`Error in search output: ${err}`);
//     throw err;
//   } finally {
//     await fileHandle.close();
//   }
// }

// // Getting all latest articles from BiorXiv
// let bioOptions;
// const bioData = await getArticles(BIORXIV_SOURCE, START_DATE, END_DATE, bioOptions, BIORXIV_FILE);

// // Getting all latest articles from MedrXiv
// let medOptions;
// const medData = await getArticles(MEDRXIV_SOURCE, START_DATE, END_DATE, medOptions, MEDRXIV_FILE);

// // Creating a JSON with all the results, both sources combined
// const combinedData = await combineArticles(bioData, medData, COMBINED_FILE);

// // Search for the QUERY keyword in all the downloaded articles & compile the related articles
// const QUERY = 'alzheimer';
// let outputOptions;
// await keywordSearch(QUERY, outputOptions, combinedData, COMBINED_FILE, OUTPUT_FILE);

export async function getData () {
  // set dates for past month
  const start = '2023-03-05';
  const end = '2023-03-06';

  // reading config file for list of topics
  const config = JSON.parse(fs.readFileSync('example-data/data-config.json'));

  // download all recent papers & combine the arrays
  const data = await Promise.all([
    download('biorxiv', start, end),
    download('medrxiv', start, end)
  ]);

  const articles = _.flatten(data);

  // search using list of topic objects from config
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
  return collection;

  // output all search result papers into data json
}

const out = await getData();
console.log(out[0].papers.length);
console.log('done!');
