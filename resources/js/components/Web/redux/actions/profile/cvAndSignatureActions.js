import axios from 'axios';
import { SET_CV_AND_SIGNATURE } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';
import isEmpty from '../../../validations/common/isEmpty';

// GET CV AND SIGNATURE
export const getCVAndSignature = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-cv-and-signature/')
				.then((res) => {
					let data = res.data.data;
					if (isEmpty(res.data.data.photo) && isEmpty(res.data.data.cv) && isEmpty(res.data.data.signature)) {
						data = { ...res.data.data, show: false };
					} else {
						data = { ...res.data.data, show: true };
					}
					return dispatch(setCVAndSignature(data));
				})
				.catch((err) => {
					return dispatch(setCVAndSignatureFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-cv-and-signature/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (isEmpty(res.data.data.photo) && isEmpty(res.data.data.cv) && isEmpty(res.data.data.signature)) {
						data = { ...res.data.data, show: false };
					} else {
						data = { ...res.data.data, show: true };
					}
					return dispatch(setCVAndSignature(data));
				})
				.catch((err) => {
					return dispatch(setCVAndSignatureFailed(err));
				});
		}
	};
};

// SET CV AND SIGNATURE
export const setCVAndSignature = (cv) => {
	return {
		type: SET_CV_AND_SIGNATURE,
		cv
	};
};

// SET CV AND SIGNATURE ERROR MESSAGE
export const setCVAndSignatureFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving cv and signature data'
		}
	};
};
