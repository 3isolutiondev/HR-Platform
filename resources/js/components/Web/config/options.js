export const maritalStatus = ['single', 'married', 'separated', 'widow', 'divorced'];
export const date = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31
];
export const month = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];
export const year = { min: 1945, max: new Date().getFullYear() };
export const nationalities = [
  'afghan',
  'albanian',
  'algerian',
  'argentinian',
  'australian',
  'austrian',
  'bangladeshi',
  'belgian',
  'bolivian',
  'botswanan',
  'brazilian',
  'bulgarian',
  'cambodian',
  'cameroonian',
  'canadian',
  'chilean',
  'chinese',
  'colombian',
  'costa rican',
  'croatian',
  'cuban',
  'czech',
  'danish',
  'dominican',
  'ecuadorian',
  'egyptian',
  'salvadorian',
  'english',
  'estonian',
  'ethiopian',
  'fijian',
  'finnish',
  'french',
  'german',
  'ghanaian',
  'greek',
  'guatemalan',
  'haitian',
  'honduran',
  'hungarian',
  'icelandic',
  'indian',
  'indonesian',
  'iranian',
  'iraqi',
  'irish',
  'israeli',
  'italian',
  'jamaican',
  'japanese',
  'jordanian',
  'kenyan',
  'kuwaiti',
  'lao',
  'latvian',
  'lebanese',
  'libyan',
  'lithuanian',
  'malaysian',
  'malian',
  'maltese',
  'mexican',
  'mongolian',
  'moroccan',
  'mozambican',
  'namibian',
  'nepalese',
  'dutch',
  'new zealander',
  'nicaraguan',
  'nigerian',
  'nigerian',
  'norwegian',
  'pakistani',
  'panamanian',
  'paraguayan',
  'peruvian',
  'philippine',
  'polish',
  'portuguese',
  'romanian',
  'russian',
  'saudi',
  'scottish',
  'senegalese',
  'serbian',
  'singaporean',
  'slovak',
  'south african',
  'korean',
  'spanish',
  'sri lankan',
  'sudanese',
  'swedish',
  'swiss',
  'syrian',
  'taiwanese',
  'tajikistani',
  'thai',
  'tongan',
  'tunisian',
  'turkish',
  'ukrainian',
  'emirati',
  'british',
  'american',
  'uruguayan',
  'venezuelan',
  'vietnamese',
  'welsh',
  'zambian',
  'zimbabwean'
];
export const genderData = [
  { value: 1, label: 'Male' },
  { value: 0, label: 'Female' },
  { value: 2, label: 'Do not want to specify' },
  { value: 3, label: 'other' }
];
export const yesNoData = [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }];
export const statusData = [{ value: 0, label: 'Draft' }, { value: 1, label: 'Open' },
{ value: 2, label: 'Expire' }, { value: 3, label: 'Close' }];
export const statusDataForm = [{ value: 0, label: 'Draft' }, { value: 1, label: 'Open' }]
export const statusDataFormCloseJob = [{ value: 0, label: 'Draft' }, { value: 1, label: 'Open' },
{ value: 3, label: 'Close' }];
export const closeSurgeAlertOptions = [
 { value: 'filled-by-iMMAP', label: 'Close the Alert (Position filled by iMMAP)' },
 { value: 'not-filled-by-iMMAP', label: 'Close the Alert (Position is not filled by iMMAP)' }
];
export const allFieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'select', label: 'Select' },
  { value: 'autocomplete', label: 'Autocomplete' }
];
export const allSkillModels = [
  { value: 'skills', label: 'Skills' },
  { value: 'languages', label: 'Language' },
  { value: 'sectors', label: 'Sector' },
  { value: 'degree-levels', label: 'Degree Level' }
];

export const RosterTabValues = [
  { value: 'all', label: 'All Roster Member' },
  { value: 'validated', label: 'Accepted Roster Member' }
];

export const statusOptions = [
  { value: 'International Consultant', label: 'International Consultant', isInternational: 1 },
  { value: 'HQ Employee', label: 'HQ Employee', isInternational: 1 },
  { value: 'National Employee', label: 'National Employee', isInternational: 0 },
  { value: 'National Consultant', label: 'National Consultant', isInternational: 0 },
  { value: 'Intern', label: 'Intern', isInternationalAndNational: true },
  { value: 'Volunteer', label: 'Volunteer', isInternational: 0 }
];

export const security_module_travel_type = [
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'multi-location', label: 'Multi Location' }
];

export const security_module_default_travel_type = [
  { value: 'one-way-trip', label: 'One Way Trip' },
  { value: 'multi-location', label: 'Multi Location' }
];

export const security_module_all_travel_type = [
  { value: 'one-way-trip', label: 'One Way Trip' },
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'multi-location', label: 'Multi Location' }
];

export const security_module_only_multilocation = [
  { value: 'multi-location', label: 'Multi Location' }
];

export const organizationOptions = [
  { value: 'iMMAP', label: 'N/A'},
  { value: 'UNICEF', label: 'UNICEF'},
  { value: 'WHO', label: 'WHO' },
  { value: 'WFP', label: 'WFP' },
  { value: 'FAO', label: 'FAO' },
  { value: 'IOM', label: 'IOM' },
  { value: 'UNOCHA', label: 'UNOCHA' },
  { value: 'UNDP', label: 'UNDP' },
  { value: 'UNFPA', label: 'UNFPA' },
  { value: 'UNHCR', label: 'UNHCR' },
  { value: 'UN WOMEN', label: 'UN WOMEN' },
  { value: 'MERCY CORPS', label: 'MERCY CORPS' },
]

export const quarter = [
  { value: 'Q1', label: 'Q1' },
  { value: 'Q2', label: 'Q2' },
  { value: 'Q3', label: 'Q3' },
  { value: 'Q4', label: 'Q4' },
];

export const campaignYears = () => {
  const startYear = new Date().getFullYear();
  let years = [
    { value: startYear, label: startYear }
  ];

  for(var i = 1; i <= 5; i++) {
    const year = startYear + i;
    years.push({ value: year, label: year })
  }

  return years;
}

export const clusterOptions = [
  { value: 'Agriculture', label: 'Agriculture'},
  { value: 'CCCM', label: 'CCCM'},
  { value: 'Child Protection', label: 'Child Protection' },
  { value: 'Coordination', label: 'Coordination' },
  { value: 'Education', label: 'Education' },
  { value: 'Emergency Telecom', label: 'Emergency Telecom' },
  { value: 'Food Security', label: 'Food Security' },
  { value: 'Food Security & Nutrition', label: 'Food Security & Nutrition' },
  { value: 'GBV Sub Cluster', label: 'GBV Sub Cluster' },
  { value: 'Health', label: 'Health' },
  { value: 'Logistic', label: 'Logistic' },
  { value: 'Mine Action', label: 'Mine Action' },
  { value: 'Nutrition', label: 'Nutrition' },
  { value: 'Protection', label: 'Protection' },
  { value: 'Shelter & NFI', label: 'Shelter & NFI' },
  { value: 'WASH', label: 'WASH' },
  { value: 'Other', label: 'Other' },
]

export const testStepOptions = [{ value: 'before', label: 'Before Interview Step' }, { value: 'after', label: 'After Interview Step' }]
export const skillCategories = [
  {label: 'Technical', value: 'technical'},
  {label: 'Soft', value: 'soft'},
  {label: 'Software', value: 'software'}
]
