import MiniSearch from 'minisearch';

const DEFAULT_SEARCH_OPTIONS = {
  combineWith: 'OR'
};

/**
 * An interface for finding articles via text search.
 */
export class Search {
  constructor () {
    this.miniSearch = new MiniSearch({
      fields: ['title', 'authors', 'category', 'abstract'], // fields to index for full-text search
      storeFields: ['title', 'authors', 'category', 'abstract'] // fields to return with search results
    });
  }

  /**
   * Specify the raw article data from Biorxiv.
   * @param {JSON} json The JSON payload from Biorxiv.
   */
  async articles (json) {
    const collection = json;

    for (const entry of collection) {
      entry.id = entry.doi; // minisearch requires an id field
    }

    this.miniSearch.removeAll();
    await this.miniSearch.addAllAsync(collection);
  }

  /**
   * Do a search query.
   * @param {String} queryString A string that contains the space-separated search terms.
   * @returns {JSON} A JSON payload of search results.
   */
  async search (queryString, options) {
    options = Object.assign({}, DEFAULT_SEARCH_OPTIONS, options);

    return this.miniSearch.search(queryString, options);
  }
}
