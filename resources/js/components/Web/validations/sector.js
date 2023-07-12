import validator from 'validator';
import isEmpty from './common/isEmpty';

export function validate(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.is_approved = !isEmpty(data.is_approved) ? data.is_approved : '';

	if (validator.isEmpty(data.name)) {
		errors.name = 'Sector is required';
	}

	if (!validator.isBoolean(data.is_approved.toString())) {
		errors.is_approved = 'Invalid Data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
