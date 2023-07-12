import axios from 'axios';
import {
	SET_DISABILITIES,
	SET_DISABILITIES_WITH_OUT_SHOW,
	ONCHANGE_DISABILITIES
} from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET DISABILITIES
export const getDisabilities = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-disabilities/' + id)
			.then((res) => {
				let data = res.data.data;
				if (res.data.data.disabilities == null) {
					data = { ...res.data.data, disabilities: '', show: false };
				} else if (res.data.data.has_disabilities == 0) {
					data = { ...res.data.data, show: true };
				} else if (res.data.data.has_disabilities == 1) {
					data = { ...res.data.data, show: false };
				}
				dispatch(setDisabilities(data));
			})
			.catch((err) => {
				dispatch(setDisabilitiesFailed(err));
			});
	};
};

// SET DISABILITIES
export const setDisabilities = (disabilities) => {
	return {
		type: SET_DISABILITIES,
		disabilities
	};
};

// GET DISABILITIES WITH OUT SHOW
export const getDisabilitiesWithOutShow = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-disabilities/' + id)
			.then((res) => {
				let data = res.data.data;
				if (res.data.data.disabilities == null) {
					data = { ...res.data.data, disabilities: '' };
				}
				dispatch(setDisabilitiesWithOutShow(data));
			})
			.catch((err) => {
				dispatch(setDisabilitiesFailed(err));
			});
	};
};

// SET DISABILITIES WITH OUT SHOW
export const setDisabilitiesWithOutShow = (disabilities) => {
	return {
		type: SET_DISABILITIES_WITH_OUT_SHOW,
		disabilities
	};
};

// SET DISABILITIES ERROR MESSAGE
export const setDisabilitiesFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving disabilities data'
		}
	};
};

export const onChange = (name, value) => {
	return {
		type: ONCHANGE_DISABILITIES,
		name,
		value
	};
};
