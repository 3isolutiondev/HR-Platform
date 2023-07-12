/** import axios and jwt-decode, */
import axios from "axios";

/** import types and actions needed for this action */
import { SET_CURRENT_USER } from "../types/authTypes";
import { addFlashMessage } from "../actions/webActions";

/** import helper for this action */
import isEmpty from '../../validations/common/isEmpty';

/**
 * setCurrentUser is an action to save current user data in reducer state
 * @category Redux [Actions] - AuthActions
 * @param {object} user - user data
 * @returns {Promise}
 */
export const setCurrentUser = (user) => (dispatch, getState) => {
  try {
    dispatch({
      type: SET_CURRENT_USER,
      user,
    });
    return Promise.resolve(getState());
  } catch (error) {
    return Promise.reject()
  }
}

/**
 * loginUser is an action to call login api
 * @category Redux [Actions] - AuthActions
 * @param {*} userData
 * @returns {Promise}
 */
export function loginUser(userData) {
  return (dispatch) => {
    return axios
      .post("/api/login", userData)
      .then((res) => {
        localStorage.setItem('refreshToken', res.data.refreshToken);
        dispatch(setCurrentUser(res.data.data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

/**
 * logoutUser is an action to logout user
 * @category Redux [Actions] - AuthActions
 * @returns {Promise}
 */
export function logoutUser() {
  return async (dispatch) => {
    await axios
      .get("/api/logout")
      .then((res) => {
        dispatch(setCurrentUser({}))
        .then(() => {
          localStorage.removeItem("openSidebar");
          localStorage.removeItem("persist:root");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        })
        .catch(() => addFlashMessage({
          type: "error",
          text: "Server error",
        }))
      })
      .catch((err) => {
        dispatch(setCurrentUser({}))
        .then(() => {
          localStorage.removeItem("openSidebar");
          localStorage.removeItem("persist:root");
          window.location.href = "/login";
        })
        .catch(() => addFlashMessage({
          type: "error",
          text: "Server error",
        }))
      });
  };
}

/**
 * refreshAuthUser is an action to update jwt token
 * @category Redux [Actions] - AuthActions
 * @param {string} newToken
 * @returns {Promise}
 */
export function refreshAuthUser(userData) {
  return (dispatch) => {
    if (!isEmpty(userData)) {
      dispatch(setCurrentUser(userData));
    }
  };
}

/**
 * registerUser is an action to call register user api
 * @category Redux [Actions] - AuthActions
 * @param {*} userData
 * @returns {Promise}
 */
export function registerUser(userData) {
  return (dispatch) => {
    return axios.post("/api/register", userData).then((res) => {
      const activeFromHidden = isEmpty(res.data.data.activeFromHidden) ? false : res.data.data.activeFromHidden

      if (activeFromHidden) {
        dispatch(addFlashMessage({
          type: 'success',
          text: res.data.message
        }))
      } else {
        dispatch(addFlashMessage({
          type: 'success',
          text: 'Welcome !'
        }))
      }

      dispatch(setCurrentUser(res.data.data));

    });
  };
}
