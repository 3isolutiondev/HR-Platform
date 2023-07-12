/** import axios and validation helper*/
import axios from 'axios';
import isEmpty from '../../validations/common/isEmpty';

/**
 * getAPI is an action to call api using get http request
 * @category Redux [Actions] - ApiActions
 * @param {string} apiUrl - api url
 * @param {string} queryParams - query params
 * @param {*} responseType
 * @returns {Promise}
 */
export function getAPI(apiUrl, queryParams = '', responseType = '') {
	return (dispatch) => {
    if (!isEmpty(queryParams) && !isEmpty(responseType)) {
      return axios.get(apiUrl, { params: queryParams, responseType });
    }

    if (!isEmpty(queryParams)) {
      return axios.get(apiUrl, { params: queryParams });
    }

    if (!isEmpty(responseType)) {
      return axios.get(apiUrl, { responseType });
    }

		return axios.get(apiUrl);
	};
}

/**
 * postAPI is an action to call api using post http request
 * @category Redux [Actions] - ApiActions
 * @param {string} apiUrl - api url
 * @param {string} queryParams - query params
 * @param {*} responseType
 * @returns {Promise}
 */
export function postAPI(apiUrl, data, config = null) {
	return (dispatch) => {
		if (config === null) {
			return axios.post(apiUrl, data);
		} else {
			return axios.post(apiUrl, data, config);
		}
	};
}

/**
 * putAPI is an action to call api using put http request
 * @category Redux [Actions] - ApiActions
 * @param {string} apiUrl - api url
 * @param {string} queryParams - query params
 * @param {*} responseType
 * @returns {Promise}
 */
export function putApi(apiUrl, data, config) {
	return (dispatch) => {
		if (config === null) {
			return axios.put(apiUrl, data);
		} else {
			return axios.put(apiUrl, data, config);
		}
	};
}

/**
 * deleteAPI is an action to call api using delete http request
 * @category Redux [Actions] - ApiActions
 * @param {string} apiUrl - api url
 * @param {string} queryParams - query params
 * @param {*} responseType
 * @returns {Promise}
 */
export function deleteAPI(apiUrl, data = {}) {
	return (dispatch) => {
    if (!isEmpty(data)) {
      return axios.delete(apiUrl, {data: data});
    }
    return axios.delete(apiUrl);
	};
}
