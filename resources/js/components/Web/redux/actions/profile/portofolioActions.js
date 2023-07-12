import axios from 'axios';
import { SET_PORTOFOLIO } from '../../types/profile/profileTypes';
import { ADD_FLASH_MESSAGE } from '../../types/webTypes';

// GET PORTOFOLIO
export const getPortofolio = () => {
  return (dispatch, getState) => {
    const { profileID } = getState().profileRosterProcess;
    if (profileID === true) {
      return axios
        .get('/api/profile-portfolios/')
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.portfolios_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.portfolios_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setPortofolio(data));
        })
        .catch((err) => {
          dispatch(setPortofolioFailed(err));
        });
    } else if (profileID > 0) {
      return axios
        .get('/api/profile-portfolios/' + profileID)
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.portfolios_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.portfolios_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setPortofolio(data));
        })
        .catch((err) => {
          dispatch(setPortofolioFailed(err));
        });
    }
  };
};

// SET PORTOFOLIO
export const setPortofolio = (portofolio) => {
  return {
    type: SET_PORTOFOLIO,
    portofolio
  };
};

// SET PORTOFOLIO ERROR MESSAGE
export const setPortofolioFailed = () => {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: 'error',
      text: 'There is an error while retrieving portofolio data'
    }
  };
};
