import {
  SET_USER_FILTER,
  RESET_USER_FILTER
} from '../../types/completionstatusTypes';

const initial = {
	search: '',
	steps: [],
  status: [],
  queryParameter: '',
  roles: []
};

export default (state = initial, action = {}) => {
  switch (action.type) {
    case SET_USER_FILTER:

      return {
        ...state,
        [action.name]: action.value
      };
    case RESET_USER_FILTER:
      return initial;
    default:
      return state;
  }
};

