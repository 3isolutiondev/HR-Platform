/** import React, Prop Types and Classnames */
import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

/** import third party library */
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import Skeleton from 'react-loading-skeleton';

/** import Material UI styles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import AccessTime from '@material-ui/icons/AccessTime';

/** import configuration value and validation helper */
import {
	borderColor,
	lightText,
	primaryColor,
	primaryColorBlue,
	primaryColorGreen,
	primaryColorRed
} from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getEmploymentRecords } from '../../../redux/actions/profile/employmentRecordActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import { deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import other componentes needed in this component */
import EmploymentRecordForm from '../../p11/employmentRecords/EmploymentRecordForm';
import Alert from '../../../common/Alert';

/**
 * EmploymentRecords is a component to show Employment History data in profile page.
 *
 * @name EmploymentRecords
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class EmploymentRecords extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			detailOpen: false,
			detailID: '',
			openDialog: false,
			remove: false,
			dataId: '',
			alertOpen: false,
			name: ''
		};

		this.openDetails = this.openDetails.bind(this);
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogOpenEdit = this.dialogOpenEdit.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.checkBeforeRemove = this.checkBeforeRemove.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		this.props.getEmploymentRecords(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getEmploymentRecords(this.props.profileID);
		}
	}

  /**
   * openDetails is a function to show more information about employment history
   *
   * @param {(string|number)} [detailID] detailID
   */
	openDetails(detailID) {
		if (this.state.detailOpen && this.state.detailID == detailID) {
			this.setState({ detailOpen: false, detailID: '' });
		} else if (this.state.detailOpen && this.state.detailID !== detailID) {
			this.setState({ detailID });
		} else {
			this.setState({ detailOpen: true, detailID });
		}
	}

  /**
   * dialogOpen is a function to open Employment Record Form Modal in create mode
   */
  dialogOpen() {
    this.setState({ openDialog: true });
	}

  /**
   * dialogOpenEdit is a function to open Employment Record Form Modal in edit mode
   */
	dialogOpenEdit(id, name) {
		this.setState({ dataId: id, name: name, openDialog: true, remove: true });
	}

  /**
   * dialogClose is a function to close Employment Record Form Modal
   */
	dialogClose() {
		//refresh skill
		this.props.refreshSkill();

		this.setState({ openDialog: false, dataId: '', remove: false }, () =>
			this.props.getEmploymentRecords(this.props.profileID)
		);
	}

  /**
   * checkBeforeRemove is a function to show delete confirmation before deleting employment record data
   */
	checkBeforeRemove() {
		if (this.props.employmentRecords.employment_records_counts > 1) {
			this.setState({ alertOpen: true });
		}
	}

  /**
   * handleRemove is a function to delete employment record data
   */
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
					this.props.profileLastUpdate();
					this.child.clearState();
					this.dialogClose();
					// this.props.getEmploymentRecords(this.props.profileID);
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
		const { classes, editable, employmentRecords } = this.props;
		const { employment_records, employment_records_counts, show } = employmentRecords;
		const { detailID, detailOpen, openDialog, remove, dataId, alertOpen, name } = this.state;

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={classes.card}>
							<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
								Employment History
							</Typography>
							<div className={classes.divider} />
							{editable ? (
								<IconButton
									onClick={this.dialogOpen}
									className={classes.addButton}
									aria-label="Delete"
									color="primary"
								>
									<Add fontSize="small" />
								</IconButton>
							) : null}
							{isEmpty(employmentRecords) ? (
								<Skeleton count={3} />
							) : employment_records_counts == 0 || employment_records_counts < 1 ? (
								<Typography variant="body1">Sorry, no records </Typography>
							) : (
								employment_records.map((employmentRecord) => {
									let from = moment(employmentRecord.from);
									let to = moment(employmentRecord.to);

									if (employmentRecord.untilNow === 1) {
										to = moment();
									}

									let years = to.diff(from, 'years');
									from.add(years, 'years');

									let months = to.diff(from, 'months');

									const monthText =
										months < 1
											? ''
											: months < 2 ? ' ' + months + ' month' : ' ' + months + ' months';
									const yearText = years <= 1 ? years + ' year' : years + ' years';

									return (
										<div className={classes.record} key={'experience-' + employmentRecord.id}>
											{editable ? (
												<IconButton
													onClick={() =>
														this.dialogOpenEdit(
															employmentRecord.id,
															employmentRecord.employer_name
														)}
													className={classes.button}
													aria-label="Edit"
												>
													<Edit fontSize="small" className={classes.iconEdit} />
												</IconButton>
											) : null}

											<Typography variant="subtitle1" className={classes.jobTitle}>
												{employmentRecord.job_title + ' '}
												<Tooltip title={employmentRecord.country.name}>
													<div className={classes.countryAvatar}>
                            {!isEmpty(employmentRecord.country) ? !isEmpty(employmentRecord.country.country_code) && (
                              <ReactCountryFlag
                                code={employmentRecord.country.country_code}
                                svg
                                styleProps={flag}
                                className={classes.countryAvatar}
                              />
                            ) : null}
													</div>
												</Tooltip>
												{employmentRecord.untilNow === 1 ? (
													<Chip
														icon={<AccessTime className={classes.addMarginLeft} />}
														label="Present"
														color="primary"
														className={classes.stillInstitution}
													/>
												) : null}
											</Typography>
											<Typography variant="subtitle2" className={classes.employer}>
												{employmentRecord.employer_name}
											</Typography>
											<Typography variant="body2" className={classes.duration}>
												{moment(employmentRecord.from).format('MMMM YYYY') + ' - '}
												{employmentRecord.untilNow === 1 ? (
													'Present'
												) : (
													moment(employmentRecord.to).format('MMMM YYYY')
												)}
												{' (' + yearText + monthText + ')'}
											</Typography>
											<Typography
												variant="body2"
												className={classname(classes.lightText, classes.addMediumMarginBottom)}
                        style={{ whiteSpace: 'pre-line' }}
											>
												{employmentRecord.job_description}
											</Typography>
											{(detailOpen && detailID === employmentRecord.id) ? (
												<Grid container spacing={0}>
													<Grid item xs={12} sm={5} md={4} lg={3}>
														<Typography variant="body2" className={classes.lightText}>
															Business Type:
														</Typography>
													</Grid>
													<Grid item xs={12} sm={7} md={8} lg={9}>
														<Typography
															variant="body2"
															className={classname(classes.lightText, classes.italic)}
														>
															{employmentRecord.business_type}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={5} md={4} lg={3}>
														<Typography variant="body2" className={classes.lightText}>
															Employer Address:
														</Typography>
													</Grid>
													<Grid item xs={12} sm={7} md={8} lg={9}>
														<Typography
															variant="body2"
															className={classname(classes.lightText, classes.italic)}
														>
															{employmentRecord.employer_address}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={5} md={4} lg={3}>
														<Typography variant="body2" className={classes.lightText}>
															Supervisor Name:
														</Typography>
													</Grid>
													<Grid item xs={12} sm={7} md={8} lg={9}>
														<Typography
															variant="body2"
															className={classname(classes.lightText, classes.italic)}
														>
															{employmentRecord.supervisor_name}
														</Typography>
													</Grid>
													{!isEmpty(employmentRecord.number_of_employees_supervised) ? (
														<Grid item xs={12} sm={5} md={4} lg={3}>
															<Typography variant="body2" className={classes.lightText}>
																Number of Employees Supervised:
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.number_of_employees_supervised) ? (
														<Grid item xs={12} sm={7} md={8} lg={9}>
															<Typography
																variant="body2"
																className={classname(classes.lightText, classes.italic)}
															>
																{employmentRecord.number_of_employees_supervised}
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.kind_of_employees_supervised) ? (
														<Grid item xs={12} sm={5} md={4} lg={3}>
															<Typography variant="body2" className={classes.lightText}>
																Kind of Employees Supervised:
															</Typography>
														</Grid>
													) :null}
													{!isEmpty(employmentRecord.kind_of_employees_supervised) ? (
														<Grid item xs={12} sm={7} md={8} lg={9}>
															<Typography
																variant="body2"
																className={classname(classes.lightText, classes.italic)}
															>
																{employmentRecord.kind_of_employees_supervised}
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.reason_for_leaving) ? (
														<Grid item xs={12} sm={5} md={4} lg={3}>
															<Typography variant="body2" className={classes.lightText}>
																Reason for Leaving:
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.reason_for_leaving) ? (
														<Grid item xs={12} sm={7} md={8} lg={9}>
															<Typography
																variant="body2"
																className={classname(classes.lightText, classes.italic)}
															>
																{employmentRecord.reason_for_leaving}
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.employment_skills) ? (
														<Grid item xs={12}>
															<Typography variant="body2" className={classes.lightText}>
																Skills:
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.employment_skills) ? (
														<Grid item xs={12}>
															{employmentRecord.employment_skills.map((skill) => {
																return (
																	<Tooltip key={skill.id} title={skill.skill}>
																		<Chip
																			label={skill.skill}
																			color="primary"
																			className={classname(
																				classes.addSmallMarginRight,
																				classes.capitalize,
																				classes.label,
																				classes.chip
																			)}
																		/>
																	</Tooltip>
																);
															})}
														</Grid>
													) : null}

													{!isEmpty(employmentRecord.employment_sectors) ? (
														<Grid item xs={12}>
															<Typography variant="body2" className={classes.lightText}>
																Sectors:
															</Typography>
														</Grid>
													) : null}
													{!isEmpty(employmentRecord.employment_sectors) ? (
														<Grid item xs={12}>
															{employmentRecord.employment_sectors.map((sector) => {
																return (
																	<Tooltip key={sector.id} title={sector.name}>
																		<Chip
																			label={sector.name}
																			color="primary"
																			className={classname(
																				classes.addSmallMarginRight,
																				classes.capitalize,
																				classes.label,
																				classes.chip
																			)}
																		/>
																	</Tooltip>
																);
															})}
														</Grid>
													) : null}
												</Grid>
											) : null}
											<Typography
												variant="body2"
												className={classes.more}
												onClick={() => this.openDetails(employmentRecord.id)}
											>
												{detailOpen && detailID === employmentRecord.id ? (
													'Less '
												) : (
													'More '
												)}{' '}
												Details
											</Typography>
										</div>
									);
								})
							)}
							{editable ? (
								<div>
									<EmploymentRecordForm
										isOpen={openDialog}
										recordId={dataId}
										countries={this.props.p11Countries}
										onClose={this.dialogClose}
										remove={remove}
										handleRemove={() => this.checkBeforeRemove()}
										title={remove ? 'Edit Employment Record' : 'Add Employment Record'}
										updateList={this.dialogClose}
										getP11={() => {}}
										onRef={(ref) => (this.child = ref)}
										getProfileLastUpdate={true}
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
										text={
											'Are you sure to delete your employment record with employer name : ' +
											name +
											' ?'
										}
										closeText="Cancel"
										AgreeText="Yes"
									/>
								</div>
							) : (
								<div />
							)}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

EmploymentRecords.propTypes = {
  /**
   * getEmploymentRecords is a prop to call redux action to get all employment record data related to it's profile.
   */
	getEmploymentRecords: PropTypes.func.isRequired,
  /**
   * deleteAPI is a prop to call redux action to delete data based on url parameter.
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * profileLastUpdate is a prop to call redux action to update last update timestamp.
   */
	profileLastUpdate: PropTypes.func.isRequired,
  /**
   * refreshSkill is a prop a call function to refresh skills attach to the profile.
   */
  refreshSkill: PropTypes.func.isRequired,
  /**
   * employmentRecords is a prop containing all employment record data related to it's profile.
   */
  employmentRecords: PropTypes.object.isRequired,
  /**
   * p11Countries is a prop containing list of countries.
   */
  p11Countries: PropTypes.array.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * classes is an prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	employmentRecords: state.employmentRecords,
	p11Countries: state.options.p11Countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getEmploymentRecords,
	deleteAPI,
	addFlashMessage,
	profileLastUpdate
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	card: {
		position: 'relative'
	},
	duration: {
		color: lightText,
		fontStyle: 'italic',
		marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
	},
	divider: {
		height: theme.spacing.unit * 2
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	countryAvatar: {
		width: '32px',
		height: '32px',
		overflow: 'hidden',
		'border-radius': '50% !important',
		border: '1px solid ' + lightText,
		verticalAlign: 'middle',
		marginLeft: theme.spacing.unit,
		display: 'inline-block'
	},
	addButton: {
		position: 'absolute',
		top: theme.spacing.unit,
		right: theme.spacing.unit / 2
	},
	jobTitle: {
		fontWeight: 700
	},
	employer: {
		color: primaryColor
	},
	record: {
		paddingBottom: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		},
		'&:nth-last-child(2)': {
			marginBottom: 0,
			paddingBottom: 0
		}
	},
	lightText: {
		color: lightText
	},
	button: {
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: '#be2126'
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	label: {
		maxWidth: 300,
		'& > span': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inline !important'
		}
	},
	more: {
		cursor: 'pointer',
		marginTop: theme.spacing.unit * 2,
		color: primaryColor,
		'&:hover': {
			textDecoration: 'underline'
		}
	},
	addMediumMarginBottom: {
		marginBottom: theme.spacing.unit * 2 - theme.spacing.unit / 2
	},
	italic: {
		fontStyle: 'italic'
	},
	stillInstitution: {
		marginLeft: theme.spacing.unit,
		fontWeight: '400 !important',
		color: primaryColor,
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)'
	},
	addMarginLeft: {
		marginLeft: theme.spacing.unit
	},
	chip: {
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)',
		color: primaryColor
	}
});

const flag = {
	width: '32px',
	height: '32px',
	backgroundSize: '44px 44px'
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EmploymentRecords));
