import validator from 'validator'
import isEmpty from '../common/isEmpty'

export function validate(data) {
  let errors = {}

  data.search = !isEmpty(data.search) ? data.search : ''

  if (!validator.isEmpty(data.search)) {
    if (!validator.isLength(data.search,{min:4})) {
      errors.search = "Keyword minimum 4 characters"
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
