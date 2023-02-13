#! /usr/bin/env node

// here we will convert the search.sh script into JS
import { format, sub } from 'date-fns';
// import fs from 'fs';
import { options } from 'preact';
import { download } from './cli.js';

const CATEGORY_ID = 'alzheimers-disease';
const DATA_DIRECTORY = '../example-data';

const MEDRXIV_SOURCE = 'medrxiv';
const BIORXIV_SOURCE = 'biorxiv';

const now = new Date();
const startOffset = { days: 1 };
const START_DATE = format(sub(now, startOffset), 'yyyy-MM-dd');
const END_DATE = format(now, 'yyyy-MM-dd');

console.log(`Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
download(START_DATE, END_DATE, BIORXIV_SOURCE); // not sure if the 3rd param is correct here
// // is just calling the download function enough? do we add something to account for the --output part in the script

console.log(`Fetching from ${MEDRXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
// download(START_DATE, END_DATE, MEDRXIV_SOURCE); // not sure if the 3rd param is correct here
// // is just calling the download function enough? do we add something to account for the --output part in the script

// console.log('Combining results...');
// const DATA_FILE = `${DATA_DIRECTORY}/${END_DATE}.json`;
// const dataFile = fs.openSync(DATA_FILE, 'w'); // unsure about this solution as well to create a new file

// const QUERY = 'alzheimer';
// const OUTPUT_FILE = `${DATA_DIRECTORY}/${CATEGORY_ID}.json`;
// console.log(`Searching for ${QUERY}`);
// const searchHits = search(QUERY, true); // also unsure about param 2
// const numSearchHits = Object.keys(searchHits).length;
// console.log(`Found ${numSearchHits} hits`);
