import { SET_IMMAPERS_LIST_DATA } from '../../../types/dashboard/immapers/immapersListTypes';
import axios from 'axios';
import { addFlashMessage } from '../../webActions'

export const onChange = (name, value, noRefreshData = false) => (dispatch, getState) => {
  dispatch({
    type: SET_IMMAPERS_LIST_DATA,
    name,
    value
  });
};

export const handleViewImmaper = (id) => (dispatch, getState) => {
  const { openProfile } = getState().immapersList;
  dispatch(onChange('id', id));
  return dispatch(onChange('openProfile', !openProfile));
};

export const getImmapers = (queryData) => (dispatch, getState) => {
  const { apiURL } = getState().immapersList;
  const {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    experience,
    chosen_nationality
  } = getState().filter;

  let formData = {
    chosen_sector,
    chosen_skill,
    chosen_language,
    chosen_degree_level,
    chosen_field_of_work,
    chosen_country,
    experience,
    chosen_nationality
  };

  return axios
    .post(`${apiURL}?limit=${queryData}`, formData)
    .then((res) => {
      return dispatch(onChange('immapers', res.data.data));
    })
    .catch((err) => {
      dispatch(onChange('isLoading', false))
      dispatch(onChange('immapers', []))
      return dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error while processing the request'
        })
      );
    });
};
