/** import validator and validation helper */
import validator from 'validator';
import isEmpty from './common/isEmpty';

/**
 * validate is a function validate country form data
 * @category Validation - Country
 * @param {object} data - country form data
 * @returns {object}
 */
export function validate(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.country_code = !isEmpty(data.country_code) ? data.country_code : '';
	data.nationality = !isEmpty(data.nationality) ? data.nationality : '';

	if (validator.isEmpty(data.name)) {
		errors.name = 'Name is required';
	} else if (!validator.isLength(data.name, { min: 4 })) {
		errors.name = 'Name minimum 4 characters';
	}

	if (validator.isEmpty(data.country_code)) {
		errors.country_code = 'Country code is required';
	} else if (!validator.isLength(data.country_code, { min: 2, max: 3 })) {
		errors.country_code = 'Country Code should be 2 characters';
	}

	if (validator.isEmpty(data.nationality)) {
		errors.nationality = 'Nationality is required';
	} else if (!validator.isLength(data.nationality, { min: 3, max: 255 })) {
		errors.nationality = 'Nationality minimum 3 characters';
	}

	if (validator.isEmpty(data.phone_code)) {
		errors.phone_code = 'Phone code is required';
	} else if (!validator.isLength(data.phone_code, { min: 1, max: 7 })) {
		errors.phone_code = 'Phone Code should be between 1 - 6 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
