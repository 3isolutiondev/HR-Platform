/** import React and PropTypes */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/** import custom components needed for this component */
import YesNoField from '../../common/formFields/YesNoField';
import EmploymentRecordLists from './employmentRecords/EmploymentRecordLists';
import PermanentCivilServantLists from './permanentCivilServants/PermanentCivilServantLists';

import PublicationLists from './publications/PublicationLists';
import Switch from '@material-ui/core/Switch';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
	onChangeForm5,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { getAPI, postAPI } from '../../redux/actions/apiActions';

/** import configuration value and validation helper */
import { YesNoURL } from '../../config/general';
import { validateP11Form5 } from '../../validations/p11';
import isEmpty from '../../validations/common/isEmpty';


/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	overflowVisible: {
		overflow: 'visible'
	}
});

/**
 * P11Form5 is a component to show step5 on p11 page
 *
 * @name P11Form5
 * @component
 * @category Page
 * @subcategory P11
 *
 */
class P11Form5 extends Component {
	constructor(props) {
		super(props);
		this.yesNoChange = this.yesNoChange.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.getP11();
	}

  /**
   * getP11 is a function to get step 5 form data
   */
	getP11() {
		this.props
			.getAPI('/api/p11-profile-form-5')
			.then((res) => {
				let { form5 } = this.props;
				Object.keys(res.data.data)
					.filter((key) => key in form5)
					.forEach((key) => (form5[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form5', form5).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

  /**
   * isValid is a function to check if step5 form data is valid
   */
	isValid() {
		let { errors, isValid } = validateP11Form5(this.props.form5);
		this.props.updateP11Status(5, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	switchOnChange(e) {
		const yesNoName = e.target.name;
		let yesNoValue = this.props.form5[e.target.name];
		if (yesNoValue) {
			yesNoValue = 0;
		} else {
			yesNoValue = 1;
		}

		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm5(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				this.getP11();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

  /**
   * onChange is a function to handle change of data coming from a field
   * @param {Event} e
   */
	onChange(e) {
		this.props.onChangeForm5(e.target.name, e.target.value).then(() => {
			this.isValid();
		});
	}

  /**
   * yesNoChange is a function to handle change of data coming from a yes no field
   * @param {Event} e
   */
	yesNoChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm5(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				this.getP11();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	render() {
		let {
			employment_records_counts,
			objections_making_inquiry_of_present_employer,
			permanent_civil_servant,
			objection_name,
			objection_email,
			objection_position,
			objection_organization
		} = this.props.form5;
		let { errors, countries, classes } = this.props;

		let {
			// professional_societies_counts,
			publications_counts,
			// has_professional_societies,
			has_publications
		} = this.props.form5;

		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<FormControl margin="none" fullWidth>
						<FormControlLabel
							label="Have you written/co-written any publication ?"
							control={
								<Switch
									checked={has_publications === 1 ? true : false}
									onChange={this.switchOnChange}
									color="primary"
									name="has_publications"
								/>
							}
						/>
					</FormControl>
					{has_publications === 1 ? (
						<FormControl margin="none" fullWidth error={!isEmpty(errors.publications_counts)}>
							<FormLabel>List any significant publications you have written/co-written</FormLabel>
							<br />
							<PublicationLists
								checkValidation={this.isValid}
								getP11={this.getP11}
								countries={countries}
							/>
							{(!isEmpty(errors.publications_counts) || publications_counts < 1) ? (
								<FormHelperText>{errors.publications_counts}</FormHelperText>
							) : null}
						</FormControl>
					) : null}
					<br />
					<br />
				</Grid>
				<Grid item xs={12}>
					<FormControl margin="none" fullWidth error={!isEmpty(errors.employment_records_counts)}>
						<FormLabel>
							EMPLOYMENT HISTORY: Starting with your current position, list in reverse order every employment
							you have had. Use a separate ROW for each post.
							{' '}
						</FormLabel>
						<br />
						<EmploymentRecordLists
							checkValidation={this.isValid}
							getP11={this.getP11}
							countries={countries}
						/>
						{(!isEmpty(errors.employment_records_counts) || employment_records_counts < 1) ? (
							<FormHelperText>{errors.employment_records_counts}</FormHelperText>
						) : null}
					</FormControl>
				</Grid>
				{/* <Grid item xs={12}>
					<YesNoField
						ariaLabel="objections_making_inquiry_of_present_employer"
						label="Do you have any objections to our making inquiries of your present or former employer? If no, please enter a contact details from your current our former organization that we can contact."
						value={objections_making_inquiry_of_present_employer.toString()}
						onChange={this.yesNoChange}
						name="objections_making_inquiry_of_present_employer"
						error={errors.objections_making_inquiry_of_present_employer}
						margin="dense"
					/>
				</Grid> */}
				{/* {(objections_making_inquiry_of_present_employer.toString() === '1' ||
					objections_making_inquiry_of_present_employer === 1) ? (
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
				<Grid item xs={12}>
					<YesNoField
						ariaLabel="permanent_civil_servant"
						label="Are you or have you ever been a permanent civil servant in your government's employ?"
						value={permanent_civil_servant.toString()}
						onChange={this.yesNoChange}
						name="permanent_civil_servant"
						error={errors.permanent_civil_servant}
						margin="dense"
					/>
					{(permanent_civil_servant === true || permanent_civil_servant.toString() === '1') ? (
						<FormControl margin="normal" fullWidth error={!isEmpty(errors.permanent_civil_servants_counts)}>
							<PermanentCivilServantLists
								permanent_civil_servant={permanent_civil_servant}
								checkValidation={this.isValid}
								getP11={this.getP11}
							/>
							{!isEmpty(errors.permanent_civil_servants_counts) ? (
								<FormHelperText>{errors.permanent_civil_servants_counts}</FormHelperText>
							) : null}
						</FormControl>
					) : null}
				</Grid>
			</Grid>
		);
	}
}

P11Form5.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * checkError is a prop containing redux action to check step5 error
   */
	checkError: PropTypes.func.isRequired,
  /**
   * onChangeForm5 is a prop containing redux action to handle change of data on redux
   */
	onChangeForm5: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * setP11FormData is a prop containing redux action to set form data based on each step
   */
	setP11FormData: PropTypes.func.isRequired,
  /**
   * form5 is a prop containing data of step5 form
   */
	form5: PropTypes.object.isRequired,
  /**
   * countries is a prop containing list of countries
   */
	countries: PropTypes.array.isRequired,
  /**
   * errors is a prop containing an error
   */
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	checkError,
	onChangeForm5,
	addFlashMessage,
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
	form5: state.p11.form5,
	countries: state.options.countries,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status,
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(P11Form5));
