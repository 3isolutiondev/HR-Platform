import isEmpty from '../common/isEmpty';
import validator from 'validator';
import moment from 'moment'
import { validateRequirement } from '../HR/HRJobCategory';

export function validate(data) {
	let errors = {};

	data.jobStandard = !isEmpty(data.jobStandard) ? data.jobStandard : '';
	data.title = !isEmpty(data.title) ? data.title : '';
	data.duty_station = !isEmpty(data.duty_station) ? data.duty_station : '';
	data.ctr_start = !isEmpty(data.contract_start) ? moment(data.contract_start).format('YYYY-MM-DD') : '';
	data.ctr_end = !isEmpty(data.contract_end) ? moment(data.contract_end).format('YYYY-MM-DD') : '';
	const relationship = !isEmpty(data.relationship.value) ? data.relationship.value : '';
	data.mailing_address = !isEmpty(data.mailing_address) ? data.mailing_address : '';
	data.min_salary = !isEmpty(data.min_salary) ? data.min_salary.toString() : '';
	data.max_salary = !isEmpty(data.max_salary) ? data.max_salary.toString() : '';
	const is_international = !isEmpty(data.is_international) ? data.is_international.toString() : '';
	const is_shared = !isEmpty(data.is_shared) ? data.is_shared.toString() : '';
	const hq_us = !isEmpty(data.hq_us) ? data.hq_us : '';
	const hq_france = !isEmpty(data.hq_france) ? data.hq_france : '';
	const other_category = !isEmpty(data.other_category) ? data.other_category : '';

	if (data.with_template) {
		if (isEmpty(data.jobStandard)) {
			errors.jobStandard = 'Job standard is required';
		} else if (!validator.isInt(data.jobStandard.value.toString())) {
			errors.jobStandard = 'Invalid job standard data';
		}
		if (isEmpty(errors.jobStandard)) {
			if (isEmpty(data.jobCategory)) {
				errors.jobCategory = 'Job category is required';
			} else if (!validator.isInt(data.jobCategory.value.toString())) {
				errors.jobCategory = 'Invalid job category data';
			} else if (data.jobCategory.value == 0) {
				if (validator.isEmpty(other_category)) {
					errors.other_category = 'Job category name is required';
				}
			}
		}
	}

	if (isEmpty(data.jobLevel)) {
		errors.jobLevel = 'Job level is required';
	} else if (!validator.isInt(data.jobLevel.value.toString())) {
		errors.jobLevel = 'Invalid job level data';
	}

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 3 })) {
		errors.title = 'Title minimum 3 characters';
	}

	if (data.is_immap_inc == 0 && data.is_immap_france == 0) {
		errors.is_immap_inc = 'Choose one of 3iSolution Headquarter';
		errors.is_immap_france = 'Choose one of 3iSolution Headquarter';
	}

	if (data.jobStandard.sbp_recruitment_campaign != "yes") {
		if (validator.isEmpty(data.duty_station)) {
			errors.duty_station = 'Duty station is required';
		} else if (!validator.isLength(data.duty_station, { min: 3 })) {
			errors.duty_station = 'Duty station minimum 3 characters';
		}

		if (isEmpty(data.country)) {
			errors.country = 'Country is required';
		} else if (!validator.isInt(data.country.value.toString())) {
			errors.country = 'Invalid Country Data';
		}

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

		if (isEmpty(data.organization)) {
			errors.organization = 'Host Agency is required';
		}

		if(data.jobStandard.under_sbp_program === 'yes'){
			if (isEmpty(data.cluster_seconded)) {
				errors.cluster_seconded = 'Cluster Seconded is required';
			}
		}

		if (validator.isEmpty(data.min_salary)) {
			errors.min_salary = 'Minimum fees is required';
		} else if (!validator.isInt(data.min_salary)) {
			errors.min_salary = 'Invalid minimum fees data';
		}

		if (validator.isEmpty(data.max_salary)) {
			errors.max_salary = 'Maximum fees is required';
		} else if (!validator.isInt(data.max_salary)) {
			errors.max_salary = 'Invalid maximum fees data';
		}

		if (isEmpty(errors.min_salary) && isEmpty(errors.max_salary)) {
			if (parseInt(data.max_salary) < parseInt(data.min_salary)) {
			  errors.min_salary = errors.max_salary = "Please set the maximum fees at least the same amount with the minimum fees";
			}
		  }

		if (isEmpty(errors.contract_start) && isEmpty(errors.contract_end)) {
			if (moment(data.ctr_end).isBefore(data.ctr_start) || moment(data.ctr_end).isSame(data.ctr_start)) {
				errors.contract_start = errors.contract_end = "Please set the contract start earlier than the contract end";
			}
		}
	}

	if (data.jobStandard.sbp_recruitment_campaign == "no" && data.jobStandard.under_sbp_program == "no") {
		if (isEmpty(data.immap_office)) {
			errors.immap_office = 'iMMAP Office is required';
		} else if (!validator.isInt(data.immap_office.value.toString())) {
			errors.immap_office = 'Invalid iMMAP Office Data';
		}
	 }

	if (validator.isEmpty(relationship)) {
		errors.relationship = 'Status is required';
	} else if (!validator.isLength(relationship, { min: 3 })) {
		errors.relationship = 'Status minimum 3 characters';
	}

	if (isEmpty(data.sub_sections)) {
		errors.sub_sections = 'Sub section is required';
	} else if (!isEmpty(data.errors.sub_sections)) {
		errors.sub_sections = 'There is an error in one of your section';
	}

	if (isEmpty(data.matching_requirements)) {
		errors.matching_requirements = 'Matching requirement is required';
	} else {
		data.matching_requirements.map((match_requirement) => {
			const { isValid } = validateRequirement(match_requirement);

			if (!isValid) {
				errors.matching_requirements = 'There is an error in matching requirements value';
			}
		});
	}


	if (isEmpty(data.program_title)) {
		errors.program_title = 'Program Title is required';
	}

	if (isEmpty(data.duration)) {
		errors.duration = 'Type is required';
	} else if (!validator.isInt(data.duration.value.toString())) {
		errors.duration = 'Invalid Type Data';
	}

	if (validator.isEmpty(data.mailing_address)) {
		errors.mailing_address = 'Mailing Address is required';
	} else if (!validator.isLength(data.mailing_address, { min: 10 })) {
		errors.mailing_address = 'Mailing Address minimum 10 characters';
	}

	if (validator.isEmpty(is_international)) {
		errors.is_international = 'International Staff is required';
	} else if (!validator.isBoolean(is_international)) {
		errors.is_international = 'Invalid international staff data';
	}

	if (validator.isEmpty(is_shared)) {
		errors.is_shared = 'Shared cost is required';
	} else if (!validator.isBoolean(is_shared)) {
		errors.is_shared = 'Invalid shared cost data';
	}

	if (is_shared === 'true') {
		if (validator.isEmpty(hq_us)) {
			errors.hq_us = 'Cost Allocation is required';
		} else if (!validator.isInt(hq_us, { min: 1, max: 99 })) {
			errors.hq_us = 'Invalid Cost Allocation data';
		}

		if (validator.isEmpty(hq_france)) {
			errors.hq_france = 'Cost Allocation is required';
		} else if (!validator.isInt(hq_france, { min: 1, max: 99 })) {
			errors.hq_france = 'Invalid Cost Allocation data';
		}

		if (isEmpty(errors.hq_us) && isEmpty(errors.hq_france)) {
			const hq_us_percent = Number(hq_us);
			const hq_france_percent = Number(hq_france);

			if (hq_us_percent + hq_france_percent !== 100) {
				errors.hq_us = 'Total Cost Allocation should be 100';
				errors.hq_france = 'Total Cost Allocation should be 100';
			}
		}
	}

	if (!isEmpty(data.matching_errors)) {
		let empty = true;

		data.matching_errors.map((matchError) => {
			if (matchError.length > 0) {
				empty = false;
			}
		});

		if (!empty) {
			errors.matching_requirements = 'There is an error in matching requirements';
		}
	}

  if (!isEmpty(data.jobStandard)) {
    if ((data.jobStandard.sbp_recruitment_campaign === "yes" || data.jobStandard.under_sbp_program === "yes") && isEmpty(data.skillset)) {
      errors.skillset = "Skillset is required";
    }
  }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
