import axios from 'axios';
import { SET_REFERENCES } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET REFERENCES
export const getReferences = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-references/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.references_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.references_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setReferences(data));
				})
				.catch((err) => {
					dispatch(setReferencesFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-references/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.references_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.references_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setReferences(data));
				})
				.catch((err) => {
					dispatch(setReferencesFailed(err));
				});
		}
	};
};

// SET REFERENCES
export const setReferences = (references) => {
	return {
		type: SET_REFERENCES,
		references
	};
};

// SET REFERENCES ERROR MESSAGE
export const setReferencesFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving references data'
		}
	};
};
