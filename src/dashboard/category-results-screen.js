import { h } from 'preact';
import { Link } from 'preact-router/match';
import CategoryCard from './category-card.js';

function Paper ({ paper }) {
  return h('div', { class: 'paper' }, [
    h('a', { href: `https://doi.org/${paper.doi}`, class: 'paper-link' }, [
      h('div', { class: 'paper-read' }),
      h('div', { class: 'paper-title' }, paper.title)
    ]),
    h('div', { class: 'paper-authors' }, paper.authors),
    h('div', { class: 'paper-date' }, paper.date),
    h('div', { class: 'paper-abstract' }, paper.abstract)
  ]);
}

export default function CategoryResultsScreen ({ store }) {
  const { selectedPapers, selectedCategory } = store;

  return h('div', { class: 'category-results-screen' }, [
    h(Link, { href: '/', class: 'category-results-reset link' }, '< Select a different field'), // TODO: < should be a nice SVG icon
    h('div', { class: 'category-results-info' }, [ // TODO: better css for mobile
      CategoryCard({ category: selectedCategory, store, selectable: false, includeName: false }),
      h('div', { class: 'category-results-details' }, [
        h('div', { class: 'category-results-title' }, `New Papers in ${selectedCategory.name}`),
        h('div', { class: 'category-results-date' }, 'Updated yesterday'),
        h('div', { class: 'category-results-description' }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
      ])
    ]),
    h('div', { class: 'papers' }, selectedPapers.map(paper => h(Paper, { paper })))
  ]);
}
