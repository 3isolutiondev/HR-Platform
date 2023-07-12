import validator from 'validator';
import isEmpty from '../common/isEmpty';

export function validate(data) {
	let errors = {};

	if (!data.acceptedIds) {
		errors.acceptedIds = 'Profile ID(s) is required';
	} else if (!Array.isArray(data.acceptedIds)) {
		errors.acceptedIds = 'Invalid Profile ID(s) data';
	} else if (data.acceptedIds.length < 1) {
		errors.acceptedIds = 'Profile ID(s) is required';
	} else {
		data.acceptedIds.map((id) => {
			if (!validator.isInt(id.toString())) {
				errors.acceptedIds = 'Invalid Profile ID(s) data';
			}
		});
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
