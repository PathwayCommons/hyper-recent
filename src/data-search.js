#! /usr/bin/env node

import { format, sub } from 'date-fns';
import fs from 'fs/promises';
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

async function getArticles (articleSource, startDate, endDate, fileName, optionsName) {
  try {
    console.log(`Fetching from ${articleSource} between ${startDate} and ${endDate}`);
    fs.open(fileName, 'w');
    optionsName = {
      source: articleSource,
      output: fileName
    };
    const data = await download(startDate, endDate, optionsName);
    return data;
  } catch (err) {
    console.error(`Error in download: ${err}`);
    throw err;
  }
}

async function combineArticles (fileName, dataArray1, dataArray2) {
  console.log('Combining results...');
  fs.open(fileName, 'w');
  const combinedData = dataArray1.concat(dataArray2);
  const combinedOptions = {
    output: fileName
  };
  await sendOutput(combinedData, combinedOptions);
}

async function keywordSearch (query, searchFile, outputFile, options) {
  fs.open(outputFile, 'w');
  options = {
    input: searchFile,
    output: outputFile
  };
  console.log(`Searching for ${query}`);
  const searchHits = await search(query, options);
  const numSearchHits = searchHits.length;
  console.log(`Found ${numSearchHits} hits`);
}

// Getting all latest articles from BiorXiv
let bioOptions;
const bioData = await getArticles(BIORXIV_SOURCE, START_DATE, END_DATE, BIORXIV_FILE, bioOptions);

// Getting all latest articles from MedrXiv
let medOptions;
const medData = await getArticles(MEDRXIV_SOURCE, START_DATE, END_DATE, MEDRXIV_FILE, medOptions);

// Creating a JSON with all the results, both sources combined
await combineArticles(COMBINED_FILE, bioData, medData);

// Search for the QUERY keyword in all the downloaded articles & compile the related articles
const QUERY = 'alzheimer';
let outputOptions;
await keywordSearch(QUERY, COMBINED_FILE, OUTPUT_FILE, outputOptions);
