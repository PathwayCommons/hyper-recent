import { expect } from 'chai';
import fs from 'fs';
import _ from 'lodash';

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
      const phrase = '"gene regulation"';
      const expected = new Set([
        '10.1101/2022.06.21.497104',
        '10.1101/2022.06.20.496844'
      ]);

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });

    it('returns expected articles for root phrase', async () => {
      const phrase = '"cell type"';
      const expected = new Set([
        '10.1101/2021.12.04.471124',
        '10.1101/2022.04.06.487276',
        '10.1101/2022.06.20.496810',
        '10.1101/2022.06.20.496914',
        '10.1101/2022.06.20.496449',
        '10.1101/2022.06.20.496872'
      ]);

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const actual = new Set(dois);
      const { precision, recall } = stats(expected, actual);
      expect(precision).to.equal(1.0);
      expect(recall).to.equal(1.0);
    });
  });
});
