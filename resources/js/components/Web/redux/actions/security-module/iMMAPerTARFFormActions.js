import {
  IMMAPER_TAR_FORM_ADD_CONNECTION,
  IMMAPER_TAR_FORM_DELETE_CONNECTION,
  IMMAPER_TAR_FORM_CHANGE_ITINERARY,
  IMMAPER_TAR_FORM_ONCHANGE,
  IMMAPER_TAR_FORM_RESET
} from '../../types/security-module/iMMAPerTARFormTypes';
import { validateTARForm } from '../../../validations/security-module/iMMAPerTARForm';
import isEmpty from '../../../validations/common/isEmpty';
import axios from 'axios'
import { addFlashMessage } from '../webActions';

// Reset TAR Form Data
export const resetForm = () => {
  return { type: IMMAPER_TAR_FORM_RESET }
}

// Add Itinerary
export const addConnection = () => (dispatch, getState) => {
  return dispatch({ type: IMMAPER_TAR_FORM_ADD_CONNECTION });
}

// Delete Itinerary
export const deleteConnection = (itineraryIndex) => {
  return { type: IMMAPER_TAR_FORM_DELETE_CONNECTION, itineraryIndex }
}

// Update Itinerary data
export const itineraryOnChange = (itineraries) => {
  return { type: IMMAPER_TAR_FORM_CHANGE_ITINERARY, itineraries }
}

// Update specific TAR data on reducer
export const onChange = (name, value) => {
  return {
    type: IMMAPER_TAR_FORM_ONCHANGE,
    name,
    value
  };
}

// Update specific TAR data on reducer for select field
export const selectOnChange = (value, e) => {
  return (dispatch) => {
    return dispatch(onChange([e.name], value));
  };
};

// Check if the form isValid
export const isValid = () => (dispatch, getState) => {
  const { travel_purpose, travel_type, itineraries,
    action, disapproved_reasons, revision_needed, approved_comments, need_government_paper, need_government_paper_now, government_paper,
    isSecurity, security_measure_email, security_measure_smart24, security_measure_immap_careers, risk_level
  } = getState().immaperTARForm
  let { errors, itineraryData, isValid } = validateTARForm({
    travel_purpose, travel_type, itineraries,
    action, disapproved_reasons, revision_needed, approved_comments, need_government_paper, need_government_paper_now, government_paper,
    isSecurity, security_measure_email, security_measure_smart24, security_measure_immap_careers, risk_level
  })
  if (isValid) {
    return dispatch(onChange('errors', {}))
  } else {
    if (!isEmpty(errors.itineraries)) {
      dispatch(itineraryOnChange(itineraryData));
    }
    return dispatch(onChange('errors', errors))
  }
}

// Get international travel request (TAR) data
export const getData = (isSecurity = false, id) => (dispatch) => {
  const url = '/api/security-module/tar/' + (isSecurity ? 'security' : 'immaper') + '/show/' + id
  return axios.get(url)
    .then(res => {
      const { data } = res.data
      dispatch(onChange('travel_purpose', data.travel_purpose))
      dispatch(onChange('travel_type', data.travel_type))
      dispatch(onChange('risk_level', {value: data.risk_level, label: data.risk_level}))
      dispatch(onChange('itineraries', data.itineraries))
      dispatch(onChange('remarks', data.remarks))
      dispatch(onChange('immaper_name', data.user.full_name))
      dispatch(onChange('immaper_line_manager', data.user.profile.line_manager))
      dispatch(onChange('immaper_country_office', data.user.profile.p11_immap_office.country.name))
      dispatch(onChange('immaper_position', data.user.profile.job_title))
      dispatch(onChange('immaper_end_of_current_contract', data.user.profile.end_of_current_contract))
      dispatch(onChange('last_edit', data.last_edit))
      dispatch(onChange('is_sbp_member', data.user.profile.under_sbp_program))
      dispatch(onChange('is_high_risk', data.is_high_risk))
      dispatch(onChange('heat_certificate', data.heat_certificate))

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
    })
    .catch(err => {
      return dispatch(addFlashMessage({
        type: 'error',
        text: 'There is an error while retrieving your data'
      }))
    })
}

// check high risk
export const checkHighRisk = (is_high_risk) => (dispatch, getState) => {
  if (is_high_risk.toString() == '1') {
    return dispatch(onChange('is_high_risk', '1'))
  } else {
    let itineraries = getState().immaperTARForm.itineraries
    let new_high_risk = is_high_risk

    itineraries.map(itinerary => {
      new_high_risk = (itinerary.is_high_risk == 1 || itinerary.is_high_risk == '1') ? '1' : new_high_risk
    })

    return dispatch(onChange('is_high_risk', new_high_risk))
  }
}

