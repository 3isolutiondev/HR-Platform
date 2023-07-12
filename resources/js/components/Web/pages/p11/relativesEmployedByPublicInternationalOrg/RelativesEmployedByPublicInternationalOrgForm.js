import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectField from '../../../common/formFields/SelectField';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import isEmpty from '../../../validations/common/isEmpty';
import { validateRelativesEmployedByPublicInternationalOrg } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
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

class RelativesEmployedByPublicInternationalOrgForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			family_name: '',
			first_name: '',
			middle_name: '',
			relationship: '',
			job_title: '',
			country: '',
			errors: {},
			apiURL: '/api/p11-relatives-employed',
			isEdit: false,
			recordId: 0,
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.clearState = this.clearState.bind(this);
	}
	componentDidMount() {
		//reference event method from parent
		this.props.onRef(this);
	}
	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateRelativesEmployedByPublicInternationalOrg(this.state);

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
					let { family_name, first_name, middle_name, relationship, job_title, country } = res.data.data;
					this.setState({
						family_name,
						first_name,
						relationship,
						job_title,
						country: { value: country.id, label: country.name },
						isEdit: true,
						recordId: id
					});
					if (middle_name == null) {
						this.setState({
							middle_name: ''
						});
					} else {
						this.setState({
							middle_name
						});
					}
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
			let { family_name, first_name, middle_name, relationship, job_title, country } = this.state;
			let recordData = {
				family_name,
				first_name,
				middle_name,
				relationship,
				job_title,
				country_id: country.value
			};

			let recId = '';

			if (this.state.isEdit) {
				recordData._method = 'PUT';
				recId = '/' + this.state.recordId;
			}

			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL + recId, recordData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							this.props.updateList();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Your relative has been saved'
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
								text:
									typeof err.response.data.message !== 'undefined'
										? err.response.data.message
										: 'Error'
							});
						});
					});
			});
		}
	}

	handleClose() {
		this.setState(
			{
				family_name: '',
				first_name: '',
				middle_name: '',
				relationship: '',
				job_title: '',
				country: '',
				errors: {},
				apiURL: '/api/p11-relatives-employed',
				isEdit: false,
				recordId: 0,
				showLoading: false
			},
			() => {
				this.props.onClose();
			}
		);
	}

	clearState() {
		this.setState({
			family_name: '',
			first_name: '',
			middle_name: '',
			relationship: '',
			job_title: '',
			country: '',
			errors: {},
			apiURL: '/api/p11-relatives-employed',
			isEdit: false,
			recordId: 0,
			showLoading: false
		});
	}

	handleRemove() {
		this.props.handleRemove();
	}

	render() {
		let { isOpen, title, classes, remove, p11Countries } = this.props;
		let {
			family_name,
			first_name,
			middle_name,
			relationship,
			errors,
			job_title,
			country,
			showLoading
		} = this.state;

		return (
			<Dialog open={isOpen} onClose={this.handleClose} fullWidth>
				{/* //PaperProps={{ style: { overflow: 'visible' } }}> */}
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="family_name"
								name="family_name"
								label="Family name"
								fullWidth
								value={family_name}
								autoComplete="family_name"
								onChange={this.onChange}
								error={!isEmpty(errors.family_name)}
								helperText={errors.family_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="first_name"
								name="first_name"
								label="First name"
								fullWidth
								autoComplete="first_name"
								value={first_name}
								onChange={this.onChange}
								error={!isEmpty(errors.first_name)}
								helperText={errors.first_name}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="middle_name"
								name="middle_name"
								label="Middle Name"
								fullWidth
								autoComplete="name"
								value={middle_name}
								onChange={this.onChange}
								error={!isEmpty(errors.middle_name)}
								helperText={errors.middle_name}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="relationship"
								name="relationship"
								label="Relationship"
								fullWidth
								value={relationship}
								autoComplete="name"
								onChange={this.onChange}
								error={!isEmpty(errors.relationship)}
								helperText={errors.relationship}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="job_title"
								name="job_title"
								label="Job Title/Position"
								fullWidth
								autoComplete="job_title"
								value={job_title}
								onChange={this.onChange}
								error={!isEmpty(errors.job_title)}
								helperText={errors.job_title}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							{/* <TextField
								required
								id="international_org_name"
								name="international_org_name"
								label="International Organization Name"
								fullWidth
								autoComplete="international_org_name"
								value={international_org_name}
								onChange={this.onChange}
								error={!isEmpty(errors.international_org_name)}
								helperText={errors.international_org_name}
							/> */}
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
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					{remove ? (
						<Button
							onClick={this.handleRemove}
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

RelativesEmployedByPublicInternationalOrgForm.defaultProps = {
	getProfileLastUpdate: false
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage,
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

export default withStyles(styles)(
	connect(mapStateToProps, mapDispatchToProps)(RelativesEmployedByPublicInternationalOrgForm)
);
