import { h } from 'preact';
import CategoryCard from './category-card.js';

// TODO: the css should be better for mobile and large empty screens
export default function CategorySelectionScreen ({ store }) {
  const { categories } = store;
  const haveCategories = categories != null && categories.length !== 0;

  return h('div', { class: 'category-selection-screen' }, [
    h('div', { class: 'app-name' }, 'The Digest'),
    h('div', { class: 'app-tagline' }, 'Quick acess to the latest papers in the biomedicine.'),
    h('div', { class: 'categories' }, (haveCategories
      ? categories.map(category => h(CategoryCard, { category, store }))
      : h('div', {}, 'No categories!')
    ))
  ]);
}
