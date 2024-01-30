import React, { Component } from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import Edit from '@material-ui/icons/Edit';
import ReactCountryFlag from 'react-country-flag';
import { lighterGrey } from '../../config/colors';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import { getEmploymentRecords } from '../../redux/actions/profile/employmentRecordActions';
import EmploymentRecordForm from '../p11/employmentRecords/EmploymentRecordForm';
import Alert from '../../common/Alert';
import { deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addBorderBottom: {
		'border-bottom': '1px solid ' + lighterGrey,
		'padding-bottom': '.25em'
	},
	addMarginBottom: {
		'margin-bottom': '.75em',
		'&:hover $iconEdit': {
			color: '#043C6E'
		}
	},
	addMarginRight: {
		'margin-right': '.75em'
	},
	addMarginTop: {
		'margin-top': '.75em'
	},
	addSmallMarginBottom: {
		'margin-bottom': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	avatar: {
		width: 200,
		height: 200,
		margin: '0 auto'
	},
	avatarContainer: {
		padding: '24px'
	},
	card: {
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
		'flex-grow': 1
	},
	icon: {
		display: 'inline-block',
		'vertical-align': 'text-bottom',
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50%'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#043C6E'
	},
	iconEdit: {
		color: 'transparent'
	},
	break: {
		marginBottom: '20px'
	},
	label: {
		maxWidth: 300,
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	}
});

class EmploymentRecords extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: ''
		};
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getEmploymentRecords(this.props.profileID);
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

	dialogClose() {
		//refresh skill
		this.props.refreshSkill();

		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getEmploymentRecords(this.props.profileID)
		);
	}
	checkBeforeRemove() {
		if (this.props.employmentRecords.employment_records_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}
	handleRemove() {
		this.props
			.deleteAPI('/api/p11-employment-records/' + this.state.dataId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ alertOpen: false, dataId: '' }, () => {
					this.dialogClose();
					// this.props.getEmploymentRecords(this.props.profileID);
					// this.child.clearState();
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}
	render() {
		const { classes, editable } = this.props;
		const { employment_records, show } = this.props.employmentRecords;
		const { openDialog, remove, dataId, name, alertOpen } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.break}>
						<CardContent>
							<Grid container>
								<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Employment History
									</Typography>
								</Grid>
								{editable ? (
									<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
										<IconButton
											onClick={this.dialogOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Add fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}

								<Grid item xs={12}>
									{employment_records ?
										employment_records.map((employmentRecord) => {
											const FlagContainer = (props) => (
												<div className={classes.countryAvatar}>{props.children}</div>
											);

											return (
												<Grid
													container
													spacing={8}
													key={employmentRecord.id}
													className={classname(classes.addMarginBottom, classes.addMarginTop)}
												>
													<Grid item xs={11} sm={8} md={9} lg={11} xl={11}>
														<Typography variant="h6">
															{employmentRecord.job_title}
														</Typography>
													</Grid>
													{editable && (
														<Grid item lg={1} xs={1} sm={4} md={3} xl={1}>
															<IconButton
																onClick={() =>
																	this.dialogOpenEdit(
																		employmentRecord.id,
																		employmentRecord.employer_name
																	)}
																className={classes.button}
																aria-label="Delete"
															>
																<Edit fontSize="small" className={classes.iconEdit} />
															</IconButton>
														</Grid>
													)}

													{/* <Grid container item xs={12}> */}
													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Business Type</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.business_type}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Job Description</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.job_description}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">From/To</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{moment(employmentRecord.from).format('DD MMMM YYYY') +
																' - ' +
																moment(employmentRecord.to).format('DD MMMM YYYY')}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Employer Name</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.employer_name}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Employer Address</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.employer_address}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Country</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Tooltip title={employmentRecord.country.name}>
															<Chip
																key={employmentRecord.country.id}
																avatar={
																	<FlagContainer>
																		<ReactCountryFlag
																			code={employmentRecord.country.country_code}
																			svg
																			styleProps={flag}
																		/>
																	</FlagContainer>
																}
																label={employmentRecord.country.name}
																// onDelete={handleDelete}
																color="primary"
																className={classname(
																	classes.addSmallMarginRight,
																	classes.capitalize,
																	classes.label
																)}
															/>
														</Tooltip>
													</Grid>

													{/* <Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Starting Salary</Typography>
													</Grid> */}
													{/* <Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.starting_salary}
														</Typography>
													</Grid> */}

													{/* <Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Final Salary</Typography>
													</Grid> */}
													{/* <Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.final_salary}
														</Typography>
													</Grid> */}

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Supervisor Name</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.supervisor_name}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">
															Number of Employees Supervised
														</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.number_of_employees_supervised}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">
															Kind of Employees Supervised
														</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.kind_of_employees_supervised}
														</Typography>
													</Grid>

													<Grid item xs={12} sm={3}>
														<Typography variant="subtitle2">Reason for Leaving</Typography>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="body2">
															{employmentRecord.reason_for_leaving}
														</Typography>
													</Grid>

													{employmentRecord.employment_skills && (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Skills</Typography>
														</Grid>
													)}
													{employmentRecord.employment_skills && (
														<Grid item xs={12} sm={9}>
															{employmentRecord.employment_skills.map((skill) => {
																return (
																	<Tooltip key={skill.id} title={skill.skill}>
																		<Chip
																			label={skill.skill}
																			color="primary"
																			className={classname(
																				classes.addSmallMarginRight,
																				classes.capitalize,
																				classes.label
																			)}
																		/>
																	</Tooltip>
																);
															})}
														</Grid>
													)}

													{employmentRecord.employment_sectors && (
														<Grid item xs={12} sm={3}>
															<Typography variant="subtitle2">Sectors</Typography>
														</Grid>
													)}
													{employmentRecord.employment_sectors && (
														<Grid item xs={12} sm={9}>
															{employmentRecord.employment_sectors.map((sector) => {
																return (
																	<Tooltip key={sector.id} title={sector.name}>
																		<Chip
																			label={sector.name}
																			color="primary"
																			className={classname(
																				classes.addSmallMarginRight,
																				classes.capitalize,
																				classes.label
																			)}
																		/>
																	</Tooltip>
																);
															})}
														</Grid>
													)}
												</Grid>
											);
										}) : null}
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				) : null}
				{editable ? (
					<div>
						<EmploymentRecordForm
							isOpen={openDialog}
							recordId={dataId}
							countries={this.props.countries}
							onClose={this.dialogClose}
							remove={remove}
							handleRemove={() => this.checkBeforeRemove()}
							title={remove ? 'Edit Employment Record' : 'Add Employment Record'}
							updateList={this.dialogClose}
							getP11={() => {}}
							onRef={(ref) => (this.child = ref)}
						/>
						<Alert
							isOpen={alertOpen}
							onClose={() => {
								this.setState({ alertOpen: false });
							}}
							onAgree={() => {
								this.handleRemove();
							}}
							title="Delete Warning"
							text={'Are you sure to delete your employment record with employer name : ' + name + ' ?'}
							closeText="Cancel"
							AgreeText="Yes"
						/>
					</div>
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
	employmentRecords: state.employmentRecords,
	countries: state.options.countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getEmploymentRecords,
	deleteAPI,
	addFlashMessage
};

EmploymentRecords.propTypes = {
	getEmploymentRecords: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EmploymentRecords));
