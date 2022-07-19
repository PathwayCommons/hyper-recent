import chalk from 'chalk';

function stats(articles, searchQuery, options) {
  return chalk.magenta(
    `Found ${articles.length} articles` +
    (searchQuery ? ` for "${searchQuery}"` : '') +
    (options.strict ? ' with strict filtering' : '') + 
    (options.reverse ? ' in reversed order' : '') +
    '.'
  );
}

function highlight(text, term) {
  const regex = new RegExp('(' + term + ')', 'gi');
  
  return text.replace(regex, chalk.magenta('$1'));
}

export function prettyArticle(article, searchQuery = '', options) {
  let title = article.title;
  let abstract = article.abstract;
  
  const searchTerms = (searchQuery ?? '').split(/\s+/);

  for (const term of searchTerms) {
    title = highlight(title, term);
    abstract = highlight(abstract, term);
  }

  return (
    [
      chalk.yellow(title),
      chalk.green(article.authors),
      chalk.cyan.underline(`https://doi.org/${article.id}`),
      abstract
    ].join('\n')
  );
}

export function prettyArticles(articles, searchQuery, options) {
  return [
    stats(articles, searchQuery, options),

    (articles
      .map(article => prettyArticle(article, searchQuery, options))
      .join('\n\n')
    ),

    stats(articles, searchQuery, options)
  ].join('\n\n');
}

