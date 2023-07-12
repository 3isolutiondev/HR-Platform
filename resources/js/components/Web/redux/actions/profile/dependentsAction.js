import axios from 'axios';
import { SET_DEPENDENTS, SET_DEPENDENTS_WITHOUT_SHOW } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET DEPENDENDTS
export const getDependents = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-dependents/' + id)
			.then((res) => {
				let data = res.data.data;
				if (res.data.data.dependents_counts >= 1) {
					data = { ...res.data.data, show: true };
				} else if (res.data.data.dependents_counts <= 0) {
					data = { ...res.data.data, show: false };
				}
				dispatch(setDependents(data));
			})
			.catch((err) => {
				dispatch(setDependentsFailed(err));
			});
	};
};

// GET DEPENDENDTS WITHOUT SHOW
export const getDependentsWithoutShow = (id) => {
	return (dispatch) => {
		axios
			.get('/api/profile-dependents/' + id)
			.then((res) => {
				let data = res.data.data;
				dispatch(setDependentsWithOutShow(data));
			})
			.catch((err) => {
				dispatch(setDependentsFailed(err));
			});
	};
};

// SET DEPENDENDTS
export const setDependents = (dependent) => {
	return {
		type: SET_DEPENDENTS,
		dependent
	};
};

// SET DEPENDENDTS WITHOUT SHOW
export const setDependentsWithOutShow = (dependent) => {
	return {
		type: SET_DEPENDENTS_WITHOUT_SHOW,
		dependent
	};
};

// SET DEPENDENDTS ERROR MESSAGE
export const setDependentsFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving dependents data'
		}
	};
};
