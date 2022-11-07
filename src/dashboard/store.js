import EventEmitter from 'eventemitter3';
import { categories, getPapers } from './categories.js';

export default class Store {
  emitter = new EventEmitter();

  appName = 'Hyper-recent Biology Papers'; // TODO: use real title, also html <title>

  selectedCategory = null;
  selectedPapers = null;
  categories = categories;

  selectCategory (category) {
    this.selectedCategory = category;
    this.selectedPapers = getPapers(category);

    document.title = `${this.selectedCategory.name} : ${this.appName}`;

    this.emitter.emit('selectcategory', category);
    this.emitter.emit('update');
  }

  clearCategorySelection () {
    this.selectedCategory = null;
    this.selectedPapers = null;

    document.title = this.appName;

    this.emitter.emit('selectcategory', null);
    this.emitter.emit('clearcategory');
    this.emitter.emit('update');
  }

  selectCategoryByID (id) {
    const category = this.categories.find(cat => cat.id === id);

    if (category) {
      this.selectCategory(category);
    } else {
      this.clearCategorySelection();
    }
  }
}
