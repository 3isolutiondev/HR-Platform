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
import MenuItem from '@material-ui/core/MenuItem';
import SelectField from '../../../common/formFields/SelectField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateProfessionalSociety } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getYears, getSectors } from '../../../redux/actions/optionActions';
import { month } from '../../../config/options';
import { pluck } from '../../../utils/helper';
// import { pluck } from '../../../utils/j'
// import { lang } from 'moment';
// import ProfessionalSocietyLists from './ProfessionalSocietyLists';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
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
	}
});

class ProfessionalSocietyForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			country: '',
			af_month: '',
			af_year: '',
			at_month: '',
			at_year: '',
			sectors: '',
			allSectors: [],
			errors: {},
			apiURL: '/api/p11-professional-societies',
			isEdit: false,
			recordId: 0,
			_isMounted: false
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	componentDidMount() {
		if (isEmpty(this.props.allSectors)) {
			this.props.getSectors();
		}
		if (isEmpty(this.props.years)) {
			this.props.getYears();
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

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	isValid() {
		let formData = Object.assign(this.state, { allSectors: this.props.allSectors });
		const { errors, isValid } = validateProfessionalSociety(formData);

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
					let { name, description, country, attended_from, attended_to, sectors } = res.data.data;
					attended_from = new Date(attended_from);
					attended_to = new Date(attended_to);

					this.setState({
						name,
						description,
						country: { value: country.id, label: country.name },
						af_month: ('0' + (attended_from.getMonth() + 1)).slice(-2),
						af_year: attended_from.getFullYear(),
						at_month: ('0' + (attended_to.getMonth() + 1)).slice(-2),
						at_year: attended_to.getFullYear(),
						sectors,
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
				name: this.state.name,
				description: this.state.description,
				country_id: this.state.country.value,
				attended_from: this.state.af_year + '-' + this.state.af_month + '-01',
				attended_to: this.state.at_year + '-' + this.state.at_month + '-01'
			};

			if (!isEmpty(this.state.sectors)) {
				uploadData.sectors = pluck(this.state.sectors, 'value');
			}
			let recId = '';

			if (this.state.isEdit) {
				uploadData._method = 'PUT';
				recId = '/' + this.state.recordId;
			}

			this.props
				.postAPI(this.state.apiURL + recId, uploadData)
				.then((res) => {
					this.props.updateList();
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your professional societies has been saved'
					});
					this.props.getP11();
					this.handleClose();
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
					});
				});
		}
	}

	handleClose() {
		this.setState(
			{
				name: '',
				description: '',
				country: '',
				af_month: '',
				af_year: '',
				at_month: '',
				at_year: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-professional-societies',
				errors: {},
				sectors: ''
			},
			() => {
				this.props.onClose();
			}
		);
	}

	clearState() {
		this.setState({
			name: '',
			description: '',
			country: '',
			af_month: '',
			af_year: '',
			at_month: '',
			at_year: '',
			recordId: 0,
			isEdit: false,
			apiURL: '/api/p11-professional-societies',
			errors: {},
			sectors: ''
		});
	}

	handleRemove() {
		this.props.handleRemove();
	}

	selectedFile(e) {
		this.setState({ diploma_file: e.target.files[0] }, () => this.isValid());
	}

	render() {
		let { isOpen, title, classes, countries, years, allSectors, remove } = this.props;
		let { name, description, country, af_month, af_year, at_month, at_year, sectors, errors, isEdit } = this.state;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.handleClose}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12} sm={8}>
							<TextField
								required
								id="name"
								name="name"
								label="Name of the Institution"
								fullWidth
								value={name}
								autoComplete="international_affairs_name"
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<SelectField
								label="Country *"
								options={countries}
								value={country}
								onChange={this.selectOnChange}
								placeholder="Select country"
								isMulti={false}
								name="country"
								error={errors.country}
								required
								fullWidth={true}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12}>
							<SelectField
								label="Sector *"
								options={allSectors}
								value={sectors}
								onChange={this.selectOnChange}
								placeholder="Select sectors"
								isMulti={false}
								name="sectors"
								error={errors.sectors}
								required
								isMulti={true}
								fullWidth={true}
								margin="none"
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
						<Grid item xs={12}>
							<TextField
								id="description"
								name="description"
								label="Desciption of duties?"
								value={description}
								onChange={this.onChange}
								error={!isEmpty(errors.description)}
								helperText={errors.description}
								fullWidth
								multiline
								rows={3}
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
						Save
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
	getYears,
	getSectors
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	years: state.options.years,
	allSectors: state.options.sectors
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProfessionalSocietyForm));
