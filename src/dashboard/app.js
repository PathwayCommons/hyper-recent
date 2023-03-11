import { h, Component } from 'preact';
import Router from 'preact-router';
import Store from './store.js';
import CategorySelectionScreen from './category-selection-screen.js';
import CategoryResultsScreen from './category-results-screen.js';
import { DATA_URL } from '../config';

export default class App extends Component {
  constructor (props) {
    super(props);

    const store = new Store();

    this.state = {
      store
    };

    store.emitter.on('update', () => {
      this.setState({ store }); // rerender
    });
  }

  async updateStore () {
    const response = await fetch(DATA_URL);
    const categories = await response.json();
    const { store } = this.state;
    store.categories = categories;
    this.setState({ store });
  }

  render () {
    const { store } = this.state;

    // Do not continue if store is empty (could be loader)
    if (!store.categories) return this.updateStore().then(() => null);

    return h(Router, {
      onChange: async e => {
        const url = e.url;

        if (url === '/') {
          store.clearCategorySelection();
        } else {
          store.selectCategoryByID(url.substring(1));
        }
      }
    }, [
      h(CategorySelectionScreen, { store, path: '/' }),
      h(CategoryResultsScreen, { store, path: '/:category' })
    ]);
  }
}
