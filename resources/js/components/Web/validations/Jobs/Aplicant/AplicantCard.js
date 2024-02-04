import validator from 'validator';
import isEmpty from '../../common/isEmpty';

export function validateAplicantData(data) {
	let errors = {};

	const timezone = !isEmpty(data.timezone) ? data.timezone : {};

	if (isEmpty(timezone)) {
		errors.timezone = 'Timezone is required';
	}

	if (data.interview_type == 1) {
		if (isEmpty(data.interview_address)) {
			errors.interview_address = 'Address is required';
		}
	}

	if (!Array.isArray(data.immaper_invite)) {
		errors.immaper_invite = 'Invite Consultant is required';
	} else if (data.immaper_invite.length < 1) {
		errors.immaper_invite = 'Invite Consultant is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
