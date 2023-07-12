import {
  IMMAPER_MRF_FORM_ADD_CONNECTION,
  IMMAPER_MRF_FORM_DELETE_CONNECTION,
  IMMAPER_MRF_FORM_CHANGE_ITINERARY,
  IMMAPER_MRF_FORM_ONCHANGE,
  IMMAPER_MRF_FORM_CHANGE_TRAVEL_DETAIL,
  IMMAPER_MRF_FORM_ADD_TRAVEL_DETAIL,
  IMMAPER_MRF_FORM_DELETE_TRAVEL_DETAIL,
  IMMAPER_MRF_FORM_RESET,
  MRF_RESET_ITINERARY,
  MRF_RESET_TRAVEL_DETAIL
} from '../../types/security-module/iMMAPerMRFFormTypes'

const initialState = {
  isEdit: false,
  isLoading: false,
  itineraries: [{
    id: '',
    date_time: null,
    return_date_time: null,
    etd: null,
    eta: null,
    from_city: '',
    to_city: '',
    need_government_paper: 'no',
    need_government_paper_now: '0',
    government_paper: '',
    government_paper_id: '',
    overnight: '0',
    overnight_explanation: '',
    flight_number: null,
    flight_number_outbound_trip: null,
    flight_number_return_trip: null,
    travelling_by: '',
    outbound_trip_final_destination: 0,
    check_in:0,
    check_in_outbound:0,
    check_in_return:0
    
  }],
  allTravellingTypes: [
    { value: "Vehicle", label: "Vehicle" },
    { value: "Train", label: "Train" },
    { value: "Boat", label: "Boat" }
  ],
  allTravellingTypesWithFlight: [
    { value: "Vehicle", label: "Vehicle" },
    { value: "Train", label: "Train" },
    { value: "Boat", label: "Boat" },
    { value: "Flight", label: "Flight" }
  ],
  allriskLevels: [
    { value: "High", label: "High" },
    { value: "Moderate", label: "Moderate" },
    { value: "Low", label: "Low" },
    { value: "Negligible", label: "Negligible"},
    { value: "Unknown", label: "Unknown" }
  ],
  itinerary: {
    id: '',
    date_time: null,
    return_date_time: null,
    etd: null,
    eta: null,
    from_city: '',
    to_city: '',
    need_government_paper: 'no',
    need_government_paper_now: '0',
    government_paper: '',
    government_paper_id: '',
    overnight: '0',
    overnight_explanation: '',
    flight_number: null,
    flight_number_outbound_trip: null,
    flight_number_return_trip: null,
    travelling_by: '',
    outbound_trip_final_destination: 0,
    check_in:0,
    check_in_outbound:0,
    check_in_return:0
  },
  transportation_type: '',
  country: '',
  travel_type: 'one-way-trip',
  purpose: '',
  criticality_of_the_movement: '',
  submitted_date: '',
  edit_flight_number: false,
  risk_level: '',
  travel_details: [{
    id: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_plate: '',
    comm_gsm: '',
    comm_sat_phone: '',
    comm_vhf_radio: 0,
    comm_sat_tracker: 0,
    ppe: 0,
    medical_kit: 0,
    personnel_on_board: '',
    comm_vhf_radio_call_sign: '',
    company_name: '',
    company_email: '',
    company_phone_number: '',
    company_driver: ''
  }],
  travel_detail: {
    id: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_plate: '',
    comm_gsm: '',
    comm_sat_phone: '',
    comm_vhf_radio: 0,
    comm_sat_tracker: 0,
    ppe: 0,
    medical_kit: 0,
    personnel_on_board: '',
    comm_vhf_radio_call_sign: '',
    company_name: '',
    company_email: '',
    company_phone_number: '',
    company_driver: ''
  },
  multiVehicle: false,
  vehicle_filled_by_yourself: 'yes',
  immaper_name: '',
  immaper_line_manager: '',
  immaper_country_office: '',
  immaper_position: '',
  immaper_end_of_current_contract: '',
  last_edit: '',
  is_sbp_member: '',

  movement_state: '',
  status: '',
  action: '',
  disapproved_reasons: '',
  revision_needed: '',
  approved_comments: '',
  security_measure_email: '0',
  security_measure_smart24: '0',
  security_measure_immap_careers: '0',
  security_assessment: '',
  security_measure: 'single-vehicle-movement',

  isSecurity: false,
  errors: {}
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case IMMAPER_MRF_FORM_ADD_CONNECTION:
      return {
        ...state,
        itineraries: [...state.itineraries, state.itinerary]
      };
    case IMMAPER_MRF_FORM_DELETE_CONNECTION:
      return {
        ...state,
        itineraries: state.itineraries.filter((item, index) => index !== action.itineraryIndex)
      };
    case IMMAPER_MRF_FORM_CHANGE_ITINERARY:
      return {
        ...state,
        itineraries: action.itineraries
      };
    case IMMAPER_MRF_FORM_CHANGE_TRAVEL_DETAIL:
      return {
        ...state,
        travel_details: action.travel_details
      };
    case IMMAPER_MRF_FORM_ONCHANGE:
      return {
        ...state,
        [action.name]: action.value
      }
    case IMMAPER_MRF_FORM_ADD_TRAVEL_DETAIL:
      return {
        ...state,
        travel_details: [...state.travel_details, state.travel_detail]
      };
    case IMMAPER_MRF_FORM_DELETE_TRAVEL_DETAIL:
      return {
        ...state,
        travel_details: state.travel_details.filter((item, index) => index !== action.travel_detail_index)
      };
    case MRF_RESET_ITINERARY:
      return {
        ...state,
        itineraries: [{
          id: '',
          date_time: null,
          return_date_time: null,
          etd: null,
          eta: null,
          from_city: '',
          to_city: '',
          need_government_paper: 'no',
          need_government_paper_now: '0',
          government_paper: '',
          government_paper_id: '',
          overnight: '0',
          overnight_explanation: '',
          flight_number: null,
          flight_number_outbound_trip: null,
          flight_number_return_trip: null,
          travelling_by: '',
          outbound_trip_final_destination: 0,
          check_in:0,
          check_in_outbound:0,
          check_in_return:0

        }]
      }
    case MRF_RESET_TRAVEL_DETAIL:
      return {
        ...state,
        travel_details: [{
          id: '',
          vehicle_make: '',
          vehicle_model: '',
          vehicle_color: '',
          vehicle_plate: '',
          comm_gsm: '',
          comm_sat_phone: '',
          comm_vhf_radio: 0,
          comm_sat_tracker: 0,
          ppe: 0,
          medical_kit: 0,
          personnel_on_board: '',
          comm_vhf_radio_call_sign: '',
          company_name: '',
          company_email: '',
          company_phone_number: '',
          company_driver: ''
        }],
      }
    case IMMAPER_MRF_FORM_RESET:
      return {
        ...state,
        isEdit: false,
        isLoading: false,
        itineraries: [{
          id: '',
          date_time: null,
          return_date_time: null,
          etd: null,
          eta: null,
          from_city: '',
          to_city: '',
          need_government_paper: 'no',
          need_government_paper_now: '0',
          government_paper: '',
          government_paper_id: '',
          overnight: '0',
          overnight_explanation: '',
          flight_number: null,
          flight_number_outbound_trip: null,
          flight_number_return_trip: null,
          travelling_by: '',
          outbound_trip_final_destination: 0,
          check_in:0,
          check_in_outbound:0,
          check_in_return:0

        }],
        itinerary: {
          id: '',
          date_time: null,
          return_date_time: null,
          etd: null,
          eta: null,
          from_city: '',
          to_city: '',
          need_government_paper: 'no',
          need_government_paper_now: '0',
          government_paper: '',
          government_paper_id: '',
          overnight: '0',
          overnight_explanation: '',
          flight_number: null,
          flight_number_outbound_trip: null,
          flight_number_return_trip: null,
          travelling_by: '',
          outbound_trip_final_destination: 0,
          check_in:0,
          check_in_outbound:0,
          check_in_return:0

        },
        transportation_type: '',
        country: '',
        travel_type: 'one-way-trip',
        purpose: '',
        criticality_of_the_movement: '',
        submitted_date: '',
        edit_flight_number: false,
        risk_level: '',
        travel_details: [{
          id: '',
          vehicle_make: '',
          vehicle_model: '',
          vehicle_color: '',
          vehicle_plate: '',
          comm_gsm: '',
          comm_sat_phone: '',
          comm_vhf_radio: 0,
          comm_sat_tracker: 0,
          ppe: 0,
          medical_kit: 0,
          personnel_on_board: '',
          comm_vhf_radio_call_sign: '',
          company_name: '',
          company_email: '',
          company_phone_number: '',
          company_driver: ''
        }],
        travel_detail: {
          id: '',
          vehicle_make: '',
          vehicle_model: '',
          vehicle_color: '',
          vehicle_plate: '',
          comm_gsm: '',
          comm_sat_phone: '',
          comm_vhf_radio: 0,
          comm_sat_tracker: 0,
          ppe: 0,
          medical_kit: 0,
          personnel_on_board: '',
          comm_vhf_radio_call_sign: '',
          company_name: '',
          company_email: '',
          company_phone_number: '',
          company_driver: ''
        },
        multiVehicle: false,
        vehicle_filled_by_yourself: 'yes',
        immaper_name: '',
        immaper_line_manager: '',
        immaper_country_office: '',
        immaper_position: '',
        immaper_end_of_current_contract: '',
        last_edit: '',
        is_sbp_member: '',
        movement_state: '',
        security_measure: 'single-vehicle-movement',
        security_assessment: '',
        status: '',
        action: '',
        disapproved_reasons: '',
        revision_needed: '',
        approved_comments: '',
        security_measure_email: '0',
        security_measure_smart24: '0',
        security_measure_immap_careers: '0',
        errors: {}
      }
    default:
      return state;
  }
};
