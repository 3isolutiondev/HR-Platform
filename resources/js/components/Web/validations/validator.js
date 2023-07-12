// import React from 'react';
import isEmpty from './common/isEmpty';
import { trans } from '../utils/helper';
// import validate from 'validator';
import _lang from 'lodash/lang';

function isRequired(data) {
	return !isEmpty(data);
}

function isObject(data) {
	if (data === null) {
		return false;
	}
	return typeof data === 'object';
}

function isArray(data) {
	return _lang.isArray(data);
}

function isInteger(data) {
	return _lang.isInteger(data); // || validate.isInt(data);
}

function switcher(field_name, data, rule) {
	let isValid = true;
	let error = '';
	switch (rule) {
		case 'required':
			isValid = isRequired(data);
			if (!isValid) {
				error = trans('validation.required', { field_name: field_name });
			}
			return { error, isValid: isEmpty(error) };
		case 'object':
			isValid = isObject(data);
			if (!isValid) {
				error = trans('validation.object', { field_name: field_name });
			}
			return { error, isValid: isEmpty(error) };
		case 'integer':
			isValid = isInteger(data);
			if (!isValid) {
				error = trans('validation.integer', { field_name: field_name });
			}
			return { error, isValid: isEmpty(error) };
		default:
			return { error, isValid: isEmpty(error) };
	}
}

export const validator = async (data, rules) => {
	let errors = {};

	await Object.keys(rules).forEach((key) => {
		rules[key].some((rule) => {
			const { error, isValid } = switcher(key, data[key], rule);

			if (!isValid) {
				errors[key] = error;
			}
			return !isValid;
		});
	});

	return { errors, isValid: isEmpty(errors) };
};

// export default validator;
