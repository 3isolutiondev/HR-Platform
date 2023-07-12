import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';
// import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import Email from '@material-ui/icons/Email';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
// import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
// import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
// import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
// import { faSitemap } from '@fortawesome/free-solid-svg-icons/faSitemap';
import { setLoading } from '../../../redux/actions/p11Actions';

import {
	borderColor,
	primaryColor,
	white,
	primaryColorRed,
	primaryColorGreen,
	primaryColorBlue,
	blueIMMAP,
	darkText,
	green
} from '../../../config/colors';
import {
	getBioAdress,
	setBioAdress,
	onChangeBioAddress,
	// onChangeMultiSelect,
	onChangeBio,
	checkErrorBio
} from '../../../redux/actions/profile/bioAddressAction';
// import BirthNationalities from './BirthNationalities';
import Modal from '../../../common/Modal';
// import PreferredFieldOfWork from './PreferredFieldOfWork';
// import PermanentOrPresentAdresss from './PermanentOrPresentAdresss';
// import OfficeInfo from './OfficeInfo';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
// import SelectField from '../../../common/formFields/SelectField';
import isEmpty from '../../../validations/common/isEmpty';
import PhoneNumberField from '../../../common/formFields/PhoneNumberField';
import YesNoField from '../../../common/formFields/YesNoField';
// import AutocompleteTagsField from '../../../common/formFields/AutocompleteTagsField';
import FieldOfWorkPicker from '../../../common/formFields/FieldOfWorkPicker';
import { postAPI } from '../../../redux/actions/apiActions';
import { YesNoURL } from '../../../config/general';
import { validateBiodataAddressAndNationalities } from '../../../validations/profile';
import Skeleton from 'react-loading-skeleton';
import SectorPicker from '../../../common/formFields/SectorPicker';
// import PreferredFieldOfWork from '../../profile/PreferredFieldOfWork';
// import fileDownload from 'js-file-download';

class FieldofWorks extends Component {
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
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getBioAdress(this.props.profileID);
		}

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
			this.props.setLoading(true);
			this.props
				.postAPI('/api/update-profile-biodata-address-and-nationalities/', this.props.bioAddress)
				.then((res) => {
					this.props.setLoading(false);
					this.props.addFlashMessage({
						type: 'success',
						text: 'Successfully updated'
					});
					this.props.getBioAdress(this.props.profileID);
					this.props.profileLastUpdate();
					this.handleClose();
				})
				.catch((err) => {
					this.props.setLoading(false);
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
				this.props.profileLastUpdate();
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
		const {
      classes, editable,
      // p11Countries
    } = this.props;

		const {
			errors,
			// permanent_address,
			// present_address,
			field_of_works,
			sectors,
			office_email,
			// skype,
			office_telephone,
			accept_employment_less_than_six_month,
			// objections_making_inquiry_of_present_employer,
			// objection_name,
			// objection_email,
			// objection_organization,
			// objection_position,
			// birth_nationalities,
			preferred_field_of_work,
			preferred_sector,
			// sameWithPermanent,
			// present_nationalities,
			show,
			share_profile_consent,
			hear_about_us_from,
			other_text
		} = this.props.bioAddress;

		const {
      open,
      // alertOpen
    } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							{editable ? (
								<div className={classes.editIcon}>
									<IconButton
										style={{ display: 'inline-block', marginLeft: '8px' }}
										onClick={this.handleOpen}
										className={classes.button}
										aria-label="Edit"
									>
										<Edit fontSize="small" className={classes.iconAdd} />
									</IconButton>
								</div>
							) : null}
							<div className={classes.section}>
								<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
									Areas of Expertise
								</Typography>
								{field_of_works.length > 0 ? (
									field_of_works.map((fieldOfWork) => {
										let chipLabel =
											fieldOfWork.label.length < 25
												? fieldOfWork.label
												: fieldOfWork.label.substring(0, 21) + '...';
										return (
											<Tooltip
												title={fieldOfWork.label}
												key={'chip-field-of-work-' + fieldOfWork.value}
											>
												<Chip label={chipLabel} className={classes.chip} />
											</Tooltip>
										);
									})
								) : (
									<Typography variant="subtitle2" color="primary" className={classes.subtitle}>
										<b>Please update your areas of expertise</b>
									</Typography>
								)}
							</div>
							<div className={classes.section}>
								<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
									Sectors
								</Typography>
								{sectors.length > 0 ? (
									sectors.map((sector) => {
										let chipLabel =
											sector.label.length < 25
												? sector.label
												: sector.label.substring(0, 21) + '...';
										return (
											<Tooltip
												title={sector.label}
												key={'chip-sector-' + sector.value}
											>
												<Chip label={chipLabel} className={classes.chip} />
											</Tooltip>
										);
									})
								) : (
									<Typography variant="subtitle2" color="primary" className={classes.subtitle}>
										<b>Please update your Sector</b>
									</Typography>
								)}
							</div>
							{(!isEmpty(office_email) || !isEmpty(office_telephone)) ? (
								<div className={classes.section}>
									<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
										Office Information
									</Typography>
									{!isEmpty(office_email) ? (
										<Link
											variant="subtitle1"
											className={classes.email}
											href={'mailto:' + office_email}
										>
											<Email fontSize="small" className={classes.iconEmail} /> {office_email}
										</Link>
									) : null}
									{!isEmpty(office_telephone) ? (
										<Typography
											variant="subtitle1"
											className={classname(classes.email, classes.phone)}
										>
											<PhoneIphone
												fontSize="small"
												className={classname(classes.iconEmail, classes.iconPhone)}
											/>{' '}
											{office_telephone}
										</Typography>
									) : null}
								</div>
							) : null}
							<div className={classes.section}>
								<Typography
									variant="subtitle1"
									className={classname(classes.titleSection, classes.noPaddingBottom)}
									color="primary"
								>
									<span className={classes.titleWithIcon}>
										Accept employment for less than six months ?{' '}
									</span>
									{accept_employment_less_than_six_month == 1 ? (
										<FontAwesomeIcon icon={faCheckCircle} size="lg" className={classes.yes} />
									) : (
										<FontAwesomeIcon icon={faTimesCircle} size="lg" className={classes.no} />
									)}
								</Typography>
							</div>
							{/* <div className={classname(classes.section, classes.noBorderBottom)}>
								<Typography
									variant="subtitle1"
									color="primary"
									className={
										objections_making_inquiry_of_present_employer == 1 ? (
											classes.titleSection
										) : (
											classname(classes.titleSection, classes.noPaddingBottom)
										)
									}
								>
									<span className={classes.titleWithIcon}>
										Do you have any objections to our making inquiries of your present or last
										employer?
									</span>
									{objections_making_inquiry_of_present_employer == 1 ? (
										<FontAwesomeIcon icon={faCheckCircle} size="lg" className={classes.yes} />
									) : (
										<FontAwesomeIcon icon={faTimesCircle} size="lg" className={classes.no} />
									)}
								</Typography>
								{objections_making_inquiry_of_present_employer == 1 ? (
									<Card>
										<CardContent className={classes.card}>
											<div className={classname(classes.section, classes.noBorderBottom)}>
												<Typography
													variant="subtitle1"
													color="primary"
													className={classes.titleSection}
												>
													Present / Last Employer
												</Typography>
												<Typography variant="subtitle2" className={classes.envelope}>
													<FontAwesomeIcon
														icon={faEnvelope}
														size="sm"
														className={classes.employerIcon}
													/>
													{objection_email}
												</Typography>
												<Typography variant="subtitle2" className={classes.person}>
													<FontAwesomeIcon
														icon={faUser}
														size="sm"
														className={classes.employerIcon}
													/>
													{objection_name}
												</Typography>
												{(!isEmpty(objection_position) || !isEmpty(objection_organization)) ? (
													<Typography variant="subtitle2" className={classes.position}>
														<FontAwesomeIcon
															icon={faSitemap}
															size="sm"
															className={classes.employerIcon}
														/>
														{!isEmpty(objection_position) ? objection_position : ""}
														{!isEmpty(objection_position) && !isEmpty(objection_organization) ? ', ' : ""}
														{!isEmpty(objection_organization) ? objection_organization : ''}
													</Typography>
												): null}
											</div>
										</CardContent>
									</Card>
								) : null}
							</div> */}
							<div className={classes.section}>
								<Typography
									variant="subtitle1"
									color="primary"
									className={
										share_profile_consent == 1 ? (
											classes.titleSection
										) : (
											classname(classes.titleSection, classes.noPaddingBottom)
										)
									}
								>
									<span className={classes.titleWithIcon}>
									Do you give your consent to share your profile with a potential partner?
									</span>
									{share_profile_consent == 1 ? (
										<FontAwesomeIcon icon={faCheckCircle} size="lg" className={classes.yes} />
									) : (
										<FontAwesomeIcon icon={faTimesCircle} size="lg" className={classes.no} />
									)}
								</Typography>
							</div>
							{ hear_about_us_from &&
								<div className={classname(classes.section, classes.noBorderBottom)}>
									<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
										How did you hear about us ?
									</Typography>
									 { hear_about_us_from == 'Other' ?

											<Tooltip title={other_text}>
													<Chip label={other_text} className={classes.chip} />
											</Tooltip>
									   :  
											<Tooltip title={hear_about_us_from}>
													<Chip label={hear_about_us_from} className={classes.chip} />
											</Tooltip>
									 }
								</div>
							 }
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
												onChange={(value, e) =>
													this.onChange({ target: { name: e.name, value: value } })}
												errors={errors.preferred_field_of_work}
												limit={3}
											/>
											<br />
										</Grid>
									</Grid>
									<Grid container spacing={24}>
										<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
											{/* <AutocompleteTagsField
									label="What is your preferred field of work?"
									name="preferred_field_of_work"
									value={preferred_field_of_work}
									suggestionURL="/api/field-of-works/suggestions"
									onChange={(name, value) => this.onChangeAutocomplete(name, value)}
									labelField="field"
									error={errors.preferred_field_of_work}
								/> */}
											<SectorPicker
												name="preferred_sector"
												sectors={preferred_sector}
												onChange={(value, e) =>
													this.onChange({ target: { name: e.name, value: value } })}
												errors={errors.preferred_sector}
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
										{/* {(objections_making_inquiry_of_present_employer.toString() === '1' || objections_making_inquiry_of_present_employer === 1) ? (
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
										) : null} */}
                    <Grid item xs={12} sm={12}>
											<YesNoField
												ariaLabel="share_profile_consent"
												label="Do you give your consent to share your profile with a potential partner?"
												value={share_profile_consent.toString()}
												onChange={this.yesNoChange}
												name="share_profile_consent"
												error={errors.share_profile_consent}
												margin="normal"
											/>
										</Grid>
									</Grid>
									{/* </Paper> */}
									<br />
								</Modal>
							) : null}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getBioAdress,
	onChangeBioAddress,
	onChangeBio,
	postAPI,
	addFlashMessage,
	setBioAdress,
	checkErrorBio,
	setLoading,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	p11Countries: state.options.p11Countries,
	bioAddress: state.bioAddress
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	section: {
		padding: theme.spacing.unit * 2,
		borderBottom: '1px solid ' + borderColor,
		position: 'relative'
	},
	noBorderBottom: {
		borderBottom: 'none !important'
	},
	card: {
		padding: '0 !important',
		position: 'relative'
	},
	button: {
		position: 'absolute',
		right: 0,
		'&:hover': {
			backgroundColor: primaryColor
		},
		'&:hover $iconAdd': {
			color: white
		},
		top: -5
	},
	iconAdd: {
		color: primaryColor
	},
	editIcon: {
		position: 'absolute',
		right: theme.spacing.unit / 2,
		top: theme.spacing.unit,
		zIndex: 999
	},
	titleSection: {
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700,
		lineHeight: 1.5
	},
	chip: {
		marginRight: theme.spacing.unit / 2,
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)',
		// border: '1px solid ' + primaryColor,
		color: primaryColor
	},
	email: {
		color: blueIMMAP,
		marginLeft: theme.spacing.unit / 2
	},
	iconEmail: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2
	},
	phone: {
		color: darkText
	},
	iconPhone: {
		color: darkText
	},
	yes: {
		color: green
	},
	no: {
		color: primaryColor
	},
	noPaddingBottom: {
		paddingBottom: 0
	},
	titleWithIcon: {
		marginRight: theme.spacing.unit
	},
	person: {
		color: darkText,
		textTransform: 'capitalize',
		marginBottom: theme.spacing.unit
	},
	position: {
		color: primaryColor,
		textTransform: 'capitalize',
		marginBottom: theme.spacing.unit
	},
	employerIcon: {
		marginRight: theme.spacing.unit,
		width: '1.25em !important'
	},
	envelope: {
		color: blueIMMAP,
		marginBottom: theme.spacing.unit
	},
	loading: {
		marginRight: theme.spacing.unit,
		marginLeft: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FieldofWorks));
