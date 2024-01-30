import axios from 'axios';
import { SET_BULK_ALREADY_IMMAPER, SET_ALREADY_IMMAPER, RESET_ALREADY_IMMAPER } from '../../types/profile/profileTypes';
import { addFlashMessage } from '../../actions/webActions';
import isEmpty from '../../../validations/common/isEmpty';
import moment from 'moment';
import validator from 'validator';
import { getBio } from '../../actions/profile/bioActions';
import { logoutUser } from '../../actions/authActions';

export const getAlreadyImmaper = (id) => (dispatch) => {
  if (id !== false) {
    id = isEmpty(id) ? '' : id;
    id = id === true ? '' : id;
    return axios
      .get('/api/profile-already-immaper/' + id)
      .then((res) => {
        dispatch({
          type: SET_BULK_ALREADY_IMMAPER,
          immaper_data: res.data.data
        });
        return dispatch(isValid());
      })
      .catch((err) => {});
  } else {
    return dispatch(resetAlreadyiMMAPer());
  }
};

export const onChange = (name, value, checkValid = false) => (dispatch) => {
	if (checkValid) {
		dispatch({
			type: SET_ALREADY_IMMAPER,
			name,
			value
		});
		return dispatch(isValid());
	} else {
		return dispatch({
			type: SET_ALREADY_IMMAPER,
			name,
			value
		});
	}
};

export const resetAlreadyiMMAPer = () => {
	return {
		type: RESET_ALREADY_IMMAPER
	};
};

export const isValid = () => (dispatch, getState) => {
	let errors = {};
	const is_immaper = !isEmpty(getState().alreadyImmaper.is_immaper)
		? getState().alreadyImmaper.is_immaper.toString()
		: '';
	const immap_contract_international = !isEmpty(getState().alreadyImmaper.immap_contract_international)
		? getState().alreadyImmaper.immap_contract_international.toString()
		: '';
	const immap_email = !isEmpty(getState().alreadyImmaper.immap_email) ? getState().alreadyImmaper.immap_email : '';
	const immap_office = !isEmpty(getState().alreadyImmaper.immap_office) ? getState().alreadyImmaper.immap_office : '';
	const is_immap_inc = !isEmpty(getState().alreadyImmaper.is_immap_inc) ? getState().alreadyImmaper.is_immap_inc : '';
	const is_immap_france = !isEmpty(getState().alreadyImmaper.is_immap_france)
		? getState().alreadyImmaper.is_immap_france
		: '';
	// const project = !isEmpty(getState().alreadyImmaper.project) ? getState().alreadyImmaper.project : '';
	const job_title = !isEmpty(getState().alreadyImmaper.job_title) ? getState().alreadyImmaper.job_title : '';
	const duty_station = !isEmpty(getState().alreadyImmaper.duty_station) ? getState().alreadyImmaper.duty_station : '';
	const line_manager = !isEmpty(getState().alreadyImmaper.line_manager) ? getState().alreadyImmaper.line_manager : '';
	const line_manager_id = !isEmpty(getState().alreadyImmaper.line_manager_id) ? getState().alreadyImmaper.line_manager_id : '';
	const start_of_current_contract = !isEmpty(getState().alreadyImmaper.start_of_current_contract)
		? getState().alreadyImmaper.start_of_current_contract
		: '';
	const end_of_current_contract = !isEmpty(getState().alreadyImmaper.end_of_current_contract)
		? getState().alreadyImmaper.end_of_current_contract
		: '';

	if (validator.isEmpty(is_immaper)) {
		errors.is_immaper = 'Already Consultant is required';
	} else if (!validator.isBoolean(is_immaper)) {
		errors.is_immaper = 'Invalid data format';
	}

	if (is_immaper === '1') {
		if (!validator.isEmpty(immap_email)) {
			if (!validator.isEmail(immap_email)) {
				errors.immap_email = 'Invalid email address';
			} else if (!/@organization.org*$/.test(immap_email)) {
				errors.immap_email = 'Invalid iMMAP email address';
			}
		}

		if (validator.isEmpty(job_title)) {
			errors.job_title = 'Job Title is required';
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
		}

		if (isEmpty(errors.start_of_current_contract) && isEmpty(errors.end_of_current_contract)) {
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

		if (is_immap_inc == 0 && is_immap_france == 0) {
			errors.is_immap_inc = 'Choose one of iMMAP Headquarter';
			errors.is_immap_france = 'Choose one of iMMAP Headquarter';
		}
	}

	return dispatch(onChange('errors', errors));
};

export const onSubmit = (profileID) => (dispatch, getState) => {
	const {
		errors,
		is_immaper,
		immap_email,
		is_immap_inc,
		is_immap_france,
		immap_office,
		line_manager,
    line_manager_id,
		job_title,
		duty_station,
		start_of_current_contract,
		end_of_current_contract,
		immap_contract_international
	} = getState().alreadyImmaper;

	if (isEmpty(errors)) {
		return axios
			.post(`/api/update-profile-already-immaper/${profileID}`, {
				is_immaper,
				immap_email,
				is_immap_inc,
				is_immap_france,
				immap_office_id: !isEmpty(immap_office) ? immap_office.value : '',
				line_manager,
       			line_manager_id,
				job_title,
				duty_station,
				start_of_current_contract,
				end_of_current_contract,
				immap_contract_international,
				_method: 'PUT'
			})
			.then((res) => {
        if (!isEmpty(res.data.data && res.data.data.end_of_current_contract)) {
          if (new Date() > new Date(res.data.data.end_of_current_contract)) {
            if (getState().auth.user.isIMMAPER) {
              dispatch(
                addFlashMessage({
                  type: res.data.status,
                  text: `${res.data.message}, Please re-login`
                })
              );
              return dispatch(logoutUser());
            }
          }
        }

				dispatch(getBio());
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

export const verifyEmail = () => (dispatch) => {
	return axios
		.post('/api/send-verification-immap-email')
		.then((res) => {
			return dispatch(
				addFlashMessage({
					type: res.data.status,
					text: res.data.message
				})
			);
		})
		.catch((err) => {
      let msgObject = {
        type: 'error',
        text: 'There is an error while sending the verification email'
      }
      if (err.response.status === 403) {
        msgObject.text = err.response.data.message;
      }
			return dispatch(addFlashMessage(msgObject));
		});
};
