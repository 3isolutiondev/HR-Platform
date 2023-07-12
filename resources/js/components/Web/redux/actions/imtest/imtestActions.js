import {
	SET_IM_TEST_FORMDATA,
	SET_IM_TEST_ERROR,
	NEXT_BACK_STEP_IM_TEST,
	SHOW_HIDE_PREVIEW_IM_TEST,
	SET_IM_TEST_STEP
	// SET_UPLOAD_DATA_SET
} from '../../types/imtest/imtestTypes';
import axios from 'axios';
import {
	validationIMTest1,
	validationIMTest2,
	validationIMTest3,
	validationIMTest4,
	validationIMTest5
} from '../../../validations/imTest/imTest';
import isEmpty from '../../../validations/common/isEmpty';
import { addFlashMessage } from '../../actions/webActions';

export const onChangeFormdata = (name, value) => {
	return {
		type: SET_IM_TEST_FORMDATA,
		name,
		value
	};
};

export const onChangeStep = (step, name, value) => {
	return {
		type: SET_IM_TEST_STEP,
		step,
		name,
		value
	};
};

export const onUpload = (name, files, step) => {
	return (dispatch, getState) => {
		let names = {};
		if (!isEmpty(files)) {
			const { file_id, file_url, mime, filename, model_id } = files[0];
			names = { file_id, file_url, mime, filename, model_id };
			dispatch(
				addFlashMessage({
					type: 'success',
					text: 'Your file succesfully uploaded'
				})
			);
		}
		dispatch(onChangeStep(step, name, names));
	};
};

export const onDelete = (name, deleteURL, files, deletedFileId, step, model_id) => {
	return (dispatch, getState) => {
		if (isEmpty(files)) {
			dispatch(onChangeStep(step, name, {}));
			dispatch(isValid());
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
			dispatch(onChangeStep(step, name, files));
			dispatch(isValid());
		}
	};
};

export const isValid = (step) => {
	return (dispatch, getState) => {
		let dashboardIMTest = getState().imtest;
		let valid = false;
		if (step === 1) {
			const { errors, isValid } = validationIMTest1(dashboardIMTest.step1);
			dispatch(setError('errors', errors));
			dispatch(setError('isValid', isValid));
			valid = isValid;
		} else if (step === 2) {
			const { errors, isValid } = validationIMTest2(dashboardIMTest.step2);
			dispatch(setError('errors', errors));
			dispatch(setError('isValid', isValid));
			valid = isValid;
		} else if (step === 3) {
			const { errors, isValid } = validationIMTest3(dashboardIMTest.step3);
			dispatch(setError('errors', errors));
			dispatch(setError('isValid', isValid));
			valid = isValid;
		} else if (step === 4) {
			const { errors, isValid } = validationIMTest4(dashboardIMTest.step4);
			dispatch(setError('errors', errors));
			dispatch(setError('isValid', isValid));
			valid = isValid;
		} else {
			const { errors, isValid } = validationIMTest5(dashboardIMTest.step5);
			dispatch(setError('errors', errors));
			dispatch(setError('isValid', isValid));
			valid = isValid;
		}

		return valid;
	};
};

export const setError = (name, value) => {
	return {
		type: SET_IM_TEST_ERROR,
		name,
		value
	};
};

export const handleNext = () => {
	return (dispatch, getState) => {
		dispatch(nextBack('next'));
		dispatch(
			addFlashMessage({
				type: 'success',
				text: 'Your file succesfully save'
			})
		);
	};
};

export const handleBack = () => {
	return (dispatch, getState) => {
		dispatch(nextBack('back'));
		dispatch(
			addFlashMessage({
				type: 'success',
				text: 'Your file succesfully save'
			})
		);
	};
};

export const nextBack = (val) => {
	return {
		type: NEXT_BACK_STEP_IM_TEST,
		val
	};
};

export const showHidePreview = (val) => {
	return {
		type: SHOW_HIDE_PREVIEW_IM_TEST,
		val
	};
};
