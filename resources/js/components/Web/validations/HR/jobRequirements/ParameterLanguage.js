import isEmpty from '../../common/isEmpty';
import validator from 'validator';

export function validate(data) {
	let errors = {};

	data.language = !isEmpty(data.language) ? data.language : '';
	data.is_mother_tongue = !isEmpty(data.is_mother_tongue) ? data.is_mother_tongue.toString() : '';

	if (isEmpty(data.language.value)) {
		errors.language = 'Language is required';
	} else if (!validator.isInt(data.language.value.toString())) {
		errors.language = 'Invalid language data';
	}

	if (isEmpty(data.language_level)) {
		errors.language_level = 'Language Ability is required';
	} else if (!validator.isInt(data.language_level.value.toString())) {
		errors.language_level = 'Invalid language ability data';
	}

	if (validator.isEmpty(data.is_mother_tongue)) {
		errors.is_mother_tongue = 'Mother tongue is required';
	} else if (!validator.isInt(data.is_mother_tongue)) {
		errors.is_mother_tongue = 'Invalid mother tongue data';
	}

	return { errors, isValid: isEmpty(errors) };
}
