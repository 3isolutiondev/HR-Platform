/** import React, PropTypes, axios, js-file-download, classname and moment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FileDownload from 'js-file-download';
import classname from 'classnames';
import moment from 'moment';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

/** import custom components */
import Pagination from '../../../common/Pagination';
import JobScore from '../JobScore';

/** import configuration value, permission checker and validation helper */
import isEmpty from '../../../validations/common/isEmpty';
import { primaryColor, white, blueIMMAP, blueIMMAPHover, borderColor } from '../../../config/colors';
import { can } from '../../../permissions/can';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI } from '../../../redux/actions/apiActions';
import { serverErrorMessage, addFlashMessage } from '../../../redux/actions/webActions';
import { deleteApplication } from '../../../redux/actions/jobs/applicantActions';
import { getPDFInNewTab } from '../../../redux/actions/common/PDFViewerActions';


/**
 * ApplicationLists is a component to show My Application page or Applicant History tab
 *
 * @name ApplicationLists
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class ApplicationLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobApplications: [],
      currentPage: 1,
      lastPage: 1,
      isLoading: false,
      openHistory: false,
      selectedHistory: -1,
      downloadLoading: false,
      downloadLoadingId: '',
      open_confirmation_remove: false,
      openModelJob: null
		};

		this.getData = this.getData.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.downloadScore = this.downloadScore.bind(this);
    this.handleSelectedProfile = this.handleSelectedProfile.bind(this);
    this.openConfirmationRemove = this.openConfirmationRemove.bind(this);
		this.closeConfirmationRemove = this.closeConfirmationRemove.bind(this);
		this.deleteApplication = this.deleteApplication.bind(this);
    this.getReport = this.getReport.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
    this.getData();
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	componentDidUpdate(prevProps) {
		if (prevProps.statusData !== this.props.statusData) {
			this.getData();
		}
	}

  /**
   * getUserStatus is a function to provide status text
   * @param {*} job
   * @returns
   */
	getUserStatus(job) {
		if(job.status === 3 || job.job_user[0].job_status.set_as_rejected === 1) return 'Closed';
		if( job.tor.job_standard.under_sbp_program === "yes" && (
      job.job_user[0].job_status.last_step === 1 || job.job_user[0].job_status.is_interview === 1
    )) {
      return job.job_user[0].job_status.status_under_sbp_program;
    }
		if(job.job_user[0].job_status.last_step === 1) return 'Accepted';
    if(job.job_user[0].job_status.is_interview === 1) return 'Interview';
    return 'Active';
	}

  /**
   * getInterviewDate is a function to provide interview date
   * @param {Object} job
   * @returns
   */
  getInterviewDate(job){
    const status = this.getUserStatus(job);
		if(status === 'Interview') {
			return job.job_user[0].interview_date ? `Date: ${moment(job.job_user[0].interview_date).format('DD MMMM YYYY')}` : '';
		}
	}

  /**
   * getData is a function to get job applications data
   * @param {*} page
   */
	getData(page= '') {
    this.setState({ isLoading: true }, () => {
      this.props
        .getAPI( `/api/job-applications_id/${this.props.userId}${page?`?page=${page}`:''}`)
        .then((res) => {
          this.setState({
             jobApplications: res.data.data.data,
             currentPage: res.data.data.current_page,
             lastPage:res.data.data.last_page,
             isLoading: false });
        })
        .catch((err) => {this.setState({ isLoading: false })});
    })
	}

  /**
   * toggleHistory is a function to show / hide application history
   * @param {*} selectedHistory
   */
  toggleHistory(selectedHistory = -1) {
    this.setState({ openHistory: this.state.openHistory ? false : true, selectedHistory })
  }

  /**
   * downloadScore is a function to download score
   * @param {number} jobInterviewFileId - interview file id
   * @param {number} jobId              - job id
   * @param {number} mediaId            - media id
   * @param {string} fileName           - filename
   * @returns
   */
  downloadScore(jobInterviewFileId, jobId, mediaId, fileName) {
    this.setState({ downloadLoading: true, downloadLoadingId: jobInterviewFileId })
    return axios
      .get(`/api/jobs/${jobId}/interview-score/download`, { params: {jobInterviewFileId, mediaId}, responseType: 'blob'})
      .then((res) => {
        this.setState({ downloadLoading: false, downloadLoadingId: '' });
        return FileDownload(res.data, fileName);
      })
      .catch(err => {
        return this.setState({ downloadLoading: false, downloadLoadingId: '' }, () => {
          if (!isEmpty(err.response)) {
            if (!isEmpty(err.response.status)) {
              if (err.response.status === 404) {
                return this.props.addFlashMessage({
                  type: 'error',
                  text: err.response.message
                });
              }
            }
          }
          this.props.serverErrorMessage();
        });
      })
  }

  /**
   * handleSelectedProfile is a function to handle selected profile history
   * @param {*} jobApplications
   * @param {*} selectedHistory
   * @returns
   */
  handleSelectedProfile(jobApplications, selectedHistory) {
    let selectedProfileHistory = {job_history: ''};
    if ((selectedHistory > -1) && !isEmpty(selectedHistory)) {
      if (!isEmpty(jobApplications[selectedHistory]['job_history'])) {
        selectedProfileHistory = jobApplications[selectedHistory];
      }
    }

    let canDownloadScoreSheets = false;

    if (!isEmpty(selectedProfileHistory.interview_score)) {
      if (can('Set as Admin')) {
        canDownloadScoreSheets = true;
      } else {
        if (can('See Profile Applicant History')) {
          const profile = selectedProfileHistory.job_user[0]['user']['profile'];
          if (!isEmpty(profile)) {
            const selectedProfileIsPartOfImmapFamily = (profile.verified_immaper === 1) ? true : false;
            if (!isEmpty(this.props.partOfImmapFamily)) {
              canDownloadScoreSheets = (selectedProfileIsPartOfImmapFamily == false && this.props.partOfImmapFamily) ? true : false;
            }
          }
        }
      }
    }

    return {
      selectedProfileHistory,
      canDownloadScoreSheets
    }
  }

  /**
   * openConfirmationRemove is a function to open remove confirmation modal
   * @param {Object} job
   */
  openConfirmationRemove(job) {
		this.setState({ openModelJob: job, open_confirmation_remove: true });
	}

  /**
   * getReport is a function download the pdf report
   * @param {Object} job
   */
  getReport(job) {
    this.props.getPDFInNewTab(`/api/job-interview-scores/jobs/${job.id}}/profile/${job.job_user[0].user_id}`)
  }

  /**
   * closeConfirmationRemove is a function to close remove confirmation modal
   * @param {Object} job
   */
  closeConfirmationRemove() {
		this.setState({ open_confirmation_remove: false });
	}

  /** function to Delete an applicant by the admin */
	async deleteApplication(id, userId){
    this.setState({ isLoading : true});
    await this.props.deleteApplication(id, userId, this.getData);
    this.setState({ isLoading : false, open_confirmation_remove: false});
 }

  /** function to Delete an applicant by the admin
   * @param {Object} interview_questions
   * @param {Array} scores
   * @param {Object} user
  */
  getFinaleScore(interview_questions, scores, user) {
    let finalScore = 'PENDING';
    const managerScores = {};

    const managerScoresArray = (JSON.parse(user.job_user[0].panel_interview || "[]") || []).map(jm => jm.id)
    let totalQuestionNumber = interview_questions.filter(question => managerScoresArray.includes(question.user_id)).length;

    if(!scores.find(s => s.editable === 1) && scores.filter(s => s.applicant_id === user.job_user[0].id).length === totalQuestionNumber) {
    scores.filter(s => s.applicant_id === user.job_user[0].id && (s.interview_question && s.interview_question.question_type === 'number')).forEach(s => {
      if(managerScores[s.interview_question.user_id]) {
        managerScores[s.interview_question.user_id].sum += s.score;
        managerScores[s.interview_question.user_id].count += 1;
      } else {
        managerScores[s.interview_question.user_id] = {sum: s.score, count: 1}
      }
    })
    finalScore = 0;
    Object.keys(managerScores).forEach(m => {
      if(managerScores[m].count > 0) finalScore += managerScores[m].sum / managerScores[m].count;
    })
    finalScore = Number.parseFloat((finalScore/ Object.keys(managerScores).length).toString()).toFixed(2);
    }

    return finalScore;
  }

	render() {
		const { classes, isImmaper } = this.props;
		const { jobApplications, isLoading, openHistory, selectedHistory, downloadLoading, downloadLoadingId, openModelJob } = this.state;
    let { selectedProfileHistory, canDownloadScoreSheets } = this.handleSelectedProfile(jobApplications, selectedHistory);

    const canSeeScores = can('Set as Admin') && selectedProfileHistory.job_manager;
    let finalScore  = 'PENDING';
    if(canSeeScores &&  selectedProfileHistory) finalScore = this.getFinaleScore(selectedProfileHistory.interview_questions, selectedProfileHistory.job_user[0].job_interview_scores, selectedProfileHistory);
		return (
			<Grid container>
				<Grid item xs={12}>
          { isLoading ? (
            <CircularProgress className={classes.loading} size={22} thickness={5} color="primary"/>
          ) : isEmpty(jobApplications) ? (
            <Typography variant="subtitle1" color="primary" style={{ textAlign: 'center' }}>This profile has not applied for a job</Typography>
          ) :
            jobApplications.map((job, index) => (
              <Card className={classes.addMarginTop} key={index}>
                <CardContent>
                  <Grid container spacing={8}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography variant="subtitle1" component="span">
                        Job Title :
                        <Typography variant="h6" color="primary" component="span">
                          {job.title}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={(!this.props.userId && this.getUserStatus(job) === 'active') ? 5 : 3}>
                      <Typography variant="subtitle1">Date of Application :</Typography>
                      <Typography variant="h6" color="primary" className={classes.capitalize}>
                        {moment(job.job_user[0].created_at).format('DD MMMM YYYY')}
                      </Typography>
                    </Grid>
                    {(!this.props.userId && this.getUserStatus(job) === 'Active') ? <Grid item xs={12} sm={6} md={3} lg={2}></Grid> : <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="subtitle1">Status :</Typography>
                      <Typography variant="h6" color="primary" className={classes.capitalize}>
                        { this.getUserStatus(job) }
                      </Typography>
                      { this.getUserStatus(job) == 'Interview' && (
                        <Typography variant="subtitle1">{this.getInterviewDate(job)}</Typography>
                      )}
                    </Grid>}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="subtitle1">Country :</Typography>
                      <Typography variant="h6" color="primary" className={classes.capitalize}>
                        {job.country.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={2}>
                      <Button
                        size="small"
                        fullWidth
                        variant="contained"
                        color="default"
                        href={'/jobs/' + job.pivot.job_id}
                        className={classname(classes.addMarginBottom,classes.blueIMMAPBtn )}
                      >
                        <RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View Vacancy
                      </Button>
                      {(this.props.userId && can('See Profile Applicant History|Set as Admin')) && (
                        <Button fullWidth variant="contained" color="primary" size="small" className={classes.blueIMMAPBtn} onClick={() => this.toggleHistory(index)}>Application History</Button>
                      )}
                     {(!this.props.userId && this.getUserStatus(job) === 'Active') &&
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => this.openConfirmationRemove(job)}
                          className={classes.addMarginBottom}
                        >
                          <DeleteIcon fontSize="small" className={classes.addSmallMarginRight} />
                            Remove this application
                        </Button>
                        }
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )
          )}
          {!isLoading && !isEmpty(jobApplications) && (
            <Pagination
							currentPage={this.state.currentPage}
							lastPage={this.state.lastPage}
							movePage={(e, offset) => {
								this.getData(e);
							}}
							onClick={(e, offset) => {
								this.getData(e);
							}}
						/>
          )}
				</Grid>
        {(this.props.userId && can('Set as Admin|See Profile Applicant History')) && (
          <Dialog fullWidth={true} maxWidth="xl" onClose={this.toggleHistory} open={openHistory}>
            <DialogContent>
              <Grid container spacing={8}>
                <Grid item xs={12} sm={12} md={canDownloadScoreSheets || canSeeScores ? 6 : 12} lg={canDownloadScoreSheets || canSeeScores ? 7 : 12} xl={canDownloadScoreSheets || canSeeScores ? 8 : 12}>
                  <Typography variant="h6" color="primary">Application Status History</Typography>
                  <div className={classes.box}>
                    {!isEmpty(selectedProfileHistory.job_history) && (
                      <Stepper activeStep={-1} orientation="vertical">
                        {selectedProfileHistory.job_history.map((history, historyIndex) => {
                          const statusLabel = selectedProfileHistory.tor.job_standard.under_sbp_program === "yes" ? history.order_status.status_under_sbp_program : history.order_status.status;
                          let label = !isEmpty(history.mover) ?
                            `${statusLabel} (Moved by: ${history.mover.full_name} - ${history.mover.immap_email} at ${moment(history.created_at).format('DD MMMM YYYY')})` : `${statusLabel} at ${moment(history.created_at).format('DD MMMM YYYY')}`;
                          return (
                            <Step key={`history-${history.id}-${historyIndex}`}>
                              <StepLabel>{label}</StepLabel>
                            </Step>
                          )
                        })}
                      </Stepper>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={5} xl={4}>
                  {canDownloadScoreSheets || canSeeScores ? (
                    <div>
                      <Typography variant="h6" color="primary">Interview Score</Typography>
                      <div>
                          {canDownloadScoreSheets && selectedProfileHistory.interview_score.map(interview => (
                            <Paper key={`${interview.id} - ${interview.job_id}`} style={{ padding: 8, marginBottom: 8 }}>
                              <Grid container spacing={8} alignItems="center">
                                <Grid item xs={10} xl={11}>
                                  <Typography variant="subtitle1" style={{ fontSize: 18 }} color="primary">{interview.user_interview_name} - {interview.user_interview_email}</Typography>
                                </Grid>
                                <Grid item xs={2} xl={1}>
                                  <Tooltip title={`Download ${interview.user_interview_name} Score`}>
                                    <Fab color="primary" size="small" style={{ float: 'right' }} onClick={() => this.downloadScore(interview.id, interview.job_id, interview.media_id, interview.file_name)}>
                                      { (downloadLoading && downloadLoadingId == interview.id) ? (
                                        <CircularProgress className={classname(classes.loading, classes.downloadLoading)} size="small"/>
                                      ) : (
                                        <CloudDownload/>
                                      )}
                                    </Fab>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Paper>
                          ))}
                          {canSeeScores && selectedProfileHistory.interview_questions.length > 0 && selectedProfileHistory.job_manager.map((manager, index) => <JobScore key={`manager-job-score-${index}`} globalImpression={selectedProfileHistory.job_user[0].job_interview_global_impression} user_id={selectedProfileHistory.job_user[0].id} scores={selectedProfileHistory.job_user[0].job_interview_scores} questions={selectedProfileHistory.interview_questions.filter(q => q.user_id === manager.user_id) || []} manager={manager}  />
                          )}

                        {!canDownloadScoreSheets && (
                          <Grid container>
                            <Grid item xs={12} md={12} lg={12} style={{display: "flex", flexDirection: "row", marginBottom: '20px'}} justify='space-between'>
                            {!isNaN(finalScore) ? <Button onClick={() => this.getReport(selectedProfileHistory)}
                                  align="right"
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  >
                                PDF Report
                              </Button> : <p></p>}
                              <Typography align="right" color="primary" variant='body1' className={classes.finalScore} >FINAL SCORE : {' '} {isNaN(finalScore) ? 'PENDING' : `${finalScore} / 5`}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </div>
                    </div>
                  ) : (isImmaper && !isEmpty(selectedProfileHistory.interview_score)) ? (
                    <div>
                      <Typography variant="h6" color="primary">Interview Score</Typography>
                      <div>
                        <Paper style={{ padding: 8, marginBottom: 8 }}>
                          <Typography variant="body1">
                            Dear colleague, please contact the Human Resources department (HQ) to access the scoring sheets of this user.
                          </Typography>
                        </Paper>
                      </div>
                    </div>
                  ) : null}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleHistory} variant="contained" color="secondary">Close</Button>
            </DialogActions>
          </Dialog>
        )}
         {(!this.props.userId && openModelJob && this.getUserStatus(openModelJob) === 'Active') &&
            <Dialog open={this.state.open_confirmation_remove} onClose={this.closeConfirmationRemove}>
              <DialogTitle>Delete Application</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-remove-user-application">
                    Are sure to delete this application?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={this.closeConfirmationRemove}
                    color="secondary"
                    variant="contained"
                    disabled={isLoading ? true : false}
                  >
                    <CancelIcon fontSize="small" className={classes.addSmallMarginRight} />
                      Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      this.deleteApplication(openModelJob.job_user[0].job_id, openModelJob.job_user[0].user_id);
                    }}
                    color="primary"
                    autoFocus
                    variant="contained"
                    disabled={isLoading ? true : false}
                  >
                    <DeleteIcon fontSize="small" className={classes.addSmallMarginRight} />
                      Delete
                      {isLoading && (
                        <CircularProgress size={22} thickness={5} className={classes.loading} />
                      )}
                  </Button>
                </DialogActions>
            </Dialog>
          }
			</Grid>
		);
	}
}

ApplicationLists.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * userId is a prop containing user id
   */
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * serverErrorMessage is a prop containing redux action to get default server error message
   */
  serverErrorMessage: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a function to show a pop up message
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * partOfImmapFamily is a prop containing data of the logged in user is part of 3iSolution or not
   */
  partOfImmapFamily: PropTypes.bool
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  serverErrorMessage,
  addFlashMessage,
  deleteApplication,
  getPDFInNewTab
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  partOfImmapFamily: state.auth.user.iMMAPFamily,
  isImmaper: state.auth.user.isIMMAPER
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		'text-transform': 'capitalize'
	},
	addMarginTop: {
		'margin-top': '1em'
	},
  addMarginBottom: { marginBottom: theme.spacing.unit },
  loading: {
		margin: '0 auto',
    display: 'block'
	},
  stepContainer: {
    marginLeft: theme.spacing.unit * -1,
    marginBottom: theme.spacing.unit
  },
  step: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  arrow: {marginLeft: 8, marginRight: 8},
  number: {
    borderRadius: "50%",
    border: `2px solid ${primaryColor}`,
    lineHeight: `${theme.spacing.unit * 4}px`,
    height: theme.spacing.unit * 4,
    width: theme.spacing.unit * 4,
    textAlign: 'center',
    background: primaryColor,
    color: white,
  },
  box: { border: `1px solid ${borderColor}`, padding: theme.spacing.unit },
  blueIMMAPBtn: {
    background: blueIMMAP,
    color: white,
    '&:hover': {
      background: blueIMMAPHover
    }
  },
  downloadLoading: {
    color: white,
    height: `${theme.spacing.unit * 5 / 2}px !important`,
    width: `${theme.spacing.unit * 5 / 2}px !important`,
  },
  addSmallMarginRight: {
		'margin-right': '.25em'
	},
  right: {
    marginLeft: 'auto'
  },
  finalScoreContainer: {
    display: 'flex',
    flexOrientation: 'row-reversed'
  },
  finalScore: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
    color: 'black'
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicationLists));
