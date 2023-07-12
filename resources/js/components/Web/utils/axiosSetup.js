/** import axios */
import axios from "axios";
// import moment from "moment";
import { store } from "../redux/store";
import { logoutUser, setCurrentUser } from "../redux/actions/authActions";
import { addFlashMessage, showLoading } from "../redux/actions/webActions";
import isEmpty from "../validations/common/isEmpty";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

axios.interceptors.request.use(
  function(config) {

    /*
      Please uncomment this to revert to the old way of rerouting to login page when token expires
    */

    // if (!isEmpty(store.getState().auth.user.expiredAt)) {
    //   let expiredAt = moment.utc(store.getState().auth.user.expiredAt);
    //   expiredAt = moment(expiredAt).local();
    //   const isExpired = expiredAt.isBefore(moment());

    //   // if (isExpired) {
    //   //     store.dispatch(addFlashMessage({
    //   //       type: 'info',
    //   //       text: "Please relogin with your account!"
    //   //     }));
    //   //     localStorage.removeItem("openSidebar");
    //   //     localStorage.removeItem("persist:root");
    //   //     store.dispatch(setCurrentUser({}));
    //   //     window.location.href = "/login";
    //   // }
    // }

    store.dispatch(showLoading(true));
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  function(response) {
    store.dispatch(showLoading(false));
    return response;
  },
  async function(error) {
    store.dispatch(showLoading(false));
    if (!isEmpty(error)) {
      if (!isEmpty(error.response)) {
        if (
          (error.response.status === 401 ||
          error.response.data === "Unauthorized") &&
          error.response.config.url !== '/api/login'
        ) {
          const originalConfig = error.config;
          const token = localStorage.getItem('refreshToken');
          if(!originalConfig._retry) originalConfig._retry = true;
          if(token) {
            try {
              const res = await axios.post('/api/refresh', {refreshToken: token});
              localStorage.setItem('refreshToken', res.data.refreshToken);
              store.dispatch(setCurrentUser(res.data.data));
              if(window.location.pathname === '/') return window.location.reload();
              return axios.request(error.config);
            } catch(t) {
              store.dispatch(logoutUser());
            }
          }
          throw new Error(error.response.data);
        }
      }
    }

    return Promise.reject(error);
  }
);
