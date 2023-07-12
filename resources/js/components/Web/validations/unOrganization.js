import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.abbreviation = !isEmpty(data.abbreviation) ? data.abbreviation : ''

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  } else if (!validator.isLength(data.name,{min:4})) {
    errors.name = "Name minimum 4 characters"
  }

  if (validator.isEmpty(data.abbreviation)) {
    errors. abbreviation = "Abbreviation is required"
  } else if(!validator.isLength(data.abbreviation,{min:2})) {
    errors.abbreviation = "Abbreviation should be at least 2 characters"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}
