import { SET_BULK_TOR_RECOMMENDATION, SET_TOR_RECOMMENDATION } from '../../types/tor/torRecommendationTypes';

import { addFlashMessage } from '../webActions';
import { onChange, bulkOnChange } from '../common/RecommendationActions';

import axios from 'axios';
import isEmpty from '../../../validations/common/isEmpty';

export const updateCurrentPage = (current_page) => {
  return {
    type: SET_TOR_RECOMMENDATION,
    name: 'current_page',
    value: current_page
  }
}

export const getToRRecommendationProfiles = () => (dispatch, getState) => {
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
		tor_id
	} = getState().torFilter;

  let { current_page } = getState().torRecommendations;
  let { firstApiCall } = getState().recommendations;
  let nextPage = !isEmpty(current_page) ? current_page : 1;

	if (!isEmpty(tor_id)) {
    dispatch(onChange('loadingData', true));

    if (firstApiCall) {
      dispatch(onChange('firstApiCall', false))
    }

		return axios
			.post(`/api/tor/${tor_id}/recommendations?page=${nextPage}`, {
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
          loadingData: false,
          canSendInvitation: false,
          profiles: res.data.data.profiles.data
        }));

				return dispatch({
					type: SET_BULK_TOR_RECOMMENDATION,
					bulkData: {
						title: res.data.data.title,
						country: res.data.data.country,
            current_page: res.data.data.profiles.current_page,
            last_page: res.data.data.profiles.last_page
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
