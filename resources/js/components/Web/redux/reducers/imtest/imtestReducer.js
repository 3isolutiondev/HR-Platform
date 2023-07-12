import {
	SET_IM_TEST_FORMDATA,
	SET_IM_TEST_ERROR,
	NEXT_BACK_STEP_IM_TEST,
	SHOW_HIDE_PREVIEW_IM_TEST,
	SET_IM_TEST_STEP
	// SET_IM_TEST_STEP_FORM
} from '../../types/imtest/imtestTypes';

const QuestionStep1 = [
	{
		question: '',
		answer: [
			{ choice: '', true_false: true },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false }
		]
	},
	{
		question: '',
		answer: [
			{ choice: '', true_false: true },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false }
		]
	},
	{
		question: '',
		answer: [
			{ choice: '', true_false: true },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false }
		]
	}
];

const QuestionStep2 = [
	{
		question: '',
		answer: [
			{ choice: '', true_false: true },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false },
			{ choice: '', true_false: false }
		]
	}
];

const initialState = {
	activeStep: 0,
	isEdit: 0,
	preview: false,
	start: false,
	errors: {},
	isValid: false,
	apiURL: '/api/imtest/',
	step1: {
		id: null,
		title: '',
		text1: '<p>default</p>'
	},
	step2: {
		id: null,
		title: '',
		text1: '<p>default</p>',
		text2: '<p>default</p>',
		questions: QuestionStep1,
		text3: '<p>default</p>',
		file_dataset1: {},
		file_dataset2: {}
	},
	step3: {
		id: null,
		title: '',
		text1: '<p>default</p>',
		text2: '<p>default</p>',
		text3: '<p>default</p>',
		file_dataset1: {},
		file_dataset2: {},
		text4: '<p>default</p>',
		choose_file1: {},
		choose_file2: {},
		choose_file3: {},
		questions: QuestionStep2
	},
	step4: {
		id: null,
		title: '',
		text1: '<p>default</p>',
		answer: '<p>answer</p>'
	},
	step5: {
		id: null,
		title: '',
		text1: '<p>default</p>',
		answer: '<p>answer</p>'
	}
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IM_TEST_FORMDATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_IM_TEST_STEP:
			return {
				...state,
				[action.step]: {
					...state[action.step],
					[action.name]: action.value
				}
			};
		case SET_IM_TEST_ERROR:
			return {
				...state,
				[action.name]: action.value
			};
		case NEXT_BACK_STEP_IM_TEST:
			let activeStepTemp = 0;
			if (action.val === 'next') {
				activeStepTemp = state.activeStep + 1;
			} else if (action.val === 'back') {
				activeStepTemp = state.activeStep - 1;
			}
			return {
				...state,
				activeStep: activeStepTemp
			};
		case SHOW_HIDE_PREVIEW_IM_TEST:
			let showHideTemp = false;
			if (action.val === 'show') {
				showHideTemp = true;
			} else if (action.val === 'hide') {
				showHideTemp = false;
			}

			return {
				...state,
				preview: showHideTemp
			};

		default:
			return state;
	}
};
