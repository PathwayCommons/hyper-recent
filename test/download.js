import { expect } from 'chai';
import nock from 'nock';
import fs from 'fs';
import { getNormalized } from './../src/download.js';

const serverResponseRecentOK = fs.readFileSync('test/data/server_response_recent_ok.json');
const serverResponseNoposts = fs.readFileSync('test/data/server_response_noposts.json');

describe('download module', function () {
  describe('getNormalized function', function () {
    it('When receiving data, is correctly normalized', async () => {
      const N = 10;
      nock('https://api.biorxiv.org/details/biorxiv')
        .get(`/${N}`)
        .reply(200, serverResponseRecentOK);
      const recentUrl = `https://api.biorxiv.org/details/biorxiv/${N}`;

      const { count, cursor, total, error, collection } = await getNormalized(recentUrl);
      expect(error).to.equal(null);
      expect(count).to.equal(N);
      expect(total).to.equal(N);
      expect(cursor).to.equal(0);
      expect(collection).to.have.lengthOf(N);
    });

    it('When bad param, response has error', async () => {
      const N = -1;
      nock('https://api.biorxiv.org/details/biorxiv')
        .get(`/${N}`)
        .reply(200, serverResponseNoposts);
      const recentUrl = `https://api.biorxiv.org/details/biorxiv/${N}`;

      const { count, cursor, total, error, collection } = await getNormalized(recentUrl);
      expect(error).not.to.equal(null);
      expect(count).to.equal(0);
      expect(total).to.equal(0);
      expect(cursor).to.equal(0);
      expect(collection).to.have.lengthOf(0);
    });
  });
});
