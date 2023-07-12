import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  } else if (!validator.isLength(data.name, {min:3})) {
    errors.name = 'Name minimum 3 characters'
  }

  if (data.permissions.length < 1) {
    errors.permissions = "Permission Required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
