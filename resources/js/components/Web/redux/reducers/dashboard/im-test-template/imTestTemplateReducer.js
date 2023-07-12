import {
	SET_IM_TEST_TEMPLATE_FORMDATA,
	SET_BULK_IM_TEST_TEMPLATE_FORMDATA,
	RESET_IM_TEST_TEMPLATE_FORMDATA
} from '../../../types/dashboard/im-test-template/imTestTemplateTypes';

const initialState = {
	id: '',
	name: '',
	is_default: 0,
	limit_time: '04:00',
	errors: {},
	steps: 1,
	isEdit: false,
	isAdd: true,
	apiURL: '/api/im-test-templates',
	redirectURL: '/dashboard/im-test-templates'
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IM_TEST_TEMPLATE_FORMDATA:
			return {
				...state,
				[action.name]: action.value
			};
		case SET_BULK_IM_TEST_TEMPLATE_FORMDATA:
			let dashboardIMTestTemplate = { ...state };
			Object.keys(dashboardIMTestTemplate).map((key) => {
				if (action.bulkData.hasOwnProperty(key)) {
					dashboardIMTestTemplate[key] = action.bulkData[key];
				}
			});

			return dashboardIMTestTemplate;
		case RESET_IM_TEST_TEMPLATE_FORMDATA:
			return initialState;
		default:
			return state;
	}
};
