import { h } from 'preact';
import { Link } from 'preact-router/match';

export default function CategoryCard ({ category, store, selectable = true, includeName = true }) {
  const div = h('div', {
    class: `category category-${category.id} category-selectable-${selectable}`
  }, [
    h('div', {
      class: 'category-bg-img',
      style: {
        // TODO: enable this once the card background images are specified
        // 'background-image': `url("img/${category.id}.jpg")`
      }
    }),
    includeName ? h('div', { class: 'category-name' }, category.name) : null
  ]);

  if (selectable) {
    return h(Link, { href: `/${category.id}`, class: 'category-link' }, [div]);
  } else {
    return div;
  }
};
