/** import axios */
import axios from 'axios';

/** import validation helper */
import isEmpty from '../../../validations/common/isEmpty';

/** import types needed for this actions */
import { DELETE_ACCOUNT_ON_CHANGE } from '../../types/profile/deleteAccountTypes';

/** import other actions */
import { addFlashMessage } from '../webActions';

/**
 * deleteAccountOnChange action to change deleteAccountReducer data
 * @category Redux [Actions] - DeleteAccountActions
 * @param {string} name
 * @param {*} value - it depends on the initialState inside deleteAccountReducer
 * @returns {object} object containing type and value needed inside deleteAccountReducer
 */
export const deleteAccountOnChange = (name, value) => {
  return {
    type: DELETE_ACCOUNT_ON_CHANGE,
    name, value
  }
}

/**
 * toggleDeleteAttention action to toggle delete attention modal
 * @category Redux [Actions] - DeleteAccountActions
 * @returns {Promise}
 */
export const toggleDeleteAttention = () => (dispatch, getState) => {
  const { deleteAttentionOpen } = getState().deleteAccount
  if (!deleteAttentionOpen) {
    dispatch(getDeleteAccountData());
  }
  return dispatch(deleteAccountOnChange('deleteAttentionOpen', deleteAttentionOpen ? false : true ));
}

/**
 * removeAccountRequest action to create remove account request by calling an api in the backend
 * @category Redux [Actions] - DeleteAccountActions
 * @returns {Promise}
 */
export const removeAccountRequest = () => (dispatch, getState) => {
  dispatch(deleteAccountOnChange('deleteRequestLoading', true))

  const { isIMMAPER } = getState().auth.user;

  if (isIMMAPER) {
    dispatch(deleteAccountOnChange('deleteRequestLoading', false))
    return dispatch(deleteAccountOnChange('showDeleteNoteForImmaper', true));
  }

  return axios
          .post('/api/remove-account-request')
          .then((res) => {
            dispatch(deleteAccountOnChange('deleteRequestLoading', false))
            dispatch(deleteAccountOnChange('hasValidDeleteRequest', true))
            return dispatch(addFlashMessage({
              type: 'success',
              text: res.data.message
            }))
          })
          .catch(err => {
            dispatch(deleteAccountOnChange('deleteRequestLoading', false))
            dispatch(deleteAccountOnChange('hasValidDeleteRequest', false))
            let errorMsg = "We cannot proceed your request now, Please try again later";
            if (!isEmpty(err.response.data.errors)) {
              if (!isEmpty(err.response.data.errors.showMessage)) {
                errorMsg = err.response.data.message
              }
            }
            return dispatch(addFlashMessage({
              'type': 'error',
              'text': errorMsg
            }))
          })
}

/**
 * getDeleteAccountData action to call an api that detecting current user still has valid delete request or not
 * @category Redux [Actions] - DeleteAccountActions
 * @returns {Promise}
 */
export const getDeleteAccountData = () => async (dispatch) => {
  await dispatch(deleteAccountOnChange('getDeleteAccountDataLoading', true));
  return axios
          .get('/api/profile-delete-account-data')
          .then((res) => {
            dispatch(deleteAccountOnChange('getDeleteAccountDataLoading', false));
            return dispatch(deleteAccountOnChange('hasValidDeleteRequest', res.data.data.hasValidDeleteRequest));
          });
}
