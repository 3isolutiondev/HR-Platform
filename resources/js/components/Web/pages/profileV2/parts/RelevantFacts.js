import React, { Component } from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import isEmpty from '../../../validations/common/isEmpty';
import { getRelevanFact, onChange, getRelevanFactWithOutShow } from '../../../redux/actions/profile/relevanFactActions';
import { checkError } from '../../../redux/actions/webActions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { postAPI } from '../../../redux/actions/apiActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { validateRelevanFacts } from '../../../validations/profile';
import { primaryColor, borderColor, green, lightText, white } from '../../../config/colors';

class RelevantFacts extends Component {
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
		this.isValid = this.isValid.bind(this);
	}

	componentDidMount() {
		this.props.getRelevanFact(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getRelevanFact(this.props.profileID);
		}

		const strRelevanFact = JSON.stringify(this.props.relevanFact);
		const strPrevRelevanFact = JSON.stringify(prevProps.relevanFact);
		if (strRelevanFact !== strPrevRelevanFact) {
			this.isValid();
		}
	}

	isValid() {
		let { errors, isValid } = validateRelevanFacts(this.props.relevanFact);
		this.props.checkError(errors, isValid);
		return isValid;
	}

	handleSave() {
		let { errors, isValid } = this.props;
		if (isEmpty(errors) && isValid) {
			let relevantFactData = this.props.relevanFact;
			relevantFactData['_method'] = 'PUT';
			this.setState({ loading: true }, () => {
				this.props
					.postAPI('/api/update-profile-relevant-facts/', relevantFactData)
					.then((res) => {
						this.setState({ loading: false }, () => {
							this.props.addFlashMessage({
								type: 'success',
								text: 'Relevant Facts Save'
							});
							this.props.profileLastUpdate();
							this.setState({ edit: false }, () =>
								this.props.getRelevanFactWithOutShow(this.props.profileID)
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
		} else {
			let errorObj = Object.keys(errors)[0];
			this.props.addFlashMessage({
				type: 'error',
				text: errors[errorObj]
			});
		}
	}

	handleEdit() {
		this.setState({ edit: true }, () => this.props.getRelevanFactWithOutShow(this.props.profileID));
	}

	handleClose() {
		this.setState({ edit: false }, () => this.props.getRelevanFactWithOutShow(this.props.profileID));
	}

	onChangeHandler(e) {
		this.props.onChange(e.target.name, e.target.value);
	}

	render() {
		const { edit, loading } = this.state;
		const { relevant_facts, show } = this.props.relevanFact;
		const { classes, editable, errors } = this.props;

		return (
			<div>
				{show ? (
					<Card>
						<CardContent>
							<Typography
								variant="subtitle1"
								color="primary"
								className={
									!isEmpty(relevant_facts) ? (
										classes.titleSection
									) : (
										classname(classes.titleSection, classes.noStatus)
									)
								}
							>
								State Any Other Relevant Facts, Including Information Regarding Any Residence Outside
								The Country of Your Nationality?
								{editable ?
									(!edit ? (
										<Edit
											fontSize="small"
											className={classname(classes.editIcon, classes.addMarginLeft)}
											onClick={this.handleEdit}
										/>
								): null ): null }
							</Typography>
							{(!isEmpty(relevant_facts) || !edit) ? <div className={classes.divider} /> : null}
							{edit ? (
								// <div className={classes.addMarginTop}>
								<TextField
									id="relevant_facts"
									name="relevant_facts"
									label="State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality"
									fullWidth
									value={relevant_facts}
									autoComplete="relevant_facts"
									onChange={this.onChangeHandler}
									error={!isEmpty(errors.relevant_facts)}
									helperText={errors.relevant_facts}
									multiline
									inputProps={{
										className: classes.labelMargin
									}}
									rows={7}
								/>
							) : (
								// </div>
								<Typography
									variant="body2"
									className={classname(classes.lightText, classes.addMarginTop)}
								>
									{relevant_facts}
								</Typography>
							)}
							{edit ? (
								<div className={classname(classes.alignRight, classes.addMarginTop)}>
									<Button
										variant="contained"
										color="secondary"
										size="small"
										className={classes.addMarginLeft}
										onClick={this.handleClose}
									>
										<Close fontSize="small" className={classes.btnIcon} aria-label="Close" />
										Close
									</Button>
									<Button
										variant="contained"
										color="primary"
										size="small"
										className={classes.addMarginLeft}
										onClick={this.handleSave}
									>
										<Save fontSize="small" className={classes.btnIcon} aria-label="Save" />
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

RelevantFacts.propTypes = {
	getRelevanFact: PropTypes.func.isRequired,
	getRelevanFactWithOutShow: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired,
	profileLastUpdate: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRelevanFact,
	getRelevanFactWithOutShow,
	checkError,
	onChange,
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
	relevanFact: state.relevanFact,
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
	editIcon: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2,
		cursor: 'pointer',
		'&:hover': {
			borderBottom: '1px solid ' + primaryColor
		}
	},
	btnIcon: {
		display: 'inline-block',
		verticalAlign: 'text-top',
		marginRight: theme.spacing.unit / 2
	},
	addMarginTop: {
		marginTop: theme.spacing.unit
	},
	addMarginBottom: {
		marginBottom: theme.spacing.unit * 2
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	lightText: {
		color: lightText
	},
	alignRight: {
		textAlign: 'right'
	},
	labelMargin: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RelevantFacts));
