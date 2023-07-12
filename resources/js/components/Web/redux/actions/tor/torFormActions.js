/** import axios and momentjs */
import axios from 'axios';
import moment from 'moment';

/** import types needed */
import { SET_TOR_FORM_DATA, RESET_TOR_FORM, CHECK_ERROR_TOR_FORM } from '../../types/tor/torFormTypes';

/** import other redux actions needed */
import { addFlashMessage } from '../../actions/webActions';

/** import configuration value, validation and utils helper */
import isEmpty from '../../../validations/common/isEmpty';
import { statusOptions } from '../../../config/options';
import { pluck } from '../../../utils/helper';
import textSelector from "../../../utils/textSelector";

/**
 * onChange is an action to save state data in torFormReducer
 * @category Redux [Actions] - ToRFormActions
 * @param {string} name - name of the object key inside initailState
 * @param {*} value
 * @returns {Promise}
 */
export const onChange = (name, value) => (dispatch, getState) => {
    dispatch({
        type: SET_TOR_FORM_DATA,
        name,
        value
    });
    return Promise.resolve(getState())
};

/**
 * onReset is an action to reset ToR state data in torFormReducer
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const onReset = () => (dispatch, getState) => {
    dispatch({
        type: RESET_TOR_FORM
    });
};

/**
 * getLevels is an action to get job level data
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const getLevels = () => (dispatch, getState) => {
    let { jobLevelURL } = getState().torForm;
    return axios
        .get(jobLevelURL)
        .then((res) => {
            if (res.status == 200) {
                dispatch(onChange('jobLevels', res.data.data));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving job levels'
                })
            );
        });
};

/**
 * getDurations is an action to get durations data
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const getDurations = () => (dispatch, getState) => {
    let { durationsURL } = getState().torForm;
    return axios
        .get(durationsURL)
        .then((res) => {
            if (res.status == 200) {
                dispatch(onChange('durations', res.data.data));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving durations'
                })
            );
        });
};

/**
 * getJobStandards is an action to get the list of job standard
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const getJobStandards = () => (dispatch, getState) => {
    let { jobStandardURL } = getState().torForm;
    return axios
        .get(jobStandardURL + '/all-options')
        .then((res) => {
            if (res.status == 200) {
                dispatch(onChange('jobStandards', res.data.data));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving job standarts'
                })
            );
        });
};

/**
 * getMailingAddress is an action to get mailing address data
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const getMailingAddress = () => (dispatch, getState) => {
    let { mailingAddressURL } = getState().torForm;
    axios
        .get(mailingAddressURL)
        .then((res) => {
            if (res.status == 200) {
                dispatch(onChange('mailing_address', res.data.data));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving mailing address'
                })
            );
        });
    return Promise.resolve(getState())
};

/**
 * getFormData is an action to retrieve ToR data
 * @category Redux [Actions] - ToRFormActions
 * @returns {Promise}
 */
export const getFormData = () => (dispatch, getState) => {
    let { apiURL } = getState().torForm;
    dispatch(onChange("loading", true));
    axios
        .get(apiURL)
        .then((res) => {
            if (res.status == 200) {
                const {
                    id,
                    title,
                    with_template,
                    job_standard,
                    job_category,
                    job_level,
                    duty_station,
                    country,
                    immap_office,
                    organization,
                    relationship,
                    contract_start,
                    contract_end,
                    sub_sections,
                    mailing_address,
                    duration,
                    program_title,
                    matching_requirements,
                    min_salary,
                    max_salary,
                    is_immap_inc,
                    is_immap_france,
                    is_international,
                    hq_us,
                    hq_france,
                    other_category,
                    is_shared,
                    skillset,
                    cluster_seconded,
                    cluster
                } = res.data.data;
                dispatch(onChange("loading", false))
                if (with_template == 1) {
                    dispatch(getCategories(job_standard.id));
                }

                if (organization == 'iMMAP') {
                    dispatch(onChange('is_organization', 0));
                } else {
                    dispatch(onChange('is_organization', 1));
                }

                let setRelationship = '';
                if (!isEmpty(relationship)) {
                    let relations = pluck(statusOptions, 'value');
                    const relExits = relations.find((relation) => {
                        return relation == relationship;
                    });

                    setRelationship = isEmpty(relExits) ? '' : { value: relationship, label: relationship };
                }
                dispatch(onChange('id', id));
                dispatch(onChange('with_template', with_template));
                dispatch(onChange('jobStandard', !isEmpty(job_standard) ? {
                  value: job_standard.id,
                  label: job_standard.name,
                  under_sbp_program: job_standard.under_sbp_program,
                  sbp_recruitment_campaign: job_standard.sbp_recruitment_campaign
                } : ''));
                dispatch(onChange('jobCategory', !isEmpty(job_category) ? { value: job_category.id, label: job_category.name } : { value: 0, label: 'Other' }));
                dispatch(onChange('jobLevel', { value: job_level.id, label: job_level.name }));
                dispatch(onChange('skillset', skillset));
                dispatch(onChange('contract_start', moment(contract_start)));
                dispatch(onChange('contract_end', moment(contract_end)));
                dispatch(onChange('duty_station', duty_station));
                dispatch(onChange('country', country ? { value: country.id, label: country.name } : ''));
                dispatch(onChange('immap_office', !isEmpty(immap_office) ? { value: immap_office.id, label: immap_office.country.name + ' - (' + immap_office.city + ')' } : ''));
                dispatch(onChange('title', title));
                dispatch(onChange('relationship', setRelationship));
                dispatch(onChange('sub_sections', sub_sections));
                dispatch(onChange('organization', { value: organization, label: organization }));
                // KEEP THIS SELECT FIELD UNTIL WE WORKING ON THE FLOW OF CLUSTER/SECTOR USER STORY
                // dispatch(onChange('cluster_seconded', cluster_seconded ? {value: cluster_seconded, label: cluster_seconded} : ''));
                dispatch(onChange('cluster_seconded', cluster_seconded));
                dispatch(onChange('cluster', cluster));
                dispatch(onChange('mailing_address', isEmpty(mailing_address) ? '' : mailing_address));
                dispatch(onChange('program_title', program_title));
                dispatch(onChange('duration', duration));
                dispatch(onChange('min_salary', min_salary));
                dispatch(onChange('max_salary', max_salary));
                dispatch(onChange('is_immap_inc', is_immap_inc));
                dispatch(onChange('is_immap_france', is_immap_france));
                dispatch(onChange('is_international', is_international));
                dispatch(onChange('is_shared', is_shared == 1 ? true : false));
                dispatch(onChange('hq_us', hq_us));
                dispatch(onChange('hq_france', hq_france));
                dispatch(onChange('other_category', other_category));
                dispatch(onChange('other_category_open', !isEmpty(job_category) ? false : true));
                dispatch(onChange('matching_requirements', matching_requirements));
                dispatch(onChange('loading', false));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving form data'
                })
            );
        });
    return Promise.resolve(getState())
};

/**
 * getCategories is an action get job category data
 * @category Redux [Actions] - ToRFormActions
 * @param {number} standardValue - job standard id
 * @returns {Promise}
 */
export const getCategories = (standardValue) => (dispatch, getState) => {
    let { jobStandardURL } = getState().torForm;
    return axios
        .get(jobStandardURL + '/tor-options/' + standardValue)
        .then((res) => {
            if (res.status == 200) {
                let jobCat = JSON.parse(JSON.stringify(res.data.data));
                jobCat.push({ value: 0, label: 'Other' });
                dispatch(onChange('jobCategories', jobCat));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving job category'
                })
            );
        });
};

/**
 * getMatching is an action to get matching requirements and sub sections data
 * @category Redux [Actions] - ToRFormActions
 * @param {number} value - job category id
 * @returns {Promise}
 */
export const getMatching = (value) => (dispatch, getState) => {
    let { jobCategoryURL } = getState().torForm;
    return axios
        .get(jobCategoryURL + '/tor-parameters/' + value)
        .then((res) => {
            if (res.status == 200) {
                const { matching_requirements, sub_sections } = res.data.data;
                dispatch(onChange('matching_requirements', matching_requirements));
                dispatch(onChange('sub_sections', sub_sections));
            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'There is an error while retrieving Matching Parameters'
                })
            );
        });
};

/**
 * onSubmit is an action to submit ToR data in torFormReducer
 * @category Redux [Actions] - ToRFormActions
 * @param {Object} history - history from react-router-dom
 * @returns {Promise}
 */
export const onSubmit = (history) => (dispatch, getState) => {
    let { country,
        with_template,
        jobStandard,
        jobCategory,
        jobLevel,
        title,
        duty_station,
        immap_office,
        contract_start,
        contract_end,
        organization,
        relationship,
        mailing_address,
        sub_sections,
        matching_requirements,
        duration,
        program_title,
        min_salary,
        max_salary,
        is_immap_inc,
        is_immap_france,
        is_international,
        is_shared,
        hq_us,
        hq_france,
        other_category,
        isEdit,
        apiURL,
        redirectURL,
        skillset,
        cluster_seconded,
        cluster
    } = getState().torForm;

    let recordData = {
        with_template,
        job_standard_id: jobStandard.value,
        job_category_id: jobCategory.value,
        job_level_id: jobLevel.value,
        title,
        duty_station,
        country_id: country.value,
        immap_office_id: immap_office.value,
        contract_start: moment(contract_start).format('YYYY-MM-DD'),
        contract_end: moment(contract_end).format('YYYY-MM-DD'),
        contract_length: Math.ceil(moment(contract_end).diff(moment(contract_start), 'months', true)),
        organization: isEmpty(organization.value) ? 'iMMAP' : organization.value,
        relationship: isEmpty(relationship.value) ? '' : relationship.value,
        mailing_address: mailing_address,
        sub_sections,
        matching_requirements,
        duration_id: duration.value,
        program_title,
        min_salary,
        max_salary,
        is_immap_inc,
        is_immap_france,
        is_international,
        is_shared: is_shared ? 1 : 0,
        hq_us,
        hq_france,
        other_category: jobCategory.value == 0 ? other_category : '',
        skillset,
        // KEEP THIS SELECT FIELD UNTIL WE WORKING ON THE FLOW OF CLUSTER/SECTOR USER STORY
        // cluster_seconded: cluster_seconded ? cluster_seconded.value : '',
        cluster_seconded,
        cluster
    };

    if (isEdit) {
        recordData._method = 'PUT';
    }
    dispatch(onChange('isLoading', true));
    return axios
        .post(apiURL, recordData)
        .then((res) => {
            if (res.status == 200) {
                const { status, message } = res.data;
                dispatch(onChange('isLoading', false))
                dispatch(addFlashMessage({
                    type: status,
                    text: message
                }));
                dispatch(onReset());
                if (!isEdit) {
                    history.push(redirectURL);
                }else{
                    history.push('/tor');
                }

            }
        })
        .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: 'Please check error on the form'
                })
            );
        });
};

/**
 * checkError is an action to save errors and valid state data in torFormReducer
 * @category Redux [Actions] - ToRFormActions
 * @param {Object} error  - error data of the form
 * @param {Boolean} valid - is the form valid?
 * @returns {Promise}
 */
export const checkError = (error, valid) => {
    return {
        type: CHECK_ERROR_TOR_FORM,
        error,
        valid
    };
};

/**
* duplicateToR is an action to duplicate ToR from an existing one
* @category Redux [Actions] - ToRFormActions
* @param {number} torID - ToR id
* @param {Object} history - history from react-router-dom
* @returns {Promise}
 */
export const duplicateToR = (torID, history) => (dispatch, getState) => {
    dispatch(onChange("duplicatingLoading", true));
    return axios.get('/api/tor/' + torID + '/duplicate')
          .then((res) => {
              const newTorID = res.data.data.id;
              const title = res.data.data.title;
              dispatch(onChange('duplicatingLoading', false));
              dispatch(onChange("apiURL", '/api/tor/' + newTorID));
			  dispatch(onChange("id", newTorID));
              dispatch(onChange("redirectURL", '/tor/' + newTorID + '/edit'));
              history.push('/tor/' + newTorID + '/edit');
              dispatch(
                addFlashMessage({
                    type: 'success',
                    text: `The ToR ${title} has been Successfully duplicated and you have been redirected to the new one`
                })
            );
          })
          .catch((err) => {
            dispatch(
                addFlashMessage({
                    type: 'error',
                    text: textSelector('error', 'torDuplicationError')
                })
            );
      });
  }
