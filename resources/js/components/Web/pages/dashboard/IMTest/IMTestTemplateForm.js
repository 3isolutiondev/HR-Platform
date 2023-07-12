import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Save from '@material-ui/icons/Save';
import isEmpty from '../../../validations/common/isEmpty';
import YesNoField from '../../../common/formFields/YesNoField';
import {
	setFormIsEdit,
	isValid,
	onChange,
	onSubmit
} from '../../../redux/actions/dashboard/im-test-template/imTestTemplateActions';
import ImTest from '../../imTestv1/IMTest';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

class IMTestTemplateForm extends Component {
	componentDidMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id, this.props.history);
		}
	}

	componentDidUpdate(prevProps) {
		const currentDashboardIMTestTemplate = JSON.stringify(this.props.dashboardIMTestTemplate);
		const prevDashboardIMTestTemplate = JSON.stringify(prevProps.dashboardIMTestTemplate);

		if (currentDashboardIMTestTemplate !== prevDashboardIMTestTemplate) {
			this.props.isValid();
		}
	}

	render() {
		let { name, is_default, errors, isEdit, isAdd, limit_time } = this.props.dashboardIMTestTemplate;
		let { activeStep, isValid } = this.props.imtest;

		const { classes, onSubmit, onChange, history } = this.props;
		return (
			<form onSubmit={(e) => onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit IM Test Template : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add IM Test Template'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit IM Test Template : ' + name
							) : (
								APP_NAME + ' Dashboard > Add IM Test Template'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit IM Test Template : ' + name}
								{!isEdit && 'Add IM Test Template'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="name"
								value={name}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_default"
								label="IM Test Default"
								ariaLabel="is_default"
								value={is_default.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_default"
								error={errors.is_default}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								autoComplete="limit_time"
								id="limit_time"
								name="limit_time"
								margin="normal"
								label="Set Limit Time (Hour)"
								type="time"
								InputLabelProps={{
									shrink: true
								}}
								inputProps={{
									step: 300 // 5 min
								}}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								value={limit_time}
								error={!isEmpty(errors.limit_time)}
								helperText={errors.limit_time}
							/>
						</Grid>

						<hr style={{ width: '100%', marginBottom: '-5px' }} />
						<Grid item xs={12}>
							<ImTest isEdit={isEdit} isAdd={isAdd} imTestTemplate={true} />
						</Grid>
						<Grid item xs={12}>
							{activeStep === 4 && (
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={!isValid}
								>
									<Save /> Save
								</Button>
							)}
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

IMTestTemplateForm.propTypes = {
	setFormIsEdit: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	setFormIsEdit,
	isValid,
	onChange,
	onSubmit
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	dashboardIMTestTemplate: state.dashboardIMTestTemplate,
	imtest: state.imtest
});

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
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTestTemplateForm));
