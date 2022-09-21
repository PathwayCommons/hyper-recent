// TODO: define real categories
export const categories = [
  {
    id: 'breast-cancer',
    name: 'Breast Cancer'
    // TODO: descriptions for 'lorem ipsum'?
  },

  {
    id: 'digestive-diseases',
    name: 'Digestive Diseases'
  },

  {
    id: 'cardiology',
    name: 'Cardiology'
  },

  {
    id: 'diabetes',
    name: 'Diabetes'
  },

  {
    id: 'lung-cancer',
    name: 'Lung Cancer'
  },

  {
    id: 'alzheimers',
    name: 'Alzheimer\'s'
  }
];

export const cannedPapers = [];

for (let i = 0; i < 12; i++) {
  cannedPapers.push({
    doi: '10.1101/449009',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    authors: 'Marins, T.; Russo, M.; Rodrigues, E.; Monteiro, M.; Moll, J.; Felix, D.; Bouzas, J.; Arcanjo, H.; Vargas, C. D.; Tovar-Moll, F.',
    author_corresponding: 'Theo  Marins',
    author_corresponding_institution: 'D\'Or Institute for Research and Education',
    date: '2022-07-01',
    version: '3',
    type: 'new results',
    license: 'cc_by_nc_nd',
    category: 'neuroscience',
    jatsxml: 'https://www.biorxiv.org/content/early/2022/07/01/449009.source.xml',
    abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit sed ullamcorper morbi tincidunt. Tristique magna sit amet purus gravida quis blandit turpis cursus. Tortor aliquam nulla facilisi cras fermentum odio. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Eget nunc scelerisque viverra mauris in aliquam sem. Scelerisque viverra mauris in aliquam sem fringilla ut. Consectetur purus ut faucibus pulvinar. Suspendisse in est ante in nibh mauris cursus mattis molestie. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Semper eget duis at tellus. Praesent tristique magna sit amet purus gravida. Tortor at auctor urna nunc id cursus metus aliquam eleifend. Eget sit amet tellus cras adipiscing enim eu turpis egestas. Lectus vestibulum mattis ullamcorper velit sed ullamcorper.',
    published: 'NA',
    server: 'biorxiv'
  });
}

export default categories;
