import validator from 'validator';
import isEmpty from './common/isEmpty';
import { store } from '../redux/store';

export function validateRole(selectedRoles) {
  if (isEmpty(selectedRoles)) {
		return 'Role is required';
	} else {
		let matchCount = 0;
		const { roles } = store.getState().options;

		roles.forEach(role => {
      if (!isEmpty(selectedRoles.find(selRole => (selRole.value == role.value && selRole.label == role.label)))) {
        matchCount = matchCount + 1;
      }
		});

		if (matchCount < 1) {
			return 'Role is required';
		}
	}

  return '';
}

export function validateStore(data) {
	let errors = {};

	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : '';
	data.family_name = !isEmpty(data.family_name) ? data.family_name : '';
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation : '';
	data.role = !isEmpty(data.role) ? data.role : '';

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
	}

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password is required';
	} else if (!validator.isLength(data.password, { min: 6, max: 20 })) {
		errors.password = 'Password must be between 6 and 20 characters';
		// } else if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)) {
		//   errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character, whitespace is not allowed"
	}

	if (validator.isEmpty(data.password_confirmation)) {
		errors.password_confirmation = 'Password confirmation is required';
	} else if (!validator.equals(data.password_confirmation, data.password)) {
		errors.password_confirmation = 'Password confirmation mismatch with password';
	}

  const checkRole = validateRole(data.role);

  if (!isEmpty(checkRole)) {
    errors.role = checkRole
  }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
export function validateUpdate(data) {
	let errors = {};

	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : '';
	data.family_name = !isEmpty(data.family_name) ? data.family_name : '';
	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	// data.change_password = !isEmpty(data.change_password) ? data.change_password : ''
	data.old_password = !isEmpty(data.old_password) ? data.old_password : '';
	data.new_password = !isEmpty(data.new_password) ? data.new_password : '';
	data.new_password_confirmation = !isEmpty(data.new_password_confirmation) ? data.new_password_confirmation : '';
	data.role = !isEmpty(data.role) ? data.role : '';

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
	}

	if (data.change_password !== 1 && data.change_password !== 0 && typeof data.change_password !== 'undefined') {
		errors.change_password = 'Invalid change password format';
	}

	if (validator.isEmpty(data.old_password) && data.change_password === 1) {
		errors.old_password = 'Old Password is required';
	} else if (!validator.isLength(data.old_password, { min: 6, max: 20 }) && data.change_password === 1) {
		errors.old_password = 'Old Password must be between 6 and 20 characters';
		// } else if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)) {
		//   errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character, whitespace is not allowed"
	}

	if (validator.isEmpty(data.new_password) && data.change_password === 1) {
		errors.new_password = 'New Password is required';
	} else if (!validator.isLength(data.new_password, { min: 6, max: 20 }) && data.change_password === 1) {
		errors.new_password = 'New Password must be between 6 and 20 characters';
		// } else if (!validator.matches(data.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)) {
		//   errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character, whitespace is not allowed"
	} else if (data.new_password == data.old_password && data.change_password === 1) {
		errors.new_password = 'New Password should be different with the Old Password';
	}

	if (validator.isEmpty(data.new_password_confirmation) && data.change_password === 1) {
		errors.new_password_confirmation = 'New Password confirmation is required';
	} else if (!validator.equals(data.new_password_confirmation, data.new_password) && data.change_password === 1) {
		errors.new_password_confirmation = 'Password confirmation mismatch with new password';
	}

	const checkRole = validateRole(data.role);

  if (!isEmpty(checkRole)) {
    errors.role = checkRole
  }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
