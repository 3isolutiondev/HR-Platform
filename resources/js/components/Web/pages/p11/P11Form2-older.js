import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import Switch from '@material-ui/core/Switch';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';
import SelectField from '../../common/formFields/SelectField';
import PhoneNumberField from '../../common/formFields/PhoneNumberField';
// import YesNoField from '../../common/formFields/YesNoField';
import {
	onChangeForm2,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { validateP11Form2 } from '../../validations/p11';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
// import DependentLists from './dependents/DependentLists';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import { YesNoURL } from '../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	overflowVisible: {
		overflow: 'visible'
	},
	form: {
		'margin-bottom': theme.spacing.unit * 2
	}
});

class P11Form2Old extends React.Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		// this.switchAddress = this.switchAddress.bind(this);
		this.phoneOnChange = this.phoneOnChange.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
		// this.hasDependentOnChange = this.hasDependentOnChange.bind(this);
		// this.resetPresentAddress = this.resetPresentAddress.bind(this);
		// this.updateDependent = this.updateDependent.bind(this);
	}

	// Attention
	//jangan pakai componentDidUpdate untuk cek props karena bentrok dengan phone

	componentDidMount() {
		this.getP11();
	}

	// componentDidUpdate(prevProps) {
	// 	const strForm2 = JSON.stringify(this.props.form2);
	// 	const strPrevForm2 = JSON.stringify(prevProps.form2);
	// 	if (strForm2 !== strPrevForm2) {
	// 		this.isValid();
	// 	}
	// }

	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-2')
			.then((res) => {
				let { form2 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form2)
					.forEach((key) => (form2[key] = isEmpty(res.data.data[key]) ? '' : res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form2', form2).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

	// updateDependent() {
	// 	this.props
	// 		.getAPI('/api/p11-dependents/lists')
	// 		.then((res) => {
	// 			this.props.onChangeForm2('dependents_count', res.data.data.length);
	// 		})
	// 		.catch((err) => {
	// 			this.props.addFlashMessage({
	// 				type: 'error',
	// 				text: 'There is an error while retrieving your data'
	// 			});
	// 		});
	// }

	isValid() {
		let { errors, isValid } = validateP11Form2(this.props.form2);
		this.props.updateP11Status(2, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	onChange(e) {
		this.props.onChangeForm2(e.target.name, e.target.value).then(() => {
			this.isValid();
		});
	}

	selectOnChange(values, e) {
		this.props.onChangeForm2(e.name, values).then(() => {
			this.isValid();
		});
	}

	phoneOnChange(phone, name, errors) {
		let phoneErrors = {};
		if (!isEmpty(errors)) {
			phoneErrors[name] = errors;
		}

		this.props.updateP11Status(2, isEmpty(errors), this.props.p11Status);
		this.props.checkError(phoneErrors, isEmpty(phoneErrors));
		this.props.onChangeForm2(name, phone);
	}

	// resetPresentAddress() {
	// 	this.props.setP11FormData(
	// 		'form2',
	// 		Object.assign(this.props.form2, {
	// 			present_address: '',
	// 			present_country: '',
	// 			present_city: '',
	// 			present_postcode: '',
	// 			present_telephone: '',
	// 			present_fax: ''
	// 		})
	// 	);
	// }

	// switchAddress(e) {
	// 	const yesNoName = e.target.name;
	// 	const yesNoValue = !this.props.form2[e.target.name];
	// 	this.props
	// 		.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
	// 		.then((res) => {
	// 			this.props.onChangeForm2(yesNoName, yesNoValue);
	// 			this.props.addFlashMessage({
	// 				type: res.data.status ? res.data.status : 'success',
	// 				text: res.data.message ? res.data.message : 'Update Success'
	// 			});
	// 			if (yesNoValue) {
	// 				this.resetPresentAddress();
	// 			}
	// 			this.isValid();
	// 		})
	// 		.catch((err) => {
	// 			this.props.addFlashMessage({
	// 				type: err.response ? err.response.data.status : 'error',
	// 				text: err.response ? err.response.data.message : 'There is an error while updating your data'
	// 			});
	// 		});
	// }

	// hasDependentOnChange(e) {
	// 	const yesNoName = e.target.name;
	// 	const yesNoValue = e.target.value;
	// 	this.props
	// 		.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
	// 		.then((res) => {
	// 			this.props.onChangeForm2(yesNoName, yesNoValue);
	// 			if (yesNoName === 'has_dependents' && yesNoValue == 0) {
	// 				this.props.onChangeForm2('dependents_count', 0);
	// 			}
	// 			this.props.addFlashMessage({
	// 				type: res.data.status ? res.data.status : 'success',
	// 				text: res.data.message ? res.data.message : 'Update Success'
	// 			});
	// 			this.isValid();
	// 		})
	// 		.catch((err) => {
	// 			this.props.addFlashMessage({
	// 				type: err.response ? err.response.data.status : 'success',
	// 				text: err.response ? err.response.data.message : 'Update Success'
	// 			});
	// 		});
	// }

	render() {
		let {
			// permanent_address,
			// permanent_country,
			// permanent_city,
			// permanent_postcode,
			// permanent_telephone,
			// permanent_fax,
			// sameWithPermanent,
			// present_address,
			// present_country,
			// present_city,
			// present_postcode,
			// present_telephone,
			// present_fax,
			country_residence,
			office_telephone,
			skype,
			office_email
			// has_dependents
		} = this.props.form2;
		let { errors, p11Countries, classes } = this.props;

		let marginBottom, marginTop;
		if(isEmpty(errors.country_residence)) {
			marginBottom='0px';
			marginTop='0px';
		} else {
			marginBottom='20px';
			marginTop='20px';
		}

		return (
			<React.Fragment>
				<form onSubmit={this.onSubmit} className={classes.form}>
					<Grid container spacing={24} alignItems="flex-end">
						{/* <Grid item xs={12}>
							<Card elevation={1} className={classes.overflowVisible}>
								<CardContent>
									<FormLabel>Permanent Address *</FormLabel>
									<Grid container spacing={24} alignItems="flex-end">
										<Grid item xs={12} sm={12} md={9}>
											<TextField
												required
												id="permanent_address"
												name="permanent_address"
												label="Address"
												fullWidth
												autoComplete="address"
												value={permanent_address}
												onChange={this.onChange}
												error={!isEmpty(errors.permanent_address)}
												helperText={errors.permanent_address}
												margin="dense"
												multiline
												rows={2}
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<SelectField
												label="Country *"
												options={p11Countries}
												value={permanent_country}
												onChange={this.selectOnChange}
												placeholder="Select country"
												isMulti={false}
												name="permanent_country"
												error={errors.permanent_country}
												margin="dense"
												required
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<TextField
												required
												id="permanent_city"
												name="permanent_city"
												label="City"
												fullWidth
												autoComplete="city"
												value={permanent_city}
												onChange={this.onChange}
												error={!isEmpty(errors.permanent_city)}
												helperText={errors.permanent_city}
												margin="dense"
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<TextField
												id="permanent_postcode"
												name="permanent_postcode"
												label="Post Code"
												fullWidth
												autoComplete="postcode"
												value={permanent_postcode}
												onChange={this.onChange}
												error={!isEmpty(errors.permanent_postcode)}
												helperText={errors.permanent_postcode}
												margin="dense"
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<PhoneNumberField
												id="permanent_telephone"
												name="permanent_telephone"
												label="Permanent Address Telephone (Landline) *"
												placeholder="Please enter telephone number (landline)"
												fullWidth
												value={permanent_telephone}
												onChange={this.phoneOnChange}
												margin="dense"
												error={errors.permanent_telephone}
												length={6}
												country_code="+1"
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<PhoneNumberField
												id="permanent_fax"
												name="permanent_fax"
												label="Fax"
												placeholder="Please enter fax number"
												fullWidth
												value={permanent_fax}
												onChange={this.phoneOnChange}
												margin="dense"
												error={errors.permanent_fax}
												length={6}
												country_code="+1"
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								label="Use Permanent Address as Present Address"
								control={
									<Switch
										checked={sameWithPermanent === true ? true : false}
										onChange={this.switchAddress}
										color="primary"
										name="sameWithPermanent"
									/>
								}
							/>
						</Grid>
						{sameWithPermanent === false && (
							<Grid item xs={12}>
								<Card elevation={1} className={classes.overflowVisible}>
									<CardContent>
										<FormLabel>Present Address *</FormLabel>
										<Grid container spacing={24} alignItems="flex-end">
											<Grid item xs={12} sm={12} md={9}>
												<TextField
													required
													id="present_address"
													name="present_address"
													label="Address"
													fullWidth
													autoComplete="address"
													value={present_address}
													onChange={this.onChange}
													error={!isEmpty(errors.present_address)}
													helperText={errors.present_address}
													margin="dense"
													multiline
													rows={2}
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={3}>
												<SelectField
													label="Country *"
													options={p11Countries}
													value={present_country}
													onChange={this.selectOnChange}
													placeholder="Select country"
													isMulti={false}
													name="present_country"
													error={errors.present_country}
													margin="dense"
													required
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={3}>
												<TextField
													required
													id="present_city"
													name="present_city"
													label="City"
													fullWidth
													autoComplete="city"
													value={present_city}
													onChange={this.onChange}
													error={!isEmpty(errors.present_city)}
													helperText={errors.present_city}
													margin="dense"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={3}>
												<TextField
													id="present_postcode"
													name="present_postcode"
													label="Post Code"
													fullWidth
													autoComplete="postcode"
													value={present_postcode}
													onChange={this.onChange}
													error={!isEmpty(errors.present_postcode)}
													helperText={errors.present_postcode}
													margin="dense"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={3}>
												<PhoneNumberField
													id="present_telephone"
													name="present_telephone"
													label="Telephone (Landline) *"
													placeholder="Please enter telephone number (landline)"
													fullWidth
													value={present_telephone}
													onChange={this.phoneOnChange}
													margin="none"
													error={errors.present_telephone}
													margin="dense"
													length={6}
													country_code="+1"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={3}>
												<PhoneNumberField
													id="present_fax"
													name="present_fax"
													label="Fax"
													placeholder="Please enter fax number"
													fullWidth
													value={present_fax}
													onChange={this.phoneOnChange}
													margin="none"
													error={errors.present_fax}
													margin="dense"
													length={6}
													country_code="+1"
												/>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						)} */}

						<Grid item xs={12} sm={6} md={3} style={{marginTop:marginTop}}>
							<SelectField
								label="Country of Residence *"
								options={p11Countries}
								value={country_residence}
								onChange={this.selectOnChange}
								placeholder="Select country of residence"
								isMulti={false}
								name="country_residence"
								error={errors.country_residence}
								margin="none"
								required
                fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3} style={{marginBottom:marginBottom}}>
							{/* <PhoneNumberField
								id="office_fax"
								name="office_fax"
								label="Your Skype"
								placeholder="Please enter office fax number"
								fullWidth
								value={office_fax}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.office_fax}
								length={6}
								country_code="+1"
							/> */}
							<TextField
								id="skype"
								name="skype"
								label="Skype ID"
								fullWidth
								autoComplete="skype"
								value={skype}
								onChange={this.onChange}
								error={!isEmpty(errors.skype)}
								helperText={errors.skype}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3} style={{marginBottom:marginBottom}}>
							<PhoneNumberField
								id="office_telephone"
								name="office_telephone"
								label="Office Telephone"
								placeholder="Please enter office telephone number"
								fullWidth
								value={office_telephone}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.office_telephone}
								length={6}
								country_code="+1"
							/>
						</Grid>

						<Grid item xs={12} sm={6} md={3} style={{marginBottom:marginBottom}}>
							<TextField
								// required
								id="office_email"
								name="office_email"
								type="email"
								label="Office Email"
								fullWidth
								autoComplete="email"
								value={office_email}
								onChange={this.onChange}
								error={!isEmpty(errors.office_email)}
								helperText={errors.office_email}
							/>
						</Grid>
						{/* <Grid item xs={12}>
							<YesNoField
								ariaLabel="Do you have any dependents"
								label="Do you have any dependents?"
								value={has_dependents.toString()}
								onChange={this.hasDependentOnChange}
								name="has_dependents"
								error={errors.has_dependents}
								margin="none"
							/>
							{(has_dependents === '1' || has_dependents === 1) && (
								<div>
									<br />
									<FormControl margin="normal" fullWidth error={!isEmpty(errors.dependents)}>
										<DependentLists
											has_dependents={has_dependents}
											checkValidation={this.isValid}
											updateDependent={this.updateDependent}
										/>
										{!isEmpty(errors.dependents) && (
											<FormHelperText>{errors.dependents}</FormHelperText>
										)}
									</FormControl>
									<br />
								</div>
							)}
						</Grid> */}
					</Grid>
				</form>
			</React.Fragment>
		);
	}
}

P11Form2Old.propTypes = {
	addFlashMessage: PropTypes.func.isRequired,
	onChangeForm2: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	setP11FormData: PropTypes.func.isRequired,
	nationalities: PropTypes.array.isRequired,
	p11Countries: PropTypes.array.isRequired,
	form2: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	addFlashMessage,
	onChangeForm2,
	checkError,
	getAPI,
	setP11FormData,
	postAPI,
	setP11Status,
	updateP11Status
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	nationalities: state.options.nationalities,
	p11Countries: state.options.p11Countries,
	form2: state.p11.form2,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(P11Form2Old));
