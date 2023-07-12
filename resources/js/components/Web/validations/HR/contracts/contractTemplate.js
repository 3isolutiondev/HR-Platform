import validator from 'validator';
import isEmpty from '../../common/isEmpty';

export function validate(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.position = !isEmpty(data.position) ? data.position : '';
	data.template = !isEmpty(data.template) ? data.template : '';
	data.name_of_ceo = !isEmpty(data.name_of_ceo) ? data.name_of_ceo : '';
	data.position_of_ceo = !isEmpty(data.position_of_ceo) ? data.position_of_ceo : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	}

	if (validator.isEmpty(data.position)) {
		errors.position = 'Position is required';
	}

	if (validator.isEmpty(data.template)) {
		errors.template = 'Contract template is required';
	}

	if (validator.isEmpty(data.name_of_ceo)) {
		errors.name_of_ceo = 'Name of signature is required';
	}

	if (validator.isEmpty(data.position_of_ceo)) {
		errors.position_of_ceo = 'Positionm of signature is required';
	}
	if (data.template === '<p><br></p>') {
		errors.template = 'Contract Template is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
