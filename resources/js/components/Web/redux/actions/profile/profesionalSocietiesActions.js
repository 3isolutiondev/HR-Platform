import axios from 'axios';
import { SET_PROFESIONAL_SOCIETIES, SET_PROFESIONAL_SOCIETIES_WITH_OUT_SHOW } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET PROFESIONAL SOCIETIES
export const getProfesionalSocieties = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-professional-societies/' + id)
			.then((res) => {
				let data = res.data.data;
				if (res.data.data.professional_societies_counts >= 1) {
					data = { ...res.data.data, show: true };
				} else if (res.data.data.professional_societies_counts <= 0) {
					data = { ...res.data.data, show: false };
				}
				dispatch(setProfesionalSocieties(data));
			})
			.catch((err) => {
				dispatch(setProfesionalSocietiesFailed(err));
			});
	};
};

// SET PROFESIONAL SOCIETIES
export const setProfesionalSocieties = (societies) => {
	return {
		type: SET_PROFESIONAL_SOCIETIES,
		societies
	};
};

// GET PROFESIONAL SOCIETIES WITHOUT SHOW
export const getProfesionalSocietiesWithOutShow = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-professional-societies/' + id)
			.then((res) => {
				let data = res.data.data;
				dispatch(setProfesionalSocietiesWithOutShow(data));
			})
			.catch((err) => {
				dispatch(setProfesionalSocietiesFailed(err));
			});
	};
};

// SET PROFESIONAL SOCIETIES WITHOUT SHOW
export const setProfesionalSocietiesWithOutShow = (societies) => {
	return {
		type: SET_PROFESIONAL_SOCIETIES_WITH_OUT_SHOW,
		societies
	};
};

// SET PROFESIONAL SOCIETIES ERROR MESSAGE
export const setProfesionalSocietiesFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving profesional societies data'
		}
	};
};
