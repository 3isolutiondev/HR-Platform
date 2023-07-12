import {
  SET_JOB_FILTER,
  // SET_BULK_JOB_FILTER,
  // RESET_JOB_FILTER,
  IS_FILTER_IS_RESET
} from '../../types/jobs/jobsFilterTypes';
import { addFlashMessage } from '../webActions';
import axios from 'axios'

export const isFilterIsReset = (isFilter, isReset) => (dispatch, getState) => {
  dispatch({
    type: IS_FILTER_IS_RESET,
    isFilter,
    isReset
	});

	return Promise.resolve(getState());
};

export const onChange = (name, value) => (dispatch, getState) => {
  dispatch({
    type: SET_JOB_FILTER,
    name,
    value
	});

	return Promise.resolve(getState());
};


export const resetFilter = () => (dispatch, getState) => {
  // dispatch({ type: RESET_JOB_FILTER });
  dispatch(onChange('search', ""));
  dispatch(isFilterIsReset(false, true));
  dispatch(onChange('contract_length', { min: 0, max: 24 }));
  dispatch(onChange('choosen_country', []));
  dispatch(onChange('choosen_language', []));
  dispatch(onChange('choosen_immap_office', []));
  dispatch(onChange('job_status', []));
  dispatch(onChange('errors', {}));
};


export const getJobCountry = () => (dispatch, getState) => {
  return axios
    .get('/api/jobs/countries')
    .then((res) => {
      if (res.status == 200) {
        dispatch(onChange('countries', res.data.data));
        return true;
      }
    })
    .catch((err) => {
      dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error get data country'
        })
      );
      // return false;
    });
};

const localeCompare = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export const getJobLanguage = () => (dispatch, getState) => {
  return axios
    .get('/api/jobs/languages')
    .then((res) => {
      if (res.status == 200) {
        dispatch(onChange('languages', res.data.data.sort((a, b) => localeCompare(a, b))));
        // return true;
      }
    })
    .catch((err) => {
      dispatch(
        addFlashMessage({
          type: 'error',
          text: 'There is an error get data language'
        })
      );
      // return false;
    });
};

export const filterArray = (name, value) => (dispatch, getState) => {
  let jobFilter = getState().jobFilter;
  let stateName = jobFilter[name];
  let arrIndex = stateName.indexOf(value);

  if (arrIndex >= 0) {
    stateName.splice(arrIndex, 1);
  } else {
    stateName.push(value);
  }
  dispatch(isFilterIsReset(true, false));
  return dispatch(onChange(name, stateName));
}

