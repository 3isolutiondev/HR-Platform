/** import React */
import React, { Component } from 'react';

/** import custom components */
import JobCard from './JobCard';
import Pagination from '../../common/Pagination';
import Alert from '../../common/Alert';
import PDFViewer from '../../common/pdf-viewer/PDFViewer';
import JobQuestionDialog from './JobQuestionDialog';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { deleteAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

/** import validation and utils helper */
import isEmpty from '../../validations/common/isEmpty';
import { pluck } from '../../utils/helper';
import textSelector from '../../utils/textSelector';

/** import Material UI withStyles and components */
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


/**
 * JobLists is a component to show list of the jobs in Jobs and Home page
 *
 * @name JobLists
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
class JobLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alertOpen: false,
			deleteLabel: '',
			deleteId: '',
			apiURL: '/api/jobs',
			LoadingJob:true,
			selectedJobID: 0,
      sendSurgeAlertOpen: false,
      surgeJobTitle: '',
      surgeJobId: '',
      sendNotifLoading: false,
      updatedSurgeAlertIds: []
		};

		this.deleteAlert = this.deleteAlert.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.setSelectedJobID = this.setSelectedJobID.bind(this);
    this.openSurgeAlert = this.openSurgeAlert.bind(this);
    this.sendSurgeNotification = this.sendSurgeNotification.bind(this);
	}

  /**
   * deleteAlert is a function to open delete confirmation modal
   * @param {number} deleteId
   * @param {string} deleteLabel
   */
	deleteAlert(deleteId, deleteLabel) {
		this.setState({ alertOpen: true, deleteId, deleteLabel });
	}

  /**
   * deleteData is a function to handle job deletion
   */
	deleteData() {
		this.props
			.deleteAPI(this.state.apiURL + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false, deleteLabel: '' }, () => {
					this.props.updateLists(this.props.JobLists.current_page);
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	/** function to set a selected job id
	 * @param {number} interview_questions
	 */
	setSelectedJobID(id) {
		this.setState({
			selectedJobID: id
		})
	}

  /**
   * openSurgeAlert is a function to open surge alert confirmation modal
   * @param {number} surgeJobId
   * @param {string} surgeJobTitle
   */
  openSurgeAlert(surgeJobId, surgeJobTitle) {
    this.setState({ sendSurgeAlertOpen: true, surgeJobId, surgeJobTitle })
  }

  /**
   * sendSurgeNotification is a function to send surge alert email notification
   * @returns {Promise}
   */
  sendSurgeNotification() {
    this.setState({ sendNotifLoading: true });
    return this.props.postAPI(`/api/jobs/send-sbp-roster-notification/${this.state.surgeJobId}`)
        .then(res => {
          this.props.addFlashMessage({ type: 'success', text: 'Surge alert succesfully sent!' });
          this.setState({
            surgeJobId: '',
            surgeJobTitle: '',
            sendSurgeAlertOpen: false,
            sendNotifLoading: false,
            updatedSurgeAlertIds: [...this.state.updatedSurgeAlertIds ,this.state.surgeJobId]
          });
          return true;
        })
        .catch(err => {
          let errMsg = textSelector('error', 'default');
          if (err.response.status === 404) {
            if (err.response.data.errors.noRosterProcessUnderSbpProgram ||
              err.response.data.errors.noAcceptedSbpMember
            ) {
              errMsg = err.response.data.message;
            }
            this.props.addFlashMessage({
              type: 'error',
              text: errMsg
            });
          } else {
            errMsg = textSelector('error', 'default');
            this.props.postAPI(`/api/job/send-sbp-roster-notification/error`, {
              error: JSON.stringify(err),
              userId: this.props.auth.id
            })
            this.props.addFlashMessage({ type: 'success', text: 'Surge alert succesfully sent!' });
            this.setState({
              surgeJobId: '',
              surgeJobTitle: '',
              sendSurgeAlertOpen: false,
              sendNotifLoading: false,
              updatedSurgeAlertIds: [...this.state.updatedSurgeAlertIds ,this.state.surgeJobId]
            });
          }
          this.setState({ sendNotifLoading: false });
          return false;
        })
  }

	render() {
		const { JobLists, auth, classes } = this.props;
		const { alertOpen, deleteLabel, sendSurgeAlertOpen, surgeJobTitle, sendNotifLoading, updatedSurgeAlertIds, selectedJobID } = this.state;
		const immap_email =
			typeof auth.immap_email === 'undefined' ? '' : !isEmpty(auth.immap_email) ? auth.immap_email : '';

		if(this.props.loadingJob) {
			return (
				<div style={{display:'flex', paddingLeft:'40%'}}>

					<Typography style={{color:'#be2126'}}>
						Loading Awesome Jobs...
					</Typography>
					<CircularProgress thickness={5} size={22} className={classes.loading} />
				</div>

			)
		}

    return (
      <div>
		{selectedJobID > 0 && <JobQuestionDialog setSelectedJobID={this.setSelectedJobID} jobID={selectedJobID} />}

        {JobLists.data ? JobLists.data.length > 0 ? (
          JobLists.data.map((job, index) => {
            const exclude_immaper = isEmpty(job.exclude_immaper)
              ? false
              : pluck(JSON.parse(job.exclude_immaper), 'value').includes(immap_email);
            return (
              <JobCard
                key={index}
                id={'jobCard-' + index}
                job={job}
                deleteAlert={this.deleteAlert}
                sendSurgeNotification={this.openSurgeAlert}
                exclude_immaper={exclude_immaper}
			        	setSelectedJobID={this.setSelectedJobID}
                updateSendSurgeAlertText={isEmpty(updatedSurgeAlertIds) ? false : (updatedSurgeAlertIds.includes(job.id)) ? true : false}
              />
            );
          })
        ) : (
          <Typography variant="h6" component="h6">
            No awesome jobs available
          </Typography>
        ) : (
          <Typography variant="h6" component="h6">
            No awesome jobs available
          </Typography>
        )}
        {this.props.paginate && (
          <Pagination
            currentPage={JobLists.current_page}
            lastPage={JobLists.last_page}
            movePage={this.props.paginate}
            onClick={(e, offset) => this.props.paginate(offset)}
          />
        )}
        <Alert
          isOpen={alertOpen}
          onClose={() => {
            this.setState({ alertOpen: false });
          }}
          onAgree={() => {
            this.deleteData();
          }}
          title="Delete Warning"
          text={'Are you sure to delete your job posting with title : ' + deleteLabel + ' ?'}
          closeText="Cancel"
          AgreeText="Yes"
        />
        <Alert
          isOpen={sendSurgeAlertOpen}
          onClose={() => {
            this.setState({ sendSurgeAlertOpen: false });
          }}
          onAgree={() => {
            this.sendSurgeNotification();
          }}
          title="Send Surge Alert Confirmation"
          text={'Are you sure to send email notifications to the accepted surge roster member for ' + surgeJobTitle + ' ?'}
          closeText="Cancel"
          AgreeText="Yes"
          isLoading={sendNotifLoading}
        />
        <PDFViewer />
      </div>
    );

	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	deleteAPI,
  postAPI,
	addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	auth: !isEmpty(state.auth.user) ? state.auth.user.data : { immap_email: '' }
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobLists));
