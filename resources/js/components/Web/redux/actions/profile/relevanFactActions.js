import axios from 'axios';
import {
	SET_RELEVAN_FACT,
	ONCHANGE_RELEVAN_FACT,
	SET_RELEVAN_FACT_WITH_OUT_SHOW
} from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET RELEVAN FACT
export const getRelevanFact = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-relevant-facts/')
				.then((res) => {
					let data = res.data.data;
					if (data.relevant_facts == null) {
						data = { ...res.data.data, relevant_facts: '', show: false };
					} else {
						data = { ...res.data.data, show: true };
					}

					return dispatch(setRelevanFact(data));
				})
				.catch((err) => {
					return dispatch(setRelevanFactFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-relevant-facts/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (data.relevant_facts == null) {
						data = { ...res.data.data, relevant_facts: '', show: false };
					} else {
						data = { ...res.data.data, show: true };
					}

					return dispatch(setRelevanFact(data));
				})
				.catch((err) => {
					return dispatch(setRelevanFactFailed(err));
				});
		}
	};
};

// SET RELEVAN FACT
export const setRelevanFact = (relevan) => {
	return {
		type: SET_RELEVAN_FACT,
		relevan
	};
};

// GET RELEVAN FACT
export const getRelevanFactWithOutShow = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-relevant-facts/')
				.then((res) => {
					let data = res.data.data;
					if (data.relevant_facts == null) {
						data = { ...res.data.data, relevant_facts: '' };
					}
					return dispatch(setRelevanFactWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setRelevanFactFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-relevant-facts/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (data.relevant_facts == null) {
						data = { ...res.data.data, relevant_facts: '' };
					}
					return dispatch(setRelevanFactWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setRelevanFactFailed(err));
				});
		}
	};
};

// SET RELEVAN FACT
export const setRelevanFactWithOutShow = (relevan) => {
	return {
		type: SET_RELEVAN_FACT_WITH_OUT_SHOW,
		relevan
	};
};

// SET RELEVAN FACT
export const setRelevanFactFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving relevan fact data'
		}
	};
};

export const onChange = (name, value) => {
	return {
		type: ONCHANGE_RELEVAN_FACT,
		name,
		value
	};
};
