/** import React, React.Component, moment, classname, React Router, PropTypes and React Helmet */
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

/** import font awesome icons */
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** import react share and js-cookie */
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    LineShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon,
    WhatsappIcon,
    EmailIcon,
    LineIcon
} from 'react-share';
import Cookies from 'js-cookie';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

/** import configuration value, utlitiy helper and validation helper */
import { APP_NAME } from '../../config/general';
import { statusData } from '../../config/options';
import {
    white,
    primaryColor,
    primaryColorRed,
    primaryColorGreen,
    primaryColorBlue,
    secondaryColor,
    lightGrey,
    lighterGrey,
    green,
    greenHover,
    blueIMMAP,
    blueIMMAPRed,
    blueIMMAPGreen,
    blueIMMAPBlue,
    iMMAPSecondaryColor2022
} from '../../config/colors';
import {
  upload_cover_letter_url,
  delete_cover_letter_url,
  cover_letter_collection,
  acceptedDocFiles
} from '../../config/general';
import { checkUserIsHiringManager } from '../../utils/helper';
import isEmpty from '../../validations/common/isEmpty';

/** import custom components */
import DropzoneFileField from '../../common/formFields/DropzoneFileField';
import DatePickerField from '../../common/formFields/DatePickerField';

/** import permission checker */
import { isAuthenticated } from '../../permissions/isAuthenticated';
import { isVerified } from '../../permissions/isVerified';
import { isP11Completed } from '../../permissions/isP11Completed';
import { can } from '../../permissions/can';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
    addMarginRight: {
        'margin-right': '.75em'
    },
    addSmallMarginRight: {
        'margin-right': '.5em'
    },
    addSmallMarginLeft: {
        'margin-left': '.5em'
    },
    addMarginBottom: {
        'margin-bottom': '.75em'
    },
    addBigMarginTop: {
        'margin-top': '1em'
    },
    addBigMarginBottom: {
        'margin-bottom': '1em'
    },
    addSmallMarginBottom: {
        'margin-bottom': '.5em'
    },
    alignIcon: {
        'vertical-align': 'text-bottom'
    },
    primaryBg: {
        'background-color': primaryColor
    },
    whiteText: {
        color: white
    },
    whiteBg: {
        'background-color': white
    },
    jobDate: {
        'background-color': lightGrey
    },
    lighterGreyBg: {
        'background-color': lighterGrey,
        color: secondaryColor
    },
    socmedIcon: {
        display: 'inline-block',
        'margin-right': '.25em',
        'vertical-align': 'middle',
        '&:hover': {
            cursor: 'pointer'
        },
        '&:focus': {
            outline: 'none'
        }
    },
    socmedCard: {
        'background-color': 'rgb(240,241,242)',
        height: '100%'
    },
    greenBtn: {
        background: green,
        color: white,
        '&:hover': {
            background: greenHover
        }
    },
    languageChip: {
        'background-color': blueIMMAP,
        color: white
    },
    loading: {
        'margin-left': theme.spacing.unit,
        'margin-right': theme.spacing.unit,
        color: white
    },
    textCenter: {
        textAlign: 'center'
    },
    number_of_applicant: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
    chip: {
        background: 'rgba(' + primaryColorRed + ', ' + primaryColorGreen + ', ' + primaryColorBlue + ', 0.2)',
        color: primaryColor
    },
    line: {
        borderTop: '1px solid ' + primaryColor,
        borderBottom: 'none'
    },
    share: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 700
    },
    fontAwesome: {
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            margin: '0 auto ' + theme.spacing.unit + 'px auto'
        }
    },
    jobContainer: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    noTextDecoration:{
        textDecoration: 'none'
    },
    blueIMMAP: {
      'background-color': blueIMMAP,
      color: white,
      '&:hover': {
        'background-color': '#005A9B'
      }
    },
    sbpColor: { color: blueIMMAP },
    sbpCampaignColor: { color: iMMAPSecondaryColor2022 },
    sbpBg: { background: blueIMMAP },
    sbpCampaignBg: { background: iMMAPSecondaryColor2022 },
    sbpChip: {
        background: 'rgba(' + blueIMMAPRed + ', ' + blueIMMAPGreen + ', ' + blueIMMAPBlue + ', 0.2)',
        color: blueIMMAP
    },
    sbpLine: {
      borderTop: '1px solid ' + blueIMMAP,
      borderBottom: 'none'
    },
    sbpCampaignLine: {
      borderTop: '1px solid ' + iMMAPSecondaryColor2022,
      borderBottom: 'none'
    },
});

/**
 * JobDetail is a component to show job details page
 *
 * @name JobDetail
 * @component
 * @category Page
 * @subcategory Job
 *
 */
class JobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            requirements: '',
            responsibilities: '',
            terms_and_conditions: '',
            status: '',
            opening_date: moment(new Date()),
            closing_date: moment(new Date()).add(1, 'M'),
            contract_start: moment(new Date()),
            contract_end: moment(new Date()).add(1, 'M'),
            max_salary:0,
            min_salary:0,
            country_id: '',
            country: {},
            languages: [],
            manager: [],
            sub_sections: [],
            duty_station: '',
            contract_length: '',
            jobStatus: '',
            organization: '',
            duration: '',
            include_cover_letter: 0,
            show_contract: 0,
            show_salary: 0,
            number_aplicant: 0,
            hasApplied: false,
            isLoading: false,
            open_confirmation: false,
            open_cover_letter_dialog: false,
            cover_letter: {},
            errors: {},
            isAssign: false,
            sbpJob: false,
            sbpCampaign: false,
            rosterSkillset: '',
            isEligible: false,
            applyBtnText: 'Apply',
            openSbpJobConfirmation: false,
            start_date_availability: moment(new Date()).subtract(1, 'd'),
            departing_from: '',
            cluster: '',
            cluster_seconded: ''
        };

        this.applyJob = this.applyJob.bind(this);
        this.applyWithCoverLetter = this.applyWithCoverLetter.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.openConfirmation = this.openConfirmation.bind(this);
        this.openCoverLetterDialog = this.openCoverLetterDialog.bind(this);
        this.closeConfirmation = this.closeConfirmation.bind(this);
        this.closeCoverLetterDialog = this.closeCoverLetterDialog.bind(this);
        this.isValid = this.isValid.bind(this);
        this.setApplyJobId = this.setApplyJobId.bind(this);
        this.checkAvailability = this.checkAvailability.bind(this);
        this.toggleSbpJobConfirmation = this.toggleSbpJobConfirmation.bind(this);
        this.rosterRecruitmentEligibilityCheck = this.rosterRecruitmentEligibilityCheck.bind(this);
    }

    /**
     * componentDidMount is a lifecycle function called where the component is mounted
     */
    componentDidMount() {
        this.props
            .getAPI('/api/jobs/' + this.props.match.params.id)
            .then((res) => {
                const {
                    title,

                    number_aplicant,
                    status,
                    opening_date,
                    closing_date,
                    contract_start,
                    contract_end,
                    country_id,
                    country,
                    languages,
                    sub_sections,
                    hasApplied,
                    tor,
                    contract_length,
                    include_cover_letter,
                    show_contract,
                    show_salary,
                    closed
                } = res.data.data;

                const isHiringManager = checkUserIsHiringManager(this.props.user, res.data.data)

                let sbpJob = false; 
                let sbpCampaign = false;
                // check if the job is under sbp program and the current user is accepted
                if (!isEmpty(tor.job_standard)) {
                  if (!isEmpty(tor.job_standard.under_sbp_program)) {
                    if (tor.job_standard.under_sbp_program === "yes" && isEmpty(this.props.user)) {
                      this.props.addFlashMessage({
                        type: 'info',
                        text: 'Kindly please login with your account first'
                      });
                      this.props.history.push("/login");
                      throw "Please Login";
                    }

                    if (tor.job_standard.under_sbp_program === "yes") {   
                      sbpJob = true;
                    }

                    if (tor.job_standard.sbp_recruitment_campaign == "yes") {
                      sbpCampaign = true;
                      this.rosterRecruitmentEligibilityCheck(tor.skillset);
                    }
                  }
                }
                /*
                if (!isHiringManager && (!moment(closing_date).isAfter(new Date()))) {
                  this.props.history.push('/jobs');
                }*/

                let emailmanager = res.data.data.job_manager.map((em) => {
                    return { email: em.email, name: em.name };
                });

                const modifyLanguage = languages.map((language) => {
                    return language.name;
                });

                let applyBtnText = 'Apply';

                if (sbpJob && !hasApplied) {
                  applyBtnText = 'Express Interest';
                }
                if (sbpJob && hasApplied) {
                  applyBtnText = 'Interested';
                }
                if (!sbpJob && hasApplied) {
                  applyBtnText = 'Applied';
                }
                if (statusData[status]['value'] == 3) {
                  applyBtnText = 'Closed';
                }

                this.setState({
                    title,
                    number_aplicant,
                    languages: modifyLanguage,
                    country: !isEmpty(country) ? country.name : '',
                    opening_date: moment(opening_date),
                    closing_date: moment(closing_date),
                    contract_start: moment(contract_start),
                    contract_end: moment(contract_end),
                    sub_sections,
                    hasApplied,
                    duty_station: tor.duty_station,
                    duration: tor.duration.name,
                    min_salary: tor.min_salary,
                    max_salary: tor.max_salary,
                    contract_length: contract_length + ' Months',
                    status: tor.relationship,
                    jobStatus: statusData[status],
                    organization: tor.organization || 'iMMAP',
                    manager: emailmanager,
                    include_cover_letter,
                    show_contract,
                    show_salary,
                    isAssign: isHiringManager,
                    closed,
                    sbpJob,
                    sbpCampaign,
                    rosterSkillset: !isEmpty(tor.skillset) ? tor.skillset : '',
                    applyBtnText,
                    cluster: tor.cluster,
                    cluster_seconded: tor.cluster_seconded
                }, () => {
                  if (!hasApplied) {
                    if (!isEmpty(Cookies.get('apply-job-cover-letter')) && !isEmpty(Cookies.get('isNewUser')) && isEmpty(Cookies.get('apply-job-id'))) {
                      if (Cookies.get('apply-job-cover-letter') === '1' && Cookies.get('isNewUser') === 'true') {
                        Cookies.remove('apply-job-cover-letter');
                        Cookies.remove('isNewUser');
                        this.openCoverLetterDialog();
                      }
                    }
                  }
                });
            })
            .catch((err) => {
                if (typeof err.response !== 'undefined') {
                    if (typeof err.response.status !== 'undefined') {
                        if (err.response.status == 404) {
                            this.props.addFlashMessage({
                                type: 'error',
                                text: 'Sorry, the job posting is no longer accessible'
                            });
                            setTimeout(() => {
                                this.props.history.push('/jobs');
                            }, 1000);
                        }
                    }
                }
            });
    }

    /**
     * rosterRecruitmentEligibilityCheck is a function to check if the user is eligible to applied to roster recruitment or not
     * @param {(IM|M&E|GIS)} skillset - roster skillset
     */
    rosterRecruitmentEligibilityCheck(skillset) {
      this.props.getAPI(`/api/roster-recruitment-eligibility-check?skillset=${encodeURIComponent(skillset)}`)
        .then(res => {
          this.setState({ isEligible: res.data.data })
        })
        .catch(err => {
          this.setState({ isEligible: false })
        })
    }

    /**
     * checkAvailability is a functino to validate availability pop up
     */
    checkAvailability() {
      let {start_date_availability, departing_from, ...errors} = {...this.state.errors};

      if (isEmpty(this.state.start_date_availability)) {
        errors.start_date_availability = "Your earliest starting date for this deployment is required";
      } else if (moment(this.state.start_date_availability).isBefore(moment(new Date()))) {
        errors.start_date_availability = "Kindly please change your earliest starting date for this deployment"
      }

      if (isEmpty(this.state.departing_from)) {
        errors.departing_from = "Your city and country of departure is required"
      }

      this.setState({ errors })
    }

    /**
     * toggleSbpJobConfirmation is a function to toggle express interest pop up confirmation
     */
    toggleSbpJobConfirmation() {
      this.setState({ openSbpJobConfirmation: this.state.openSbpJobConfirmation ? false : true }, () => {
        if (this.state.openSbpJobConfirmation) {
          this.checkAvailability();
        } else {
          const { start_date_availability, departing_from, ...errors} = {...this.state.errors};
          this.setState({
            start_date_availability: moment(new Date()).subtract(1, 'd'),
            departing_from: '',
            errors
          });
        }
      })
    }

    /**
     * setApplyJobId is a function to save job id in the Cookies
     */
    setApplyJobId(jobId = this.props.match.params.id) {
      Cookies.set('apply-job-id', jobId);
      Cookies.set('apply-job-cover-letter', this.state.include_cover_letter)
    }

    /**
     * checkRequirement is a function to check if the user can applying a job or not
     * @returns {boolean}
     */
    checkRequirement() {
      const { sbpJob, sbpCampaign, isEligible } = this.state
      if (isAuthenticated()) {
        if (isVerified()) {
            if (isP11Completed()) {
                if ((can('Apply Job') && !sbpJob && !sbpCampaign) ||
                    (can('Apply Job') && sbpJob && !sbpCampaign && this.props.user.isSbpRosterMember) ||
                    (can('Apply Job') && !sbpJob && sbpCampaign && isEligible)) {
                    return true;
                } else if (can('Apply Job') && !sbpJob && sbpCampaign && !isEligible) {
                  return false;
                } else {
                    this.props.addFlashMessage({
                        type: 'error',
                        text: "You don't have permission to apply the job"
                    });
                    return false;
                }
            } else {
                this.setApplyJobId();
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'Please fill the form'
                });
                this.props.history.push('/p11');
                return false;
            }
        } else {
            this.setApplyJobId();
            this.props.addFlashMessage({
                type: 'error',
                text: 'Please verify your email first'
            });
            this.props.history.push('/not-verified');
            return false;
        }
      } else {
          this.setApplyJobId();
          this.props.addFlashMessage({
              type: 'error',
              text: 'Please login first'
          });
          this.props.history.push('/login');
          return false;
      }
    }

    /**
     * applyJob is a function to apply a job
     */
    async applyJob() {
        const metRequirement = await this.checkRequirement();
        if (metRequirement) {
            this.setState({ isLoading: true }, () => {
              let payload = { job_id: this.props.match.params.id };
              let applyJobURL = '/api/apply-job';

              if (this.state.sbpCampaign) {
                payload.skillset = this.state.rosterSkillset
                applyJobURL = `/api/apply-roster-from-job`;
              }

              if (this.state.sbpJob) {
                payload.start_date_availability = this.state.start_date_availability;
                payload.departing_from = this.state.departing_from;
              }

              this.props
                .postAPI(applyJobURL, payload)
                .then((res) => {
                    const { status, message, data } = res.data;
                    this.setState({ isLoading: false }, () => {
                        if (status === 'success') {
                          if (!this.state.sbpCampaign) {
                            this.props.history.push('/job-applications');
                            this.props.addFlashMessage({
                                type: status,
                                text: message
                            });
                          } else {
                            this.props.history.push(`/profile?roster=${data.roster_process_id}`)
                            this.props.addFlashMessage({
                              type: 'success',
                              text: message
                          });
                          }

                          return this.pr
                        }
                    });
                })
                .catch((err) => {
                    let msg = {
                        type: 'error',
                        text: 'There is an error while applying your job'
                    };

                    if(!isEmpty(err.response) && typeof err.response !== 'undefined'){
                        if(!isEmpty(err.response.status) && typeof err.response.status !== 'undefined'){
                            if (err.response.status === 500) {
                                msg.text = err.response.data.message;
                            }
                        }
                    }

                    this.props.addFlashMessage(msg);
                    this.setState({ isLoading: false, open_confirmation: false });
                });
            });
        } else {
          if (this.state.sbpJob) {
            return this.props.addFlashMessage({ type: 'error', text: `You're not eligible to apply for this position`, })
          }
          if (this.state.sbpJob) {
            return this.props.addFlashMessage({ type: 'error', text: `You're not eligible to apply for this position`, })
          }
          return this.props.addFlashMessage({ type: 'error', text: `Sorry, you can't apply this job`})
        }
    }

    /**
     * applyWithCoverLetter is a function to apply a job using cover letter
     */
    async applyWithCoverLetter() {

        const metRequirement = await this.checkRequirement();
        if (metRequirement) {
            this.setState({ isLoading: true }, () => {
                this.props
                    .postAPI('/api/apply-job-with-cover-letter', {
                        job_id: this.props.match.params.id,
                        cover_letter_url: this.state.cover_letter.file_url
                    })
                    .then((res) => {
                        const { status, message } = res.data;
                        this.setState({ isLoading: false }, () => {
                            if (status === 'success') {
                                this.props.history.push('/job-applications');
                                this.props.addFlashMessage({
                                    type: status,
                                    text: message
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        let msg = {
                            type: 'error',
                            text: 'There is an error while applying your job'
                        };

                        if (err.response.status === 500) {
                            msg.text = err.response.data.message;
                        }

                        this.props.addFlashMessage(msg);
                        this.setState({ isLoading: false, open_cover_letter_dialog: false });
                    });
            });
        } else {
          if (this.state.sbpJob || this.state.sbpCampaign) {
            return this.props.addFlashMessage({ type: 'error', text: `You're not eligible to apply for this position`, })
          }
          return this.props.addFlashMessage({ type: 'error', text: `Sorry, you can't apply this job`})
        }
    }

    /**
     * isValid is a function to check error data before calling api to applying a job
     * @returns {boolean}
     */
    isValid() {
        if (this.state.include_cover_letter == 1) {
            if (isEmpty(this.state.cover_letter)) {
                this.setState({ errors: { cover_letter: 'Cover Letter is required' } });
                return false;
            } else {
                this.setState({ errors: {} });
                return true;
            }
        } else {
            this.setState({ errors: {} });
            return true;
        }
    }

    /**
     * openConfirmation is a function to open confirmation modal when applying a job
     */
    async openConfirmation() {
        const metRequirement = await this.checkRequirement();
        if (metRequirement) {
            this.setState({ open_confirmation: true });
        } else {
          if (this.state.sbpJob || this.state.sbpCampaign) {
            return this.props.addFlashMessage({ type: 'error', text: `You're not eligible to apply for this position`, })
          }
          this.props.addFlashMessage({ type: 'error', text: `Sorry, you can't apply this job`})
        }
    }

    /**
     * openCoverLetterDialog is a function to open cover letter modal when applying a job that cover letter is required
     */
    async openCoverLetterDialog() {
        const metRequirement = await this.checkRequirement();
        if (metRequirement) {
            this.setState({ open_cover_letter_dialog: true }, () => this.isValid());
        } else {
          if (this.state.sbpJob || this.state.sbpCampaign) {
            return this.props.addFlashMessage({ type: 'error', text: `You're not eligible to apply for this position`, })
          }
          this.props.addFlashMessage({ type: 'error', text: `Sorry, you can't apply this job`})
        }
    }

    /**
     * closeConfirmation is a function to close confirmation modal
     */
    closeConfirmation() {
        if (!this.state.isLoading) {
            this.setState({ open_confirmation: false });
        }
    }

    /**
     * closeCoverLetterDialog is a function to close cover letter modal
     */
    closeCoverLetterDialog() {
        if (!this.state.isLoading) {
            this.setState({ open_cover_letter_dialog: false });
        }
    }

    /**
     * onUpload is a function to upload cover letter
     * @param {string} name
     * @param {Object[]} files - files data uploaded from DropzoneFileField
     */
    onUpload(name, files) {
        if (!isEmpty(files)) {
            const { file_id, file_url, mime, filename } = files[0];
            this.setState({ cover_letter: { file_id, file_url, mime, filename } }, () => {
                this.isValid();

                this.props.addFlashMessage({
                    type: 'success',
                    text: 'Your file succesfully uploaded'
                });
            });
        } else {
            this.setState({ cover_letter: {} }, () => this.isValid());
        }
    }

    /**
     * onDelete is a function to delete cover letter that has been uploaded
     * @param {string}    name
     * @param {string}    deleteURL - api url to delete the cover letter
     * @param {Object[]}  files - files data uploaded from DropzoneFileField
     * @param {nummber}   deletedFileId - file id to be deleted
     */
    onDelete(name, deleteURL, files, deletedFileId) {
        if (isEmpty(files)) {
            this.props
                .postAPI(deleteURL, {
                    id: deletedFileId
                })
                .then((res) => {
                    this.props.addFlashMessage({
                        type: 'success',
                        text: res.data.data.message ? res.data.data.message : 'Your file succesfully deleted'
                    });

                    this.setState({ cover_letter: {} }, () => this.isValid());
                })
                .catch((err) => {
                    this.props.addFlashMessage({
                        type: 'error',
                        text: 'There is an error while deleting Your file'
                    });
                });
        } else {
            this.setState({ cover_letter: files }, () => this.isValid());
        }
    }

    render() {
        const { classes, user } = this.props;
        let { isLoading, include_cover_letter, show_contract,
          show_salary, min_salary, max_salary, cover_letter,
          isAssign, sbpJob, applyBtnText, start_date_availability,
          openSbpJobConfirmation, departing_from, sbpCampaign,
          rosterSkillset, errors, cluster, cluster_seconded
        } = this.state;

        const canViewApplicant = (isAssign || can('Set as Admin')) && user.isIMMAPER;

        const gridsize = (canViewApplicant) ? 2 : 4;

        const lineClass = classname(sbpJob ? classes.sbpLine : sbpCampaign ? classes.sbpCampaignLine : classes.line, classes.addMarginBottom, classes.addBigMarginTop);
        const labelClass = sbpJob ? classes.sbpColor : sbpCampaign ? classes.sbpCampaignColor : '';

        const clusterInfo = cluster_seconded ? cluster_seconded : cluster;

        return (
            <div>
                <Helmet>
                    <title>
                        {APP_NAME} - {this.state.title}
                    </title>
                    <meta name="description" content={APP_NAME + ' Job ' + this.state.title} />
                </Helmet>

                <Card className={classes.jobContainer}>
                    <CardContent>
                        <Grid container spacing={8}>
                            <Grid item xs={12} md={8} lg={8}>
                                <Typography
                                  variant="h5"
                                  component="h1"
                                  color="primary"
                                  className={sbpJob ? classname(classes.title, classes.sbpColor) : sbpCampaign ? classname(classes.title, classes.sbpCampaignColor) : classes.title}
                                >
                                    {this.state.title}
                                </Typography>
                            </Grid>
                            {
                                (canViewApplicant) ? (
                                    <Grid item xs={12} md={this.state.closed ? 4 : 2}>
                                      <Link to={sbpCampaign ? `/roster?skillset=${encodeURIComponent(rosterSkillset)}` : '/jobs/'+this.props.match.params.id+'/applicants'} target="_blank" className={classes.noTextDecoration}>
                                          <Button
                                              size="small"
                                              fullWidth
                                              variant="contained"
                                              color="primary"
                                              className={classes.blueIMMAP}
                                          >
                                          <RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} />
                                          View Applicants
                                          </Button>
                                      </Link>
                                    </Grid>
                                ) : null
                            }

                            {!this.state.closed ?
                            <Grid item xs={12} md={gridsize} lg={gridsize}>
                                <Button
                                    disabled={(this.state.hasApplied || this.state.jobStatus.value == 3) ? true : false}
                                    variant="contained"
                                    fullWidth
                                    color="primary"
                                    size="small"
                                    onClick={include_cover_letter == 1 ? this.openCoverLetterDialog : sbpJob ? this.toggleSbpJobConfirmation : this.openConfirmation}
                                    type="submit"
                                >
                                  {applyBtnText}
                                </Button>
                            </Grid> : null}
                        </Grid>
                        {canViewApplicant || !sbpJob && (
                          <hr className={lineClass} />
                        )}
                        {canViewApplicant || !sbpJob && (
                          <Grid container spacing={16} alignItems="baseline">
                              <Grid item xs={12} md={8} lg={8}>
                                {canViewApplicant ?
                                  <Typography
                                    variant="subtitle2"
                                    color="primary"
                                    className={sbpJob ?
                                      classname(classes.number_aplicant, classes.sbpColor) :
                                      sbpCampaign ? classname(classes.number_aplicant, classes.sbpCampaignColor) :
                                      classes.number_of_applicant
                                    }
                                  >
                                    Number of Applicant : {this.state.number_aplicant}
                                  </Typography>
                                : null}
                              </Grid>
                              <Grid item xs={12} md={4} lg={4}>
                                {!sbpJob && (
                                  <Typography variant="subtitle2" color="primary" className={classes.share}>
                                      Share :
                                      <FacebookShareButton
                                          className={classname(classes.socmedIcon, classes.addSmallMarginLeft)}
                                          url={window.location.href}
                                      >
                                          <FacebookIcon size={32} round />
                                      </FacebookShareButton>
                                      <LinkedinShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <LinkedinIcon size={32} round />
                                      </LinkedinShareButton>
                                      <TwitterShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <TwitterIcon size={32} round />
                                      </TwitterShareButton>
                                      <WhatsappShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <WhatsappIcon size={32} round />
                                      </WhatsappShareButton>
                                      <TelegramShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <TelegramIcon size={32} round />
                                      </TelegramShareButton>
                                      <LineShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <LineIcon size={32} round />
                                      </LineShareButton>
                                      <EmailShareButton className={classes.socmedIcon} url={window.location.href}>
                                          <EmailIcon size={32} round />
                                      </EmailShareButton>
                                  </Typography>
                                )}
                              </Grid>
                          </Grid>
                        )}
                        <hr className={lineClass} />
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
                                  { sbpCampaign == false && 
                                    <>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                                Country
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {!isEmpty(this.state.country) ? this.state.country : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={3}>
                                            <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                                Duty Station
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {!isEmpty(this.state.duty_station) ? this.state.duty_station : ''}
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
                                            {!isEmpty(this.state.duration) ? this.state.duration : ''}
                                        </Typography>
                                    </Grid>
                                   }
                                    <Grid item xs={6} sm={6} md={3}>
                                        <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                            Status
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {!isEmpty(this.state.status) ? this.state.status : ''}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                            Organization
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {!isEmpty(this.state.organization) ? this.state.organization : 'iMMAP'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                            Opening Date
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {moment(this.state.opening_date).format('DD MMMM YYYY')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                            Closing Date
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {moment(this.state.closing_date).format('DD MMMM YYYY')}
                                        </Typography>
                                    </Grid>
                                    {show_contract === 1 || sbpJob ?
                                        <Grid item xs={6} sm={6} md={3}>
                                            <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                                Contract Start
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {moment(this.state.contract_start).format('DD MMMM YYYY')}
                                            </Typography>
                                        </Grid> : null
                                    }

                                    {show_contract === 1 || sbpJob ?
                                        <Grid item xs={6} sm={6} md={3}>
                                            <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                                Contract End
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {moment(this.state.contract_end).format('DD MMMM YYYY')}
                                            </Typography>
                                        </Grid> : null
                                    }

                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={3}
                                lg={2}
                                classes={{ 'align-items-xs-center': 'text-align:center' }}
                            >
                                <Grid container spacing={8}>
                                   { sbpJob && !isEmpty(clusterInfo) &&
                                         <Grid item xs={6} sm={6} md={12}>
                                            <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                                Cluster
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                { clusterInfo }
                                            </Typography>
                                        </Grid>
                                    }
                                    {show_contract === 1 && !sbpJob ?
                                        <Grid item xs={6} sm={6} md={12}>
                                            <Typography
                                                variant="subtitle1"
                                                component="label"
                                                color="primary"
                                                className={labelClass}
                                            >
                                                Contract Length
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {!isEmpty(this.state.contract_length) ? this.state.contract_length : ''}
                                            </Typography>
                                        </Grid> : null
                                    }

                                    {sbpJob &&
                                        <Grid item xs={6} sm={6} md={12}>
                                            <Typography
                                                variant="subtitle1"
                                                component="label"
                                                color="primary"
                                                className={labelClass}
                                            >
                                                Contract Length
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                {!isEmpty(this.state.contract_length) ? this.state.contract_length : ''} - {!isEmpty(this.state.duration) ? this.state.duration : ''}
                                            </Typography>
                                        </Grid>
                                    }

                                </Grid>

                            </Grid>
                        </Grid>
                        <hr className={lineClass} />
                        <Grid container spacing={8}>
                            <Grid item xs={8}>
                                <Typography variant="subtitle1" component="label" color="primary" className={labelClass}>
                                    Languages :{' '}
                                    {this.state.languages.map((language, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                className={classname(
                                                    classes.languageChip,
                                                    classes.addSmallMarginRight

                                                )}
                                                label={language}
                                                color="secondary"
                                            />
                                        );
                                    })}
                                </Typography>
                            </Grid>
                            {(show_salary === 1 && canViewApplicant) ?
                                <Grid item xs={4} >
                                    <Typography  variant="subtitle1" component="label" color="primary" align="right" className={labelClass}>
                                        Fees : USD {min_salary} - USD {max_salary}
                                    </Typography>
                                </Grid> : null
                            }

                        </Grid>
                        <hr className={lineClass} />

                        {canViewApplicant &&
                        !isEmpty(this.state.manager) ? (
                            <Grid container spacing={8}>
                                <Grid item xs={12}>

                                    <FontAwesomeIcon
                                        icon={faUsers}
                                        size="lg"
                                        className={classes.fontAwesome}
                                        style={{ paddingRight: 10, color: sbpJob ? blueIMMAP : sbpCampaign ? iMMAPSecondaryColor2022 : primaryColor }}
                                    />

                                    {this.state.manager.map((em, index) => {
                                        let nm = em.email + ' - (' + em.name + ')';
                                        return (
                                            <Chip
                                                key={index}
                                                className={classname(
                                                    sbpJob ? classes.sbpChip : classes.chip,
                                                    classes.addSmallMarginRight,
                                                    classes.addSmallMarginBottom
                                                )}
                                                label={nm}
                                                color="primary"
                                            />
                                        );
                                    })}

                                </Grid>
                            </Grid>
                        ) : null}
                        {(canViewApplicant &&
                        !isEmpty(this.state.manager)) ? (
                            <hr className={lineClass} />
                        ) : null}
                        <Grid container spacing={16} justify="center">

                            <Grid item xs={12}>

                                {!isEmpty(this.state.sub_sections) ?
                                    this.state.sub_sections.map((sub_section, index) => {
                                        return (
                                            <div key={'sub-section' + index}>
                                                <Typography variant="h6" component="h6" color="primary" className={labelClass}>
                                                    {sub_section.sub_section}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    dangerouslySetInnerHTML={{
                                                        __html: sub_section.sub_section_content
                                                    }}
                                                />
                                            </div>
                                        );
                                    }) : null}

                            </Grid>

                        </Grid>
                        <hr className={lineClass} />
                        {!this.state.closed ?
                        <Button
                            disabled={(this.state.hasApplied) ? true : false}
                            variant="contained"
                            fullWidth
                            color="primary"
                            onClick={include_cover_letter == 1 ? this.openCoverLetterDialog : sbpJob ? this.toggleSbpJobConfirmation : this.openConfirmation}
                            type="submit"
                        >
                            {applyBtnText} {' '}
                        </Button> : null}
                    </CardContent>
                </Card>

                <Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
                    <DialogTitle>{'Confirmation'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure to apply {this.state.title} vacancy ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.closeConfirmation}
                            color="secondary"
                            variant="contained"
                            disabled={isLoading ? true : false}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={include_cover_letter == 1 ? this.applyWithCoverLetter : this.applyJob}
                            color="primary"
                            autoFocus
                            variant="contained"
                            disabled={isLoading}
                        >
                            {applyBtnText}
                            {isLoading ? <CircularProgress size={22} thickness={5} className={classes.loading} /> : null}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.open_cover_letter_dialog} onClose={this.closeCoverLetterDialog}>
                    <DialogTitle>{'Apply ' + this.state.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please upload your cover letter to apply {this.state.title} vacancy.
                        </DialogContentText>
                        <DropzoneFileField
                            name="cover_letter"
                            label="Cover Letter"
                            onUpload={this.onUpload}
                            onDelete={this.onDelete}
                            collectionName={cover_letter_collection}
                            apiURL={upload_cover_letter_url}
                            deleteAPIURL={delete_cover_letter_url}
                            isUpdate={false}
                            filesLimit={1}
                            acceptedFiles={acceptedDocFiles}
                            gallery_files={!isEmpty(cover_letter) ? [ cover_letter ] : []}
                            error={errors.cover_letter}
                            fullWidth={false}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.closeCoverLetterDialog}
                            color="secondary"
                            variant="contained"
                            disabled={isLoading ? true : false}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.openConfirmation}
                            color="primary"
                            autoFocus
                            variant="contained"
                            disabled={!isEmpty(errors.cover_letter)}
                        >
                            {applyBtnText}

                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openSbpJobConfirmation} onClose={this.toggleSbpJobConfirmation}>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    this.applyJob();
                  }}>
                    <DialogTitle>{'Express Interest for ' + this.state.title}</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1">
                        Thank you for expressing your interest for this Surge Roster Alert. To finalize your application, please indicate the following:
                      </Typography>
                      <DatePickerField
                        label="Your earliest starting date for this deployment: "
                        name="start_date_availability"
                        value={
                          isEmpty(start_date_availability) ? (
                            moment(new Date()).subtract('1', 'd')
                          ) : (
                            moment(start_date_availability)
                          )
                        }
                        onChange={(e) =>
                          this.setState({ [e.target.name]: moment(e.target.value).format('YYYY-MM-DD') }, () => this.checkAvailability())
                        }
                        error={errors.start_date_availability}
                      />
                      <TextField
                        id="departing_from"
                        label="Your city and country of departure: "
                        name="departing_from"
                        value={departing_from}
                        onChange={(e) => this.setState({ [e.target.name]: e.target.value }, () => this.checkAvailability())}
                        fullWidth
                        error={!isEmpty(errors.departing_from)}
                        helperText={errors.departing_from}
                      />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.toggleSbpJobConfirmation}
                            color="secondary"
                            variant="contained"
                            disabled={isLoading ? true : false}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            autoFocus
                            variant="contained"
                            type="submit"
                            disabled={(!isEmpty(errors.start_date_availability) || !isEmpty(errors.departing_from) || isLoading) ? true : false}
                        >
                            Confirm
                            {isLoading ? <CircularProgress size={22} thickness={5} className={classes.loading} /> : null}
                        </Button>
                    </DialogActions>
                  </form>
                </Dialog>
            </div>
        );
    }
}

JobDetail.propTypes = {
  /**
   * classes is an object containing styles of this component, it's using withStyles features from material ui v3.
   *
   * (see the source file to see more information about the styles)
   */
  classes: PropTypes.object.isRequired,
  /**
   * user is a prop containing logged in user data
   */
  user: PropTypes.object.isRequired,
  /**
   * history is a prop containing react router history
   */
  history: PropTypes.object.isRequired,
  /**
   * match is a prop containing react router match data
   */
  match: PropTypes.object.isRequired,
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
    user: state.auth.user
});

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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobDetail));

