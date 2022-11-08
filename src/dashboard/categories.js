import alzheimersDisease from '../../example-data/alzheimers-disease.json';
import alzheimersDiagnosis from '../../example-data/alzheimers-diagnosis.json';
import alzheimersNeuroinflammation from '../../example-data/alzheimers-neuroinflammation.json';
// import alzheimersTherapeutics from '../../example-data/alzheimers-therapeutics.json';

const ALZHEIMERS_DISEASE_ID = 'alzheimers-disease';
const ALZHEIMERS_DIAGNOSIS_ID = 'alzheimers-diagnosis';
const ALZHEIMERS_NEUROINFLAMMATION_ID = 'alzheimers-neuroinflammation';
// const ALZHEIMERS_THERAPEUTICS = 'alzheimers-therapeutics';

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
    description: 'Diagnostics, biomarkers and their relationship to AD phenotypes.'
  },
  {
    id: ALZHEIMERS_NEUROINFLAMMATION_ID,
    name: 'Alzheimer\'s Disease: Neuroinflammation',
    description: 'Relationships between neuroinflammation and amyloid and tau pathologies and its effect on disease trajectory.'
  }
  // ,
  // {
  //   id: ALZHEIMERS_THERAPEUTICS,
  //   name: 'Alzheimer\'s Disease: Therapeutics',
  //   description: 'Nonpharmacological and pharmacological management of the cognitive and behavioral symptoms of AD.'
  // }
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
    case ALZHEIMERS_NEUROINFLAMMATION_ID:
      papers = alzheimersNeuroinflammation;
      break;
    // case ALZHEIMERS_THERAPEUTICS:
    //   papers = alzheimersTherapeutics;
    //   break;
    default:
      console.error(`Unable to load ${id}.`);
  }
  papers = papers.map(toDate).sort(byDate).slice(1, limit);
  return papers;
};

export default categories;
