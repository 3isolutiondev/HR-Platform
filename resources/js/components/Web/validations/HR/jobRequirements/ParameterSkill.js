import isEmpty from '../../common/isEmpty';
import validator from 'validator';

export function validate(data) {
	let errors = {};

	data.skill = !isEmpty(data.skill) ? data.skill : '';
	data.proficiency = !isEmpty(data.proficiency) ? data.proficiency.toString() : '';
	// data.experience = !isEmpty(data.experience) ? data.experience.toString() : '';

	if (isEmpty(data.skill.value)) {
		errors.skill = 'Skill is required';
	} else if (!validator.isInt(data.skill.value.toString())) {
		errors.skill = 'Invalid skill data';
	}

	if (validator.isEmpty(data.proficiency)) {
		errors.proficiency = 'Rating is required';
	} else if (!validator.isInt(data.proficiency)) {
		errors.proficiency = 'Invalid rating data';
	}

	// if (validator.isEmpty(data.experience)) {
	// 	errors.experience = 'Experience is required';
	// } else if (!validator.isInt(data.experience)) {
	// 	errors.experience = 'Invalid experience data';
	// }

	return { errors, isValid: isEmpty(errors) };
}
