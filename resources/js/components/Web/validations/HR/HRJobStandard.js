import isEmpty from '../common/isEmpty'
import validator from 'validator'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  } else if (!validator.isLength(data.name, {min:3})) {
    errors.name = 'Name minimum 3 characters'
  }

  if (data.hrJobCategories.length < 1) {
    errors.hrJobCategories = "Job Category is Required"
  }

  if (data.sbp_recruitment_campaign == "yes" && data.under_sbp_program == "yes") {
    errors.sbp_recruitment_campaign = errors.under_sbp_program = 'Please choose between surge alert or surge recruitment campaign';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
