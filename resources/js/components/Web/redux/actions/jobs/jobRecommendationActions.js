import { SET_BULK_JOB_RECOMMENDATION, SET_JOB_RECOMMENDATION } from '../../types/jobs/jobRecommendationTypes';

import { addFlashMessage } from '../webActions';
import { onChange, bulkOnChange } from '../common/RecommendationActions';

import axios from 'axios';
import isEmpty from '../../../validations/common/isEmpty';

export const updateCurrentPage = (current_page) => {
  return {
    type: SET_JOB_RECOMMENDATION,
    name: 'current_page',
    value: current_page
  }
}

export const getJobRecommendationProfiles = () => (dispatch, getState) => {
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
		immaper_status,
		select_gender,
		job_id
	} = getState().jobRecommendationFilter;

  let { firstApiCall } = getState().recommendations;

  let { current_page } = getState().jobRecommendations;

  let nextPage = !isEmpty(current_page) ? current_page : 1;

	if (!isEmpty(job_id)) {
    dispatch(onChange('loadingData', true));
    if (firstApiCall) {
      dispatch(onChange('firstApiCall', false));
    }
		return axios
			.post(`/api/jobs/${job_id}/recommendations?page=${nextPage}`, {
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
				select_gender: isEmpty(select_gender) ? null : select_gender,
				is_available: isEmpty(is_available) ? null : is_available
			})
			.then((res) => {
        dispatch(updateCurrentPage(res.data.data.profiles.current_page));
				dispatch(bulkOnChange({
          profiles: res.data.data.profiles.data,
          canSendInvitation: true,
          loadingData: false
				}));
				return dispatch({
					type: SET_BULK_JOB_RECOMMENDATION,
					bulkData: {
						title: res.data.data.title,
						country: res.data.data.country,
						profiles: res.data.data.profiles.data,
						current_page: res.data.data.profiles.current_page,
						last_page: res.data.data.profiles.last_page,
						job_id: job_id
					}
				});
			})
			.catch((err) => {
        dispatch(onChange('loadingData', false));
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while retrieving recommendations'
					})
				);
			});
	}
};

export const sendInvitation = (job_id, profile_ids) => (dispatch, getState) => {
	if (profile_ids.length > 0) {
		if (profile_ids.length > 1) {
      dispatch(onChange('isLoading', true));
		}
		return axios
			.post('/api/jobs/' + job_id + '/send-invitations', {
				ids: profile_ids
			})
			.then((res) => {
				dispatch(
					addFlashMessage({
						type: 'success',
						text: 'Invitation successfully sent to the user'
					})
				);
				return dispatch(onChange('isLoading', false));
			})
			.catch((err) => {
        dispatch(onChange('isLoading', false));
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while inviting the user'
					})
				);
			});
	} else {
		return dispatch(
			addFlashMessage({
				type: 'error',
				text: 'No Profile Selected'
			})
		);
	}
};
