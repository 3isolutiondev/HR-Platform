import validator from "validator";
import moment from "moment";
import isEmpty from "./common/isEmpty";
import { year } from "../config/options";
import { store } from "../redux/store";

export function validateP11Form1(data) {
  let errors = {};

  const first_name = !isEmpty(data.first_name) ? data.first_name : "";
  const middle_name = !isEmpty(data.middle_name) ? data.middle_name : "";
  const family_name = !isEmpty(data.family_name) ? data.family_name : "";
  // const maiden_name = !isEmpty(data.maiden_name) ? data.maiden_name : '';
  // const bdate = !isEmpty(data.bdate) ? data.bdate.toString() : '';
  // const bmonth = !isEmpty(data.bmonth) ? data.bmonth.toString() : '';
  // const byear = !isEmpty(data.byear) ? data.byear.toString() : '';
  // const place_of_birth = !isEmpty(data.place_of_birth) ? data.place_of_birth : '';
  // const present_nationalities = !isEmpty(data.present_nationalities) ? data.present_nationalities : '';
  // const birth_nationalities = !isEmpty(data.birth_nationalities) ? data.birth_nationalities : '';

  const gender = !isEmpty(data.gender) ? data.gender.toString() : "";
  // const marital_status = !isEmpty(data.marital_status) ? data.marital_status : '';
  // const has_disabilities = !isEmpty(data.has_disabilities) ? data.has_disabilities.toString() : '';
  // const disabilities = !isEmpty(data.disabilities) ? data.disabilities : '';

  const is_immaper = !isEmpty(data.is_immaper)
    ? data.is_immaper.toString()
    : "";
  const immap_contract_international = !isEmpty(
    data.immap_contract_international
  )
    ? data.immap_contract_international.toString()
    : "";
  const immap_email = !isEmpty(data.immap_email) ? data.immap_email : "";
  const immap_office = !isEmpty(data.immap_office) ? data.immap_office : "";
  const is_immap_inc = !isEmpty(data.is_immap_inc) ? data.is_immap_inc : "";
  const is_immap_france = !isEmpty(data.is_immap_france)
    ? data.is_immap_france
    : "";
  // const project = !isEmpty(data.project) ? data.project : '';
  const job_title = !isEmpty(data.job_title) ? data.job_title : "";
  const duty_station = !isEmpty(data.duty_station) ? data.duty_station : "";
  const line_manager = !isEmpty(data.line_manager) ? data.line_manager : "";
  const start_of_current_contract = !isEmpty(data.start_of_current_contract)
    ? data.start_of_current_contract
    : "";
  const end_of_current_contract = !isEmpty(data.end_of_current_contract)
    ? data.end_of_current_contract
    : "";

    data.country_residence = !isEmpty(data.country_residence)
    ? data.country_residence
    : "";
   data.office_telephone = !isEmpty(data.office_telephone)
    ? data.office_telephone
    : "";
   // data.office_fax = !isEmpty(data.office_fax) ? data.office_fax : '';
   data.office_email = !isEmpty(data.office_email) ? data.office_email : "";

  if (!Array.isArray(data.phones)) {
    errors.phone_counts = "Invalid Phone Data";
  } else if (data.phones.length < 1) {
    errors.phone_counts = "Phone Number is required, please fill the list";
  }

  if (validator.isEmpty(first_name)) {
    errors.first_name = "First name is required";
  } else if (!validator.isLength(first_name, { min: 3 })) {
    errors.first_name = "First name minimum 3 characters";
  }

  if (!validator.isEmpty(middle_name)) {
    if (!validator.isLength(middle_name, { min: 3 })) {
      errors.middle_name = "Middle name minimum 3 characters";
    }
  }

  if (validator.isEmpty(family_name)) {
    errors.family_name = "Surname is required";
  } else if (!validator.isLength(family_name, { min: 3 })) {
    errors.family_name = "Surname minimum 3 characters";
  }

  if (isEmpty(data.country_residence)) {
    errors.country_residence = "Country of Residence is required";
  } else if (!validator.isInt(data.country_residence.value.toString())) {
    errors.country_residence = "Invalid Country of Residence Data";
  }

  if (!validator.isEmpty(data.office_email)) {
    if (!validator.isEmail(data.office_email)) {
      errors.office_email = "Invalid office email format";
    }
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

  // if (data.birth_nationalities) {
  // 	if (!Array.isArray(data.birth_nationalities)) {
  // 		errors.birth_nationalities = 'Invalid birth nationality format';
  // 	} else if (!data.birth_nationalities.length && data.birth_nationalities.length < 1) {
  // 		errors.birth_nationalities = 'Birth nationality is required';
  // 	} else {
  // 		data.birth_nationalities.map((country, index) => {
  // 			if (!validator.isIn(country.toString(), store.getState().options.nationalities)) {
  // 				errors.birth_nationalities = 'Invalid birth nationality data';
  // 			}
  // 		});
  // 	}
  // }

  if (data.present_nationalities) {
    if (!Array.isArray(data.present_nationalities)) {
      errors.present_nationalities = "Invalid present nationality format";
    } else if (
      !data.present_nationalities.length &&
      data.present_nationalities.length < 1
    ) {
      errors.present_nationalities = "Present nationality is required";
    } else {
      data.present_nationalities.map((country, index) => {
        if (
          !validator.isIn(
            country.toString(),
            store.getState().options.nationalities
          )
        ) {
          errors.present_nationalities = "Invalid birth nationality data";
        }
      });
    }
  }

  // if (!Array.isArray(data.birth_nationalities)) {
  // 	errors.birth_nationalities = 'Invalid birth nationality format';
  // } else if (!data.birth_nationalities.length && data.birth_nationalities.length < 1) {
  // 	errors.birth_nationalities = 'Birth nationality is required';
  // } else if (data.birth_nationalities.length > 1) {
  // 	errors.birth_nationalities = 'Invalid birth nationality datas';
  // } else {
  // 	data.birth_nationalities.map((choosenNationality, index) => {
  // 		if (!validator.isIn(choosenNationality.toString(), store.getState().options.nationalities)) {
  // 			errors.birth_nationalities = 'Invalid birth nationality data';
  // 		}
  // 	});
  // }

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

  if (validator.isEmpty(gender) || gender === "empty") {
    errors.gender = "Gender is required";
  } else if (!validator.isIn(gender, [0, 1, 2, 3])) {
    errors.gender = "Invalid gender format";
  }

  // if (validator.isEmpty(marital_status)) {
  // 	errors.marital_status = 'Marital status is required';
  // } else if (!validator.isIn(marital_status, maritalStatus)) {
  // 	errors.marital_status = 'Invalid marital status format';
  // }

  // if (validator.isEmpty(has_disabilities)) {
  // 	errors.has_disabilities =
  // 		'Disabilities to limit your prospective area of expertise or your ability to engage in air travel is required';
  // } else if (!validator.isBoolean(has_disabilities)) {
  // 	errors.has_disabilities = 'Invalid data format';
  // }

  // if (has_disabilities === '0') {
  // 	if (validator.isEmpty(disabilities)) {
  // 		errors.disabilities = 'Please fill this field';
  // 	} else if (!validator.isLength(disabilities, { min: 10 })) {
  // 		errors.disabilities = 'Please fill this field at least 10 characters';
  // 	}
  // }

  if (validator.isEmpty(is_immaper)) {
    errors.is_immaper = "Already iMMAPer is required";
  } else if (!validator.isBoolean(is_immaper)) {
    errors.is_immaper = "Invalid data format";
  }

  if (is_immaper === "1") {
   	if (!validator.isEmpty(immap_email)) {
		  if (!validator.isEmail(immap_email)) {
			  errors.immap_email = 'Invalid email address';
		  } else if (!/@organization.org*$/.test(immap_email)) {
		  	errors.immap_email = 'Invalid iMMAP email address';
		}
	}

    if (validator.isEmpty(job_title)) {
      errors.job_title = "Job Title is required";
    }

    if (validator.isEmpty(duty_station)) {
      errors.duty_station = "Duty Station is required";
    }

    if (validator.isEmpty(line_manager)) {
      errors.line_manager = "Line Manager is required";
    }

    if (validator.isEmpty(start_of_current_contract)) {
      errors.start_of_current_contract =
        "Start of current contract is required";
    } else if (!validator.isISO8601(start_of_current_contract)) {
      errors.start_of_current_contract = "Invalid date format";
    }

    if (validator.isEmpty(end_of_current_contract)) {
      errors.end_of_current_contract = "End of current contract is required";
    } else if (!validator.isISO8601(end_of_current_contract)) {
      errors.end_of_current_contract = "Invalid date format";
    }

    if (
      isEmpty(errors.start_of_current_contract) &&
      isEmpty(errors.end_of_current_contract)
    ) {
      const start_date = moment(start_of_current_contract);
      const end_date = moment(end_of_current_contract);

      const duration = moment.duration(end_date.diff(start_date));
      const days = duration.asDays();

      if (days < 1) {
        errors.start_of_current_contract =
          "Start of current contract should be lower than the end of current contract";
        errors.end_of_current_contract =
          "End of current contract should be higher than the start of current contract";
      }
    }

    if (validator.isEmpty(immap_contract_international)) {
      errors.immap_contract_international =
        "Already iMMAP contract international is required";
    } else if (!validator.isBoolean(immap_contract_international)) {
      errors.immap_contract_international = "Invalid data format";
    }

    // if (validator.isEmpty(project)) {
    // 	errors.project = 'Current iMMAP Project is required';
    // }

    if (isEmpty(immap_office)) {
      errors.immap_office = "iMMAP Office is required";
    } else if (!validator.isInt(immap_office.value.toString())) {
      errors.immap_office = "Invalid 3iSolution Office data";
    }

    if (is_immap_inc == 0 && is_immap_france == 0) {
      errors.is_immap_inc =
        "Choose the 3iSolution Headquarters where you are currently employed";
      errors.is_immap_france =
        "Choose the 3iSolution Headquarters where you are currently employed";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// export function validateP11Form2(data) {
//   let errors = {};
//   // data.permanent_address = !isEmpty(data.permanent_address) ? data.permanent_address : '';
//   // data.permanent_country = !isEmpty(data.permanent_country) ? data.permanent_country : '';
//   // data.permanent_city = !isEmpty(data.permanent_city) ? data.permanent_city : '';
//   // data.permanent_postcode = !isEmpty(data.permanent_postcode) ? data.permanent_postcode : '';
//   // // data.permanent_telephone = !isEmpty(data.permanent_telephone) ? data.permanent_telephone : '';
//   // data.permanent_fax = !isEmpty(data.permanent_fax) ? data.permanent_fax : '';

//   // data.present_address = !isEmpty(data.present_address) ? data.present_address : '';
//   // data.present_country = !isEmpty(data.present_country) ? data.present_country : '';
//   // data.present_city = !isEmpty(data.present_city) ? data.present_city : '';
//   // data.present_postcode = !isEmpty(data.present_postcode) ? data.present_postcode : '';
//   // data.present_telephone = !isEmpty(data.present_telephone) ? data.present_telephone : '';
//   // data.present_fax = !isEmpty(data.present_fax) ? data.present_fax : '';

//   data.country_residence = !isEmpty(data.country_residence)
//     ? data.country_residence
//     : "";
//   data.office_telephone = !isEmpty(data.office_telephone)
//     ? data.office_telephone
//     : "";
//   // data.office_fax = !isEmpty(data.office_fax) ? data.office_fax : '';
//   data.office_email = !isEmpty(data.office_email) ? data.office_email : "";

//   // data.has_dependents = !isEmpty(data.has_dependents) ? data.has_dependents : '';
//   // data.dependents_count = !isEmpty(data.dependents_count) ? data.dependents_count.toString() : '';

//   // if (validator.isEmpty(data.permanent_address)) {
//   // 	errors.permanent_address = 'Permanent Address is required';
//   // } else if (!validator.isLength(data.permanent_address, { min: 20 })) {
//   // 	errors.permanent_address = 'Permanent Address minimum 20 characters';
//   // }

//   // if (isEmpty(data.permanent_country)) {
//   // 	errors.permanent_country = 'Permanent Country is required';
//   // } else if (!validator.isInt(data.permanent_country.value.toString())) {
//   // 	errors.permanent_country = 'Invalid Permanent Country Data';
//   // }

//   // if (validator.isEmpty(data.permanent_city)) {
//   // 	errors.permanent_city = 'Permanent City is required';
//   // } else if (!validator.isLength(data.permanent_city, { min: 2 })) {
//   // 	errors.permanent_city = 'Permanent City minimum 2 characters';
//   // }

//   // if (!validator.isEmpty(data.permanent_postcode)) {
//   // 	// errors.permanent_postcode = 'Permanent Postcode is required';
//   // 	// } else
//   // 	if (!validator.isLength(data.permanent_postcode, { min: 3 })) {
//   // 		errors.permanent_postcode = 'Permanent Postcode minimum 3 characters';
//   // 	}
//   // }

//   // if (validator.isEmpty(data.permanent_telephone)) {
//   // 	errors.permanent_telephone = 'Permanent Telephone is required';
//   // }

//   // if (data.sameWithPermanent === false) {
//   // 	if (validator.isEmpty(data.present_address)) {
//   // 		errors.present_address = 'Present Address is required';
//   // 	} else if (!validator.isLength(data.present_address, { min: 20 })) {
//   // 		errors.present_address = 'Present Address minimum 20 characters';
//   // 	}

//   // 	if (isEmpty(data.present_country)) {
//   // 		errors.present_country = 'Present Country is required';
//   // 	} else if (!validator.isInt(data.present_country.value.toString())) {
//   // 		errors.present_country = 'Invalid Present Country Data';
//   // 	}

//   // 	if (validator.isEmpty(data.present_city)) {
//   // 		errors.present_city = 'Present City is required';
//   // 	} else if (!validator.isLength(data.present_city, { min: 2 })) {
//   // 		errors.present_city = 'Present City minimum 2 characters';
//   // 	}

//   // 	if (!validator.isEmpty(data.present_postcode)) {
//   // 		if (!validator.isLength(data.present_postcode, { min: 3 })) {
//   // 			errors.present_postcode = 'Present Postcode minimum 3 characters';
//   // 		}
//   // 	}
//   // 	// if (validator.isEmpty(data.present_postcode)) {
//   // 	// 	errors.present_postcode = 'Present Postcode is required';
//   // 	// } else if (!validator.isLength(data.present_postcode, { min: 3 })) {
//   // 	// 	errors.present_postcode = 'Present Postcode minimum 3 characters';
//   // 	// }

//   // 	// if (validator.isEmpty(data.present_telephone)) {
//   // 	// 	errors.present_telephone = 'Present Telephone is required';
//   // 	// }
//   // }

//   if (isEmpty(data.country_residence)) {
//     errors.country_residence = "Country of Residence is required";
//   } else if (!validator.isInt(data.country_residence.value.toString())) {
//     errors.country_residence = "Invalid Country of Residence Data";
//   }

//   if (!validator.isEmpty(data.office_email)) {
//     if (!validator.isEmail(data.office_email)) {
//       errors.office_email = "Invalid office email format";
//     }
//   }

//   // if (validator.isEmpty(data.has_dependents.toString())) {
//   // 	errors.has_dependents = 'Have you any dependents is required';
//   // } else if (!validator.isBoolean(data.has_dependents.toString())) {
//   // 	errors.has_dependents = 'Invalid data format';
//   // }

//   // if (parseInt(data.dependents_count) < 1 && data.has_dependents.toString() === '1') {
//   // 	errors.dependents = 'You should fill the dependent list';
//   // }

//   return {
//     errors,
//     isValid: isEmpty(errors),
//   };
// }

export function validateP11Form2(data) {
  let errors = {};

  data.accept_employment_less_than_six_month = !isEmpty(
    data.accept_employment_less_than_six_month
  )
    ? data.accept_employment_less_than_six_month
    : "";
  data.previously_submitted_application_for_UN = !isEmpty(
    data.previously_submitted_application_for_UN
  )
    ? data.previously_submitted_application_for_UN
    : "";

  if (!Array.isArray(data.preferred_field_of_work)) {
    errors.preferred_field_of_work = "Preferred Areas of Expertise is required";
  } else if (data.preferred_field_of_work.length < 1) {
    errors.preferred_field_of_work = "Preferred Areas of Expertise is required";
  } else if (isEmpty(data.preferred_field_of_work)) {
    errors.preferred_field_of_work = "Preferred Areas of Expertise is required";
  }

  if (
    validator.isEmpty(data.accept_employment_less_than_six_month.toString())
  ) {
    errors.accept_employment_less_than_six_month =
      "Accept Employment Less than Six Month is required";
  } else if (
    !validator.isBoolean(data.accept_employment_less_than_six_month.toString())
  ) {
    errors.accept_employment_less_than_six_month = "Invalid data format";
  }

  if (
    validator.isEmpty(data.previously_submitted_application_for_UN.toString())
  ) {
    errors.previously_submitted_application_for_UN =
      "Previously worked with 3iSolution Is required";
  } else if (
    !validator.isBoolean(
      data.previously_submitted_application_for_UN.toString()
    )
  ) {
    errors.previously_submitted_application_for_UN = "Invalid data format";
  }

  if (
    parseInt(data.previously_submitted_application_for_UN_counts) < 1 &&
    data.previously_submitted_application_for_UN.toString() === "1"
  ) {
    errors.previously_submitted_application_for_UN_counts =
      "You should fill the time and organization list";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateP11Form3(data) {
  let errors = {};

  if (
    data.knowledge_of_language_counts < 1 &&
    validator.isInt(data.knowledge_of_language_counts.toString())
  ) {
    errors.knowledge_of_language_counts =
      "Language Skills are required, please complete the list";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateP11Form4(data) {
  let errors = {};

  if (validator.isInt(data.education_universities_counts.toString())) {
    if (data.education_universities_counts < 1) {
      errors.education_universities_counts =
        "Education (University or Equivalent) is required, Please fill the list";
    }
  }

  // if (validator.isInt(data.education_schools_counts.toString())) {
  // 	if (data.education_schools_counts < 1) {
  // 		errors.education_schools_counts =
  // 			'Education (Schools or other formal training or education from age 14) is required, Please fill the list';
  // 	}
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// export function validateP11Form7(data) {
//   let errors = {};

//   // if (validator.isEmpty(data.has_professional_societies.toString())) {
//   // 	errors.has_professional_societies = 'Invalid value';
//   // } else if (!validator.isBoolean(data.has_professional_societies.toString())) {
//   // 	errors.has_professional_societies = 'Invalid data format';
//   // }

//   if (validator.isEmpty(data.has_publications.toString())) {
//     errors.has_publications = "Invalid value";
//   } else if (!validator.isBoolean(data.has_publications.toString())) {
//     errors.has_publications = "Invalid data format";
//   }

//   // if (data.professional_societies_counts < 1 && data.has_professional_societies.toString() === '1') {
//   // 	errors.professional_societies_counts = 'Professional Society is required, Please fill the list';
//   // }

//   if (
//     data.publications_counts < 1 &&
//     data.has_publications.toString() === "1"
//   ) {
//     errors.publications_counts =
//       "Publication is required, Please fill the list";
//   }

//   return {
//     errors,
//     isValid: isEmpty(errors),
//   };
// }

export function validateP11Form5(data) {
  let errors = {};

  if (data.employment_records_counts < 1) {
    errors.employment_records_counts =
      "Employment Record is required, Please fill the list";
  }

  if (
    !validator.isBoolean(
      data.objections_making_inquiry_of_present_employer.toString()
    )
  ) {
    errors.objections_making_inquiry_of_present_employer =
      "Invalid data format";
  }

  if (!validator.isBoolean(data.permanent_civil_servant.toString())) {
    errors.permanent_civil_servant = "Invalid data format";
  }

  if (
    data.permanent_civil_servants_counts < 1 &&
    data.permanent_civil_servant.toString() === "1"
  ) {
    errors.permanent_civil_servants_counts =
      "Permanent Civil Servants is required";
  }

  if (
    data.permanent_civil_servants_counts < 1 &&
    data.permanent_civil_servant.toString() === "1" &&
    validator.isInt(data.permanent_civil_servants_counts.toString())
  ) {
    errors.permanent_civil_servants_counts =
      "Permanent Civil Servants is required, Please fill the list";
  }

  if (
    data.objections_making_inquiry_of_present_employer === "1" ||
    data.objections_making_inquiry_of_present_employer === 1
  ) {
    if (validator.isEmpty(data.objection_email)) {
      errors.objection_email = "Email is required";
    } else if (!validator.isEmail(data.objection_email)) {
      errors.objection_email = "Invalid email address";
    }

    if (validator.isEmpty(data.objection_name)) {
      errors.objection_name = "Name is required";
    } else if (!validator.isLength(data.objection_name, { min: 5 })) {
      errors.objection_name = " Name minimum 5 characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateP11Form6(data) {
  let errors = {};

  if (data.references_counts < 1) {
    errors.references_counts = "Reference is required, Please fill the list";
  }

  if (!validator.isEmpty(data.relevant_facts)) {
    if (!validator.isLength(data.relevant_facts, { min: 3 })) {
      errors.relevant_facts = "Other Relevant Facts minimum 3 characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateP11Form7(data) {
  let errors = {};
  if (!Array.isArray(data.skills)) {
    errors.skills = "Skills is required";
  } else if (data.skills.length < 1) {
    errors.skills = "Skills is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateP11Form8(data) {
  let errors = {};

  let linkedin_url = data.linkedin_url === null ? "" : data.linkedin_url;
  let hear_about_us_from = data.hear_about_us_from === null ? "" : data.hear_about_us_from;
  let other_text = data.other_text === null ? "" : data.other_text;

  if (isEmpty(data.cv)) {
    errors.cv = "CV File is required";
  }

  // if (isEmpty(data.signature)) {
  // 	errors.signature = 'Signature is required';
  // }

  // if (isEmpty(data.photo)) {
  // 	errors.photo = 'Photo is required';
  // }

  if (!validator.isBoolean(data.become_roster.toString())) {
    errors.become_roster = "Invalid data format";
  }

  if (!isEmpty(data.selected_roster_process)) {
    let errorExist = data.selected_roster_process.some((roster_process) => {
      return !validator.isInt(roster_process.toString());
    });

    if (errorExist) {
      errors.become_roster = "Invalid data format";
    }
  }

  if (!isEmpty(linkedin_url)) {
    // errors.linkedin_url = 'Linkedin Profile is required';
    if (
      !/(?:(?:http|https):\/\/)(?:www.)?linkedin.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/.test(
        linkedin_url
      ) &&
      !isEmpty(linkedin_url)
    ) {
      errors.linkedin_url = "Invalid linkedin url";
    }
  }

  if (isEmpty(hear_about_us_from)) {
     errors.hear_about_us_from = 'Hear about us from is required';
  }

  if (!isEmpty(hear_about_us_from) && hear_about_us_from == 'Other') {
    if (isEmpty(other_text)) {
      errors.other_text = "Other text is required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// export function validateDependent(data) {
// 	let errors = {};

// 	data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
// 	data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : '';
// 	data.family_name = !isEmpty(data.family_name) ? data.family_name : '';
// 	data.bdate = !isEmpty(data.bdate) ? data.bdate.toString() : '';
// 	data.bmonth = !isEmpty(data.bmonth) ? data.bmonth.toString() : '';
// 	data.byear = !isEmpty(data.byear) ? data.byear.toString() : '';
// 	data.relationship = !isEmpty(data.relationship) ? data.relationship : '';

// 	if (validator.isEmpty(data.first_name)) {
// 		errors.first_name = 'First name is required';
// 	} else if (!validator.isLength(data.first_name, { min: 3 })) {
// 		errors.first_name = 'First name minimum 3 characters';
// 	}

// 	if (!validator.isEmpty(data.middle_name)) {
// 		if (!validator.isLength(data.middle_name, { min: 3 })) {
// 			errors.middle_name = 'Middle name minimum 3 characters';
// 		}
// 	}

// 	if (validator.isEmpty(data.family_name)) {
// 		errors.family_name = 'Family name is required';
// 	} else if (!validator.isLength(data.family_name, { min: 3 })) {
// 		errors.family_name = 'Family name minimum 3 characters';
// 	}

// 	if (validator.isEmpty(data.bdate)) {
// 		errors.bdate = 'Birth date is required';
// 	} else if (!validator.isInt(data.bdate, { min: 1, max: 31, allow_leading_zeroes: true })) {
// 		errors.bdate = 'Birth date should be integer and between 1 - 31';
// 	}

// 	if (validator.isEmpty(data.bmonth)) {
// 		errors.bmonth = 'Birth month is required';
// 	} else if (!validator.isInt(data.bmonth, { min: 1, max: 12, allow_leading_zeroes: true })) {
// 		errors.bmonth = 'Invalid birth month format';
// 	}

// 	if (validator.isEmpty(data.byear)) {
// 		errors.byear = 'Birth year is required';
// 	} else if (!validator.isInt(data.byear, { min: year.min, max: year.max })) {
// 		errors.byear = 'Birth year should be integer and between ' + year.min + ' - ' + year.max;
// 	}

// 	if (data.bdate && data.bmonth && data.byear) {
// 		if (!moment(data.byear + '-' + data.bmonth + '-' + data.bdate).isValid()) {
// 			errors.bdate = 'Invalid date format';
// 			errors.bmonth = 'Invalid date format';
// 			errors.byear = 'Invalid date format';
// 		}
// 	}

// 	if (validator.isEmpty(data.relationship)) {
// 		errors.relationship = 'Relationship is required';
// 	} else if (!validator.isLength(data.relationship, { min: 5 })) {
// 		errors.relationship = 'Relationship minimum 5 characters';
// 	}

// 	return {
// 		errors,
// 		isValid: isEmpty(errors)
// 	};
// }

export function validateRelativesEmployedByPublicInternationalOrg(data) {
  let errors = {};

  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.middle_name = !isEmpty(data.middle_name) ? data.middle_name : "";
  data.family_name = !isEmpty(data.family_name) ? data.family_name : "";
  data.relationship = !isEmpty(data.relationship) ? data.relationship : "";
  data.job_title = !isEmpty(data.job_title) ? data.job_title : "";
  data.country = !isEmpty(data.country) ? data.country : "";

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = "First name is required";
  } else if (!validator.isLength(data.first_name, { min: 3 })) {
    errors.first_name = "First name minimum 3 characters";
  }

  if (!validator.isEmpty(data.middle_name)) {
    if (!validator.isLength(data.middle_name, { min: 3 })) {
      errors.middle_name = "Middle name minimum 3 characters";
    }
  }

  if (validator.isEmpty(data.family_name)) {
    errors.family_name = "Family name is required";
  } else if (!validator.isLength(data.family_name, { min: 3 })) {
    errors.family_name = "Family name minimum 3 characters";
  }

  if (validator.isEmpty(data.relationship)) {
    errors.relationship = "Relationship is required";
  } else if (!validator.isLength(data.relationship, { min: 3 })) {
    errors.relationship = "Relationship minimum 3 characters";
  }

  if (validator.isEmpty(data.job_title)) {
    errors.job_title = "Job Title/Position is required";
  } else if (!validator.isLength(data.job_title, { min: 3 })) {
    errors.job_title = "Job Title/Position minimum 3 characters";
  }
  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateSubmittedApplication(data) {
  let errors = {};

  data.country = !isEmpty(data.country) ? data.country : "";
  data.project = !isEmpty(data.project) ? data.project : "";
  data.duty_station = !isEmpty(data.duty_station) ? data.duty_station : "";
  data.immap_office = !isEmpty(data.immap_office) ? data.immap_office : "";
  data.line_manager = !isEmpty(data.line_manager) ? data.line_manager : "";
  data.position = !isEmpty(data.position) ? data.position : "";

  if (moment(data.starting_date).isAfter(data.ending_date)) {
    errors.ending_date = "Your end date can’t be earlier than your start date.";
  }
  if (moment(data.starting_date).isSame(data.ending_date)) {
    errors.ending_date = "Your end date can’t be same than your start date.";
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (!validator.isEmpty(data.project)) {
    // errors.project = 'Project is required';
    // } else
    if (!validator.isLength(data.project, { min: 3 })) {
      errors.project = "Project minimum 3 characters";
    }
  }

  if (validator.isEmpty(data.duty_station)) {
    errors.duty_station = "Duty station is required";
  } else if (!validator.isLength(data.duty_station, { min: 3 })) {
    errors.duty_station = "Duty station minimum 3 characters";
  }

  if (validator.isEmpty(data.line_manager)) {
    errors.line_manager = "Line manager is required";
  } else if (!validator.isLength(data.line_manager, { min: 3 })) {
    errors.line_manager = "Line manager minimum 3 characters";
  }

  if (validator.isEmpty(data.position)) {
    errors.position = "Position is required";
  } else if (!validator.isLength(data.position, { min: 3 })) {
    errors.position = "Position minimum 3 characters";
  }

  if (isEmpty(data.immap_office)) {
    errors.immap_office = "iMMAP Office is required";
  } else if (!validator.isInt(data.immap_office.value.toString())) {
    errors.immap_office = "Invalid iMMAP Office Data";
  }

  // if (isEmpty(data.un_organization)) {
  // 	errors.un_organization = 'UN Organization is required';
  // } else if (!validator.isInt(data.un_organization.value.toString())) {
  // 	errors.un_organization = 'Invalid UN Organization Data';
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateLanguage(data) {
  let errors = {};

  data.is_mother_tongue = !isEmpty(data.is_mother_tongue)
    ? data.is_mother_tongue
    : "";

  if (isEmpty(data.language)) {
    errors.language = "Language Skills are required, please complete the list";
  } else if (!validator.isInt(data.language.value.toString())) {
    errors.language = "Invalid data format";
  }

  if (isEmpty(data.language_level)) {
    errors.language_level = "Proficiency is required";
  } else if (!validator.isInt(data.language_level.value.toString())) {
    errors.language_level = "Invalid data format";
  }

  if (validator.isEmpty(data.is_mother_tongue.toString())) {
    errors.is_mother_tongue = "Is mother tongue is required";
  } else if (!validator.isBoolean(data.is_mother_tongue.toString())) {
    errors.is_mother_tongue = "Invalid data format";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateEducationUniversity(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.place = !isEmpty(data.place) ? data.place : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.af_month = !isEmpty(data.af_month) ? data.af_month.toString() : "";
  data.af_year = !isEmpty(data.af_year) ? data.af_year.toString() : "";
  data.at_month = !isEmpty(data.at_month) ? data.at_month.toString() : "";
  data.at_year = !isEmpty(data.at_year) ? data.at_year.toString() : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  // data.study = !isEmpty(data.study) ? data.study : "";
  data.degree_level = !isEmpty(data.degree_level) ? data.degree_level : "";

  var StartDt = new Date("01-" + data.af_month + "-" + data.af_year);
  let EndDt = new Date("01-" + data.at_month + "-" + data.at_year);

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  } else if (!validator.isLength(data.name, { min: 3 })) {
    errors.name = "Name minimum 3 characters";
  }

  if (validator.isEmpty(data.place)) {
    errors.place = "Place is required";
  } else if (!validator.isLength(data.place, { min: 3 })) {
    errors.place = "Place minimum 3 characters";
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (validator.isEmpty(data.af_month)) {
    errors.af_month = "Attended From (Month) is required";
  } else if (
    !validator.isInt(data.af_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.af_month = "Invalid Attended From (Month) format";
  }

  if (validator.isEmpty(data.af_year)) {
    errors.af_year = "Attended From (Year) is required";
  } else if (!validator.isInt(data.af_year, { min: year.min, max: year.max })) {
    errors.af_year =
      "Attended From (Year) should be between " + year.min + " - " + year.max;
  }

  if (data.untilNow === false) {
    if (validator.isEmpty(data.at_month)) {
      errors.at_month = "Attended To (Month) is required";
    } else if (
      !validator.isInt(data.at_month, {
        min: 1,
        max: 12,
        allow_leading_zeroes: true,
      })
    ) {
      errors.at_month = "Invalid Attended To (Month) format";
    }

    if (validator.isEmpty(data.at_year)) {
      errors.at_year = "Attended To (Year) is required";
    } else if (data.af_month && data.af_year && data.at_month && data.at_year) {
      if (EndDt <= StartDt) {
        errors.at_year = "Your end date can’t be earlier than your start date.";
      }
    } else if (
      !validator.isInt(data.at_year, { min: year.min, max: year.max })
    ) {
      errors.at_year =
        "Attended To (year) should be between " + year.min + " - " + year.max;
    }
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree is required";
  } else if (!validator.isLength(data.degree, { min: 3 })) {
    errors.degree = "Degree minimum 3 characters";
  }

  // if (validator.isEmpty(data.study)) {
  //   errors.study = "Study is required";
  // } else if (!validator.isLength(data.study, { min: 3 })) {
  //   errors.study = "Study minimum 3 characters";
  // }

  if (isEmpty(data.degree_level)) {
    errors.degree_level = "Degree Level is required";
  } else if (!validator.isInt(data.degree_level.value.toString())) {
    errors.degree_level = "Invalid Degree Level Data";
  }

  if (!isEmpty(data.diploma_file)) {
    if (!validator.isInt(data.diploma_file.file_id.toString())) {
      errors.diploma_file = "Invalid File Format";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateEducationSchool(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.place = !isEmpty(data.place) ? data.place : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.af_month = !isEmpty(data.af_month) ? data.af_month.toString() : "";
  data.af_year = !isEmpty(data.af_year) ? data.af_year.toString() : "";
  data.at_month = !isEmpty(data.at_month) ? data.at_month.toString() : "";
  data.at_year = !isEmpty(data.at_year) ? data.at_year.toString() : "";
  // data.type = !isEmpty(data.type) ? data.type : "";
  data.certificate = !isEmpty(data.certificate) ? data.certificate : "";

  var StartDt = new Date("01-" + data.af_month + "-" + data.af_year);
  let EndDt = new Date("01-" + data.at_month + "-" + data.at_year);

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  } else if (!validator.isLength(data.name, { min: 3 })) {
    errors.name = "Name minimum 3 characters";
  }

  if (validator.isEmpty(data.place)) {
    errors.place = "City is required";
  } else if (!validator.isLength(data.place, { min: 3 })) {
    errors.place = "City minimum 3 characters";
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (validator.isEmpty(data.af_month)) {
    errors.af_month = "Attended From (Month) is required";
  } else if (
    !validator.isInt(data.af_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.af_month = "Invalid Attended From (Month) format";
  }

  if (validator.isEmpty(data.af_year)) {
    errors.af_year = "Attended From (Year) is required";
  } else if (!validator.isInt(data.af_year, { min: year.min, max: year.max })) {
    errors.af_year =
      "Attended From (Year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.at_month)) {
    errors.at_month = "Attended To (Month) is required";
  } else if (
    !validator.isInt(data.at_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.at_month = "Invalid Attended To (Month) format";
  }

  if (validator.isEmpty(data.at_year)) {
    errors.at_year = "Attended To (Year) is required";
  } else if (data.af_month && data.af_year && data.at_month && data.at_year) {
    if (EndDt <= StartDt) {
      errors.at_year = "Your end date can’t be earlier than your start date.";
    }
  } else if (!validator.isInt(data.at_year, { min: year.min, max: year.max })) {
    errors.at_year =
      "Attended To (year) should be between " + year.min + " - " + year.max;
  }

  // if (validator.isEmpty(data.type)) {
  //   errors.type = "Type is required";
  // } else if (!validator.isLength(data.type, { min: 3 })) {
  //   errors.type = "Type minimum 3 characters";
  // }

  if (validator.isEmpty(data.certificate)) {
    errors.certificate = "Certificate is required";
  } else if (!validator.isLength(data.certificate, { min: 3 })) {
    errors.certificate = "Certificate minimum 3 characters";
  }

  if (!isEmpty(data.certificate_file)) {
    if (!validator.isInt(data.certificate_file.file_id.toString())) {
      errors.certificate_file = "Invalid File Format";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateProfessionalSociety(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.af_month = !isEmpty(data.af_month) ? data.af_month.toString() : "";
  data.af_year = !isEmpty(data.af_year) ? data.af_year.toString() : "";
  data.at_month = !isEmpty(data.at_month) ? data.at_month.toString() : "";
  data.at_year = !isEmpty(data.at_year) ? data.at_year.toString() : "";

  var StartDt = new Date("01-" + data.af_month + "-" + data.af_year);
  let EndDt = new Date("01-" + data.at_month + "-" + data.at_year);

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  } else if (!validator.isLength(data.name, { min: 3 })) {
    errors.name = "Name minimum 3 characters";
  }

  if (!validator.isEmpty(data.description)) {
    if (!validator.isLength(data.description, { min: 3 })) {
      errors.description = "Place minimum 3 characters";
    }
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (data.af_month && data.af_year && data.at_month && data.at_year) {
    if (EndDt <= StartDt) {
      errors.at_year = "Your end date can’t be earlier than your start date.";
    }
  }
  if (validator.isEmpty(data.af_month)) {
    errors.af_month = "Attended From (Month) is required";
  } else if (
    !validator.isInt(data.af_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.af_month = "Invalid Attended From (Month) format";
  }

  if (validator.isEmpty(data.af_year)) {
    errors.af_year = "Attended From (Year) is required";
  } else if (!validator.isInt(data.af_year, { min: year.min, max: year.max })) {
    errors.af_year =
      "Attended From (Year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.at_month)) {
    errors.at_month = "Attended To (Month) is required";
  } else if (
    !validator.isInt(data.at_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.at_month = "Invalid Attended To (Month) format";
  }

  if (validator.isEmpty(data.at_year)) {
    errors.at_year = "Attended To (Year) is required";
  } else if (data.af_month && data.af_year && data.at_month && data.at_year) {
    if (EndDt <= StartDt) {
      errors.at_year = "Your end date can’t be earlier than your start date.";
    }
  } else if (!validator.isInt(data.at_year, { min: year.min, max: year.max })) {
    errors.at_year =
      "Attended To (year) should be between " + year.min + " - " + year.max;
  }

  if (data.sectors) {
    if (!Array.isArray(data.sectors)) {
      errors.sectors = "Invalid sector format";
    } else {
      if (data.sectors.length && data.sectors.length > 0) {
        data.sectors.map((sector, index) => {
          if (
            !validator.isIn(sector.toString(), store.getState().options.sectors)
          ) {
            errors.sectors = "Invalid sector data";
          }
        });
      }
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validatePublication(data) {
  let errors = {};

  data.year = !isEmpty(data.year) ? data.year.toString() : "";
  data.url = !isEmpty(data.url) ? data.url : "";

  if (isEmpty(data.title)) {
    errors.title = "Title is required";
  }

  if (validator.isEmpty(data.year)) {
    errors.year = "Year is required";
  } else if (!validator.isInt(data.year, { min: year.min, max: year.max })) {
    errors.year = "Year should be between " + year.min + " - " + year.max;
  }

  if (!validator.isEmpty(data.url)) {
    if (!validator.isURL(data.url)) {
      errors.url = "Invalid URL Format";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateEmploymentRecord(data) {
  let errors = {};
  data.f_month = !isEmpty(data.f_month) ? data.f_month.toString() : "";
  data.f_year = !isEmpty(data.f_year) ? data.f_year.toString() : "";
  data.t_month = !isEmpty(data.t_month) ? data.t_month.toString() : "";
  data.t_year = !isEmpty(data.t_year) ? data.t_year.toString() : "";
  data.employer_name = !isEmpty(data.employer_name) ? data.employer_name : "";
  data.business_type = !isEmpty(data.business_type) ? data.business_type : "";
  // data.supervisor_name = !isEmpty(data.supervisor_name) ? data.supervisor_name : '';
  data.number_of_employees_supervised = !isEmpty(
    data.number_of_employees_supervised
  )
    ? data.number_of_employees_supervised.toString()
    : "";
  // data.kind_of_employees_supervised = !isEmpty(data.kind_of_employees_supervised)
  // 	? data.kind_of_employees_supervised
  // 	: '';
  // data.starting_salary = !isEmpty(data.starting_salary) ? data.starting_salary.toString() : '';
  // data.final_salary = !isEmpty(data.final_salary) ? data.final_salary.toString() : '';
  // data.reason_for_leaving = !isEmpty(data.reason_for_leaving) ? data.reason_for_leaving : '';
  data.country = !isEmpty(data.country) ? data.country : "";
  // data.employer_address = !isEmpty(data.employer_address) ? data.employer_address : '';

  var StartDt = new Date("01-" + data.f_month + "-" + data.f_year);
  let EndDt = new Date("01-" + data.t_month + "-" + data.t_year);

  let proficiency = !isEmpty(data.proficiency.toString())
    ? data.proficiency.toString()
    : "";

  if (validator.isEmpty(data.f_month)) {
    errors.f_month = "From (Month) is required";
  } else if (
    !validator.isInt(data.f_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.f_month = "Invalid From (Month) format";
  }

  if (validator.isEmpty(data.f_year)) {
    errors.f_year = "From (Year) is required";
  } else if (!validator.isInt(data.f_year, { min: year.min, max: year.max })) {
    errors.f_year =
      "From (Year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.t_month) && data.untilNow === false) {
    errors.t_month = "To (Month) is required";
  } else if (
    !validator.isInt(data.t_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    }) &&
    data.untilNow === false
  ) {
    errors.t_month = "Invalid To (Month) format";
  }

  if (validator.isEmpty(data.t_year) && data.untilNow === false) {
    errors.t_year = "To (Year) is required";
  } else if (data.f_month && data.f_year && data.t_month && data.t_year) {
    if (EndDt <= StartDt) {
      errors.t_year = "Your end date can’t be earlier than your start date.";
    }
  } else if (
    !validator.isInt(data.t_year, { min: year.min, max: year.max }) &&
    data.untilNow === false
  ) {
    errors.t_year =
      "To (year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.employer_name)) {
    errors.employer_name = "Name of employer is required";
  } else if (!validator.isLength(data.employer_name, { min: 3 })) {
    errors.employer_name = "Name of employer minimum 3 characters";
  }

  if (validator.isEmpty(data.business_type)) {
    errors.business_type = "Type of business is required";
  } else if (!validator.isLength(data.business_type, { min: 3 })) {
    errors.business_type = "Type of business minimum 3 characters";
  }

  // if (validator.isEmpty(data.supervisor_name)) {
  // 	errors.supervisor_name = 'Name of supervisor is required';
  // } else if (!validator.isLength(data.supervisor_name, { min: 3 })) {
  // 	errors.supervisor_name = 'Name of supervisor minimum 3 characters';
  // }

  if (!validator.isEmpty(data.number_of_employees_supervised)) {
    if (!validator.isInt(data.number_of_employees_supervised, { min: 1, max: 3000 })) {
      errors.number_of_employees_supervised = "Please fill the field with minimum value of 1 and a maximum value of 3000, if not leave it blank";
    }
  }

  // if (!validator.isEmpty(data.kind_of_employees_supervised)) {
  // 	if (!validator.isLength(data.kind_of_employees_supervised, { min: 3 })) {
  // 		errors.kind_of_employees_supervised = 'Kind of employees supervised by you at least minimum 3 characters';
  // 	}
  // }

  // if (validator.isEmpty(data.starting_salary)) {
  // 	errors.starting_salary = 'Starting salary is required';
  // } else if (!validator.isInt(data.starting_salary)) {
  // 	errors.starting_salary = 'Invalid starting salary data';
  // }

  // if (validator.isEmpty(data.final_salary)) {
  // 	errors.final_salary = 'Final salary is required';
  // } else if (!validator.isInt(data.final_salary)) {
  // 	errors.final_salary = 'Invalid final salary data';
  // }

  // if (data.untilNow === false) {
  // 	if (validator.isEmpty(data.reason_for_leaving)) {
  // 		errors.reason_for_leaving = 'Reason for leaving is required';
  // 	} else if (!validator.isLength(data.reason_for_leaving, { min: 3 })) {
  // 		errors.reason_for_leaving = 'Reason for leaving minimum 3 characters';
  // 	}
  // }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  // if (validator.isEmpty(data.employer_address)) {
  // 	errors.employer_address = 'Address of employer is required';
  // } else if (!validator.isLength(data.employer_address, { min: 3 })) {
  // 	errors.employer_address = 'Address of employer minimum 3 characters';
  // }

  if (validator.isEmpty(data.job_title)) {
    errors.job_title = "Exact title of yout post is required";
  } else if (!validator.isLength(data.job_title, { min: 3 })) {
    errors.job_title = "Exact title of yout post minimum 3 characters";
  }

  if (validator.isEmpty(data.job_description)) {
    errors.job_description = "Description of your duties is required";
  } else if (!validator.isLength(data.job_description, { min: 3 })) {
    errors.job_description = "Description of your duties  minimum 3 characters";
  }
  const skills = [...data.technical_skills, ...data.soft_skills, ...data.software_skills];

  if (!Array.isArray(skills)) {
    errors.skills = "Skills is required";
  } else if (skills.length < 1) {
    errors.skills = "Skills is required";
  }

  if (data.sectors) {
    if (!Array.isArray(data.sectors)) {
      errors.sectors = "Sectors is required";
    }
  }

  if (validator.isEmpty(proficiency)) {
    errors.proficiency = "Proficiency rating is required";
  } else if (validator.isInt(proficiency)) {
    if (proficiency <= 0) {
      errors.proficiency = "Proficiency rating is required";
    }
  } else if (!validator.isInt(proficiency)) {
    errors.proficiency = "Invalid proficiency rating format";
  }
  // if (data.sectors) {
  // 	if (!Array.isArray(data.sectors)) {
  // 		errors.sectors = 'Invalid sector format';
  // 	} else {
  // 		if (data.sectors.length && data.sectors.length > 0) {
  // 			data.sectors.map((sector, index) => {
  // 				if (!validator.isIn(sector.toString(), store.getState().options.sectors)) {
  // 					errors.sectors = 'Invalid sector data';
  // 				}
  // 			});
  // 		}
  // 	}
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validatePermanentCivilServant(data) {
  let errors = {};

  data.f_month = !isEmpty(data.f_month) ? data.f_month.toString() : "";
  data.f_year = !isEmpty(data.f_year) ? data.f_year.toString() : "";
  data.t_month = !isEmpty(data.t_month) ? data.t_month.toString() : "";
  data.t_year = !isEmpty(data.t_year) ? data.t_year.toString() : "";
  data.institution = !isEmpty(data.institution) ? data.institution : "";
  data.is_now = !isEmpty(data.is_now) ? data.is_now.toString() : "";

  var StartDt = new Date("01-" + data.f_month + "-" + data.f_year);
  let EndDt = new Date("01-" + data.t_month + "-" + data.t_year);

  if (validator.isEmpty(data.f_month)) {
    errors.f_month = "From (Month) is required";
  } else if (
    !validator.isInt(data.f_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.f_month = "Invalid From (Month) format";
  }

  if (validator.isEmpty(data.f_year)) {
    errors.f_year = "From (Year) is required";
  } else if (!validator.isInt(data.f_year, { min: year.min, max: year.max })) {
    errors.f_year =
      "From (Year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.t_month) && data.is_now == "0") {
    errors.t_month = "To (Month) is required";
  } else if (
    !validator.isInt(data.t_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    }) &&
    data.is_now == "0"
  ) {
    errors.t_month = "Invalid To (Month) format";
  }

  if (validator.isEmpty(data.t_year) && data.is_now == "0") {
    errors.t_year = "To (Year) is required";
  } else if (data.f_month && data.f_year && data.t_month && data.t_year) {
    if (EndDt <= StartDt) {
      errors.t_year = "Your end date can’t be earlier than your start date.";
    }
  } else if (
    !validator.isInt(data.t_year, { min: year.min, max: year.max }) &&
    data.is_now == "0"
  ) {
    errors.t_year =
      "To (year) should be between " + year.min + " - " + year.max;
  }

  if (validator.isEmpty(data.institution)) {
    errors.institution = "Institution is required";
  } else if (!validator.isLength(data.institution, { min: 3 })) {
    errors.institution = "Institution minimum 3 characters";
  }

  if (validator.isEmpty(data.is_now)) {
    errors.is_now =
      "Are you still currently become a civil servant in this institution is required";
  } else if (!validator.isBoolean(data.is_now)) {
    errors.is_now = "Invalid data format";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateReference(data) {
  let errors = {};

  data.full_name = !isEmpty(data.full_name) ? data.full_name : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.organization = !isEmpty(data.organization) ? data.organization : "";
  data.job_position = !isEmpty(data.job_position) ? data.job_position : "";

  if (validator.isEmpty(data.full_name)) {
    errors.full_name = "Full Name is required";
  } else if (!validator.isLength(data.full_name, { min: 3 })) {
    errors.full_name = "Full Name minimum 3 characters";
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Invalid Email format";
  }

  if (validator.isEmpty(data.organization)) {
    errors.organization = "Organization is required";
  } else if (!validator.isLength(data.organization, { min: 3 })) {
    errors.organization = "Organization minimum 3 characters";
  }

  if (validator.isEmpty(data.job_position)) {
    errors.job_position = "Job position is required";
  } else if (!validator.isLength(data.job_position, { min: 3 })) {
    errors.job_position = "Job position minimum 3 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateCriminalRecord(data) {
  let errors = {};

  data.cr_month = !isEmpty(data.cr_month) ? data.cr_month.toString() : "";
  data.cr_year = !isEmpty(data.cr_year) ? data.cr_year.toString() : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.details = !isEmpty(data.details) ? data.details : "";

  if (validator.isEmpty(data.cr_month)) {
    errors.f_month = "Month is required";
  } else if (
    !validator.isInt(data.cr_month, {
      min: 1,
      max: 12,
      allow_leading_zeroes: true,
    })
  ) {
    errors.f_month = "Invalid From Month format";
  }

  if (validator.isEmpty(data.cr_year)) {
    errors.f_year = "Year is required";
  } else if (!validator.isInt(data.cr_year, { min: year.min, max: year.max })) {
    errors.f_year = "Year should be between " + year.min + " - " + year.max;
  }

  if (isEmpty(data.country)) {
    errors.country = "Country is required";
  } else if (!validator.isInt(data.country.value.toString())) {
    errors.country = "Invalid Country Data";
  }

  if (validator.isEmpty(data.details)) {
    errors.details = "Detail is required";
  } else if (!validator.isLength(data.details, { min: 3 })) {
    errors.details = "Details minimum 3 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validatePortfolio(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.url = !isEmpty(data.url) ? data.url : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  } else if (!validator.isLength(data.title, { min: 3 })) {
    errors.title = "Title minimum 3 characters";
  }

  if (validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  } else if (!validator.isLength(data.description, { min: 20 })) {
    errors.description = "Description minimum 20 characters";
  }

  if (!validator.isEmpty(data.url)) {
    if (!validator.isURL(data.url, { require_protocol: true })) {
      errors.url = "Invalid URL Format";
    }
  }

  // if (!Array.isArray(data.skills)) {
  //   errors.skills = "Skills is required";
  // } else if (data.skills.length < 1) {
  //   errors.skills = "Skills is required";
  // }

  // if (data.sectors) {
  //   if (!Array.isArray(data.sectors)) {
  //     errors.sectors = "Sectors is required";
  //   }
  // }

  if (!isEmpty(data.attachment_file)) {
    if (!validator.isInt(data.attachment_file.file_id.toString())) {
      errors.attachment_file = "Invalid File Format";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validateSkills(data) {
  let errors = {};

  let proficiency = !isEmpty(data.proficiency.toString())
    ? data.proficiency.toString()
    : "";

  if (data.skill) {
    if (Array.isArray(data.skill)) {
      if (data.skill.length > 1) {
        errors.skill = "Only one skill allowed";
      } else if (data.skill.length === 0) {
        errors.skill = "Skill is required";
      }
    } else {
      errors.skill = "Invalid skill format";
    }
  } else if (isEmpty(data.skill)) {
    errors.skill = "Skill is required";
  }

  if (validator.isEmpty(proficiency)) {
    errors.proficiency = "Proficiency rating is required";
  } else if (validator.isInt(proficiency)) {
    if (proficiency <= 0) {
      errors.proficiency = "Proficiency rating is required";
    }
  } else if (!validator.isInt(proficiency)) {
    errors.proficiency = "Invalid proficiency rating format";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validatePhoneNumbers(data) {
  let errors = {};
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.is_primary = !isEmpty(data.is_primary) ? data.is_primary : "";

  if (validator.isEmpty(data.phone)) {
    errors.phone = "Phone number is required, please provide";
  }

  if (validator.isEmpty(data.is_primary.toString())) {
    errors.is_primary = "Is Primary is required";
  } else if (!validator.isBoolean(data.is_primary.toString())) {
    errors.is_primary = "Invalid data format";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
