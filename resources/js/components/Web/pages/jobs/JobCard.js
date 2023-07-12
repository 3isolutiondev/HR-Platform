/** import React, PropTypes, Link, classname and moment */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classname from 'classnames';
import moment from 'moment';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Create from '@material-ui/icons/Create';
import Delete from '@material-ui/icons/Delete';
import StarRate from '@material-ui/icons/StarRate';
import QuestionIcon from '@material-ui/icons/ViewListOutlined'
import Notifications from '@material-ui/icons/Notifications';

/** import configuration helper and permission checker */
import {
  red,
	blueIMMAP,
	white,
	primaryColorRed,
	primaryColorBlue,
	primaryColorGreen,
	primaryColor,
	recommendationColor,
	recommendationHoverColor,
	borderColor,
	lightText,
	primaryColorHover,
  blueIMMAPHover,
  blueIMMAPRed,
  blueIMMAPGreen,
  blueIMMAPBlue,
  iMMAPSecondaryColor2022,
  iMMAPSecondaryColor2022Hover,
  iMMAPSecondaryColor2022Red,
  iMMAPSecondaryColor2022Green,
  iMMAPSecondaryColor2022Blue,
  secondaryColorGreen,
} from '../../config/colors';
import { can } from '../../permissions/can';
import check_office from '../../permissions/checkImmapOffice';
import { checkUserIsHiringManager } from '../../utils/helper';

/** import fontawesome icon */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';

/** import react redux and it's actions */
import { connect } from 'react-redux';
import { getPDFInNewTab } from '../../redux/actions/common/PDFViewerActions';
import isEmpty from '../../validations/common/isEmpty';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginRight: {
		'margin-right': '0.5em'
	},
	addSmallMarginRight: {
		'margin-right': '0.25em'
	},
	addMarginBottom: {
		'margin-bottom': '0.5em'
	},
	cardMarginBottom: {
		'margin-bottom': '1em'
	},
	lightGrey: {
		borderBottom: '1px solid ' + borderColor
	},
	red: {
		'background-color': red,
		color: white
	},
	blueLight: {
		'background-color': '#3085c3',
		color: white
	},
	blue: {
		'background-color': '#0a477e',
		color: white
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': '#005A9B'
		}
	},
	languageChip: {
		'background-color': blueIMMAP,
		color: white
	},
	green: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	noTextDecoration: {
		'text-decoration': 'none',

		paddingRight: theme.spacing.unit
	},
	cardPadding: {
		padding: '8px 16px !important',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
	},
	jobTitle: {
		color: primaryColor,
		fontWeight: 700,
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing.unit
		}
	},
	greenBtn: {
		background: primaryColor,
		color: white,
		paddingLeft: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		marginBottom: 0,
		'&:hover': {
			background: primaryColorHover
		},
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing.unit
		}
	},
  sbpBtn: {
    background: blueIMMAP,
    '&:hover' : { background: blueIMMAPHover }
  },
  sbpCampaignBtn: {
    background: iMMAPSecondaryColor2022,
    '&:hover' : { background: iMMAPSecondaryColor2022Hover }
  },
  sbpLabel: { color: blueIMMAP },
  sbpCampaign: { color: iMMAPSecondaryColor2022 },
	cardAction: {
		verticalAlign: 'middle',
		margin: 0,
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			flex: 'none'
		}
	},
	headerContent: {
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			flex: 'none'
		}
	},
	noApplicant: {
		color: lightText,
	},
	separate: {
		borderBottom: '1px solid ' + borderColor,
		padding: '8px 16px !important',
		display:'flex',
  		justifyContent: "space-between"
	},
	textCenter: {
		textAlign: 'center'
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	chip: {
		background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)',
		color: primaryColor,
		[theme.breakpoints.down('sm')]: {
			width: 'max-content',
			display: 'flex',
			margin: '0 auto ' + theme.spacing.unit + 'px auto'
		},
		[theme.breakpoints.up('md')]: {
			marginRight: theme.spacing.unit / 2
		}
	},
	sbpChip: {
		background: 'rgba(' + blueIMMAPRed + ', ' + blueIMMAPGreen + ', ' + blueIMMAPBlue + ', 0.2)',
		color: blueIMMAP,
		[theme.breakpoints.down('sm')]: {
			width: 'max-content',
			display: 'flex',
			margin: '0 auto ' + theme.spacing.unit + 'px auto'
		},
		[theme.breakpoints.up('md')]: {
			marginRight: theme.spacing.unit / 2
		}
	},
	fontAwesome: {
		[theme.breakpoints.down('sm')]: {
			display: 'block',
			margin: '0 auto ' + theme.spacing.unit + 'px auto'
		}
	},
	fa_file_pdf: {
		margin: '0 auto 0px auto',
		display: 'block',
		marginRight: '10px'
	},
  sbpTitle: { color: blueIMMAP },
  sbpCampaignTitle: { color: iMMAPSecondaryColor2022 },
  sendEmailInvitationBtn: {
    color: white,
    background: iMMAPSecondaryColor2022,
    '&:hover' : {
      background: iMMAPSecondaryColor2022Hover
    }
  }
});

/**
 * JobCard is a component to show detail of a job in Jobs page
 *
 * @name JobCard
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
const JobCard = ({ job, exclude_immaper, currentUser, sendSurgeNotification, updateSendSurgeAlertText, ...props }) => {
	let isAssign = checkUserIsHiringManager(currentUser, job);

	const check_office_permission = check_office(job.immap_office_id);
	const canEditJob = can('Edit Job') && currentUser.isIMMAPER && check_office_permission ? true : false;
	const canDeleteJob = can('Delete Job') && currentUser.isIMMAPER && check_office_permission ? true : false;
  const isAdmin = can('Set as Admin') && currentUser.isIMMAPER;
  const isManager = can('Set as Manager') && currentUser.isIMMAPER;
  const isSbpManager = can('View SBP Job') && currentUser.isIMMAPER;
  const sbpCampaign = job.tor.job_standard.sbp_recruitment_campaign === "yes" ? true : false;
  const sbpJob = job.tor.job_standard.under_sbp_program === "yes" ? true : false;
  let surgeAlertText = job.surge_alert_sent === "yes" ? 'Surge Alert Sent!' : 'Send Surge Alert';
  const cluster = job.tor.cluster_seconded ? job.tor.cluster_seconded : job.tor.cluster;

  if (updateSendSurgeAlertText) {
    surgeAlertText = 'Surge Alert Sent!';
  }

	const showInterviewQuestions = (isAssign || isAdmin) && (!job.number_interview_files || job.number_interview_files === 0);

	let totalBtn = 0;
	// View Applicants Button
	if ((isAssign && !sbpJob) || (sbpJob && isSbpManager) ||  (isSbpManager && sbpCampaign) || isAdmin) {
		totalBtn = totalBtn + 1;
	}
	if(showInterviewQuestions && !sbpCampaign) {
		totalBtn = totalBtn + 1;
	}

	// Recommendations Button
	if ((((isAssign && isManager) || isAdmin) && !sbpJob)) {
	totalBtn = totalBtn + 1;
	}

	// Edit Job Button
	if ((canEditJob && isAssign && !sbpJob) || isAdmin || (isSbpManager && sbpCampaign)) {
		totalBtn = totalBtn + 1;
	}
	const deleteBtnExist = (canDeleteJob && isAssign && !sbpJob) || isAdmin;
	const totalBeforeDelete = totalBtn;
	if(totalBtn < 4 && deleteBtnExist) totalBtn = totalBtn + 1;
	let btnWidth = totalBtn === 3 ? 3 : totalBtn === 2 ? 6 : ((isAssign && !isManager) ? 12 : 6);
	if(totalBtn === 4) btnWidth = 3;

    const labelClass = sbpJob ? props.classes.sbpLabel : sbpCampaign ? props.classes.sbpCampaign : '';

	return (
		<Card className={classname(props.classes.noRadius, props.classes.cardMarginBottom)}>
			<CardHeader
				title={job.title + (job.status === 0 ? ' - Draft' : '')}
				titleTypographyProps={{ variant: 'h6' }}
				action={
					<div style={{display:'flex'}}>
							{
								job.status == 3 && (isAssign || isAdmin || (sbpJob && isSbpManager)) && (
									<Button
										size="small"
										variant="contained"
										color="default"
										className={classname(props.classes.addMarginBottom, props.classes.greenBtn)}
										style={{marginRight:'2px'}}
										onClick={() => props.getPDFInNewTab('/api/jobs/'+job.id+'/pdf')}
									>
										<FontAwesomeIcon icon={faFilePdf}  className={classname(props.classes.fontAwesome, props.classes.fa_file_pdf)} /> Report
									</Button>
								)
							}
						<Link to={'/jobs/' + job.id} className={props.classes.noTextDecoration}>
							<Button
								size="small"
								fullWidth
								variant="contained"
								color="default"
								className={sbpJob ?
                  classname(props.classes.addMarginBottom, props.classes.greenBtn, props.classes.sbpBtn) :
                  sbpCampaign ? classname(props.classes.addMarginBottom, props.classes.greenBtn, props.classes.sbpCampaignBtn) :
                  classname(props.classes.addMarginBottom, props.classes.greenBtn)
                }
							>
								<RemoveRedEye fontSize="small" className={props.classes.addMarginRight} /> View Vacancy
							</Button>
						</Link>
					</div>

				}
				className={classname(props.classes.lightGrey, props.classes.cardPadding)}
				classes={{
					title: sbpJob ? classname(props.classes.jobTitle, props.classes.sbpTitle) : sbpCampaign ? classname(props.classes.jobTitle, props.classes.sbpCampaignTitle) : props.classes.jobTitle,
					action: props.classes.cardAction,
					content: props.classes.headerContent
				}}
			/>
			{(((isAdmin || isManager) && !sbpCampaign) || (isSbpManager && sbpJob)) ?
				<div className={props.classes.separate}>
					<Typography className={props.classes.noApplicant} variant="body2" component="div" color="secondary">
						Number of Applicant : {job.number_aplicant}
					</Typography>

					{(job.show_salary === 1 && job.tor) &&
						<Typography className={props.classes.noApplicant} variant="body2" component="div" color="secondary">
							Fees : USD {job.tor.min_salary} - USD {job.tor.max_salary}
						</Typography>
					}
				</div>
			: null }

			<CardContent className={props.classes.cardPadding}>
				<Grid container spacing={8}>
					<Grid
						item
						xs={12}
						sm={12}
						md={9}
						lg={10}
						classes={{ 'align-items-xs-center': 'text-align:center' }}
					>
						<Grid container spacing={8}>
							{sbpCampaign == false &&
								<>
									<Grid item xs={6} sm={6} md={3}>
										<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
											Country
										</Typography>
										<Typography variant="body2" component="div">
											{job.country ? job.country.name : ''}
										</Typography>
									</Grid>
									<Grid item xs={6} sm={6} md={3}>
										<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
											Duty Station
										</Typography>
										<Typography variant="body2" component="div">
											{job.tor.duty_station}
										</Typography>
									</Grid>
								</>
							}
							{ !sbpJob &&
								<Grid item xs={6} sm={6} md={3}>
									<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
										Type
									</Typography>
									<Typography variant="body2" component="div">
										{job.tor.duration.name}
									</Typography>
								</Grid>
							}
							{job.show_contract === 1 && !sbpJob &&
								<Grid item xs={6} sm={6} md={3}>
									<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
											Contract Length
										</Typography>
									<Typography variant="body2" component="div">
										{job.contract_length + ' Months'}
									</Typography>
								</Grid>
							}

							<Grid item xs={6} sm={6} md={3}>
								<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
									Status
								</Typography>
								<Typography variant="body2" component="div">
									{job.tor.relationship}
								</Typography>
							</Grid>
							{ sbpJob &&
								<Grid item xs={6} sm={6} md={3}>
									<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
											Contract Length
										</Typography>
									<Typography variant="body2" component="div">
										{job.contract_length + ' Months'} - {job.tor.duration.name}
									</Typography>
								</Grid>
							}
							<Grid item xs={6} sm={6} md={3}>
								<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
									Opening Date
								</Typography>
								<Typography variant="body2" component="div">
									{moment(job.opening_date).format('DD MMMM YYYY')}
								</Typography>
							</Grid>
							<Grid item xs={6} sm={6} md={3}>
								<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
									Closing Date
								</Typography>
								<Typography variant="body2" component="div">
									{moment(job.closing_date).format('DD MMMM YYYY')}
								</Typography>
							</Grid>
							<Grid item xs={6} sm={6} md={3}>
								<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
									Organization
								</Typography>
								<Typography variant="body2" component="div">
									{job.tor.organization || 'iMMAP'}
								</Typography>
							</Grid>
							{ sbpJob && !isEmpty(cluster) &&
								<Grid item xs={6} sm={6} md={3}>
									<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
										Cluster
									</Typography>
									<Typography variant="body2" component="div">
										{cluster}
									</Typography>
								</Grid>
							}
						</Grid>
					</Grid>

					<Grid item xs={12} sm={12} md={3} lg={2} classes={{ 'align-items-xs-center': 'text-align:center' }}>
						<Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
							Languages
						</Typography>
						<Typography variant="body2" component="div">
							{job.languages.map((language, index) => {
								return (
									<Chip
										key={index}
										className={classname(
											props.classes.languageChip,
											props.classes.addMarginRight,
											props.classes.addMarginBottom
										)}
										label={language.name}
										color="secondary"
									/>
								);
							})}
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						sm={12}
						md={deleteBtnExist && (totalBeforeDelete >= 3) ? 9 : 12}
						lg={deleteBtnExist && (totalBeforeDelete >= 3) ? 10 : 12}
						classes={{ 'align-items-xs-center': 'text-align:center' }}
					>
					<Grid container spacing={8}>
					{!exclude_immaper &&
						((isAdmin || isAssign || (isSbpManager && sbpJob) || (isSbpManager && sbpCampaign)) && (
							<Grid item xs={12} sm={6} md={btnWidth} lg={btnWidth}>
								<Link to={sbpCampaign ? `/roster?skillset=${encodeURIComponent(job.tor.skillset)}` : `/jobs/${job.id}/applicants`} target="_blank" className={props.classes.noTextDecoration}>
									<Button
										size="small"
										fullWidth
										variant="contained"
										color="default"
										className={classname(props.classes.addMarginBottom, props.classes.blue)}
									>
										<RemoveRedEye
											fontSize="small"
											className={props.classes.addSmallMarginRight}
										/>{' '}
										View Applicants
									</Button>
								</Link>
							</Grid>
						))}
					{(!sbpJob && showInterviewQuestions && !sbpCampaign) &&
						<Grid item xs={12} sm={6} md={btnWidth} lg={btnWidth}>
								<Button
										size="small"
										fullWidth
										variant="contained"
										color='default'

										onClick = {()=>{
											props.setSelectedJobID(job.id)
										}}
										className={classname(props.classes.addMarginBottom, props.classes.blueIMMAP)}
									>
										<QuestionIcon
											fontSize="small"
											className={props.classes.addSmallMarginRight}
										/>{' '}
										Interview Question
									</Button>
						</Grid>}

					{sbpJob && job.status !== 0 && job.status !== 3 && (isSbpManager|| isAdmin) && (
						<Grid item xs={12} sm={6} md={btnWidth} lg={btnWidth}>
						<Button
							size="small"
							fullWidth
							variant="contained"
							color="default"
							className={classname(props.classes.addMarginBottom, props.classes.sendEmailInvitationBtn)}
							onClick={() => sendSurgeNotification(job.id, job.title)}
						>
							<Notifications fontSize="small" /> {surgeAlertText}
						</Button>
						</Grid>
					)}
					{!sbpJob && !exclude_immaper &&
						(((isAssign && isManager) || isAdmin || (isSbpManager && sbpCampaign)) && (
							<Grid item xs={12} sm={6} md={btnWidth} lg={btnWidth}>
								<Link
									to={'/jobs/' + job.id + '/recommendations'}
									className={props.classes.noTextDecoration}
								>
									<Button
										size="small"
										fullWidth
										variant="contained"
										color="default"
										className={classname(props.classes.addMarginBottom, props.classes.green)}
									>
										<StarRate fontSize="small" /> Recommendations
									</Button>
								</Link>
							</Grid>
						))}


					{!exclude_immaper &&
						(((canEditJob && isAssign) || isAdmin) && (
							<Grid item xs={12} sm={6} md={btnWidth} lg={btnWidth}>
								<Link to={'/jobs/' + job.id + '/edit'} className={props.classes.noTextDecoration}>
									<Button
										size="small"
										fullWidth
										variant="contained"
										color="secondary"
										className={props.classes.addMarginBottom}
									>
										<Create fontSize="small" /> Edit Job
									</Button>
								</Link>
							</Grid>
						))}
						{!exclude_immaper &&
						totalBeforeDelete < 4 && (((canDeleteJob && isAssign) || isAdmin) && (
							<Grid item xs={12} sm={12} md={btnWidth} lg={btnWidth}>
								<Button
									size="small"
									fullWidth
									variant="contained"
									color="primary"
									className={classname(props.classes.red, props.classes.addMarginBottom)}
									onClick={() => props.deleteAlert(job.id, job.title)}
								>
									<Delete fontSize="small" /> Delete
								</Button>
							</Grid>
						))}
						</Grid>
				</Grid>
				{totalBeforeDelete >= 4 && <Grid item xs={12} sm={12} md={3} lg={2} classes={{ 'align-items-xs-center': 'text-align:center' }}>
					{!exclude_immaper &&
						(((canDeleteJob && isAssign) || isAdmin) && (
							<Grid item xs={12} sm={12} md={12} lg={12}>
								<Button
									size="small"
									fullWidth
									variant="contained"
									color="primary"
									className={classname(props.classes.red, props.classes.addMarginBottom)}
									onClick={() => props.deleteAlert(job.id, job.title)}
								>
									<Delete fontSize="small" /> Delete
								</Button>
							</Grid>
						))}
				</Grid>}
		{((isAssign || (isAdmin && job['job_manager'].length > 0)) && !sbpJob) && (
            <>
              <Grid
                item
                xs={12}
                style={{
                  borderTop: '1px solid ' + borderColor,
                  marginLeft: 4,
                  marginRight: 4

                }}
              />
              <Grid item xs={12}>
                <FontAwesomeIcon
                  icon={faUsers}
                  size="lg"
                  className={props.classes.fontAwesome}
                  style={{ paddingRight: 10, color: sbpJob ? blueIMMAP : sbpCampaign ? iMMAPSecondaryColor2022 : primaryColor }}
                />
                {job['job_manager'].map((data, index) => {
                  let userm = data.email + ' - (' + data.name + ')';
                  return (
                    <Chip
                      key={index}
                      className={classname(
                        sbpJob ? props.classes.sbpChip : props.classes.chip,
                        props.classes.addMarginRight,
                        props.classes.addMarginBottom,
                      )}
                      label={userm}

                      color="primary"
                    />
                  );
                })}
              </Grid>
            </>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
};

JobCard.defaultProps = {
  updateSendSurgeAlertText: false
}

JobCard.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * job is a prop containing data of a job
   */
  job: PropTypes.object.isRequired,
  /**
   * exclude_immaper is a prop containing data if the logged in iMMAPer is to be excluded from the job recruitment
   */
  exclude_immaper: PropTypes.bool.isRequired,
  /**
   * deleteAlert is a prop containing function to show delete confirmation modal
   */
  deleteAlert: PropTypes.func.isRequired,
  /**
   * currentUser is a prop containing data of the current user
   */
  currentUser: PropTypes.object.isRequired,
  /**
   * getPDFInNewTab is a prop containing redux action to open pdf in new tab
   */

  getPDFInNewTab: PropTypes.func.isRequired,
  /**
   * sendSurgeNotification is a prop containing function to open send surge alert modal
   */
  sendSurgeNotification: PropTypes.func.isRequired,
  /**
   * updateSendSurgeAlertText is a prop containing boolean value to update surge alert text
   */
  updateSendSurgeAlertText: PropTypes.bool
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	currentUser: state.auth.user
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getPDFInNewTab
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobCard));
