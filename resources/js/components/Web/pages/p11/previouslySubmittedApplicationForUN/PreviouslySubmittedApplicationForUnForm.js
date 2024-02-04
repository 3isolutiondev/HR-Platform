import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import DatePickerField from '../../../common/formFields/DatePickerField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateSubmittedApplication } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getYears, getP11ImmapOffices } from '../../../redux/actions/optionActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import SelectField from '../../../common/formFields/SelectField';
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

/**
 * PreviouslySubmittedApplicationForUnForm is a component to show Previously worked with iMMAP form in p11 (profile creation) page.
 *
 * @name PreviouslySubmittedApplicationForUnForm
 * @component
 * @category Page
 * @subcategory P11
 *
 */
class PreviouslySubmittedApplicationForUnForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			starting_date: moment(new Date()).subtract(6, 'M'),
			ending_date: moment(new Date()),
      // ================== For UN Org ==================
      // un_organization: '',
      // ================================================
			errors: {},
			apiURL: '/api/p11-submitted-application-in-un',
			isEdit: false,
			recordId: 0,
			country: {
				value: '',
				label: ''
			},
			project: '',
			duty_station: '',
			immap_office: '',
			line_manager: '',
			position: '',
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.selectChange = this.selectChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.dateOnChange = this.dateOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getP11ImmapOffices();
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

	dateOnChange(e) {
		this.setState({ [e.target.name]: moment(e.target.value) }, () => this.isValid());
	}

	selectChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateSubmittedApplication(this.state);

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
						starting_date,
						ending_date,
						country,
						project,
						line_manager,
						duty_station,
						immap_office,
						position
					} = res.data.data;
					this.setState(
						{
							starting_date: moment(starting_date),
							ending_date: moment(ending_date),
							country: { value: country.id, label: country.name },
							project,
							line_manager: !isEmpty(line_manager) ? line_manager : '',
							duty_station: !isEmpty(duty_station) ? duty_station : '',
							position: !isEmpty(position) ? position : '',
							immap_office: !isEmpty(immap_office)
								? {
										value: immap_office.id,
										label: immap_office.city + ' - ' + immap_office.country.name
									}
								: '',
							isEdit: true,
							recordId: id
						},
						() => {
							this.isValid();
						}
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
			let {
				starting_date,
				ending_date,
				country,
				project,
				duty_station,
				line_manager,
				position,
				immap_office,
				isEdit,
				recordId,
				apiURL
			} = this.state;
			let uploadData = {
				starting_date: starting_date.format('YYYY-MM-DD'),
				ending_date: ending_date.format('YYYY-MM-DD'),
				country_id: country.value,
				project,
				duty_station,
				line_manager,
				position,
				immap_office_id: immap_office.value
			};

			let recId = '';

			if (isEdit) {
				uploadData._method = 'PUT';
				recId = '/' + recordId;
			}

			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(apiURL + recId, uploadData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							this.props.updateList();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Your experience working with iMMAP has been saved'
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
				starting_date: moment(new Date()).subtract(6, 'M'),
				ending_date: moment(new Date()),
				country: {
					value: '',
					label: ''
				},
				project: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-submitted-application-in-un',
				duty_station: '',
				immap_office: '',
				line_manager: '',
				position: '',
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
				starting_date: moment(new Date()).subtract(6, 'M'),
				ending_date: moment(new Date()),
				country: {
					value: '',
					label: ''
				},
				project: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-submitted-application-in-un',
				duty_station: '',
				immap_office: '',
				line_manager: '',
				position: '',
				errors: {}
			},
			() => {
				this.props.handleRemove();
			}
		);
	}

	selectOnChange(values, e) {
		this.setState({ [e.name]: values }, () => this.isValid());
	}

	render() {
		let { isOpen, title, classes, remove, p11Countries, p11ImmapOffices } = this.props;
		let {
			starting_date,
			ending_date,
			errors,
			country,
			project,
			duty_station,
			immap_office,
			line_manager,
			position,
			showLoading
		} = this.state;

		return (
			<Dialog
				open={isOpen}
				onClose={this.handleClose}
				fullWidth
				maxWidth="lg"
				// PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent className={classes.overflowVisible}>
					<Grid container spacing={24}>
						<Grid item xs={12} sm={6}>
							<DatePickerField
								label="Starting Date"
								name="starting_date"
								value={starting_date}
								onChange={this.dateOnChange}
								error={errors.starting_date}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<DatePickerField
								label="Ending Date"
								name="ending_date"
								value={ending_date}
								onChange={this.dateOnChange}
								error={errors.ending_date}
							/>
						</Grid>
						{/* ================== For UN Org ================== */}
						{/* <Grid item xs={12}>
							<SelectField
								label="UN Organization *"
								options={un_organizations}
								value={un_organization}
								onChange={this.selectChange}
								placeholder="Select UN Organization"
								isMulti={false}
								name="un_organization"
								error={errors.un_organization}
								required
								fullWidth
							/>
						</Grid> */}
            {/* ================================================ */}
						<Grid item xs={12} sm={6}>
							<SelectField
								label="Country *"
								options={p11Countries}
								value={country}
								onChange={this.selectOnChange}
								placeholder="Country"
								isMulti={false}
								name="country"
								error={errors.country}
								required
                fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectField
								label="3iSolution Office *"
								options={p11ImmapOffices}
								value={immap_office}
								onChange={this.selectOnChange}
								placeholder="3iSolution Office"
								isMulti={false}
								name="immap_office"
								error={errors.immap_office}
								required
                fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="duty_station"
								name="duty_station"
								label="Duty Station"
								fullWidth
								autoComplete="duty_station"
								value={duty_station}
								onChange={this.onChange}
								error={!isEmpty(errors.duty_station)}
								helperText={errors.duty_station}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="line_manager"
								name="line_manager"
								label="Line Manager"
								fullWidth
								autoComplete="line_manager"
								value={line_manager}
								onChange={this.onChange}
								error={!isEmpty(errors.line_manager)}
								helperText={errors.line_manager}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="position"
								name="position"
								label="Position"
								fullWidth
								autoComplete="position"
								value={position}
								onChange={this.onChange}
								error={!isEmpty(errors.position)}
								helperText={errors.position}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="project"
								name="project"
								label="Project"
								fullWidth
								autoComplete="project"
								value={project}
								onChange={this.onChange}
								error={!isEmpty(errors.project)}
								helperText={errors.project}
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
						Save {showLoading && <CircularProgress thickness={5} size={22} className={classes.loading}/>}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

PreviouslySubmittedApplicationForUnForm.defaultProps = {
	getProfileLastUpdate: false
};

PreviouslySubmittedApplicationForUnForm.propTypes = {
  /**
   * getAPI is a prop to call redux action to get data based on url parameter.
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop to call redux action to post data based on url parameter.
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * getP11ImmapOffices is a prop to call redux action to get list of immap offices.
   */
  getP11ImmapOffices: PropTypes.func.isRequired,
  /**
   * getYears is a prop to call redux action to get list of years.
   */
  getYears: PropTypes.func.isRequired,
  /**
   * profileLastUpdate is a prop to call redux action to update last update timestamp.
   */
  profileLastUpdate: PropTypes.func.isRequired,
  /**
   * recordId is a prop containing record id.
   */
  recordId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([''])
  ]),
  /**
   * getP11 is a function prop that run after saving the form.
   */
  getP11: PropTypes.func.isRequired,
  /**
   * updateList is a function prop that run after saving the form.
   */
  updateList: PropTypes.func.isRequired,
  /**
   * onClose is a function prop that run when the modal form is closed.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * handleRemove is a prop to call function to remove data.
   */
  handleRemove: PropTypes.func,
  /**
   * isOpen is a prop containing boolean value to show / close the modal form.
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * title is a prop containing the title of the modal
   */
  title: PropTypes.string.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * remove is a prop containing boolean value to show remove button.
   */
  remove: PropTypes.bool,
  /**
   * p11Countries is a prop containing list of countries.
   */
  p11Countries: PropTypes.array.isRequired,
  /**
   * p11ImmapOffices is a prop containing list of immap offices.
   */
  p11ImmapOffices: PropTypes.array.isRequired,
  /**
   * getProfileLastUpdate is a prop containing boolean value to get latest data of profile last update date
   */
  getProfileLastUpdate: PropTypes.bool
  // ================== For UN Org ==================
  // un_organizations: PropTypes.array.isRequired,
  // ================================================
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
	getP11ImmapOffices,
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
	p11Countries: state.options.p11Countries,
	p11ImmapOffices: state.options.p11ImmapOffices
});

export default withStyles(styles)(
	connect(mapStateToProps, mapDispatchToProps)(PreviouslySubmittedApplicationForUnForm)
);
