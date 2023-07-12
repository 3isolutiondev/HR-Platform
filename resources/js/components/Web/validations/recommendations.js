import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  if (!data.profileIds) {
    errors.profileIds = "Profile ID(s) is required"
  } else if (!Array.isArray(data.profileIds)) {
    errors.profileIds = "Invalid Profile ID(s) data"
  } else if (data.profileIds.length < 1) {
    errors.profileIds = "Profile ID(s) is required"
  } else {
    data.profileIds.map((id) => {
      if (!validator.isInt(id.toString())) {
        errors.profileIds = "Invalid Profile ID(s) data"
      }
    })
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
