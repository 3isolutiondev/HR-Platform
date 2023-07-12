import { SET_USER_REQUEST_CONTRACT,} from '../../types/jobs/requestContractTypes';

const initialState = {
    profile: {},
    job_title: '',
    contract_start: '',
    contract_end: '',
	home_based: 0,
	job_id: 0,
	full_name: '',
	immap_office_id: ''
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_USER_REQUEST_CONTRACT:
			return {
				...state,
				[action.name]: action.value
			};
		default:
			return state;
	}
};
