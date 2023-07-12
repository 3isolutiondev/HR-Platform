/** import axios */
import axios from 'axios';
/** import types needed for this actions */
import {
	SET_ROSTER_PROCESS_FORMDATA,
	SET_BULK_ROSTER_PROCESS_FORMDATA,
	RESET_ROSTER_PROCESS_FORMDATA,
	SET_ROSTER_STEP_FORMDATA,
	RESET_ROSTER_STEP_FORMDATA
} from '../../../types/dashboard/roster/rosterProcesses';
/** import other actions function that is needed for this actions */
import { addFlashMessage } from '../../webActions';
/** import validation helper */
import { validate } from '../../../../validations/Roster/rosterProcess';
import isEmpty from '../../../../validations/common/isEmpty';

/**
 * setFormIsEdit is an action to set the form in edit mode and retrieve the data by calling an api
 * @param {boolean}       isEdit          - edit = true or reset form = false
 * @param {string|number} rosterProcessId - roster process id
 * @returns {Promise}
 */
export const setFormIsEdit = (isEdit, rosterProcessId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/roster-processes/' + rosterProcessId)
				.then((res) => {
					const {
            id, name, description, is_default, under_sbp_program, roster_steps, read_more_text,
            campaign_is_open, campaign_open_at_quarter, campaign_open_at_year, skillset
          } = res.data.data;
          dispatch(getSbpSkillsets(skillset));
					dispatch(
						bulkChange({
							id,
							name,
							is_default,
              under_sbp_program,
              skillset,
							description,
              roster_steps,
              read_more_text,
              campaign_is_open,
              campaign_open_at_quarter: isEmpty(campaign_open_at_quarter) ? '' : campaign_open_at_quarter,
              campaign_open_at_year: isEmpty(campaign_open_at_year) ? '' : campaign_open_at_year,
							isEdit: true,
							apiURL: '/api/roster-processes/' + rosterProcessId,
							redirectURL: '/dashboard/roster-processes/' + rosterProcessId + '/edit'
						})
					);
					dispatch(isValid());
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving roster process data'
						})
					);
				});
		};
	} else {
    return (dispatch) => {
      dispatch(getSbpSkillsets());
      dispatch({ type: RESET_ROSTER_PROCESS_FORMDATA })
    };
	}
};

/**
 * onChange is an action to change the roster process redux data
 * @param {string}  name  - key inside initialState on the reducer
 * @param {*}       value
 * @returns {object}
 */
export const onChange = (name, value) => {
	return {
		type: SET_ROSTER_PROCESS_FORMDATA,
		name,
		value
	};
};

/**
 * bulkChange is an action to set many data inside roster process redux
 * @param {object}  bulkData
 * @returns {object}
 */
export const bulkChange = (bulkData) => {
	return {
		type: SET_BULK_ROSTER_PROCESS_FORMDATA,
		bulkData
	};
};

/**
 * isValid is an action to validate roster process form data
 * @returns {Promise}
 */
export const isValid = () => {
	return (dispatch, getState) => {
		const { rosterProcess } = getState().rosterProcess;

		const { errors, isValid } = validate(rosterProcess);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

/**
 * onSubmit is an action to submit roster process form data
 * @param {Event} e
 * @param {*} history
 * @returns
 */
export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
    let { isEdit, apiURL, redirectURL, errors, skillsets, showLoading, ...postData } = getState().rosterProcess.rosterProcess;

		if (isEdit) {
			postData._method = 'PUT';
		}

    if (isEmpty(errors)) {
      dispatch(onChange('showLoading', true));
      axios
        .post(apiURL, postData)
        .then((res) => {
          dispatch(onChange('showLoading', false));
          const { status, message, data } = res.data;
          dispatch(setFormIsEdit('true', data.id));
          dispatch(
            addFlashMessage({
              type: status,
              text: message
            })
          );
        })
        .catch((err) => {
          dispatch(onChange('showLoading', false));
          dispatch(
            addFlashMessage({
              type: 'error',
              text: 'There is an error while processing the request'
            })
          );
        });
    } else {
      dispatch(addFlashMessage({
        type: 'error',
        text: 'Please look at the form'
      }))
    }

	};
};

/**
 * closeModal is an action close roster step modal
 * @param {boolean}       isEdit          - edit: true / add: false
 * @param {string|number} rosterProcessId - roster process id
 * @returns {Promise}
 */
export const closeModal = (isEdit, rosterProcessId) => (dispatch, getState) => {
	if (isEdit) {
		dispatch(setFormIsEdit(isEdit, rosterProcessId));
	}

	dispatch({
		type: SET_ROSTER_STEP_FORMDATA,
		name: 'isOpen',
		value: false
	});
	dispatch({ type: RESET_ROSTER_STEP_FORMDATA });
	return dispatch(isValid());
};

/**
 * saveStep is an action to add / save roster step in roster process form
 * @returns {Promise}
 */
export const saveStep = () => (dispatch, getState) => {
	let { roster_steps, id } = getState().rosterProcess.rosterProcess;
	let { isEdit, isOpen, errors, ...stepData } = getState().rosterProcess.rosterStep;

	if (stepData.default_step == 1) {
		roster_steps.forEach((step) => {
			step.default_step = 0;
		});
	}

	if (stepData.last_step == 1) {
		roster_steps.forEach((step) => {
			step.last_step = 0;
		});
	}

	if (isEdit) {
		if (!isEmpty(stepData.id)) {
			dispatch({
				type: SET_ROSTER_STEP_FORMDATA,
				name: 'showLoading',
				value: true
			});
			return axios
				.post('/api/roster-steps/' + stepData.id, {
					...stepData,
					roster_process_id: id,
					_method: 'PUT'
				})
				.then((res) => {
					dispatch({
						type: SET_ROSTER_STEP_FORMDATA,
						name: 'showLoading',
						value: false
					});
					roster_steps[stepData.order] = stepData;

					dispatch(onChange('roster_steps', roster_steps));
					dispatch(
						addFlashMessage({
							type: 'success',
							text: 'Step successfully updated'
						})
					);
					return dispatch(closeModal(true, id));
				})
				.catch((err) => {
					dispatch({
						type: SET_ROSTER_STEP_FORMDATA,
						name: 'showLoading',
						value: false
					});
					return dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while updating step data'
						})
					);
				});
		} else {
			roster_steps[stepData.order] = stepData;
			dispatch(onChange('roster_steps', roster_steps));
			return dispatch(closeModal(false));
		}
	} else if (!isEmpty(id)) {
		dispatch({
			type: SET_ROSTER_STEP_FORMDATA,
			name: 'showLoading',
			value: true
		});
		return axios
			.post('/api/roster-steps/', {
				...stepData,
				roster_process_id: id,
				order: roster_steps.length
			})
			.then((res) => {
				dispatch({
					type: SET_ROSTER_STEP_FORMDATA,
					name: 'showLoading',
					value: false
				});
				roster_steps[res.data.data.order] = {
					...stepData,
					id: res.data.data.id
				};

				dispatch(onChange('roster_steps', roster_steps));
				dispatch(
					addFlashMessage({
						type: 'success',
						text: 'Step successfully added'
					})
				);
				return dispatch(closeModal(false));
			})
			.catch((err) => {
				dispatch({
					type: SET_ROSTER_STEP_FORMDATA,
					name: 'showLoading',
					value: false
				});
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while saving step data'
					})
				);
			});
	} else {
		stepData.order = roster_steps.length;
		roster_steps.push(stepData);
		dispatch(onChange('roster_steps', roster_steps));
		return dispatch(closeModal(false));
	}
};

/**
 * getAllSbpSkillsets is an action to get all sbp roster skillsets
 * @returns {Promise}
 */
export const getAllSbpSkillsets = () => (dispatch) => {
  return axios.get('/api/roster-processes/sbp-skillsets/all')
    .then(res => {
      dispatch(onChange('skillsets', res.data.data));
    })
}

/**
 * getSbpSkillsets is a function to get list of available skillsets
 * @param {string} skillset - Skillset value
 * @returns
 */
export const getSbpSkillsets = (skillset) => (dispatch) => {
  return axios.get(`/api/roster-processes/sbp-skillsets?skillset=${encodeURIComponent(skillset)}`)
    .then(res => {
      dispatch(onChange('skillsets', res.data.data));
    })
}
