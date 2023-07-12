import { SET_ALREADY_IMMAPER, SET_BULK_ALREADY_IMMAPER, RESET_ALREADY_IMMAPER } from '../../types/profile/profileTypes';
import moment from 'moment';
import isEmpty from '../../../validations/common/isEmpty';

const initialState = {
	errors: {},
	is_immaper: 0,
	verified_immaper: 0,
	immap_email: '',
	is_immap_inc: 0,
	is_immap_france: 0,
	immap_office: '',
	line_manager: '',
  line_manager_id: '',
	job_title: '',
	duty_station: '',
	start_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
	end_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
	immap_contract_international: 0,
	user_id: ''
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_ALREADY_IMMAPER:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_ALREADY_IMMAPER:
			return {
				...state,
				errors: {},
				is_immaper: action.immaper_data.is_immaper,
				verified_immaper: action.immaper_data.verified_immaper,
				immap_email: action.immaper_data.immap_email,
				is_immap_inc: action.immaper_data.is_immap_inc,
				is_immap_france: action.immaper_data.is_immap_france,
				immap_office: action.immaper_data.immap_office,
				line_manager: !isEmpty(action.immaper_data.line_manager_id) ? action.immaper_data.line_manager : '',
				line_manager_id: action.immaper_data.line_manager_id,
				job_title: action.immaper_data.job_title,
				duty_station: action.immaper_data.duty_station,
				start_of_current_contract: isEmpty(action.immaper_data.start_of_current_contract)
					? moment(new Date()).format('YYYY-MM-DD')
					: action.immaper_data.start_of_current_contract,
				end_of_current_contract: isEmpty(action.immaper_data.end_of_current_contract)
					? moment(new Date()).format('YYYY-MM-DD')
					: action.immaper_data.end_of_current_contract,

				immap_contract_international: action.immaper_data.immap_contract_international,
				user_id: action.immaper_data.user_id,
			};
		case RESET_ALREADY_IMMAPER:
			return {
        ...state,
        is_immaper: 0,
        verified_immaper: 0,
				errors: {},
				immap_email: '',
				is_immap_inc: 0,
				is_immap_france: 0,
				immap_office: '',
				line_manager: '',
				line_manager_id: '',
				job_title: '',
				duty_station: '',
				start_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
				end_of_current_contract: moment(new Date()).format('YYYY-MM-DD'),
				immap_contract_international: 0,
				user_id: ''
			};

		default:
			return state;
	}
};
