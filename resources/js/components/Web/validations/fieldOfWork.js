import validator from 'validator';
import isEmpty from './common/isEmpty';

export function validate(data) {
	let errors = {};

	data.field = !isEmpty(data.field) ? data.field : '';
	data.is_approved = !isEmpty(data.is_approved) ? data.is_approved : '';

	if (validator.isEmpty(data.field)) {
		errors.field = 'Area of expertise is required';
	}

	if (!validator.isBoolean(data.is_approved.toString())) {
		errors.is_approved = 'Invalid Data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
