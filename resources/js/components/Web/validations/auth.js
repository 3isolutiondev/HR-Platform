import validator from 'validator';
import isEmpty from './common/isEmpty';

const strongPassPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;

export function validateLogin(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	} else if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password  is required';
	} else if (!validator.isLength(data.password, { min: 8, max: 20 })) {
		errors.password = 'Password must be between 8 and 20 characters';
		// } else if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)) {
		//   errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character, whitespace is not allowed"
	}

	if (typeof data.remember !== 'boolean') {
		errors.remember = 'Invalid Format';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateRegister(data) {
	let errors = {};

	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : '';
	data.family_name = !isEmpty(data.family_name) ? data.family_name : '';
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation : '';

	if (validator.isEmpty(data.first_name)) {
		errors.first_name = 'First name is required';
	} else if (!validator.isLength(data.first_name, { min: 3 })) {
		errors.first_name = 'First name minimum 3 characters';
	}

	if (!validator.isEmpty(data.middle_name)) {
		if (!validator.isLength(data.middle_name, { min: 3 })) {
			errors.middle_name = 'Middle name minimum 3 characters';
		}
	}

	if (validator.isEmpty(data.family_name)) {
		errors.family_name = 'Family name is required';
	} else if (!validator.isLength(data.family_name, { min: 3 })) {
		errors.family_name = 'Family name minimum 3 characters';
	}

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	} else if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	} else if (/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(immap)\.org$/.test(data.email)) {
		errors.email = 'You cannot use iMMAP email address';
	}

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password is required';
	} else if (!validator.isLength(data.password, { min: 8, max: 20 })) {
		errors.password = 'Password must be between 8 and 20 characters';
		// } else if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)) {
		//   errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character, whitespace is not allowed"
	} else if (!validator.matches(data.password, strongPassPattern)) {
		errors.password = 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Symbol/Character';
	}

	if (validator.isEmpty(data.password_confirmation)) {
		errors.password_confirmation = 'Password confirmation is required';
	} else if (!validator.equals(data.password_confirmation, data.password)) {
		errors.password_confirmation = 'Password confirmation mismatch with password';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateResetPassword(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	} else if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateResetPasswordForm(data) {
	let errors = {};

	data.password = !isEmpty(data.password) ? data.password : '';
	data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation : '';

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password is required';
	} else if (!validator.isLength(data.password, { min: 8, max: 20 })) {
		errors.password = 'Password must be between 8 and 20 characters';
	} else if (!validator.matches(data.password, strongPassPattern)) {
		errors.password = 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Symbol/Charaacter';
	}

	if (validator.isEmpty(data.password_confirmation)) {
		errors.password_confirmation = 'Password confirmation is required';
	} else if (!validator.equals(data.password_confirmation, data.password)) {
		errors.password_confirmation = 'Password confirmation mismatch with password';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
