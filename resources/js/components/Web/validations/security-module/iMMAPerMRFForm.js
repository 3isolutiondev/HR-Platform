import validator from 'validator'
import isEmpty from '../common/isEmpty';
import { checkTransportationByVehicle } from '../../utils/helper';

// Validate MRF Form Data
export function validateMRFForm(data) {
  let errors = {}
  data.itineraries = !isEmpty(data.itineraries) ? data.itineraries : '';
  data.country = !isEmpty(data.country) ? data.country : '';
  data.risk_level = !isEmpty(data.risk_level) ? data.risk_level : '';
  let criticality_of_the_movement = !isEmpty(data.criticality_of_the_movement) ? data.criticality_of_the_movement : '';
  let travel_type = !isEmpty(data.travel_type) ? data.travel_type : '';
  data.travel_details = !isEmpty(data.travel_details) ? data.travel_details : '';

  let itineraries = [...data.itineraries]
  let travel_details = [...data.travel_details]

  if (validator.isEmpty(data.transportation_type)) {
    errors.transportation_type = 'Transportation Type is required';
  } else {
    if (data.transportation_type !== 'air-travel' && data.transportation_type !== 'ground-travel' && data.transportation_type !== 'air-and-ground-travel') {
      errors.transportation_type = 'Invalid Transportation Type data';
    }
  }

  if (validator.isEmpty(travel_type.toString())) {
    errors.travel_type = 'Type of Travel is required, Please pick one of the options.';
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
    itineraries = itineraries.map(itinerary => {
      let itineraryError = {}

      if (data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') {
        if (isEmpty(itinerary.date_time)) {
          itineraryError.date_time = 'Date is required';
        }

        if (isEmpty(itinerary.etd)) {
          itineraryError.etd = 'Estimated Time Departure is required';
        }

        if (isEmpty(itinerary.eta)) {
          itineraryError.eta = 'Estimated Time Arrival is required';
        }

        if (validator.isEmpty(itinerary.from_city)) {
          itineraryError.from_city = 'From (City & Coordinates) is required';
        }

        if (validator.isEmpty(itinerary.to_city)) {
          itineraryError.to_city = 'To (City & Coordinates) is required';
        }

        if (isEmpty(itinerary.travelling_by)) {
          itineraryError.travelling_by = 'Travelling type is required';
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
      } else {
        if (isEmpty(itinerary.date_time)) {
          itineraryError.date_time = 'Date is required';
        }

        if (isEmpty(errors.travel_type) && isEmpty(itinerary.return_date_time)) {
          if (travel_type.toString() == 'round-trip') {
            itineraryError.return_date_time = 'Return Date is required';
          }
        }

        if (validator.isEmpty(itinerary.from_city)) {
          itineraryError.from_city = 'From (City) is required';
        }

        if (validator.isEmpty(itinerary.to_city)) {
          itineraryError.to_city = 'To (City) is required';
        }
      }

      if (isEmpty(itinerary.overnight)) {
        itineraryError.overnight = 'Overnight is required'
      } else {
        if (itinerary.overnight.toString() !== '1' && itinerary.overnight.toString() !== '0') {
          itineraryError.overnight = "Invalid Overnight data"
        }
      }

      if (!isEmpty(itineraryError)) {
        errors.itineraries = 'Please add your Itinerary.';
      }

      return Object.assign(itinerary, { errors: itineraryError });
    })
  }

  if (isEmpty(data.country)) {
    errors.country = 'Country is required';
  } else if (typeof data.country.value !== 'undefined') {
    if (!validator.isInt(data.country.value.toString())) {
      errors.country = 'Invalid Country data'
    }
  }

  if (validator.isEmpty(data.purpose)) {
    errors.purpose = 'Purpose and Justification is required';
  }

  if (isEmpty(errors.transportation_type)) {
    if (data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') {
      if (validator.isEmpty(criticality_of_the_movement.toString())) {
        errors.criticality_of_the_movement = 'Criticality of the Movement is required. Please pick one of the options.';
      }

      if (validator.isEmpty(data.security_measure)) {
        errors.security_measure = 'Security Measures is required. Please pick one of the options.';
      }
    }

    if ((data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') && data.country.vehicle_filled_by_immaper == 'no' && data.vehicle_filled_by_yourself == 'yes') {
      if (isEmpty(data.vehicle_filled_by_yourself)) {
        errors.vehicle_filled_by_yourself = 'Vehicle Details are required';
      } else if (data.vehicle_filled_by_yourself !== 'yes' && data.vehicle_filled_by_yourself !== 'no') {
        errors.vehicle_filled_by_yourself = 'Invalid Vehicle Details format';
      }
    }

    if (((data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') && checkTransportationByVehicle(itineraries) && data.country.vehicle_filled_by_immaper == 'yes') ||
      ((data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') && checkTransportationByVehicle(itineraries) && data.country.vehicle_filled_by_immaper == 'no' && data.isSecurity && data.action == 'approve') ||
      ((data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') && checkTransportationByVehicle(itineraries) && data.country.vehicle_filled_by_immaper == 'no' && data.vehicle_filled_by_yourself == 'yes')
    ) {
      if (isEmpty(data.travel_details)) {
        errors.travel_details = 'Vehicle Details are required'
      } else if (!Array.isArray(data.travel_details)) {
        errors.travel_details = 'Invalid Vehicle Details format'
      } else {
        if (data.multiVehicle && data.travel_details.length < 2 && data.security_measure == 'multiple-vehicle-movements') {
          errors.travel_details = "Please add at least one more vehicle."
        }
      }

      travel_details = travel_details.map((travelDetail) => {

        let travelDetailError = {}
         if (data.security_measure == 'use-of-hire-car') {
            if (validator.isEmpty(travelDetail.company_name != null ? travelDetail.company_name : '')) {
              travelDetailError.company_name = 'Company name is required';
            }
    
            if (validator.isEmpty(travelDetail.company_email != null ? travelDetail.company_email : '')) {
              travelDetailError.company_email = 'Company Email is required';
            }  else if (!validator.isEmail(travelDetail.company_email)) {
              travelDetailError.company_email = 'Company Email is invalid';
            }
    
            if (validator.isEmpty(travelDetail.company_phone_number != null ? travelDetail.company_phone_number : '')) {
              travelDetailError.company_phone_number = 'Company phone number is required';
            }
         } else {
            if (validator.isEmpty(travelDetail.vehicle_make != null ? travelDetail.vehicle_make : '')) {
              travelDetailError.vehicle_make = 'Make is required';
            }
    
            if (validator.isEmpty(travelDetail.vehicle_model != null ? travelDetail.vehicle_model : '')) {
              travelDetailError.vehicle_model = 'Model is required';
            }
    
            if (validator.isEmpty(travelDetail.vehicle_color != null ? travelDetail.vehicle_color : '')) {
              travelDetailError.vehicle_color = 'Color is required';
            }
    
            if (validator.isEmpty(travelDetail.vehicle_plate != null ? travelDetail.vehicle_plate : '')) {
              travelDetailError.vehicle_plate = 'Plate is required';
            }
    
            if (validator.isEmpty(travelDetail.comm_gsm != null ? travelDetail.comm_gsm : '')) {
              travelDetailError.comm_gsm = 'GSM is required';
            }
    
            if (validator.isEmpty(travelDetail.comm_vhf_radio != null ? travelDetail.comm_vhf_radio.toString() : '')) {
              travelDetailError.comm_vhf_radio = 'VHF Radio is required';
            }
    
            if (validator.isEmpty(travelDetail.comm_sat_tracker != null ? travelDetail.comm_sat_tracker.toString() : '')) {
              travelDetailError.comm_sat_tracker = 'Sat Tracker is required';
            }
    
            if (validator.isEmpty(travelDetail.personnel_on_board != null ? travelDetail.personnel_on_board : '')) {
              travelDetailError.personnel_on_board = 'Personnel On Board is required';
            }
         }

        if (!isEmpty(travelDetailError)) {
          errors.travel_details = 'Please add the Vehicle Details.';
        }

        return Object.assign(travelDetail, { errors: travelDetailError });
      })
    }
  }

  if (data.isSecurity) {
    if (!isEmpty(data.action)) {
      if (isEmpty(errors.transportation_type)) {
        if (data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') {
          if (validator.isEmpty(data.movement_state)) {
            errors.movement_state = 'Move Risk is required. Please pick one of the options.';
          }
        }
      }
      switch (data.action) {
        case "disapprove":
          if (validator.isEmpty(data.disapproved_reasons)) {
            errors.disapproved_reasons = "A Reason is required"
          }
          break;
        case "revision":
          if (validator.isEmpty(data.revision_needed)) {
            errors.revision_needed = "A Revision Explanation is required"
          }
          break;
        case "approve":
          if (data.transportation_type == 'ground-travel' || data.transportation_type == 'air-and-ground-travel') {
            if (validator.isEmpty(data.security_assessment)) {
              errors.security_assessment = "Security Assessment is required"
            }
          }
          break;
        default:
      }
    } else {
      errors.action = "Security Action is required"
    }
  }

  if (data.transportation_type == 'air-and-ground-travel') {
    let travellingBy = [];
    let countFlight = 0;
    let countNonFlight = 0;

    if (itineraries.length >= 2) {
      itineraries.map(itinerary => {
        travellingBy.push(itinerary.travelling_by);
      });
      travellingBy.forEach((v) => (v == 'Flight' && countFlight++));
      travellingBy.forEach((v) => (v != 'Flight' && countNonFlight++));

      if (!(countFlight > 0 && countNonFlight > 0)) {
        errors.airAndGroundTravel = "The itineraries should have at least 1 itinerary with “Flight“ option selected and 1 itinerary with 1 non-flight option selected";
      }
    } else {
      errors.airAndGroundTravel = 'The form should have at least has 2 itineraries.';
    }
  }

  return {
    errors,
    itineraryData: itineraries,
    travelDetails: travel_details,
    isVald: isEmpty(errors)
  }
}
