/** import React, PropTypes, React Helmet and js-cookie */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';

/** import React Redux ant it's actions  */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { getNationalities, getP11Countries, getLanguages, getOrganizations } from '../../redux/actions/optionActions';
import { setLoading, setP11Status, getDisclaimerStatus } from '../../redux/actions/p11Actions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { refreshAuthUser } from '../../redux/actions/authActions';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EyeIcon from '@material-ui/icons/RemoveRedEye';

/** import custom components */
import LoadingSpinner from '../../common/LoadingSpinner';
import ProfileModal from '../../common/ProfileModal';
import Alert from '../../common/Alert';
import Success from '../../common/Success';
import ModalLoadingSpinner from '../../common/ModalLoadingSpinner';
import Disclaimer from './disclaimer/disclaimer';

/** import configuration value and validation helper */
import { APP_NAME } from '../../config/general';
import isEmpty from '../../validations/common/isEmpty';

/** import React Loadable and Loadable Components */
import Loadable from 'react-loadable';
const P11Form1 = Loadable({
  loader: () => import('./P11Form1'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form2 = Loadable({
  loader: () => import('./P11Form2'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form3 = Loadable({
  loader: () => import('./P11Form3'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form4 = Loadable({
  loader: () => import('./P11Form4'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form5 = Loadable({
  loader: () => import('./P11Form5'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form6 = Loadable({
  loader: () => import('./P11Form6'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form7 = Loadable({
  loader: () => import('./P11Form7'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Form8 = Loadable({
  loader: () => import('./P11Form8'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  loading: {
    color: 'white',
    animationDuration: '550ms',
    left: 0
  },
  spinner: {
    display: 'block',
    position: 'absolute',
    left: '48%',
    top: '40%'
  },
  backnext: {
    'margin-top': theme.spacing.unit
  },
  stepperContainer: {
    width: '100%',
    overflow: 'auto'
  },
  stepper: {
    padding: theme.spacing.unit * 3 + 'px 0'
  },
  addMarginRight: {
    marginRight: theme.spacing.unit / 2
  },
  pullRight: {
    float: 'right'
  }
});

/**
 * step labels
 * @ignore
 * @type {array}
 * @default
 */
const steps = [
  'Step 1',
  'Step 2',
  'Step 3',
  'Step 4',
  'Step 5',
  'Step 6',
  'Step 7',
  'Step 8'
];

/**
 * List of step components
 * @ignore
 * @type {object}
 * @default
 */
const P11FormComponent = {
  0: P11Form1,
  1: P11Form2,
  2: P11Form3,
  3: P11Form4,
  4: P11Form5,
  5: P11Form6,
  6: P11Form7,
  7: P11Form8
};

/**
 * P11 is a component to show profile builder page
 *
 * @name P11
 * @component
 * @category Page
 *
 */
class P11 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      openProfile: false,
      preview: false,
      alertOpen: false,
      successOpen: false,
      userData: '',
      isLoading: false,
      completed: new Set(),
      skipped: new Set()
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.finishSubmit = this.finishSubmit.bind(this);
    this.nextForm = this.nextForm.bind(this);
    this.checkErrorStep = this.checkErrorStep.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
    this.openAlerHandler = this.openAlerHandler.bind(this);
    this.continueHandler = this.continueHandler.bind(this);
    this.isStepSkipped = this.isStepSkipped.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   * It'll call an api to get all data needed
   */
  componentDidMount() {
    this.props.getNationalities();
    this.props.getLanguages();
    this.props.getP11Countries();
    this.props.getOrganizations();
    this.props.getDisclaimerStatus();
    this.afterMount();
  }

  /**
   * afterMount is a function to get p11Status data and check error in step 1
   */
  async afterMount() {
    await this.props
      .getAPI('/api/p11-profile-form-1')
      .then((res) => {
        const { p11Status } = res.data.data;
        if (!isEmpty(p11Status)) {
          this.props.setP11Status(JSON.parse(p11Status));
        }
        return { p11Status: res.data.data.p11Status };
      })
      .catch((err) => { });

    this.checkErrorStep();
  }

  /**
   * handlePreview is a function to handle profile preview modal
   */
  async handlePreview() {
    await this.nextForm('/api/p11-update-form-8', 8, 8)
    this.setState({ openProfile: true, preview: true });
  }

  /**
   * openAlerHandler is a function to open alert modal before submitting data to iMMAP
   */
  openAlerHandler() {
    this.setState({ alertOpen: true });
  }

  /**
   * closeProfile is a function to close profile modal
   */
  closeProfile() {
    this.setState({ openProfile: false, preview: false, activeStep: this.state.activeStep - 1 });
  }

  /**
   * checkErrorStep is a function to check error for each step
   */
  checkErrorStep() {
    const { p11Status } = this.props;
    let newActiveStep = 0;
    Object.keys(p11Status).some(function (key) {
      const step = parseInt(key.substring(4));
      if (step === 8) {
        newActiveStep = step;
      } else if (p11Status[key] === 0) {
        newActiveStep = step;
      }
      return p11Status[key] === 0;
    });
    this.setState({ activeStep: newActiveStep - 1 });
  }

  /**
   * handleNext is a function to move to the next step
   */
  handleNext() {
    if (this.state.activeStep < 8) {
      var active = this.state.activeStep + 1;
      this.nextForm('/api/p11-update-form-' + active, active);
    }
  }

  /**
   * handleStep is a function change step based on step number in the top of the page
   * @param {number} index - steps index
   */
  handleStep(index) {
    if (index < 8) {
      var active = this.state.activeStep < 8 ? this.state.activeStep + 1 : this.state.activeStep;

      if (!isEmpty(active) && typeof active !== 'undefined' && active !== null) {
        this.nextForm('/api/p11-update-form-' + active, active, index);
      }
    }
  }

  /**
   * finishSubmit is a function to submit your data to iMMAP
   * @returns {Promise}
   */
  finishSubmit() {
    const { p11Status } = this.props;
    this.props.setLoading(true);
    let data = { finished: Object.keys(p11Status).every((k) => p11Status[k]) };
    data['_method'] = 'PUT';

    return this.props
      .postAPI('/api/p11-submit-finished', data)
      .then((res) => {
        this.props.setLoading(false);

        if (res.data.data) {
          this.setState({ successOpen: true, userData: res.data.data, isLoading: false });
        }

        this.props.addFlashMessage({
          type: 'success',
          text: 'Your form has been saved'
        });
      })
      .catch((err) => {
        this.props.setLoading(false);
        this.props.addFlashMessage({
          type: 'error',
          text: 'Error'
        });
      });
  }

  /**
   * nextForm is a function to save form when the step is change
   * @param {string} url  - save form url
   * @param {number} step - step number
   * @param {number} next - next step number (it can be next / previous )
   * @returns {Promise}
   */
  nextForm(url, step, next) {

    if (!isEmpty(step) && typeof step !== 'undefined' && step !== null) {
      this.props.setLoading(true);
      let data = Object.assign(this.props.p11['form' + step]);
      data['_method'] = 'PUT';

      return this.props
        .postAPI(url, data)
        .then((res) => {
          this.props.setLoading(false);
          if (isEmpty(next)) {
            this.setState((state) => ({
              activeStep: state.activeStep + 1 //2
            }));
          }
          if (!isEmpty(next)) {
            this.setState({ activeStep: next });
          }

          this.props.addFlashMessage({
            type: 'success',
            text: 'Your form has been saved'
          });
        })
        .catch((err) => {
          this.props.setLoading(false);
          if (!isEmpty(err.response)) {
            if (err.response.status === 422) {
              this.props.addFlashMessage({
                type: 'error',
                text: 'Validation error, please check the form'
              });
            } else {
              this.props.addFlashMessage({
                type: 'error',
                text: 'Error'
              });
            }
          }
        });
    }

  }

  /**
   * continueHandler is a function to refresh token and manage redirection after submitting your data ot iMMAP
   */
  continueHandler() {
    this.props.refreshAuthUser(this.state.userData);

    if (!isEmpty(Cookies.get("isNewUser")) && !isEmpty(Cookies.get('apply-job-id'))) {
      const coverLetterJob = !isEmpty(Cookies.get('apply-job-cover-letter')) ? (Cookies.get('apply-job-cover-letter') === '1') ? true : false : false;

      if (Cookies.get("isNewUser") === "true") {
        const jobId = Cookies.get('apply-job-id');
        Cookies.remove('apply-job-id');

        if (coverLetterJob) {
          // redirect to job detail page
          this.props.history.push(`/jobs/${jobId}`);
        } else {
          // automatically apply the job
          Cookies.remove('isNewUser');
          this.props
            .postAPI('/api/apply-job', { job_id: jobId })
            .then((res) => {
                const { status, message } = res.data;

                if (status === 'success') {
                  this.props.history.push('/job-applications');
                  this.props.addFlashMessage({
                      type: status,
                      text: message
                  });
                }
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
                this.props.history.push(`/jobs/${jobId}`);
            });
        }
      } else {
        this.props.history.push('/profile');
      }
    } else {
      this.props.history.push('/profile');
    }
  }

  /**
   * handleBack is a function to move to the previous step
   */
  handleBack() {
    var active = this.state.activeStep + 1;
    var index = this.state.activeStep - 1;
    this.nextForm('/api/p11-update-form-' + active, active, index);
  }

  /**
   * getStepContent is a function to pick form step component
   * @param {number} stepIndex - step index number
   * @returns {Component|string}
   */
  getStepContent(stepIndex) {
    if (stepIndex < 8) {
      const P11Form = P11FormComponent[stepIndex];
      return <P11Form />;
    }

    return '';
  }

  /**
   * isStepSkipped is a function to check if the step are skipped or not by the user
   * @param {number} step - steps index
   * @returns
   */
  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  render() {
    const { classes, selected_profile_id, disclaimer_agree, disclaimer_open, p11Status } = this.props;
    let { activeStep, openProfile, preview, alertOpen, successOpen, isLoading } = this.state;
    let isValid = Object.keys(p11Status).every((k) => p11Status[k]);

    return (
      <Paper className={classes.paper}>
        <Helmet>
          <title>{APP_NAME + ' - Profile Form'}</title>
          <meta name="description" content={APP_NAME + ' Profile Form'} />
        </Helmet>
        <Typography variant="h5" component="h3">
          Please complete this form
				</Typography>
        <div className={classes.stepperContainer}>
          <Stepper activeStep={activeStep} alternativeLabel nonLinear className={classes.stepper}>
            {steps.map((label, index) => {
              const props = {};
              if (this.isStepSkipped(index)) {
                props.completed = false;
              }
              return (
                <Step key={label} {...props}>
                  <StepButton
                    onClick={() => this.handleStep(index)}
                    completed={this.props.p11Status['form' + (index + 1)] == 1}
                  >
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
        </div>

        <Grid container spacing={16}>
          <Grid item xs={12}>
            {activeStep === steps.length ? (
              <div>
                <Typography className="">All steps completed</Typography>
              </div>
            ) : (
                <div>
                  {this.getStepContent(activeStep)}
                  <div className={classes.backnext}>
                    <Button
                      color="primary"
                      variant="outlined"
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.backButton}
                    >
                      <ChevronLeftIcon /> Back
									</Button>
                    {!(activeStep === steps.length - 1) ?
                      this.props.p11.loading && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.pullRight}
                        >
                          <CircularProgress className={classes.loading} size={20} />
                        </Button>
                      ) : null}

                    {!(activeStep === steps.length - 1) ?
                      !this.props.p11.loading && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.pullRight}
                        >
                          Next <ChevronRightIcon />
                        </Button>
                      ) : null}

                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handlePreview}
                        disabled={!isValid}
                        className={classes.pullRight}
                      >
                        <EyeIcon className={classes.addMarginRight} /> Preview
                      </Button>
                    ) : null}
                  </div>
                </div>
              )}
          </Grid>
        </Grid>
        <Alert
          isOpen={alertOpen}
          onClose={() => {
            this.setState({ alertOpen: false });
          }}
          onAgree={async () => {
            this.setState({ isLoading: true });
            this.setState({ alertOpen: false, openProfile: false });
            this.finishSubmit();
          }}
          title="Submit Data"
          text={'Are you sure to submit your data to 3iSolution?'}
          closeText="Cancel"
          AgreeText="Yes"
        />
        <Success
          isOpen={successOpen}
          onClose={() => {
            this.setState({ successOpen: false });
          }}
          continueHandler={this.continueHandler}
        />
        <ProfileModal
          isOpen={openProfile}
          title="Preview"
          onClose={this.closeProfile}
          onSubmit={this.openAlerHandler}
          preview={preview}
          showImmaperBox={false}
        />
        <ModalLoadingSpinner isLoading={isLoading} />
        {disclaimer_open == 1 && <Disclaimer />}
      </Paper>
    );
  }
}

P11.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * getNationalities is a prop containing redux actions to get nationalities data
   */
  getNationalities: PropTypes.func.isRequired,
  /**
   * getLanguages is a prop containing redux actions to get languages data
   */
  getLanguages: PropTypes.func.isRequired,
  /**
   * getOrganizations is a prop containing redux actions to get organizations data
   */
  getOrganizations: PropTypes.func.isRequired,
  /**
   * getP11Countries is a prop containing redux actions to get countries data
   */
  getP11Countries: PropTypes.func.isRequired,
  /**
   * setLoading is a prop containing redux actions to show/hide loading
   */
  setLoading: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a function to show a pop up message
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * p11 is a prop containing p11 reducer data
   */
  p11: PropTypes.object.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  p11: state.p11,
  p11Status: state.p11.p11Status,
  disclaimer_agree: state.p11.disclaimer_agree,
  disclaimer_open: state.p11.disclaimer_open
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  setLoading,
  getP11Countries,
  getLanguages,
  getNationalities,
  addFlashMessage,
  getOrganizations,
  setP11Status,
  refreshAuthUser,
  getDisclaimerStatus
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(P11));
