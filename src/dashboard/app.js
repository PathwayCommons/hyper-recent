import { h, Component } from 'preact';
import Router from 'preact-router';
import Store from './store.js';
import CategorySelectionScreen from './category-selection-screen.js';
import CategoryResultsScreen from './category-results-screen.js';

export default class App extends Component {
  constructor (props) {
    super(props);

    const store = new Store();

    this.state = { store };

    store.emitter.on('update', () => {
      this.setState({ store }); // rerender
    });
  }

  render () {
    const { store } = this.state;

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
