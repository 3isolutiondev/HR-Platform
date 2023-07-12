import validator from 'validator';
import isEmpty from '../common/isEmpty';
import { startCase } from 'lodash/string';

function checkBoolean(fieldName, fieldNameInMessage, data, errors) {
	if (validator.isEmpty(data.toString())) {
		errors[fieldName] = startCase(fieldNameInMessage) + ' is required';
	} else if (!validator.isIn(data.toString(), [ 1, 0 ])) {
		errors[fieldName] = 'Invalid ' + fieldNameInMessage + ' data';
	}

	return errors;
}

export function validate(data) {
	let errors = {};

	data.step = !isEmpty(data.step) ? data.step : '';
	data.default_step = !isEmpty(data.default_step) ? data.default_step : '';
	data.last_step = !isEmpty(data.last_step) ? data.last_step : '';
	data.has_quiz = !isEmpty(data.has_quiz) ? data.has_quiz : '';

	if (validator.isEmpty(data.step)) {
		errors.step = 'Name is required';
	} else if (!validator.isLength(data.step, { min: 4 })) {
		errors.step = 'Name minimum 4 characters';
	}

	errors = checkBoolean('default_step', 'default step', data.default_step, errors);
	errors = checkBoolean('last_step', 'last step', data.last_step, errors);
	errors = checkBoolean('has_quiz', 'has quiz', data.has_quiz, errors);

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
