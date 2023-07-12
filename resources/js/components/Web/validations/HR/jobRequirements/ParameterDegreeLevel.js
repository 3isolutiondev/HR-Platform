import isEmpty from '../../common/isEmpty';
import validator from 'validator';

export function validate(data) {
	let errors = {};

	data.degree_level = !isEmpty(data.degree_level) ? data.degree_level : '';
	// data.experience = !isEmpty(data.experience) ? data.experience.toString() : '';

	if (isEmpty(data.degree_level.value)) {
		errors.degree_level = 'Degree level is required';
	} else if (!validator.isInt(data.degree_level.value.toString())) {
		errors.degree_level = 'Invalid degree_level data';
	}

	// if (validator.isEmpty(data.experience)) {
	// 	errors.experience = 'Experience is required';
	// } else if (!validator.isInt(data.experience)) {
	// 	errors.experience = 'Invalid experience data';
	// }

	return { errors, isValid: isEmpty(errors) };
}
