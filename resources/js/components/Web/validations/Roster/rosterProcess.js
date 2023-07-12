import validator from 'validator';
import isEmpty from '../common/isEmpty';
import striptags from 'striptags';
import { campaignYears, quarter } from '../../config/options';

export function validate(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.is_default = !isEmpty(data.is_default) ? data.is_default : '';
	data.description = !isEmpty(data.description) ? data.description : '';
	data.read_more_text = !isEmpty(data.read_more_text) ? data.read_more_text : '';

	if (validator.isEmpty(data.name)) {
		errors.name = 'Name is required';
	} else if (!validator.isLength(data.name, { min: 4 })) {
		errors.name = 'Name minimum 4 characters';
	}

	if (validator.isEmpty(data.is_default.toString())) {
		errors.is_default = 'Is Default is required';
	} else if (!validator.isIn(data.is_default.toString(), [ 1, 0 ])) {
		errors.is_default = 'Invalid is default data';
	}

	if (validator.isEmpty(data.description)) {
		errors.description = 'Description is required';
	} else if (!validator.isLength(striptags(data.description), { min: 10 })) {
		errors.description = 'Description minimum 10 characters';
  }

	if (validator.isEmpty(data.read_more_text)) {
		errors.read_more_text = 'Read More Text is required';
	} else if (!validator.isLength(striptags(data.read_more_text), { min: 10 })) {
		errors.read_more_text = 'Read More Text minimum 10 characters';
	}

  if (!isEmpty(data.under_sbp_program)) {
    if (data.under_sbp_program !== "yes" && data.under_sbp_program !== "no") {
      errors.under_sbp_program = `Invalid "Set as Roster Process under Surge Program" data`
    }

    if (data.under_sbp_program === "yes" && isEmpty(data.skillset)) {
      errors.skillset = "Skillset is required"
    }
  }

  // if (isEmpty(data.campaign_is_open)) {
  //   errors.campaign_is_open = `"Campaign is Open" is required`;
  // } else if (data.campaign_is_open !== "yes" && data.campaign_is_open !== "no") {
  //   errors.campaign_is_open = `Invalid "Campaign is Open" data`;
  // }

  // if (isEmpty(errors.campaign_is_open)) {
  //   if (data.campaign_is_open === "no") {
  //     if (isEmpty(data.campaign_open_at_quarter)) {
  //       errors.campaign_open_at_quarter = `"Next Opening Schedule (Quarter)" is required`;
  //     } else {
  //       const checkValidQuarter = quarter.find(value => value.value === data.campaign_open_at_quarter);
  //       if (!checkValidQuarter) {
  //         errors.campaign_open_at_quarter = `Invalid "Next Opening Schedule (Quarter)" data`
  //       }
  //     }
  //     if (isEmpty(data.campaign_open_at_year)) {
  //       errors.campaign_open_at_year = `"Next Opening Schedule (Year)" is required`;
  //     } else {
  //       const years = campaignYears();
  //       const checkValidYear =  years.find(value => value.value.toString() === data.campaign_open_at_year.toString());
  //       if (!checkValidYear) {
  //         errors.campaign_open_at_year = `Invalid "Next Opening Schedule (Year)" data`
  //       }
  //     }
  //   }
  // }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
