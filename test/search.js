import { expect } from 'chai';
import fs from 'fs';
import _ from 'lodash';

import { Search } from '../src/search.js';

const normalizedRangeData = fs.readFileSync('test/data/normalized_range_20220622.json');

describe('search module', function () {
  let searcher = new Search();
  describe('strict keywords', function () {
    const strictSearch = async queryString => searcher.search(queryString, { combineWith: 'AND' });

    before(async function () {
      const collection = JSON.parse(normalizedRangeData);
      searcher = new Search();
      await searcher.articles(collection);
    });

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
  });
});
