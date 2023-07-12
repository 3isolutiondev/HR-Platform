import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import SelectField from '../../../common/formFields/SelectField';
import { onChange, isValid } from '../../../redux/actions/dashboard/roster/rosterStepActions';
import { saveStep } from '../../../redux/actions/dashboard/roster/rosterProcessActions';
import { getQuizTemplates } from '../../../redux/actions/optionActions';
import isEmpty from '../../../validations/common/isEmpty';
import { white } from '../../../config/colors';

class RosterStepModal extends Component {
	componentDidMount() {
		this.props.getQuizTemplates();
	}

	componentDidUpdate(prevProps) {
		const currentRosterStep = JSON.stringify(this.props.rosterStep);
		const prevRosterStep = JSON.stringify(prevProps.rosterStep);

		if (currentRosterStep !== prevRosterStep) {
			this.props.isValid();
		}
	}

	render() {
		const {
			isOpen,
			isEdit,
			step,
			default_step,
			quiz_template,
			last_step,
			has_quiz,
			has_im_test,
			has_skype_call,
			has_interview,
			has_reference_check,
			set_rejected,
			errors,
			showLoading
		} = this.props.rosterStep;
		const { onChange, saveStep, quiz_templates, classes } = this.props;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={() => onChange('isOpen', false)}>
				<DialogTitle>{isEdit ? 'Edit ' + step + ' Step' : 'Add Step'}</DialogTitle>
				<DialogContent>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<TextField
								id="step"
								label="Step Name"
								autoComplete="step"
								autoFocus
								margin="dense"
								required
								fullWidth
								name="step"
								value={step}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={!isEmpty(errors.step)}
								helperText={errors.step}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={default_step === 1 ? true : false}
										name="default_step"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Set as Default Step"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={last_step === 1 ? true : false}
										name="last_step"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Set as Last Step"
							/>
						</Grid>
						{/* <Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={has_quiz === 1 ? true : false}
										name="has_quiz"
										color="primary"
										onChange={(e) => onChange(e.target.name, e.target.checked ? 1 : 0)}
										className={classes.checkBox}
									/>
								}
								label="Has Quiz"
							/>
						</Grid> */}
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={has_im_test === 1 ? true : false}
										name="has_im_test"
										color="primary"
										onChange={(e) => onChange(e.target.name, e.target.checked ? 1 : 0)}
										className={classes.checkBox}
									/>
								}
								label="Has IM Test"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={has_skype_call === 1 ? true : false}
										name="has_skype_call"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Has Skype Call"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={has_interview === 1 ? true : false}
										name="has_interview"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Has Interview"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={has_reference_check === 1 ? true : false}
										name="has_reference_check"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Has Reference Check"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControlLabel
								control={
									<Checkbox
										checked={set_rejected === 1 ? true : false}
										name="set_rejected"
										color="primary"
										onChange={(e) => {
											onChange(e.target.name, e.target.checked ? 1 : 0);
										}}
										className={classes.checkBox}
									/>
								}
								label="Has Rejected"
							/>
						</Grid>

						{/* {has_quiz == 1 && (
							<Grid item xs={12}>
								<SelectField
									id="quiz_template"
									label="Choose Quiz Template"
									ariaLabel="quiz_template"
									margin="none"
									name="quiz_template"
									options={quiz_templates}
									value={quiz_template}
									placeholder="Choose Quiz Template"
									isMulti={false}
									fullWidth
									onChange={(value, e) => onChange(e.name, value)}
									error={errors.language}
									required
								/>
							</Grid>
						)} */}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => onChange('isOpen', false)} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={() => saveStep()} color="primary" variant="contained">
						Save {showLoading && <CircularProgress thickness={5} size={22} className={classes.loading} />}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

RosterStepModal.propTypes = {
	rosterStep: PropTypes.object.isRequired,
	saveStep: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired,
	getQuizTemplates: PropTypes.func.isRequired,
	// quiz_templates: PropTypes.oneOf([ PropTypes.string, PropTypes.array ])
	quiz_templates: PropTypes.array.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onChange,
	saveStep,
	getQuizTemplates,
	isValid
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	rosterStep: state.rosterProcess.rosterStep,
	quiz_templates: state.options.quiz_templates
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	checkBox: {
		padding: '0 12px'
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterStepModal));
