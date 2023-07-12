import axios from 'axios';
import { SET_PHONE_NUMBER } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET LANGUAGE
export const getPhoneNumber = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-phones/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.phone_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.phone_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPhoneNumber(data));
				})
				.catch((err) => {
					dispatch(setPhoneNumberFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-phones/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.phone_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.phone_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPhoneNumber(data));
				})
				.catch((err) => {
					dispatch(setPhoneNumberFailed(err));
				});
		}
	};
};

// SET LANGUAGE
export const setPhoneNumber = (phones) => {
	return {
		type: SET_PHONE_NUMBER,
		phones
	};
};

// SET LANGUAGE ERROR MESSAGE
export const setPhoneNumberFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving phone number data'
		}
	};
};
