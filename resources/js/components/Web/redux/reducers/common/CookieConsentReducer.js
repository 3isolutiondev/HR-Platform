import { COOKIE_CONSENT_ON_CHANGE } from '../../types/common/CookieConsentTypes';

const initialState = {
	showCookieConsent: false,
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case COOKIE_CONSENT_ON_CHANGE:
			return {
				...state,
				showCookieConsent: action.value
			};
		default:
			return state;
	}
};
