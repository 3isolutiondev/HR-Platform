import validator from 'validator';
import moment from 'moment';
import isEmpty from './common/isEmpty';
import { store } from '../redux/store';
import { year, maritalStatus } from '../config/options';

export function validateBiodataAddressAndNationalities(data) {
	let errors = {};
	// data.permanent_address.permanent_address = !isEmpty(data.permanent_address.permanent_address)
	// 	? data.permanent_address.permanent_address
	// 	: '';
	// data.permanent_address.permanent_country = !isEmpty(data.permanent_address.permanent_country)
	// 	? data.permanent_address.permanent_country
	// 	: '';
	// data.permanent_address.permanent_city = !isEmpty(data.permanent_address.permanent_city)
	// 	? data.permanent_address.permanent_city
	// 	: '';
	// data.permanent_address.permanent_postcode = !isEmpty(data.permanent_address.permanent_postcode)
	// 	? data.permanent_address.permanent_postcode
	// 	: '';
	// data.permanent_address.permanent_telephone = !isEmpty(data.permanent_address.permanent_telephone)
	// 	? data.permanent_address.permanent_telephone
	// 	: '';
	// data.permanent_address.permanent_fax = !isEmpty(data.permanent_address.permanent_fax)
	// 	? data.permanent_address.permanent_fax
	// 	: '';

	data.office_telephone = !isEmpty(data.office_telephone) ? data.office_telephone : '';
	data.skype = !isEmpty(data.skype) ? data.skype : '';
	data.office_email = !isEmpty(data.office_email) ? data.office_email : '';

	data.accept_employment_less_than_six_month = !isEmpty(data.accept_employment_less_than_six_month)
		? data.accept_employment_less_than_six_month
		: '';

	// data.present_address.present_address = !isEmpty(data.present_address.present_address)
	// 	? data.present_address.present_address
	// 	: '';
	// data.present_address.present_country = !isEmpty(data.present_address.present_country)
	// 	? data.present_address.present_country
	// 	: '';
	// data.present_address.present_city = !isEmpty(data.present_address.present_city)
	// 	? data.present_address.present_city
	// : '';
	// data.present_address.present_postcode = !isEmpty(data.present_address.present_postcode)
	// 	? data.present_address.present_postcode
	// 	: '';
	// data.present_address.present_telephone = !isEmpty(data.present_address.present_telephone)
	// 	? data.present_address.present_telephone
	// 	: '';
	// data.present_address.present_fax = !isEmpty(data.present_address.present_fax)
	// 	? data.present_address.present_fax
	// 	: '';

	// if (!Array.isArray(data.present_nationalities)) {
	// 	errors.present_nationalities = 'Invalid present nationality format';
	// } else if (!data.present_nationalities.length || data.present_nationalities.length < 1) {
	// 	errors.present_nationalities = 'Present nationality is required';
	// } else {
	// 	data.present_nationalities.map((choosenNationality, index) => {
	// 		if (!validator.isIn(choosenNationality.toString(), store.getState().options.nationalities)) {
	// 			errors.present_nationalities = 'Invalid present nationality data';
	// 		}
	// 	});
	// }
	if (!Array.isArray(data.preferred_field_of_work)) {
		errors.preferred_field_of_work = 'Preferred Area of Expertise is required';
	} else if (data.preferred_field_of_work.length < 1) {
		errors.preferred_field_of_work = 'Preferred Area of Expertise is requireds';
	}

	if (!Array.isArray(data.preferred_sector)) {
		errors.preferred_sector = 'Preferred Sector is required';
	} else if (data.preferred_sector.length < 1) {
		errors.preferred_sector = 'Preferred Sector is requireds';
	}

	if (validator.isEmpty(data.accept_employment_less_than_six_month.toString())) {
		errors.accept_employment_less_than_six_month = 'Accept Employment Less than Six Month is required';
	} else if (!validator.isBoolean(data.accept_employment_less_than_six_month.toString())) {
		errors.accept_employment_less_than_six_month = 'Invalid data format';
	}

	if (!validator.isBoolean(data.objections_making_inquiry_of_present_employer.toString())) {
		errors.objections_making_inquiry_of_present_employer = 'Invalid data format';
	}

	// if (validator.isEmpty(data.permanent_address.permanent_address)) {
	// 	errors.permanent_address = 'Permanent Address is required';
	// } else if (!validator.isLength(data.permanent_address.permanent_address, { min: 20 })) {
	// 	errors.permanent_address = 'Permanent Address minimum 20 characters';
	// }

	// if (isEmpty(data.permanent_address.permanent_country)) {
	// 	errors.permanent_country = 'Permanent Country is required';
	// } else if (!validator.isInt(data.permanent_address.permanent_country.value.toString())) {
	// 	errors.permanent_country = 'Invalid Permanent Country Data';
	// }

	// if (validator.isEmpty(data.permanent_address.permanent_city)) {
	// 	errors.permanent_city = 'Permanent City is required';
	// } else if (!validator.isLength(data.permanent_address.permanent_city, { min: 2 })) {
	// 	errors.permanent_city = 'Permanent City minimum 2 characters';
	// }

	// if (validator.isEmpty(data.permanent_address.permanent_postcode)) {
	// 	errors.permanent_postcode = 'Permanent Postcode is required';
	// } else if (!validator.isLength(data.permanent_address.permanent_postcode, { min: 3 })) {
	// 	errors.permanent_postcode = 'Permanent Postcode minimum 3 characters';
	// }

	// if (validator.isEmpty(data.permanent_address.permanent_telephone)) {
	// 	errors.permanent_telephone = 'Permanent Telephone is required';
	// }

	// if (data.sameWithPermanent === false) {
	// if (validator.isEmpty(data.present_address.present_address)) {
	// 	errors.present_address = 'Present Address is required';
	// } else if (!validator.isLength(data.present_address.present_address, { min: 20 })) {
	// 	errors.present_address = 'Present Address minimum 20 characters';
	// }

	// if (isEmpty(data.present_address.present_country)) {
	// 	errors.present_country = 'Present Country is required';
	// } else if (!validator.isInt(data.present_address.present_country.value.toString())) {
	// 	errors.present_country = 'Invalid Present Country Data';
	// }

	// if (validator.isEmpty(data.present_address.present_city)) {
	// 	errors.present_city = 'Present City is required';
	// } else if (!validator.isLength(data.present_address.present_city, { min: 2 })) {
	// 	errors.present_city = 'Present City minimum 2 characters';
	// }

	// if (validator.isEmpty(data.present_address.present_postcode)) {
	// 	errors.present_postcode = 'Present Postcode is required';
	// } else if (!validator.isLength(data.present_address.present_postcode, { min: 3 })) {
	// 	errors.present_postcode = 'Present Postcode minimum 3 characters';
	// }

	// if (validator.isEmpty(data.present_address.present_telephone)) {
	// 	errors.present_telephone = 'Present Telephone is required';
	// } else if (!validator.isLength(data.present_address.present_telephone, { min: 6 })) {
	// 	errors.present_telephone = 'Present Telephone minimum 6 characters';
	// }

	// if (validator.isEmpty(data.present_address.present_fax)) {
	// 	if (!validator.isLength(data.present_address.present_fax, { min: 6 })) {
	// 		errors.present_fax = 'Present Fax minimum 6 characters';
	// 	}
	// }
	// }

	if (!validator.isEmpty(data.office_email)) {
		if (!validator.isEmail(data.office_email)) {
			errors.office_email = 'Invalid office email format';
		}
	}

	if (
		data.objections_making_inquiry_of_present_employer === '1' ||
		data.objections_making_inquiry_of_present_employer === 1
	) {
		if (validator.isEmpty(data.objection_email)) {
			errors.objection_email = 'Email is required';
		} else if (!validator.isEmail(data.objection_email)) {
			errors.objection_email = 'Invalid email address';
		}

		if (validator.isEmpty(data.objection_name)) {
			errors.objection_name = 'Name is required';
		} else if (!validator.isLength(data.objection_name, { min: 5 })) {
			errors.objection_name = ' Name minimum 5 characters';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateBiodata(data) {
	let errors = {};

	const first_name = !isEmpty(data.first_name) ? data.first_name : '';
	const middle_name = !isEmpty(data.middle_name) ? data.middle_name : '';
	const family_name = !isEmpty(data.family_name) ? data.family_name : '';
	// const maiden_name = !isEmpty(data.maiden_name) ? data.maiden_name : '';
	// const bdate = !isEmpty(data.bdate) ? data.bdate.toString() : '';
	// const bmonth = !isEmpty(data.bmonth) ? data.bmonth.toString() : '';
	// const byear = !isEmpty(data.byear) ? data.byear.toString() : '';
	// const place_of_birth = !isEmpty(data.place_of_birth) ? data.place_of_birth : '';

	const gender = !isEmpty(data.gender) ? data.gender.toString() : '';
	// const become_roster = !isEmpty(data.become_roster) ? data.become_roster.toString() : '';
	// const marital_status = !isEmpty(data.marital_status) ? data.marital_status : '';
	const linkedin_url = !isEmpty(data.linkedin_url) ? data.linkedin_url : '';
  const present_nationalities = !isEmpty(data.present_nationalities) ? data.present_nationalities : [];
  const country_residence = !isEmpty(data.country_residence.value) ? data.country_residence.value : '';

	if (validator.isEmpty(first_name)) {
		errors.first_name = 'First name is required';
	} else if (!validator.isLength(first_name, { min: 3 })) {
		errors.first_name = 'First name minimum 3 characters';
	}

	if (!validator.isEmpty(middle_name)) {
		if (!validator.isLength(middle_name, { min: 3 })) {
			errors.middle_name = 'Middle name minimum 3 characters';
		}
	}

	if (validator.isEmpty(family_name)) {
		errors.family_name = 'Family name is required';
	} else if (!validator.isLength(family_name, { min: 3 })) {
		errors.family_name = 'Family name minimum 3 characters';
	}

	// if (!validator.isEmpty(maiden_name)) {
	// 	if (!validator.isLength(maiden_name, { min: 3 })) {
	// 		errors.maiden_name = 'Maiden name minimum 3 characters';
	// 	}
	// }

	// if (validator.isEmpty(bdate)) {
	// 	errors.bdate = 'Birth date is required';
	// } else if (!validator.isInt(bdate, { min: 1, max: 31, allow_leading_zeroes: true })) {
	// 	errors.bdate = 'Birth date should be integer and between 1 - 31';
	// }

	// if (validator.isEmpty(bmonth)) {
	// 	errors.bmonth = 'Birth month is required';
	// } else if (!validator.isInt(bmonth, { min: 1, max: 12, allow_leading_zeroes: true })) {
	// 	errors.bmonth = 'Invalid birth month format';
	// }

	// if (validator.isEmpty(byear)) {
	// 	errors.byear = 'Birth year is required';
	// } else if (!validator.isInt(byear, { min: year.min, max: year.max })) {
	// 	errors.byear = 'Birth year should be integer and between ' + year.min + ' - ' + year.max;
	// }

	// if (bdate && bmonth && byear) {
	// 	if (!moment(byear + '-' + bmonth + '-' + bdate).isValid()) {
	// 		errors.bdate = 'Invalid date format';
	// 		errors.bmonth = 'Invalid date format';
	// 		errors.byear = 'Invalid date format';
	// 	} else if (moment().diff(byear + '-' + bmonth + '-' + bdate, 'years') < 18) {
	// 		errors.bdate = 'you are under 18 years old';
	// 		errors.bmonth = 'you are under 18 years old';
	// 		errors.byear = 'you are under 18 years old';
	// 	}
	// }

	// if (validator.isEmpty(place_of_birth)) {
	// 	errors.place_of_birth = 'Place of birth is required';
	// } else if (!validator.isLength(place_of_birth, { min: 3 })) {
	// 	errors.place_of_birth = 'Place of birth minimum 3 characters';
	// }

	if (validator.isEmpty(gender)) {
		errors.gender = 'Gender is required';
	} else if (!validator.isIn(gender, [0, 1, 2, 3])) {
		errors.gender = 'Invalid gender format';
	}

	// if (validator.isEmpty(become_roster)) {
	// 	errors.become_roster = 'Agree roster member is required';
	// } else if (!validator.isIn(become_roster, [ 0, 1 ])) {
	// 	errors.become_roster = 'Invalid roster member format';
	// }

	// if (validator.isEmpty(marital_status)) {
	// 	errors.marital_status = 'Marital status is required';
	// } else if (!validator.isIn(marital_status, maritalStatus)) {
	// 	errors.marital_status = 'Invalid marital status format';
	// }

	if (!isEmpty(linkedin_url)) {
		// errors.linkedin_url = 'Linkedin Profile is required';
		if (
			!/(?:(?:http|https):\/\/)?(?:www.)?linkedin.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/.test(
				linkedin_url
			) &&
			!isEmpty(linkedin_url)
		) {
			errors.linkedin_url = 'valid linkedin url';
		}
	}

	// if (!Array.isArray(present_nationalities)) {
	// 	errors.present_nationalities = 'Invalid nationality format';
	// } else if (!present_nationalities.length || present_nationalities.length < 1) {
	// 	errors.present_nationalities = 'Nationality is required';
	// } else {
	// 	present_nationalities.map((choosenNationality, index) => {
	// 		if (!validator.isIn(choosenNationality.toString(), store.getState().options.nationalities)) {
	// 			errors.present_nationalities = 'Invalid nationality data';
	// 		}
	// 	});
  // }

  if (isEmpty(country_residence)) {
    errors.country_residence = "Country of Residence is required"
  }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateRelevanFacts(data) {
	let errors = {};

	if (!validator.isEmpty(data.relevant_facts)) {
		if (!validator.isLength(data.relevant_facts, { min: 3 })) {
			errors.relevant_facts = 'Other Relevant Facts minimum 3 characters';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateLegalStep(data) {
	let errors = {};

	data.legal_step_changing_present_nationality = !isEmpty(data.legal_step_changing_present_nationality)
		? data.legal_step_changing_present_nationality
		: '';

	data.legal_step_changing_present_nationality_explanation = !isEmpty(
		data.legal_step_changing_present_nationality_explanation
	)
		? data.legal_step_changing_present_nationality_explanation
		: '';

	if (validator.isEmpty(data.legal_step_changing_present_nationality.toString())) {
		errors.legal_step_changing_present_nationality =
			'Have you taken any legal steps towards changing your present nationality is required';
	} else if (!validator.isBoolean(data.legal_step_changing_present_nationality.toString())) {
		errors.legal_step_changing_present_nationality = 'Invalid data format';
	}
	if (
		validator.isEmpty(data.legal_step_changing_present_nationality_explanation) &&
		data.legal_step_changing_present_nationality.toString() === '1'
	) {
		errors.legal_step_changing_present_nationality_explanation = 'You should fill the explanation field';
	} else if (
		!validator.isLength(data.legal_step_changing_present_nationality_explanation, { min: 20 }) &&
		data.legal_step_changing_present_nationality.toString() === '1'
	) {
		errors.legal_step_changing_present_nationality_explanation = 'Explanation should be at least 20 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateLegalPermanentResidence(data) {
	let errors = {};

	if (
		parseInt(data.legal_permanent_residence_status_counts) < 1 &&
		data.legal_permanent_residence_status.toString() === '1'
	) {
		if (data.legal_permanent_residence_status_countries) {
			if (!Array.isArray(data.legal_permanent_residence_status_countries)) {
				errors.legal_permanent_residence_status_countries = 'Invalid Country List format';
			} else if (
				!data.legal_permanent_residence_status_countries.length &&
				data.legal_permanent_residence_status_countries.length < 1
			) {
				errors.legal_permanent_residence_status_countries = 'Country List is required';
			} else {
				data.legal_permanent_residence_status_countries.map((country, index) => {
					if (!validator.isIn(country.toString(), store.getState().options.nationalities)) {
						errors.legal_permanent_residence_status_countries = 'Invalid country list data';
					}
				});
			}
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateDisabilities(data) {
	let errors = {};

	const has_disabilities = !isEmpty(data.has_disabilities) ? data.has_disabilities.toString() : '';
	const disabilities = !isEmpty(data.disabilities) ? data.disabilities : '';

	if (has_disabilities === '0') {
		if (validator.isEmpty(disabilities)) {
			errors.disabilities = 'Please fill this field';
		} else if (!validator.isLength(disabilities, { min: 10 })) {
			errors.disabilities = 'Please fill this field at least 10 characters';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
