import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BirthNationalities from './BirthNationalities';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import PreferredFieldOfWork from './PreferredFieldOfWork';
import P11Address from './P11Address';
import OfficeInfo from './OfficeInfo';
import {
	getBioAdress,
	onChangeBioAddress,
	onChangeMultiSelect,
	onChangePermanentAddress
} from '../../redux/actions/profile/bioAddressAction';
import Modal from '../../common/Modal';
import SelectField from '../../common/formFields/SelectField';
import isEmpty from '../../validations/common/isEmpty';
import PhoneNumberField from '../../common/formFields/PhoneNumberField';
import YesNoField from '../../common/formFields/YesNoField';
import AutocompleteTagsField from '../../common/formFields/AutocompleteTagsField';
import { postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

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
	}
});

class BioAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.onChangeAutocomplete = this.onChangeAutocomplete.bind(this);
		this.multiSelect = this.multiSelect.bind(this);
		this.onChangePermanentAddress = this.onChangePermanentAddress.bind(this);
		this.phoneOnChange = this.phoneOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getBioAdress(this.props.profileID);
	}

	handleOpen() {
		this.setState({ open: true });
	}

	handleClose() {
		this.setState({ open: false });
	}
	handleSave() {
		let bioAddressData = this.props.bioAddress;
		bioAddressData.permanent_address.permanent_country = bioAddressData.permanent_address.permanent_country.value;
		bioAddressData.present_address.present_country = bioAddressData.present_address.present_country.value;

		this.props
			.postAPI('/api/update-profile-biodata-address-and-nationalities/', bioAddressData)
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
	}

	switchOnChange(e) {
		if (this.props.bioAddress[e.target.name]) {
			this.props.onChangeBioAddress(e.target.name, 0);
		} else {
			this.props.onChangeBioAddress(e.target.name, 1);
		}
	}
	onChangeAutocomplete(name, value) {
		this.props.onChangeBioAddress(name, value);
	}
	multiSelect(values, e) {
		if (e.name === 'birth_nationalities') {
			this.props.onChangeMultiSelect(e.name, [ values ]);
		} else if (e.name === 'permanent_country') {
			this.props.onChangePermanentAddress(e.name, values);
		}
	}
	onChangePermanentAddress(e) {
		this.props.onChangePermanentAddress(e.target.name, e.target.value);
	}
	phoneOnChange(phone, name, errors) {
		// let phoneErrors = this.props.errors;
		// if (!isEmpty(errors)) {
		//   phoneErrors[name] = errors[name];
		// }
		// this.props.checkError(phoneErrors, isEmpty(phoneErrors));
		// this.props.onChangeForm2(name, phone);
		if (name === 'office_telephone' || name === 'office_fax') {
			this.props.onChangeBioAddress(name, phone);
		} else {
			this.props.onChangePermanentAddress(name, phone);
		}
	}

	onChangeOfficeInfo(e) {
		this.props.onChangeBioAddress(e.target.name, e.target.value);
	}
	render() {
		let { classes, errors, countries, nationalities } = this.props;
		let {
			permanent_address,
			present_address,
			field_of_works,
			office_email,
			office_fax,
			office_telephone,
			accept_employment_less_than_six_month,
			objections_making_inquiry_of_present_employer,
			birth_nationalities,
			preferred_field_of_work
		} = this.props.bioAddress;
		let { open } = this.state;
		return (
			<div>
				<Card>
					<CardContent>
						<Grid container spacing={24}>
							<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
								<BirthNationalities birth_nationalities={birth_nationalities} />
							</Grid>
							<Grid item lg={1} xs={2} sm={4} md={3} xl={1}>
								<IconButton onClick={this.handleOpen} className={classes.button} aria-label="Delete">
									<Edit fontSize="small" className={classes.iconAdd} />
								</IconButton>
							</Grid>
							<br />
							{field_of_works && (
								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<PreferredFieldOfWork field_of_works={field_of_works} />
									<br />
								</Grid>
							)}
							<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
								<P11Address address={permanent_address ? permanent_address[0] : present_address[0]} />
							</Grid>

							<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
								<OfficeInfo email={office_email} fax={office_fax} phone={office_telephone} />
							</Grid>
							<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
								<Typography variant="h6" color="primary">
									Accept employment for less than six months
								</Typography>

								{accept_employment_less_than_six_month === 1 ? (
									<Typography variant="subtitle1">Yes</Typography>
								) : (
									<Typography variant="subtitle1">No</Typography>
								)}
							</Grid>
							<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
								<Typography variant="h6" color="primary">
									Any objections to our making inquiries of your present employer
								</Typography>

								{objections_making_inquiry_of_present_employer === 1 ? (
									<Typography variant="subtitle1">Yes</Typography>
								) : (
									<Typography variant="subtitle1">No</Typography>
								)}
							</Grid>
						</Grid>
					</CardContent>
				</Card>

				<Modal
					open={open}
					title="Edit Profile"
					handleClose={() => this.handleClose()}
					fullWidth={true}
					maxWidth="md"
					scroll="body"
					handleSave={() => this.handleSave()}
				>
					{/* <Paper className={classes.root} elevation={1}> */}
					<Grid container spacing={24}>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							<AutocompleteTagsField
								label="What is your preferred area of expertise?"
								name="preferred_field_of_work"
								value={preferred_field_of_work}
								suggestionURL="/api/field-of-works/suggestions"
								onChange={(name, value) => this.onChangeAutocomplete(name, value)}
								labelField="field"
							/>
							<br />
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
							<FormLabel>Permanent Address *</FormLabel>
							<TextField
								required
								id="permanent_address"
								name="permanent_address"
								label="Address"
								fullWidth
								autoComplete="address"
								value={permanent_address[0].permanent_address}
								onChange={this.onChangePermanentAddress}
								error={!isEmpty(errors.permanent_address)}
								helperText={errors.permanent_address}
								multiline
								rows={2}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={24}>
						<Grid item xs={12} sm={6}>
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
						<Grid item xs={12} sm={6}>
							<SelectField
								label="Country *"
								options={countries}
								value={permanent_address[0].permanent_country}
								onChange={this.multiSelect}
								placeholder="Select country"
								isMulti={false}
								name="permanent_country"
								error={errors.permanent_country}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="permanent_city"
								name="permanent_city"
								label="City"
								fullWidth
								autoComplete="city"
								value={permanent_address[0].permanent_city}
								onChange={this.onChangePermanentAddress}
								error={!isEmpty(errors.permanent_city)}
								helperText={errors.permanent_city}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="permanent_postcode"
								name="permanent_postcode"
								label="Post Code"
								fullWidth
								autoComplete="postcode"
								value={permanent_address[0].permanent_postcode}
								onChange={this.onChangePermanentAddress}
								error={!isEmpty(errors.permanent_postcode)}
								helperText={errors.permanent_postcode}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<PhoneNumberField
								id="permanent_telephone"
								name="permanent_telephone"
								label="Telephone *"
								placeholder="Please enter telephone number"
								fullWidth
								value={permanent_address[0].permanent_telephone}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.permanent_telephone}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<PhoneNumberField
								id="permanent_fax"
								name="permanent_fax"
								label="Fax"
								placeholder="Please enter fax number"
								fullWidth
								value={permanent_address[0].permanent_fax}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.permanent_fax}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={24}>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="email"
								name="email"
								label="Email "
								fullWidth
								value={office_email}
								onChange={this.onChangeOfficeInfo}
								error={!isEmpty(errors.permanent_address)}
								helperText={errors.permanent_address}
								multiline
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
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
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<PhoneNumberField
								id="office_fax"
								name="office_fax"
								label="Office Fax"
								placeholder="Please enter office fax number"
								fullWidth
								value={office_fax}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.office_fax}
							/>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<YesNoField
							ariaLabel="accept_employment"
							label="Accept employment for less than six months"
							value={accept_employment_less_than_six_month.toString()}
							onChange={this.switchOnChange}
							name="accept_employment_less_than_six_month"
							error={errors.become_roster}
							margin="dense"
						/>
					</Grid>
					<Grid item xs={12}>
						<YesNoField
							ariaLabel="present_employer"
							label="Any objections to our making inquiries of your present employer"
							value={objections_making_inquiry_of_present_employer.toString()}
							onChange={this.switchOnChange}
							name="objections_making_inquiry_of_present_employer"
							error={errors.become_roster}
							margin="dense"
						/>
					</Grid>
					{/* </Paper> */}
					<br />
				</Modal>
			</div>
		);
	}
}

BioAddress.propTypes = {
	getBioAdress: PropTypes.func.isRequired,
	onChangeBioAddress: PropTypes.func.isRequired,
	onChangeMultiSelect: PropTypes.func.isRequired,
	onChangePermanentAddress: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	countries: state.options.countries,
	errors: state.p11.errors,
	bioAddress: state.bioAddress,
	nationalities: state.options.nationalities
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getBioAdress,
	onChangeBioAddress,
	onChangeMultiSelect,
	onChangePermanentAddress,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BioAddress));
