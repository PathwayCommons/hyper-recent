import { h } from 'preact';
import { Link } from 'preact-router/match';
import CategoryCard from './category-card.js';
import { sub } from 'date-fns';

function Paper ({ paper }) {
  const paperElements = [
    h('a', { href: paper.finalURL, target: '_blank', class: 'paper-link' }, [
      h('div', { class: 'paper-read' }),
      h('div', { class: 'paper-title' }, paper.title)
    ]),
    h('div', { class: 'paper-authors' }, paper.authors, [
      h('span', { class: 'paper.authors tooltip' }, findCorrespondingAuthor(paper), [
        h('span', { class: 'tooltiptext' }, paper.author_corresponding_institution)
      ])
    ])
  ];

  paperElements.push(
    h('div', { class: 'paper-date' }, paper.date.toISOString().split('T')[0]),
    h('div', { class: 'paper-journal' }, paper.journal),
    h('div', { class: 'paper-brief' }, paper.brief)
  );

  return h('div', { class: 'paper' }, paperElements);
}

function findCorrespondingAuthor (paper) {
  const authorsArray = paper.authors.split(';'); // "Prasad, P.; Chongtham, J.; Tripathi, S. C.; Ganguly, N. K.; Mittal, S. A.; Srivastava, T."

  const regexPattern = /\s+/g;
  const corrNameArray = paper.author_corresponding.replace(regexPattern, ' ').split(' '); // "Shivani Arora Mittal" in an array
  const corrLastName = corrNameArray[corrNameArray.length - 1]; // "Mittal" last name

  for (const name of authorsArray) {
    const nameArray = name.split(','); // Tripathi, S. C. into ['Tripathi', 'S. C.']
    const lastName = nameArray[0].trim(); // Tripathi

    if (lastName === corrLastName) { // matches last name of corresponding author
      return name;
    }
  }
}

function findRelativeDate (papers, range) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const daysAgo = sub(now, { days: 4 }).toISOString();
  const weekAgo = sub(now, { weeks: 1 }).toISOString();
  const monthAgo = sub(now, { months: 1 }).toISOString();
  const displayPapers = [];

  for (const paper of papers) {
    const paperDate = paper.date.toISOString().split('T')[0];

    if (range === 'today' && paperDate === today) { // Today's papers
      displayPapers.push(paper);
    } else if (range === 'days' && paperDate >= daysAgo && paperDate < today) { // Papers from 4 days ago
      displayPapers.push(paper);
    } else if (range === 'week' && paperDate >= weekAgo && paperDate < daysAgo) { // Papers from past week
      displayPapers.push(paper);
    } else if (range === 'month' && paperDate >= monthAgo && paperDate < weekAgo) { // Rest of the papers from the past month
      displayPapers.push(paper);
    }
  }
  return displayPapers;
}

export default function CategoryResultsScreen ({ store }) {
  const { selectedPapers, selectedCategory } = store;
  const todayPapers = findRelativeDate(selectedPapers, 'today');
  const fewDaysPapers = findRelativeDate(selectedPapers, 'days');
  const weekPapers = findRelativeDate(selectedPapers, 'week');
  const monthPapers = findRelativeDate(selectedPapers, 'month');

  const resultsScreenElements = [
    h(Link, { href: '/', class: 'category-results-reset link' }, '< Select a different topic'),
    h('div', { class: 'category-results-info' }, [ // TODO: better css for mobile
      CategoryCard({ category: selectedCategory, store, selectable: false, includeName: false }),
      h('div', { class: 'category-results-details' }, [
        h('div', { class: 'category-results-title' }, `${selectedCategory.name}`),
        h('div', { class: 'category-results-date' }, 'Updated yesterday'),
        h('div', { class: 'category-results-description' }, selectedCategory.description)
      ])
    ])
  ];

  if (todayPapers.length !== 0) {
    resultsScreenElements.push(h('div', { class: 'papers-today' }, [
      h('h2', { class: 'papers-today-title' }, 'New papers today'),
      h('div', { class: 'papers' }, todayPapers.map(paper => h(Paper, { paper })))
    ]));
  }
  if (fewDaysPapers.length !== 0) {
    resultsScreenElements.push(h('div', { class: 'papers-last-few-days' }, [
      h('h2', { class: 'papers-last-few-days-title' }, 'Papers in the last few days'),
      h('div', { class: 'papers' }, fewDaysPapers.map(paper => h(Paper, { paper })))
    ]));
  }
  if (weekPapers.length !== 0) {
    resultsScreenElements.push(h('div', { class: 'papers-last-week' }, [
      h('h2', { class: 'papers-last-week-title' }, 'Papers in the last week'),
      h('div', { class: 'papers' }, weekPapers.map(paper => h(Paper, { paper })))
    ]));
  }
  if (monthPapers.length !== 0) {
    resultsScreenElements.push(h('div', { class: 'category-results-papers-this-month' }, [
      h('h2', { class: 'papers-this-month-title' }, 'Papers in the past month'),
      h('div', { class: 'papers' }, monthPapers.map(paper => h(Paper, { paper })))
    ]));
  }

  return h('div', { class: 'category-results-screen' }, resultsScreenElements);
}
