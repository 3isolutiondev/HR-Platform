import validator from 'validator';
import isEmpty from './common/isEmpty';

export function validate(data) {
  let errors = {};

  const first_name = !isEmpty(data.first_name) ? data.first_name : {};
  const last_name = !isEmpty(data.last_name) ? data.last_name : {};
  const position = !isEmpty(data.position) ? data.position : {};
  const paid_from = !isEmpty(data.paid_from) ? data.paid_from : {};
  const project_code = !isEmpty(data.project_code) ? data.project_code : {};
  const project_task = !isEmpty(data.project_task) ? data.project_task : {};
  const contract_start = !isEmpty(data.contract_start) ? data.contract_start.format('YYYY-MM-DD') : '';
  const contract_end = !isEmpty(data.contract_end) ? data.contract_end.format('YYYY-MM-DD') : '';
  const supervisor = !isEmpty(data.supervisor) ? data.supervisor : '';
  const unanet_approvers = !isEmpty(data.unanet_approvers) ? data.unanet_approvers : '';
  const hosting_agency = !isEmpty(data.hosting_agency) ? data.hosting_agency : '';
  const duty_station = !isEmpty(data.duty_station) ? data.duty_station : '';
  const home_based = !isEmpty(data.home_based) ? data.home_based : '';
  const monthly_rate = !isEmpty(data.monthly_rate) ? data.monthly_rate.toString() : '';
  const other = data.other;
  const other_text = !isEmpty(data.other_text) ? data.other_text : '';
  const cost_center = !isEmpty(data.cost_center) ? data.cost_center : '';
  const user = !isEmpty(data.user) ? data.user : '';
  const currency = !isEmpty(data.currency) ? data.currency : '';
  const immap_office = !isEmpty(data.immap_office) ? data.immap_office : '';

  if (isEmpty(first_name)) {
    errors.first_name = 'First Name is required';
  }

  if (isEmpty(last_name)) {
    errors.last_name = 'Last Name is required';
  }

  if (isEmpty(position)) {
    errors.position = 'Position is required';
  }

  if (isEmpty(paid_from)) {
    errors.paid_from = 'Paid From is required';
  }

  if (isEmpty(cost_center)) {
    errors.cost_center = 'Cost Center is required';
  }

  if (isEmpty(immap_office)) {
    errors.immap_office = 'iMMAP office is required';
  }

  if (isEmpty(project_code)) {
    errors.project_code = 'Project Code is required';
  }
  else if (!validator.isLength(project_code, { min: 3 })) {
    errors.project_code = 'Project Code minimum 3 characters';
  }

  if (!isEmpty(project_task)) {
    if (!validator.isLength(project_task, { min: 3 })) {
      errors.project_task = 'Project Task minimum 3 characters';
    }
  }

  if (validator.isEmpty(contract_start)) {
    errors.contract_start = 'Contract Start Date is required';
  } else if (!validator.isISO8601(contract_start)) {
    errors.contract_start = 'Invalid Contract Start Date format';
  }

  if (validator.isEmpty(contract_end)) {
    errors.contract_end = 'Contract End Date is required';
  } else if (!validator.isISO8601(contract_end)) {
    errors.contract_end = 'Invalid Contract End Date format';
  }

  if (isEmpty(supervisor)) {
    errors.supervisor = "Supervisor's Full Name is required";
  }

  if (isEmpty(unanet_approvers)) {
    errors.unanet_approvers = "Unanet Approver's Name is required";
  }

  if (!isEmpty(hosting_agency)) {
    if (!validator.isLength(hosting_agency, { min: 3 })) {
      errors.hosting_agency = 'Hosting Agency minimum 3 characters';
    }
  }

  if (isEmpty(duty_station)) {
    errors.duty_station = 'Duty Station is required';
  } else if (!validator.isLength(duty_station, { min: 3 })) {
    errors.duty_station = 'Duty Station minimum 3 characters';
  }

  if (isEmpty(home_based)) {
    errors.home_based = 'Home Based is required';
  }

  if (isEmpty(monthly_rate)) {
    errors.monthly_rate = 'Monthly Rate is required';
  } else if (!validator.isInt(monthly_rate)) {
    errors.monthly_rate = 'Invalid Monthly Rate data';
  }

  if (other) {
    if (isEmpty(other_text)) {
      errors.other_text = 'Other is required';
    } else if (!validator.isLength(other_text, { min: 3 })) {
      errors.other_text = 'Other minimum 3 characters';
    }
  }

  if (isEmpty(user)) {
    errors.user = "User is required";
  }

  if (isEmpty(currency)) {
    errors.currency = 'Currency is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
