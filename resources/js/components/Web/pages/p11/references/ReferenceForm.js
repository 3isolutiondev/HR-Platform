import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectField from '../../../common/formFields/SelectField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateReference } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getP11Countries } from '../../../redux/actions/optionActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import PhoneNumberField from '../../../common/formFields/PhoneNumberField';
import { white } from '../../../config/colors';

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
	overflowVisible: {
		overflow: 'visible'
	},
	responsiveImage: {
		'max-width': '200px',
		width: '100%'
	},
	addMarginRight: {
		marginRight: '4px'
	},
	removeButton: {
		position: 'absolute',
		left: '10px',
		bottom: '10px'
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class ReferenceForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			full_name: '',
			country: '',
			phone: '',
			email: '',
			organization: '',
			job_position: '',
			errors: {},
			apiURL: '/api/p11-references',
			isEdit: false,
			recordId: 0,
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.phoneOnChange = this.phoneOnChange.bind(this);
	}

	componentDidMount() {
		if (isEmpty(this.props.p11Countries)) {
			this.props.getP11Countries();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
		}

		if (prevProps.resetData == false && this.props.resetData == true) {
			this.setState({
				name: '',
				full_name: '',
				country: '',
				phone: '',
				email: '',
				organization: '',
				job_position: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-references',
				showLoading: false
			});
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	phoneOnChange(value, name, errors) {
		let phoneErrors = this.state.errors;
		if (!isEmpty(errors)) {
			phoneErrors[name] = errors[name];
		}
		this.setState({ [name]: value, errors: phoneErrors }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateReference(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

	getData(id) {
		if (!isEmpty(id)) {
			this.props
				.getAPI(this.state.apiURL + '/' + id)
				.then((res) => {
					let { full_name, country, phone, email, organization, job_position } = res.data.data;
					this.setState({
						full_name,
						country: { value: country.id, label: country.name },
						phone: isEmpty(phone) ? '' : phone,
						email,
						organization,
						job_position,
						isEdit: true,
						recordId: id
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
		}
	}

	handleSave() {
		if (this.isValid()) {
			let uploadData = {
				full_name: this.state.full_name,
				country_id: this.state.country.value,
				phone: this.state.phone,
				email: this.state.email,
				organization: this.state.organization,
				job_position: this.state.job_position
			};

			let recId = '';

			if (this.state.isEdit) {
				uploadData._method = 'PUT';
				recId = '/' + this.state.recordId;
			}

			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL + recId, uploadData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							this.props.updateList();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Your references has been saved'
							});
							this.props.getP11();
							if (this.props.getProfileLastUpdate) {
								this.props.profileLastUpdate();
							}
							this.handleClose();
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'Error'
							});
						});
					});
			});
		}
	}

	handleClose() {
		this.setState(
			{
				name: '',
				full_name: '',
				country: '',
				phone: '',
				email: '',
				organization: '',
				job_position: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-references',
				showLoading: false,
				errors: {}
			},
			() => {
				this.props.onClose();
			}
		);
	}

	handleRemove() {
		this.setState(
			{
				name: '',
				full_name: '',
				country: '',
				phone: '',
				email: '',
				organization: '',
				job_position: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-references',
				showLoading: false
			},
			() => {
				this.props.handleRemove();
			}
		);
	}

	selectedFile(e) {
		this.setState({ diploma_file: e.target.files[0] }, () => this.isValid());
	}

	render() {
		let { isOpen, classes, remove, p11Countries } = this.props;
		let { full_name, country, phone, organization, email, job_position, errors, showLoading } = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				// PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>Reference</DialogTitle>
				<DialogContent>
					{/* <DialogContent className={classes.overflowVisible}> */}
					<Grid container spacing={24} alignItems="center">
						<Grid item xs={12} sm={8}>
							<TextField
								required
								id="full_name"
								name="full_name"
								label="Full Name"
								fullWidth
								value={full_name}
								autoComplete="full_name"
								onChange={this.onChange}
								error={!isEmpty(errors.full_name)}
								helperText={errors.full_name}
								autoFocus
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<SelectField
								label="Country *"
								options={p11Countries}
								value={country}
								onChange={this.selectOnChange}
								placeholder="Select country"
								isMulti={false}
								name="country"
								error={errors.country}
								required
								fullWidth
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<PhoneNumberField
								id="phone"
								name="phone"
								label="Phone *"
								placeholder="Please enter telephone number"
								fullWidth
								value={phone}
								onChange={this.phoneOnChange}
								margin="none"
								error={errors.phone}
							/>
							{/* <TextField
                id="phone"
                name="phone"
                label="Phone"
                fullWidth
                value={phone}
                autoComplete="phone"
                onChange={this.onChange}
                error={!isEmpty(errors.phone)}
                helperText={errors.phone}
                autoFocus
              /> */}
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="email"
								name="email"
								label="Email"
								fullWidth
								value={email}
								autoComplete="email"
								onChange={this.onChange}
								error={!isEmpty(errors.email)}
								helperText={errors.email}
								autoFocus
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="organization"
								name="organization"
								label="Organization"
								fullWidth
								value={organization}
								autoComplete="organization"
								onChange={this.onChange}
								error={!isEmpty(errors.organization)}
								helperText={errors.organization}
								autoFocus
								required
								multiline
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="job_position"
								name="job_position"
								label="Job Position"
								fullWidth
								value={job_position}
								autoComplete="job_position"
								onChange={this.onChange}
								error={!isEmpty(errors.job_position)}
								helperText={errors.job_position}
								autoFocus
								required
								multiline
								margin="dense"
							/>
						</Grid>
						{/* <Grid item xs={12}>
							<TextField
								id="address"
								name="address"
								label="Address"
								fullWidth
								value={address}
								autoComplete="address"
								onChange={this.onChange}
								error={!isEmpty(errors.address)}
								helperText={errors.address}
								autoFocus
								required
								multiline
								rows={5}
								margin="dense"
							/>
						</Grid> */}
						{/* <Grid item xs={12}>
							<TextField
								id="occupation"
								name="occupation"
								label="Business or Occupation"
								fullWidth
								value={occupation}
								autoComplete="occupation"
								onChange={this.onChange}
								error={!isEmpty(errors.occupation)}
								helperText={errors.occupation}
								autoFocus
								required
								margin="dense"
							/>
						</Grid> */}
					</Grid>
				</DialogContent>
				<DialogActions>
					{remove ? (
						<Button
							onClick={this.props.handleRemove}
							color="primary"
							className={classes.removeButton}
							justify="space-between"
						>
							Remove
						</Button>
					) : null}
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.handleSave} color="primary" variant="contained">
						Save {showLoading && <CircularProgress thickness={5} size={22} className={classes.loading} />}
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
	getAPI,
	postAPI,
	addFlashMessage,
	getP11Countries,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	p11Countries: state.options.p11Countries
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReferenceForm));
