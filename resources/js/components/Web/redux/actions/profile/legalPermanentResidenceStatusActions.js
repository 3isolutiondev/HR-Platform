import axios from 'axios';
import {
	SET_LEGAL_PERMANENT_RESIDENCE_STATUS,
	SET_LEGAL_PERMANENT_RESIDENCE_STATUS_WITH_OUT_SHOW,
	ONCHANGE_LEGAL_PERMANENT_RESIDENCE_STATUS
} from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET LEGAL PERMANENT STATUS
export const getLegalPermanentResidenceStatus = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-legal-permanent-residence-status/')
				.then((res) => {
					let legalCountries = res.data.data.legal_permanent_residence_status_countries.map((country) => {
						let value = country.country.id;
						let label = country.country.name;
						let country_code = country.country.country_code;
						return { value, label, country_code };
					});
					let data = { ...res.data.data, legal_permanent_residence_status_countries: legalCountries };
					if (res.data.data.legal_permanent_residence_status_counts >= 1) {
						data = { ...data, show: true };
					} else if (res.data.data.legal_permanent_residence_status_counts <= 0) {
						data = { ...data, show: false };
					}
					return dispatch(setLegalPermanentResidenceStatus(data));
				})
				.catch((err) => {
					return dispatch(setLegalPermanentResidenceStatusFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-legal-permanent-residence-status/' + profileID)
				.then((res) => {
					let legalCountries = res.data.data.legal_permanent_residence_status_countries.map((country) => {
						let value = country.country.id;
						let label = country.country.name;
						let country_code = country.country.country_code;
						return { value, label, country_code };
					});
					let data = { ...res.data.data, legal_permanent_residence_status_countries: legalCountries };
					if (res.data.data.legal_permanent_residence_status_counts >= 1) {
						data = { ...data, show: true };
					} else if (res.data.data.legal_permanent_residence_status_counts <= 0) {
						data = { ...data, show: false };
					}
					return dispatch(setLegalPermanentResidenceStatus(data));
				})
				.catch((err) => {
					return dispatch(setLegalPermanentResidenceStatusFailed(err));
				});
		}
	};
};

// SET LEGAL PERMANENT STATUS
export const setLegalPermanentResidenceStatus = (legal) => {
	return {
		type: SET_LEGAL_PERMANENT_RESIDENCE_STATUS,
		legal
	};
};

// GET LEGAL PERMANENT STATUS WITH OUT SHOW
export const getLegalPermanentResidenceStatusWithOutShow = (id) => {
	return (dispatch, getState) => {
		const { profileID } = getState().profileRosterProcess;
		if (profileID === true) {
			return axios
				.get('/api/profile-legal-permanent-residence-status/')
				.then((res) => {
					let legalCountries = res.data.data.legal_permanent_residence_status_countries.map((country) => {
						let value = country.country.id;
						let label = country.country.name;
						let country_code = country.country.country_code;
						return { value, label, country_code };
					});
					let data = { ...res.data.data, legal_permanent_residence_status_countries: legalCountries };
					return dispatch(setLegalPermanentResidenceStatusWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setLegalPermanentResidenceStatusFailed(err));
				});
		} else if (profileID > 0) {
			return axios
				.get('/api/profile-legal-permanent-residence-status/' + profileID)
				.then((res) => {
					let legalCountries = res.data.data.legal_permanent_residence_status_countries.map((country) => {
						let value = country.country.id;
						let label = country.country.name;
						let country_code = country.country.country_code;
						return { value, label, country_code };
					});
					let data = { ...res.data.data, legal_permanent_residence_status_countries: legalCountries };
					return dispatch(setLegalPermanentResidenceStatusWithOutShow(data));
				})
				.catch((err) => {
					return dispatch(setLegalPermanentResidenceStatusFailed(err));
				});
		}
	};
};

// SET LEGAL PERMANENT STATUS WITH OUT SHOW
export const setLegalPermanentResidenceStatusWithOutShow = (legal) => {
	return {
		type: SET_LEGAL_PERMANENT_RESIDENCE_STATUS_WITH_OUT_SHOW,
		legal
	};
};

// SET LEGAL PERMANENT STATUS ERROR MESSAGE
export const setLegalPermanentResidenceStatusFailed = () => {
	return {
		type: ADD_FLASH_MESSAGE,
		message: {
			type: 'error',
			text: 'There is an error while retrieving legal permanent residence status data'
		}
	};
};

export const onChange = (name, value) => {
	return {
		type: ONCHANGE_LEGAL_PERMANENT_RESIDENCE_STATUS,
		name,
		value
	};
};
