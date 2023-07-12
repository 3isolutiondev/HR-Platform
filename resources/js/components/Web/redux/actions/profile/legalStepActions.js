import axios from 'axios';
import { SET_LEGAL_STEP, ONCHANGE_LEGAL_STEP, SET_LEGAL_STEP_WITH_OUT_SHOW } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET LEGAL STEP
export const getLegalStep = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-legal-step-changing-nationality/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.legal_step_changing_present_nationality >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.legal_step_changing_present_nationality <= 0) {
						data = { ...res.data.data, show: false };
					}
					return dispatch(setLegalStep(data));
				})
				.catch((err) => {
					return dispatch(setLegalStepFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-legal-step-changing-nationality/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.legal_step_changing_present_nationality >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.legal_step_changing_present_nationality <= 0) {
						data = { ...res.data.data, show: false };
					}
					return dispatch(setLegalStep(data));
				})
				.catch((err) => {
					return dispatch(setLegalStepFailed(err));
				});
		}
	};
};

// SET LEGAL STEP
export const setLegalStep = (legalStep) => {
	return {
		type: SET_LEGAL_STEP,
		legalStep
	};
};

// GET LEGAL STEP WITH OUT SHOW
export const getLegalStepWithOutShow = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-legal-step-changing-nationality/')
				.then((res) => {
					let data = res.data.data;

					return dispatch(setLegalStepWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setLegalStepFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-legal-step-changing-nationality/' + profileID)
				.then((res) => {
					let data = res.data.data;

					return dispatch(setLegalStepWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setLegalStepFailed(err));
				});
		}
	};
};

// SET LEGAL STEP WITH OUT SHOW
export const setLegalStepWithOutShow = (legalStep) => {
	return {
		type: SET_LEGAL_STEP_WITH_OUT_SHOW,
		legalStep
	};
};
// SET LEGAL STEP ERROR MESSAGE
export const setLegalStepFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving legal step changing present nationality record data'
		}
	};
};

export const onChange = (name, value) => {
	return {
		type: ONCHANGE_LEGAL_STEP,
		name,
		value
	};
};
