import {
	SET_USER_FORMDATA,
	SET_USER_ONCHANGE,
	RESET_USER_FORMDATA,
	SET_VERIFICATION_MAIL_LOADING_ON_USER
} from '../../types/dashboard/userTypes';

const initialState = {
	userData: {
		first_name: '',
		middle_name: '',
		family_name: '',
		full_name: '',
		email: '',
		password: '',
		password_confirmation: '',
		p11Completed: 0,
		profile: {
			is_immaper: 0,
			verified_immaper: 0
		},
		role: '',
		immap_email: '',
		old_password: '',
		new_password: '',
		new_password_confirmation: '',
		access_platform: 0,
	},
	showLoading: false,
	mail_loading: false,
	change_password: 0,
	errors: {},
	isEdit: false,
	apiURL: '/api/users',
	redirectURL: '/dashboard/users'
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_USER_FORMDATA:
			return Object.assign({ ...state }, action.userData);
		case SET_USER_ONCHANGE:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_VERIFICATION_MAIL_LOADING_ON_USER:
			return {
				...state,
				mail_loading: action.value
			};
		case RESET_USER_FORMDATA:
			return initialState;
		default:
			return state;
	}
};
