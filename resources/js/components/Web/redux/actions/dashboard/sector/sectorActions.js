import axios from 'axios';
import {
	SET_SECTOR_FORMDATA,
	SET_BULK_SECTOR_FORMDATA,
	RESET_SECTOR_FORMDATA
} from '../../../types/dashboard/sector/sectorTypes';
import { addFlashMessage } from '../../webActions';
import { validate } from '../../../../validations/sector';

export const setFormIsEdit = (isEdit, sectorId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/sectors/' + sectorId)
				.then((res) => {
					const { id, name, is_approved } = res.data.data;
					dispatch(
						bulkChange({
							id,
							name,
							is_approved,
							isEdit: true,
							apiURL: '/api/sectors/' + sectorId,
							redirectURL: '/dashboard/sectors/' + sectorId + '/edit'
						})
					);
					dispatch(isValid());
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving sector data'
						})
					);
				});
		};
	} else {
		dispatch({ type: RESET_SECTOR_FORMDATA });
	}
};

export const onChange = (name, value) => {
	return {
		type: SET_SECTOR_FORMDATA,
		name,
		value
	};
};

export const bulkChange = (bulkData) => {
	return {
		type: SET_BULK_SECTOR_FORMDATA,
		bulkData
	};
};

export const isValid = () => {
	return (dispatch, getState) => {
		let dashboardSector = getState().dashboardSector;

		const { errors, isValid } = validate(dashboardSector);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
		let { isEdit, apiURL, redirectURL, errors, ...postData } = getState().dashboardSector;

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
				if(err.response && err.response.status === 422 &&  err.response.data && err.response.data.message === 'At least one of the data should be changed, Please Try Again') {
					dispatch(
						addFlashMessage({
							type: 'success',
							text: 'Sector updated successfully'
						})
					);
					dispatch(onChange('showLoading', false));
				} else {
					dispatch(onChange('showLoading', false));
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while processing the request'
						})
					);
				}
			});
	};
};
