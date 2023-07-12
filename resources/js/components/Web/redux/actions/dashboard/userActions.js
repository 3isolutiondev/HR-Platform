import axios from 'axios';
import {
	SET_USER_FORMDATA,
	RESET_USER_FORMDATA,
	SET_VERIFICATION_MAIL_LOADING_ON_USER,
	SET_USER_ONCHANGE
} from '../../types/dashboard/userTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';
import { validateStore, validateUpdate } from '../../../validations/user';

export const setFormIsEdit = (isEdit, userId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/users/' + userId)
				.then((res) => {
					const {
						first_name,
						middle_name,
						family_name,
						full_name,
						email,
						role,
						immap_email,
						p11Completed,
						profile,
						isVerified,
						access_platform
					} = res.data.data;
					dispatch(
						setUserFormData({
							isEdit: true,
							apiURL: '/api/users/' + userId,
							redirectURL: '/dashboard/users/' + userId + '/edit',
							userData: {
								first_name,
								middle_name,
								family_name,
								full_name,
								email,
								role,
								immap_email,
								p11Completed,
								profile,
								isVerified,
								access_platform
							}
						})
					);
				})
				.catch((err) => {
					dispatch(setNotifError(err, 'There is an error while retrieving user data'));
				});
		};
	} else {
		return (dispatch) => { dispatch({ type: RESET_USER_FORMDATA }) };
	}
};
export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
		let { userData, isEdit, change_password, apiURL, redirectURL } = getState().dashboardUser;

		if (isEdit) {
			userData._method = 'PUT';
			if (change_password == 0) {
				['new_password', 'new_password_confirmation' ].forEach((e) => delete userData[e]);
			}
			userData.change_password = change_password;
		}	
		
		dispatch(setOnChange('showLoading', true));
		axios
			.post(apiURL, userData)
			.then((res) => {
				dispatch(setOnChange('showLoading', false));
				const { status, message } = res.data;
				history.push('/dashboard/users');
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: status,
						text: message
					}
				});
			})
			.catch((err) => {
				let text = 'There is an error while processing the request';
				if(err.response) text = err.response.data.message;
				dispatch(setOnChange('showLoading', false));
				dispatch({
					type: ADD_FLASH_MESSAGE,
					message: {
						type: 'error',
						text
					}
				});
			});
	};
};

export const setOnChange = (name, value) => {
	return {
		type: SET_USER_ONCHANGE,
		name,
		value
	};
};

export const onChange = (e) => {
	return (dispatch, getState) => {
		let userData = getState().dashboardUser.userData;
		userData = Object.assign({ ...userData }, { [e.target.name]: e.target.value });

		dispatch(setUserFormData({ userData: userData }));
		return dispatch(setErrors());
	};
};

export const switchPassword = () => {
	return (dispatch, getState) => {
		let { change_password, userData } = getState().dashboardUser;
		let { old_password, new_password, new_password_confirmation } = userData;
		change_password === 1 ? (change_password = 0) : (change_password = 1);
		let data = {
			change_password,
			userData: Object.assign(
				{ ...userData },
				{
					old_password: change_password == 0 ? '' : old_password,
					new_password: change_password == 0 ? '' : new_password,
					new_password_confirmation: change_password == 0 ? '' : new_password_confirmation
				}
			)
		};
		dispatch(setUserFormData(data));
	};
};

export const setUserFormData = (userData) => {
	return {
		type: SET_USER_FORMDATA,
		userData
	};
};

export const setNotifError = (err, message) => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: message
		}
	};
};

export const setErrors = () => {
	return (dispatch, getState) => {
		const { isEdit, userData } = getState().dashboardUser;

		const { errors, isValid } = isEdit ? validateUpdate(userData) : validateStore(userData);

		if (!isValid) {
			dispatch(setUserFormData({ errors: errors }));
		} else {
			dispatch(setUserFormData({ errors: {} }));
		}

		return isValid;
	};
};

export const setVerificationMailLoading = (value) => {
	return {
		type: SET_VERIFICATION_MAIL_LOADING_ON_USER,
		value
	};
};

export const sendImmapVerification = (id) => (dispatch) => {
	dispatch(setVerificationMailLoading(true));
	return axios
		.get('/api/users/immap-verification/' + id)
		.then((res) => {
			dispatch(setVerificationMailLoading(false));
			return dispatch({
				type: ADD_FLASH_MESSAGE,
				message: {
					type: res.data.status,
					text: res.data.message
				}
			});
		})
		.catch((err) => {
			dispatch(setVerificationMailLoading(false));
			return dispatch({
				type: ADD_FLASH_MESSAGE,
				message: {
					type: 'error',
					text: 'There is an error while sending the verification email'
				}
			});
		});
};
