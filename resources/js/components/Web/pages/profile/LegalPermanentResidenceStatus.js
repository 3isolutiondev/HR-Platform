import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classname from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { YesNoURL } from '../../config/general';
import SelectField from '../../common/formFields/SelectField';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import isEmpty from '../../validations/common/isEmpty';
import YesNoField from '../../common/formFields/YesNoField';
import { checkError } from '../../redux/actions/webActions';
import { validateLegalPermanentResidence } from '../../validations/profile';
import {
	getLegalPermanentResidenceStatus,
	getLegalPermanentResidenceStatusWithOutShow,
	onChange
} from '../../redux/actions/profile/legalPermanentResidenceStatusActions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#043C6E'
	},
	overflowVisible: {
		overflow: 'visible'
	},
	break: {
		marginBottom: '20px'
	}
});

class LegalPermanentResidenceStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false
		};
		this.handleSave = this.handleSave.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.multiSelect = this.multiSelect.bind(this);
		this.yesNoOnChange = this.yesNoOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getLegalPermanentResidenceStatus(this.props.profileID);
	}
	componentDidUpdate(prevProps) {
		const strLegalPermanentResidence = JSON.stringify(this.props.legalPermanentResidenceStatus);
		const strPrevLegalPermanentResidence = JSON.stringify(prevProps.legalPermanentResidenceStatus);
		if (strLegalPermanentResidence !== strPrevLegalPermanentResidence) {
			this.isValid();
		}
	}

	isValid() {
		let { errors, isValid } = validateLegalPermanentResidence(this.props.legalPermanentResidenceStatus);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	yesNoOnChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChange(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				// this.getP11();
				if (yesNoValue == 0) {
					this.props.onChange('legal_permanent_residence_status', 0);
					this.props.onChange('legal_permanent_residence_status_counts', 0);
					this.props.onChange('legal_permanent_residence_status_countries', []);
				}
				this.isValid();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	handleSave() {
		let { errors, isValid } = this.props;
		let { legal_permanent_residence_status } = this.props.legalPermanentResidenceStatus;

		if (
			errors &&
			isValid &&
			(legal_permanent_residence_status.toString() === '1' || legal_permanent_residence_status === 1)
		) {
			let legalPermanentResident = this.props.legalPermanentResidenceStatus;
			legalPermanentResident['_method'] = 'PUT';
			this.props
				.postAPI('/api/update-profile-legal-permanent-residence-status/', legalPermanentResident)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Legal Permanent Resident Status Save'
					});
					this.setState({ edit: false }, () =>
						this.props.getLegalPermanentResidenceStatusWithOutShow(this.props.profileID)
					);
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
					});
				});
		} else if (legal_permanent_residence_status.toString() === '0' || legal_permanent_residence_status === 0) {
			this.handleClose();
		} else {
			let firstObj = errors.legal_permanent_residence_status_countries;
			this.props.addFlashMessage({
				type: 'error',
				text: firstObj
			});
		}
	}
	handleEdit() {
		this.setState({ edit: true });
	}

	handleClose() {
		let {
			legal_permanent_residence_status_countries,
			legal_permanent_residence_status
		} = this.props.legalPermanentResidenceStatus;
		let dataPassingYesNoOnChange = {
			target: {
				name: 'legal_permanent_residence_status',
				value: 0
			}
		};
		if (
			(legal_permanent_residence_status.toString() === '1' || legal_permanent_residence_status === 1) &&
			isEmpty(legal_permanent_residence_status_countries)
		) {
			this.yesNoOnChange(dataPassingYesNoOnChange);
		}
		this.setState({ edit: false }, () =>
			this.props.getLegalPermanentResidenceStatusWithOutShow(this.props.profileID)
		);
	}

	multiSelect(values, e) {
		this.props.onChange(e.name, values);
	}
	render() {
		let { classes, p11Countries, editable, errors } = this.props;
		let {
			legal_permanent_residence_status_countries,
			legal_permanent_residence_status,
			show
		} = this.props.legalPermanentResidenceStatus;
		let { edit } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classname(classes.overflowVisible, classes.break)}>
						<CardContent className={classes.overflowVisible}>
							<Grid container className={classes.overflowVisible}>
								<Grid item xs={10} sm={8} md={9} lg={10} xl={10}>
									<Typography variant="h6" color="primary">
										Legal permanent residence status in any country other than that of your
										nationality
									</Typography>
								</Grid>
								{editable ? (
									<Grid item lg={2} xs={2} sm={4} md={3} xl={2}>
										{edit ? (
											<div>
												<IconButton
													onClick={this.handleSave}
													className={classes.button}
													aria-label="Delete"
												>
													<Save fontSize="small" className={classes.iconAdd} />
												</IconButton>
												<IconButton
													onClick={this.handleClose}
													className={classes.button}
													aria-label="Delete"
												>
													<Close fontSize="small" className={classes.iconAdd} />
												</IconButton>
											</div>
										) : (
											<IconButton
												onClick={this.handleEdit}
												className={classes.button}
												aria-label="Delete"
											>
												<Edit fontSize="small" className={classes.iconAdd} />
											</IconButton>
										)}
									</Grid>
								) : null}

								<Grid item xs={12}>
									{edit ? (
										<YesNoField
											ariaLabel="Legal Permanent Residence Status"
											label="Have you taken up legal permanent residence status in any country other than that of your nationality? If answer is “yes”, which country?"
											value={legal_permanent_residence_status.toString()}
											onChange={this.yesNoOnChange}
											name="legal_permanent_residence_status"
											error={errors.legal_permanent_residence_status}
											margin="dense"
										/>
									) : (
										legal_permanent_residence_status_countries.map((residence) => {
											return (
												<Chip
													key={residence.value}
													label={residence.label}
													color="primary"
													className={classname(
														classes.capitalize,
														classes.addSmallMarginRight
													)}
												/>
											);
										})
									)}
									{(legal_permanent_residence_status.toString() === '1' ||
										legal_permanent_residence_status === 1) &&
									edit ? (
										<SelectField
											label="Legal Permanent Residence Status Country List "
											options={p11Countries}
											value={legal_permanent_residence_status_countries}
											onChange={this.multiSelect}
											placeholder="Select countries"
											isMulti={true}
											name="legal_permanent_residence_status_countries"
											error={errors.legal_permanent_residence_status_countries}
										/>
									) : null}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

LegalPermanentResidenceStatus.propTypes = {
	postAPI: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getLegalPermanentResidenceStatus: PropTypes.func.isRequired,
	getLegalPermanentResidenceStatusWithOutShow: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired
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
	getLegalPermanentResidenceStatus,
	getLegalPermanentResidenceStatusWithOutShow,
	onChange,
	checkError
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	p11Countries: state.options.p11Countries,
	legalPermanentResidenceStatus: state.legalPermanentResidenceStatus,
	errors: state.web.errors,
	isValid: state.web.isValid
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LegalPermanentResidenceStatus));
