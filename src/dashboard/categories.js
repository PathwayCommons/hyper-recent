import alzheimersDiagnosis from '../../example-data/alzheimers-diagnosis.json';

const ALZHEIMERS_DIAGNOSIS_ID = 'alzheimers-diagnosis';

const toDate = o => {
  o.date = new Date(o.date);
  return o;
};
const byDate = (a, b) => { return b.date - a.date; };
export const categories = [
  {
    id: ALZHEIMERS_DIAGNOSIS_ID,
    name: 'Alzheimer\'s Disease: Diagnosis'
  }
];

export const getPapers = ({ id, limit = 10 }) => {
  let papers;

  switch (id) {
    case ALZHEIMERS_DIAGNOSIS_ID:
      papers = alzheimersDiagnosis;
      break;
    default:
      console.error(`Unable to load ${id}.`);
  }
  papers = papers.map(toDate).sort(byDate).slice(1, limit);
  return papers;
};

export default categories;
