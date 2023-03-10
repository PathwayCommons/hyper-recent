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
      store,
      data: null
    };

    store.emitter.on('update', () => {
      this.setState({ store }); // rerender
    });
  }

  async fetchData () {
    const response = await fetch(DATA_URL);
    const json = await response.json();
    const { store } = this.state;
    store.categories = json;
    this.setState({ data: json, store });
  }

  render () {
    const { store, data } = this.state;

    return h(Router, {
      onChange: async e => {
        const url = e.url;
        if (!data) await this.fetchData();

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
