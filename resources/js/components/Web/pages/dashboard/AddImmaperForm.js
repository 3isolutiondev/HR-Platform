import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import { onChange, getP11CompletedUsers, isValid, onSubmit, resetForm } from '../../redux/actions/dashboard/immaperFormActions';
import { getP11ImmapOffices, getLineManagers } from '../../redux/actions/optionActions';
import { white } from '../../config/colors';
import SelectField from '../../common/formFields/SelectField';
import SearchField from '../../common/formFields/SearchField';
import YesNoField from '../../common/formFields/YesNoField';
import DatePickerField from '../../common/formFields/DatePickerField';
import isEmpty from '../../validations/common/isEmpty';

class AddImmaperForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			search: '',
			isLoading: false,
			managerSearch: '',
			managerSearchLoading: false
		};
		this.timer = null

		this.close = this.close.bind(this);
		this.checkOnChange = this.checkOnChange.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.timerCheck = this.timerCheck.bind(this);
	}

	componentDidMount() {
		this.props.getP11ImmapOffices();
	}

	componentDidUpdate(prevProps, prevState) {
		if ((prevState.search !== this.state.search) || (prevState.managerSearch !== this.state.managerSearch)) {
			this.timerCheck();
		}
	}

	close() {
		this.props.onChange('addImmaper', false);
		this.props.resetForm();
	}

	async checkOnChange(e) {
		if (this.props[e.target.name]) {
			this.props.onChange(e.target.name, 0);
		} else {
			this.props.onChange(e.target.name, 1);
		}
		await this.props.isValid();
	}

	switchOnChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props.onChange(yesNoName, yesNoValue, true);
	}

	async onSubmit() {
		await this.props.isValid();
		this.setState({ loading: true }, async () => {
			await this.props.onSubmit();
			this.setState({ loading: false }, () => {
				this.close();
				this.props.getImmaper();
			});
		});
	}

	timerCheck() {
		clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			if (!isEmpty(this.state.search)) { await this.props.getP11CompletedUsers(this.state.search); }
			if (!isEmpty(this.state.managerSearch)) { await this.props.getLineManagers(this.state.managerSearch); }
			this.setState({ isLoading: false, managerSearchLoading: false })
		}, 500)
	}

	render() {
		const {
			addImmaper,
			users,
			user,
			is_immap_inc,
			is_immap_france,
			immap_email,
			job_title,
			duty_station,
			line_manager,
			immap_offices,
			immap_office,
			project_code,
			start_of_current_contract,
			end_of_current_contract,
			immap_contract_international,
			under_sbp_program,
			errors,
			classes,
			lineManagers
		} = this.props;

		const { loading, isLoading, search, managerSearch, managerSearchLoading } = this.state;

		return (
			<Dialog open={addImmaper} fullWidth maxWidth="lg" onClose={this.close}>
				<DialogTitle>Add Immaper</DialogTitle>
				<DialogContent>
					<Grid container spacing={8} alignItems="flex-end">
						<Grid item xs={12} >
							<SearchField
								required
								id="user"
								label="Select User"
								name="user"
								keyword={search}
								placeholder="Search and Pick User"
								onKeywordChange={(e) => { this.setState({ search: e.target.value, isLoading: true }) }}
								value={!isEmpty(user.label) ? user.label : ''}
								options={users}
								loadingText="Loading completed users..."
								searchLoading={isLoading}
								onSelect={(value) => {
									this.setState({ search: '' }, () => {
										this.props.onChange('user', { value: value.value, label: value.label }, true)
									})
								}}
								onDelete={() => this.props.onChange('user', '', true)}
								optionSelectedProperty="label"
								isImmperProperty="status"
								secondProperty="label_second"
								notFoundText="Sorry, your search terms do not match with any completed user"
								error={errors.user}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl margin="none">
								<FormControlLabel
									control={
										<Checkbox
											checked={is_immap_inc === 1 ? true : false}
											name="is_immap_inc"
											color="primary"
											onChange={this.checkOnChange}
											className={classes.check}
										/>
									}
									label="iMMAP inc."
								/>
							</FormControl>
							<FormControl margin="none">
								<FormControlLabel
									control={
										<Checkbox
											checked={is_immap_france === 1 ? true : false}
											name="is_immap_france"
											color="primary"
											onChange={this.checkOnChange}
											className={classes.check}
										/>
									}
									label="iMMAP France"
								/>
							</FormControl>
							{!isEmpty(errors.is_immap_headquarter) && (
									<FormHelperText error={!isEmpty(errors.is_immap_headquarter)}>{errors.is_immap_headquarter}</FormHelperText>
								)}
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<SelectField
								label="iMMAP Office *"
								options={immap_offices}
								value={immap_office}
								onChange={(value, e) => this.props.onChange([e.name], value, true)}
								placeholder="Select iMMAP Office"
								isMulti={false}
								name="immap_office"
								error={errors.immap_office}
								required
								fullWidth={true}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField
								fullWidth
								label="Project Code"
								id="project_code"
								name="project_code"
								margin="none"
								value={project_code}
								onChange={(e) => this.props.onChange(e.target.name, e.target.value, true)}
								error={!isEmpty(errors.project_code)}
								helperText={errors.project_code}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="iMMAP Email"
								id="immap_email"
								name="immap_email"
								margin="none"
								value={immap_email}
								onChange={(e) => this.props.onChange(e.target.name, e.target.value, true)}
								error={!isEmpty(errors.immap_email)}
								helperText={errors.immap_email}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Job Title"
								id="job_title"
								name="job_title"
								margin="none"
								value={job_title}
								onChange={(e) => this.props.onChange(e.target.name, e.target.value, true)}
								error={!isEmpty(errors.job_title)}
								helperText={errors.job_title}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Duty Station"
								id="duty_station"
								name="duty_station"
								margin="none"
								value={duty_station}
								onChange={(e) => this.props.onChange(e.target.name, e.target.value, true)}
								error={!isEmpty(errors.duty_station)}
								helperText={errors.duty_station}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<SearchField
								required
								label="Line Manager"
								id="line_manager"
								name="line_manager"
								margin="none"
								keyword={managerSearch}
								placeholder="Search and Pick Line manager"
								onKeywordChange={(e) => { this.setState({ managerSearch: e.target.value, managerSearchLoading: true }) }}
								value={!isEmpty(line_manager.label) ? line_manager.label : ''}
								options={lineManagers}
								loadingText="Loading line managers..."
								searchLoading={managerSearchLoading}
								onSelect={(value) => {
									this.setState({ managerSearch: '' }, () => {
										this.props.onChange('line_manager', { value: value.id, label: value.full_name })
										this.props.onChange('line_manager_id', value.id, true)
									})
								}}
								onDelete={() => { this.props.onChange('line_manager', '', true) }}
								optionSelectedProperty="full_name"
								notFoundText="Sorry, no line manager found"
								error={errors.line_manager}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
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
								onChange={(e) =>
									this.props.onChange(
										e.target.name,
										moment(e.target.value).format('YYYY-MM-DD'),
										true
									)}
								error={errors.start_of_current_contract}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
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
								onChange={(e) =>
									this.props.onChange(
										e.target.name,
										moment(e.target.value).format('YYYY-MM-DD'),
										true
									)}
								error={errors.end_of_current_contract}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12} sm={4} md={4}>
							<YesNoField
								label="Are you under international contract?"
								value={immap_contract_international.toString()}
								onChange={this.switchOnChange}
								name="immap_contract_international"
								error={errors.immap_contract_international}
								margin="none"
							/>
					    </Grid>
						<Grid item xs={12} sm={4} md={4}>
							<YesNoField
								label="Working under Surge Program?"
								value={under_sbp_program.toString()}
								onChange={this.switchOnChange}
								name="under_sbp_program"
								error={errors.under_sbp_program}
								margin="dense"
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.close} color="secondary" variant="contained" size="medium">
						<Close fontSize="small" /> Close
					</Button>
					<Button onClick={this.onSubmit} color="primary" variant="contained" size="medium">
						<Save fontSize="small" /> Save{' '}
						{loading && <CircularProgress thickness={5} size={22} className={classes.loading} />}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange,
	getP11CompletedUsers,
	getP11ImmapOffices,
	isValid,
	onSubmit,
	resetForm,
	getLineManagers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	addImmaper: state.immaperForm.addImmaper,
	users: state.immaperForm.users,
	lineManagers: state.options.lineManagers || [],
	user: state.immaperForm.user,
	errors: state.immaperForm.errors,
	is_immap_inc: state.immaperForm.is_immap_inc,
	is_immap_france: state.immaperForm.is_immap_france,
	immap_email: state.immaperForm.immap_email,
	job_title: state.immaperForm.job_title,
	duty_station: state.immaperForm.duty_station,
	line_manager: state.immaperForm.line_manager,
	start_of_current_contract: state.immaperForm.start_of_current_contract,
	end_of_current_contract: state.immaperForm.end_of_current_contract,
	immap_office: state.immaperForm.immap_office,
	immap_contract_international: state.immaperForm.immap_contract_international,
	under_sbp_program: state.immaperForm.under_sbp_program,
	immap_offices: state.options.p11ImmapOffices,
	project_code: state.immaperForm.project_code,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	check: {
		padding: theme.spacing.unit + 'px ' + (theme.spacing.unit + theme.spacing.unit / 2) + 'px'
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	},
	paper: {
		padding: theme.spacing.unit * 2
	},
	chip: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit / 2,
		height: theme.spacing.unit * 4
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddImmaperForm));
