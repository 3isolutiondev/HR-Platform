import validator from 'validator';
import isEmpty from '../common/isEmpty';

export function validate(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.is_default = !isEmpty(data.is_default) ? data.is_default : '';
	data.is_im_test = !isEmpty(data.is_im_test) ? data.is_im_test : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	}

	if (!validator.isBoolean(data.is_default.toString())) {
		errors.is_default = 'Invalid Data';
	}

	if (!validator.isBoolean(data.is_im_test.toString())) {
		errors.is_im_test = 'Invalid Data';
	}

	if (data.is_im_test == 1) {
		if (!data.im_test_template.hasOwnProperty('value')) {
			errors.im_test_template = 'IM Test Template is required';
		} else if (!validator.isInt(data.im_test_template.value.toString())) {
			errors.im_test_template = 'Invalid IM Test Template Data';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
