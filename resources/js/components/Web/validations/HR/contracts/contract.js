import validator from 'validator';
import moment from 'moment';
import isEmpty from '../../common/isEmpty';

export function contractValidation(data) {
	let errors = {};

	data.valTemplate = !isEmpty(data.valTemplate) ? data.valTemplate : '';
	data.position = !isEmpty(data.position) ? data.position : '';
	data.name_of_ceo = !isEmpty(data.name_of_ceo) ? data.name_of_ceo : '';
	data.position_of_ceo = !isEmpty(data.position_of_ceo) ? data.position_of_ceo : '';
	data.title = !isEmpty(data.title) ? data.title : '';

	if (moment(data.contract_start).isSameOrAfter(data.contract_end)) {
		errors.contract_start = 'Contract Start must be smaller from Contract End';
		errors.contract_end = 'Contract End must be bigger from Contract Start';
	}

	if (data.isEdit === false) {
		if (isEmpty(data.valTemplate)) {
			errors.valTemplate = 'Please Select Template';
		}
	}

	if (isEmpty(data.user)) {
		errors.email = 'Search user is required';
	}

	if (validator.isEmpty(data.position)) {
		errors.position = 'Position is required';
	} else if (!validator.isLength(data.position, { min: 3 })) {
		errors.position = 'Position minimum 3 characters';
	}

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 3 })) {
		errors.title = 'Title minimum 3 characters';
	}

	if (data.template === '<p><br></p>') {
		errors.template = 'Contract Template is required';
	}

	if (validator.isEmpty(data.name_of_ceo)) {
		errors.name_of_ceo = 'Name of Signature is required';
	} else if (!validator.isLength(data.name_of_ceo, { min: 3 })) {
		errors.name_of_ceo = 'Name of Signature minimum 3 characters';
	}

	if (validator.isEmpty(data.position_of_ceo)) {
		errors.position_of_ceo = 'Position of Signature is required';
	} else if (!validator.isLength(data.position_of_ceo, { min: 3 })) {
		errors.position_of_ceo = 'Position of Signature minimum 3 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
