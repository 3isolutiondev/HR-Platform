import validator from 'validator'
import isEmpty from './common/isEmpty'

const strongPassPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;

export function validate(data) {
  let errors = {}

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(validator.isEmpty(data.username)) {
    errors.username = "Name is required"
  }

  if (!data.isEdit) {
    if (validator.isEmpty(data.password)) {
      errors.password = 'Password is required';
    } else if (!validator.isLength(data.password, { min: 12})) {
      errors.password = 'Password must be at least 12 characters';
    } else if (!validator.matches(data.password, strongPassPattern)) {
      errors.password = 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Symbol/Character';
    }
  } else if (data.password != '') {
    if (!validator.isLength(data.password, { min: 12})) {
      errors.password = 'Password must be at least 12 characters';
    } else if (!validator.matches(data.password, strongPassPattern)) {
      errors.password = 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Symbol/Character';
    }
  }

  if(isEmpty(data.permissions)) {
    errors.permissions = "Permission is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
