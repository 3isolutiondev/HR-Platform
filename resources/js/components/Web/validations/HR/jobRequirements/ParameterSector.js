import isEmpty from '../../common/isEmpty';
import validator from 'validator';

export function validate(data) {
	let errors = {};

	data.sector = !isEmpty(data.sector) ? data.sector : '';
	data.experience = !isEmpty(data.experience) ? data.experience.toString() : '';

	if (isEmpty(data.sector.value)) {
		errors.sector = 'Sector is required';
	} else if (!validator.isInt(data.sector.value.toString())) {
		errors.sector = 'Invalid sector data';
	}

	if (validator.isEmpty(data.experience)) {
		errors.experience = 'Experience is required';
	} else if (!validator.isInt(data.experience)) {
		errors.experience = 'Invalid experience data';
	}

	return { errors, isValid: isEmpty(errors) };
}
