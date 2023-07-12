/** import React, axios, validator, classname and Prop Types */
import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import classname from 'classnames';
import PropTypes from 'prop-types';

/** import Material UI styles, width, components and icons */
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import components needed for this component */
import CircleBtn from '../../../common/CircleBtn';

/** import configuration value and validation helper*/
import isEmpty from '../../../validations/common/isEmpty';
import textSelector from "../../../utils/textSelector";
import {
  recommendationColor,
  recommendationHoverColor,
  purple,
  purpleHover,
  white
} from '../../../config/colors';
import { getApplicantProfiles } from '../../../redux/actions/jobs/applicantActions';


/**
 * ApplicantTestScore is a component to show applicant Test Score on applicant Card
 *
 * @name ApplicantTestScore
 * @component
 * @category Roster
 *
 */
class ApplicantTestScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      id: '',
      applicant_test_link: '',
      applicant_test_score: '',
      errors: {},
      tests: []
    }

    this.saveTest = this.saveTest.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.resetForm = this.resetForm.bind(this);;
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    const { profile } = this.props;
    
    if (!isEmpty(profile)) {
          const id = profile.id;
          if (!isEmpty(profile.job_user_tests)) {
            this.setState({ tests: profile.job_user_tests });
            let data;
            if (this.props.testStepPosition == 'after') {
              data = profile.job_user_tests.filter((test) =>{
                return test.position_to_interview_step == 'after';
              })
            } else {
              data = profile.job_user_tests.filter((test) =>{
                return test.position_to_interview_step == 'before';
              })
            } 
           if(!isEmpty(data)) {
             const { test_link, test_score } = data[0];
              this.setState({
                id,
                applicant_test_link: test_link,
                applicant_test_score: test_score,
                showForm: false,
              }, () => this.isValid());
           } else { 
              this.setState({
                id,
                showForm: true
              }, () => this.isValid());
            }
          } else {
            this.setState({
              id,
              showForm: true
            }, () => this.isValid());
          }
      } else { this.resetForm() }
    }


  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    if(JSON.stringify(prevProps.profile) !== JSON.stringify(this.props.profile)) {
      const oldLink = prevProps.profile.test_link;
      const newLink = this.props.profile.test_link;
      const oldScore = prevProps.profile.test_score;
      const newScore = this.props.profile.test_score;
      let newData = {}
      if (oldLink !== newLink) {
        newData.applicant_test_link = newLink;
      }
      if (oldScore !== newScore) {
        newData.applicant_test_score = newScore;
      }
      if (!isEmpty(newData)) {
        this.setState(newData, () => this.isValid());
      }
    }
  }

  /**
   * onChange is a function to change form field data
   * @param {Event} e
   */
  onChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => this.isValid())
  }

  /**
   * isValid is a function to validate form data
   */
  isValid() {
    const { applicant_test_link, applicant_test_score } = this.state;
    let errors = {};

    if (!isEmpty(applicant_test_link)) {
      if (!validator.isEmpty(applicant_test_link)) {
        if (!validator.isURL(applicant_test_link)) {
          errors.applicant_test_link = "Invalid URL Format";
        }
      }
    } else {
      errors.applicant_test_link = "Test Link is required"
    }

    if (!isEmpty(applicant_test_score)) {
      if (!validator.isInt(applicant_test_score.toString())) {
        errors.applicant_test_score = "Invalid score format"
      } else if (!validator.isInt(applicant_test_score.toString(), { min: 0, max: 100})) {
        errors.applicant_test_score = "Minimum score is 0, Maximum score is 100";
      }
    } else {
      errors.applicant_test_score = "Score is required"
    }

    this.setState({ errors })
  }

  /**
   * resetForm is a function to reset form data
   */
  resetForm() {
    this.setState({ applicant_test_link: '', applicant_test_score: '' }, () => this.isValid());
  }


  /**
   * saveTest is a function to save test link and score data
   * @param {Event} e
   */
  saveTest(e) {
    e.preventDefault();
    const { id, applicant_test_link, applicant_test_score } = this.state;
    axios.post(`/api/jobs/save-applicant-test-score/${id}`, {
      _method: 'PUT',
      test_link: applicant_test_link,
      test_score: applicant_test_score,
      position_to_interview_step: this.props.testStepPosition
    }).then(res => {
      this.props.getApplicantProfiles();
      this.setState({ showForm: false });
      this.props.addFlashMessage({ type: 'success', text: 'Saved!' });
    })
    .catch(err => {
      this.props.addFlashMessage({ type: 'error', text: textSelector('error', 'default') });
    })
  }

  render() {
    const { showForm, id, applicant_test_link, applicant_test_score, errors, tests } = this.state;
    const { classes, width, isTestStep, allowEditTest } = this.props;

    return (
        <>
          {this.props.divider}
          <form onSubmit={this.saveTest}>
            <Grid container spacing={16} alignItems="flex-end">
              <Grid item xs={12} className={classes.titleGrid}>
                <Typography color="primary" variant="subtitle1" component="div" className={classes.title}>Test Score</Typography>
              </Grid>
              {showForm && isTestStep ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={9}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id={`${id}-sharepoint-link`}
                          label="Test Link"
                          margin="dense"
                          required
                          fullWidth
                          name="applicant_test_link"
                          value={applicant_test_link}
                          onChange={this.onChange}
                          error={!isEmpty(errors.applicant_test_link)}
                          helperText={errors.applicant_test_link ? errors.applicant_test_link : ''}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id={`${id}-score-test`}
                          label="Score (%)"
                          margin="dense"
                          required
                          fullWidth
                          name="applicant_test_score"
                          type="number"
                          value={applicant_test_score}
                          onChange={this.onChange}
                          error={!isEmpty(errors.applicant_test_score)}
                          helperText={errors.applicant_test_score ? errors.applicant_test_score : ''}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Button
                      color='primary'
                      variant='contained'
                      size="small"
                      type="submit"
                      fullWidth
                      className={classname(classes.buttonMarginBottom, classes.saveBtn)}
                    >
                      <Save fontSize='small' className={classes.iconRightMargin}/> Save
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                 { isTestStep ?
                  <Grid item xs={12} sm={12} md={12} lg={9}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} md={6}>
                        <Typography>Test Link</Typography>
                        <a href={applicant_test_link} target="_blank">
                          <Typography color="primary" className={classes.link}>{applicant_test_link.substring(0, 52)} {(applicant_test_link.length > 52) ? '...' : ''}</Typography>
                        </a>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Score</Typography>
                        <Typography>{applicant_test_score} %</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  : 
                  tests.map((test) => (
                    <Grid item xs={12} sm={12} md={12} lg={9}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} md={6}>
                        <Typography>Test Link</Typography>
                        <a href={test.test_link} target="_blank">
                          <Typography color="primary" className={classes.link}>{test.test_link.substring(0, 52)} {(test.test_link.length > 52) ? '...' : ''}</Typography>
                        </a>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Score</Typography>
                        <Typography>{test.test_score} %</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  ))
                 }
                  { isTestStep && allowEditTest &&
                  <Grid item xs={12} sm={12} md={12} lg={3}>
                      {width !== "xs" && width !== "sm" && width !== "md" ? (
                        <CircleBtn
                          color={classname(classes.purple, classes.circleBtn)}
                          size="small"
                          icon={<Edit />}
                          onClick={() => this.setState({ showForm: true })}
                        />
                      ) : (
                        <Button
                          color='primary'
                          variant='contained'
                          size="small"
                          fullWidth
                          className={classname(classes.buttonMarginBottom, classes.purple)}
                          onClick={() => this.setState({ showForm: true })}
                        >
                          <Edit fontSize='small' className={classes.iconRightMargin}/> Edit
                        </Button>
                      )}
                  </Grid>
                   }
                </>
              )}
            </Grid>
          </form>
        </>
    )
  }
}

ApplicantTestScore.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * width is a prop containing the state of material ui browser width
   */
  width: PropTypes.string.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
   /**
    * divider is a prop containing roster card divider
    */
   divider: PropTypes.node.isRequired,
    /**
    * allowEditTest is a boolean value to show the Test Edit Button.
    */
    allowEditTest: PropTypes.bool.isRequired,
    /**
    * isTestStep is a boolean value to detect Test step
    */
    isTestStep: PropTypes.bool.isRequired,
    /**
    * testStepPosition is a string value of Test step position
    */
    testStepPosition: PropTypes.string.isRequired,
    /**
    * profile is a object of profile data
    */
    profile: PropTypes.object.isRequired,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
 const mapDispatchToProps = {
  addFlashMessage,
  getApplicantProfiles
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  titleGrid: {paddingBottom: 0, marginBottom: theme.spacing.unit * -1},
  title: {fontWeight: 700},
  buttonMarginBottom: { marginBottom: theme.spacing.unit / 2 },
  link: {overflowX: 'hidden'},
  purple: {
    "background-color": purple,
    color: white,
    "&:hover": {
      color: purpleHover,
    },
  },
  saveBtn: {
    backgroundColor: recommendationColor,
    color: white,
    "&:hover": {
      backgroundColor: recommendationHoverColor,
    },
  },
  circleBtn: {marginBottom: 0, marginLeft: 0},
  iconRightMargin: {marginRight: theme.spacing.unit / 2 }
})

export default withWidth()(withStyles(styles)(connect(null, mapDispatchToProps)(ApplicantTestScore)))
