import {
	SET_QUIZ_TEMPLATE_FORMDATA,
	SET_BULK_QUIZ_TEMPLATE_FORMDATA,
	RESET_QUIZ_TEMPLATE_FORMDATA
} from '../../../types/dashboard/quiz-template/quizTemplateTypes';

const initialState = {
	id: '',
	title: '',
	is_default: 0,
	is_im_test: 0,
	im_test_template: '',
	duration: '',
	pass_score: '',
	errors: {},
	isEdit: false,
	apiURL: '/api/quiz-templates',
	redirectURL: '/dashboard/quiz-templates'
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_QUIZ_TEMPLATE_FORMDATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_QUIZ_TEMPLATE_FORMDATA:
			let dashboardQuizTemplate = { ...state };

			Object.keys(dashboardQuizTemplate).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					dashboardQuizTemplate[key] = action.bulkData[key];
				}
			});

			return dashboardQuizTemplate;
		case RESET_QUIZ_TEMPLATE_FORMDATA:
			return initialState;
		default:
			return state;
	}
};
