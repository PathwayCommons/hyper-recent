#! /usr/bin/env node

// here we will convert the search.sh script into JS
import { format, sub } from 'date-fns';
import fs from 'fs';
import { download, search } from './cli.js';

const CATEGORY_ID = 'alzheimers-disease';
const DATA_DIRECTORY = '../example-data';

const MEDRXIV_SOURCE = 'medrxiv';
const BIORXIV_SOURCE = 'biorxiv';

const now = new Date();
const startOffset = { months: 1 };
const START_DATE = format(sub(now, startOffset), 'yyyy-MM-dd');
const END_DATE = format(now, 'yyyy-MM-dd');

console.log(`Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}`);
download(START_DATE, END_DATE, BIORXIV_SOURCE);

console.log('Combining results...');
const DATA_FILE = `${DATA_DIRECTORY}/${END_DATE}.json`;
const dataFile = fs.openSync(DATA_FILE, 'w');
