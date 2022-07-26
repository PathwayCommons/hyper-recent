import { expect } from 'chai';
import fs from 'fs';

import stats from './util/stats.js';
import { Search } from '../src/search.js';

const normalizedRangeData = fs.readFileSync('test/data/normalized_range_20220622.json');

describe('search module', function () {
  const searcher = new Search();
  const searchOpts = {
    prefix: true,
    combineWith: 'AND'
  };
  const strictSearch = async queryString => searcher.search(queryString, searchOpts);

  before(async function () {
    const collection = JSON.parse(normalizedRangeData);
    await searcher.articles(collection);
  });
  describe('exact keywords', function () {
    it('returns expected articles for single keyword', async () => {
      const term = 'cognitive';
      const expected = new Set([
        '10.1101/690792',
        '10.1101/2021.02.21.432130',
        '10.1101/2021.10.10.463812',
        '10.1101/2021.11.30.470411',
        '10.1101/2021.12.02.471029',
        '10.1101/2022.06.22.497189',
        '10.1101/2022.06.20.496840',
        '10.1101/2022.06.20.496900'
      ]);

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });

    it('returns expected articles for two keywords', async () => {
      const term = 'cancer patient';
      const expected = new Set([
        '10.1101/2022.03.29.486212',
        '10.1101/2022.06.20.496910',
        '10.1101/2022.06.21.496924',
        '10.1101/2022.06.05.494848'
      ]);

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });
  });

  describe('root keyword of pluralized', function () {
    it('returns expected articles for root keywords', async () => {
      const term = 'cancer patient';
      const expected = new Set([
        '10.1101/2022.03.29.486212',
        '10.1101/2022.06.05.494848',
        '10.1101/2022.06.21.496924',
        '10.1101/2022.06.20.496910'
      ]);

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });
  });

  describe('short phrase', function () {
    it('returns expected articles for exact phrase', async () => {
      const phrase = 'cancer patient';
      const expected = new Set([
        '10.1101/2022.06.21.496924'
      ]);

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { F } = stats(expected, actual);
      expect(F).not.to.equal(0);
    });

    it('returns expected articles for root phrase', async () => {
      const phrase = 'gene regulation';
      const expected = new Set([
        '10.1101/2022.06.20.496844',
        '10.1101/2022.06.21.497104'
      ]);

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { F } = stats(expected, actual);
      expect(F).not.to.equal(0);
    });
  });

  describe('general category', function () {
    it('returns expected articles for a category', async () => {
      const phrase = '"evolutionary biology"';
      const expected = new Set([
        '10.1101/354704',
        '10.1101/2022.06.20.496719',
        '10.1101/2022.06.21.496957',
        '10.1101/2022.06.22.497174'
      ]);

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { F } = stats(expected, actual);
      expect(F).not.to.equal(0);
    });
  });

  describe('title', function () {
    it('returns expected article with exact title', async () => {
      const title = 'Fc-modified SARS-CoV-2 neutralizing antibodies with therapeutic effects in two animal models.';
      const expected = new Set([
        '10.1101/2022.06.21.496751'
      ]);

      const hits = await strictSearch(title);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });

    it('returns expected article with start of title', async () => {
      const title = 'Cancer cells survival is dependent';
      const expected = new Set([
        '10.1101/2022.06.21.496924'
      ]);

      const hits = await strictSearch(title);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });
  });
});
