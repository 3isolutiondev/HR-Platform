// import validator from 'validator'
import isEmpty from '../common/isEmpty';

export function validate(data) {
	let errors = {};

	if (isEmpty(data.skill)) {
		errors.skill = 'This value required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
