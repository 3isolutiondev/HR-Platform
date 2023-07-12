import axios from 'axios';
import {
	SET_QUIZ_TEMPLATE_FORMDATA,
	SET_BULK_QUIZ_TEMPLATE_FORMDATA,
	RESET_QUIZ_TEMPLATE_FORMDATA
} from '../../../types/dashboard/quiz-template/quizTemplateTypes';
import { addFlashMessage } from '../../webActions';
import { validate } from '../../../../validations/Quiz/quizTemplate';
import isEmpty from '../../../../validations/common/isEmpty';

export const setFormIsEdit = (isEdit, quizTemplateId) => {
	if (isEdit) {
		return (dispatch) => {
			axios
				.get('/api/quiz-templates/' + quizTemplateId)
				.then((res) => {
					const { id, title, is_default, is_im_test, im_test_template, duration, pass_score } = res.data.data;
					dispatch(
						bulkChange({
							id,
							title,
							is_default,
							is_im_test,
							im_test_template: isEmpty(im_test_template)
								? ''
								: { value: im_test_template.id, label: im_test_template.name },
							duration,
							pass_score,
							isEdit: true,
							apiURL: '/api/quiz-templates/' + quizTemplateId,
							redirectURL: '/dashboard/quiz-templates/' + quizTemplateId + '/edit'
						})
					);
					dispatch(isValid());
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while retrieving quiz template data'
						})
					);
				});
		};
	} else {
		dispatch({ type: RESET_QUIZ_TEMPLATE_FORMDATA });
	}
};

export const onChange = (name, value) => {
	return {
		type: SET_QUIZ_TEMPLATE_FORMDATA,
		name,
		value
	};
};

export const bulkChange = (bulkData) => {
	return {
		type: SET_BULK_QUIZ_TEMPLATE_FORMDATA,
		bulkData
	};
};

export const isValid = () => {
	return (dispatch, getState) => {
		let dashboardQuizTemplate = getState().dashboardQuizTemplate;

		const { errors, isValid } = validate(dashboardQuizTemplate);

		dispatch(onChange('errors', errors));

		return isValid;
	};
};

export const onSubmit = (e, history) => {
	e.preventDefault();

	return (dispatch, getState) => {
		let { isEdit, apiURL, redirectURL, errors, ...postData } = getState().dashboardQuizTemplate;

		if (isEdit) {
			postData._method = 'PUT';
		}
		axios
			.post(apiURL, postData)
			.then((res) => {
				const { status, message, data } = res.data;
				dispatch(setFormIsEdit('true', data.id));
				dispatch(
					addFlashMessage({
						type: status,
						text: message
					})
				);
				if (!isEdit) {
					history.push('/dashboard/quiz-templates');
				}
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
