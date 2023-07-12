/** import types needed for this actions */
import { SET_ROSTER_STEPS, SET_ROSTER_DATA } from '../../types/roster/roster';
import { SET_FILTER_DATA } from '../../types/hr/HRFilterTypes';
/** import other action functions needed for this actions */
import { addFlashMessage } from '../../actions/webActions';
/** import axios, moment and FileDownload */
import axios from 'axios';
import FileDownload from 'js-file-download';
import moment from 'moment';

/** import textSelector and validation helper */
import isEmpty from '../../../validations/common/isEmpty';
import textSelector from '../../../utils/textSelector';

/**
 * onChange is an action to change roster redux data
 * @param {string}  name  - key inside initialState on roster reducer
 * @param {*}       value
 * @returns {object}
 */
export const onChange = (name, value) => {
  return {
    type: SET_ROSTER_DATA,
    name,
    value
  };
};

/**
 * rosterProcessOnChange is an action to change roster process selector on Roster Page
 * @param {string} name   - key inside initialState on roster reducer
 * @param {object} value  - value in { value: rosterProcessId, label: rosterProcessName } format
 * @returns {Promise}
 */
export const rosterProcessOnChange = (name, value) => (dispatch, getState) => {
  return axios
    .get('/api/roster-processes/' + value.value + '/roster-steps')
    .then((res) => {
      const { roster_steps, campaign_is_open, campaign_open_at_quarter, campaign_open_at_year } = res.data.data;
      dispatch({
        type: SET_ROSTER_STEPS,
        roster_steps
      });
      dispatch(onChange('campaign_is_open', campaign_is_open));
      dispatch(onChange('campaign_open_at_quarter', campaign_open_at_quarter));
      dispatch(onChange('campaign_open_at_year', campaign_open_at_year));
      dispatch(onChange(name, value));
      return dispatch(tabChange({ name: 'tabValue' }, 0));
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error while retrieving roster steps'
        })
      );
    });
};

/**
 * getRosterSteps is an action to get Roster Steps data
 * @returns {Promise}
 */
export const getRosterSteps = () => (dispatch, getState) => {
  return axios
    .get('/api/roster-processes/default')
    .then((res) => {
      const { roster_steps } = res.data.data;
      dispatch({
        type: SET_ROSTER_STEPS,
        roster_steps
      });
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error while retrieving roster steps'
        })
      );
    });
};

/**
 * tabChange is an action to change selected roster step
 * @param {Event}         e           - event
 * @param {number}        tabValue    - tab value
 * @param {string|number} currentPage - current page
 * @returns {Promise}
 */
export const tabChange = (e, tabValue, currentPage = '') => (dispatch, getState) => {
  let { roster_steps, roster_process } = getState().roster;
  dispatch(onChange('tabValue', tabValue));
  dispatch(onChange('selected_step', roster_steps[tabValue]));
  dispatch(onChange('check_all', false));
  dispatch(onChange('selected_profiles', []));
  return dispatch(getRosterProfile(currentPage));
};

/**
 * changeStep is an action to change step of current roster process
 * @param {object}        roster_step - roster step in { value: value, label: label } format
 * @param {string|number} profile_id  - profile id
 * @param {string|number} currentPage - current page
 * @returns
 */
export const changeStep = (roster_step, profile_id, currentPage = '') => (dispatch, getState) => {
  let { roster_process, tabValue, selected_step } = getState().roster;
  if (!isEmpty(roster_process)) {
    return axios
      .post('/api/roster/change-step', {
        roster_process: roster_process.value,
        profile_id,
        new_step: roster_step.value,
        current_step: selected_step.id
      })
      .then((res) => {
        dispatch(
          addFlashMessage({
            type: 'success',
            text: res.data.message
          })
        );
        return dispatch(tabChange({}, tabValue, currentPage));
      })
      .catch((err) => {
        if (!isEmpty(err.response.data.message)) {
          dispatch(
            addFlashMessage({
              type: 'error',
              text: err.response.data.message
            })
          );
        } else {
          dispatch(
            addFlashMessage({
              type: 'error',
              text: 'There is an error while moving the profile to another step'
            })
          );
        }
        return false;
      });
  }
};

/**
 * filterForChange is an action to change filter in Roster page
 * @returns {object}
 */
export const filterForChange = () => {
  return {
    type: SET_FILTER_DATA,
    name: 'filterFor',
    value: 'roster'
  };
};

/**
 * getRosterProfile is an action to get list of profile based on filter, selected roster process and selected roster step
 * @param {string|number} nextPage - next page
 * @param {boolean}       download - download or retrive profile list
 * @returns {Promise}
 */
export const getRosterProfile = (nextPage = '', download = false) => (dispatch, getState) => {
  dispatch(onChange('selected_page', nextPage));
  dispatch(onChange('profileData', []));
  let { roster_process, selected_step, showAllRejected } = getState().roster;
  let {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    chosen_nationality,
    chosen_country_of_residence,
    is_available,
    search,
    experience,
    immaper_status
  } = getState().filter;

  if (!isEmpty(roster_process) && !isEmpty(selected_step)) {
    let url = '/api/roster/profiles';
    if (!isEmpty(nextPage)) {
      url = url + '?page=' + nextPage;
    }
    return axios
      .post(url, {
        roster_process,
        current_step: selected_step.order,
        chosen_sector,
        chosen_skill,
        chosen_language,
        chosen_degree_level,
        chosen_field_of_work,
        chosen_country,
        chosen_nationality,
        chosen_country_of_residence,
        search,
        experience,
        immaper_status: isEmpty(immaper_status) ? null : immaper_status,
        is_available: isEmpty(is_available) ? null : is_available,
        download,
        showAllRejected: (selected_step.set_rejected === 1 || selected_step.set_rejected === '1') ? showAllRejected : false
      }, {responseType: download ? 'blob' : 'json'})
      .then((res) => {
        if (download) {
          return FileDownload(
            res.data,
            'Roster Profiles - ' +
            roster_process.label +
            ' - ' +
            selected_step.step +
            ' - ' +
            moment().format('YYYY-MM-DD-HH-mm-ss') +
            '.xlsx'
          );
        }
        return dispatch(onChange('profileData', res.data.data));
      })
      .catch((err) => {
        if (download) {
          dispatch(
            addFlashMessage({
              type: 'error',
              text: 'There is an error while downloading the roster profiles'
            })
          );
          return false;
        }
      });
  }
};

/**
 * openReferenceCheck is an action to open reference check modal
 * @param {string|number} reference_check   - reference_check_modal_id
 * @param {string|number} profile_id        - profile_id
 * @returns
 */
export const openReferenceCheck = (reference_check = '', profile_id = '') => (dispatch, getState) => {
  let { openReferenceCheckResult } = getState().roster;

  dispatch(onChange('reference_check_modal_id', reference_check));
  dispatch(onChange('reference_check_profile_id', profile_id));
  return dispatch(onChange('openReferenceCheckResult', openReferenceCheckResult ? false : true));
};

/**
 * getReferenceCheckResult is an action to get reference check result
 * @returns {Promise}
 */
export const getReferenceCheckResult = () => (dispatch, getState) => {
  let { reference_check_modal_id, reference_check_profile_id } = getState().roster;

  if (!isEmpty(reference_check_modal_id) && !isEmpty(reference_check_profile_id)) {
    return axios
      .get(
        '/api/reference-questions/list-data/' +
        reference_check_modal_id +
        '/profile/' +
        reference_check_profile_id
      )
      .then((res) => {
        return dispatch(onChange('reference_already_did', res.data.data));
      })
      .catch((err) => {
        dispatch(onChange('reference_already_did', []));
        return dispatch(
          addFlashMessage({
            type: 'error',
            text: 'There is an error while retrieving Reference Check results'
          })
        );
      });
  } else {
    return dispatch(onChange('reference_already_did', []));
  }
};

/**
 * openIMTest is an action to open IM Test modal
 * @param {string|number} im_test     - im test id
 * @param {string|number} profile_id  - profile id
 * @returns
 */
export const openIMTest = (im_test = '', profile_id = '') => (dispatch, getState) => {
  let { openIMTestResult } = getState().roster;

  dispatch(onChange('im_test_modal_id', im_test));
  dispatch(onChange('im_test_profile_id', profile_id));

  return dispatch(onChange('openIMTestResult', openIMTestResult ? false : true));
};

/**
 * getRosterStatistics is an action to get statistic data of the current selected roster process
 * @returns {Promise|File}
 */
export const getRosterStatistics = () => (dispatch, getState) => {
  return axios
    .get('/api/roster/download-statistics/' + getState().roster.roster_process.value, { responseType: 'blob'})
    .then((res) => {
      return FileDownload(
        res.data,
        'Roster Statistics - ' +
        getState().roster.roster_process.label +
        ' - ' +
        moment().format('YYYY-MM-DD-HH-mm-ss') +
        '.xlsx'
      );
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: 'error',
          text: textSelector("error", "downloadError")
        })
      );
    });
};


/**
 * getRosterProfilesForExport is an action to get profiles data of the current selected roster process and current step.
 * @returns {Promise|File}
 */
 export const getRosterProfilesForExport = () => (dispatch, getState) => {
   
  let { roster_process, selected_step } = getState().roster;
  if (!isEmpty(roster_process) && !isEmpty(selected_step)) {
    return axios
    .get('/api/roster/download-roster-profiles/' + roster_process.value + '/' + selected_step.id, { responseType: 'blob'})
    .then((res) => {
      return FileDownload(
        res.data,
        'Roster profiles - ' +
         roster_process.label +
        ' - ' +
        ' #Step- ' +
        selected_step.step + 
        ' - ' +
        moment().format('YYYY-MM-DD-HH-mm-ss') +
        '.xlsx'
      );
    })
    .catch((err) => {
      return dispatch(
        addFlashMessage({
          type: 'error',
          text: textSelector("error", "downloadError")
        })
      );
    }); 
  }
};

/**
 * toggleRosterCampaign is an action to open / close roster campaign
 * @param {boolean} isOpen
 * @returns {Promise}
 */
export const toggleRosterCampaign = (isOpen) => async (dispatch, getState) => {
  const { roster_process, campaign_open_at_quarter, campaign_open_at_year } = getState().roster;

  if (isEmpty(roster_process.value)) {
    return dispatch(addFlashMessage({
      type: 'error',
      text: "Please Select Roster Process First"
    }))
  }

  dispatch(onChange('campaignLoading', true));

  let payload = { isOpen };

  if (!isOpen) {
    payload.campaign_open_at_quarter = campaign_open_at_quarter;
    payload.campaign_open_at_year = campaign_open_at_year;
  }

  try {
    const res =  await axios.post(`/api/roster-processes/${roster_process.value}/update-campaign-data`, payload)
    if (isEmpty(res.data.data)) {
      throw "EmptyResponse";
    }

    const { campaign_is_open, campaign_open_at_quarter, campaign_open_at_year } = res.data.data;

    dispatch(onChange('campaignLoading', false));
    dispatch(onChange('campaign_open_at_quarter', isEmpty(campaign_open_at_quarter) ? '' : campaign_open_at_quarter));
    dispatch(onChange('campaign_open_at_year', isEmpty(campaign_open_at_year) ? '' : campaign_open_at_year));
    return dispatch(onChange('campaign_is_open', campaign_is_open));
  } catch (err) {
    let errorMessage = textSelector("error", "default");

    if (!isEmpty(err.response)) {
      if (err.response.status === 404) {
        errorMessage = "Roster Process Not Found"
      }
    }

    dispatch(onChange('campaignLoading', false));
    return dispatch(addFlashMessage({
      type: 'error',
      text: errorMessage
    }))
  }
}

/**
 * getOpenRosterCampaignData is an action to get current roster campaign status (open or close)
 * @returns
 */
export const getOpenRosterCampaignData = () => async (dispatch, getState) => {
  const { roster_process } = getState().roster;

  if (isEmpty(roster_process.value)) {
    return dispatch(onChange('campaign_is_open', 'no'));
  }

  try {
    const res = await axios.get(`/api/roster-processes/${roster_process.value}/roster-campaign-data`);
    if (isEmpty(res.data.data)) {
      throw Error;
    }
    return dispatch(onChange('campaign_is_open', res.data.data));
  } catch (error) {
    return dispatch(onChange('campaign_is_open', 'no'));
  }
}

/**
 * ChangeProfileSelected is an action to change the profile selected
 * @param {string|number} profile_id  - profile id
 * @returns
 */
 export const changeProfileSelected = (profile_id) => (dispatch, getState) => {
  let { profiles_selected } = getState().roster;

  if (profiles_selected.includes(profile_id)) {
    let index = profiles_selected.indexOf(profile_id);
      if (index !== -1) {
       profiles_selected.splice(index, 1);
      }
  } else {
    profiles_selected.push(profile_id);
  }
  return dispatch(onChange('profiles_selected', profiles_selected));
};
