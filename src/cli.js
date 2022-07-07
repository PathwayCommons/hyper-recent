#! /usr/bin/env node

import fs from 'fs';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { program } from 'commander';
import { Search } from './search.js';
import { download as performDownload } from './download.js';
import getStdin from 'get-stdin';

const readFile = promisify(fs.readFile);
const formatJSON = obj => JSON.stringify(obj, null, 2);
const printFormattedJSON = obj => console.log(formatJSON(obj));
const writeFormattedJSON = async (obj, file) => await writeFile(file, formatJSON(obj));

async function search(queryString, options) {
  const searcher = new Search();
  
  let articles;

  if (options.input) {
    const file = options.input;
    const fileData = await readFile(file, { encoding: 'utf8' });
    
    articles = JSON.parse(fileData);
  } else {
    const fileData = await getStdin();

    articles = JSON.parse(fileData);
  }

  await searcher.articles(articles);

  const res = await searcher.search(queryString, {
    combineWith: options.strict ? 'AND' : 'OR'
  });

  if (options.output) {
    await writeFormattedJSON(res, options.output);
  } else {
    printFormattedJSON(res);
  }
}

async function download(startDate, endDate, options) {
  const source = options.source ?? 'biorxiv';

  const res = await performDownload(source, startDate, endDate);

  if (options.output) {
    await writeFormattedJSON(res, options.output);
  } else {
    printFormattedJSON(res);
  }
}

async function main() {
  ( program
    .name('hyper-recent')
    .description('A CLI to do hyper-recent feed analysis')
  );

  ( program.command('search')
    .argument('<string>', 'string to use as search query')
    .option('-i, --input <file>', 'JSON input file from Biorxiv (standard input by default)')
    .option('-o, --output <file>', 'JSON output file (standard output by default)')
    .option('-s, --strict', 'must match all terms')
    .description('search for hyper-recent articles and send them to standard output or a file')
    .action(search)
  );

  ( program.command('download')
    .option('-s, --source <biorxiv|medrxiv>', 'source to download')
    .option('-o, --output <file>', 'JSON output file (standard output by default)')
    .argument('<startDate>', 'start date to download (YYYY-MM-DD)')
    .argument('<endDate>', 'end date to download (YYYY-MM-DD)')
    .description('download papers from Biorxiv and send them to standard output or a file')
    .action(download)
  );
  
  await program.parseAsync();
}

main();

