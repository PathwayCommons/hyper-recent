import chalk from 'chalk';
import { Search } from './search.js';

function stats (articles, searchQuery, options) {
  return chalk.magenta(
    `Found ${articles.length} articles` +
    (searchQuery ? ` for "${searchQuery}"` : '') +
    (options.strict ? ' with strict filtering' : '') +
    (options.reverse ? ' in reversed order' : '') +
    '.'
  );
}

function highlight (text, term) {
  const regex = new RegExp('(' + term + ')', 'gi');

  return text.replace(regex, chalk.magenta('$1'));
}

export function prettyArticle (article, searchQuery = '', options) {
  let title = article.title;
  let abstract = article.abstract;
  let authors = article.authors;
  const date = article.date;
  const category = article.category;
  const server = article.server;

  const searchTerms = Search.tokenize(searchQuery ?? '');

  for (const term of searchTerms) {
    title = highlight(title, term);
    abstract = highlight(abstract, term);
    authors = highlight(authors, term);
  }

  return (
    [
      chalk.yellow(title),
      chalk.green(authors),
      chalk.cyan.underline(`https://doi.org/${article.id}`),
      `${chalk.blue(server)} / ${chalk.blue(category)} - ${chalk.blue(date.toLocaleDateString())}`,
      abstract
    ].join('\n')
  );
}

export function prettyArticles (articles, searchQuery, options) {
  return [
    stats(articles, searchQuery, options),

    (articles
      .map(article => prettyArticle(article, searchQuery, options))
      .join('\n\n')
    ),

    stats(articles, searchQuery, options)
  ].join('\n\n');
}
