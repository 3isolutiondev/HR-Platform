import axios from 'axios';
import { SET_PUBLICATION, SET_PUBLICATION_WITH_OUT_SHOW } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET PUBLICATIONS
export const getPublications = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-publications/')
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.publications_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.publications_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPublications(data));
				})
				.catch((err) => {
					dispatch(setPublicationsFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-publications/' + profileID)
				.then((res) => {
					let data = res.data.data;
					if (res.data.data.publications_counts >= 1) {
						data = { ...res.data.data, show: true };
					} else if (res.data.data.publications_counts <= 0) {
						data = { ...res.data.data, show: false };
					}
					dispatch(setPublications(data));
				})
				.catch((err) => {
					dispatch(setPublicationsFailed(err));
				});
		}
	};
};

// SET PUBLICATIONS
export const setPublications = (publication) => {
	return {
		type: SET_PUBLICATION,
		publication
	};
};

// GET PUBLICATIONS WITH OUT SHOW
export const getPublicationsWithOutShow = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-publications/')
				.then((res) => {
					let data = res.data.data;

					dispatch(setPublicationsWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setPublicationsFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-publications/' + profileID)
				.then((res) => {
					let data = res.data.data;

					dispatch(setPublicationsWithOutShow(data));
				})
				.catch((err) => {
					dispatch(setPublicationsFailed(err));
				});
		}
	};
};

// SET PUBLICATIONS WITH OUT SHOW
export const setPublicationsWithOutShow = (publication) => {
	return {
		type: SET_PUBLICATION_WITH_OUT_SHOW,
		publication
	};
};

// SET PUBLICATIONS ERROR MESSAGE
export const setPublicationsFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving publications data'
		}
	};
};
