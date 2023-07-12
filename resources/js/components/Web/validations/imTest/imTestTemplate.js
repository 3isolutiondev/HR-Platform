import validator from 'validator';
import isEmpty from '../common/isEmpty';

export function validate(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.is_default = !isEmpty(data.is_default) ? data.is_default : '';

	if (validator.isEmpty(data.name)) {
		errors.name = 'Name is required';
	}

	if (!validator.isBoolean(data.is_default.toString())) {
		errors.is_default = 'Invalid Data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
