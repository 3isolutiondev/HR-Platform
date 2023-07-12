import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SelectField from '../../common/formFields/SelectField';
import { genderData } from '../../config/options';
import YesNoField from '../../common/formFields/YesNoField';
import SearchField from '../../common/formFields/SearchField';
import isEmpty from '../../validations/common/isEmpty';
import PhoneNumberField from '../../common/formFields/PhoneNumberField';

import {
	onChangeForm1,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { getYears, getP11ImmapOffices, getLineManagers } from '../../redux/actions/optionActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { validateP11Form1 } from '../../validations/p11';
// import PhoneNumber from './phoneNumber/PhoneNumberLists';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { YesNoURL } from '../../config/general';

import Loadable from 'react-loadable';
import LoadingSpinner from '../../common/LoadingSpinner';
import DatePickerField from '../../common/formFields/DatePickerField';
import moment from 'moment';

const PhoneNumber = Loadable({
	loader: () => import('./phoneNumber/PhoneNumberLists'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		textTransform: 'capitalize'
	},
	noMarginTop: {
		marginTop: 0
	},
	paper: {
		...theme.mixins.gutters(),
		padding: theme.spacing.unit * 2
	},
	immaperPaper: {
		...theme.mixins.gutters(),
		padding: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 3
	},
	check: {
		padding: '8px 12px'
	},
	immapSwitch: {
		'flex-direction': 'row'
	},
	immapSwitchLabel: {
		'margin-left': 0
	}
});

class P11Form1 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isMounted: false,
      isLoading: false,
      keyword: ''
		};
    this.timer = null;

		this.onChange = this.onChange.bind(this);
		this.multiSelect = this.multiSelect.bind(this);
		this.getP11 = this.getP11.bind(this);
		this.isValid = this.isValid.bind(this);
		this.yesNoOnChange = this.yesNoOnChange.bind(this);
		this.getPhoneCount = this.getPhoneCount.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.dateOnChange = this.dateOnChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.phoneOnChange = this.phoneOnChange.bind(this);

    this.timerCheck = this.timerCheck.bind(this);
	}

	componentDidMount() {
		this.props.getYears();
		this.props.getP11ImmapOffices();
		this.setState({ isMounted: true }, () => {
			this.getP11(true);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const prevFormData = JSON.stringify(prevProps.form1);
		const currentFormData = JSON.stringify(this.props.form1);
		if (prevFormData !== currentFormData) {
			this.isValid();
		}

    if (this.state.keyword !== prevState.keyword) {
      this.timerCheck();
    }
	}

	componentWillUnmount() {
		this.setState({ isMounted: false });
	}

	getP11(first = false) {
		this.props
			.getAPI('/api/p11-profile-form-1')
			.then((res) => {
				let tempData = res.data.data;
				tempData.immap_office = !isEmpty(res.data.data.p11_immap_office)
					? {
						value: res.data.data.p11_immap_office.id,
						label:
							res.data.data.p11_immap_office.country.name +
							' - (' +
							res.data.data.p11_immap_office.city +
							')'
					}
					: '';

				let { form1 } = this.props;
				Object.keys(tempData).filter((key) => key in form1).forEach((key) => (form1[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}

				this.props.setP11FormData('form1', form1).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

	getPhoneCount() {
		this.props
			.getAPI('/api/p11-phones')
			.then((res) => {
				this.props.onChangeForm1('phones', res.data.data.phones);
				this.props.onChangeForm1('phone_counts', res.data.data.phone_counts);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving your data'
				});
			});
	}

	isValid() {
		let { errors, isValid } = validateP11Form1(this.props.form1);
		this.props.updateP11Status(1, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;

	}

	onChange(e) {
		this.props.onChangeForm1(e.target.name, e.target.value);
		// this.isValid();

	}

	selectOnChange(value, e) {
		this.props.onChangeForm1([e.name], value);
	}

	dateOnChange(e) {
		this.props.onChangeForm1(e.target.name, moment(e.target.value).format('YYYY-MM-DD'));
	}

	async multiSelect(values, e) {
		// if (values.length <= 2) {
		await this.props.onChangeForm1(e.name, values);
		// }

		// this.isValid();
	}

	async switchOnChange(e) {
		if (this.props.form1[e.target.name]) {
			if (e.target.name == 'is_immap_inc') {
				this.props.onChangeForm1(e.target.name, 0);
				await this.props.onChangeForm1('is_immap_france', 1);
			} else {
				this.props.onChangeForm1(e.target.name, 0);
				await this.props.onChangeForm1('is_immap_inc', 1);
			}
		} else {
			if (e.target.name == 'is_immap_inc') {
				this.props.onChangeForm1(e.target.name, 1);
				await this.props.onChangeForm1('is_immap_france', 0);
			} else {
				this.props.onChangeForm1(e.target.name, 1);
				await this.props.onChangeForm1('is_immap_inc', 0);
			}
		}
		await this.isValid();
	}

	yesNoOnChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm1(yesNoName, yesNoValue);
				if (yesNoName === 'is_immaper') {
					if (yesNoValue === 0) {
						this.props.onChangeForm1('job_title', '');
						this.props.onChangeForm1('immap_email', '');
						this.props.onChangeForm1('duty_station', '');
						this.props.onChangeForm1('line_manager', '');
						this.props.onChangeForm1('line_manager_id', '');
						this.props.onChangeForm1('immap_contract_international', 0);
						this.props.onChangeForm1('start_of_current_contract', moment(new Date()).format('YYYY-MM-DD'));
						this.props.onChangeForm1('end_of_current_contract', moment(new Date()).format('YYYY-MM-DD'));
						this.props.onChangeForm1('immap_office', '');
						this.props.onChangeForm1('is_immap_inc', 0), this.props.onChangeForm1('is_immap_france', 0);
					}
				}
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				// this.isValid();
				// this.getP11();
			})
			.catch((err) => {
				if(typeof err.response !== "undefined" && err.response !== null){
					if(typeof err.response.data.status !== "undefined" && err.response.data.status !== null && typeof err.response.data.message !== "undefined" && err.response.data.message !== null){
						this.props.addFlashMessage({
							type: err.response.data.status,
							text: err.response.data.message
						});
					} else {
						this.props.addFlashMessage({
							type:  'error',
							text: 'Update Error'
						});
					}
				} else {
					this.props.addFlashMessage({
						type:  'error',
						text: 'Update Error'
					});
				}

			});
	}

	timerCheck() {
		clearTimeout(this.timer)
			this.timer = setTimeout(async () => {
			if(!isEmpty(this.state.keyword)) {await this.props.getLineManagers(this.state.keyword);}
			this.setState({ isLoading: false })
		}, 500)
	}

	phoneOnChange(phone, name, errors) {
		let phoneErrors = {};
		if (!isEmpty(errors)) {
			phoneErrors[name] = errors;
	}

	this.props.updateP11Status(2, isEmpty(errors), this.props.p11Status);
	this.props.checkError(phoneErrors, isEmpty(phoneErrors));
	this.props.onChangeForm1(name, phone);
}

	render() {
		let {
			family_name,
			first_name,
			middle_name,
			present_nationalities,
			gender,
			is_immaper,
			immap_email,
			is_immap_inc,
			is_immap_france,
			immap_office,
			line_manager,
			job_title,
			duty_station,
			start_of_current_contract,
			end_of_current_contract,
			immap_contract_international,
			country_residence,
			office_telephone,
			skype,
			office_email
		} = this.props.form1;
		let {
			classes,
			nationalities,
			errors,
			immap_offices,
            lineManagers,
			p11Countries
		} = this.props;
       const { isLoading, keyword } = this.state;
	   let marginBottom, marginTop;
		if(isEmpty(errors.country_residence)) {
			marginBottom='0px';
			marginTop='0px';
		} else {
			marginBottom='20px';
			marginTop='20px';
		}

		return (
			<form>
				<Grid container spacing={16} alignItems="flex-end">
					<Grid item xs={12} sm={3}>
						<TextField
							required
							id="family_name"
							name="family_name"
							label="Surname"
							fullWidth
							value={family_name}
							autoComplete="name"
							onChange={this.onChange}
							error={!isEmpty(errors.family_name)}
							helperText={errors.family_name}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							required
							id="first_name"
							name="first_name"
							label="First name"
							fullWidth
							autoComplete="name"
							value={first_name}
							onChange={this.onChange}
							error={!isEmpty(errors.first_name)}
							helperText={errors.first_name}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							id="middle_name"
							name="middle_name"
							label="Middle Name"
							fullWidth
							autoComplete="name"
							value={middle_name}
							onChange={this.onChange}
							error={!isEmpty(errors.middle_name)}
							helperText={errors.middle_name}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							required
							id="gender"
							select
							name="gender"
							label="Select Gender"
							fullWidth
							margin="none"
							value={gender==='empty' ? '':gender}
							onChange={this.onChange}
							error={!isEmpty(errors.gender)}
							helperText={errors.gender}
						>
							{genderData.map((sex, index) => (
								<MenuItem key={index} value={sex.value}>
									{sex.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={12}>
						<SelectField
							label="Nationality (ies)"
							options={nationalities}
							value={present_nationalities}
							onChange={this.multiSelect}
							placeholder="Select nationality"
							isMulti={true}
							name="present_nationalities"
							error={errors.present_nationalities}
							margin="none"
              fullWidth
						/>
					</Grid>
					{/*<Grid item xs={12} sm={12}>
						<FormGroup className={classes.immapSwitch}>
							<FormControlLabel
								className={classes.immapSwitchLabel}
								label="Are you a current iMMAP employee?"
								labelPlacement="start"
								control={
									<Switch
										checked={is_immaper === 1 ? true : false}
										onChange={(e) =>
											this.yesNoOnChange({
												target: { name: e.target.name, value: is_immaper == 1 ? 0 : 1 }
											})}
										color="primary"
										name="is_immaper"
									/>
								}
							/>
						</FormGroup>
					</Grid>*/}
					{/*is_immaper == 1 ? (
						<Grid item xs={12}>
							<Paper className={classes.immaperPaper}>
								<Typography variant="subtitle1">Please include your current iMMAP employee information</Typography>
								<Grid container spacing={8} alignItems="flex-end">
									<Grid item xs={12} sm={4}>
										<FormControl margin="none" error={!isEmpty(errors.is_immap_inc)}>
											<FormControlLabel
												control={
													<Checkbox
														checked={is_immap_inc === 1 ? true : false}
														name="is_immap_inc"
														color="primary"
														onChange={this.switchOnChange}
														className={classes.check}
													/>
												}
												label="iMMAP inc."
											/>
											{!isEmpty(errors.is_immap_inc) && (
												<FormHelperText>{errors.is_immap_inc}</FormHelperText>
											)}
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={4}>
										<FormControl margin="none" error={!isEmpty(errors.is_immap_france)}>
											<FormControlLabel
												control={
													<Checkbox
														checked={is_immap_france === 1 ? true : false}
														name="is_immap_france"
														color="primary"
														onChange={this.switchOnChange}
														className={classes.check}
													/>
												}
												label="iMMAP France"
											/>
											{!isEmpty(errors.is_immap_france) && (
												<FormHelperText>{errors.is_immap_france}</FormHelperText>
											)}
										</FormControl>
									</Grid>
								</Grid>
								<Grid container spacing={16} alignItems="flex-end">
									<Grid item xs={12} sm={4}>
										<TextField
											fullWidth
											label="iMMAP Email"
											id="immap_email"
											name="immap_email"
											margin="none"
											value={immap_email}
											onChange={this.onChange}
											error={!isEmpty(errors.immap_email)}
											helperText={errors.immap_email}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											fullWidth
											label="Job Title"
											id="job_title"
											name="job_title"
											margin="none"
											value={job_title}
											onChange={this.onChange}
											error={!isEmpty(errors.job_title)}
											helperText={errors.job_title}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											fullWidth
											label="Duty Station"
											id="duty_station"
											name="duty_station"
											margin="none"
											value={duty_station}
											onChange={this.onChange}
											error={!isEmpty(errors.duty_station)}
											helperText={errors.duty_station}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
									<SearchField
									required
									id="line_manager"
									label="Line Manager"
									name="line_manager"
									keyword={keyword}
									margin="none"
									placeholder="Search and Pick Line Manager"
									onKeywordChange={(e) => { this.setState({ keyword: e.target.value, isLoading: true }) }}
									value={!isEmpty(line_manager) ? line_manager : ''}
									options={lineManagers}
									loadingText="Loading line managers..."
									searchLoading={isLoading}
									onSelect={(value) => {
										this.setState({ keyword: '' }, () => {
										this.props.onChangeForm1('line_manager', value.full_name)
										this.props.onChangeForm1('line_manager_id', value.id)
										})
									}}
									onDelete={() => {
										this.props.onChangeForm1('line_manager', '')
										this.props.onChangeForm1('line_manager_id', '')
									}}
									optionSelectedProperty="full_name"
									notFoundText="Sorry, no line manager found"
									error={errors.line_manager}
									/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<DatePickerField
											label="Start of current contract"
											name="start_of_current_contract"
											value={
												isEmpty(start_of_current_contract) ? (
													moment(new Date())
												) : (
														moment(start_of_current_contract)
													)
											}
											onChange={this.dateOnChange}
											error={errors.start_of_current_contract}
											margin="none"
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<DatePickerField
											label="End of current contract"
											name="end_of_current_contract"
											value={
												isEmpty(end_of_current_contract) ? (
													moment(new Date())
												) : (
														moment(end_of_current_contract)
													)
											}
											onChange={this.dateOnChange}
											error={errors.end_of_current_contract}
											margin="none"
										/>
									</Grid>
									<Grid item xs={12} sm={12}>
										<SelectField
											label="iMMAP Office *"
											options={immap_offices}
											value={immap_office}
											onChange={this.selectOnChange}
											placeholder="Select iMMAP Office"
											isMulti={false}
											name="immap_office"
											error={errors.immap_office}
											required
											fullWidth={true}
											margin="none"
										/>
									</Grid>
									<Grid item xs={12} sm={12}>
										<YesNoField
											label="Are you under international contract?"
											value={immap_contract_international.toString()}
											onChange={this.yesNoOnChange}
											name="immap_contract_international"
											error={errors.immap_contract_international}
											margin="dense"
										/>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					): null*/}
					<Grid item xs={12}>
						<FormControl margin="normal" fullWidth error={!isEmpty(errors.phone_counts)}>
							<FormLabel>
								<b>Mobile Phone Number</b>: Please provide your mobile phone number.{' '}
							</FormLabel>
							<br />
							<PhoneNumber checkValidation={this.isValid} updatePhoneCount={this.getPhoneCount} />
							{!isEmpty(errors.phone_counts) ? <FormHelperText>{errors.phone_counts}</FormHelperText>:null}
						</FormControl>
					</Grid>
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
					</Grid>
			</form>
		);
	}
}

P11Form1.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	updateP11Status: PropTypes.func.isRequired,
	setP11Status: PropTypes.func.isRequired,
	onChangeForm1: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	getYears: PropTypes.func.isRequired,
	setP11FormData: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	nationalities: PropTypes.array.isRequired,
	years: PropTypes.array.isRequired,
	form1: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	immap_offices: PropTypes.array,
	getP11ImmapOffices: PropTypes.func.isRequired,
 	lineManagers: PropTypes.array,
    getLineManagers: PropTypes.func.isRequired,
	p11Countries: PropTypes.array.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	onChangeForm1,
	checkError,
	getYears,
	setP11FormData,
	addFlashMessage,
	postAPI,
	updateP11Status,
	setP11Status,
	getP11ImmapOffices,
    getLineManagers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	nationalities: state.options.nationalities,
	years: state.options.years,
	form1: state.p11.form1,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status,
	immap_offices: state.options.p11ImmapOffices,
 	lineManagers: state.options.lineManagers,
	p11Countries: state.options.p11Countries,
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(P11Form1));
