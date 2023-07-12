import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from '../../validations/common/isEmpty';
import MuiPhoneNumber from 'material-ui-phone-number';
import 'react-phone-number-input/style.css';
import '../../assets/css/select-field.css';
// import Input from '@material-ui/core/Input'
// import TextField from '@material-ui/core/TextField'
// import PhoneInput from 'react-phone-number-input'

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	labelNormalSize: {
		fontSize: '16px',
		transform: 'translate(0, 1.5px) scale(0.75)',
		'transform-origin': 'top left'
	}
});

const phoneChange = (phone, countryData, required, name, onChange) => {
	let rawPhone = phone.replace(/[^0-9]+/g, '').slice(countryData.dialCode.length);

	onChange(phone, name);
	// if (required) {
	//   onChange(phone, name)
	// } else {
	//   if (isEmpty(rawPhone)) {
	//     onChange(rawPhone, name)
	//   } else {
	//     onChange(phone, name)
	//   }
	// }

	// if (isEmpty(rawPhone)) {
	//   if (required) {
	//     onChange(phone, name)
	//   } else {
	//     onChange(rawPhone, name)
	//   }
	// } else {
	//   onChange(phone, name)
	// }
};

const PhoneField = ({ value, id, name, label, placeholder, onChange, margin, required, fullWidth, error, classes }) => (
	<FormControl
		id={id ? id : 'phone-field'}
		margin={margin ? margin : 'normal'}
		fullWidth={fullWidth ? true : false}
		error={!isEmpty(error) ? true : false}
	>
		<FormLabel className={classes.labelNormalSize}>{label}</FormLabel>
		<MuiPhoneNumber
			// defaultCountry={'us'}
			value={value}
			onChange={(phone, countryData) => {
				let empty = '';
				if (countryData.dialCode == phone.slice(1)) {
					onChange(empty, name);
				} else {
					onChange(phone, name);
				}
			}}
			countryCodeEditable={true}
		/>
		{/* <PhoneInput
      // country="US"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={phone => onChange(phone, name)}
      // onChange={onChange}
      // inputComponent={TextField}
    /> */}
		{!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
	</FormControl>
);

PhoneField.defaultProp = {
	required: false
};

export default withStyles(styles)(PhoneField);

// if (phone == '+' || phone == '+1') {
// 	let empty = '';
// 	onChange(empty, name);
// } else {
// 	onChange(phone, name);
// }
