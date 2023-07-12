import axios from 'axios';
import moment from 'moment';
import { SET_IM_TEST_DATA } from '../../types/imtest/imTestUserTypes';
import { addFlashMessage } from '../webActions';
import isEmpty from '../../../validations/common/isEmpty';

export const onChange = (name, value) => {
	return {
		type: SET_IM_TEST_DATA,
		name,
		value
	};
};

export const handleBack = () => (dispatch, getState) => {
	let { activeStep } = getState().imTestUser;
	return dispatch(onChange('activeStep', activeStep > 0 ? activeStep - 1 : activeStep));
};

export const handleFinish = () => (dispatch, getState) => {
	let {
		id,
		step2,
		step3,
		step4,
		step5,
		selectedstep21,
		selectedstep22,
		selectedstep23,
		selectedstep31,
		file1,
		file2,
		file3,
		file4,
		userTextInput1,
		userTextInput2
	} = getState().imTestUser;
	let formData = {
		data: {
			im_test_templates_id: id,
			im_test_id_step_2: step2[0].id,
			im_test_id_step_3: step3[0].id,
			im_test_id_step_4: step4[0].id,
			im_test_id_step_5: step5[0].id,
			file1: file1.model_id,
			file2: file2.model_id,
			file3: file3.model_id,
			file4: file4.model_id,
			answer1: {
				question_im_test_id: step2[0].questions[0].questionID,
				multiple_choice_im_test_id: selectedstep21
			},
			answer2: {
				question_im_test_id: step2[0].questions[1].questionID,
				multiple_choice_im_test_id: selectedstep22
			},
			answer3: {
				question_im_test_id: step2[0].questions[2].questionID,
				multiple_choice_im_test_id: selectedstep23
			},
			answer4: {
				question_im_test_id: step3[0].questions[0].questionID,
				multiple_choice_im_test_id: selectedstep31
			},
			userTextInput1,
			userTextInput2
		}
	};

	return axios
		.post('/api/follow-imtest/', formData)
		.then((res) => {
			dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Your finished'
				})
			);

			dispatch(onChange('alertOpen', false));
			dispatch(onChange('successOpen', true));
		})
		.catch((err) => {
			dispatch(
				addFlashMessage({
					type: 'error',
					text: 'There is an error saving data IM Test'
				})
			);
		});
};

export const handleNext = () => (dispatch, getState) => {
	let { activeStep, im_test, im_test_end_time, limit_time_hour, limit_time_minutes } = getState().imTestUser;
	let next = false;
	switch (activeStep) {
		case 0:
			if (!isEmpty(im_test) && isEmpty(im_test_end_time)) {
				return axios
					.get('/api/im-test/' + im_test + '/start-test')
					.then((res) => {
						let { im_test_start_time } = res.data.data;
						let end_time = moment(im_test_start_time)
							.add(limit_time_hour, 'h')
							.add(limit_time_minutes, 'm')
							.format('YYYY-MM-DD h:mm:ss');

						dispatch(onChange('im_test_start_time', im_test_start_time));
						dispatch(onChange('im_test_end_time', end_time));
						dispatch(onChange('activeStep', activeStep + 1));
						dispatch(onChange('startImTest', true));
						dispatch(getIMTestStep());
					})
					.catch((err) => {
						dispatch(
							addFlashMessage({
								type: 'error',
								text: 'There is an error while starting IM Test'
							})
						);
					});
			} else {
				return dispatch(onChange('activeStep', activeStep + 1));
			}
		case 1:
			dispatch(onChange('activeStep', activeStep + 1));
			dispatch(getIMTestStep());
			dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Your file succesfully save'
				})
			);

		case 2:
			dispatch(onChange('activeStep', activeStep + 1));
			dispatch(getIMTestStep());
		case 3:
			dispatch(onChange('activeStep', activeStep + 1));
			dispatch(getIMTestStep());
		case 4:
			dispatch(onChange('activeStep', activeStep + 1));
			dispatch(getIMTestStep());
		default:
			if (activeStep < 5) return dispatch(onChange('activeStep', activeStep + 1));
	}
};

export const getIMTestStep = () => (dispatch, getState) => {
	const { im_test, activeStep } = getState().imTestUser;
	const step = activeStep + 1;
	return axios
		.get('/api/im-test-templates/' + im_test + '/steps/' + step)
		.then((res) => {
			const { imtes, limit_time_hour, limit_time_minutes, id } = res.data.data;
			dispatch(onChange('id', id));
			dispatch(onChange('step' + step, imtes));
			dispatch(onChange('limit_time_hour', limit_time_hour));
			dispatch(onChange('limit_time_minutes', limit_time_minutes));
		})
		.catch((err) => {});
};

export const checkUser = (history) => (dispatch, getState, cb) => {
	let { im_test } = getState().imTestUser;
	let renderTimmer = false;
	return axios
		.get('/api/im-test/' + im_test + '/check-user')
		.then((res) => {
			let { is_exists, im_test_start_time, limit_time_hour, limit_time_minutes } = res.data.data;
			if (!is_exists) {
				history.push('/');
				return dispatch(
					addFlashMessage({
						type: 'error',
						text: "You're not authorized to take the IM Test"
					})
				);
			}

			if (!isEmpty(im_test_start_time)) {
				let end_time = moment(im_test_start_time)
					.add(limit_time_hour, 'h')
					.add(limit_time_minutes, 'm')
					.format('YYYY-MM-DD HH:mm:ss');
				dispatch(onChange('activeStep', 1));
				dispatch(onChange('im_test_start_time', im_test_start_time));
				dispatch(onChange('im_test_end_time', end_time));
				dispatch(onChange('limit_time_hour', limit_time_hour));
				dispatch(onChange('limit_time_minutes', limit_time_minutes));
				// dispatch(onChange('startImTest', true));
				dispatch(getIMTestStep());
				return (renderTimmer = true);
			}
		})
		.catch((err) => {
			return dispatch(addFlashMessage({ type: 'error', text: 'There is an error while getting the IM Test' }));
		});
};

export const onDelete = (name, deleteURL, files, deletedFileId, model_id) => {
	return (dispatch, getState) => {
		if (isEmpty(files)) {
			dispatch(onChange(name, {}));

			axios
				.delete(deleteURL + model_id)
				.then((res) => {
					dispatch(
						addFlashMessage({
							type: 'success',
							text: 'Your file succesfully deleted'
						})
					);
				})
				.catch((err) => {
					dispatch(
						addFlashMessage({
							type: 'error',
							text: 'There is an error while deleting Your file'
						})
					);
				});
		} else {
			dispatch(onChangeStep(name, files));
		}
	};
};

export const handleSelectAnswer = (step, index, id) => (dispatch, getState) => {
	return dispatch(onChange('selected' + step + (index + 1), id));
};

export const getAllImStep = (profileID, ImTestTemplateID) => (dispatch, getState) => {
	return axios
		.get('/api/im-test/' + ImTestTemplateID + '/user/' + profileID)
		.then((res) => {
			const { imtes } = res.data.data;
			let ImTest = getState().imtest;

			imtes.map((data, index) => {
				if (data.steps === index + 1) {
					dispatch(onChange('step' + (index + 1), [ data ]));
				}

				data.questions.map((dt, i) => {
					dispatch(
						onChange('selectedstep' + data.steps + (i + 1), dt['user-answer']['multiple_choice_im_test_id'])
					);
				});
			});
		})
		.catch((err) => {});
};
