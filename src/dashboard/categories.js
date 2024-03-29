import data from './data.json';

const toDate = o => {
  o.date = new Date(o.date);
  return o;
};
const byDate = (a, b) => { return b.date - a.date; };
export const categories = data.map(({ id, name, description, img }) => ({ id, name, description, img }));
export const getPapers = ({ id }) => {
  let papers = [];
  const category = data.find(cat => cat.id === id);
  papers = category && category.papers.map(toDate).sort(byDate);
  return papers;
};

export default categories;
