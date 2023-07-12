import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.status = !isEmpty(data.status) ? data.status : ''

  if (validator.isEmpty(data.status)) {
    errors.status = "Status is required"
  } else if (!validator.isLength(data.status,{min:4})) {
    errors.status = "Status minimum 4 characters"
  }

  if (data.under_sbp_program === "yes") {
    if (validator.isEmpty(data.status_under_sbp_program)) {
      errors.status_under_sbp_program = "Status for Surge Roster Program Alert is required"
    } else if (!validator.isLength(data.status,{min:4})) {
      errors.status_under_sbp_program = "Status minimum 4 characters"
    } else if (!validator.isLength(data.status,{max:20})) {
      errors.status_under_sbp_program = "Status maximum 20 characters"
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}
