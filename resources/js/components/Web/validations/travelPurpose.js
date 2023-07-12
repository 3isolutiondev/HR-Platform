import validator from 'validator'
import isEmpty from './common/isEmpty'

export function validate(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.has_round_trip = !isEmpty(data.has_round_trip) ? data.has_round_trip : ''

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required"
  } else if (!validator.isLength(data.name, { min: 3 })) {
    errors.name = 'Name minimum 3 characters'
  }

  if (validator.isEmpty(data.has_round_trip.toString())) {
    errors.has_round_trip = "Has round trip is required"
  } else if (!validator.isBoolean(data.has_round_trip.toString())) {
    errors.has_round_trip = 'Invalid has round trip format'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
