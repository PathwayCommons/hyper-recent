import { h } from 'preact';
import { Link } from 'preact-router/match';
import CategoryCard from './category-card.js';

function Paper ({ paper }) {
  return h('div', { class: 'paper' }, [
    h('a', { href: `https://doi.org/${paper.doi}`, target: '_blank', class: 'paper-link' }, [
      h('div', { class: 'paper-read' }),
      h('div', { class: 'paper-title' }, paper.title)
    ]),
    h('div', { class: 'paper-authors' }, paper.authors),
    h('div', { class: 'paper-date' }, paper.date.toISOString().split('T')[0]),
    h('div', { class: 'paper-journal' }, paper.journal),
    h('div', { class: 'paper-brief' }, paper.brief)
  ]);
}

export default function CategoryResultsScreen ({ store }) {
  const { selectedPapers, selectedCategory } = store;

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
    h('div', { class: 'papers' }, selectedPapers.map(paper => h(Paper, { paper })))
  ]);
}
