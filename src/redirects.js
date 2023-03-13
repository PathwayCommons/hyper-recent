import fetch from 'node-fetch';

export async function checkRedirect (url) {
  const options = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(url, options);
  const path = {
    isRedirected: response.redirected,
    finalURL: response.url
  };
  console.log(path.isRedirected);
  console.log(path.finalURL);
  return path;
}

checkRedirect('https://doi.org/10.1101/2023.03.09.23286958'); // url provided in issue 24 to paper with 5 versions
