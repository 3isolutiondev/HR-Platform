import axios from 'axios';
import { SET_RELATIVE_EMPLOYED, SET_RELATIVE_EMPLOYED_WITH_OUT_SHOW } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET RELATIVE EMPLOYED
export const getRelativeEmployed = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-relatives-employed/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.relatives_employed_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.relatives_employed_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setRelativeEmployed(data));
				})
				.catch((err) => {
					dispatch(setRelativeEmployedFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-relatives-employed/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.relatives_employed_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.relatives_employed_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setRelativeEmployed(data));
				})
				.catch((err) => {
					dispatch(setRelativeEmployedFailed(err));
				});
		}
	};
};

// SET RELATIVE EMPLOYED
export const setRelativeEmployed = (employed) => {
	return {
		type: SET_RELATIVE_EMPLOYED,
		employed
	};
};

// GET RELATIVE EMPLOYED WITH OUT SHOW
export const getRelativeEmployedWithOutShow = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-relatives-employed/')
				.then((res) => {
					let data = res.data.data;
					dispatch(setRelativeEmployedWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setRelativeEmployedFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-relatives-employed/' + profileID)
				.then((res) => {
					let data = res.data.data;
					dispatch(setRelativeEmployedWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setRelativeEmployedFailed(err));
				});
		}
	};
};

// SET RELATIVE EMPLOYED
export const setRelativeEmployedWithOutShow = (employed) => {
	return {
		type: SET_RELATIVE_EMPLOYED_WITH_OUT_SHOW,
		employed
	};
};

// SET RELATIVE EMPLOYED ERROR MESSAGE
export const setRelativeEmployedFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving relative employeed error message data'
		}
	};
};
