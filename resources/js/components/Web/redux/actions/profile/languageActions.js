import axios from 'axios';
import { SET_LANGUAGE } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET LANGUAGE
export const getLanguage = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-languages/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.languages_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.languages_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setLanguage(data));
				})
				.catch((err) => {
					dispatch(setLanguageFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-languages/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.languages_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.languages_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setLanguage(data));
				})
				.catch((err) => {
					dispatch(setLanguageFailed(err));
				});
		}
	};
};

// SET LANGUAGE
export const setLanguage = (language) => {
	return {
		type: SET_LANGUAGE,
		language
	};
};

// SET LANGUAGE ERROR MESSAGE
export const setLanguageFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving language data'
		}
	};
};
