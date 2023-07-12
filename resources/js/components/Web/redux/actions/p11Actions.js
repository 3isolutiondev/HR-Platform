/** import types needed for this actions */
import {
	SET_P11STATUS,
	CHECK_ERROR,
	SET_P11FORM_DATA,
	ONCHANGE_FORM1,
	// ONCHANGE_FORM2,
	// ONCHANGE_FORM3,
	ONCHANGE_FORM2,
	ONCHANGE_FORM3,
	ONCHANGE_FORM4,
	// ONCHANGE_FORM7,
	ONCHANGE_FORM5,
	ONCHANGE_FORM6,
	ONCHANGE_FORM7,
	ONCHANGE_FORM8,
	SET_LOADING,
	SET_NEXT_STEP,
	SET_ROSTER_PROCESS_P11,
	SET_DISCLAIMER_AGREE,
	SET_DISCLAIMER_OPEN
} from '../types/p11Types';

/** import axios */
import axios from 'axios';

/** import validation helper */
import isEmpty from '../../validations/common/isEmpty';

/** import redux actions needed for p11Actions */
import { addFlashMessage } from './webActions';
import { setDataFailed } from './optionActions';

/**
 * checkError is an action to save error data in p11Reducer
 * @category Redux [Actions] - P11Actions
 * @param {object}  error - object containing error data
 * @param {boolean} valid - is valid or not
 * @returns {object}
 */
export const checkError = (error, valid) => {
	return {
		type: CHECK_ERROR,
		error,
		valid
	};
};

/**
 * setLoading is an action to save loading condition in p11Reducer
 * @category Redux [Actions] - P11Actions
 * @param {boolean} loading - show loading indicator or not
 * @returns {object}
 */
export const setLoading = (loading) => {
	return {
		type: SET_LOADING,
		loading
	};
};

/**
 * setNextStep is an action to save next step value in p11Reducer
 * @category Redux [Actions] - P11Actions
 * @param {number} next - next step
 * @returns {object}
 */
export const setNextStep = (next) => {
	return {
		type: SET_NEXT_STEP,
		next
	};
};

/**
 * setP11FormData is an action to save p11 step form data in p11Reducer
 * @category Redux [Actions] - P11Actions
 * @param {number}  form_number - step number
 * @param {object}  form_data - form data
 * @returns {Promise}
 */
export const setP11FormData = (form_number, form_data) => (dispatch, getState) => {
	dispatch({
		type: SET_P11FORM_DATA,
		form_number,
		form_data
	});

	return Promise.resolve(getState());
};

/**
 * onChangeForm1 is an action to handle change of data in the step 1 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm1 = (name, value) => {
	return {
		type: ONCHANGE_FORM1,
		name,
		value
	};
};

/**
 * onChangeForm2 is an action to handle change of data in the step 2 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
// export const onChangeForm2 = (name, value) => (dispatch, getState) => {
// 	dispatch({
// 		type: ONCHANGE_FORM2,
// 		name,
// 		value
// 	});
// 	return Promise.resolve(getState());
// };

/**
 * onChangeForm3 is an action to handle change of data in the step 3 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
// export const onChangeForm3 = (name, value) => {
// 	return {
// 		type: ONCHANGE_FORM3,
// 		name,
// 		value
// 	};
// };

/**
 * onChangeForm4 is an action to handle change of data in the step 4 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm2 = (name, value) => {
	return {
		type: ONCHANGE_FORM2,
		name,
		value
	};
};

/**
 * onChangeForm5 is an action to handle change of data in the step 5 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm3 = (name, value) => {
	return {
		type: ONCHANGE_FORM3,
		name,
		value
	};
};

/**
 * onChangeForm6 is an action to handle change of data in the step 6 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm4 = (name, value) => {
	return {
		type: ONCHANGE_FORM4,
		name,
		value
	};
};

/**
 * onChangeForm7 is an action to handle change of data in the step 7 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
// export const onChangeForm7 = (name, value) => {
// 	return {
// 		type: ONCHANGE_FORM7,
// 		name,
// 		value
// 	};
// };

/**
 * onChangeForm8 is an action to handle change of data in the step 8 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm5 = (name, value) => (dispatch, getState) => {
	dispatch({
		type: ONCHANGE_FORM5,
		name,
		value
	});
	return Promise.resolve(getState());
};

/**
 * onChangeForm9 is an action to handle change of data in the step 9 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm6 = (name, value) => {
	return {
		type: ONCHANGE_FORM6,
		name,
		value
	};
};

/**
 * onChangeForm10 is an action to handle change of data in the step 10 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm7 = (name, value) => {
	return {
		type: ONCHANGE_FORM7,
		name,
		value
	};
};

/**
 * onChangeForm8 is an action to handle change of data in the step 11 form
 * @category Redux [Actions] - P11Actions
 * @param {string} name - name of the field
 * @param {*}      value - value of the field
 * @returns {object}
 */
export const onChangeForm8 = (name, value) => {
	return {
		type: ONCHANGE_FORM8,
		name,
		value
	};
};

/**
 * setP11Status is an action to save p11Status in p11Reducer
 * @category Redux [Actions] - P11Actions
 * @param {object} p11Status - p11Status data
 * @returns {object}
 */
export const setP11Status = (p11Status) => {
	return {
		type: SET_P11STATUS,
		p11Status
	};
};

/**
 * updateP11Status is an action to update p11Status data
 * @category Redux [Actions] - P11Actions
 * @param {number}  step - step number
 * @param {boolean} stepStatus - step status (has error or not)
 * @param {object}  p11Status - p11Status data
 * @returns {Promise}
 */
export const updateP11Status = (step, stepStatus, p11Status) => {
	stepStatus = stepStatus ? 1 : 0;
	p11Status = typeof p11Status == 'string' ? JSON.parse(p11Status) : p11Status;
	return (dispatch) => {
		const oldP11Status = JSON.stringify(p11Status);
		p11Status['form' + step] = stepStatus;
		p11Status = JSON.stringify(p11Status);

		if (p11Status !== oldP11Status) {
			const updateData = { p11Status, _method: 'PUT' };
			return axios.post('/api/p11-update-p11-status', updateData).then((res) => {
				dispatch(setP11Status(JSON.parse(res.data.data.p11Status)));
			}).catch((err) => {
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while updating the status'
					})
				);
			});
		}
	};
};

/**
 * getRosterProcess is an action to get roster process data
 * @category Redux [Actions] - P11Actions
 * @returns {Promise}
 */
export const getRosterProcess = () => (dispatch) => {
	return axios
		.get('/api/roster-processes')
		.then((res) => {
			dispatch({
				type: SET_ROSTER_PROCESS_P11,
				value: res.data.data
			});
		})
		.catch((err) => {
			dispatch(setDataFailed(err, 'There is an error while retrieving roster process data'));
		});
};

/**
 * rosterProcessOnChange is an action to handle selected roster process in p11 step
 * @category Redux [Actions] - P11Actions
 * @param {number}          selectedId - selected roster process id
 * @param {boolean|number}  is_default - default roster or not, boolean in number format 1 = true and 0 = false
 * @returns {Promise}
 */
export const rosterProcessOnChange = (selectedId, is_default) => (dispatch, getState) => {

  let { selected_roster_process } = getState().p11.form8;
  let index = selected_roster_process.indexOf(selectedId);
  let new_selected_roster_process = (isEmpty(selected_roster_process) || index < 0) ? [selectedId] : []

  // The code below using default roster process
	// let { selected_roster_process } = getState().p11.form8;
  // let { roster_processes } = getState().p11;
	// let isDefault = '';

	// roster_processes.map((roster_process, index) => {
	// 	if (roster_process.is_default == 1) {
	// 		isDefault = roster_process.id;
	// 	}
	// });

	// if (!isEmpty(selected_roster_process)) {
	// 	let index = selected_roster_process.indexOf(selectedId);

	// 	if (index > -1) {
	// 		selected_roster_process.splice(index, 1);
	// 	} else {
	// 		selected_roster_process.push(selectedId);
	// 	}
	// } else {
	// 	selected_roster_process.push(selectedId);
	// }

	// if (selectedId !== isDefault && !isEmpty(isDefault)) {
	// 	if (!selected_roster_process.includes(isDefault)) {
	// 		selected_roster_process.push(isDefault);
	// 	}
	// }

	if (!isEmpty(new_selected_roster_process)) {
		dispatch(onChangeForm8('become_roster', 1));
	} else {
		dispatch(onChangeForm8('become_roster', 0));
	}

	return dispatch(onChangeForm8('selected_roster_process', new_selected_roster_process));
};

/**
 * disclaimerOnChange is an action to handle disclaimer checkbox data
 * @category Redux [Actions] - P11Actions
 * @param {event} e - event
 * @returns {object}
 */
export const disclaimerOnChange = (e) => {
	let retObj = {
		type: SET_DISCLAIMER_AGREE,
		name: 'disclaimer_agree',
		value: 0
	};
	if (e.target.checked) {
		retObj.value = 1;
	}
	return retObj;
};

/**
 * acceptDisclaimer is an action to accept disclaimer
 * @category Redux [Actions] - P11Actions
 * @returns {Promise}
 */
export const acceptDisclaimer = () => (dispatch, getState) => {
	let { disclaimer_agree } = getState().p11;

	if (disclaimer_agree == 1) {
		return axios
			.post('/api/p11-accept-disclaimer', { disclaimer_agree, disclaimer_open: 0 })
			.then((res) => {
				dispatch({
					type: SET_DISCLAIMER_AGREE,
					name: 'disclaimer_agree',
					value: res.data.data.disclaimer_agree
				});
				dispatch({
					type: SET_DISCLAIMER_OPEN,
					name: 'disclaimer_open',
					value: res.data.data.disclaimer_open
				});
				return dispatch(
					addFlashMessage({
						type: 'success',
						text: 'Disclaimer succesfully updated'
					})
				);
			})
			.catch((err) => {
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while accepting disclaimer'
					})
				);
			});
	} else {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'Please check the iMMAP terms and conditions'
			})
		);
	}
};

/**
 * getDisclaimerStatus is an action to get disclaimer status from database
 * @category Redux [Actions] - P11Actions
 * @returns {Promise}
 */
export const getDisclaimerStatus = () => (dispatch) => {
	return axios
		.get('/api/p11-disclaimer-status')
		.then((res) => {
			dispatch({
				type: SET_DISCLAIMER_AGREE,
				name: 'disclaimer_agree',
				value: res.data.data.disclaimer_agree
			});
			return dispatch({
				type: SET_DISCLAIMER_OPEN,
				name: 'disclaimer_open',
				value: res.data.data.disclaimer_open
			});
		})
		.catch((err) => { });
};
