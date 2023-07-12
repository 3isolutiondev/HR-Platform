import validator from 'validator'
import isEmpty from '../common/isEmpty';


//  Validate TAR Form data
export function validateTARForm(data) {
  let errors = {}
  let travel_purpose = !isEmpty(data.travel_purpose) ? data.travel_purpose : '';
  let travel_type = !isEmpty(data.travel_type) ? data.travel_type : '';
  data.itineraries = !isEmpty(data.itineraries) ? data.itineraries : '';
  data.explanation = !isEmpty(data.explanation) ? data.explanation : '';
  data.risk_level = !isEmpty(data.risk_level) ? data.risk_level : '';

  let itineraries = [...data.itineraries]

  if (validator.isEmpty(travel_type)) {
    errors.travel_type = "Type of Travel is required"
  } else {
    if (!validator.isIn(travel_type, ['one-way-trip', 'round-trip', 'multi-location'])) {
      errors.travel_type = "Invalid Type of Travel data"
    }
  }

  if (isEmpty(errors.travel_type) && travel_type == "multi-location" && itineraries.length < 2) {
    errors.itineraries = "Please add at least one more itinerary."
  }

  if (isEmpty(data.risk_level)) {
    errors.risk_level = 'Risk level is required';
  }
  
  if (isEmpty(data.itineraries)) {
    errors.itineraries = 'Itinerary is required'
  } else if (!Array.isArray(data.itineraries)) {
    errors.itineraries = 'Invalid Itinerary format'
  } else {
    itineraries = data.itineraries.map((itinerary) => {
      let itineraryError = {}
      if (isEmpty(itinerary.date_travel)) {
        itineraryError.date_travel = (travel_type == "round-trip") ? 'Departure Date is required' : 'Date is required';
      }

      if (isEmpty(errors.travel_type)) {
        if (travel_type == 'round-trip' && isEmpty(itinerary.return_date_travel)) {
          itineraryError.return_date_travel = "Return Date is required"
        }
      }

      if (isEmpty(itinerary.from_country)) {
        itineraryError.from_country = 'From Country is required';
      } else if (!validator.isInt(itinerary.from_country.value.toString())) {
        itineraryError.from_country = 'Invalid From Country Data'
      }

      if (validator.isEmpty(itinerary.from_city)) {
        itineraryError.from_city = 'From (City) is required';
      }

      if (isEmpty(itinerary.to_country)) {
        itineraryError.to_country = 'To Country is required';
      } else if (!validator.isInt(itinerary.to_country.value.toString())) {
        itineraryError.to_country = 'Invalid To Country Data'
      }

      if (validator.isEmpty(itinerary.to_city)) {
        itineraryError.to_city = 'To (City) is required';
      }

      if (isEmpty(itinerary.overnight)) {
        errors.overnight = 'Overnight is required'
      } else if (itinerary.overnight.toString() !== '0' && itinerary.overnight.toString() !== '1') {
        errors.overnight = "Invalid Overnight data"
      }

      if (isEmpty(itinerary.need_government_paper)) {
        itineraryError.need_government_paper = 'Government Access Paper or UN Security Clearance is required'
      } else {
        if (itinerary.need_government_paper.toString() !== 'yes' && itinerary.need_government_paper.toString() !== 'no') {
          itineraryError.need_government_paper = "Invalid Government Access Paper or UN Security Clearance data"
        }

        if (itinerary.need_government_paper.toString() == 'yes') {
          if (itinerary.need_government_paper_now !== null) {
            if (itinerary.need_government_paper_now.toString() !== '1' && itinerary.need_government_paper_now.toString() !== '0') {
              itineraryError.need_government_paper_now = "Invalid Attach Your Government Access Paper or UN Security Clearance Now data"
            } else {
              if (itinerary.need_government_paper_now.toString() == '1') {
                if (isEmpty(itinerary.government_paper)) {
                  itineraryError.government_paper = "Government Access Paper or UN Security Clearance is required"
                }
              }
            }
          } else {
            itineraryError.need_government_paper_now = 'Attach Your Government Access Paper or UN Security Clearance Now is required'
          }
        }
      }

      if (!isEmpty(itineraryError)) {
        errors.itineraries = 'Please complete your itinerary data';
      }

      itinerary.errors = itineraryError

      return itinerary
    })
  }

  if (validator.isEmpty(travel_purpose.toString())) {
    errors.travel_purpose = 'Travel Purpose is required, Please choose one of the option...';
  }

  if (data.isSecurity) {
    if (!isEmpty(data.action)) {
      switch (data.action) {
        case "disapprove":
          if (validator.isEmpty(data.disapproved_reasons)) {
            errors.disapproved_reasons = "A reason is required"
          }
          break;
        case "revision":
          if (validator.isEmpty(data.revision_needed)) {
            errors.revision_needed = "A revision explanation is required"
          }
          break;
        case "approve":
          if (!validator.isEmpty(data.security_measure_email.toString())) {
            if (data.security_measure_email.toString() !== '1' && data.security_measure_email.toString() !== '0') {
              errors.security_measure = "Invalid security measure data"
            }
          }
          if (!validator.isEmpty(data.security_measure_smart24.toString())) {
            if (data.security_measure_smart24.toString() !== '1' && data.security_measure_smart24.toString() !== '0') {
              errors.security_measure = "Invalid security measure data"
            }
          }
          if (!validator.isEmpty(data.security_measure_immap_careers.toString())) {
            if (data.security_measure_immap_careers.toString() !== '1' && data.security_measure_immap_careers.toString() !== '0') {
              errors.security_measure = "Invalid security measure data"
            }
          }
          break;
        default:
      }
    } else {
      errors.action = "Security action is required"
    }
  }

  return {
    errors,
    itineraryData: itineraries,
    isValid: isEmpty(errors)
  }

}
