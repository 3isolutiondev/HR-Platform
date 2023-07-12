/** import types needed for this reducer */
import { DELETE_ACCOUNT_ON_CHANGE } from '../../types/profile/deleteAccountTypes';

// define initial state value
const initialState = {
	deleteAttentionOpen: false,
  hasValidDeleteRequest: true,
  deleteRequestLoading: false,
  getDeleteAccountDataLoading: false,
  showDeleteNoteForImmaper: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case DELETE_ACCOUNT_ON_CHANGE:
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
};
