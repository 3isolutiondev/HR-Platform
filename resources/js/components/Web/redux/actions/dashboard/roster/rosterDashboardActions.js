import axios from 'axios';
import { can } from '../../../../permissions/can';
import { SET_ROSTER_DASHBOARD_FORMDATA } from '../../../types/dashboard/roster/rosterDashboard';
import { addFlashMessage } from '../../webActions';

export const getRosterDashboard = () => (dispatch) => {
  return Promise.resolve(
    axios
      .get('/api/roster-processes')
      .then((res) => {
        const isAdmin = can("Set as Admin");
        const rosterProcessForDashboardMenu =  res.data.data.filter(roster => (!isAdmin && roster.under_sbp_program == "yes") || isAdmin);
        dispatch(setUserFormData('rosterDashboard', rosterProcessForDashboardMenu));
        return rosterProcessForDashboardMenu;
      })
      .catch((err) => {
        dispatch(
          addFlashMessage({
            type: 'error',
            text: 'There is an error while retrieving roster dashboard data'
          })
        );
        return err
      })
  )
};

export const setUserFormData = (name, value) => {
  return {
    type: SET_ROSTER_DASHBOARD_FORMDATA,
    name,
    value
  };
};

export const getRosters = (roster_process_id) => (dispatch, getState) => {
  const { apiURL } = getState().rosterDashboard;

  const {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    experience,
    chosen_nationality,
    chosen_country_of_residence,
    is_available,
    immaper_status
  } = getState().filter;

  let formData = {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    experience,
    chosen_nationality,
    chosen_country_of_residence,
    is_available,
    immaper_status
  };

  dispatch(setUserFormData('roster_members', []));

  return axios
    .post(apiURL + roster_process_id, formData)
    .then((res) => {
      return dispatch(setUserFormData('roster_members', res.data.data));
    })
    .catch((err) => {
      dispatch(setUserFormData('roster_members', []));
      dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error while processing the request'
        })
      );
    });
};

export const handleViewProfile = (id) => (dispatch, getState) => {
  const { openProfile } = getState().rosterDashboard;
  dispatch(setUserFormData('id', id));
  return dispatch(setUserFormData('openProfile', !openProfile));
};
