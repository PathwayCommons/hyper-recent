import EventEmitter from 'eventemitter3';

export default class Store {
  emitter = new EventEmitter();

  appName = 'Hyper-recent Biology Papers'; // TODO: use real title, also html <title>

  selectedCategory = null;
  selectedPapers = null;
  categories = null;

  getPapers ({ id, limit = 20 }) {
    const toDate = o => {
      o.date = new Date(o.date);
      return o;
    };
    const byDate = (a, b) => { return b.date - a.date; };
    let papers = [];
    const category = this.categories.find(cat => cat.id === id);
    papers = category && category.papers.map(toDate).sort(byDate).slice(1, limit);
    return papers;
  };

  selectCategory (category) {
    this.selectedCategory = category;
    this.selectedPapers = this.getPapers(category);

    document.title = `${this.selectedCategory.name} : ${this.appName}`;

    // this.emitter.emit('selectcategory', category);
    // this.emitter.emit('update');
  }

  clearCategorySelection () {
    this.selectedCategory = null;
    this.selectedPapers = null;

    document.title = this.appName;

    // this.emitter.emit('selectcategory', null);
    // this.emitter.emit('clearcategory');
    // this.emitter.emit('update');
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
