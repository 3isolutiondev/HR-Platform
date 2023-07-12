import axios from 'axios';
import { SET_BIO, ONCHANGE_BIO, ONCHANGE_BIO_PRESENT_NATIONALITY } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';
import DefaultProfile from '../../../../../../img/unisex_profile_default.jpg';

// GET BIO
export const getBio = () => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-biodata/')
				.then(async (res) => {
					let data = res.data.data;

					if (!res.data.data.photo) {
						data = { ...res.data.data, photo: DefaultProfile };
					} else {
            const fileResponse = await axios.get(`/api${res.data.data.photo.replace(window.location.origin, '')}`, {responseType: 'blob'}).catch(err => {
              data = { ...res.data.data, photo: DefaultProfile };
              dispatch(setBio(data));
              return false;
            });

            data = { ...res.data.data, photo: URL.createObjectURL(fileResponse.data)}
          }

          return dispatch(setBio(data));
				})
				.catch((err) => {
          if (typeof err.response === 'undefined') {
            return false;
          }
					return dispatch(setBioFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-biodata/' + profileID)
				.then(async (res) => {
					let data = res.data.data;
					if (!res.data.data.photo) {
						data = { ...res.data.data, photo: DefaultProfile };
					} else {
            const fileResponse = await axios.get(`/api${res.data.data.photo.replace(window.location.origin, '')}`, {responseType: 'blob'}).catch(err => {
              data = { ...res.data.data, photo: DefaultProfile };
              dispatch(setBio(data));
              return false;
            });
            data = { ...res.data.data, photo: URL.createObjectURL(fileResponse.data)}
          }

          return dispatch(setBio(data));
				})
				.catch((err) => {
					return dispatch(setBioFailed(err));
				});
		}
	};
};

// SET BIO
export const setBio = (bio) => {
	return {
		type: SET_BIO,
		bio
	};
};

// SET BIO ERROR MESSAGE
export const setBioFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving bio data'
		}
	};
};

export const onChangeBio = (name, value) => {
	return {
		type: ONCHANGE_BIO,
		name,
		value
	};
};

export const onChangeBioPresentNationality = (name, value) => {
	return {
		type: ONCHANGE_BIO_PRESENT_NATIONALITY,
		name,
		value
	};
};

export const profileLastUpdate = () => (dispatch) => {
	return axios
		.get('/api/profile-last-update')
		.then((res) => {
			return dispatch(onChangeBio('updated_at', res.data.data));
		})
		.catch((err) => {});
};
