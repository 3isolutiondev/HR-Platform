import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from '../../validations/common/isEmpty';
import YesNoField from '../../common/formFields/YesNoField';
import TextField from '@material-ui/core/TextField';
import { addFlashMessage } from '../../redux/actions/webActions';
import { postAPI } from '../../redux/actions/apiActions';
import { getLegalStep, getLegalStepWithOutShow, onChange } from '../../redux/actions/profile/legalStepActions';
import { YesNoURL } from '../../config/general';
import { validateLegalStep } from '../../validations/profile';
import { checkError } from '../../redux/actions/webActions';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
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
	break: {
		marginBottom: '20px'
	}
});

class LegalStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false
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
			this.props
				.postAPI('/api/update-profile-legal-step-changing-nationality/', legalStepData)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Explain Save'
					});
					this.setState({ edit: false }, () => this.props.getLegalStepWithOutShow(this.props.profileID));
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
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
		const { edit } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={10} sm={8} md={9} lg={10} xl={10}>
									<Typography variant="h6" color="primary">
										Legal steps towards changing your present nationality
									</Typography>
								</Grid>
								{editable && (
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
								)}
								<Grid item xs={12}>
									<br />

									{edit ? (
										<YesNoField
											ariaLabel="Legal Permanent Residence Status"
											label="Have you taken any legal steps towards changing your present nationality? If answer is “yes”, explain fully:"
											value={legal_step_changing_present_nationality.toString()}
											onChange={this.yesNoOnChange}
											name="legal_step_changing_present_nationality"
											error={errors.legal_step_changing_present_nationality}
											margin="dense"
										/>
									) : (
										<Typography variant="body2">
											{legal_step_changing_present_nationality_explanation}
										</Typography>
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
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

LegalStep.propTypes = {
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
	checkError
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LegalStep));
