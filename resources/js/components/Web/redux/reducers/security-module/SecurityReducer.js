import {
  SECURITY_ON_CHANGE, TRAVEL_APPROVAL_REQUESTS
} from '../../types/security-module/securityTypes'
import { defaultApprovedTravel } from '../../../config/general';


const initialState = {
  tab: 0,
  tabOptions: [
    { id: 0, label: 'All Requests', value: 'all' },
    { id: 1, label: 'International (INT)', value: 'tar' },
    { id: 2, label: 'Domestic (DOM)', value: 'mrf' }
  ],
  queryParams: '',
  travel_requests: [],
  firstTime: true,
  isLoading: false,

  // Travel Dashboard State
  queryParamsApprovedTravel: defaultApprovedTravel,
  travel_approval_requests: [],
  loadData: false,
  isLoadingTravelRequestExport: false,

}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SECURITY_ON_CHANGE:
      return {
        ...state,
        [action.name]: action.value
      }
    case TRAVEL_APPROVAL_REQUESTS:
      return {
        ...state,
        [action.name]: action.value
      }
    default:
      return state;
  }
};
