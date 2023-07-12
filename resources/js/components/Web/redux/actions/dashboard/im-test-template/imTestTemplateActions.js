import axios from 'axios';
import {
	SET_IM_TEST_TEMPLATE_FORMDATA,
	SET_BULK_IM_TEST_TEMPLATE_FORMDATA,
	RESET_IM_TEST_TEMPLATE_FORMDATA
} from '../../../types/dashboard/im-test-template/imTestTemplateTypes';
import { addFlashMessage } from '../../webActions';
import { onChangeFormdata } from '../../imtest/imtestActions';
import { validate } from '../../../../validations/imTest/imTestTemplate';
// import isEmpty from '../../../../validations/common/isEmpty';

export const setFormIsEdit = (isEdit, imTestTemplateId, history) => {
	if (isEdit) {
		return (dispatch, getState) => {
			localStorage.removeItem('imTestTemplate');
			axios
				.get('/api/im-test-templates/' + imTestTemplateId)
				.then((res) => {
					const { id, name, is_default, limit_time_hour, limit_time_minutes, imtes } = res.data.data;
					const limit_time = convertToTime(limit_time_hour) + ':' + convertToTime(limit_time_minutes);
					let ImTest = getState().imtest;

					dispatch(onChangeFormdata('activeStep', imtes.length - 1));
					dispatch(onChange('steps', imtes.length));
					dispatch(onChange('isEdit', isEdit));
					imtes.map((data, index) => {
						let step = ImTest['step' + (index + 1)];
						let dataWithKey = {};

						Object.keys(data).forEach(function eachKey(key) {
							if (key in step) {
								dataWithKey[key] = data[key];
							}
						});

						if (data.steps === index + 1) {
							dispatch(onChangeFormdata('step' + (index + 1), dataWithKey));
						}
					});
					dispatch(
						bulkChange({
							id,
							name,
							is_default,
							limit_time,
							isEdit: true,
							isAdd: false,
							apiURL: '/api/im-test-templates/' + imTestTemplateId,
							redirectURL: '/dashboard/im-test-templates/' + imTestTemplateId + '/edit'
						})
					);
					dispatch(isValid());
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving im test templates data'
						})
					);
				});
		};
	} else {
		dispatch({ type: RESET_IM_TEST_TEMPLATE_FORMDATA });
	}
};

export const onChange = (name, value) => {
	return {
		type: SET_IM_TEST_TEMPLATE_FORMDATA,
		name,
		value
	};
};

export const bulkChange = (bulkData) => {
	return {
		type: SET_BULK_IM_TEST_TEMPLATE_FORMDATA,
		bulkData
	};
};

export const isValid = () => {
	return (dispatch, getState) => {
		let dashboardIMTestTemplate = getState().dashboardIMTestTemplate;

		const { errors, isValid } = validate(dashboardIMTestTemplate);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
		let dataImTest = getState().imtest;

		let { isEdit, limit_time, apiURL, redirectURL, errors, ...postData } = getState().dashboardIMTestTemplate;

		postData.limit_time_hour = Number(limit_time.slice(0, 2));
		postData.limit_time_minutes = Number(limit_time.slice(3, 5));
		postData.step1 = dataImTest.step1;
		postData.step2 = dataImTest.step2;
		postData.step3 = dataImTest.step3;
		postData.step4 = dataImTest.step4;
		postData.step5 = dataImTest.step5;

		if (isEdit) {
			postData._method = 'PUT';
		}
		axios
			.post(apiURL, postData)
			.then((res) => {
				const { status, message, data } = res.data;
				dispatch(
					addFlashMessage({
						type: status,
						text: message
					})
				);
				history.push('/dashboard/im-test-templates/');
			})
			.catch((err) => {
				dispatch(
					addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					})
				);
			});
	};
};

const convertToTime = (data) => {
	var len = Math.floor(Math.log10(data)) + 1;
	if (data === 0) {
		return '0' + data;
	} else if (len === 1) {
		return '0' + data;
	} else {
		return data;
	}
};
