// import ad from '../../example-data/alzheimer-disease.json';
import ad from '../../example-data/alzheimer-diagnosis.json';

const toDate = o => {
  o.date = new Date(o.date);
  return o;
};
const alzheimerDiagnosis = ad.map(toDate);
const byDate = (a, b) => { return b.date - a.date; };
export const categories = [
  {
    id: 'alzheimer-diagnosis',
    name: 'Alzheimer\'s Disease: Diagnosis'
  }
];

export const getPapers = ({ id, limit = 25 }) => {
  let papers;

  switch (id) {
    case 'alzheimer-diagnosis':
      papers = alzheimerDiagnosis;
      break;
    default:
      throw new Error('No matching category');
  };

  papers = papers.sort(byDate);
  papers = papers.slice(1, limit);
  return papers;
};

export default categories;
