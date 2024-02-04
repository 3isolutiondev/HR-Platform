import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Save from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import YesNoField from '../../common/formFields/YesNoField';
import { getRoles, getImmapOffices, getLineManagers } from '../../redux/actions/optionActions';
import {
	onSubmit,
	dateOnChange,
	onChange,
	setFormIsEdit,
	switchOnChange,
	setImmaper,
	selectOnChange
} from '../../redux/actions/dashboard/iMMAPerActions';
import SelectField from '../../common/formFields/SelectField';
import SearchField from '../../common/formFields/SearchField';
import isEmpty from '../../validations/common/isEmpty';
import DatePickerField from '../../common/formFields/DatePickerField';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';
import { can } from '../../permissions/can';

class IMMAPerForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			managerSearch: '',
			managerSearchLoading: false,
			open_confirmation_history: false,
		};
		this.timer = null
		this.timerCheck = this.timerCheck.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.openConfirmationHistory = this.openConfirmationHistory.bind(this);
		this.closeConfirmationHistory = this.closeConfirmationHistory.bind(this);
		this.saveHistoryData = this.saveHistoryData.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.managerSearch !== this.state.managerSearch) {
			this.timerCheck();
		}
	}

	timerCheck() {
		clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			if (!isEmpty(this.state.managerSearch)) { await this.props.getLineManagers(this.state.managerSearch); }
			this.setState({ isLoading: false, managerSearchLoading: false })
		}, 500)
	}

	onSubmit(e) {
		e.preventDefault();
		this.openConfirmationHistory();
	}

	 async saveHistoryData(status){
		if(status == true && can('Set as Admin')){
			await this.props.onChange({ target: { name: 'save_as_history', value: 1 } });
		}else{
			await this.props.onChange({ target: { name: 'save_as_history', value: 0 } });
		}
		this.setState({ open_confirmation_history: false });
		this.props.onSubmit(this.props.history);

	}

	openConfirmationHistory() {
		if(can('Set as Admin')) {
			this.setState({ open_confirmation_history: true });
		} else {
			this.saveHistoryData(false);
		}
	}

   closeConfirmationHistory() {
		this.setState({ open_confirmation_history: false });
	}

	componentDidMount() {
		if (can('Edit Immaper roles')) {
			this.props.getRoles();
		}
		this.props.getImmapOffices();
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		} else {
			this.props.setFormIsEdit(false);
		}
	}

	render() {
		const {
			classes,
			errors,
			immaperData,
			switchOnChange,
			onChange,
			dateOnChange,
			isValid,
			setImmaper,
			immap_offices,
			selectOnChange,
			lineManagers,
			roles
		} = this.props;
		const { isLoading, open_confirmation_history } = this.state;
		const {
			is_immap_inc,
			is_immap_france,
			immap_email,
			full_name,
			isEdit,
			job_title,
			duty_station,
			line_manager,
			start_of_current_contract,
			end_of_current_contract,
			immap_contract_international,
			showLoading,
			immap_office,
			under_sbp_program,
			role,
			project_code,
		} = immaperData;

		const { managerSearch, managerSearchLoading } = this.state;
		return (
			<form onSubmit={(e) => this.onSubmit(e)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit User : ' + full_name
						) : (
							APP_NAME + ' - Dashboard > Add User'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit User : ' + full_name
							) : (
								APP_NAME + ' Dashboard > Add User'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16} alignItems="flex-end">
						<Grid item xs={12} sm={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Consultant : ' + full_name}
								{!isEdit && 'Add Consultant'}
							</Typography>
						</Grid>

						<Grid item xs={12} sm={8}>
							<FormControl margin="none">
								<FormControlLabel
									control={
										<Checkbox
											checked={is_immap_inc === 1 ? true : false}
											name="is_immap_inc"
											color="primary"
											onChange={switchOnChange}
											className={classes.check}
										/>
									}
									label="3iSolution"
								/>
							</FormControl>
							<FormControl margin="none">
								<FormControlLabel
									control={
										<Checkbox
											checked={is_immap_france === 1 ? true : false}
											name="is_immap_france"
											color="primary"
											onChange={switchOnChange}
											className={classes.check}
										/>
									}
									label="3iSolution France"
								/>
							</FormControl>
							{!isEmpty(errors.is_immap_headquarter) && (
								  <FormHelperText error={!isEmpty(errors.is_immap_headquarter)}>{errors.is_immap_headquarter}</FormHelperText>
								)}
						</Grid>
						<Grid item xs={12} sm={4} />
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label="3iSolution Email"
								id="immap_email"
								name="immap_email"
								margin="none"
								value={immap_email}
								onChange={onChange}
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
								onChange={onChange}
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
								onChange={onChange}
								error={!isEmpty(errors.duty_station)}
								helperText={errors.duty_station}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<SearchField
								id="line_manager"
								label="Line Manager"
								required
								name="line_manager"
								margin="none"
								keyword={managerSearch || ' '}
								placeholder="Search and Pick Line manager"
								onKeywordChange={(e) => { this.setState({ managerSearch: e.target.value, managerSearchLoading: true }) }}
								value={line_manager}
								options={lineManagers}
								loadingText="Loading line managers..."
								searchLoading={managerSearchLoading}
								onSelect={(value) => {
									this.setState({ managerSearch: ' ' }, () => {
										this.props.onChange({ target: { name: 'line_manager', value: value.full_name } })
										this.props.onChange({ target: { name: 'line_manager_id', value: value.id } })
									})
								}}
								onDelete={() => {
									this.props.onChange({ target: { name: 'line_manager', value: '' } });
									this.props.onChange({ target: { name: 'line_manager_id', value: '' } });
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
								onChange={dateOnChange}
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
								onChange={dateOnChange}
								error={errors.end_of_current_contract}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12} sm={can('Edit Immaper roles') ? 4 : 6}>
							<SelectField
								label="3iSolution Office *"
								options={immap_offices}
								value={immap_office}
								onChange={selectOnChange}
								placeholder="Select 3iSolution Office"
								isMulti={false}
								name="immap_office"
								error={errors.immap_office}
								required
								fullWidth={true}
								margin="none"
							/>
						</Grid>
						{ can('Edit Immaper roles') &&
							<Grid item xs={12} sm={4}>
								<SelectField
									label="Roles"
									options={roles}
									value={role}
									onChange={selectOnChange}
									placeholder="Select 1 or More Roles"
									name="role"
									error={errors.role}
									isMulti={true}
									fullWidth={true}
									margin="none"
									added={false}
								/>
							</Grid>
						}
						<Grid item xs={12} sm={can('Edit Immaper roles') ? 4 : 6}>
							<TextField
								fullWidth
								label="Project Code"
								id="project_code"
								name="project_code"
								margin="none"
								value={project_code}
								onChange={onChange}
								error={!isEmpty(errors.project_code)}
								helperText={errors.project_code}
							/>
						</Grid>
						<Grid item xs={12} sm={4} md={4}>
							<YesNoField
								label="Are you under international contract?"
								value={immap_contract_international.toString()}
								onChange={() =>
									setImmaper(
										'immap_contract_international',
										immap_contract_international.toString() == 1 ? 0 : 1
									)}
								name="immap_contract_international"
								error={errors.immap_contract_international}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={4} md={4}>
							<YesNoField
								label="Working under Surge Program?"
								value={under_sbp_program.toString()}
								onChange={() =>
									setImmaper(
										'under_sbp_program',
										under_sbp_program.toString() == 1 ? 0 : 1
									)}
								name="under_sbp_program"
								error={errors.under_sbp_program}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								disabled={!isValid}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
				<Dialog open={open_confirmation_history} onClose={this.closeConfirmationHistory}>
					<DialogTitle>Contract Modification</DialogTitle>
						<DialogContent>
						<DialogContentText id="alert-dialog-confirm-user-contract-history">
							Do you want to save the previous data as history?
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						<Button
							onClick={() =>this.saveHistoryData(false)}
							color="secondary"
							variant="contained"
							disabled={isLoading ? true : false}
						>
							<CancelIcon fontSize="small" className={classes.addSmallMarginRight} />
							No
						</Button>
						<Button
							onClick={() => this.saveHistoryData(true)}
							color="primary"
							autoFocus
							variant="contained"
							disabled={isLoading ? true : false}
						>
							<CheckIcon fontSize="small" className={classes.addSmallMarginRight} />
							Yes
						</Button>
						</DialogActions>
            		</Dialog>
			</form>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	right: {
		float: 'right'
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	check: {
		padding: '8px 12px'
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	}
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRoles,
	switchOnChange,
	dateOnChange,
	onSubmit,
	setImmaper,
	onChange,
	setFormIsEdit,
	getImmapOffices,
	selectOnChange,
	getLineManagers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	immaperData: state.dashboardImmaper,
	errors: state.dashboardImmaper.errors,
	isValid: state.dashboardImmaper.isValid,
	immap_offices: state.options.immapOffices,
	lineManagers: state.options.lineManagers || [],
	roles: state.options.roles,
});

IMMAPerForm.propTypes = {
	immaperData: PropTypes.object.isRequired,
	setFormIsEdit: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	switchOnChange: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	getRoles: PropTypes.func.isRequired,
	getImmapOffices: PropTypes.func.isRequired,
	dateOnChange: PropTypes.func.isRequired,
	setImmaper: PropTypes.func.isRequired,
	selectOnChange: PropTypes.func.isRequired,
	errors: PropTypes.object,
	immap_offices: PropTypes.array,
	getLineManagers: PropTypes.func.isRequired,
	roles: PropTypes.array.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(IMMAPerForm)));
