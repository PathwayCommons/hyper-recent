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
