import React, { Component } from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

import isEmpty from '../../../validations/common/isEmpty';
import YesNoField from '../../../common/formFields/YesNoField';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { postAPI } from '../../../redux/actions/apiActions';
import { getLegalStep, getLegalStepWithOutShow, onChange } from '../../../redux/actions/profile/legalStepActions';
import { YesNoURL } from '../../../config/general';
import { validateLegalStep } from '../../../validations/profile';
import { checkError } from '../../../redux/actions/webActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { borderColor, primaryColor, white, lightText, green } from '../../../config/colors';

class LegalStepChangingNationality extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			loading: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.yesNoOnChange = this.yesNoOnChange.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	componentDidMount() {
		this.props.getLegalStep(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getLegalStep(this.props.profileID);
		}

		const strLegalStep = JSON.stringify(this.props.legalStep);
		const strPrevLegalStep = JSON.stringify(prevProps.legalStep);
		if (strLegalStep !== strPrevLegalStep) {
			this.isValid();
		}
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
					this.props.onChange('legal_step_changing_present_nationality_explanation', '');
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	isValid() {
		let { errors, isValid } = validateLegalStep(this.props.legalStep);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	handleSave() {
		let { errors, isValid } = this.props;
		let { legal_step_changing_present_nationality } = this.props.legalStep;
		if (
			isEmpty(errors) &&
			isValid &&
			(legal_step_changing_present_nationality.toString() === '1' ||
				legal_step_changing_present_nationality === 1)
		) {
			let legalStepData = this.props.legalStep;
			legalStepData['_method'] = 'PUT';
			this.setState({ loading: true }, () => {
				this.props
					.postAPI('/api/update-profile-legal-step-changing-nationality/', legalStepData)
					.then((res) => {
						this.setState({ loading: false }, () => {
							this.props.addFlashMessage({
								type: 'success',
								text: 'Explanation Saved'
							});
							this.props.profileLastUpdate();
							this.setState({ edit: false }, () =>
								this.props.getLegalStepWithOutShow(this.props.profileID)
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
		} else if (
			legal_step_changing_present_nationality.toString() === '0' ||
			legal_step_changing_present_nationality === 0
		) {
			this.handleClose();
		} else {
			let firstObj = errors.legal_step_changing_present_nationality_explanation;
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
			legal_step_changing_present_nationality,
			legal_step_changing_present_nationality_explanation
		} = this.props.legalStep;
		let dataPassingYesNoOnChange = {
			target: {
				name: 'legal_step_changing_present_nationality',
				value: 0
			}
		};
		if (
			(legal_step_changing_present_nationality.toString() === '1' ||
				legal_step_changing_present_nationality === 1) &&
			isEmpty(legal_step_changing_present_nationality_explanation)
		) {
			this.yesNoOnChange(dataPassingYesNoOnChange);
		}
		this.setState({ edit: false }, () => this.props.getLegalStepWithOutShow(this.props.profileID));
	}

	onChangeHandler(e) {
		this.props.onChange(e.target.name, e.target.value);
	}

	render() {
		const { classes, editable, errors } = this.props;
		const {
			legal_step_changing_present_nationality_explanation,
			legal_step_changing_present_nationality,
			show
		} = this.props.legalStep;
		const { edit, loading } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.addMarginBottom}>
						<CardContent>
							<Typography
								variant="subtitle1"
								color="primary"
								className={
									legal_step_changing_present_nationality == 1 || edit ? (
										classes.titleSection
									) : (
										classname(classes.titleSection, classes.noStatus)
									)
								}
							>
								Have you taken any legal steps towards changing your present nationality?
								{!edit ?
									(legal_step_changing_present_nationality == 1 ? (
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
								)): null}
								{editable ?
									(!edit ? (
										<Edit
											fontSize="small"
											className={classname(classes.editIcon, classes.addMarginLeft)}
											onClick={this.handleEdit}
										/>
								) : null ) : null}
							</Typography>
							{legal_step_changing_present_nationality == 1 ? <div className={classes.divider} /> : null}
							{edit ? (
								<div className={classes.addMarginTop}>
									<YesNoField
										ariaLabel="Legal Permanent Residence Status"
										label="Have you taken any legal steps towards changing your present nationality? If answer is “yes”, explain fully:"
										value={legal_step_changing_present_nationality.toString()}
										onChange={this.yesNoOnChange}
										name="legal_step_changing_present_nationality"
										error={errors.legal_step_changing_present_nationality}
										margin="dense"
										className={classes.addMarginTop}
									/>
								</div>
							) : (
								legal_step_changing_present_nationality == 1 ? (
									<div className={classes.addMarginTop}>
										<Typography variant="body2" className={classes.bold}>
											Reason / Explanation :
										</Typography>
										<Typography variant="body2" className={classes.lightText}>
											{legal_step_changing_present_nationality_explanation}
										</Typography>
									</div>
								) : null
							)}
							{(legal_step_changing_present_nationality.toString() === '1' ||
								legal_step_changing_present_nationality === 1) &&
							edit ? (
								<TextField
									required
									id="legal_step_changing_present_nationality_explanation"
									name="legal_step_changing_present_nationality_explanation"
									label="Explain"
									fullWidth
									autoComplete="explain"
									value={legal_step_changing_present_nationality_explanation}
									onChange={this.onChangeHandler}
									error={!isEmpty(errors.legal_step_changing_present_nationality_explanation)}
									helperText={errors.legal_step_changing_present_nationality_explanation}
									multiline
									rows={2}
								/>
							) : null}
							{edit ? (
								<div className={classname(classes.alignRight, classes.addMarginTop)}>
									<Button
										variant="contained"
										color="secondary"
										size="small"
										className={classes.addMarginLeft}
										onClick={this.handleClose}
									>
										<Close fontSize="small" className={classes.editIcon} aria-label="Close" />
										Close
									</Button>
									<Button
										variant="contained"
										color="primary"
										size="small"
										className={classes.addMarginLeft}
										onClick={this.handleSave}
									>
										<Save fontSize="small" className={classes.editIcon} aria-label="Save" />
										Save{' '}
										{loading ? (
											<CircularProgress thickness={5} size={22} className={classes.loading} />
										) : null}
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

LegalStepChangingNationality.propTypes = {
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getLegalStep: PropTypes.func.isRequired,
	getLegalStepWithOutShow: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	legalStep: state.legalStep,
	errors: state.web.errors,
	isValid: state.web.isValid
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getLegalStep,
	getLegalStepWithOutShow,
	onChange,
	postAPI,
	addFlashMessage,
	checkError,
	profileLastUpdate
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700,
		lineHeight: 1.5
	},
	noStatus: {
		borderBottom: 'none',
		paddingBottom: 0
	},
	yes: {
		color: green
	},
	no: {
		color: primaryColor
	},
	addMarginLeft: {
		marginLeft: theme.spacing.unit
	},
	divider: {
		height: theme.spacing.unit * 2
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
	addMarginTop: {
		marginTop: theme.spacing.unit
	},
	addMarginBottom: {
		marginBottom: theme.spacing.unit * 2
	},
	bold: {
		fontWeight: 700
	},
	alignRight: {
		textAlign: 'right'
	},
	lightText: {
		color: lightText
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LegalStepChangingNationality));
