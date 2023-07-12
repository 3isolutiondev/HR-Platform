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
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectField from '../../../common/formFields/SelectField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateEducationSchool } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getP11Countries, getYears } from '../../../redux/actions/optionActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { month } from '../../../config/options';
import DropzoneFileField from '../../../common/formFields/DropzoneFileField';
import {
	p11SchoolCertificateURL,
	schoolCertificateCollection,
	acceptedDocImageFiles,
	p11DeleteSchoolCertificateURL
} from '../../../config/general';
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
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}
});

class SchoolForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			place: '',
			country: '',
			af_month: '',
			af_year: '',
			at_month: '',
			at_year: '',
			// type: '',
			certificate: '',
			certificate_file: null,
			errors: {},
			apiURL: '/api/p11-education-schools',
			isEdit: false,
			recordId: 0,
			years: [],
			attachment: {},
			media: '',
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.selectedFile = this.selectedFile.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	componentDidMount() {
		if (isEmpty(this.props.years)) {
			this.props.getYears();
		}
		if (isEmpty(this.props.p11Countries)) {
			this.props.getP11Countries();
		}

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

	clearState() {
		this.setState({
			name: '',
			place: '',
			country: '',
			af_month: '',
			af_year: '',
			at_month: '',
			at_year: '',
			// type: '',
			certificate: '',
			certificate_file: '',
			recordId: 0,
			isEdit: false,
			apiURL: '/api/p11-education-schools',
			showLoading: false
		});
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateEducationSchool(this.state);

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
					let {
						name,
						place,
						country,
						attended_from,
						attended_to,
						// type,
						certificate,
						certificate_file,
						media,
						attachment
					} = res.data.data;
					attended_from = new Date(attended_from);
					attended_to = new Date(attended_to);

					this.setState(
						{
							name,
							place,
							country: { value: country.id, label: country.name },
							af_month: ('0' + (attended_from.getMonth() + 1)).slice(-2),
							af_year: attended_from.getFullYear(),
							at_month: ('0' + (attended_to.getMonth() + 1)).slice(-2),
							at_year: attended_to.getFullYear(),
							// type,
							certificate,
							certificate_file,
							attachment,
							media,
							isEdit: true,
							recordId: id
						},
						() => this.isValid()
					);
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
			const {
				name,
				place,
				country,
				af_year,
				af_month,
				at_month,
				at_year,
				// type,
				certificate,
				certificate_file
			} = this.state;
			let recId = '';

			let uploadData = {
				name,
				place,
				country_id: country.value,
				attended_from: af_year + '-' + af_month + '-01',
				attended_to: at_year + '-' + at_month + '-01',
				// type,
				certificate
			};

			if (!isEmpty(certificate_file)) {
				uploadData.certificate_file_id = certificate_file.file_id;
			}

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
								text: 'Your training has been saved'
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
								text: 'There is an error while saving your data'
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
				place: '',
				country: '',
				af_month: '',
				af_year: '',
				at_month: '',
				at_year: '',
				// type: '',
				certificate: '',
				certificate_file: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-education-schools',
				showLoading: false
			},
			() => {
				this.props.onClose();
			}
		);
	}

	selectedFile(e) {
		this.setState({ certificate_file: e.target.files[0] }, () => this.isValid());
	}

	onUpload(name, files) {
		if (!isEmpty(files)) {
			const { file_id, file_url, mime, filename } = files[0];
			this.setState({ [name]: { file_id, file_url, mime, filename } }, () => {
				this.isValid();
				this.props.addFlashMessage({
					type: 'success',
					text: 'Your file succesfully uploaded'
				});
			});
		} else {
			this.setState({ [name]: {} }, () => this.isValid());
		}
	}

	onDelete(name, deleteURL, files, deletedFileId) {
		if (isEmpty(files)) {
			this.props
				.postAPI(deleteURL, {
					id: deletedFileId,
					education_school_id: !isEmpty(this.props.recordId) ? this.props.recordId : null
				})
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: res.data.data.message ? res.data.data.message : 'Your file succesfully deleted'
					});
					this.setState({ [name]: {} }, () => this.isValid());
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while deleting Your file'
					});
				});
		} else {
			this.setState({ [name]: files }, () => this.isValid());
		}
	}

	handleRemove() {
		this.props.handleRemove();
	}

	render() {
		let { isOpen, title, classes, p11Countries, years, remove } = this.props;
		let {
			name,
			place,
			country,
			af_month,
			af_year,
			at_month,
			at_year,
			// type,
			certificate,
			certificate_file,
			errors,
			// isEdit,
			// media,
			// attachment,
			showLoading
		} = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				// PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Grid container spacing={24} alignItems="center">
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="name"
								name="name"
								label="Formal Training / Workshop Name"
								fullWidth
								value={name}
								autoComplete="name"
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								required
								id="place"
								name="place"
								label="City"
								fullWidth
								value={place}
								autoComplete="place"
								onChange={this.onChange}
								error={!isEmpty(errors.place)}
								helperText={errors.place}
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
								fullWidth={true}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="af_month"
								name="af_month"
								select
								label="Attended From (Month)"
								value={af_month}
								onChange={this.onChange}
								error={!isEmpty(errors.af_month)}
								helperText={errors.af_month}
								margin="normal"
								fullWidth
								className={classes.capitalize}
							>
								{month.map((month, index) => (
									<MenuItem
										key={index}
										value={(index + 1).toString().length < 2 ? '0' + (index + 1) : index + 1}
										className={classes.capitalize}
									>
										{month}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="af_year"
								name="af_year"
								select
								label="Attended From (Year)"
								value={af_year}
								onChange={this.onChange}
								error={!isEmpty(errors.af_year)}
								helperText={errors.af_year}
								margin="normal"
								fullWidth
							>
								{years.map((year1, index) => (
									<MenuItem key={index} value={year1}>
										{year1}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="at_month"
								name="at_month"
								select
								label="Attended To (Month)"
								value={at_month}
								onChange={this.onChange}
								error={!isEmpty(errors.at_month)}
								helperText={errors.at_month}
								margin="normal"
								fullWidth
								className={classes.capitalize}
							>
								{month.map((month, index) => (
									<MenuItem
										key={index}
										value={(index + 1).toString().length < 2 ? '0' + (index + 1) : index + 1}
										className={classes.capitalize}
									>
										{month}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="at_year"
								name="at_year"
								select
								label="Attended To (Year)"
								value={at_year}
								onChange={this.onChange}
								error={!isEmpty(errors.at_year)}
								helperText={errors.at_year}
								margin="normal"
								fullWidth
							>
								{years.map((year1, index) => (
									<MenuItem key={index} value={year1}>
										{year1}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{/* <Grid item xs={12} sm={6}>
							<TextField
								required
								id="type"
								name="type"
								label="Type"
								fullWidth
								value={type}
								autoComplete="type"
								onChange={this.onChange}
								error={!isEmpty(errors.type)}
								helperText={errors.type}
							/>
						</Grid> */}
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="certificate"
								name="certificate"
								label="Certificates or diplomas obtained"
								fullWidth
								value={certificate}
								autoComplete="certificate"
								onChange={this.onChange}
								error={!isEmpty(errors.certificate)}
								helperText={errors.certificate}
							/>
						</Grid>
						<Grid item xs={12}>
							<DropzoneFileField
								name="certificate_file"
								label="Certificate"
								onUpload={this.onUpload}
								onDelete={this.onDelete}
								collectionName={schoolCertificateCollection}
								apiURL={p11SchoolCertificateURL}
								deleteAPIURL={p11DeleteSchoolCertificateURL}
								isUpdate={false}
								filesLimit={1}
								acceptedFiles={acceptedDocImageFiles}
								gallery_files={!isEmpty(certificate_file) ? [ certificate_file ] : []}
								error={errors.certificate_file}
								fullWidth={false}
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
						Save {showLoading && <CircularProgress className={classes.loading} thickness={5} size={22} />}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

SchoolForm.defaultProps = {
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
	getP11Countries,
	getYears,
	profileLastUpdate
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	years: state.options.years,
	p11Countries: state.options.p11Countries
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SchoolForm));
