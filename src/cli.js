#! /usr/bin/env node

import fs from 'fs';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { program } from 'commander';
import { Search } from './search.js';
import { download as performDownload } from './download.js';
import getStdin from 'get-stdin';
import { prettyArticles } from './pretty.js';

const readFile = promisify(fs.readFile);
const formatJSON = obj => JSON.stringify(obj, null, 2);
const printFormattedJSON = obj => console.log(formatJSON(obj));
const writeFormattedJSON = async (obj, file) => await writeFile(file, formatJSON(obj));
const writeText = async (text, file) => await writeFile(file, text);
const printText = text => console.log(text);
const getPrettyText = (articles, queryString, options) => prettyArticles(articles, queryString, options);

export async function search (queryString, options) {
  const searcher = new Search();

  if (options.array) {
    const articles = options.array;
    await searcher.articles(articles);
  } else {
    const articles = await getInput(options);
    await searcher.articles(articles);
  }

  const res = await searcher.search(queryString, {
    combineWith: options.strict ? 'AND' : 'OR'
  });

  const source = options.source ?? 'biorxiv';

  if (source === 'biorxiv' || source === 'medrxiv') {
    try {
      const formattedRes = await formatData(res);
      await sendOutput(formattedRes, options, queryString);
      return formattedRes;
    } catch (err) {
      console.error(`Error in search: ${err}`);
      throw err;
    }
  } else {
    try {
      await sendOutput(res, options, queryString);
      return res;
    } catch (err) {
      console.error(`Error in search: ${err}`);
      throw err;
    }
  }
}

export async function download (startDate, endDate, options) {
  try {
    const source = options.source ?? 'biorxiv';

    const res = await performDownload(source, startDate, endDate);

    await sendOutput(res, options);

    return res;
  } catch (err) {
    console.error(`Error in download: ${err}`);
    throw err;
  }
}

export async function sendOutput (res, options, queryString) {
  if (options.reverse) {
    res = res.reverse();
  }

  if (options.pretty) {
    if (options.output) {
      await writeText(getPrettyText(res, queryString, options), options.output);
    } else {
      printText(getPrettyText(res, queryString, options));
    }
  } else {
    if (options.output) {
      await writeFormattedJSON(res, options.output);
    } else {
      printFormattedJSON(res);
    }
  }
}

async function getInput (options) {
  if (options.input) {
    const file = options.input;
    const fileData = await readFile(file, { encoding: 'utf8' });

    return JSON.parse(fileData);
  } else {
    const fileData = await getStdin();

    return JSON.parse(fileData);
  }
}

async function formatData (dataArray) {
  try {
    const formattedData = dataArray.map(article => ({
      paperId: article.doi,
      doi: article.doi,
      title: article.title,
      journal: article.server,
      date: article.date,
      brief: null,
      authors: article.authors
    }));
    return formattedData;
  } catch (err) {
    console.error(`Error in formatting data: ${err}`);
    throw err;
  }
}

async function main () {
  (program
    .name('hyper-recent')
    .description('A CLI to do hyper-recent feed analysis')
  );

  (program.command('search')
    .argument('<string>', 'string to use as search query')
    .option('-i, --input <file>', 'JSON input file from Biorxiv (standard input by default)')
    .option('-o, --output <file>', 'JSON output file (standard output by default)')
    .option('-s, --strict', 'must match all terms')
    .option('-p, --pretty', 'pretty print the articles in a human-readable text format')
    .option('-r, --reverse', 'reverse the order of the articles')
    .description('search for hyper-recent articles and send them to standard output or a file')
    .action(search)
  );

  (program.command('download')
    .option('-s, --source <biorxiv|medrxiv>', 'source to download (biorxiv by default)')
    .option('-o, --output <file>', 'JSON output file (standard output by default)')
    .option('-p, --pretty', 'pretty print the articles in a human-readable text format')
    .option('-r, --reverse', 'reverse the order of the articles')
    .argument('<startDate>', 'start date to download (YYYY-MM-DD)')
    .argument('<endDate>', 'end date to download (YYYY-MM-DD)')
    .description('download papers from Biorxiv and send them to standard output or a file')
    .action(download)
  );

  await program.parseAsync();
}

// main();
