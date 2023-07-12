import validator from 'validator';
import isEmpty from './common/isEmpty';

export function validateMail(data) {
	let errors = {};

	data.to = !isEmpty(data.to) ? data.to : '';
	data.cc = !isEmpty(data.cc) ? data.cc : '';
	data.subject = !isEmpty(data.subject) ? data.subject : '';

	if (isEmpty(data.to)) {
		errors.to = 'Email Required';
	}

	// if (isEmpty(data.cc)) {
	//     errors.cc = 'Email Required';
	// }

	if (isEmpty(data.subject)) {
		errors.subject = 'Subject Required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
