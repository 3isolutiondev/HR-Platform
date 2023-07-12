import axios from 'axios';
import { SET_EMPLOYMENT_RECORDS } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET EMPLOYMENT RECORD
export const getEmploymentRecords = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-employment-records/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.employment_records_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.employment_records_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setEmploymentRecords(data));
				})
				.catch((err) => {
					dispatch(setEmploymentRecordsFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-employment-records/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.employment_records_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.employment_records_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setEmploymentRecords(data));
				})
				.catch((err) => {
					dispatch(setEmploymentRecordsFailed(err));
				});
		}
	};
};

// SET EMPLOYMENT RECORD
export const setEmploymentRecords = (employment) => {
	return {
		type: SET_EMPLOYMENT_RECORDS,
		employment
	};
};

// SET EMPLOYMENT RECORD ERROR MESSAGE
export const setEmploymentRecordsFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving employment record data'
		}
	};
};
