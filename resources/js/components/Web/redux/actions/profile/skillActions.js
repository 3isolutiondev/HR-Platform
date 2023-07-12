import axios from 'axios';
import { SET_SKILL } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET SKILL
export const getSkill = (customProfileId) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		const id = customProfileId || profileID;
		if (id === true) {
			return axios
				.get('/api/profile-skills/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.skills_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.skills_counts <= 0) {
						data = { ...res.data.data, show: true };
					}
					dispatch(setSkill(data));
				})
				.catch((err) => {
					dispatch(setSkillFailed(err));
				});
		} else if (id > 0) {
			return axios
				.get('/api/profile-skills/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.skills_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.skills_counts <= 0) {
						data = { ...res.data.data, show: true };
					}
					dispatch(setSkill(data));
				})
				.catch((err) => {
					dispatch(setSkillFailed(err));
				});
		} else {
			return Promise.resolve();
		}
	};
};

// SET SKILL
export const setSkill = (skill) => {
	return {
		type: SET_SKILL,
		skill
	};
};

// SET SKILL ERROR MESSAGE
export const setSkillFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving skill data'
		}
	};
};
