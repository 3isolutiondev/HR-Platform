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
import YesNoField from '../../../common/formFields/YesNoField';
import isEmpty from '../../../validations/common/isEmpty';
import { validatePermanentCivilServant } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getYears } from '../../../redux/actions/optionActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { month } from '../../../config/options';
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

class PermanentCivilServantForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			f_month: '',
			f_year: '',
			t_month: '',
			t_year: '',
			is_now: 0,
			institution: '',
			errors: {},
			apiURL: '/api/p11-permanent-civil-servants',
			isEdit: false,
			recordId: 0,
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
		this.autoCompleteOnChange = this.autoCompleteOnChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.clearState = this.clearState.bind(this);
	}

	componentDidMount() {
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
		const { errors, isValid } = validatePermanentCivilServant(this.state);

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
					let { from, to, is_now, institution } = res.data.data;
					from = new Date(from);
					to = new Date(to);

					this.setState({
						is_now,
						institution,
						f_month: ('0' + (from.getMonth() + 1)).slice(-2),
						f_year: from.getFullYear(),
						t_month: ('0' + (to.getMonth() + 1)).slice(-2),
						t_year: to.getFullYear(),

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
				from: this.state.f_year + '-' + this.state.f_month + '-01',
				// to: this.state.t_year + '-' + this.state.t_month + '-01',
				is_now: this.state.is_now,
				institution: this.state.institution
			};

			if (this.state.is_now == '0') {
				uploadData.to = this.state.t_year + '-' + this.state.t_month + '-01';
			}

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
								text: 'Your permanent civil servant history has been saved'
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
				is_now: 0,
				institution: '',
				f_month: '',
				f_year: '',
				t_month: '',
				t_year: '',
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-permanent-civil-servants',
				showLoading: false
			},
			() => {
				this.props.onClose();
			}
		);
	}

	clearState() {
		this.setState({
			is_now: 0,
			institution: '',
			f_month: '',
			f_year: '',
			t_month: '',
			t_year: '',
			recordId: 0,
			isEdit: false,
			apiURL: '/api/p11-permanent-civil-servants',
			showLoading: false
		});
	}

	handleRemove() {
		this.props.handleRemove();
	}

	selectedFile(e) {
		this.setState({ diploma_file: e.target.files[0] }, () => this.isValid());
	}

	autoCompleteOnChange(name, value, callback) {
		this.setState({ [name]: value }, () => {
			if (callback) {
				callback();
			}
		});
	}

	render() {
		let { isOpen, title, classes, years, remove } = this.props;
		let { is_now, institution, f_month, f_year, t_month, t_year, errors, isEdit, showLoading } = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				// PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>{title}</DialogTitle>
				{/* <DialogContent className={classes.overflowVisible}> */}
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12} sm={12}>
							<YesNoField
								ariaLabel="is_now"
								label="Are you still a civil servant in this institution?"
								value={is_now.toString()}
								onChange={this.onChange}
								name="is_now"
								error={errors.is_now}
								margin="none"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								required
								id="f_month"
								name="f_month"
								select
								label="From (Month)"
								value={f_month}
								onChange={this.onChange}
								error={!isEmpty(errors.f_month)}
								helperText={errors.f_month}
								margin="dense"
								fullWidth
								className={classes.capitalize}
								autoFocus
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
								id="f_year"
								name="f_year"
								select
								label="From (Year)"
								value={f_year}
								onChange={this.onChange}
								error={!isEmpty(errors.f_year)}
								helperText={errors.f_year}
								margin="dense"
								fullWidth
							>
								{years.map((year1, index) => (
									<MenuItem key={index} value={year1}>
										{year1}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{is_now == '0' && (
							<Grid item xs={12} sm={3}>
								<TextField
									required
									id="t_month"
									name="t_month"
									select
									label="To (Month)"
									value={t_month}
									onChange={this.onChange}
									error={!isEmpty(errors.t_month)}
									helperText={errors.t_month}
									margin="dense"
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
						)}
						{is_now == '0' && (
							<Grid item xs={12} sm={3}>
								<TextField
									required
									id="t_year"
									name="t_year"
									select
									label="To (Year)"
									value={t_year}
									onChange={this.onChange}
									error={!isEmpty(errors.t_year)}
									helperText={errors.t_year}
									margin="dense"
									fullWidth
								>
									{years.map((year1, index) => (
										<MenuItem key={index} value={year1}>
											{year1}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						)}
						<Grid item xs={12}>
							<TextField
								required
								id="institution"
								name="institution"
								label="Institution"
								fullWidth
								value={institution}
								autoComplete="institution"
								onChange={this.onChange}
								error={!isEmpty(errors.institution)}
								helperText={errors.institution}
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

PermanentCivilServantForm.defaultProps = {
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
	years: state.options.years
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PermanentCivilServantForm));
