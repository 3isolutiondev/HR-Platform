/** import axios */
import axios from 'axios';

/** import types needed for this actions */
import {
	SET_PROFILE_ROSTER_PROCESS,
	RESET_PROFILE_ROSTER_PROCESS,
	RESET_PROFILE,
	RESET_TAB
} from '../../types/profile/profileTypes';

/** import actions from other redux actions */
import { addFlashMessage } from '../webActions';

/** import validation helper */
import isEmpty from '../../../validations/common/isEmpty';

/**
 * [Profile - Roster Process]
 * getRosterProcess is an action to get all Roster Process recruitment data that the user applied for
 * @param {number|string} id - if id is empty string it will get current user data, if number it will get the user data based on it's profile id
 * @returns {Promise}
 */
export const getRosterProcess = (id) => (dispatch) => {
	let url = '/api/profile-roster-process';
	if (!isEmpty(id)) {
		url = url + '/' + id;
	}
	axios
		.get(url)
		.then(async (res) => {
			let processCount = res.data.data.length;
			let roster_process_count = 0;
			let roster_done_count = 0;

			processCount > 0 &&
				(await res.data.data.map((profileRosterProcess) => {
					if (profileRosterProcess.pivot.is_completed == 1) {
						roster_done_count = roster_done_count + 1;
					} else {
						roster_process_count = roster_process_count + 1;
					}
				}));

			dispatch({
				type: SET_PROFILE_ROSTER_PROCESS,
				name: 'roster_process_empty',
				value: roster_process_count > 0 ? false : true
			});

			dispatch({
				type: SET_PROFILE_ROSTER_PROCESS,
				name: 'roster_done_empty',
				value: roster_done_count > 0 ? false : true
			});

			return dispatch({
				type: SET_PROFILE_ROSTER_PROCESS,
				name: 'profile_roster_process',
				value: res.data.data
			});
		})
		.catch((err) => {
			dispatch({ type: RESET_PROFILE_ROSTER_PROCESS });
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving roster process data'
				})
			);
		});
};

/**
 * [Profile - Roster Process]
 * getRosterProcessData is an action to get the data of the selected roster process
 * @param {number} id - roster process id
 * @returns {Promise}
 */
export const getRosterProcessData = (id) => (dispatch) => {
	return axios
		.get('/api/roster-processes/' + id)
		.then((res) => {
			return dispatch({
				type: SET_PROFILE_ROSTER_PROCESS,
				name: 'profile_roster_process_data',
				value: res.data.data
			});
		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving roster process data'
				})
			);
		});
};

/**
 * [Profile - Roster Process]
 * setProfileID is a function to set profile id data on resources/js/components/Web/redux/reducers/profile/rosterProcessReducer
 * @param {number|string} id - if string it should be empty string
 * @returns {Promise}
 */
export const setProfileID = (id = '') => (dispatch) => {
	return dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'profileID',
		value: id
	});
};

/**
 * [Profile - Roster Process]
 * setRosterProcessID is a function to set roster process id data on resources/js/components/Web/redux/reducers/profile/rosterProcessReducers
 * @param {number} rosterProcessID
 * @return {Promise}
 */
export const setRosterProcessID = (rosterProcessID) => (dispatch, getState) => {
	dispatch({
		type: RESET_TAB
	});
	dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'rosterProcessID',
		value: rosterProcessID
	});

	const { status } = getState().profileRosterProcess;

	if (status === 'current') {
		return dispatch(getCurrentRosterProcess());
	}

	if (status === 'history') {
		dispatch(getCurrentRosterProcess());
		return dispatch(getHistoryRosterProcess());
	}
};

/**
 * [Profile - Roster Process]
 * setStatus is a function to change navigation menu under iMMAP Talent Pool / Surge Roster Status Tab on Profile page / Profile modal
 * @param {string} status
 * @return {Promise}
 */
export const setStatus = (status) => (dispatch, getState) => {
  const { profileID } = getState().profileRosterProcess;
	dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'status',
		value: status
	});

  if (status === 'current') {
		return dispatch(getCurrentRosterProcess());
	}

	if (status === 'history') {
    if (profileID === true) {
      dispatch(getRosterProcess());
    }
		return dispatch(getHistoryRosterProcess());
	}
};

/**
 * [Profile - Roster Process]
 * changeCurrentLoading is a function to change loading indicator when getting the curren roster application data
 * @param {boolean} value
 * @return {Promise}
 */
export const changeCurrentLoading = (value = false) => (dispatch) => {
  return dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'currentRosterProcessLoading',
		value
	});
}

/**
 * [Profile - Roster Process]
 * changeCurrentRosterProcess is a function to change currentRosterProcess data
 * @param {Array} value
 * @return {Promise}
 */
export const changeCurrentRosterProcess = (value) => (dispatch) => {
  return dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'currentRosterProcess',
		value
	});
}

/**
 * [Profile - Roster Process]
 * getCurrentRosterProcess is a function to get current roster application status on Profile page / Profile modal
 * @return {Promise}
 */
export const getCurrentRosterProcess = () => (dispatch, getState) => {
	const { rosterProcessID, status, profileID } = getState().profileRosterProcess;

	if (status == 'current') {
		if (profileID === true) {
			if (!isEmpty(rosterProcessID)) {
        dispatch(changeCurrentLoading(true));
				return axios
					.get('/api/current-profile-roster-process/v2/roster-process/' + rosterProcessID)
					.then((res) => {
						if (!isEmpty(res.data.data)) {
              dispatch(changeCurrentRosterProcess(res.data.data[0]));
						} else {
              dispatch(changeCurrentRosterProcess([]));
						}

            return dispatch(changeCurrentLoading(false));
					})
					.catch(() => {
            dispatch(changeCurrentLoading(false));
						dispatch(
							addFlashMessage({
								type: 'error',
								text: "Get data current profile roster process error"
							})
						);
					})
			}
		} else if (profileID > 0 && rosterProcessID) {
      dispatch(changeCurrentLoading(true));
			return axios
				.get('/api/view-current-profile-roster-process/v2/' + profileID + '/roster-process/' + rosterProcessID)
				.then((res) => {
					if (!isEmpty(res.data.data)) {
            dispatch(changeCurrentRosterProcess(res.data.data[0]));
					} else {
            dispatch(changeCurrentRosterProcess([]));
					}

          return dispatch(changeCurrentLoading(false));
				})
				.catch(() => {
          dispatch(changeCurrentLoading(false));
					dispatch(
						addFlashMessage({
							type: 'error',
							text: "Get data current profile roster process error"
						})
					);
				})
		}
	}
};

/**
 * [Profile - Roster Process]
 * changeHistoryLoading is a function to change loading indicator when getting the historical roster application data
 * @param {boolean} value
 * @return {Promise}
 */
 export const changeHistoryLoading = (value = false) => (dispatch) => {
  return dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'historyRosterProcessLoading',
		value
	});
}

/**
 * [Profile - Roster Process]
 * changeHistoryRosterProcess is a function to change historyRosterProcess data
 * @param {Array} value
 * @return {Promise}
 */
 export const changeHistoryRosterProcess = (value) => (dispatch) => {
  return dispatch({
		type: SET_PROFILE_ROSTER_PROCESS,
		name: 'historyRosterProcess',
		value
	});
}

/**
 * [Profile - Roster Process]
 * getHistoryRosterProcess is a function to get historical roster application status on Profile page / Profile modal
 * @return {Promise}
 */
export const getHistoryRosterProcess = () => (dispatch, getState) => {
	const { rosterProcessID, status, profileID } = getState().profileRosterProcess;

	if (status == 'history') {
		if (profileID === true && !isEmpty(rosterProcessID)) {
      dispatch(changeHistoryLoading(true));
			return axios.get('/api/history-profile-roster-process/v2/roster-process/' + rosterProcessID).then((res) => {
				if (!isEmpty(res.data.data)) {
          dispatch(changeHistoryRosterProcess(res.data.data.reverse()));
				} else {
          dispatch(changeHistoryRosterProcess([]));s
				}
        return dispatch(changeHistoryLoading(false));
			})
			.catch(() => {
        dispatch(changeHistoryLoading(false));
				dispatch(
					addFlashMessage({
						type: 'error',
						text: "Get data history profile roster process error"
					})
				);
			})
		} else if (profileID > 0 && !isEmpty(rosterProcessID)) {
      dispatch(changeHistoryLoading(true));
			return axios
				.get('/api/view-history-profile-roster-process/v2/' + profileID + '/roster-process/' + rosterProcessID)
				.then((res) => {
					if (!isEmpty(res.data.data)) {
            dispatch(changeHistoryRosterProcess(res.data.data.reverse()));
					} else {
						dispatch(changeHistoryRosterProcess([]));
					}
          dispatch(changeHistoryLoading(false));
				})
				.catch(() => {
          dispatch(changeHistoryLoading(false));
					dispatch(
						addFlashMessage({
							type: 'error',
							text: "Get data history profile roster process error"
						})
					);
				})
		}
	}
};

/**
 * [Profile - Roster Process]
 * applyRoster is a function to apply to a roster campaign / application
 * @param {string} roster_name - roster name
 * @return {Promise}
 */
export const applyRoster = (roster_name, reload = false) => (dispatch, getState) => {
	const { rosterProcessID, profileID } = getState().profileRosterProcess;

	if (!isEmpty(rosterProcessID) && profileID === true) {
		return axios
			.post('/api/apply-roster/', {
				roster_process_id: rosterProcessID
			})
			.then((res) => {
				dispatch(
					addFlashMessage({
						type: 'success',
						text: "You have successfully applied for " + roster_name
					})
				);
				if(reload) window.location = `/profile?roster=${rosterProcessID}`;
				return dispatch(setStatus('current'));
			})
			.catch((err) => {
				let message = "An error occured while processing your request";
				if (err.response.data.message) {
					message = err.response.data.message;
				}
				dispatch(
					addFlashMessage({
						type: 'error',
						text: message
					})
				);
			});
	} else {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: "You can't apply to this roster right now"
			})
		);
	}
};

/**
 * [Profile - Roster Process]
 * getVerifiedRoster is a function to get roster application verified data of a profile
 * @param {number|string} id - profile id, if empty string it means to retrieve current profile data
 * @return {Promise}
 */
export const getVerifiedRoster = (id) => (dispatch, getState) => {
	let url = '/api/profile-verified-roster';
	if (!isEmpty(id)) {
		url = url + '/' + id;
	}
	axios
		.get(url)
		.then(async (res) => {
			if (!isEmpty(res.data.data.length)) {
				dispatch({
					type: SET_PROFILE_ROSTER_PROCESS,
					name: 'verified_roster_count',
					value: res.data.data.length
				});

				return dispatch({
					type: SET_PROFILE_ROSTER_PROCESS,
					name: 'verified_roster_process',
					value: res.data.data
				});
			}

		})
		.catch((err) => {
			return dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving verified roster data'
				})
			);
		});
};

/**
 * [Profile - Roster Process]
 * resetProfile is a function to reset profile reducer data
 * @return {Promise}
 */
export const resetProfile = () => {
	return {
		type: RESET_PROFILE
	};
};
