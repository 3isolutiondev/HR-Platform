import axios from "axios";
import {
  SET_PERMANENT_CIVIL_SERVANTS,
  SET_PERMANENT_CIVIL_SERVANTS_WITH_OUT_SHOW,
} from "../../types/profile/profileTypes";
import { ADD_FLASH_MESSAGE } from "../../types/webTypes";

// GET PREVIOUSLY SUBMITTED
export const getPermanentCivilServantsWithOutShow = () => {
  return (dispatch, getState) => {
    const { profileID } = getState().profileRosterProcess;
    if (profileID === true) {
      return axios
        .get("/api/profile-permanent-civil-servants/")
        .then((res) => {
          let data = res.data.data;
          dispatch(setPermanentCivilServantsWithOutShow(data));
        })
        .catch((err) => {
          dispatch(setPermanentCivilServantsFailed(err));
        });
    } else if (profileID > 0) {
      return axios
        .get("/api/profile-permanent-civil-servants/" + profileID)
        .then((res) => {
          let data = res.data.data;
          dispatch(setPermanentCivilServantsWithOutShow(data));
        })
        .catch((err) => {
          dispatch(setPermanentCivilServantsFailed(err));
        });
    }
  };
};

// SET PREVIOUSLY SUBMITTED
export const setPermanentCivilServantsWithOutShow = (pcs) => {
  return {
    type: SET_PERMANENT_CIVIL_SERVANTS_WITH_OUT_SHOW,
    pcs,
  };
};

// GET PREVIOUSLY SUBMITTED
export const getPermanentCivilServants = (id) => {
  return (dispatch, getState) => {
    const { profileID } = getState().profileRosterProcess;
    if (profileID === true) {
      return axios
        .get("/api/profile-permanent-civil-servants/")
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.permanent_civil_servants_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.permanent_civil_servants_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setPermanentCivilServants(data));
        })
        .catch((err) => {
          dispatch(setPermanentCivilServantsFailed(err));
        });
    } else if (profileID > 0) {
      return axios
        .get("/api/profile-permanent-civil-servants/" + profileID)
        .then((res) => {
          let data = res.data.data;
          if (res.data.data.permanent_civil_servants_counts >= 1) {
            data = { ...res.data.data, show: true };
          } else if (res.data.data.permanent_civil_servants_counts <= 0) {
            data = { ...res.data.data, show: false };
          }
          dispatch(setPermanentCivilServants(data));
        })
        .catch((err) => {
          dispatch(setPermanentCivilServantsFailed(err));
        });
    }
  };
};

// SET PREVIOUSLY SUBMITTED
export const setPermanentCivilServants = (pcs) => {
  return {
    type: SET_PERMANENT_CIVIL_SERVANTS,
    pcs,
  };
};

// SET PREVIOUSLY SUBMITTED ERROR MESSAGE
export const setPermanentCivilServantsFailed = () => {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: "error",
      text: "There is an error while retrieving permanent civil servants data",
    },
  };
};
