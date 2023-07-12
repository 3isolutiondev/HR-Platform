import React, { Component } from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import {
	getBioAdress,
	setBioAdress,
	onChangeBioAddress,
	// onChangeMultiSelect,
	onChangeBio,
	checkErrorBio
} from '../../redux/actions/profile/bioAddressAction';
// import BirthNationalities from './BirthNationalities';
import Modal from '../../common/Modal';
import PreferredFieldOfWork from './PreferredFieldOfWork';
import PermanentOrPresentAdresss from './PermanentOrPresentAdresss';
import OfficeInfo from './OfficeInfo';
import { addFlashMessage } from '../../redux/actions/webActions';
import SelectField from '../../common/formFields/SelectField';
import isEmpty from '../../validations/common/isEmpty';
import PhoneNumberField from '../../common/formFields/PhoneNumberField';
import YesNoField from '../../common/formFields/YesNoField';
// import AutocompleteTagsField from '../../common/formFields/AutocompleteTagsField';
import FieldOfWorkPicker from '../../common/formFields/FieldOfWorkPicker';
import { postAPI } from '../../redux/actions/apiActions';
import { YesNoURL } from '../../config/general';
import { validateBiodataAddressAndNationalities } from '../../validations/profile';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconAdd': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#be2126'
	},
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2
	},
	break: {
		marginBottom: '20px'
	},
	paperAddress: {
		padding: theme.spacing.unit * 2
	},
	addMarginBottom: {
		marginBottom: theme.spacing.unit * 2
	},
	customMargin: {
		marginBottom: theme.spacing.unit,
		marginTop: theme.spacing.unit
	},
	overflowVisible: {
		overflow: 'visible'
	},
	displayInline: {
		display: 'inline-block',
		'margin-right': '4px',
		'margin-bottom': '.5em'
	}
});

class BioAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			alertOpen: false
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		// this.multiSelect = this.multiSelect.bind(this);
		this.yesNoChange = this.yesNoChange.bind(this);
		// this.onChangePermanentAddress = this.onChangePermanentAddress.bind(this);
		// this.onChangePresentAddress = this.onChangePresentAddress.bind(this);
		this.phoneOnChange = this.phoneOnChange.bind(this);
		// this.switchAddress = this.switchAddress.bind(this);
		// this.resetPresentAddress = this.resetPresentAddress.bind(this);
		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		// this.onChangeOfficeInfo = this.onChangeOfficeInfo.bind(this);
		// this.onChangeAutocomplete = this.onChangeAutocomplete.bind(this);
	}

	componentDidMount() {
		this.props.getBioAdress(this.props.profileID);
	}
	componentDidUpdate(prevProps) {
		const strForm2 = JSON.stringify(this.props.bioAddress);
		const strPrevForm2 = JSON.stringify(prevProps.bioAddress);
		if (strForm2 !== strPrevForm2) {
			this.isValid();
		}
	}

	isValid() {
		let { errors, isValid } = validateBiodataAddressAndNationalities(this.props.bioAddress);
		this.props.checkErrorBio(errors, isValid);
		return isValid;
	}
	handleOpen() {
		this.setState({ open: true }, () => this.isValid());
	}

	handleClose() {
		if (isEmpty(this.props.bioAddress.errors)) {
			this.setState({ open: false });
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Fill the form Required'
			});
		}
	}
	handleSave() {
		let { errors, isValid } = this.props.bioAddress;

		if (isEmpty(errors) && isValid) {
			this.props
				.postAPI('/api/update-profile-biodata-address-and-nationalities/', this.props.bioAddress)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Successfully updated'
					});
					this.handleClose();
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while updating your data'
					});
				});
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Fill the form Required'
			});
		}
	}

	// resetPresentAddress() {
	// 	this.props.setBioAdress(
	// 		Object.assign(this.props.bioAddress, {
	// 			present_address: {}
	// 		})
	// 	);
	// }

	// switchAddress(e) {
	// 	const yesNoName = e.target.name;
	// 	const yesNoValue = !this.props.bioAddress[e.target.name];
	// 	this.props
	// 		.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
	// 		.then((res) => {
	// 			this.props.onChangeBioAddress(yesNoName, yesNoValue);
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
	// 				type: err.response ? err.response.data.status : 'success',
	// 				text: err.response ? err.response.data.message : 'Update Success'
	// 			});
	// 		});
	// }

	switchOnChange(e) {
		if (this.props.bioAddress[e.target.name]) {
			this.props.onChangeBioAddress(e.target.name, 0);
		} else {
			this.props.onChangeBioAddress(e.target.name, 1);
		}
	}

	yesNoChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeBioAddress(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				this.props.getBioAdress(this.props.profileID);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	// onChangeAutocomplete(name, value) {
	// 	this.props.onChangeBioAddress(name, value);
	// 	this.isValid();
	// }
	// multiSelect(values, e) {
	// 	// if (e.name === 'birth_nationalities') {
	// 	// 	this.props.onChangeMultiSelect(e.name, [ values ]);
	// 	// } else
	// 	if (e.name === 'permanent_country') {
	// 		this.props.onChangeBio(e.name, values, 'permanent');
	// 	} else if (e.name === 'present_country') {
	// 		this.props.onChangeBio(e.name, values, 'present');
	// 	}
	// }
	// onChangePermanentAddress(e) {
	// 	this.props.onChangeBio(e.target.name, e.target.value, 'permanent');
	// }
	// onChangePresentAddress(e) {
	// 	this.props.onChangeBio(e.target.name, e.target.value, 'present');
	// }
	phoneOnChange(phone, name) {
		if (name === 'office_telephone' || name === 'office_fax') {
			this.props.onChangeBioAddress(name, phone);
		} else if (name === 'permanent_telephone' || name === 'permanent_fax') {
			this.props.onChangeBio(name, phone, 'permanent');
		} else {
			this.props.onChangeBio(name, phone, 'present');
		}
	}

	// onChangeOfficeInfo(e) {
	// 	this.props.onChangeBioAddress(e.target.name, e.target.value);
	// }

	onChange(e) {
		this.props.onChangeBioAddress(e.target.name, e.target.value);
		this.isValid();
	}
	render() {
		let { classes, countries, editable } = this.props;
		let {
			errors,
			// permanent_address,
			// present_address,
			field_of_works,
			office_email,
			skype,
			office_telephone,
			accept_employment_less_than_six_month,
			objections_making_inquiry_of_present_employer,
			objection_name,
			objection_email,
			objection_organization,
			objection_position,
			// birth_nationalities,
			preferred_field_of_work,
			// sameWithPermanent,
			// present_nationalities,
			show
		} = this.props.bioAddress;
		let { open, alertOpen } = this.state;
		return (
			<div>
				{show && (
					<Card className={classes.break}>
						<CardContent>
							<Grid container spacing={24}>
								{/* <Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<BirthNationalities birth_nationalities={birth_nationalities} />
								</Grid> */}

								{field_of_works ? (
									<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
										<PreferredFieldOfWork field_of_works={field_of_works} />
										{/* <br /> */}
									</Grid>
								) :  null}
								{editable ? (
									<Grid item xs={2} sm={4} md={3} lg={1} xl={1}>
										<IconButton
											onClick={this.handleOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Edit fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}
								<br />
								{/* <Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<PermanentOrPresentAdresss address={permanent_address} />
								</Grid>
								{!sameWithPermanent && (
									<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
										<PermanentOrPresentAdresss address={present_address} />
									</Grid>
								)} */}

								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<OfficeInfo email={office_email} skype={skype} phone={office_telephone} />
								</Grid>
								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Would you accept employment for less than six months ?
									</Typography>

									{accept_employment_less_than_six_month === 1 ? (
										<Typography variant="subtitle1">Yes</Typography>
									) : (
										<Typography variant="subtitle1">No</Typography>
									)}
								</Grid>
								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Do you have any objections to our making inquiries of your present or last
										employer?
									</Typography>

									{objections_making_inquiry_of_present_employer === 1 ? (
										<div>
											<Typography variant="subtitle1">Yes</Typography>
											<Typography variant="subtitle1" color="primary">
												Present / Last Employer
											</Typography>
											<div>
												<Typography variant="subtitle2" className={classes.displayInline}>
													Name :{' '}
												</Typography>
												<Typography variant="body2" className={classes.displayInline}>
													{objection_name}{' '}
												</Typography>
											</div>
											<div>
												<Typography variant="subtitle2" className={classes.displayInline}>
													Email :{' '}
												</Typography>
												<Typography variant="body2" className={classes.displayInline}>
													{objection_email}{' '}
												</Typography>
											</div>
											<div>
												<Typography variant="subtitle2" className={classes.displayInline}>
													Position :{' '}
												</Typography>
												<Typography variant="body2" className={classes.displayInline}>
													{objection_position}{' '}
												</Typography>
											</div>
											<div>
												<Typography variant="subtitle2" className={classes.displayInline}>
													Organization :{' '}
												</Typography>
												<Typography variant="body2" className={classes.displayInline}>
													{objection_organization}{' '}
												</Typography>
											</div>
											<div />
										</div>
									) : (
										<Typography variant="subtitle1">No</Typography>
									)}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				)}
				{editable ? (
					<Modal
						open={open}
						title="Edit Profile"
						handleClose={() => this.handleClose()}
						maxWidth="lg"
						scroll="body"
						handleSave={() => this.handleSave()}
					>
						{/* <Paper className={classes.root} elevation={1}> */}
						<Grid container spacing={24}>
							<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
								{/* <AutocompleteTagsField
									label="What is your preferred area of expertise?"
									name="preferred_field_of_work"
									value={preferred_field_of_work}
									suggestionURL="/api/field-of-works/suggestions"
									onChange={(name, value) => this.onChangeAutocomplete(name, value)}
									labelField="field"
									error={errors.preferred_field_of_work}
								/> */}
								<FieldOfWorkPicker
									name="preferred_field_of_work"
									field_of_works={preferred_field_of_work}
									onChange={(value, e) => this.onChange({ target: { name: e.name, value: value } })}
									errors={errors.preferred_field_of_work}
									limit={3}
								/>
								<br />
							</Grid>
						</Grid>
						{/* <Grid item xs={12}>
							<Paper className={classes.paperAddress}> */}
						{/* <FormLabel>Permanent Address *</FormLabel>

								<Grid container spacing={24}>
									<Grid item xs={12} sm={12} md={9}>
										<TextField
											required
											id="permanent_address"
											name="permanent_address"
											label="Address"
											fullWidth
											autoComplete="address"
											value={permanent_address.permanent_address}
											onChange={this.onChangePermanentAddress}
											error={!isEmpty(errors.permanent_address)}
											helperText={errors.permanent_address}
											multiline
											rows={2}
										/>
									</Grid>
									<Grid item xs={12} sm={12} md={3}>
										<SelectField
											label="Country *"
											options={countries}
											value={permanent_address.permanent_country}
											onChange={this.multiSelect}
											placeholder="Select country"
											isMulti={false}
											name="permanent_country"
											error={errors.permanent_country}
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
											value={permanent_address.permanent_city}
											onChange={this.onChangePermanentAddress}
											error={!isEmpty(errors.permanent_city)}
											helperText={errors.permanent_city}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<TextField
											required
											id="permanent_postcode"
											name="permanent_postcode"
											label="Post Code"
											fullWidth
											autoComplete="postcode"
											value={permanent_address.permanent_postcode}
											onChange={this.onChangePermanentAddress}
											error={!isEmpty(errors.permanent_postcode)}
											helperText={errors.permanent_postcode}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<PhoneNumberField
											id="permanent_telephone"
											name="permanent_telephone"
											label="Telephone *"
											placeholder="Please enter telephone number"
											fullWidth
											value={permanent_address.permanent_telephone}
											onChange={this.phoneOnChange}
											margin="none"
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
											value={permanent_address.permanent_fax}
											onChange={this.phoneOnChange}
											margin="none"
											error={errors.permanent_fax}
											length={6}
											country_code="+1"
										/>
									</Grid>
								</Grid>
							</Paper>
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
							<Paper className={classnames(classes.paperAddress, classes.addMarginBottom)}>
								<Grid item xs={12}>
									<FormLabel>Present Address *</FormLabel>
									<Grid container spacing={24}>
										<Grid item xs={12} sm={12} md={9}>
											<TextField
												required
												id="present_address"
												name="present_address"
												label="Address"
												fullWidth
												autoComplete="address"
												value={
													isEmpty(present_address.present_address) ? (
														''
													) : (
														present_address.present_address
													)
												}
												onChange={this.onChangePresentAddress}
												error={!isEmpty(errors.present_address)}
												helperText={errors.present_address}
												multiline
												rows={2}
											/>
										</Grid>

										<Grid item xs={12} sm={12} md={3}>
											<SelectField
												label="Country *"
												options={countries}
												value={
													isEmpty(present_address.present_country) ? (
														''
													) : (
														present_address.present_country
													)
												}
												onChange={this.multiSelect}
												placeholder="Select country"
												isMulti={false}
												name="present_country"
												error={errors.present_country}
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
												value={
													isEmpty(present_address.present_city) ? (
														''
													) : (
														present_address.present_city
													)
												}
												onChange={this.onChangePresentAddress}
												error={!isEmpty(errors.present_city)}
												helperText={errors.present_city}
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<TextField
												required
												id="present_postcode"
												name="present_postcode"
												label="Post Code"
												fullWidth
												autoComplete="postcode"
												value={
													isEmpty(present_address.present_postcode) ? (
														''
													) : (
														present_address.present_postcode
													)
												}
												onChange={this.onChangePresentAddress}
												error={!isEmpty(errors.present_postcode)}
												helperText={errors.present_postcode}
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<PhoneNumberField
												id="present_telephone"
												name="present_telephone"
												label="Telephone *"
												placeholder="Please enter telephone number"
												fullWidth
												value={
													isEmpty(present_address.present_telephone) ? (
														''
													) : (
														present_address.present_telephone
													)
												}
												onChange={this.phoneOnChange}
												margin="none"
												error={errors.present_telephone}
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
												value={
													isEmpty(present_address.present_fax) ? (
														''
													) : (
														present_address.present_fax
													)
												}
												onChange={this.phoneOnChange}
												margin="none"
												error={errors.present_fax}
												length={6}
												country_code="+1"
											/>
										</Grid>
									</Grid>
								</Grid> */}
						{/* </Paper>
						</Grid> */}
						{/* )} */}
						<Grid container spacing={24} alignItems="flex-end">
							{/* <Grid item xs={12} sm={12} md={4}>
								<TextField
									id="skype"
									name="skype"
									label="Your Skype"
									fullWidth
									autoComplete="skype"
									value={skype}
									onChange={this.onChange}
									error={!isEmpty(errors.skype)}
									helperText={errors.skype}
									margin="normal"
									className={classes.customMargin}
								/>
							</Grid> */}
							<Grid item xs={12} sm={12} md={6}>
								<PhoneNumberField
									id="office_telephone"
									name="office_telephone"
									label="Office Telephone"
									placeholder="Please enter office telephone number"
									fullWidth
									value={office_telephone}
									onChange={this.phoneOnChange}
									margin="normal"
									error={errors.office_telephone}
									length={6}
									country_code="+1"
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								{/* <PhoneNumberField
									id="office_fax"
									name="office_fax"
									label="Office Fax"
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
									id="office_email"
									name="office_email"
									label="Office Email"
									fullWidth
									value={office_email}
									onChange={this.onChange}
									error={!isEmpty(errors.office_email)}
									helperText={errors.office_email}
									margin="normal"
									className={classes.customMargin}
								/>
							</Grid>
						</Grid>
						{/* <Grid container spacing={24}>
							<Grid item xs={12} sm={12}>
								<SelectField
									label="Present Nationality"
									options={nationalities}
									value={present_nationalities}
									placeholder="Select nationality"
									isMulti={false}
									name="present_nationalities"
									error={errors.present_nationalities}
									onChange={this.multiSelect}
								/>
							</Grid>
							{/* <Grid item xs={6} sm={6}>
								<SelectField
									label="Birth Nationality"
									options={nationalities}
									value={birth_nationalities}
									onChange={this.multiSelect}
									placeholder="Select nationality"
									isMulti={false}
									name="birth_nationalities"
								/>
							</Grid>
						</Grid> */}
						<Grid container spacing={8}>
							<Grid item xs={12} sm={12}>
								<YesNoField
									ariaLabel="accept_employment"
									label="Would you accept employment for less than six months ?"
									value={accept_employment_less_than_six_month.toString()}
									onChange={this.switchOnChange}
									name="accept_employment_less_than_six_month"
									error={errors.accept_employment_less_than_six_month}
									margin="normal"
								/>
							</Grid>
							{/* <Grid item xs={12} sm={12}>
								<YesNoField
									ariaLabel="present_employer"
									label="Do you have any objections to our making inquiries of your present or last employer? If yes, please, enter a contact from your current our last organization that we can contact."
									value={objections_making_inquiry_of_present_employer.toString()}
									onChange={this.yesNoChange}
									name="objections_making_inquiry_of_present_employer"
									error={errors.objections_making_inquiry_of_present_employer}
									margin="none"
								/>
							</Grid> */}
							{/* {(objections_making_inquiry_of_present_employer.toString() === '1' ||
								objections_making_inquiry_of_present_employer === 1) && (
								<Grid item xs={12}>
									<Card elevation={1} className={classes.overflowVisible}>
										<CardContent>
											<FormLabel>Your Present / Last Employer *</FormLabel>
											<Grid container spacing={16}>
												<Grid item xs={12} sm={6}>
													<TextField
														required
														id="objection_name"
														name="objection_name"
														label="Name"
														fullWidth
														autoComplete="objection_name"
														value={objection_name}
														onChange={this.onChange}
														error={!isEmpty(errors.objection_name)}
														helperText={errors.objection_name}
														margin="dense"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														required
														id="objection_email"
														name="objection_email"
														label="Email"
														fullWidth
														autoComplete="objection_email"
														value={objection_email}
														onChange={this.onChange}
														error={!isEmpty(errors.objection_email)}
														helperText={errors.objection_email}
														margin="dense"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														id="objection_position"
														name="objection_position"
														label="Position"
														fullWidth
														autoComplete="objection_position"
														value={objection_position}
														onChange={this.onChange}
														error={!isEmpty(errors.objection_position)}
														helperText={errors.objection_position}
														margin="dense"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														id="objection_organization"
														name="objection_organization"
														label="Organization"
														fullWidth
														autoComplete="objection_organization"
														value={objection_organization}
														onChange={this.onChange}
														error={!isEmpty(errors.objection_organization)}
														helperText={errors.objection_organization}
														margin="dense"
													/>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
							)} */}
						</Grid>
						{/* </Paper> */}
						<br />
					</Modal>
				): null}
			</div>
		);
	}
}

BioAddress.propTypes = {
	getBioAdress: PropTypes.func.isRequired,
	onChangeBioAddress: PropTypes.func.isRequired,
	// onChangeMultiSelect: PropTypes.func.isRequired,
	onChangeBio: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	setBioAdress: PropTypes.func.isRequired,
	checkErrorBio: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	countries: state.options.countries,
	bioAddress: state.bioAddress
	// nationalities: state.options.nationalities
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getBioAdress,
	onChangeBioAddress,
	// onChangeMultiSelect,
	onChangeBio,
	postAPI,
	addFlashMessage,
	setBioAdress,
	checkErrorBio
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BioAddress));
