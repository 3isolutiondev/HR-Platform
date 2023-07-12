import { SET_CV_AND_SIGNATURE, RESET_PROFILE } from '../../types/profile/profileTypes';

const initialState = {
	id: '',
	cv_id: 0,
	photo: '',
	cv: {},
	signature: {},
	show: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_CV_AND_SIGNATURE:
			return {
				...state,
				id: action.cv.id,
				cv_id: action.cv.cv_id,
				photo: action.cv.photo,
				cv: action.cv.cv,
				signature: action.cv.signature,
				show: action.cv.show
			};
		case 'cv':
			return {
				...state,
				show: action.value
			};
		case RESET_PROFILE:
			return initialState;
		default:
			return state;
	}
};
