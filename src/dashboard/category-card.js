import { h } from 'preact';
import { Link } from 'preact-router/match';

export default function CategoryCard ({ category, store, selectable = true, includeName = true }) {
  const div = h('div', {
    class: `category category-${category.id} category-selectable-${selectable}`
  }, [
    h('div', {
      class: 'category-bg-img',
      style: {
        'background-image': `url("${category.img}")`
      }
    }),
    includeName
      ? h('div', {
        class: 'category-label'
      }, [h('h2', { class: 'category-name' }, category.name)])
      : null
  ]);

  if (selectable) {
    return h(Link, { href: `/${category.id}`, class: 'category-link' }, [div]);
  } else {
    return div;
  }
};
