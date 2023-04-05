import { h } from 'preact';
import { Link } from 'preact-router/match';
import CategoryCard from './category-card.js';
import { format, sub, isWithinInterval } from 'date-fns';

function Paper ({ paper }) {
  return h('div', { class: 'paper' }, [
    h('a', { href: paper.finalURL, target: '_blank', class: 'paper-link' }, [
      h('div', { class: 'paper-read' }),
      h('div', { class: 'paper-title' }, paper.title)
    ]),
    h('div', { class: 'paper-authors' }, paper.authors),
    h('div', { class: 'paper-date' }, paper.date.toISOString().split('T')[0]),
    h('div', { class: 'paper-journal' }, paper.journal),
    h('div', { class: 'paper-brief' }, paper.brief)
  ]);
}

function findRelativeDate (papers, range) {
  const now = new Date();
  // const today = format(now, 'yyyy-MM-dd');
  const displayPapers = [];

  for (const paper of papers) {
    const paperDate = new Date(paper.date);

    if (range === 'today' && isWithinInterval(paperDate, { start: now, end: now })) { // Today's papers
      displayPapers.push(paper);
    } else if (range === 'days' && isWithinInterval(paperDate, { start: sub(now, { days: 4 }), end: sub(now, { days: 1 }) })) { // Papers from 4 days ago
      displayPapers.push(paper);
    } else if (range === 'week' && isWithinInterval(paperDate, { start: sub(now, { weeks: 1 }), end: sub(now, { days: 4 }) })) { // Papers from past week
      displayPapers.push(paper);
    } else if (range === 'month' && isWithinInterval(paperDate, { start: sub(now, { months: 1 }), end: sub(now, { weeks: 1 }) })) { // Rest of the papers from the past month
      displayPapers.push(paper);
    } else {
      console.log('didnt work');
    }
  }

  // if (range === 'today') {
  //   console.log('today date: ' + today);
  //   for (const paper of papers) {
  //     const paperDate = format(paper.date, 'yyyy-MM-dd');
  //     console.log('PAPER DATE: ' + paperDate);
  //     if (paperDate === today) {
  //       displayPapers.push(paper);
  //     }
  //   }
  // } else if (range === 'days') { // within the past 4 days
  //   const startOffset = { days: 4 };
  //   const start = format(sub(now, startOffset), 'yyyy-MM-dd');

  //   for (const paper of papers) {
  //     const paperDate = format(paper.date, 'yyyy-MM-dd');
  //     if (paperDate >= start && paperDate < today) {
  //       displayPapers.push(paper);
  //     }
  //   }
  // } else if (range === 'week') {
  //   const startOffset = { weeks: 1 };
  //   const endOffset = { days: 4 };
  //   const start = format(sub(now, startOffset), 'yyyy-MM-dd');
  //   const end = format(sub(now, endOffset), 'yyyy-MM-dd');

  //   for (const paper of papers) {
  //     const paperDate = format(paper.date, 'yyyy-MM-dd');
  //     if (paperDate >= start && paperDate < end) { // within the past week
  //       displayPapers.push(paper);
  //     }
  //   }
  // } else {
  //   const startOffset = { months: 1 };
  //   const endOffset = { weeks: 1 };
  //   const start = format(sub(now, startOffset), 'yyyy-MM-dd');
  //   const end = format(sub(now, endOffset), 'yyyy-MM-dd');

  //   for (const paper of papers) {
  //     const paperDate = format(paper.date, 'yyyy-MM-dd');
  //     if (paperDate >= start && paperDate < end) { // everything else within the past month
  //       displayPapers.push(paper);
  //     }
  //   }
  // }
  return displayPapers;
}

export default function CategoryResultsScreen ({ store }) {
  const { selectedPapers, selectedCategory } = store;
  const todayPapers = findRelativeDate(selectedPapers, 'today');
  console.log('TODAYS PAPERS: ');
  console.log(todayPapers);

  const fewDaysPapers = findRelativeDate(selectedPapers, 'days');
  const weekPapers = findRelativeDate(selectedPapers, 'week');
  const monthPapers = findRelativeDate(selectedPapers, 'month');

  return h('div', { class: 'category-results-screen' }, [
    h(Link, { href: '/', class: 'category-results-reset link' }, '< Select a different topic'), // TODO: < should be a nice SVG icon
    h('div', { class: 'category-results-info' }, [ // TODO: better css for mobile
      CategoryCard({ category: selectedCategory, store, selectable: false, includeName: false }),
      h('div', { class: 'category-results-details' }, [
        h('div', { class: 'category-results-title' }, `${selectedCategory.name}`),
        h('div', { class: 'category-results-date' }, 'Updated yesterday'),
        h('div', { class: 'category-results-description' }, selectedCategory.description)
      ])
    ]),
    h('div', { class: 'papers-today' }, [
      h('h2', { class: 'papers-today-title' }, 'New papers today'),
      h('div', { class: 'papers' }, todayPapers.map(paper => h(Paper, { paper })))
    ]),
    h('div', { class: 'papers-last-few-days' }, [
      h('h2', { class: 'papers-last-few-days-title' }, 'Papers in the last few days'),
      h('div', { class: 'papers' }, fewDaysPapers.map(paper => h(Paper, { paper })))
    ]),
    h('div', { class: 'papers-last-week' }, [
      h('h2', { class: 'papers-last-week-title' }, 'Papers in the last week'),
      h('div', { class: 'papers' }, weekPapers.map(paper => h(Paper, { paper })))
    ]),
    h('div', { class: 'papers-this-month' }, [
      h('h2', { class: 'papers-this-month-title' }, 'Papers in the past month'),
      h('div', { class: 'papers' }, monthPapers.map(paper => h(Paper, { paper })))
    ])
  ]);
}
