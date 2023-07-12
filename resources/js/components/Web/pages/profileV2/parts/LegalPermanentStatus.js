import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

import ReactCountryFlag from 'react-country-flag';
import { YesNoURL } from '../../../config/general';
import SelectField from '../../../common/formFields/SelectField';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import isEmpty from '../../../validations/common/isEmpty';
import YesNoField from '../../../common/formFields/YesNoField';
import { checkError } from '../../../redux/actions/webActions';
import { validateLegalPermanentResidence } from '../../../validations/profile';
import {
	getLegalPermanentResidenceStatus,
	getLegalPermanentResidenceStatusWithOutShow,
	onChange
} from '../../../redux/actions/profile/legalPermanentResidenceStatusActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { lightText, primaryColor, borderColor, white, green } from '../../../config/colors';

class LegalPermanentStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			loading: false
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
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getLegalPermanentResidenceStatus(this.props.profileID);
		}

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
				this.props.profileLastUpdate();
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

			this.setState({ loading: true }, () => {
				this.props
					.postAPI('/api/update-profile-legal-permanent-residence-status/', legalPermanentResident)
					.then((res) => {
						this.setState({ loading: false }, () => {
							this.props.addFlashMessage({
								type: 'success',
								text: 'Legal Permanent Resident Status Save'
							});
							this.props.profileLastUpdate();
							this.setState({ edit: false }, () =>
								this.props.getLegalPermanentResidenceStatusWithOutShow(this.props.profileID)
							);
						});
					})
					.catch((err) => {
						this.setState({ loading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'Error'
							});
						});
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
		const { classes, p11Countries, editable, errors } = this.props;
		const {
			legal_permanent_residence_status_countries,
			legal_permanent_residence_status,
			show
		} = this.props.legalPermanentResidenceStatus;
		const { edit, loading } = this.state;

		const FlagContainer = (props) => <div className={classes.countryAvatar}>{props.children}</div>;
		const flag = { width: '32px', height: '32px', backgroundSize: '44px 44px' };

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography
								variant="subtitle1"
								color="primary"
								className={
									legal_permanent_residence_status == 1 || edit ? (
										classes.titleSection
									) : (
										classname(classes.titleSection, classes.noStatus)
									)
								}
							>
								Have you taken up legal permanent residence status in any country other than that of
								your nationality?
								{!edit ?
									(legal_permanent_residence_status == 1 ? (
										<FontAwesomeIcon
											icon={faCheckCircle}
											size="lg"
											className={classname(classes.addMarginLeft, classes.yes)}
										/>
									) : (
										<FontAwesomeIcon
											icon={faTimesCircle}
											size="lg"
											className={classname(classes.addMarginLeft, classes.no)}
										/>
								)) : null}
								{editable ?
									(!edit ? (
										<Edit
											fontSize="small"
											className={classname(classes.editIcon, classes.addMarginLeft)}
											onClick={this.handleEdit}
										/>
								) : null
								): null}
							</Typography>
							{(legal_permanent_residence_status == 1 || edit) ? <div className={classes.divider} /> : null}
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
											avatar={
												<FlagContainer>
													<ReactCountryFlag
														code={residence.country_code}
														svg
														styleProps={flag}
													/>
												</FlagContainer>
											}
											key={residence.value}
											label={residence.label}
											color="secondary"
											// className={classname(classes.capitalize, classes.addSmallMarginRight)}
											className={classname(
												classes.chip,
												classes.addMarginRight,
												classes.capitalize,
												classes.label
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
									extraMargin={true}
                  fullWidth
								/>
							) : null}
							{edit ? (
								<div className={classes.edit}>
									<Button
										variant="contained"
										color="secondary"
										size="small"
										className={classes.editButton}
										onClick={this.handleClose}
									>
										<Close fontSize="small" className={classes.editIcon} aria-label="Close" />
										Close
									</Button>
									<Button
										variant="contained"
										color="primary"
										size="small"
										className={classes.editButton}
										onClick={this.handleSave}
									>
										<Save fontSize="small" className={classes.editIcon} aria-label="Save" />
										Save{' '}
										{loading ? (
											<CircularProgress thickness={5} size={22} className={classes.loading} />
										): null}
									</Button>
								</div>
							) : null}
						</CardContent>
					</Card>
				) : null}
			</div>
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
	getLegalPermanentResidenceStatus,
	getLegalPermanentResidenceStatusWithOutShow,
	onChange,
	checkError,
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
	legalPermanentResidenceStatus: state.legalPermanentResidenceStatus,
	errors: state.web.errors,
	isValid: state.web.isValid
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		marginBottom: theme.spacing.unit * 2,
		overflow: 'visible'
	},
	card: {
		position: 'relative'
	},
	duration: {
		color: lightText,
		fontStyle: 'italic',
		marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
		// text
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700,
		lineHeight: 1.5
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	edit: {
		textAlign: 'right'
		// display: 'inline-block',
		// verticalAlign: 'text-top',
		// marginRight: theme.spacing.unit
	},
	editIcon: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2,
		cursor: 'pointer',
		'&:hover': {
			borderBottom: '1px solid ' + primaryColor
		}
	},
	editButton: {
		marginLeft: theme.spacing.unit
	},
	chip: {
		background: '#e6e7e8',
		color: '#4c4c4c',
		marginRight: theme.spacing.unit / 2
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	addMarginLeft: {
		marginLeft: theme.spacing.unit
	},

	yes: {
		color: green
	},
	no: {
		color: primaryColor
	},
	noStatus: {
		borderBottom: 'none',
		paddingBottom: 0
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
	// button: {
	// 	position: 'absolute',
	// 	right: 0,
	// 	'&:hover': {
	// 		backgroundColor: primaryColor
	// 	},
	// 	'&:hover $iconAdd': {
	// 		color: white
	// 	},
	// 	top: -5
	// },
	// iconAdd: {
	// 	color: primaryColor
	// },
	// editIcon: {
	// 	position: 'absolute',
	// 	right: theme.spacing.unit / 2,
	// 	top: theme.spacing.unit,
	// 	zIndex: 999
	// }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LegalPermanentStatus));
