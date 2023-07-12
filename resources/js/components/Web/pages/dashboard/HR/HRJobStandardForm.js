/** import React, PropTypes and React Helmet */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';

/** import configuration value, validation helper and utility helper */
import isEmpty from '../../../validations/common/isEmpty';
import { validate } from '../../../validations/HR/HRJobStandard';
import { pluck } from '../../../utils/helper';
import { APP_NAME } from '../../../config/general';
import { white } from '../../../config/colors';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

/**
 * HRJobStandardsForm is a component to show Job Standard Form Page
 *
 * @name HRJobStandardsForm
 * @component
 * @category Page
 *
 */
class HRJobStandardsForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			allHRJobCategories: [],
			hrJobCategories: [],
      under_sbp_program: "no",
			errors: {},
			isEdit: false,
			apiURL: '/api/hr-job-standards',
			redirectURL: '/dashboard/hr-job-standards',
			showLoading: false,
      sbp_recruitment_campaign: "no"
		};

		this.isValid = this.isValid.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkChange = this.checkChange.bind(this);
		this.checkAll = this.checkAll.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    this.rosterCheckChange = this.rosterCheckChange.bind(this);
	}

  /**
   * componentWillMount is a lifecycle function called where the component will be mounted
   */
	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiURL: '/api/hr-job-standards/' + this.props.match.params.id,
				redirectURL: '/dashboard/hr-job-standards/' + this.props.match.params.id + '/edit'
			});
		}
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.props
			.getAPI('/api/hr-job-categories-approved')
			.then((res) => {
				this.setState({ allHRJobCategories: res.data.data });
			})
			.catch((err) => {});

		if (this.state.isEdit) {
			this.props
				.getAPI(this.state.apiURL)
				.then((res) => {
					const { name, job_categories, under_sbp_program, sbp_recruitment_campaign } = res.data.data;

					this.setState({
            name, under_sbp_program, sbp_recruitment_campaign,
            hrJobCategories: pluck(job_categories, 'id')
          });
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while requesting user data'
					});
				});
		}
	}

  /**
   * isValid is a function to validate the form
   * @returns {boolean}
   */
	isValid() {
		const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

  /**
   * onChange is a function to handle the change of data on the form
   * @param {Event} e
   */
	onChange(e) {
		if (!!this.state.errors[e.target.name]) {
			const errors = Object.assign({}, this.state.errors);
			delete errors[e.target.name];
			this.setState({ [e.target.name]: e.target.value, errors }, () => {
				this.isValid();
			});
		} else {
			this.setState({ [e.target.name]: e.target.value }, () => {
				this.isValid();
			});
		}
	}

  /**
   * checkChange is a function to handle job category data in the form
   * @param {Event} e
   */
	checkChange(e) {
		let { hrJobCategories } = this.state;

		if (e.target.checked) {
			hrJobCategories.push(parseInt(e.target.value));
		} else {
			let index = hrJobCategories.indexOf(parseInt(e.target.value));
			if (index > -1) {
				hrJobCategories.splice(index, 1);
			}
		}
		this.setState({ hrJobCategories }, () => {
			this.isValid();
		});
	}

  /**
   * checkAll is a function to check all job category data in the form
   * @param {Event} e
   */
	checkAll(e) {
		if (e.target.checked) {
			this.setState({ hrJobCategories: pluck(this.state.allHRJobCategories, 'id') }, () => {
				this.isValid();
			});
		} else {
			this.setState({ hrJobCategories: [] }, () => {
				this.isValid();
			});
		}
	}

  /**
   * onSubmit is a function to handle submitting data to the backend
   * @param {Event} e
   */
	onSubmit(e) {
		e.preventDefault();

		let jobStandardData = {
			name: this.state.name,
			job_categories: this.state.hrJobCategories,
      under_sbp_program: this.state.under_sbp_program,
      sbp_recruitment_campaign: this.state.sbp_recruitment_campaign
		};

		if (this.state.isEdit) {
			jobStandardData._method = 'PUT';
		}

		if (this.isValid()) {
			this.setState({ showLoading: true }, () => {
				this.props
					.postAPI(this.state.apiURL, jobStandardData)
					.then((res) => {
						this.setState({ showLoading: false }, () => {
							const { status, message } = res.data;
							this.props.addFlashMessage({
								type: status,
								text: message
							});
							this.props.history.push(this.state.redirectURL);
						});
					})
					.catch((err) => {
						this.setState({ showLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'There is an error while processing the request'
							});
						});
					});
			});
		}
	}

  /**
   * rosterCheckChange is a function to change the surge roster related checkbox
   * @param {Event} e
   */
  rosterCheckChange(e) {
    if (e.target.checked) {
      const otherRosterCheck = (e.target.name === "under_sbp_program") ? "sbp_recruitment_campaign" : "under_sbp_program";
      return this.setState({ [e.target.name]: "yes", [otherRosterCheck]: "no" }, () => this.isValid());
    }

    return this.setState({ [e.target.name]: "no" }, () => this.isValid());
  }

	render() {
		let {
      name, allHRJobCategories, hrJobCategories, errors, isEdit,
      showLoading, under_sbp_program, sbp_recruitment_campaign
    } = this.state;

		const { classes } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Job Standard : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Job Standard'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Job Standard : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Job Standard'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Job Standard : ' + name}
								{!isEdit && 'Add Job Standard'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="name"
								value={name}
								onChange={this.onChange}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <FormControl error={!isEmpty(errors.under_sbp_program)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={under_sbp_program === "yes" ? true : false}
                          name="under_sbp_program"
                          color="primary"
                          onChange={this.rosterCheckChange}
                        />
                      }
                      label="Set Job Standard Under Surge Roster Program Alert"
                    />
                    {!isEmpty(errors.under_sbp_program) && (
                      <FormHelperText>{errors.under_sbp_program}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl error={!isEmpty(errors.sbp_recruitment_campaign)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={sbp_recruitment_campaign === "yes" ? true : false}
                          name="sbp_recruitment_campaign"
                          color="primary"
                          onChange={this.rosterCheckChange}
                        />
                      }
                      label="Set Job Standard as Surge Roster Recruitment Campaign"
                    />
                    {!isEmpty(errors.sbp_recruitment_campaign) && (
                      <FormHelperText>{errors.sbp_recruitment_campaign}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
						<Grid item xs={12}>
							<FormControl error={!isEmpty(errors.hrJobCategories)}>
								<FormLabel component="legend">Job Category</FormLabel>
								<FormGroup>
									<Grid container>
										<Grid item xs={12}>
											<FormControlLabel
												control={
													<Checkbox
														name="allHRJobCategories"
														color="primary"
														onChange={this.checkAll}
													/>
												}
												label="All Job Category"
											/>
										</Grid>
										{allHRJobCategories.map((jobCategory, index) => {
											return (
												<Grid item xs={12} sm={6} lg={3} key={index}>
													<FormControlLabel
														control={
															<Checkbox
																checked={hrJobCategories.includes(jobCategory.id)}
																name="hrJobCategories"
																color="primary"
																onChange={this.checkChange}
																value={jobCategory.id.toString()}
															/>
														}
														label={jobCategory.name}
													/>
												</Grid>
											);
										})}
									</Grid>
								</FormGroup>
								{!isEmpty(errors.hrJobCategories) && (
									<FormHelperText>{errors.hrJobCategories}</FormHelperText>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
                disabled={!isEmpty(errors)}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

HRJobStandardsForm.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
	postAPI: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
	classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a function to show a pop up message
   */
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(HRJobStandardsForm));
