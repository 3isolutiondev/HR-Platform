import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
// import FormControl from '@material-ui/core/FormControl';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import YesNoField from '../../common/formFields/YesNoField';
import isEmpty from '../../validations/common/isEmpty';
import { getDisabilities, onChange, getDisabilitiesWithOutShow } from '../../redux/actions/profile/disabilitiesAction';
import { addFlashMessage } from '../../redux/actions/webActions';
import { postAPI } from '../../redux/actions/apiActions';
import { YesNoURL } from '../../config/general';
import { validateDisabilities } from '../../validations/profile';
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
	noMarginTop: {
		marginTop: 0
	},
	break: {
		marginBottom: '20px'
	}
});

class Disabilities extends Component {
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
		this.props.getDisabilities(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		const strDisabilities = JSON.stringify(this.props.disabilities);
		const strPrevDisabilities = JSON.stringify(prevProps.disabilities);
		if (strDisabilities !== strPrevDisabilities) {
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
				// this.isValid();
				// this.getP11();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response ? err.response.status : 'success',
					text: err.response.message ? err.response.message : 'Update Success'
				});
			});
	}

	isValid() {
		let { errors, isValid } = validateDisabilities(this.props.disabilities);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	handleSave() {
		let { errors, isValid } = this.props;
		let { has_disabilities } = this.props.disabilities;
		if (isEmpty(errors) && isValid && (has_disabilities.toString() === '0' || has_disabilities === 0)) {
			let disabilitiesData = this.props.disabilities;
			disabilitiesData['_method'] = 'PUT';
			this.props
				.postAPI('/api/update-profile-disabilities/', disabilitiesData)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Disabilities Save'
					});
					this.setState({ edit: false }, () => this.props.getDisabilitiesWithOutShow(this.props.profileID));
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
					});
				});
		} else if (has_disabilities.toString() === '1' || has_disabilities === 1) {
			this.handleClose();
		} else {
			let firstObj = errors.disabilities;
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
		let { disabilities, has_disabilities } = this.props.disabilities;
		let dataPassingYesNoOnChange = {
			target: {
				name: 'has_disabilities',
				value: 1
			}
		};
		if ((has_disabilities.toString() === '0' || has_disabilities === 0) && isEmpty(disabilities)) {
			this.yesNoOnChange(dataPassingYesNoOnChange);
		}
		this.setState({ edit: false }, () => this.props.getDisabilitiesWithOutShow(this.props.profileID));
	}
	onChangeHandler(e) {
		this.props.onChange(e.target.name, e.target.value);
	}

	render() {
		const { classes, editable, errors } = this.props;
		const { disabilities, has_disabilities, show } = this.props.disabilities;
		const { edit } = this.state;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={10} sm={8} md={9} lg={10} xl={10}>
									<Typography variant="h6" color="primary">
										Disabilities
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
											ariaLabel="Has Disabilities"
											label="Entry into iMMAP service might require assignment and travel to any area of the world in which the iMMAP might have responsibilities. Would you be ready and willing to engage in air travel and to be deployed to the field in the scope of iMMAP activities? If not, please explain."
											value={has_disabilities.toString()}
											onChange={this.yesNoOnChange}
											name="has_disabilities"
											error={errors.has_disabilities}
										/>
									) : (
										<Typography variant="body2">{disabilities}</Typography>
									)}

									{(has_disabilities.toString() === '0' || has_disabilities === 0) && edit ? (
										<TextField
											fullWidth
											required
											multiline
											label="If not, please explain."
											id="disabilities"
											name="disabilities"
											margin="normal"
											value={disabilities}
											onChange={this.onChangeHandler}
											className={classes.noMarginTop}
											error={!isEmpty(errors.disabilities)}
											helperText={errors.disabilities}
											rows={3}
										/>
									) : null}

									{/* {edit ? (
								<FormControl fullWidth error={disabilities.length < 1 ? true : false}>
									<Input
										id="disabilities"
										name="disabilities"
										style={{ margin: 8 }}
										placeholder="disabilities"
										value={disabilities}
										onChange={this.onChangeHandler}
										aria-describedby="component-error-text"
									/>
									{disabilities.length < 1 ? (
										<FormHelperText id="component-error-text">
											Please describe your disabilities
										</FormHelperText>
									) : null}
								</FormControl>
							) : (
								<Typography variant="body2">{disabilities}</Typography>
							)} */}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

Disabilities.propTypes = {
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getDisabilitiesWithOutShow: PropTypes.func.isRequired,
	getDisabilities: PropTypes.func.isRequired,
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
	disabilities: state.disabilities,
	errors: state.web.errors,
	isValid: state.web.isValid
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getDisabilities,
	getDisabilitiesWithOutShow,
	onChange,
	addFlashMessage,
	postAPI,
	checkError
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Disabilities));
