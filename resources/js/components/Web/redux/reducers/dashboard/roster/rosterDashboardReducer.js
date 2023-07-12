import { SET_ROSTER_DASHBOARD_FORMDATA } from '../../../types/dashboard/roster/rosterDashboard';

const initialState = {
  rosterDashboard: [],
  openDrawer: false,
  roster_members: [],
  roster: [],
  columns: [
    {
      name: 'id',
      options: {
        display: 'excluded',
        filter: false,
        sort: false
      }
    },
    {
      name: 'Email',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'Full Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'Last Job Position',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'Under Contract or Not',
      options: {
        filter: true,
        sort: true
      }
    },
    // {
    // 	name: 'Available or Not',
    // 	options: {
    // 		filter: false,
    // 		sort: false
    // 	}
    // },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false
      }
    }
  ],
  openProfile: false,
  id: 0,
  alertOpen: false,
  full_name: '',
  deleteId: 0,
  apiURL: '/api/profile-roster-dashboard/',
  apiURLUser: '/api/users/',
  isLoading: false,
  loadingText: 'Loading Data..',
  emptyDataText: 'Sorry, No Data can be found',
  firstLoaded: false,
  isLoading: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ROSTER_DASHBOARD_FORMDATA:
      return {
        ...state,
        [action.name]: action.value
      };

    default:
      return state;
  }
};
