#! /usr/bin/env node

// here we will convert the search.sh script into JS
import { format, sub } from 'date-fns';
import fs from 'fs';
import { download, search, sendOutput } from './cli.js';

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
const COMBINED_FILE = `${DATA_DIRECTORY}/${END_DATE}.json`;
const OUTPUT_FILE = `${DATA_DIRECTORY}/${CATEGORY_ID}.json`;

// Getting all latest articles from BiorXiv
console.log(`Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
fs.open(BIORXIV_FILE, 'w', function (err, file) { // consider changing the callback function if needed
  if (err) throw err;
  console.log('Saved!');
});
const bioOptions = {
  source: BIORXIV_SOURCE,
  output: BIORXIV_FILE
};
const bioData = await download(START_DATE, END_DATE, bioOptions);

// Getting all latest articles from MedrXiv
console.log(`Fetching from ${MEDRXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
fs.open(MEDRXIV_FILE, 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});
const medOptions = {
  source: MEDRXIV_SOURCE,
  output: MEDRXIV_FILE
};
const medData = await download(START_DATE, END_DATE, medOptions);

// Creating a JSON with all the results, both sources combined
console.log('Combining results...');
fs.open(COMBINED_FILE, 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});
const combinedData = {
  ...bioData,
  ...medData
};
const combinedOptions = {
  output: COMBINED_FILE
};
sendOutput(combinedData, combinedOptions);

// Search for the QUERY keyword in all the downloaded articles & compile the related articles
const QUERY = 'alzheimer';
fs.open(OUTPUT_FILE, 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});
const outputOptions = {
  input: COMBINED_FILE,
  output: OUTPUT_FILE
};
console.log(`Searching for ${QUERY}`);
const searchHits = await search(QUERY, outputOptions);
const numSearchHits = Object.keys(searchHits).length;
console.log(`Found ${numSearchHits} hits`);
