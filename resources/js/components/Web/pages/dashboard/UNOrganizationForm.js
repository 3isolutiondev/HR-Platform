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
import { validate } from '../../validations/unOrganization';
import { addFlashMessage } from '../../redux/actions/webActions';
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

class UNOrganizationForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			abbreviation: '',
			errors: {},
			isEdit: false,
			apiURL: '/api/un-organizations',
			redirectURL: '/dashboard/un-organizations',
			showLoading: false
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/un-organizations/' + this.props.match.params.id,
				redirectURL: '/dashboard/un-organizations/' + this.props.match.params.id + '/edit'
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
					const { name, abbreviation, id } = res.data.data;

					this.setState({ name, abbreviation, id });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting country data'
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

		let UNOrganizationData = {
			name: this.state.name,
			abbreviation: this.state.abbreviation
		};

		if (this.state.isEdit) {
			UNOrganizationData._method = 'PUT';
		}
		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, UNOrganizationData)
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
							this.props.addFlashMessage({
								type: err.response.data.status ? err.response.data.status : 'error',
								text: err.response.data.message
									? err.response.data.message
									: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

	render() {
		let { name, abbreviation, errors, isEdit, showLoading } = this.state;

		const { classes } = this.props;

		return (
			<form
				// className={classes.form}
				onSubmit={this.onSubmit}
			>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit UN Organization : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add UN Organization'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit UN Organization : ' + name
							) : (
								APP_NAME + ' Dashboard > Add UN Organization'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit UN Organization : ' + name}
								{!isEdit && 'Add UN Organization'}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={8}>
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
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="abbreviation"
								label="Abbreviation"
								autoComplete="abbreviation"
								margin="normal"
								required
								fullWidth
								name="abbreviation"
								value={abbreviation}
								onChange={this.onChange}
								error={!isEmpty(errors.abbreviation)}
								helperText={errors.abbreviation}
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

UNOrganizationForm.propTypes = {
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(UNOrganizationForm));
