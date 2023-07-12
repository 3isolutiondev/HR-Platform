import {
	SET_PROFILE_ROSTER_PROCESS,
	SET_BULK_ROSTER_PROCESS,
	RESET_PROFILE_ROSTER_PROCESS,
	SET_PROFILE_ROSTER_PROCESS_DATA,
	RESET_TAB
} from '../../types/profile/profileTypes';

const initialState = {
	profile_roster_process: [],
	roster_process_empty: false,
	roster_done_empty: true,
	profile_roster_process_data: {},
	status: 'current',
	rosterProcessID: '',
	profileID: '',
	currentRosterProcess: '',
	historyRosterProcess: '',
	verified_roster_count: 0,
	verified_roster_process: [],
  currentRosterProcessLoading: true,
  historyRosterProcessLoading: true,
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_PROFILE_ROSTER_PROCESS:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_ROSTER_PROCESS:
			let profileRosterProcess = { ...state };

			Object.keys(profileRosterProcess).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					profileRosterProcess[key] = action.bulkData[key];
				}
			});

			return profileRosterProcess;
		case RESET_TAB:
			return {
				...state,
				// rosterProcessID: initialState.rosterProcessID,
				currentRosterProcess: initialState.currentRosterProcess,
				historyRosterProcess: initialState.historyRosterProcess
			};
		case RESET_PROFILE_ROSTER_PROCESS:
			return initialState;
		default:
			return state;
	}
};
