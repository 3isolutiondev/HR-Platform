import validator from 'validator';
import moment from 'moment';
import isEmpty from './common/isEmpty';

export function validateImmaper(data) {
	let errors = {};

	data.immap_email = !isEmpty(data.immap_email) ? data.immap_email : '';
	data.immap_office = !isEmpty(data.immap_office) ? data.immap_office : '';
	data.immap_contract_international = !isEmpty(data.immap_contract_international)
		? data.immap_contract_international.toString()
		: '';
	data.under_sbp_program = !isEmpty(data.under_sbp_program) ? data.under_sbp_program.toString() : '';
	data.is_immap_inc = !isEmpty(data.is_immap_inc) ? data.is_immap_inc : '';
	data.is_immap_france = !isEmpty(data.is_immap_france) ? data.is_immap_france : '';
	data.job_title = !isEmpty(data.job_title) ? data.job_title : '';
	data.project_code = !isEmpty(data.project_code) ? data.project_code : '';
	data.duty_station = !isEmpty(data.duty_station) ? data.duty_station : '';
	data.line_manager = !isEmpty(data.line_manager) ? data.line_manager : '';
	data.start_of_current_contract = !isEmpty(data.start_of_current_contract) ? data.start_of_current_contract : '';
	data.end_of_current_contract = !isEmpty(data.end_of_current_contract) ? data.end_of_current_contract : '';


	if (!validator.isEmpty(data.immap_email)) {
		if (!validator.isEmail(data.immap_email)) {
			errors.immap_email = 'Invalid email address';
		} else if (!/@immapfr.org*$/.test(data.immap_email) && !/@3isolution.org*$/.test(data.immap_email)) {
			errors.immap_email = 'Invalid 3iSolution email address';
		}
	}

	if (validator.isEmpty(data.job_title)) {
		errors.job_title = 'Job Title is required';
	}

	if (validator.isEmpty(data.project_code)) {
		errors.project_code = 'Project Code is required';
	}

	if (validator.isEmpty(data.duty_station)) {
		errors.duty_station = 'Duty Station is required';
	}

	if (validator.isEmpty(data.line_manager)) {
		errors.line_manager = 'Line Manager is required';
	}

	if (isEmpty(data.line_manager_id)) {
		errors.line_manager = 'There is a new update on the system, please reselect Line Manager';
	}

	if (validator.isEmpty(data.start_of_current_contract)) {
		errors.start_of_current_contract = 'Start of current contract is required';
	} else if (!validator.isISO8601(data.start_of_current_contract)) {
		errors.start_of_current_contract = 'Invalid date format';
	}

	if (validator.isEmpty(data.end_of_current_contract)) {
		errors.end_of_current_contract = 'End of current contract is required';
	} else if (!validator.isISO8601(data.end_of_current_contract)) {
		errors.end_of_current_contract = 'Invalid date format';
	}

	if (isEmpty(errors.start_of_current_contract) && isEmpty(errors.end_of_current_contract)) {
		const start_date = moment(data.start_of_current_contract);
		const end_date = moment(data.end_of_current_contract);

		const duration = moment.duration(end_date.diff(start_date));
		const days = duration.asDays();

		if (days < 1) {
			errors.start_of_current_contract =
				'Start of current contract should be lower than the end of current contract';
			errors.end_of_current_contract =
				'End of current contract should be higher than the start of current contract';
		}
	}

	if (data.is_immap_inc == 0 && data.is_immap_france == 0) {
		errors.is_immap_headquarter = 'Please choose at least one of 3iSolution Headquarter';
	}

	if (validator.isEmpty(data.immap_contract_international)) {
		errors.immap_contract_international = 'Unser international contract is required';
	} else if (!validator.isBoolean(data.immap_contract_international)) {
		errors.immap_contract_international = 'Invalid data format';
	}


	if (validator.isEmpty(data.under_sbp_program)) {
		errors.under_sbp_program = 'Surge Program member is required';
	} else if (!validator.isBoolean(data.under_sbp_program)) {
		errors.under_sbp_program = 'Invalid data format';
	}

	if (isEmpty(data.immap_office)) {
		errors.immap_office = 'iMMAP Office is required';
	} else if (!validator.isInt(data.immap_office.value.toString())) {
		errors.immap_office = 'Invalid iMMAP Office data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
