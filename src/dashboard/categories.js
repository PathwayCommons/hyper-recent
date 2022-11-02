import alzheimersDisease from '../../example-data/alzheimers-disease.json';
import alzheimersDiagnosis from '../../example-data/alzheimers-diagnosis.json';

const ALZHEIMERS_DISEASE_ID = 'alzheimers-disease';
const ALZHEIMERS_DIAGNOSIS_ID = 'alzheimers-diagnosis';

const toDate = o => {
  o.date = new Date(o.date);
  return o;
};
const byDate = (a, b) => { return b.date - a.date; };
export const categories = [
  {
    id: ALZHEIMERS_DISEASE_ID,
    name: 'Alzheimer\'s Disease',
    description: 'Latest research reports about AD in the clinic and at the bench.'
  },
  {
    id: ALZHEIMERS_DIAGNOSIS_ID,
    name: 'Alzheimer\'s Disease: Diagnosis',
    description: 'Diagnostics, biomarkers and phenotypes related to the progression of AD.'
  }
];

export const getPapers = ({ id, limit = 20 }) => {
  let papers;

  switch (id) {
    case ALZHEIMERS_DISEASE_ID:
      papers = alzheimersDisease;
      break;
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
