import isEmpty from '../common/isEmpty';
import validator from 'validator';

export function validate(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.matching_requirements = !isEmpty(data.matching_requirements) ? data.matching_requirements : [];

	if (validator.isEmpty(data.name)) {
		errors.name = 'Name is required';
	} else if (!validator.isLength(data.name, { min: 4 })) {
		errors.name = 'Name minimum 4 characters';
	}

	// if (isEmpty(data.sub_sections)) {
	// 	errors.sub_sections = 'Sub section is required';
	// }

	if (!isEmpty(data.matching_requirements)) {
		if (data.matching_requirements.length > 0) {
			data.matching_requirements.map((match_requirement) => {
				const { isValid } = validateRequirement(match_requirement);

				if (!isValid) {
					errors.matching_requirements = 'There is an error in matching requirements value';
				}
			});
		}
	}

	// if (isEmpty(data.matching_requirements)) {
	// 	errors.matching_requirements = 'Matching Requirement is required';
	// } else {
	// 	data.matching_requirements.map((match_requirement) => {
	// 		const { isValid } = validateRequirement(match_requirement);

	// 		if (!isValid) {
	// 			errors.matching_requirements = 'There is an error in matching requirements value';
	// 		}
	// 	});
	// }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateSelectedRequirement(data) {
	let errors = {};

	data.selectedRequirement = !isEmpty(data.selectedRequirement) ? data.selectedRequirement : '';

	if (isEmpty(data.selectedRequirement)) {
		errors.selectedRequirement = 'Job Skill is required';
	} else if (!data.selectedRequirement.hasOwnProperty('value')) {
		errors.selectedRequirement = 'Invalid Job Skill data';
	} else if (validator.isEmpty(data.selectedRequirement.value)) {
		errors.selectedRequirement = 'Job Skill is required';
	} else if (!validator.isIn(data.selectedRequirement.value, [ 'degree_level', 'skill', 'sector', 'language' ])) {
		errors.selectedRequirement = 'Invalid Job Skill data';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validateRequirement(data) {
	let errors = {};

	data.requirement = !isEmpty(data.requirement) ? data.requirement : '';
	data.component = !isEmpty(data.component) ? data.component : '';

	if (validator.isEmpty(data.requirement)) {
		errors.requirement = 'Requirement is required';
	} else if (!validator.isIn(data.requirement, [ 'skill', 'sector', 'language', 'degree_level' ])) {
		errors.requirement = 'Invalid requirement data';
	}

	if (validator.isEmpty(data.component)) {
		errors.component = 'Component is required';
	} else if (
		!validator.isIn(data.component, [
			'ParameterSkill',
			'ParameterSector',
			'ParameterLanguage',
			'ParameterDegreeLevel'
		])
	) {
		errors.component = 'Invalid component data';
	}

	if (data.requirement_value.hasOwnProperty('skill')) {
		if (!data.requirement_value.skill.hasOwnProperty('value')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.skill.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.skill.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!data.requirement_value.hasOwnProperty('proficiency')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.proficiency.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.proficiency.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
			// } else if (!data.requirement_value.hasOwnProperty('experience')) {
			// 	errors.requirement_value = 'Invalid requirement value data';
			// } else if (validator.isEmpty(data.requirement_value.experience.toString())) {
			// 	errors.requirement_value = 'Invalid requirement value data';
			// } else if (!validator.isInt(data.requirement_value.experience.toString())) {
			// 	errors.requirement_value = 'Invalid requirement value data';
		}
	} else if (data.requirement_value.hasOwnProperty('sector')) {
		if (!data.requirement_value.sector.hasOwnProperty('value')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.sector.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.sector.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!data.requirement_value.hasOwnProperty('experience')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.experience.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.experience.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		}
	} else if (data.requirement_value.hasOwnProperty('language')) {
		if (!data.requirement_value.language.hasOwnProperty('value')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.language.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.language.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		}
	} else if (data.requirement_value.hasOwnProperty('degree_level')) {
		if (!data.requirement_value.degree_level.hasOwnProperty('value')) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (validator.isEmpty(data.requirement_value.degree_level.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		} else if (!validator.isInt(data.requirement_value.degree_level.value.toString())) {
			errors.requirement_value = 'Invalid requirement value data';
		}
	} else {
		errors.requirement_value = 'Invalid requirement value data';
	}

	// if (!data.requirement_value.hasOwnProperty('proficiency')) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// } else if (validator.isEmpty(data.requirement_value.proficiency.toString())) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// } else if (!validator.isInt(data.requirement_value.proficiency.toString())) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// } else if (!data.requirement_value.hasOwnProperty('experience')) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// } else if (validator.isEmpty(data.requirement_value.experience.toString())) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// } else if (!validator.isInt(data.requirement_value.experience.toString())) {
	// 	errors.requirement_value = 'Invalid requirement value data';
	// }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}
