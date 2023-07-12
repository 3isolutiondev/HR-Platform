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
} from '../../types/security-module/iMMAPerMRFFormTypes';
import { validateMRFForm } from '../../../validations/security-module/iMMAPerMRFForm';
import isEmpty from '../../../validations/common/isEmpty';
import axios from 'axios'
import { addFlashMessage } from '../webActions';

// Reset MRF Form Data
export const resetForm = () => {
  return { type: IMMAPER_MRF_FORM_RESET }
}

// Add Itinerary
export const addConnection = () => {
  return { type: IMMAPER_MRF_FORM_ADD_CONNECTION }
}

// Delete Itinerary
export const deleteConnection = (itineraryIndex) => {
  return { type: IMMAPER_MRF_FORM_DELETE_CONNECTION, itineraryIndex }
}

// Update Itinerary data
export const itineraryOnChange = (itineraries) => {
  return { type: IMMAPER_MRF_FORM_CHANGE_ITINERARY, itineraries }
}

// Update specific MRF data on reducer
export const onChange = (name, value) => {
  return {
    type: IMMAPER_MRF_FORM_ONCHANGE,
    name,
    value
  }
}

// Update specific MRF data on reducer for select field
export const selectOnChange = (value, e) => {
  return (dispatch) => {
    return dispatch(onChange([e.name], value));
  };
};

// check if the form isValid
export const isValid = () => (dispatch, getState) => {
  const { itineraries, country, purpose, criticality_of_the_movement,
    need_government_paper, need_government_paper_now, government_paper, travel_details,
    action, disapproved_reasons, revision_needed, approved_comments,
    movement_state, security_assessment, security_measure, transportation_type,
    isSecurity, travel_type, multiVehicle, vehicle_filled_by_yourself, outbound_trip_final_destination, risk_level } = getState().immaperMRFForm

  let { errors, itineraryData, travelDetails, isValid } = validateMRFForm({
    itineraries, country, purpose, criticality_of_the_movement,
    need_government_paper, need_government_paper_now, government_paper, travel_details,
    action, disapproved_reasons, revision_needed, approved_comments,
    movement_state, security_assessment, security_measure, transportation_type,
    isSecurity, travel_type, multiVehicle, vehicle_filled_by_yourself, outbound_trip_final_destination, risk_level
  })

  if (isValid) {
    return dispatch(onChange('errors', {}))
  } else {
    if (!isEmpty(errors.itineraries)) {
      dispatch(itineraryOnChange(itineraryData));
    }
    if (!isEmpty(errors.travel_details)) {
      dispatch(travelDetailsOnChange(travelDetails));
    }
    return dispatch(onChange('errors', errors))
  }
}

// Update travel details data
export const travelDetailsOnChange = (travel_details) => {
  return { type: IMMAPER_MRF_FORM_CHANGE_TRAVEL_DETAIL, travel_details }
}

// Add travel detail
export const addTravelDetail = () => {
  return { type: IMMAPER_MRF_FORM_ADD_TRAVEL_DETAIL }
}

// Delete travel detail
export const deleteTravelDetail = (travel_detail_index) => {
  return { type: IMMAPER_MRF_FORM_DELETE_TRAVEL_DETAIL, travel_detail_index }
}

// Get domestic travel request (MRF) data
export const getData = (isSecurity = false, id) => (dispatch) => {
  const url = '/api/security-module/mrf/' + (isSecurity ? 'security' : 'immaper') + '/show/' + id
  return axios.get(url)
    .then(res => {
      const { data } = res.data
      dispatch(onChange('transportation_type', typeof data.transportation_type == 'undefined' ? '' : data.transportation_type))
      dispatch(onChange('country', data.country))
      dispatch(onChange('risk_level', {value: data.risk_level, label: data.risk_level}))
      dispatch(onChange('travel_type', data.travel_type))
      dispatch(onChange('criticality_of_the_movement', data.criticality_of_the_movement))
      dispatch(onChange('itineraries', data.itineraries))
      if (!isEmpty(data.travel_details)) {
        dispatch(onChange('travel_details', data.travel_details))
      }
      dispatch(onChange('security_measure', data.security_measure))
      dispatch(onChange('immaper_name', data.user.full_name))
      dispatch(onChange('immaper_line_manager', data.user.profile.line_manager))
      dispatch(onChange('immaper_country_office', data.user.profile.p11_immap_office.country.name))
      dispatch(onChange('immaper_position', data.user.profile.job_title))
      dispatch(onChange('immaper_end_of_current_contract', data.user.profile.end_of_current_contract))
      dispatch(onChange('last_edit', data.last_edit))
      dispatch(onChange('is_sbp_member', data.user.profile.under_sbp_program))
      dispatch(onChange('multiVehicle', data.security_measure == 'multiple-vehicle-movements' ? true : false))
      dispatch(onChange('vehicle_filled_by_yourself', data.vehicle_filled_by_yourself))
      dispatch(onChange('movement_state', data.movement_state))
      dispatch(onChange('security_assessment', data.security_assessment))
      dispatch(onChange('isLoading', false))

      if (!isEmpty(data.submitted_date)) {
        dispatch(onChange('submitted_date', data.submitted_date))
      }

      if (data.status == "revision") {
        dispatch(onChange('action', 'revision'))
        dispatch(onChange('revision_needed', data.revision_needed))
        dispatch(onChange('status', data.status))
      } else if (data.status == "disapproved") {
        dispatch(onChange('action', 'disapprove'))
        dispatch(onChange('disapproved_reasons', data.disapproved_reasons))
        dispatch(onChange('status', data.status))
      } else if (data.status == "approved") {
        dispatch(onChange('action', 'approve'))
        dispatch(onChange('approved_comments', data.approved_comments))
        dispatch(onChange('status', data.status))
        dispatch(onChange('security_measure_email', data.security_measure_email))
        dispatch(onChange('security_measure_smart24', data.security_measure_smart24))
        dispatch(onChange('security_measure_immap_careers', data.security_measure_immap_careers))

      } else {
        dispatch(onChange('action', ''))
        dispatch(onChange('status', ''))
      }

      return dispatch(onChange('purpose', data.purpose))
    })
    .catch(err => {
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while retrieving your data'
      }))
    })
}

export const resetItinerary = () => {
  return { type: MRF_RESET_ITINERARY }
}

export const resetTravelDetail = () => {
  return { type: MRF_RESET_TRAVEL_DETAIL }
}
