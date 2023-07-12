import axios from 'axios';
import {
	SET_IMMAP_OFFICE_FORMDATA,
	SET_BULK_IMMAP_OFFICE_FORMDATA,
	RESET_IMMAP_OFFICE_FORMDATA
} from '../../../types/dashboard/immap-office/immapOfficeTypes';
import { addFlashMessage } from '../../webActions';
import { validate } from '../../../../validations/immapOffice';

export const setFormIsEdit = (isEdit, immapOfficeId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/immap-offices/' + immapOfficeId)
				.then((res) => {
					const { id, city, country, is_active, is_hq } = res.data.data;
					dispatch(
						bulkChange({
							id,
							city,
							country,
							is_active,
							is_hq,
							isEdit: true,
							apiURL: '/api/immap-offices/' + immapOfficeId,
							redirectURL: '/dashboard/immap-offices/' + immapOfficeId + '/edit'
						})
					);
					dispatch(isValid());
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving immap office data'
						})
					);
				});
		};
	} else {
		dispatch({ type: RESET_IMMAP_OFFICE_FORMDATA });
	}
};

export const onChange = (name, value) => {
	return {
		type: SET_IMMAP_OFFICE_FORMDATA,
		name,
		value
	};
};

export const bulkChange = (bulkData) => {
	return {
		type: SET_BULK_IMMAP_OFFICE_FORMDATA,
		bulkData
	};
};

export const isValid = () => {
	return (dispatch, getState) => {
		let dashboardImmapOffice = getState().dashboardImmapOffice;

		const { errors, isValid } = validate(dashboardImmapOffice);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
		let { isEdit, apiURL, redirectURL, errors, ...postData } = getState().dashboardImmapOffice;

		if (isEdit) {
			postData._method = 'PUT';
		}

		dispatch(onChange('showLoading', true));
		axios
			.post(apiURL, postData)
			.then((res) => {
				dispatch(onChange('showLoading', false));
				const { status, message, data } = res.data;
				dispatch(setFormIsEdit('true', data.id));
				dispatch(
					addFlashMessage({
						type: status,
						text: message
					})
				);
			})
			.catch((err) => {
				dispatch(onChange('showLoading', false));
				dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					})
				);
			});
	};
};
