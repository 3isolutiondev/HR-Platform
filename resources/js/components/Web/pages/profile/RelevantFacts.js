import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import isEmpty from '../../validations/common/isEmpty';
import { getRelevanFact, onChange, getRelevanFactWithOutShow } from '../../redux/actions/profile/relevanFactActions';
import { checkError } from '../../redux/actions/webActions';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { addFlashMessage } from '../../redux/actions/webActions';
import { postAPI } from '../../redux/actions/apiActions';
import { validateRelevanFacts } from '../../validations/profile';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconAdd': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#be2126'
	},
	break: {
		marginBottom: '20px'
	}
});

class RelevantFacts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false
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
			this.props
				.postAPI('/api/update-profile-relevant-facts/', relevantFactData)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Relevant Facts Save'
					});
					this.setState({ edit: false }, () => this.props.getRelevanFactWithOutShow(this.props.profileID));
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'Error'
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
		const { edit } = this.state;
		const { relevant_facts, show } = this.props.relevanFact;
		const { classes, editable, errors } = this.props;
		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={10} sm={8} md={9} lg={10} xl={10}>
									<Typography variant="h6" color="primary">
										State any other relevant facts, including information regarding any residence
										outside the country of your nationality
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
									<br />
									{edit ? (
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
											rows={7}
										/>
									) : (
										<Typography variant="body2">{relevant_facts}</Typography>
									)}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

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
	addFlashMessage
};

RelevantFacts.propTypes = {
	getRelevanFact: PropTypes.func.isRequired,
	getRelevanFactWithOutShow: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	checkError: PropTypes.func.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RelevantFacts));
