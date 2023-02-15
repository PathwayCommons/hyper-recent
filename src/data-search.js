#! /usr/bin/env node

// here we will convert the search.sh script into JS
import { format, sub } from 'date-fns';
import fs from 'fs';
import { download } from './cli.js';

const CATEGORY_ID = 'alzheimers-disease';
const DATA_DIRECTORY = 'example-data';

const MEDRXIV_SOURCE = 'medrxiv';
const BIORXIV_SOURCE = 'biorxiv';

const now = new Date();
const startOffset = { days: 1 };
const START_DATE = format(sub(now, startOffset), 'yyyy-MM-dd');
const END_DATE = format(now, 'yyyy-MM-dd');

const BIORXIV_FILE = `${DATA_DIRECTORY}/${END_DATE}_${BIORXIV_SOURCE}.json`;
const MEDRXIV_FILE = `${DATA_DIRECTORY}/${END_DATE}_${MEDRXIV_SOURCE}.json`;

// Creating files for each data source
fs.open(BIORXIV_FILE, 'w', function (err, file) { // consider changing the callback function if needed
  if (err) throw err;
  console.log('Saved!');
});
fs.open(MEDRXIV_FILE, 'w', function (err, file) { // consider changing the callback function if needed
  if (err) throw err;
  console.log('Saved!');
});

// Getting latest articles from BiorXiv
console.log(`Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
const options = {
  source: BIORXIV_SOURCE,
  output: BIORXIV_FILE
};
await download(START_DATE, END_DATE, options);

// Getting latest articles from MedrXiv
options.source = MEDRXIV_SOURCE;
options.output = MEDRXIV_FILE;
console.log(`Fetching from ${MEDRXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
await download(START_DATE, END_DATE, options);

console.log('Combining results...');
// const DATA_FILE = `${DATA_DIRECTORY}/${END_DATE}.json`;
// const dataFile = fs.openSync(DATA_FILE, 'w');

// const QUERY = 'alzheimer';
// const OUTPUT_FILE = `${DATA_DIRECTORY}/${CATEGORY_ID}.json`;
// console.log(`Searching for ${QUERY}`);
// const searchHits = search(QUERY, true); // also unsure about param 2
// const numSearchHits = Object.keys(searchHits).length;
// console.log(`Found ${numSearchHits} hits`);
