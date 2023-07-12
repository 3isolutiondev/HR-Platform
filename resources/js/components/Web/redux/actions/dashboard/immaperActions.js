import axios from 'axios';
import moment from 'moment';
import { SET_IMMAPER_FORMDATA, SET_IMMAPER_DATA } from '../../types/dashboard/immaperTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';
import { validateImmaper } from '../../../validations/immaper';
import { YesNoURL } from '../../../config/general';
import isEmpty from '../../../validations/common/isEmpty';

export const setFormIsEdit = (isEdit, userId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/immapers/' + userId)
				.then((res) => {
					// let p11_immap_office = {};
					const {
						full_name,
						p11Completed,
						profile_id,
						immap_email,
						job_title,
						duty_station,
						line_manager,
						start_of_current_contract,
						end_of_current_contract,
						is_immap_inc,
						is_immap_france,
						immap_contract_international,
						immap_office,
						line_manager_id,
						under_sbp_program,
						role,
						project_code,
					} = res.data.data;

					// p11_immap_office = !isEmpty(immap_office)
					// 	? {
					// 			value: immap_office[0].id,
					// 			label: immap_office[0].country.name + ' - (' + immap_office[0].city + ')'
					// 		}
					// 	: '';

					dispatch(
						setUserFormData({
							isEdit: true,
							apiURL: '/api/immapers/' + userId,
							redirectURL: '/dashboard/immapers/' + userId + '/edit',
							full_name,
							p11Completed,
							profile_id,
							immap_email,
							job_title,
							duty_station,
							line_manager,
							start_of_current_contract,
							end_of_current_contract,
							is_immap_inc,
							is_immap_france,
							immap_contract_international,
							immap_office,
							line_manager_id,
							under_sbp_program,
							role,
							project_code
						})
					);
					return dispatch(setErrors());
				})
				.catch((err) => {
					dispatch(setNotifError(err, 'There is an error while retrieving user data'));
				});
		};
	} else {
		dispatch({ type: RESET_USER_FORMDATA });
	}
};

export const yesNoOnChange = (e) => {
	return (dispatch, getState) => {
		let { profile_id } = getState().dashboardImmaper;

		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;

		axios
			.post(YesNoURL[yesNoName] + '/' + profile_id, { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				dispatch(setImmaper(yesNoName, yesNoValue));
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: res.data.status ? res.data.status : 'success',
						text: res.data.message ? res.data.message : 'Update Success'
					}
				});
			})
			.catch((err) => {
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: err.response ? err.response.status : 'success',
						text: err.response.message ? err.response.message : 'Update Error'
					}
				});
			});
	};
};

export const setUserFormData = (payload) => {
	return {
		type: SET_IMMAPER_FORMDATA,
		payload
	};
};

export const setImmaper = (name, value) => {
	return {
		type: SET_IMMAPER_DATA,
		name,
		value
	};
};

export const selectOnChange = (value, e) => {
	return (dispatch) => {
		dispatch(setImmaper([ e.name ], value));
		return dispatch(setErrors());
	};
};

export const onChange = (e) => {
	return (dispatch) => {
		dispatch(setImmaper(e.target.name, e.target.value));
		return dispatch(setErrors());
	};
};

export const dateOnChange = (e) => {
	return (dispatch) => {
		dispatch(setImmaper(e.target.name, moment(e.target.value).format('YYYY-MM-DD')));
    return dispatch(setErrors());
	};
};

export const switchOnChange = (e) => {
	return (dispatch, getState) => {
		let dataImmaper = getState().dashboardImmaper;

		if(dataImmaper[e.target.name]){
			dispatch(setImmaper(e.target.name, 0));
			return dispatch(setErrors());
		}else{
			dispatch(setImmaper(e.target.name, 1));
			return dispatch(setErrors());
		}
	};
};

export const onSubmit = (history) => {
	return (dispatch, getState) => {
		dispatch(setImmaper('showLoading', true));
		let {
			immap_email,
			job_title,
			duty_station,
			line_manager,
			start_of_current_contract,
			end_of_current_contract,
			is_immap_inc,
			is_immap_france,
			apiURL,
			redirectURL,
			immap_contract_international,
			under_sbp_program,
			isEdit,
			immap_office,
			line_manager_id,
			role,
			project_code,
			save_as_history
		} = getState().dashboardImmaper;
		let formData = {
			immap_email,
			job_title,
			duty_station,
			line_manager,
			start_of_current_contract,
			end_of_current_contract,
			is_immap_inc,
			is_immap_france,
			immap_contract_international,
			under_sbp_program,
			immap_office,
			line_manager_id,
			role,
			project_code,
			save_as_history
		};
		if (isEdit) {
			formData._method = 'PUT';
		}

		axios
			.post(apiURL, formData)
			.then((res) => {
				dispatch(setImmaper('showLoading', false));
				const { status, message } = res.data;
				if (isEdit) {
					history.goBack();
				} else {
					history.push('/dashboard/immapers');
				}
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: status,
						text: message
					}
				});
			})
			.catch((err) => {
				dispatch(setImmaper('showLoading', false));
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: 'error',
						text: 'There is an error while processing the request'
					}
				});
			});
	};
};

export const setNotifError = (err, message) => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: message
		}
	};
};

export const setErrors = () => {
	return (dispatch, getState) => {
		const {
			immap_email,
			job_title,
			duty_station,
			line_manager,
      		line_manager_id,
			start_of_current_contract,
			end_of_current_contract,
			is_immap_inc,
			is_immap_france,
			immap_contract_international,
			under_sbp_program,
			immap_office,
			role,
			project_code
		} = getState().dashboardImmaper;

		const { errors, isValid } = validateImmaper({
			immap_email,
			job_title,
			duty_station,
			line_manager,
            line_manager_id,
			start_of_current_contract,
			end_of_current_contract,
			is_immap_inc,
			is_immap_france,
			immap_contract_international,
			immap_office,
			under_sbp_program,
			role,
			project_code
		});
		dispatch(setImmaper('isValid', isValid));
		if (!isValid) {
			dispatch(setImmaper('errors', errors));
		} else {
			dispatch(setImmaper('errors', {}));
		}

		return isValid;
	};
};
