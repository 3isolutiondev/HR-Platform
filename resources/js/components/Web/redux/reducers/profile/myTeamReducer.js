import { STORE_MY_TEAM } from '../../types/profile/myTeamTypes';

const initialState = {
	staffIds: []
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case STORE_MY_TEAM:
			return {
        ...state,
        staffIds: action.value
      }
      default:
        return state;
    }
  }
