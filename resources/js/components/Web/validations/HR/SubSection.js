import validator from 'validator'
import isEmpty from '../common/isEmpty'

export function validate(data) {
  let errors = {}

  data.sub_section = !isEmpty(data.sub_section) ? data.sub_section : ''
  data.sub_section_content = !isEmpty(data.sub_section_content) ? data.sub_section_content : ''

  if (validator.isEmpty(data.sub_section)) {
    errors.sub_section = "Sub Section is required"
  }

  if (validator.isEmpty(data.sub_section_content) || data.sub_section_content === "<p><br></p>") {
    errors.sub_section_content = "Sub Section Content is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
