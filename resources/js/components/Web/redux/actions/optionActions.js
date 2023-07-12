/** import axios and lodash */
import axios from 'axios';
import findIndex from 'lodash/findIndex';

/** import types needed for this actions */
import {
  SET_NATIONALITIES,
  SET_YEARS,
  SET_COUNTRIES,
  SET_P11_COUNTRIES,
  SET_SECTORS,
  SET_LANGUAGES,
  SET_UN_ORGANIZATION,
  SET_SKILLS_FOR_MATCHING,
  SET_REQUIREMENT_OPTIONS,
  SET_DEGREE_LEVELS,
  SET_COUNTRY_CODE_WITH_FLAG,
  SET_LANGUAGE_LEVELS,
  SET_FIELD_OF_WORKS,
  SET_ROLES,
  SET_P11_IMMAP_OFFICES,
  SET_IMMAP_OFFICES,
  SET_EMAIL_ADDRESS,
  SET_IMMAP_EMAIL_ADDRESS,
  SET_JOB_CATEGORIES,
  SET_IM_TEST_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_JOB_STATUS,
  SET_TIMEZONES,
  SET_ROSTER_PROCESS,
  SET_SKYPE,
  SET_REFERENCE_CHECK,
  SET_HQ_OFFICE,
  SET_IMMAPERS,
  SET_SECURITY_MODULE_COUNTRIES,
  SET_SECURITY_MODULE_PURPOSES,
  SET_SECURITY_MODULE_MOVEMENTS,
  SET_SECURITY_MODULE_MOVEMENT_STATES, SET_SECURITY_MODULE_SECURITY_MEASURES,
  SET_LINE_MANAGERS,
  SET_THIRD_PARTY_PERMISSIONS
} from '../types/optionTypes';
import { ADD_FLASH_MESSAGE } from '../types/webTypes';
import { SET_BULK_APPLICANT_LISTS } from '../types/jobs/applicantTypes';

/** import configuration value and validation helper */
import { year } from '../../config/options';
import isEmpty from '../../validations/common/isEmpty';

// GET NATIONALITIES
/**
 * getNationalities is an action to get the list of nationalities
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getNationalities = () => {
  return (dispatch) => {
    axios
      .get('/api/countries/nationalities')
      .then((res) => {
        dispatch(setData(SET_NATIONALITIES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving nationality data'));
      });
  };
};

// GET COUNTRIES
/**
 * getCountries is an action to get the list of all countries including custom country
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getCountries = () => {
  return (dispatch) => {
    axios
      .get('/api/countries/all')
      .then((res) => {
        dispatch(setData(SET_COUNTRIES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving country data'));
      });
  };
};

// GET COUNTRIES
/**
 * getP11Countries is an action to get the list of the countries
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getP11Countries = () => {
  return (dispatch) => {
    axios
      .get('/api/countries/p11')
      .then((res) => {
        dispatch(setData(SET_P11_COUNTRIES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving country data'));
      });
  };
};

// GET SECTORS
/**
 * getSectors is an action to get the list of sectors
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSectors = () => {
  return (dispatch) => {
    axios
      .get('/api/sectors/all-options')
      .then((res) => {
        dispatch(setData(SET_SECTORS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving sector data'));
      });
  };
};

// GET LANGUAGES
/**
 * getLanguages is an action to get the list of languages
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getLanguages = () => {
  return (dispatch) => {
    axios
      .get('/api/languages/all')
      .then((res) => {
        dispatch(setData(SET_LANGUAGES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving language data'));
      });
  };
};

// GET UN ORGANIZATION
/**
 * getOrganizations is an action to get the list of un organizations
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getOrganizations = () => {
  return (dispatch) => {
    axios
      .get('/api/un-organizations/all')
      .then((res) => {
        dispatch(setData(SET_UN_ORGANIZATION, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving un organization data'));
      });
  };
};

// GET SET SKILLS FOR MATCHING
/**
 * getSkillsForMatching is an action to get the list of accepted skills for matching profile with ToR
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSkillsForMatching = (category = '') => {
  return async function (dispatch) {
    await axios
      .get('/api/skills/skills-for-matching' + (category ? `?category=${category}` : ''))
      .then((res) => {
        let allSkills = res.data.data.map((res) => {
          return { value: res.id, label: res.skill, category: res.category };
        });

        dispatch(setData(SET_SKILLS_FOR_MATCHING, allSkills));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving skill for matching data'));
      });
  };
};

// GET REQUIREMENT OPTIONS
/**
 * getRequirementOptions is an action to get the list of requirements in ToR Form
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getRequirementOptions = () => {
  return (dispatch) => {
    axios
      .get('/api/hr-requirements/all-options')
      .then((res) => {
        dispatch(setData(SET_REQUIREMENT_OPTIONS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving requirement options data'));
      });
  };
};

// GET DEGREE LEVELS
/**
 * getDegreeLevels is an action to get the list of degree levels
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getDegreeLevels = () => {
  return (dispatch) => {
    axios
      .get('/api/degree-levels/all-options')
      .then((res) => {
        dispatch(setData(SET_DEGREE_LEVELS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving degree level data'));
      });
  };
};

//GET COUNTRY CODE WITH FLAG
/**
 * getCountryCodeWithFlag is an action to get the list of country data with it's flag
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getCountryCodeWithFlag = () => (dispatch, getState) => {
  // return (dispatch) => {
  return Promise.resolve(
    axios
      .get('/api/countries/country-code-with-flag')
      .then((res) => {
        dispatch(setData(SET_COUNTRY_CODE_WITH_FLAG, res.data.data));
        // return Promise.resolve(getState());
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving phones data'));
        // return Promise.resolve(getState());
      })
  );
  // };
};

// GET LANGUAGE LEVELS
/**
 * getLanguageLevels is an action to get the list of language levels
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getLanguageLevels = () => {
  return (dispatch) => {
    axios
      .get('/api/language-levels/all-options')
      .then((res) => {
        dispatch(setData(SET_LANGUAGE_LEVELS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving language level data'));
      });
  };
};

// GET APPROVED AREAS OF EXPERTISE
/**
 * getApprovedFieldOfWorks is an action to get the list of approved areas of expertise
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getApprovedFieldOfWorks = () => {
  return async function (dispatch) {
    await axios
      .get('/api/field-of-works/all-options')
      .then((res) => {
        dispatch(setData(SET_FIELD_OF_WORKS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving areas of expertise data'));
      });
  };
};

// GET APPROVED SECTORS
/**
 * getApprovedSectors is an action to get the list of approved sectors
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getApprovedSectors = () => {
  return async function (dispatch) {
    await axios
      .get('/api/sectors/all-options')
      .then((res) => {
        dispatch(setData(SET_SECTORS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving sectors data'));
      });
  };
};

// GET ROLES
/**
 * getRoles is an action to get the list of roles
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getRoles = () => {
  return async function (dispatch) {
    await axios
      .get('/api/roles/all-options')
      .then((res) => {
        dispatch(setData(SET_ROLES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving roles data'));
      });
  };
};

// GET IMMAP OFFICES
/**
 * getImmapOffices is an action to get the list of immap offices
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getImmapOffices = () => {
  return (dispatch) => {
    axios
      .get('/api/immap-offices/all-options')
      .then((res) => {
        dispatch(setData(SET_IMMAP_OFFICES, res.data.data));
      })
      .catch((err) => {
        if(!err.response.status === 401) {
          dispatch(setDataFailed(err, 'There is an error while retrieving immap office data'));
        }
      });
  };
};

// GET EMAIL ADDRESS
/**
 * getEmailAddress is an action to get the list of email address
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getEmailAddress = () => {
  return (dispatch) => {
    axios
      .get('/api/email/to')
      .then((res) => {
        dispatch(setData(SET_EMAIL_ADDRESS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving email address'));
      });
  };
};

// GET IMMAP EMAIL ADDRESS
/**
 * getImmapEmailAddress is an action to get the list of immap email address
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getImmapEmailAddress = () => {
  return (dispatch) => {
    axios
      .get('/api/email/immap')
      .then((res) => {
        dispatch(setData(SET_IMMAP_EMAIL_ADDRESS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving immap email address'));
      });
  };
};

// GET P11 IMMAP OFFICES
/**
 * getP11ImmapOffices is an action to get the list of accepted immap offices
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getP11ImmapOffices = () => {
  return (dispatch) => {
    axios
      .get('/api/immap-offices/p11-all-options')
      .then((res) => {
        dispatch(setData(SET_P11_IMMAP_OFFICES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving immap office data'));
      });
  };
};

// GET JOB CATEGORIES
/**
 * getJobCategories is an action to get the list of job categories
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getJobCategories = () => {
  return (dispatch) => {
    axios
      .get('/api/hr-job-categories/all-options')
      .then((res) => {
        dispatch(setData(SET_JOB_CATEGORIES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving job category data'));
      });
  };
};

// GET IM TEST TEMPLATES
/**
 * getIMTestTemplates is an action to get the list of IM Test Templates
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getIMTestTemplates = () => {
  return (dispatch) => {
    axios
      .get('/api/im-test-templates/all-options')
      .then((res) => {
        dispatch(setData(SET_IM_TEST_TEMPLATES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving IM test templates data'));
      });
  };
};

// GET QUIZ TEMPLATES
/**
 * getQuizTemplates is an action to get the list of quiz templates
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getQuizTemplates = () => {
  return (dispatch) => {
    axios
      .get('/api/quiz-templates/all-options')
      .then((res) => {
        dispatch(setData(SET_QUIZ_TEMPLATES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving quiz templates data'));
      });
  };
};

// GET JOB STATUS
/**
 * getJobStatus is an action to get the list of job status
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getJobStatus = (under_sbp_program = false) => {
  return (dispatch) => {
    axios
      .get(`/api/job-status${under_sbp_program ? '/under-sbp' : ''}`)
      .then(async (res) => {
        let lastStepIndex = await findIndex(res.data.data, ['last_step', 1]);
        let interviewIndex = await findIndex(res.data.data, ['is_interview', 1]);
        dispatch({
          type: SET_BULK_APPLICANT_LISTS,
          bulkData: {
            lastStepIndex,
            interviewIndex
          }
        });
        let jobStatus = [...res.data.data];
        if (under_sbp_program && !isEmpty(jobStatus)) {
          jobStatus[(jobStatus.length - 1)] = { ...jobStatus[(jobStatus.length - 1)], label: 'Not Selected'}
        }
        dispatch(setData(SET_JOB_STATUS, jobStatus));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving job status data'));
      });
  };
};

// GET TIMEZONES
/**
 * getTimezones is an action to get the list of timezones
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getTimezones = () => {
  return (dispatch) => {
    axios
      .get('/api/timezones/all-options')
      .then((res) => {
        dispatch(setData(SET_TIMEZONES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving timezone data'));
      });
  };
};

// GET IMMAPERS
/**
 * a is an action to get the list of immapers
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getImmapers = (addNotApplicable = false, forRoster = '') => {
  return (dispatch) => {
    axios
      .get('/api/immapers-value-label/'+(forRoster ? '?forRoster='+forRoster: ''))
      .then((res) => {
        if (addNotApplicable) {
          dispatch(setData(SET_IMMAPERS, [...res.data.data, {id: 0, value: 0, label: "N/A"}]));
        } else {
          dispatch(setData(SET_IMMAPERS, res.data.data));
        }
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving timezone data'));
      });
  };
};

// GET ROSTER PROCESS
/**
 * getRosterProcess is an action to get the list of roster process
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getRosterProcess = () => {
  return (dispatch) => {
    axios
      .get('/api/roster-processes/all-options')
      .then((res) => {
        dispatch(setData(SET_ROSTER_PROCESS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving roster process data'));
      });
  };
};

// GET AUTH SKYPE
/**
 * getAuthSkype is an action to get the skype of logged in user
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getAuthSkype = () => (dispatch) => {
  return axios
    .get('/api/get-skype')
    .then((res) => {
      dispatch(setData(SET_SKYPE, res.data.data));
    })
    .catch((err) => {
      dispatch(setDataFailed(err, 'There is an error while retrieving skype data'));
    });
};

// GET HQ
/**
 * getHQ is an action to get the list of hq office data
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getHQ = () => {
  return (dispatch) => {
    axios
      .get('/api/immap-offices/hq')
      .then((res) => {
        dispatch(setData(SET_HQ_OFFICE, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving hq data'));
      });
  };
};

/**
 * getReferenceCheck is an action to get the list reference check
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getReferenceCheck = () => (dispatch) => {
  return axios
    .get('/api/reference-question-category/all-options')
    .then((res) => {
      dispatch(setData(SET_REFERENCE_CHECK, res.data.data));
    })
    .catch((err) => {
      dispatch(setDataFailed(err, 'There is an error while retrieving reference check data'));
    });
};

// GET SECURITY MODULE COUNTRIES
/**
 * getSecurityModuleCountries is an action to get the list of countries data managed by security module
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSecurityModuleCountries = () => {
  return (dispatch) => {
    axios
      .get('/api/security-module/countries')
      .then((res) => {
        dispatch(setData(SET_SECURITY_MODULE_COUNTRIES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving country data'));
      });
  };
};

// GET SECURITY MODULE CRITICAL MOVEMENTS
/**
 * getSecurityModuleMovements is an action to get the list of critical movements data managed by security module
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSecurityModuleMovements = () => {
  return (dispatch) => {
    axios
      .get('/api/security-module/critical-movements/all-options')
      .then((res) => {
        dispatch(setData(SET_SECURITY_MODULE_MOVEMENTS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving critical movements data'));
      });
  };
};

// GET SECURITY MODULE TRAVEL PURPOSES
/**
 * getSecurityModulePurposes is an action to get the list of travel purposes data managed by security module
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSecurityModulePurposes = () => {
  return (dispatch) => {
    axios
      .get('/api/security-module/travel-purposes/all-options')
      .then((res) => {
        dispatch(setData(SET_SECURITY_MODULE_PURPOSES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving travel purposes data'));
      });
  };
};

// GET SECURITY MODULE MOVEMENT STATES
/**
 * getSecurityModuleMovementStates is an action to get the list of movement states data managed by security module
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSecurityModuleMovementStates = () => {
  return (dispatch) => {
    axios
      .get('/api/security-module/movement-states/all-options')
      .then((res) => {
        dispatch(setData(SET_SECURITY_MODULE_MOVEMENT_STATES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving movement states data'));
      });
  };
};

// GET SECURITY MODULE SECURITY MEASURES
/**
 * getSecurityModuleSecurityMeasures is an action to get the list of security measures data managed by security module
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getSecurityModuleSecurityMeasures = () => {
  return (dispatch) => {
    axios
      .get('/api/security-module/security-measures/all-options')
      .then((res) => {
        dispatch(setData(SET_SECURITY_MODULE_SECURITY_MEASURES, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving movement states data'));
      });
  };
};


// SET DATA
/**
 * setData is an action to change data in optionReducer state
 * @category Redux [Actions] - OptionActions
 * @param {string}  type - one of the type imported in this file
 * @param {*}       data - data needs to be saved on optionReducer
 * @returns {object}
 */
export const setData = (type, data) => {
  return {
    type: type,
    data
  };
};

// SHOW DATA ERROR
/**
 * setDataFailed is an action to show error message in the top right of the website
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const setDataFailed = (err, message) => {
  return {
    type: ADD_FLASH_MESSAGE,
    message: {
      type: 'error',
      text: message
    }
  };
};

// YEARS
/**
 * getYears is an action to set list of the years data
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getYears = () => {
  let years = [];

  for (var temp = year.max; temp >= year.min; temp--) {
    years.push(temp);
  }

  return {
    type: SET_YEARS,
    years
  };
};

// LINE MANAGERS
/**
 * getLineManagers is an action to get the list of line managers
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
export const getLineManagers = (search = '') => (dispatch) => {
  return axios
		.get('/api/users/line-managers' + ((!isEmpty(search) ? `?search=${search}` : '')))
		.then((res) => {
			return dispatch(setData(SET_LINE_MANAGERS, res.data.data));
		})
		.catch((err) => {
      return dispatch(setDataFailed(err, 'There is an error while retrieving line managers data'));
    });
}

// GET HQ
/**
 * getThirdPartyPermissions is an action to get the list of third party permissions data
 * @category Redux [Actions] - OptionActions
 * @returns {Promise}
 */
 export const getThirdPartyPermissions = () => {
  return (dispatch) => {
    axios
      .get('/api/third-party/permissions')
      .then((res) => {
        dispatch(setData(SET_THIRD_PARTY_PERMISSIONS, res.data.data));
      })
      .catch((err) => {
        dispatch(setDataFailed(err, 'There is an error while retrieving third party permissions data'));
      });
  };
};
