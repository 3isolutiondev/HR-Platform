import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import isEmpty from '../../validations/common/isEmpty';
import { validate } from '../../validations/skill';
import { addFlashMessage } from '../../redux/actions/webActions';
import YesNoField from '../../common/formFields/YesNoField';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';
import SelectField from '../../common/formFields/SelectField';
import { skillCategories } from '../../config/options';

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
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class SkillForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skill: '',
			skill_for_matching: 1,
			errors: {},
			isEdit: false,
			apiURL: '/api/skills',
			redirectURL: '/dashboard/skills',
			showLoading: false,
			category: ''
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/skills/' + this.props.match.params.id,
				redirectURL: '/dashboard/skills/' + this.props.match.params.id + '/edit'
			});
			// this.props.setAddBtn('/dashboard/roles/add','Add New User', 'success', <MdAdd size={17}/>);
			// } else {
			//   this.props.setHeading('Create User');
		}
		// this.props.setSideNavActive(this.state.activeKey);
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { skill, id, skill_for_matching, category } = res.data.data;

					this.setState({ skill, id, skill_for_matching, category });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting sector data'
					});
				});
		}
	}

	isValid() {
		const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

	onChange(e) {
		if (!!this.state.errors[e.target.name]) {
			const errors = Object.assign({}, this.state.errors);
			delete errors[e.target.name];
			this.setState({ [e.target.name]: e.target.value, errors }, () => {
				this.isValid();
			});
		} else {
			this.setState({ [e.target.name]: e.target.value }, () => {
				this.isValid();
			});
		}
	}

	onSubmit(e) {
		e.preventDefault();

		let skillData = {
			skill: this.state.skill,
			skill_for_matching: this.state.skill_for_matching,
			category: this.state.category,
		};

		if (this.state.isEdit) {
			skillData._method = 'PUT';
		}
		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, skillData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(this.state.redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: message
							});
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							if (err.response) {
								if (err.response.status) {
									if (err.response.status === 422) {
										let errors = {};

										if (err.response.data.errors.skill) {
											errors.skill = err.response.data.errors.skill[0];
										} else {
											if (err.response.data.errors.slug) {
												errors.skill = err.response.data.errors.slug[0];
											}
										}

										// skill_for_matching: (err.response.data.errors.skill_for_matching) &&

										this.setState({ errors }, () => {
											this.props.addFlashMessage({
												type: 'error',
												text: err.response.data.message
											});
										});
									}
								}
							} else {
								this.props.addFlashMessage({
									type: 'error',
									text: 'There is an error while processing the request'
								});
							}
						});
					});
			});
		}
	}

	switchOnChange(e) {
		if (e.target.value == 1) {
			// this.props.onChange( e.target.name, 0)
			this.setState({ [e.target.name]: 1 });
		} else {
			this.setState({ [e.target.name]: 0 });
			// this.props.onChange( e.target.name, 1)
		}
	}

	selectOnChange({value}, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	render() {
		let { skill, errors, isEdit, skill_for_matching, showLoading, category } = this.state;

		const { classes } = this.props;

		return (
			<form
				// className={classes.form}
				onSubmit={this.onSubmit}
			>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Skill : ' + skill
						) : (
							APP_NAME + ' - Dashboard > Add Skill'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Skill : ' + skill
							) : (
								APP_NAME + ' Dashboard > Add Skill'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Skill : ' + skill}
								{!isEdit && 'Add Skill'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="skill"
								label="Skill"
								autoComplete="skill"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="skill"
								value={skill}
								onChange={this.onChange}
								error={!isEmpty(errors.skill)}
								helperText={errors.skill}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="skill_for_matching"
								label="Select Skill for Matching"
								ariaLabel="skill_for_matching"
								value={skill_for_matching.toString()}
								onChange={this.switchOnChange}
								name="skill_for_matching"
								error={errors.skill_for_matching}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<SelectField
								label="Category *"
								options={skillCategories}
								value={skillCategories.find( c => c.value === category)}
								onChange={this.selectOnChange}
								placeholder="Select Skill Category"
								isMulti={false}
								name="category"
								error={errors.category}
								fullWidth={true}
								onClear={() => this.setState({category: ''})}
								clearable={true}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
					{/* </Grid> */}
				</Paper>
			</form>
		);
	}
}

SkillForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(SkillForm));
