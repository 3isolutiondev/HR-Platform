import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.skill = !isEmpty(data.skill) ? data.skill : ''
  data.skill_for_matching = !isEmpty(data.skill_for_matching) ? data.skill_for_matching : ''
  data.category = !isEmpty(data.category) ? data.category : ''

  if ( validator.isEmpty(data.skill) ) {
    errors.skill = "Skill is required"
  }

  if ( !validator.isBoolean(data.skill_for_matching.toString()) ) {
    errors.skill_for_matching = "Invalid Data"
  }

  if ( validator.isEmpty(data.category) ) {
    errors.category = "Category is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
