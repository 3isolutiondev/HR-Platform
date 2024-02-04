import axios from 'axios';
import {
	SET_DASHBOARD_ALREADY_IMMAPER_FORM,
	RESET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM
} from '../../types/dashboard/immaperFormTypes';
import { addFlashMessage } from '../../actions/webActions';
import isEmpty from '../../../validations/common/isEmpty';
import moment from 'moment';
import validator from 'validator';

export const getP11CompletedUsers = (keyword = '') => (dispatch) => {
	return axios
		.get('/api/p11-completed-users' + ((!isEmpty(keyword) ? `?search=${keyword}` : '')))
		.then((res) => {
			return dispatch(onChange('users', res.data.data));
		})
		.catch((err) => {
      return dispatch(onChange('users', []));
    });
};

export const onChange = (name, value, checkValid = false) => (dispatch) => {
	if (checkValid) {
		dispatch({
			type: SET_DASHBOARD_ALREADY_IMMAPER_FORM,
			name,
			value
		});
		return dispatch(isValid());
	} else {
		return dispatch({
			type: SET_DASHBOARD_ALREADY_IMMAPER_FORM,
			name,
			value
		});
	}
};

export const resetForm = () => {
	return {
		type: RESET_BULK_DASHBOARD_ALREADY_IMMAPER_FORM
	};
};

export const isValid = () => (dispatch, getState) => {
	let errors = {};

	const user = !isEmpty(getState().immaperForm.user) ? getState().immaperForm.user : '';
	const immap_contract_international = !isEmpty(getState().immaperForm.immap_contract_international)
		? getState().immaperForm.immap_contract_international.toString()
		: '';
	const immap_email = !isEmpty(getState().immaperForm.immap_email) ? getState().immaperForm.immap_email : '';
	const immap_office = !isEmpty(getState().immaperForm.immap_office) ? getState().immaperForm.immap_office : '';
	const is_immap_inc = !isEmpty(getState().immaperForm.is_immap_inc) ? getState().immaperForm.is_immap_inc : '';
	const is_immap_france = !isEmpty(getState().immaperForm.is_immap_france)
		? getState().immaperForm.is_immap_france
		: '';
	const job_title = !isEmpty(getState().immaperForm.job_title) ? getState().immaperForm.job_title : '';
	const duty_station = !isEmpty(getState().immaperForm.duty_station) ? getState().immaperForm.duty_station : '';
	const line_manager = !isEmpty(getState().immaperForm.line_manager.label) ? getState().immaperForm.line_manager.label : '';
	const line_manager_id = !isEmpty(getState().immaperForm.line_manager_id) ? getState().immaperForm.line_manager_id : '';
	const project_code = !isEmpty(getState().immaperForm.project_code) ? getState().immaperForm.project_code : '';
	const start_of_current_contract = !isEmpty(getState().immaperForm.start_of_current_contract)
		? getState().immaperForm.start_of_current_contract
		: '';
	const end_of_current_contract = !isEmpty(getState().immaperForm.end_of_current_contract)
		? getState().immaperForm.end_of_current_contract
		: '';

	if (!validator.isEmpty(immap_email)) {
		if (!validator.isEmail(immap_email)) {
			errors.immap_email = 'Invalid email address';
		} else if (!/@immapfr.org*$/.test(data.immap_email) && !/@3isolution.org*$/.test(data.immap_email)) {
			errors.immap_email = 'Invalid 3iSolution email address';
		}
	}

	if (validator.isEmpty(job_title)) {
		errors.job_title = 'Job Title is required';
	}

	if (validator.isEmpty(project_code)) {
		errors.project_code = 'Project Code is required';
	}

	if (validator.isEmpty(duty_station)) {
		errors.duty_station = 'Duty Station is required';
	}

	if (validator.isEmpty(line_manager) || isEmpty(line_manager_id)) {
		errors.line_manager = 'Line Manager is required';
	}

	if (validator.isEmpty(start_of_current_contract)) {
		errors.start_of_current_contract = 'Start of current contract is required';
	} else if (!validator.isISO8601(start_of_current_contract)) {
		errors.start_of_current_contract = 'Invalid date format';
	}

	if (validator.isEmpty(end_of_current_contract)) {
		errors.end_of_current_contract = 'End of current contract is required';
	} else if (!validator.isISO8601(end_of_current_contract)) {
		errors.end_of_current_contract = 'Invalid date format';
	} else {
		const start_date = moment(start_of_current_contract);
		const end_date = moment(end_of_current_contract);

		const duration = moment.duration(end_date.diff(start_date));
		const days = duration.asDays();

		if (days < 1) {
			errors.start_of_current_contract =
				'Start of current contract should be lower than the end of current contract';
			errors.end_of_current_contract =
				'End of current contract should be higher than the start of current contract';
		}
	}

	if (validator.isEmpty(immap_contract_international)) {
		errors.immap_contract_international = 'Already iMMAP contract international is required';
	} else if (!validator.isBoolean(immap_contract_international)) {
		errors.immap_contract_international = 'Invalid data format';
	}

	if (isEmpty(immap_office)) {
		errors.immap_office = 'iMMAP Office is required';
	} else if (!validator.isInt(immap_office.value.toString())) {
		errors.immap_office = 'Invalid iMMAP Office data';
	}

	if (isEmpty(user)) {
		errors.user = 'User is required';
	} else if (!validator.isInt(user.value.toString())) {
		errors.user = 'Invalid User data';
	}

	if (is_immap_inc == 0 && is_immap_france == 0) {
		errors.is_immap_headquarter = 'Please choose at least one of iMMAP Headquarter';
	}

	return dispatch(onChange('errors', errors));
};

export const onSubmit = () => (dispatch, getState) => {
	const {
		user,
		errors,
		immap_email,
		is_immap_inc,
		is_immap_france,
		immap_office,
		line_manager,
		job_title,
		duty_station,
		start_of_current_contract,
		end_of_current_contract,
		immap_contract_international,
		under_sbp_program,
		project_code,
	} = getState().immaperForm;

	if (isEmpty(errors)) {
		return axios
			.post('/api/add-immaper', {
				user: user.value,
				immap_email,
				is_immap_inc,
				is_immap_france,
				immap_office_id: !isEmpty(immap_office) ? immap_office.value : '',
				line_manager: line_manager.label,
				line_manager_id: line_manager.value,
				job_title,
				duty_station,
				start_of_current_contract,
				end_of_current_contract,
				immap_contract_international,
				under_sbp_program,
				project_code,
				_method: 'PUT'
			})
			.then((res) => {
				dispatch(resetForm());
				return dispatch(
					addFlashMessage({
						type: res.data.status,
						text: res.data.message
					})
				);
			})
			.catch((err) => {
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'Error while saving your data'
					})
				);
			});
	} else {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'Validation error'
			})
		);
	}
};

// export const verifyEmail = () => (dispatch) => {
// 	return axios
// 		.post('/api/send-verification-immap-email')
// 		.then((res) => {
// 			return dispatch(
// 				addFlashMessage({
// 					type: res.data.status,
// 					text: res.data.message
// 				})
// 			);
// 		})
// 		.catch((err) => {
// 			return dispatch(
// 				addFlashMessage({
// 					type: 'error',
// 					text: 'There is an error while sending the verification email'
// 				})
// 			);
// 		});
// };
