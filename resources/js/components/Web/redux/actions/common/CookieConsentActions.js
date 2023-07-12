import { COOKIE_CONSENT_ON_CHANGE } from '../../types/common/CookieConsentTypes';

export const setShowCookieConsent = (value) => {
  return {
    type: COOKIE_CONSENT_ON_CHANGE,
    value
  }
}
