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
import SelectField from '../../../common/formFields/SelectField';
import {
	setFormIsEdit,
	isValid,
	onChange,
	onSubmit
} from '../../../redux/actions/dashboard/quiz-template/quizTemplateActions';
import { getIMTestTemplates } from '../../../redux/actions/optionActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

class QuizTemplateForm extends Component {
	componentDidMount() {
		this.props.getIMTestTemplates();
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		}
	}

	componentDidUpdate(prevProps) {
		const currentDashboardQuizTemplate = JSON.stringify(this.props.dashboardQuizTemplate);
		const prevDashboardQuizTemplate = JSON.stringify(prevProps.dashboardQuizTemplate);

		if (currentDashboardQuizTemplate !== prevDashboardQuizTemplate) {
			this.props.isValid();
		}
	}

	render() {
		let { title, is_default, is_im_test, im_test_template, errors, isEdit } = this.props.dashboardQuizTemplate;

		const { classes, onSubmit, onChange, im_test_templates, history } = this.props;

		return (
			<form onSubmit={(e) => onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Quiz Template : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Quiz Template'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Quiz Template : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Quiz Template'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Quiz Template : ' + title}
								{!isEdit && 'Add Quiz Template'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="title"
								label="Title"
								autoComplete="title"
								autoFocus
								margin="dense"
								required
								fullWidth
								name="title"
								value={title}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={!isEmpty(errors.title)}
								helperText={errors.title}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_default"
								label="Set quiz template as Default"
								ariaLabel="is_default"
								value={is_default.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_default"
								error={errors.is_default}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_im_test"
								label="Set quiz template as IM Test Template"
								ariaLabel="is_im_test"
								value={is_im_test.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_im_test"
								error={errors.is_im_test}
								margin="dense"
							/>
						</Grid>
						{is_im_test == 1 && (
							<Grid item xs={12}>
								<SelectField
									id="im_test_template"
									label="Choose IM Test Template"
									ariaLabel="im_test_template"
									margin="none"
									name="im_test_template"
									options={im_test_templates}
									value={im_test_template}
									placeholder="Choose IM Test Template"
									isMulti={false}
									fullWidth
									onChange={(value, e) => onChange(e.name, value)}
									error={errors.language}
									required
								/>
							</Grid>
						)}
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

QuizTemplateForm.propTypes = {
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
	onSubmit,
	getIMTestTemplates
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	dashboardQuizTemplate: state.dashboardQuizTemplate,
	im_test_templates: state.options.im_test_templates
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizTemplateForm));
