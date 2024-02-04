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
import YesNoField from '../../common/formFields/YesNoField';
import isEmpty from '../../validations/common/isEmpty';
import { validate } from '../../validations/country';
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
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}
});

class CountryForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			country_code: '',
			phone_code: '',
			nationality: '',
			flag: '',
			seen_in_p11: '1',
			seen_in_security_module: '1',
      vehicle_filled_by_immaper: 'yes',
			errors: {},
			isLoading: false,
			isEdit: false,
			apiURL: '/api/countries',
			redirectURL: '/dashboard/countries'
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/countries/' + this.props.match.params.id,
				redirectURL: '/dashboard/countries/' + this.props.match.params.id + '/edit'
			});
		}
	}

	componentDidMount() {
		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { name, country_code, id, nationality, phone_code, flag, seen_in_p11, seen_in_security_module, vehicle_filled_by_immaper } = res.data.data;

					this.setState({ name, country_code, id, nationality, phone_code, flag, seen_in_p11, seen_in_security_module, vehicle_filled_by_immaper });
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

		let countryData = {
			name: this.state.name,
			country_code: this.state.country_code,
			nationality: this.state.nationality,
			phone_code: this.state.phone_code,
			flag: this.state.flag,
			seen_in_p11: this.state.seen_in_p11,
			seen_in_security_module: this.state.seen_in_security_module,
      vehicle_filled_by_immaper: this.state.vehicle_filled_by_immaper
		};

		if (this.state.isEdit) {
			countryData._method = 'PUT';
		}
		if (this.isValid()) {
			this.setState({ isLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, countryData)
					.then((res) => {
						this.setState({ isLoading: false }, () => {
							const { status, message } = res.data;
							this.props.history.push(this.state.redirectURL);
							this.props.addFlashMessage({
								type: status,
								text: message
							});
						});
					})
					.catch((err) => {
						this.setState({ isLoading: false }, () => {
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
		let {
      name, country_code, phone_code, nationality, flag, seen_in_p11, seen_in_security_module,
      vehicle_filled_by_immaper, isLoading, errors, isEdit } = this.state;

		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Country : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Country'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Country : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Country'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Country : ' + name}
								{!isEdit && 'Add Country'}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={5}>
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
						<Grid item xs={12} sm={2}>
							<TextField
								id="countryCode"
								label="Country Code"
								autoComplete="country_code"
								margin="normal"
								required
								fullWidth
								name="country_code"
								value={country_code}
								onChange={this.onChange}
								error={!isEmpty(errors.country_code)}
								helperText={errors.country_code}
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								id="nationality"
								label="Nationality"
								autoComplete="nationality"
								margin="normal"
								required
								fullWidth
								name="nationality"
								value={nationality}
								onChange={this.onChange}
								error={!isEmpty(errors.nationality)}
								helperText={errors.nationality}
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<TextField
								id="phoneCode"
								label="Phone Code"
								autoComplete="phone_code"
								margin="normal"
								required
								fullWidth
								name="phone_code"
								value={phone_code}
								onChange={this.onChange}
								error={!isEmpty(errors.phone_code)}
								helperText={errors.phone_code}
							/>
						</Grid>
						<Grid item xs={12} sm={10}>
							<TextField
								id="flag"
								label="Flag (URL)"
								autoComplete="flag"
								margin="normal"
								// required
								fullWidth
								name="flag"
								value={flag}
								onChange={this.onChange}
								error={!isEmpty(errors.flag)}
								helperText={errors.flag}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								ariaLabel="Can be seen in P11?"
								label="Can be seen in P11?"
								value={seen_in_p11.toString()}
								onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
								name="seen_in_p11"
								error={errors.seen_in_p11}
								margin="none"
							/>
						</Grid>
            {/* Adding button radio for security module */}
            <Grid item xs={12}>
							<YesNoField
								ariaLabel="Can be seen in SecurityModule?"
								label="Can be seen in SecurityModule?"
								value={seen_in_security_module.toString()}
								onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
								name="seen_in_security_module"
								error={errors.seen_in_security_module}
								margin="none"
							/>
						</Grid>
            <Grid item xs={12}>
							<YesNoField
								ariaLabel="Vehicle detail will be filled by Consultant?"
								label="Vehicle detail will be filled by Consultant?"
								value={vehicle_filled_by_immaper === 'yes' ? '1' : '0'}
								onChange={(e, value) => this.onChange({ target: { name: e.target.name, value: value === '1' ? 'yes' : 'no' } })}
								name="vehicle_filled_by_immaper"
								error={errors.vehicle_filled_by_immaper}
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
							>
								<Save /> Save{' '}
								{isLoading && <CircularProgress className={classes.loading} size={22} thickness={5} />}
							</Button>
						</Grid>
					</Grid>
					{/* </Grid> */}
				</Paper>
			</form>
		);
	}
}

CountryForm.propTypes = {
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(CountryForm));
