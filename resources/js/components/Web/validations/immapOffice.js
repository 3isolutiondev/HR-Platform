import validator from 'validator';
import isEmpty from './common/isEmpty';

export function validate(data) {
	let errors = {};

	data.country = !isEmpty(data.country) ? data.country : '';
	data.city = !isEmpty(data.city) ? data.city : '';
	data.is_active = !isEmpty(data.is_active) ? data.is_active : '';
	data.is_hq = !isEmpty(data.is_hq) ? data.is_hq : '';

	if (isEmpty(data.country)) {
		errors.country = 'Country is required';
	} else if (!validator.isInt(data.country.value.toString())) {
		errors.country = 'Invalid Country Data';
	}

	if (validator.isEmpty(data.city)) {
		errors.city = 'City is required';
	}

	if (!validator.isBoolean(data.is_active.toString())) {
		errors.is_active = 'Invalid Data';
	}

	if (!validator.isBoolean(data.is_hq.toString())) {
		errors.is_hq = 'Invalid Data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
