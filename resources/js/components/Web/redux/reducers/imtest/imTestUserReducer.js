import { SET_IM_TEST_DATA } from '../../types/imtest/imTestUserTypes';
// import moment from 'moment';

const initialState = {
	id: null,
	startImTest: null,
	im_test: '',
	steps: [ 'Welcome', 'Part 1', 'Part 2', 'Part 3', 'Part 4' ],
	activeStep: 0,
	im_test_start_time: '',
	im_test_end_time: '',
	limit_time_hour: 0,
	limit_time_minutes: 0,
	step1: [],
	step2: [],
	step3: [],
	step4: [],
	step5: [],
	file1: {},
	file2: {},
	file3: {},
	file4: {},
	userTextInput1: '',
	userTextInput2: '',
	selectedstep21: null,
	selectedstep22: null,
	selectedstep23: null,
	selectedstep31: null,
	errors: {},
	alertOpen: false,
	successOpen: false
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_IM_TEST_DATA:
			return {
				...state,
				[action.name]: action.value
			};

		default:
			return state;
	}
};
