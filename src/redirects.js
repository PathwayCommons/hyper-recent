import fetch from 'node-fetch';

export async function getFinalURL (url) {
  const options = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(url, options);
  const finalURl = response.url;
  return finalURl;
}

export async function cacheData (array) {
  const cache = await caches.open('new-cache');
  for (const link in array) {
    const finalURL = getFinalURL(link);
    cache.add(finalURL);
  }
  return cache;
}

// to retrieve all cached links as an array, use cache.matchAll() wherever we're working with caches

export async function deleteCache (cache) {
  const keys = cache.keys();
  keys.array.forEach(request => {
    cache.delete(request);
  });
}

/** we have 2 options: delete the cache every night & recreate it, or only add to cache the new articles for that day
 * for the latter, that would require finding which articles are the newest + deleting cache of outdated artcles
 * for now we can do the first option and move on to the second to improve later on
 */

getFinalURL('https://doi.org/10.1101/2023.03.09.23286958'); // url provided in issue 24 to paper with 5 versions
