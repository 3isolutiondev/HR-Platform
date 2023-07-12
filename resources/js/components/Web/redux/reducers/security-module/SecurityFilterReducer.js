import {
  SECURITY_FILTER_ON_CHANGE,
  SECURITY_FILTER_RESET,
} from '../../types/security-module/securityFilterTypes'

const initialState = {
  search: '',
  searchTemp: '',
  allStatus: [
    { value: "submitted", label: "Submitted" },
    { value: "revision", label: "Need Revision" },
    { value: "disapproved", label: "Disapproved" },
    { value: "approved", label: "Approved" }
  ],
  status: [],
  offices: [],
  allPurposes: [],
  purposes: [],
  allCriticalities: [],
  criticalities: [],
  period_from: '',
  period_to: '',
  errors: {},
  allArchiveTypes: [
    { value: "latest", label: "Latest Travel Request", tooltip: "Travel requests that has been submitted in the past 3 months" },
    { value: "archive", label: "Archive Travel Request", tooltip: "Travel requests that has been submitted more than 3 months ago" },
  ],
  archiveTypes: ['latest'],

  // Travel Dashboard State
  allTravelTypes: [
    { value: "INT", label: "International Air Trips" },
    { value: "DOM AIR", label: "Domestic Air Trips" },
    { value: "DOM GROUND", label: "Domestic Ground Trips" },
    { value: "DOM AIR AND GROUND", label: "Domestic Air And Ground Trips" },
  ],
  hiddenTrip: { value: "1", label: "Show Hidden Trips" },
  immapUs: { value: "1", label: "iMMAP US" },
  immapFrance: { value: "1", label: "iMMAP France" },
  sbpRelated: { value: "1", label: "Highlight Surge Program-Related Trips" },
  travelTypes: ['INT','DOM AIR','DOM GROUND','DOM AIR AND GROUND'],
  showHiddenTrips: 0,
  showImmapUs: 0,
  showImmapFrance: 0,
  showSbpRelated: 0,
  allFromCities:[],
  allToCities:[],
  allInCities: [],
  fromCities: [],
  toCities:[],
  inCities: [],
  date:'null',
  searchImmaper: '',
  searchImmaperTemp: '',
  current_page: 1,
  last_page: 1,
  totalCount: 0,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SECURITY_FILTER_ON_CHANGE:
      return {
        ...state,
        [action.name]: action.value
      }
    case SECURITY_FILTER_RESET:
      return {
        ...state,
        search: '',
        status: [],
        offices: [],
        purposes: [],
        criticalities: [],
        errors: {},
        archiveTypes: ['latest'],
        traveled_from: '',
        traveled_to: '',
        submitted_from: '',
        submitted_to: '',
      }
    default:
      return state;
  }
};
