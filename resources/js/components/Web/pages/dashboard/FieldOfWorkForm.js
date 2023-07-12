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
import { validate } from '../../validations/fieldOfWork';
import { addFlashMessage } from '../../redux/actions/webActions';
import YesNoField from '../../common/formFields/YesNoField';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';

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

class FieldOfWorkForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			field: '',
			is_approved: 1,
			errors: {},
			isEdit: false,
			apiURL: '/api/field-of-works',
			redirectURL: '/dashboard/field-of-works',
			showLoading: false
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/field-of-works/' + this.props.match.params.id,
				redirectURL: '/dashboard/field-of-works/' + this.props.match.params.id + '/edit'
			});
		}
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { field, id, is_approved } = res.data.data;

					this.setState({ field, id, is_approved });
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

		let fieldOfWorkData = {
			field: this.state.field,
			is_approved: this.state.is_approved
		};

		if (this.state.isEdit) {
			fieldOfWorkData._method = 'PUT';
		}
		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, fieldOfWorkData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(this.state.redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: 'Area of expertise successfully created'
							});
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							if (err.response) {
								if (err.response.status) {
									if (err.response.status === 422) {
										let errors = {};

										if (err.response.data.errors.field) {
											errors.field = err.response.data.errors.field[0];
										} else {
											if (err.response.data.errors.slug) {
												errors.field = err.response.data.errors.slug[0];
											}
										}

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
			this.setState({ [e.target.name]: 1 });
		} else {
			this.setState({ [e.target.name]: 0 });
		}
	}

	render() {
		let { field, errors, isEdit, is_approved, showLoading } = this.state;

		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Area of Expertise : ' + field
						) : (
							APP_NAME + ' - Dashboard > Add Area of Expertise'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Area of Expertise : ' + field
							) : (
								APP_NAME + ' Dashboard > Add Area of Expertise'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Area of Expertise: ' + field}
								{!isEdit && 'Add Area of Expertise'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="field"
								label="Area"
								autoComplete="field"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="field"
								value={field}
								onChange={this.onChange}
								error={!isEmpty(errors.field)}
								helperText={errors.field}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_approved"
								label="Approve this area of expertise"
								ariaLabel="is_approved"
								value={is_approved.toString()}
								onChange={this.switchOnChange}
								name="is_approved"
								error={errors.is_approved}
								margin="dense"
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
				</Paper>
			</form>
		);
	}
}

FieldOfWorkForm.propTypes = {
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(FieldOfWorkForm));
