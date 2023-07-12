import { SET_IMMAPERS_LIST_DATA } from '../../../types/dashboard/immapers/immapersListTypes';

const initialState = {
  immapers: {data: [], total: 0, current_page: 1},
  openProfile: false,
  id: 0,
  alertOpen: false,
  full_name: '',
  deleteId: 0,
  apiURL: '/api/immapers',
  apiURLUser: '/api/users',
  openDrawer: false,
  loadingText: 'Loading Super Human Profiles...',
  emptyDataText: 'Sorry, No Profile can be found',
  firstLoaded: false,
  isLoading: false,
  count: 0,
  currentPage : 1
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_IMMAPERS_LIST_DATA:
      return {
        ...state,
        [action.name]: action.value
      };
    default:
      return state;
  }
};
