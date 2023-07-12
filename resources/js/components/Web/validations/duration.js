import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''

  if(validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
