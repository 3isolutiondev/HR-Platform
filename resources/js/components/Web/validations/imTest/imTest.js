import validator from 'validator';
import isEmpty from '../../validations/common/isEmpty';

export function validationIMTest1(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.text1 = !isEmpty(data.text1) ? data.text1 : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 5 })) {
		errors.title = 'Title minimum 5 characters';
	}

	if (data.text1 === '<p><br></p>') {
		errors.text1 = 'Body is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validationIMTest2(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.text1 = !isEmpty(data.text1) ? data.text1 : '';
	data.text2 = !isEmpty(data.text2) ? data.text2 : '';
	data.text3 = !isEmpty(data.text3) ? data.text3 : '';

	data.questions[0].question = !isEmpty(data.questions[0].question) ? data.questions[0].question : '';
	data.questions[1].question = !isEmpty(data.questions[1].question) ? data.questions[1].question : '';
	data.questions[2].question = !isEmpty(data.questions[2].question) ? data.questions[2].question : '';

	data.questions[0].answer[0].choice = !isEmpty(data.questions[0].answer[0].choice)
		? data.questions[0].answer[0].choice
		: '';
	data.questions[0].answer[1].choice = !isEmpty(data.questions[0].answer[1].choice)
		? data.questions[0].answer[1].choice
		: '';
	data.questions[0].answer[2].choice = !isEmpty(data.questions[0].answer[2].choice)
		? data.questions[0].answer[2].choice
		: '';
	data.questions[0].answer[3].choice = !isEmpty(data.questions[0].answer[3].choice)
		? data.questions[0].answer[3].choice
		: '';

	data.questions[1].answer[0].choice = !isEmpty(data.questions[1].answer[0].choice)
		? data.questions[1].answer[0].choice
		: '';
	data.questions[1].answer[1].choice = !isEmpty(data.questions[1].answer[1].choice)
		? data.questions[1].answer[1].choice
		: '';
	data.questions[1].answer[2].choice = !isEmpty(data.questions[1].answer[2].choice)
		? data.questions[1].answer[2].choice
		: '';
	data.questions[1].answer[3].choice = !isEmpty(data.questions[1].answer[3].choice)
		? data.questions[1].answer[3].choice
		: '';

	data.questions[2].answer[0].choice = !isEmpty(data.questions[2].answer[0].choice)
		? data.questions[2].answer[0].choice
		: '';
	data.questions[2].answer[1].choice = !isEmpty(data.questions[2].answer[1].choice)
		? data.questions[2].answer[1].choice
		: '';
	data.questions[2].answer[2].choice = !isEmpty(data.questions[2].answer[2].choice)
		? data.questions[2].answer[2].choice
		: '';
	data.questions[2].answer[3].choice = !isEmpty(data.questions[2].answer[3].choice)
		? data.questions[2].answer[3].choice
		: '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 5 })) {
		errors.title = 'Title minimum 5 characters';
	}
	if (data.text1 === '<p><br></p>') {
		errors.text1 = 'Body is required';
	}
	if (data.text2 === '<p><br></p>') {
		errors.text2 = 'Body is required';
	}

	if (data.text3 === '<p><br></p>') {
		errors.text3 = 'Body is required';
	}

	if (isEmpty(data.file_dataset2)) {
		errors.file_dataset2 = 'Dataset File is required';
	}
	if (isEmpty(data.file_dataset1)) {
		errors.file_dataset1 = 'Dataset File is required';
	}

	if (validator.isEmpty(data.questions[0].question)) {
		errors.question1 = 'Question is required';
	} else if (!validator.isLength(data.questions[0].question, { min: 5 })) {
		errors.question1 = 'Question minimum 5 characters';
	}

	if (validator.isEmpty(data.questions[1].question)) {
		errors.question2 = 'Question is required';
	} else if (!validator.isLength(data.questions[1].question, { min: 5 })) {
		errors.question2 = 'Question minimum 5 characters';
	}

	if (validator.isEmpty(data.questions[2].question)) {
		errors.question3 = 'Question is required';
	} else if (!validator.isLength(data.questions[2].question, { min: 5 })) {
		errors.question3 = 'Question minimum 5 characters';
	}

	if (validator.isEmpty(data.questions[0].answer[0].choice)) {
		errors.choice0A = 'Answer is required';
	} else if (!validator.isLength(data.questions[0].answer[0].choice, { min: 3 })) {
		errors.choice0A = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[0].answer[1].choice)) {
		errors.choice0B = 'Answer is required';
	} else if (!validator.isLength(data.questions[0].answer[1].choice, { min: 3 })) {
		errors.choice0B = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[0].answer[2].choice)) {
		errors.choice0C = 'Answer is required';
	} else if (!validator.isLength(data.questions[0].answer[2].choice, { min: 3 })) {
		errors.choice0C = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[0].answer[3].choice)) {
		errors.choice0D = 'Answer is required';
	} else if (!validator.isLength(data.questions[0].answer[3].choice, { min: 3 })) {
		errors.choice0D = 'Answer minimum 3 characters';
	}

	if (validator.isEmpty(data.questions[1].answer[0].choice)) {
		errors.choice1A = 'Answer is required';
	} else if (!validator.isLength(data.questions[1].answer[0].choice, { min: 3 })) {
		errors.choice1A = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[1].answer[1].choice)) {
		errors.choice1B = 'Answer is required';
	} else if (!validator.isLength(data.questions[1].answer[1].choice, { min: 3 })) {
		errors.choice1B = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[1].answer[2].choice)) {
		errors.choice1C = 'Answer is required';
	} else if (!validator.isLength(data.questions[1].answer[2].choice, { min: 3 })) {
		errors.choice1C = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[1].answer[3].choice)) {
		errors.choice1D = 'Answer is required';
	} else if (!validator.isLength(data.questions[1].answer[3].choice, { min: 3 })) {
		errors.choice1D = 'Answer minimum 3 characters';
	}

	if (validator.isEmpty(data.questions[2].answer[0].choice)) {
		errors.choice2A = 'Answer is required';
	} else if (!validator.isLength(data.questions[2].answer[0].choice, { min: 3 })) {
		errors.choice2A = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[2].answer[1].choice)) {
		errors.choice2B = 'Answer is required';
	} else if (!validator.isLength(data.questions[2].answer[1].choice, { min: 3 })) {
		errors.choice2B = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[2].answer[2].choice)) {
		errors.choice2C = 'Answer is required';
	} else if (!validator.isLength(data.questions[2].answer[2].choice, { min: 3 })) {
		errors.choice2C = 'Answer minimum 3 characters';
	}
	if (validator.isEmpty(data.questions[2].answer[3].choice)) {
		errors.choice2D = 'Answer is required';
	} else if (!validator.isLength(data.questions[2].answer[3].choice, { min: 3 })) {
		errors.choice2D = 'Answer minimum 3 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validationIMTest3(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.text1 = !isEmpty(data.text1) ? data.text1 : '';
	data.text2 = !isEmpty(data.text2) ? data.text2 : '';
	data.text3 = !isEmpty(data.text3) ? data.text3 : '';
	data.text4 = !isEmpty(data.text4) ? data.text4 : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 5 })) {
		errors.title = 'Title minimum 5 characters';
	}
	if (data.text1 === '<p><br></p>') {
		errors.text1 = 'Body is required';
	}
	if (data.text2 === '<p><br></p>') {
		errors.text2 = 'Map A is required';
	}

	if (data.text3 === '<p><br></p>') {
		errors.text3 = 'Map B is required';
	}

	if (data.text4 === '<p><br></p>') {
		errors.text4 = 'Information is required';
	}
	if (isEmpty(data.file_dataset2)) {
		errors.file_dataset2 = 'Dataset File is required';
	}
	if (isEmpty(data.file_dataset1)) {
		errors.file_dataset1 = 'Dataset File is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validationIMTest4(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.text1 = !isEmpty(data.text1) ? data.text1 : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 5 })) {
		errors.title = 'Title minimum 5 characters';
	}
	if (data.text1 === '<p><br></p>') {
		errors.text1 = 'Body is required';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
}

export function validationIMTest5(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.text1 = !isEmpty(data.text1) ? data.text1 : '';

	if (validator.isEmpty(data.title)) {
		errors.title = 'Title is required';
	} else if (!validator.isLength(data.title, { min: 5 })) {
		errors.title = 'Title minimum 5 characters';
	}
	if (data.text1 === '<p><br></p>') {
		errors.text1 = 'Body is required';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
}
