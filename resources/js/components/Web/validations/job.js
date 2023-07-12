import validator from 'validator';
import isEmpty from './common/isEmpty';

function validateJob(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.open_date = !isEmpty(data.opening_date) ? data.opening_date.format('YYYY-MM-DD') : '';
  data.close_date = !isEmpty(data.closing_date) ? data.closing_date.format('YYYY-MM-DD') : '';
  data.ctr_start = !isEmpty(data.contract_start) ? data.contract_start.format('YYYY-MM-DD') : '';
  data.ctr_end = !isEmpty(data.contract_end) ? data.contract_end.format('YYYY-MM-DD') : '';

  if (validator.isEmpty(data.title)) {
    errors.title = 'Job Title is required';
  } else if (!validator.isLength(data.title, { min: 3 })) {
    errors.title = 'Job Title minimum 3 characters';
  }

  if (isEmpty(data.status)) {
    errors.status = 'Status is required';
  }

  if (validator.isEmpty(data.open_date)) {
    errors.opening_date = 'Opening date is required';
  } else if (!validator.isISO8601(data.open_date)) {
    errors.opening_date = 'Invalid opening date format';
  }

  if (validator.isEmpty(data.close_date)) {
    errors.closing_date = 'Closing date is required';
  } else if (!validator.isISO8601(data.close_date)) {
    errors.closing_date = 'Invalid closing date format';
  }

  if (isEmpty(data.tor)) {
    errors.tor = 'ToR is required';
  } else if (!validator.isInt(data.tor.value.toString())) {
    errors.tor = 'Invalid ToR Data';
  }

  if (data.tor.sbp_recruitment_campaign === 'no') {
    if (validator.isEmpty(data.ctr_start)) {
      errors.contract_start = 'Contract start is required';
    } else if (!validator.isISO8601(data.ctr_start)) {
      errors.contract_start = 'Invalid contract start format';
    }

    if (validator.isEmpty(data.ctr_end)) {
      errors.contract_end = 'Contract end is required';
    } else if (!validator.isISO8601(data.ctr_end)) {
      errors.contract_end = 'Invalid contract end format';
    }

    if (isEmpty(data.country)) {
      errors.country = 'Country is required';
    } else if (!validator.isInt(data.country.value.toString())) {
      errors.country = 'Invalid Country Data';
    }
  }

  if (!Array.isArray(data.languages)) {
    errors.languages = 'Invalid language format';
  } else if (!data.languages.length || data.languages.length < 1) {
    errors.languages = 'Language is required';
  } else {
    data.languages.map((choosenLanguage, index) => {
      if (!validator.isIn(choosenLanguage.toString(), data.languages)) {
        errors.languages = 'Invalid language data';
      }
    });
  }

  if (data.tor.under_sbp_program == "no" && data.tor.sbp_recruitment_campaign === "no") {
    if (!Array.isArray(data.managers)) {
      errors.managers = 'Invalid managers format';
    } else if (!data.managers.length || data.managers.length < 1) {
      errors.managers = 'Manager is required';
    }
  }

  if (isEmpty(data.sub_sections)) {
    errors.sub_sections = 'Sub section is required';
  } else if (!isEmpty(data.errors.sub_sections)) {
    errors.sub_sections = 'There is an error in one of your section';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

export default validateJob;
