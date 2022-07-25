import { expect } from 'chai';
import fs from 'fs';
import _ from 'lodash';

import { Search } from '../src/search.js';

const normalizedRangeData = fs.readFileSync('test/data/normalized_range_20220622.json');

describe('search module', function () {
  const searcher = new Search();
  const strictSearch = async queryString => searcher.search(queryString, { combineWith: 'AND' });

  before(async function () {
    const collection = JSON.parse(normalizedRangeData);
    await searcher.articles(collection);
  });
  describe('exact keywords', function () {
    it('returns expected articles for single keyword', async () => {
      const term = 'cognitive';
      const expectedDois = [
        '10.1101/690792',
        '10.1101/2021.02.21.432130',
        '10.1101/2021.10.10.463812',
        '10.1101/2021.11.30.470411',
        '10.1101/2021.12.02.471029',
        '10.1101/2022.06.22.497189',
        '10.1101/2022.06.20.496840',
        '10.1101/2022.06.20.496900'
      ];

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const common = _.intersection(dois, expectedDois);
      expect(common).to.have.lengthOf(expectedDois.length);
    });

    it('returns expected articles for two keywords', async () => {
      const term = 'cancer patient';
      const expectedDois = [
        '10.1101/2022.03.29.486212',
        '10.1101/2022.06.20.496910'
      ];

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const common = _.intersection(dois, expectedDois);
      expect(common).to.have.lengthOf(expectedDois.length);
    });
  });

  describe('root keyword of plural', function () {
    it('returns expected articles for two roots', async () => {
      const term = 'cancer patient';
      const expectedDois = [
        '10.1101/2022.03.29.486212',
        '10.1101/2022.06.05.494848',
        '10.1101/2022.06.21.496924',
        '10.1101/2022.06.20.496910'
      ];

      const hits = await strictSearch(term);
      const dois = hits.map(hit => hit.id);
      const common = _.intersection(dois, expectedDois);
      expect(common).to.have.lengthOf(expectedDois.length);
    });
  });

  describe('short phrase', function () {
    it('returns expected articles for single phrase', async () => {
      const phrase = '"gene regulation"';
      const expectedDois = [
        '10.1101/2022.06.21.497104',
        '10.1101/2022.06.20.496844'
      ];

      const hits = await strictSearch(phrase);
      const dois = hits.map(hit => hit.id);
      const common = _.intersection(dois, expectedDois);
      expect(common).to.have.lengthOf(expectedDois.length);
    });
  });
});
