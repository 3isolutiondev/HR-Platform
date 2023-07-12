import { SET_USER_REQUEST_CONTRACT,} from '../../types/jobs/requestContractTypes';

export const onChangeRequestContract = (name,value) => {
	return {
        type: SET_USER_REQUEST_CONTRACT,
        name,
		value
	};
};