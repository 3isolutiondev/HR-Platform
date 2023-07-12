import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.is_multi_vehicle = !isEmpty(data.is_multi_vehicle) ? data.is_multi_vehicle : ''

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  } else if (!validator.isLength(data.name, { min: 3 })) {
    errors.name = 'Name minimum 3 characters'
  }

  if (validator.isEmpty(data.is_multi_vehicle.toString())) {
    errors.is_multi_vehicle = "Is multi vehicle is required"
  } else if (!validator.isBoolean(data.is_multi_vehicle.toString())) {
    errors.is_multi_vehicle = 'Invalid is multi vehicle format'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
