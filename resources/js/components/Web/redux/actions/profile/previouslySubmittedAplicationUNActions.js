import axios from 'axios';
import {
	SET_PREVIOUSLY_SUBMITTED_FOR_UN,
	SET_PREVIOUSLY_SUBMITTED_FOR_UN_WITH_OUT_SHOW
} from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET PREVIOUSLY SUBMITTED
export const getPeviouslySubmittedForUn = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-previously-submitted-for-un/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.previously_submitted_for_un_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.previously_submitted_for_un_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPeviouslySubmittedForUn(data));
				})
				.catch((err) => {
					dispatch(setPeviouslySubmittedForUnFailed());
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-previously-submitted-for-un/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.previously_submitted_for_un_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.previously_submitted_for_un_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPeviouslySubmittedForUn(data));
				})
				.catch((err) => {
					dispatch(setPeviouslySubmittedForUnFailed());
				});
		}
	};
};

// SET PREVIOUSLY SUBMITTED
export const setPeviouslySubmittedForUn = (un) => {
	return {
		type: SET_PREVIOUSLY_SUBMITTED_FOR_UN,
		un
	};
};

// GET PREVIOUSLY SUBMITTED
export const getPeviouslySubmittedForUnWithOutShow = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-previously-submitted-for-un/')
				.then((res) => {
					let data = res.data.data;

					dispatch(setPeviouslySubmittedForUnWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setPeviouslySubmittedForUnFailed());
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-previously-submitted-for-un/' + profileID)
				.then((res) => {
					let data = res.data.data;

					dispatch(setPeviouslySubmittedForUnWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setPeviouslySubmittedForUnFailed());
				});
		}
	};
};

// SET PREVIOUSLY SUBMITTED
export const setPeviouslySubmittedForUnWithOutShow = (un) => {
	return {
		type: SET_PREVIOUSLY_SUBMITTED_FOR_UN_WITH_OUT_SHOW,
		un
	};
};

// SET PREVIOUSLY SUBMITTED ERROR MESSAGE
export const setPeviouslySubmittedForUnFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving previously work with iMMAP data'
		}
	};
};
