/** import language files */
import enLang from '../lang/en';
/** import validation helper */
import isEmpty from '../validations/common/isEmpty';

/**
 * textSelector is a function to choose text based on the type and the key value
 * @param {string} type - error only for now
 * @param {string} key  - the key inside error object (see enLang file)
 * @returns {string}
 */
const textSelector = (type, key) => {
  if (type !== 'error') {
    throw "Language type selector is not exist"
  }

  if (isEmpty(enLang[type][key])) {
    throw `Language ${type} key is not exist`
  }

  return enLang[type][key];
}

export default textSelector;
