/** import React, PropTypes, classname, moment and findIndex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment-timezone';
import findIndex from 'lodash/findIndex';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Close from "@material-ui/icons/Close";
import IconButton from '@material-ui/core/IconButton';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import PresentToAll from '@material-ui/icons/PresentToAll';
import Komentar from '@material-ui/icons/Comment';
import Send from '@material-ui/icons/Send';
import Done from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import PlaceIcon from '@material-ui/icons/Place';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
  openCloseProfile,
  openCloseRequestContractForm,
  jobStatusOnChange,
  saveInterviewDate,
  sendInterview,
  uploadFiles,
  changePhysicalInterview,
  deleteApplicant,
  bulkChange
} from '../../../redux/actions/jobs/applicantActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getAPI, postAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { getPDFInNewTab } from '../../../redux/actions/common/PDFViewerActions';

/** import configuration value, validation helper and permission checker */
import { can } from '../../../permissions/can';
import { validateAplicantData } from '../../../validations/Jobs/Aplicant/AplicantCard';
import isEmpty from '../../../validations/common/isEmpty';
import { blueIMMAP, blueIMMAPHover, blue, white, primaryColor, secondaryColor, recommendationColor, recommendationHoverColor } from '../../../config/colors';
import { acceptedDocFiles } from '../../../config/general';

/** import custom components */
import SelectField from '../../../common/formFields/SelectField';
import DatePickerField from '../../../common/formFields/DatePickerField';
import UploadButton from '../../../common/UploadButton';
import Alert from '../../../common/Alert';
import CommentCard from './CommentCard';
import JobScore from '../JobScore';
import ReferenceCheck from './ReferenceCheck';
import ApplicantTestScore from './ApplicantTestScore';

/** ApplicantCard component to show list of each applicant profile in job applicants page, URL: http://localhost:8000/jobs/{id}/applicants
 *
 * @name ApplicantCard
 * @component
 * @category Page
 * @subcategory Jobs
 *
 */
class ApplicantCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInterview: false,
      interviewDate: moment(new Date()),
      timezone: '',
      interview_invitation_done: false,
      isLoading: false,
      changeStatusLoading: false,
      interview_type: 0,
      interview_address: '',
      immaper_invite: [],
      skype_id: '',
      errors: {},
      user_interview_files: [],
      cover_letter_url: '',
      comments: [],
      openDialogCom: false,
      openEditDialogCom: false,
      openReplyDialog: false,
      openPopCom: false,
			open_confirmation_remove: false,
      commentID: '',
      editComment: '',
      commentExist: [],
      loginid: '',
      komentar: '',
      root: '',
      commentValue: '',
      isLoadingSaveCom: false,
      isLoadingReplyCom: false,
      LoadingComment: true,
      replyTo: '',
      replyValue: '',
      previmmaper_invite: [],
      open_confirmation: false,
      new_step: '',
      id: '',
      acceptedConfirmation: false,
      commentComponents: [],
      seeInterviewScore: false,
      microsoft_login: false,
      microsoft_login_url: '',
      commentText: '',
      updatedScores: null,
      updating: false
    };

    this.dateOnChange = this.dateOnChange.bind(this);
    this.sendInterview = this.sendInterview.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.selectOnChangePysical = this.selectOnChangePysical.bind(this);

    this.saveComment = this.saveComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.saveEditComment = this.saveEditComment.bind(this);
    this.openPopUpComment = this.openPopUpComment.bind(this);
    this.openConfirmation = this.openConfirmation.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
    this.processStatusChange = this.processStatusChange.bind(this);

    this.openCloseAcceptedConfirmation = this.openCloseAcceptedConfirmation.bind(this);
    this.renderComment = this.renderComment.bind(this);

    this.openConfirmationRemove = this.openConfirmationRemove.bind(this);
		this.closeConfirmationRemove = this.closeConfirmationRemove.bind(this);
    this.deleteApplicant = this.deleteApplicant.bind(this);
    this.updateScores = this.updateScores.bind(this);
    this.getReport = this.getReport.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.isValid();
    let { jobStatusTab, job_status, user, interviewIndex, job_standard_under_sbp_program } = this.props;
    let { profile, pivot, user_interview_files } = user;

    if (!isEmpty(job_status) && jobStatusTab) {
      const isInterview = (job_status[jobStatusTab]['is_interview'] == 1 && !job_standard_under_sbp_program) ? true : false;
      const seeInterviewScore = job_status[jobStatusTab].order >= interviewIndex ? true : false;
      this.setState({ isInterview, seeInterviewScore }, () => this.isValid());
    }
    if (!isEmpty(pivot.interview_date)) {
      this.setState({ interviewDate: moment(pivot.interview_date) });
    }
    if (!isEmpty(pivot.timezone)) {
      this.setState({ timezone: { value: pivot.timezone, label: pivot.timezone } }, () => this.isValid());
    }
    if (!isEmpty(pivot.interview_invitation_done)) {
      this.setState({ interview_invitation_done: pivot.interview_invitation_done == 1 ? true : false });
    }
    if (!isEmpty(pivot.panel_interview)) {
      this.setState({ immaper_invite: JSON.parse(pivot.panel_interview) });

      if (jobStatusTab == 2 && pivot.interview_invitation_done == 1) {
        let ss = JSON.parse(pivot.panel_interview);

        for (let i = 0; i < ss.length; i++) {
          this.setState((prevState) => ({
            comments: [...prevState.comments, { comment: '' }]
          }));
        }
      }
    }
    if (!isEmpty(pivot.skype_id)) {
      this.setState({ skype_id: pivot.skype_id });
    }

    if (!isEmpty(pivot.interview_type)) {
      this.setState({ interview_type: pivot.interview_type });
    }

    if (!isEmpty(pivot.interview_address)) {
      this.setState({ interview_address: pivot.interview_address });
    }

    if (!isEmpty(pivot.cover_letter_url)) {
      this.setState({ cover_letter_url: pivot.cover_letter_url });
    }

    if (!isEmpty(user_interview_files)) {
      this.setState({ user_interview_files });
    }
    let questionsCount = 0;
    this.props.job_managers.filter(j => (JSON.parse(pivot.panel_interview) || []).map(jm => jm.id).includes(j.user_id)).forEach(j => {
      questionsCount += j.interview_questions.length;
    });
    if(user.job_user[0].job_interview_scores.length >= questionsCount) {
      if(user.job_user[0].final_interview_score === null) {
        this.props.postAPI(`/api/job-interview-scores/jobs/${user.job_user[0].job_id}/profile/${user.job_user[0].user_id}/final-score`)
        .then(res => {
          this.props.getAPI(`/api/job-interview-scores/jobs/${user.job_user[0].job_id}/profile/${user.job_user[0].user_id}`)
          .then(res => {}).catch(err => {})
        }).catch(err => {})
      }
    }

    this.startTimer();

  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   * @param {object} prevState - previous state
   */
  componentDidUpdate(prevProps, prevState) {
    const currentInterview = JSON.stringify(this.props.user.pivot.interview_date);
    const prevInterview = JSON.stringify(prevProps.user.pivot.interview_date);
    const currentSent = JSON.stringify(this.props.user.pivot.interview_invitation_done);
    const prevSent = JSON.stringify(prevProps.user.pivot.interview_invitation_done);
    const currentTimezone = JSON.stringify(this.props.user.pivot.timezone);
    const prevTimezone = JSON.stringify(prevProps.user.pivot.timezone);
    const currentSkype = JSON.stringify(this.props.user.pivot.skype_id);
    const prevSkype = JSON.stringify(prevProps.user.pivot.skype_id);
    const prev_user_interview_files = JSON.stringify(prevProps.user.user_interview_files);
    const current_user_interview_files = JSON.stringify(this.props.user.user_interview_files);



    if (currentSkype != prevSkype) {
      this.setState({ skype_id: this.props.user.pivot.skype_id });
    }

    if(currentTimezone != prevTimezone && currentInterview != prevInterview) {
      this.startTimer();
    }

    if (currentTimezone != prevTimezone) {
      this.setState(
        {
          timezone: { value: this.props.user.pivot.timezone, label: this.props.user.pivot.timezone }
        },
        () => this.isValid()
      );
    }

    if (currentSent != prevSent) {
      this.setState({
        interview_invitation_done: this.props.user.pivot.interview_invitation_done == 1 ? true : false
      });
    }

    if (currentInterview != prevInterview) {
      this.setState({ interviewDate: moment(this.props.user.pivot.interview_date) });
    }

    if (prev_user_interview_files != current_user_interview_files) {
      this.setState({ user_interview_files: this.props.user.user_interview_files });
    }

    if (this.props.jobStatusTab) {
      this.state.previmmaper_invite = prevState.immaper_invite;
    }
  }

  /** function to change data while updating physical interview information */
  async selectOnChangePysical(value, e) {
    let res = await this.props.changePhysicalInterview(this.props.user.id, value);
    if (res) {
      this.setState(
        {
          [e.name]: value,
          interview_address: value == 1 ? this.state.interview_address : '',
          skype_id: value == 1 ? '' : this.state.skype_id
        },
        () => {
          this.isValid();
        }
      );
    }
  }

  /** function to change interview date */
  dateOnChange(e) {
    this.setState({ [e.target.name]: moment(e.target.value) }, () => {
      this.props.saveInterviewDate(
        this.props.user.id,
        this.props.job_status[this.props.jobStatusTab],
        this.state.interviewDate,
        (this.state.timezone && this.state.timezone.value) ? this.state.timezone.value : (this.state.timezone  || '')
      );
    });
  }

  /**
   * getReport is a function download the pdf report
   * @param {Object} job
   */
  getReport() {
    this.props.getPDFInNewTab(`/api/job-interview-scores/jobs/${this.props.user.job_user[0].job_id}}/profile/${this.props.user.id}`)
  }

  /** function to send interview invitation */
  sendInterview(
    id,
    job_status,
    interviewDate,
    timezone,
    skype_id,
    immaper_invite,
    interview_type,
    interview_address,
    noError
  ) {

    let immaper = immaper_invite.map((data) => {
      return data.value;
    });
    let tempDataImmaper = immaper_invite.map((data) => {
      return { user_interview_name: data.label, user_interview_email: data.value, user_interview_id: data.id };
    });
    this.setState({ isLoading: true }, async () => {
      const res = await this.props.sendInterview(
        id,
        job_status,
        interviewDate,
        timezone,
        skype_id,
        immaper,
        immaper_invite,
        interview_type,
        interview_address,
        noError,
        this.state.commentText
      );

      if(res && res.url ){
        this.setState({microsoft_login: true, microsoft_login_url: res.url, isLoading: false })
      } else {
        this.setState({ isLoading: false, interview_invitation_done: true, user_interview_files: tempDataImmaper, open_confirmation: false, commentText: '' });
      }
    });
  }

  /** function to open confirmation modal */
  openConfirmation() {
    this.setState({ open_confirmation: true });
  }

  /** function to close confirmation modal */
  closeConfirmation() {
    this.setState({ open_confirmation: false, new_step: '', id: '', commentText: '' });
  }

  /** function to close microsoft login */
  closeMicrosoftLogin() {
    this.setState({ microsoft_login: false, microsoft_login_url: ''  });
  }

  /** function to open alert modal to delete applicant */
  openConfirmationRemove() {
		this.setState({ open_confirmation_remove: true });
	}

 /** function to close alert modal to delete applicant */
  closeConfirmationRemove() {
		this.setState({ open_confirmation_remove: false });
	}

  /** function to change applicant status but checking if it's needed to open the confirmation modal or not */
  changeStatus(value, id) {
    if (JSON.stringify(value) !== JSON.stringify(this.props.job_status[this.props.jobStatusTab])) {
      if (!isEmpty(value) && !isEmpty(id)) {
        this.setState({ new_step: value, id }, () => {
          if (value.last_step == 1) {
            this.openCloseAcceptedConfirmation();
          } else {
            this.processStatusChange();
          }
        });
      }
    } else {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Cannot pick the same status'
      });
    }
  }

  /** function to change applicant status (Active, Shortlisted, Interview, Accepted, Rejected) */
  processStatusChange() {
    this.setState({ changeStatusLoading: true }, async () => {
      await this.props.jobStatusOnChange(this.state.new_step, this.state.id);
      this.setState({ changeStatusLoading: false, new_step: '', id: '', open_confirmation: false });
      this.props.getSteps();
    });
  }

  /** function to change applicant card data and validate */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  /** function to open pop up comment modal */
  openPopUpComment() {
    this.setState({
      openPopCom: true
    });
    this.getComment();
  }

  /** function to save comment */
  saveComment() {
    let komen = '';

    if (this.state.replyValue) {
      komen = this.state.replyValue;
      this.setState({
        isLoadingReplyCom: true,
        commentValue: '',
        replyValue: ''
      });
    } else if (this.state.commentValue) {
      komen = this.state.commentValue;
      this.setState({
        isLoadingSaveCom: true,
        commentValue: '',
        replyValue: ''
      });
    } else if (this.state.editComment) {
      komen = this.state.editComment;
    }

    let jobData = {
      jobid: this.props.user.pivot.job_id,
      userid: this.props.user.id,
      root: this.state.root ? this.state.root : 0,
      comment: komen,
      tab: this.props.jobStatusTab
    };

    this.props
      .postAPI('/api/jobs/save-comment', jobData)
      .then((res) => {
        let msg = 'Your comment has been saved';
        this.props.addFlashMessage({
          type: 'success',
          text: msg
        });
        this.getComment();

        this.setState({
          isLoadingSaveCom: false,
          isLoadingReplyCom: false,
          openReplyDialog: false,
          LoadingComment: false
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Error'
        });
      });
  }

  /** function to get comment */
  getComment() {
    this.setState({
      LoadingComment: true
    });

    this.props
      .getAPI('/api/jobs/get-comment-by-job-user-id/' + this.props.user.pivot.job_id + '/' + this.props.user.id)
      .then((res) => {
        this.setState({
          commentExist: res.data.data.comment,
          loginid: res.data.data.loginid,
          LoadingComment: false
        });
      })
      .catch((err) => { });
  }

  /** function to update the edited comment */
  saveEditComment() {
    let recordData = {
      comment: this.state.editComment,
      commentID: this.state.commentID
    };

    this.setState({
      isLoadingReplyCom: true
    });
    this.props
      .postAPI('/api/jobs/update-comment', recordData)
      .then((res) => {
        let msg = 'Your comment has been saved';
        this.props.addFlashMessage({
          type: 'success',
          text: msg
        });
        this.getComment();

        this.setState({
          openEditDialogCom: false,
          isLoadingReplyCom: false
        });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Error'
        });
      });
  }

  /** function to delete comment */
  deleteComment() {
    this.props
      .deleteAPI('/api/jobs/delete-comment' + '/' + this.state.commentID)
      .then((res) => {
        this.getComment();

        this.props.addFlashMessage({
          type: 'success',
          text: 'Comment successfully deleted'
        });
        this.setState({ commentID: '', openDialogCom: false });
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'There is an error while processing the delete request'
        });
      });
  }

  /** function to delete manager while in interview process */
  deleteManager(dt, obj) {
    let ddd = [];

    obj.state.previmmaper_invite.map((data) => {
      if (dt.data.id != data.id) {
        ddd.push({ id: data.id, label: data.label, value: data.value });
      }
    });
    let jobData = {
      jobid: obj.props.user.pivot.job_id,
      userid: obj.props.user.id,
      managerId: dt.data.id,
      manager: ddd
    };
    return;
  }

  /** function to save manager list on interview process */
  saveManagerData(val) {
    let jobData = {
      jobid: this.props.user.pivot.job_id,
      userid: this.props.user.id,
      manager: val
    };
    this.props
      .postAPI('/api/jobs/save-manager', jobData)
      .then((res) => {
        this.props.addFlashMessage({
          type: 'success',
          text: 'Success'
        });
        this.props.reloadProfiles();
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Error'
        });
      });
  }

  /** function to change select field */
  selectOnChange(value, e) {
    if ([e.name] == 'immaper_invite') {
      if (value.length < 6) {
        this.setState({ [e.name]: value }, () => this.isValid());
        this.saveManagerData(value);
        // }
      } else {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Only a maximum of 5 immapers'
        });
      }
    } else if([e.name] == 'timezone') {
      this.setState({ [e.name]: value }, () => {
        this.isValid()
        if(this.state.interviewDate) {
          this.props.saveInterviewDate(
            this.props.user.id,
            this.props.job_status[this.props.jobStatusTab],
            this.state.interviewDate,
            (this.state.timezone && this.state.timezone.value) ? this.state.timezone.value : (this.state.timezone  || '')
          );
        }
      });

    } else {
      this.setState({ [e.name]: value }, () => this.isValid());
    }
  }

  /** function to check if the interview form data is valid */
  isValid() {
    const { timezone, immaper_invite, skype_id, interview_type, interview_address } = this.state;
    let { errors, isValid } = validateAplicantData({
      timezone,
      immaper_invite,
      skype_id,
      interview_type,
      interview_address
    });
    this.setState({ errors });
    return isValid;
  }
  /** function to open / close pop up confirmation for accepting applicant */
  openCloseAcceptedConfirmation() {
    this.setState({ acceptedConfirmation: this.state.acceptedConfirmation ? false : true })
  }

  /** function to render comments about the applicant from hiring manager */
  renderComment(comment, depth = 0) {
    if (!isEmpty(comment.commentby)) {
      let commentComponents = [(
        <CommentCard
          key={`comm-${comment.id}`}
          comment={comment.comments}
          parentId={comment.root}
          commentBy={comment.commentby.full_name}
          commentById={comment.comment_by_id}
          commentId={comment.id}
          updatedAt={comment.updated_at}
          createdAt={comment.created_at}
          depth={depth}
          onEditClick={() => {
            this.setState({
              openEditDialogCom: true,
              commentID: comment.id,
              editComment: comment.comments
            })
          }}
          onDeleteClick={() => {
            this.setState({
              openDialogCom: true,
              commentID: comment.id
            })
          }}
          onReplyClick={() => {
            this.setState({
              openReplyDialog: true,
              root: comment.id,
              replyTo: comment.commentby.full_name
            })
          }}
          currentUserId={this.state.loginid}
        />
      )]

      {!isEmpty(comment.replies) &&
        comment.replies.map(reply => {
          commentComponents.push(this.renderComment(reply, depth + 1))
        })
      }

      return commentComponents;
    }

    return false;
  }

  /** function to Delete an applicant by the admin */
  async deleteApplicant(id,userId){
    this.setState({ isLoading : true});
    await this.props.deleteApplicant(id, userId);
    this.setState({ isLoading : false, open_confirmation_remove: false});
  }

    /**
   * updateScore is a function that update scores
   * @param {object} scores - score object
   * @param {object} globalImpression - global comments
   */
  updateScores(scores, globalImpression) {
    const existingScores = this.state.updatedScores || this.props.user.job_user[0].job_interview_scores || [];
    const excludedScores = existingScores.filter(s => !scores.find(ss => ss.id === s.id));
    this.setState({updatedScores: [...scores, ...excludedScores], updatedGlobalImpression:[globalImpression] });
    let questionsCount = 0;
    this.props.job_managers.filter(j => this.state.immaper_invite.map(jm => jm.id).includes(j.user_id)).forEach(j => {
      questionsCount += j.interview_questions.length;
    });
    this.props.postAPI(`/api/job-interview-scores/jobs/${this.props.user.job_user[0].job_id}/profile/${this.props.user.job_user[0].user_id}/final-score`)
    .then(res => {
      this.props.getAPI(`/api/job-interview-scores/jobs/${user.job_user[0].job_id}/profile/${user.job_user[0].user_id}`)
      .then(res => {}).catch(err => {});
    }).catch(err => {});
  }

  startTimer() {
    const timez = this.state.timezone ? typeof this.state.timezone === 'string' ? this.state.timezone : typeof this.state.timezone === 'object' ? this.state.timezone.value : 'utc' : 'utc'
    let interviewCompareDate = moment(this.state.interviewDate);
    interviewCompareDate = interviewCompareDate.tz(timez, true);

    if (!this.timer && moment().clone().tz(timez).isBefore(interviewCompareDate)) {
      this.timer = setInterval(() => {
        const timez2 = this.state.timezone ? typeof this.state.timezone === 'string' ? this.state.timezone : typeof this.state.timezone === 'object' ? this.state.timezone.value : 'utc' : 'utc'
        let interviewCompareDate2 = moment(this.state.interviewDate);
        interviewCompareDate2 = interviewCompareDate2.tz(timez2, true);
        const interviewDoneCheck = moment().clone().tz(timez).isAfter(interviewCompareDate2);
        if(interviewDoneCheck && !this.state.updating){
          this.setState({updating: !this.state.updating})
          clearInterval(this.timer);
        }
      }, 1000);
    }
  }

  render() {
    let {
      user,
      job_status,
      jobStatusTab,
      openCloseProfile,
      openCloseRequestContractForm,
      timezones,
      classes,
      immapers,
      uploadFiles,
      usersSign,
			lastStepIndex,
      job_managers,
      showInterviewFiles,
      interviewIndex,
			job_title,
      job_standard_under_sbp_program,
      bulkChange,
      useTestStep,
      showApplicantTestLinkAndScore,
      isTestStep,
      testStepPosition
    } = this.props;
    let {
      age,
      isInterview,
      interviewDate,
      timezone,
      interview_invitation_done,
      isLoading,
      changeStatusLoading,
      errors,
      skype_id,
      immaper_invite,
      interview_type,
      interview_address,
      cover_letter_url,
      user_interview_files,
      seeInterviewScore
    } = this.state;
    const { full_name, profile, id, archived_user } = user;

		let isJobManager = false;
		if(!isEmpty(this.props.isManager)) {
			isJobManager = true;
		}

    const interviewFiles = isEmpty(user_interview_files) ? 0 : user_interview_files.filter(item => !!item.media_id);
    const uploadCount = interviewFiles === 0 ? 0 : interviewFiles.length;
    const managerCount = isEmpty(immaper_invite) ? 0 : immaper_invite.length;
		const isAdmin = can('Set as Admin');
    const scores = this.state.updatedScores || user.job_user[0].job_interview_scores;
    const globalImpression = this.state.updatedGlobalImpression || user.job_user[0].job_interview_global_impression || [];
    let finalScore = 'PENDING';
    const managerScores = {};
    let totalQuestionNumber = 0;
    let totalQuestions = [];

    job_managers.filter(j => (this.state.immaper_invite || []).map(jm => jm.id).includes(j.user_id)).forEach(j => {
      totalQuestionNumber += j.interview_questions.length;
      totalQuestions = [...totalQuestions, ...j.interview_questions];
    });

    const realScores = totalQuestions.filter(q => scores.find(s => s.applicant_id === user.job_user[0].id && s.interview_question_id === q.id));
    if(realScores.length >= totalQuestions.length ) {
      scores.filter(s => totalQuestions.find(iq => iq.id === s.interview_question_id) && s.applicant_id === user.job_user[0].id && (s.interview_question && s.interview_question.question_type === 'number')).forEach(s => {
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
    const enableStatusSelect = showInterviewFiles ? (uploadCount !== managerCount) : finalScore === 'PENDING';
    const timez = timezone ? typeof timezone === 'string' ? timezone : typeof timezone === 'object' ? timezone.value : 'utc' : 'utc'
    let interviewCompareDate = moment(interviewDate);
    interviewCompareDate = interviewCompareDate.tz(timez, true);
    const interviewDoneCheck = moment().clone().tz(timez).isAfter(interviewCompareDate);
    let interviewOrderedList = [];
    if(interview_invitation_done && this.props.interview_order) {
      interviewOrderedList = this.props.interview_order.split(',').filter(i => immaper_invite.find(inv => inv.id.toString() === i)).map(oi => job_managers.find(j => j.user_id.toString() === oi) || immaper_invite.find(inv => inv.id.toString() === oi))
      if(interviewOrderedList.length !== immaper_invite.length) {
        const notInList = immaper_invite.filter(inv => !interviewOrderedList.find(oi => oi.user_id.toString() === inv.id.toString()));
        interviewOrderedList = [...interviewOrderedList, ...(notInList.map(inv => job_managers.find(j => j.user_id.toString() === inv.id.toString()) || inv))];
      }
    }

    const canMoveReferenceCheck = can('Send Reference Check') || job_status[jobStatusTab].has_reference_check != 1;

    return (
      <Card className={classnames(classes.addMarginTop, classes.card)}>
        <CardContent classes={{ root: classes.cardContent }}>
          <Grid container spacing={16} alignItems="center">
            <Grid item xs={12} md={6} lg={3}>
              <Typography variant="h6" color="primary" component="span">
                {full_name} {(isAdmin && archived_user === "yes") && '[Archived]'}
              </Typography>
              {(this.props.include_cover_letter &&
                !isEmpty(cover_letter_url)) ? (
                  <a href={cover_letter_url} target="_blank" className={classes.coverLetter}>
                    <Typography variant="subtitle2" color="primary" component="span">
                      Download Cover Letter
									</Typography>
                  </a>
                ) : null}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Typography variant="h6" color="primary" component="span">
                {profile.latest_education_universities ? profile.latest_education_universities.degree_level.name : '' }
              </Typography>
              <Typography variant="subtitle2" color="secondary" component="span">
                {profile.latest_education_universities ? profile.latest_education_universities.degree : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {job_status ? (
                <div>
                  <SelectField
                    label="Job Status"
                    options={job_status}
                    value={job_status[jobStatusTab]}
                    onChange={(value, e) => {
                      this.changeStatus(value, id);
                    }}
                    placeholder="Select job status"
                    isMulti={false}
                    name="job_status"
                    required
                    fullWidth={true}
                    margin="dense"
                    showLoading={changeStatusLoading ? true : false}
                    isDisabled={!canMoveReferenceCheck || ((((can('View Applicant Profile') && isInterview) || isJobManager) && (enableStatusSelect && isInterview)) ? true : false)}
                  />
                </div>
              ) : null}
            </Grid>
						{(can('View Applicant Profile') || isJobManager) ? (
              <Grid item xs={12} md={6} lg={3}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  color="default"
                  className={classes.interviewBtn}
                  onClick={() => openCloseProfile(profile.id)}
                >
                  <RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View
									Profile
								</Button>
              </Grid>
            ) : null}
          </Grid>
          <hr style={{ borderColor: primaryColor, borderWidth: '0.5px' }} />

          <Grid container spacing={16} alignItems="center">
            <Grid item xs={12} md={6} lg={3}>
              <Typography variant="h6" color="secondary" component="span">
                Date of Application:
							</Typography>
              <Typography variant="subtitle2" color="secondary" component="span">
                {moment(user.pivot.created_at).format('DD MMMM YYYY')}
              </Typography>
            </Grid>
            {jobStatusTab > 0 ? (
              <Grid item xs={12} md={6} lg={3}>
                <Typography variant="h6" color="secondary" component="span">
                  Moved By:
								</Typography>
                <Typography variant="subtitle2" color="secondary" component="span">
                  {user.job_user_history_status.length > 0 ? user.job_user_history_status[0].mover ? (
                    user.job_user_history_status[0].mover.full_name
                  ) : (
                      '-'
                    ) : (
                      '-'
                    )
                  }
                </Typography>
              </Grid>
            ) : null}
            {jobStatusTab > 0 ? (
              <Grid item xs={12} md={6} lg={3}>
                <Typography variant="h6" color="secondary" component="span">
                  Date of The Move:
								</Typography>
                <Typography variant="subtitle2" color="secondary" component="span">
                  {user.job_user_history_status.length > 0 ? (
                    moment(user.job_user_history_status[0].created_at).format('DD MMMM YYYY')
                  ) : (
                      '-'
                    )}
                </Typography>
              </Grid>
            ) : null}
            {isAdmin ? (
              <Grid item  xs={12} md={6} lg={3} className={classes.right}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => this.openConfirmationRemove()}
                >
                  <DeleteIcon fontSize="small" className={classes.addSmallMarginRight} />
                  Remove this applicant
								</Button>
              </Grid>
            ) : null}
            { job_status[jobStatusTab].last_step == 1 ? (
              <Grid item xs={12} md={6} lg={3}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => openCloseRequestContractForm(user)}
                >
                  <PresentToAll fontSize="small" className={classes.addSmallMarginRight} />
									Request Contract
								</Button>
              </Grid>
            ) : null}
          </Grid>
          {(job_status[jobStatusTab].has_reference_check == 1 || job_status[jobStatusTab].last_step == 1 ) &&
          <Grid container spacing={16}>
            <Grid item xs={12} md={12} lg={12}>
              <ReferenceCheck user={user} isReference={job_status[jobStatusTab].has_reference_check == 1} />
            </Grid>
          </Grid>}
					{((can('View Applicant Profile') || isJobManager) && isInterview) && <hr className={classes.interviewDivider} />}
					{((can('View Applicant Profile') || isJobManager) && isInterview)
            ? (
              <Grid container spacing={16} alignItems="center">
                <Grid item xs={12} md={12} lg={12}>
                  <FormControl margin="none" error={!isEmpty(errors.interview_type)}>
                    <FormControlLabel
                      className={classes.switch}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={interview_type === 1 ? true : false}
                          onChange={(e) =>
                            this.selectOnChangePysical(interview_type == 1 ? 0 : 1, {
                              name: e.target.name
                            })}
                          value={interview_type === 1 ? true : false}
                          color="primary"
                          name="interview_type"
                          classes={{ switchBase: classes.switchBase }}
                        />
                      }
                      label="Physical Interview ?"
                    />
                    {!isEmpty(errors.interview_type) && (
                      <FormHelperText>{errors.interview_type}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            ) : null}
					{((can('View Applicant Profile') || isJobManager) &&
            isInterview &&
            interview_type == 1 ) ? (
              <Grid container spacing={16} alignItems="center">
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    required
                    id="interview_address"
                    name="interview_address"
                    label="Address"
                    fullWidth
                    autoComplete="interview_address"
                    value={isEmpty(interview_address) ? '' : interview_address}
                    onChange={this.onChange}
                    error={!isEmpty(errors.interview_address)}
                    helperText={errors.interview_address}
                    autoFocus
                    margin="none"
                  />
                </Grid>
              </Grid>
            ) : null}
					{((can('View Applicant Profile') || isJobManager) &&
            isInterview) ? (
              <Grid container spacing={16} alignItems="center">
                <Grid item xs={12} md={12} lg={12}>
                  <SelectField
                    label="Select iMMAPer for join interview *"
                    options={immapers}
                    value={immaper_invite}
                    onChange={this.selectOnChange}
                    placeholder="Select iMMAPer"
                    name="immaper_invite"
                    error={errors.immaper_invite}
                    required
                    isMulti={true}
                    fullWidth={true}
                    margin="none"
                    onDeleteManager={this.deleteManager}
                    obj={this}
                  />
                </Grid>
              </Grid>
            ) : null}
					{((can('View Applicant Profile') || isJobManager) && can('Send Interview Invitation') &&
            isInterview) ? (
              <Grid container spacing={16} alignItems="center">
                <Grid item xs={12} md={6} lg={4}>
                  <SelectField
                    label="Timezone"
                    options={timezones}
                    value={timezone}
                    onChange={this.selectOnChange}
                    placeholder="Select timezone"
                    isMulti={false}
                    name="timezone"
                    error={errors.timezone}
                    required
                    fullWidth={true}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <DatePickerField
                    label="Interview Date & Time"
                    name="interviewDate"
                    value={interviewDate}
                    onChange={this.dateOnChange}
                    error={errors.interviewDate}
                    margin="dense"
                    usingTime={true}
                    disablePast={interview_invitation_done ? false : true}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    className={classes.interviewBtn}
									onClick={this.openConfirmation}
									disabled={!isEmpty(errors)}
								>
									{interview_invitation_done ? 'Invitation Already Sent! ' : 'Send Invitation'}

									<Send fontSize="small" className={classes.addSmallMarginLeft} />{' '}
									{isLoading && (
										<CircularProgress className={classes.loading} size={22} thickness={5} style={{ color: secondaryColor }}/>
									)}
								</Button>
								<Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
					<DialogTitle>{'Confirmation'}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
                             {`Are you sure you want to invite ${full_name} for interview? `}
            </DialogContentText>
            <FormControl margin="none"  className={classes.interviewComment} >
                <FormControlLabel
                    className={classes.interviewCommentLabel}
                    labelPlacement="top"
                    control={
                      <TextField
                        onChange={this.onChange}
                        className={classes.interviewCommentText}
                        rows={5}
                        multiline
                        name="commentText"/>
                    }
                    label="Comments to share with the candidate"
                  />
                  {!isEmpty(errors.interview_type) && (
                    <FormHelperText>{errors.interview_type}</FormHelperText>
                  )}
            </FormControl>

					</DialogContent>
					<DialogActions>
            <Button variant="contained" color="secondary" onClick={this.closeConfirmation}>
              <Close fontSize="small" /> Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.blueIMMAP}
              disabled={isLoading}
              onClick={() =>
                this.sendInterview(
                  id,
                  job_status[jobStatusTab],
                  interviewDate,
                  timezone,
                  skype_id,
                  immaper_invite,
                  interview_type,
                  interview_address,
                  isEmpty(errors) && !isEmpty(timezone)
                )}
            >
              Confirm
              {isLoading ? (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              ) : (
                <Send fontSize="small" className={classes.addMarginLeft} />
              )}
            </Button>
          </DialogActions>
				        </Dialog>
	              <Dialog open={this.state.microsoft_login} onClose={this.closeMicrosoftLogin}>
					<DialogTitle>{'Microsoft Login'}</DialogTitle>
					<DialogContent>

						<DialogContentText id="alert-dialog-description">
            You will be redirected to Microsoft Outlook in order to login with your iMMAP account. Please confirm the invitation after being authenticated.
            </DialogContentText>

					</DialogContent>
					<DialogActions>
            <Button variant="contained" color="secondary" onClick={()=>{this.closeMicrosoftLogin()}}>
              <Close fontSize="small" /> Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.blueIMMAP}
                    onClick={() => {
                      window.open(this.state.microsoft_login_url, '_blank').focus();
                      this.closeMicrosoftLogin();
                    }}
            >
              Proceed
              {isLoading ? (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              ) : (
                <Send fontSize="small" className={classes.addMarginLeft} />
              )}
            </Button>
          </DialogActions>
				        </Dialog>

                </Grid>
              </Grid>
            ) : null}

          {(((can('View Applicant Profile') || isJobManager)) && seeInterviewScore) && (
            <Grid container spacing={16} alignItems="center" style={{ marginBottom: 8, marginTop: 8, }}>
              {(interview_invitation_done && immaper_invite) && (
                <Grid item xs={12} style={{ paddingBottom: 0 }}>
                  <Typography variant="subtitle1" color="primary" style={{ paddingTop: 8, borderTop: `2px solid ${primaryColor}` }}>Interview Score</Typography>
                </Grid>
              )}
              {interview_invitation_done &&
                ( this.props.interview_order ? interviewOrderedList : immaper_invite.map(data => job_managers.find(j => data.id === j.user_id) || data)).map((data, index) => {
                    return (
                      <Grid key={data.id} item xs={12} md={12} lg={12}>
                        <Grid item xs={12} md={12} lg={12}>
                          {showInterviewFiles  && <UploadButton
                            acceptedFileTypes={acceptedDocFiles}
                            handleUpload={(e, id) => uploadFiles(e, id)}
                            vipot={user.pivot}
                            user_interview_files={user_interview_files}
                            data={data}
                            error={errors.upload}
                            usersSign={usersSign}
                            disabled={isInterview ? false : seeInterviewScore}
                          />}
                          {(!showInterviewFiles && interviewDoneCheck) ?
                            <JobScore
                             interview_order={this.props.interview_order}
                             updateScores={this.updateScores}
                             user={user.job_user[0]}
                             user_id={user.job_user[0].id}
                             globalImpression = {globalImpression.filter(g => g.applicant_id === user.job_user[0].id)}
                             scores={scores.filter(s => s.applicant_id === user.job_user[0].id)}
                             questions={data.interview_questions || []}
                             manager={data}  /> : index === 0 ? <Typography variant="body1">You cannot add your scores before the interview date</Typography>: null}
                        </Grid>
                      </Grid>
                    )
                  })}
            </Grid>
          )}

        {((job_status[jobStatusTab].order >= interviewIndex) && (can('View Applicant Profile') || isJobManager) && interview_invitation_done && interviewDoneCheck && !showInterviewFiles) ? (
            <Grid container >
              <Grid item xs={12} md={12} lg={12} style={{display: "flex", flexDirection: "row", marginBottom: '20px'}}  justify='space-between'>
              {!isNaN(finalScore) ? <Button onClick={this.getReport}
                    align="right"
                    size="small"
                    variant="contained"
                    color="primary"
                     >
                  PDF Report
                </Button> : <p></p>}
                <Typography  align="right" color="primary" variant='body1' className={classes.finalScore} >FINAL SCORE : {' '} {isNaN(finalScore) ? 'PENDING' : `${finalScore} / 5`}</Typography>
              </Grid>
            </Grid>
          ) : null}

          {(can('View Applicant Profile') || isJobManager) ? (
            <Grid container spacing={8} alignItems="center">
              {job_standard_under_sbp_program && (
                <Grid item xs={12} md={12} lg={6}>
                  <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      bulkChange({
                        show_full_name: user.full_name,
                        show_start_date_availability: user.pivot.start_date_availability,
                        show_departing_from: user.pivot.departing_from,
                        openAvailability: true
                      })
                    }}
                    className={classes.greenBtn}
                  >
                    <PlaceIcon fontSize='small' className={classes.addSmallMarginRight} />
                    Availability & Current Location
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} md={12} lg={job_standard_under_sbp_program ? 6 : 12}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.openPopUpComment}
                >
                  <Komentar fontSize="small" className={classes.addSmallMarginRight} />
									View Comments (Total: {user.user_comments_count})
								</Button>
              </Grid>
              { (useTestStep == 1 && showApplicantTestLinkAndScore) &&
                <Grid item xs={12} md={12} lg={12}>
                  <ApplicantTestScore
                    profile={user.job_user[0]}
                    divider={<hr className={classes.divider} />}
                    isTestStep={isTestStep}
                    testStepPosition={testStepPosition}
                    allowEditTest={true}
                  />
                </Grid>
               }
            </Grid>
          ) : null}
        </CardContent>

        <Alert
          isOpen={this.state.openDialogCom}
          onClose={() => {
            this.setState({ openDialogCom: false });
          }}
          onAgree={() => {
            this.deleteComment();
          }}
          title="Delete Warning"
          text={'Are you sure to delete this comment ?'}
          closeText="Cancel"
          AgreeText="Yes"
        />

        <Dialog open={this.state.openPopCom} fullWidth onClose={() => this.setState({ openPopCom: false })}>
          <DialogTitle style={{ padding: '14px 24px 0px' }}>Comments</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() =>
              this.setState({
                openPopCom: false
              })}
          >
            <Close />
          </IconButton>
          <DialogContent className={classes.overflowVisible}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <TextField
                  label="Your Comment"
                  autoFocus
                  margin="normal"
                  fullWidth
                  name="commentValue"
                  value={this.state.commentValue}
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={this.saveComment} color="primary" variant="contained">
                  {this.state.isLoadingSaveCom && (
                    <CircularProgress className={classes.loading} size={22} thickness={5} />
                  )}
									Save
								</Button>
              </Grid>

              {this.state.LoadingComment ? (
                <Grid item xs={12}>
                  <div style={{ marginLeft: '50%' }}>Loading...</div>
                </Grid>
              ) : (
                  <Grid item xs={12}>
                    {this.state.commentExist.length > 0 &&
                      this.state.commentExist.map((comment) => {
                        return this.renderComment(comment)
                      })
                    }
                  </Grid>
                )}
            </Grid>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.openEditDialogCom}
          fullWidth
          onClose={() => this.setState({ openEditDialogCom: false })}
        >
          <DialogTitle>Edit Comments</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() =>
              this.setState({
                openEditDialogCom: false
              })}
          >
            <Close />
          </IconButton>
          <DialogContent className={classes.overflowVisible}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <TextField
                  label="Your Comment"
                  autoFocus
                  margin="normal"
                  fullWidth
                  name="editComment"
                  value={this.state.editComment}
                  onChange={this.onChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.saveEditComment} color="primary" variant="contained">
              {this.state.isLoadingReplyCom && (
                <CircularProgress className={classes.loading} size={22} thickness={5} />
              )}
							Save
						</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openReplyDialog}
          fullWidth
          onClose={() => this.setState({ openReplyDialog: false })}
        >
          <DialogTitle>Reply {this.state.replyTo}</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() =>
              this.setState({
                openReplyDialog: false
              })}
          >
            <Close />
          </IconButton>
          <DialogContent className={classes.overflowVisible}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  label="Your Comment"
                  autoFocus
                  margin="normal"
                  fullWidth
                  name="replyValue"
                  value={this.state.replyValue}
                  onChange={this.onChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.saveComment} color="primary" variant="contained">
              {this.state.isLoadingReplyCom && (
                <CircularProgress className={classes.loading} size={22} thickness={5} />
              )}
							Save
						</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.acceptedConfirmation} onClose={this.openCloseAcceptedConfirmation} disableBackdropClick={this.state.changeStatusLoading}>
          <DialogTitle>{'Confirmation'}</DialogTitle>
          <DialogContent>
            <DialogContentText>{`Are you sure to accept the ${full_name}?`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={this.openCloseAcceptedConfirmation} disabled={this.state.changeStatusLoading}>
              <Close fontSize="small" /> Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={async () => { await this.processStatusChange(); this.openCloseAcceptedConfirmation(); }}
              disabled={this.state.changeStatusLoading}
              className={classes.blueIMMAP}
            >
              { changeStatusLoading ? (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              ) : (
                <div>Confirm <Done style={{ verticalAlign: 'middle' }} fontSize="small" /></div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.open_confirmation_remove} onClose={this.closeConfirmationRemove}>
					<DialogTitle>Delete Applicant</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-remove-confirmation">
							Are sure to delete this applicant?
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
								this.deleteApplicant(user.pivot.job_id, user.pivot.user_id);
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
      </Card>
    );
  }
}

ApplicantCard.propTypes = {
  /** "job_status" prop: contain all job status data [Array] */
  job_status: PropTypes.array.isRequired,
  /** "jobStatusTab" prop: contain selected job status data [Number] */
  jobStatusTab: PropTypes.number.isRequired,
  /** "lastStepIndex" prop: contain last step index value (last step == accepted) inside job_status [Number] */
  lastStepIndex: PropTypes.number.isRequired,
  /** "interviewIndex" prop: contain interview step index value inside job_status [Number] */
  interviewIndex: PropTypes.number.isRequired,
  /** job_standard_under_sbp_program is a prop containing under sbp program for surge roster program alert (job/tor/job standard) */
  job_standard_under_sbp_program: PropTypes.bool.isRequired,
  /** "timezones" prop: contain timezones data [Array] */
  timezones: PropTypes.array,
  /** "immapers" prop: contain immapers data [Array] */
  immapers: PropTypes.array,
  /** "usersSign" prop: contain logged in user information */
  usersSign: PropTypes.object,
  /** "openCloseRequestContractForm" prop: function to open or close request contract modal */
  openCloseRequestContractForm: PropTypes.func.isRequired,
  /** "openCloseProfile" prop: function to open or close profile modal */
  openCloseProfile: PropTypes.func.isRequired,
  /** "jobStatusOnChange" prop: function to change job status */
  jobStatusOnChange: PropTypes.func.isRequired,
  /** "saveInterviewDate" prop: function to save interview date */
  saveInterviewDate: PropTypes.func.isRequired,
  /** "uploadFiles" prop: function to upload interview document */
  uploadFiles: PropTypes.func.isRequired,
  /** "sendInterview" prop: function to send interview invitation */
  sendInterview: PropTypes.func.isRequired,
  /** "getAPI" prop: function to call get api */
  getAPI: PropTypes.func.isRequired,
  /** "postAPI" prop: function to call post api */
  postAPI: PropTypes.func.isRequired,
  /** "deleteAPI" prop: function to call delete api */
  deleteAPI: PropTypes.func.isRequired,
  /** "addFlashMessage" prop: function to show flash message */
  addFlashMessage: PropTypes.func.isRequired,
  /** "changePhysicalInterview" prop: function to change physical interview or online interview */
  changePhysicalInterview: PropTypes.func.isRequired,
  /** bulkChange is a prop containing function to change applicant_lists redux state data */
  bulkChange: PropTypes.func.isRequired
}


/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  openCloseRequestContractForm,
  openCloseProfile,
  jobStatusOnChange,
  saveInterviewDate,
  uploadFiles,
  sendInterview,
  getAPI,
  postAPI,
  deleteAPI,
  addFlashMessage,
  changePhysicalInterview,
  deleteApplicant,
  bulkChange,
  getPDFInNewTab
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  jobStatusTab: state.applicant_lists.jobStatusTab,
  lastStepIndex: state.applicant_lists.lastStepIndex,
  interviewIndex: state.applicant_lists.interviewIndex,
  job_standard_under_sbp_program: state.applicant_lists.job_standard_under_sbp_program,
  timezones: state.options.timezones,
  immapers: state.options.immapers,
  usersSign: state.auth.user.data
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  addMarginTop: {
    'margin-top': '1em'
  },
  addMarginLeft: {
    marginLeft: theme.spacing.unit
  },
  addSmallMarginLeft: {
    'margin-left': '.25em'
  },
  addSmallMarginRight: {
    'margin-right': '.25em'
  },
  capitaliza: {
    'text-transform': 'capitalize'
  },
  noTextDecoration: {
    'text-decoration': 'none'
  },
  cardContent: {
    padding: '8px 16px',
    '&:last-child': {
      'padding-bottom': '8px'
    }
  },
  interviewCommentText: {
    width: '100%',
    marginLeft: 0
  },
  interviewComment: {
    width: '100%',
    marginLeft: 0,
    padding: 0,
    alignItems: 'left',
    alignContent: 'left',
    marginTop: 15
  },
  interviewCommentLabel: {
    textAlign: 'left',
    marginLeft: '0px',
    marginRight: '0px',
    alignItems: 'start'
  },
  card: {
    overflow: 'visible'
  },
  interviewBtn: {
    'background-color': '#0a477e',
		color: white,
    '&:hover': {
      'background-color': blueIMMAPHover
    }
  },
  loading: {
    'margin-left': theme.spacing.unit,
    'margin-right': theme.spacing.unit,
    color: white
  },
  interviewDivider: {
    'border-color': primaryColor,
    'border-width': '0.025em',
    'border-style': 'solid',
    marginBottom: '1em'
  },
  switchBase: {
    height: 'auto'
  },
  switch: {
    marginLeft: 0
  },
  coverLetter: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: primaryColor
    }
  },
  root: {
    minWidth: 275,
    minHeight: 200,
    'margin-right': '5px',
    'margin-bottom': '5px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  iconAdd: {
    color: '#043C6E',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  iconEdit: {
    color: 'transparent'
  },
  button: {
    '&:hover $iconAdd': {
      cursor: 'pointer'
    },
    '&:hover $iconDelete': {
      cursor: 'pointer'
    }
  },
  iconDelete: {
    color: '#043C6E',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  overflowVisible: {
    overflow: 'visible'
  },
  divider: {
    height: theme.spacing.unit * 2
  },
  rootlist: {
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit
	},
	blueIMMAP: {
		background: blueIMMAP,
		"&:hover": {
		  background: blueIMMAPHover,
		},
		marginLeft: theme.spacing.unit * 1
  },
  blue: {
    background: blue,
		"&:hover": {
		  background: blue,
		},
		marginLeft: theme.spacing.unit * 1
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
    color: 'black',
  },
  greenBtn: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
  },
  divider: {
		'border-color': primaryColor,
		'border-width': '0.025em',
		'border-style': 'solid'
	},
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicantCard));
