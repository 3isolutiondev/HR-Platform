import {
  IMMAPER_TAR_FORM_ADD_CONNECTION,
  IMMAPER_TAR_FORM_DELETE_CONNECTION,
  IMMAPER_TAR_FORM_CHANGE_ITINERARY,
  IMMAPER_TAR_FORM_ONCHANGE,
  IMMAPER_TAR_FORM_RESET
} from '../../types/security-module/iMMAPerTARFormTypes'

const itinerary = {
  id: '',
  date_travel: null,
  return_date_travel: null,
  from_country: '',
  from_city: '',
  to_country: '',
  to_city: '',
  flight_number: '',
  flight_number_outbound_trip: '',
  flight_number_return_trip: '',
  overnight: 0,
  overnight_explanation: '',
  outbound_trip_final_destination: 0,
  check_in: 0,
  check_in_outbound: 0,
  check_in_return: 0,
  need_government_paper: 'no',
  need_government_paper_now: '0',
  government_paper: '',
  government_paper_id: '',

}

const initialState = {
  isEdit: false,
  isLoading: false,
  itineraries: [{
    id: '',
    date_travel: null,
    return_date_travel: null,
    from_country: '',
    from_city: '',
    to_country: '',
    to_city: '',
    flight_number: '',
    flight_number_outbound_trip: '',
    flight_number_return_trip: '',
    overnight: 0,
    overnight_explanation: '',
    is_high_risk: '0',
    outbound_trip_final_destination: 0,
    check_in: 0,
    check_in_outbound: 0,
    check_in_return: 0,
    need_government_paper: 'no',
    need_government_paper_now: '0',
    government_paper: '',
    government_paper_id: '',
  }],
  heat_certificate: '0',
  is_high_risk: '0',
  travel_purpose: 'leave',
  travel_type: 'one-way-trip',
  remarks: '',
  status: '',
  submitted_date: '',
  disapproved_reasons: '',
  revision_needed: '',
  approved_comments: '',
  security_measure_email: '0',
  security_measure_smart24: '0',
  security_measure_immap_careers: '0',
  immaper_name: '',
  immaper_line_manager: '',
  immaper_country_office: '',
  immaper_position: '',
  immaper_end_of_current_contract: '',
  last_edit: '',
  is_sbp_member: '',
  action: '',
  isSecurity: false,
  errors: {},
  edit_flight_number: false,
  allriskLevels: [
    { value: "High", label: "High" },
    { value: "Moderate", label: "Moderate" },
    { value: "Low", label: "Low" },
    { value: "Negligible", label: "Negligible"},
    { value: "Unknown", label: "Unknown" }
  ],
  risk_level: '',
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case IMMAPER_TAR_FORM_ADD_CONNECTION:
      return {
        ...state,
        itineraries: [...state.itineraries, itinerary]
      };
    case IMMAPER_TAR_FORM_DELETE_CONNECTION:
      return {
        ...state,
        itineraries: state.itineraries.filter((item, index) => index !== action.itineraryIndex)
      };
    case IMMAPER_TAR_FORM_CHANGE_ITINERARY:
      return {
        ...state,
        itineraries: action.itineraries
      };

    case IMMAPER_TAR_FORM_ONCHANGE:
      return {
        ...state,
        [action.name]: action.value
      };

    case IMMAPER_TAR_FORM_RESET:
      return {
        ...state,
        isEdit: false,
        isLoading: false,
        itineraries: [{
          id: '',
          date_travel: null,
          return_date_travel: null,
          from_country: '',
          from_city: '',
          to_country: '',
          to_city: '',
          flight_number: '',
          flight_number_outbound_trip: '',
          flight_number_return_trip: '',
          overnight: 0,
          overnight_explanation: '',
          is_high_risk: '0',
          outbound_trip_final_destination: 0,
          check_in: 0,
          check_in_outbound: 0,
          check_in_return: 0,
          need_government_paper: 'no',
          need_government_paper_now: '0',
          government_paper: '',
          government_paper_id: '',
        }],
        heat_certificate: '0',
        is_high_risk: '0',
        travel_purpose: 'leave',
        travel_type: 'one-way-trip',
        remarks: '',
        submitted_date: '',
        disapproved_reasons: '',
        revision_needed: '',
        approved_comments: '',
        security_measure_email: '0',
        security_measure_smart24: '0',
        security_measure_immap_careers: '0',
        immaper_name: '',
        immaper_line_manager: '',
        immaper_country_office: '',
        immaper_position: '',
        immaper_end_of_current_contract: '',
        last_edit: '',
        is_sbp_member: '',
        action: '',
        status: '',
        errors: {},
        edit_flight_number: false,
        risk_level: '',
      }
    default:
      return state;
  }
};
