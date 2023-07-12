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

/**
 * IMTestScore is a component to show IM Test Score on Roster Card / Roster page
 *
 * @name IMTestScore
 * @component
 * @category Roster
 *
 */
class IMTestScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      id: '',
      im_test_sharepoint_link: '',
      im_test_score: '',
      skillset: '',
      errors: {}
    }

    this.saveTest = this.saveTest.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.setSkillset = this.setSkillset.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    const { profile, roster_process } = this.props;
    if (!isEmpty(profile)) {
      if (!isEmpty(profile.profile_roster_processes)) {
          const rosterApplicationLength = profile.profile_roster_processes.length - 1;
          const { id, im_test_sharepoint_link, im_test_score } = profile.profile_roster_processes[rosterApplicationLength];
          this.setState({
            id,
            im_test_sharepoint_link: !isEmpty(im_test_sharepoint_link) ? im_test_sharepoint_link : '',
            im_test_score: !isEmpty(im_test_score) ? im_test_score : '',
            showForm: !isEmpty(im_test_sharepoint_link) && !isEmpty(im_test_score) ? false : true
          }, () => this.isValid());
      } else { this.resetForm() }
    } else { this.resetForm() }

    this.setSkillset(roster_process);
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    if(JSON.stringify(prevProps.profile) !== JSON.stringify(this.props.profile)) {
      const oldRosterApplicationLength = prevProps.profile.profile_roster_processes.length - 1;
      const newRosterApplicationLength = this.props.profile.profile_roster_processes.length - 1;
      const oldLink = prevProps.profile.profile_roster_processes[oldRosterApplicationLength].im_test_sharepoint_link;
      const newLink = this.props.profile.profile_roster_processes[newRosterApplicationLength].im_test_sharepoint_link;
      const oldScore = prevProps.profile.profile_roster_processes[oldRosterApplicationLength].im_test_score;
      const newScore = this.props.profile.profile_roster_processes[newRosterApplicationLength].im_test_score;
      let newData = {}
      if (oldLink !== newLink) {
        newData.im_test_sharepoint_link = newLink;
      }
      if (oldScore !== newScore) {
        newData.im_test_score = newScore;
      }
      if (!isEmpty(newData)) {
        this.setState(newData, () => this.isValid());
      }
    }

    if (JSON.stringify(prevProps.roster_process) !== JSON.stringify(this.props.roster_process)) {
      this.setSkillset(this.props.roster_process);
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
    const { im_test_sharepoint_link, im_test_score } = this.state;
    let errors = {};

    if (!isEmpty(im_test_sharepoint_link)) {
      if (!validator.isEmpty(im_test_sharepoint_link)) {
        if (!validator.isURL(im_test_sharepoint_link)) {
          errors.im_test_sharepoint_link = "Invalid URL Format";
        }
      }
    } else {
      errors.im_test_sharepoint_link = "Sharepoint Link is required"
    }

    if (!isEmpty(im_test_score)) {
      if (!validator.isInt(im_test_score.toString())) {
        errors.im_test_score = "Invalid score format"
      } else if (!validator.isInt(im_test_score.toString(), { min: 0, max: 100})) {
        errors.im_test_score = "Minimum score is 0, Maximum score is 100";
      }
    } else {
      errors.im_test_score = "Score is required"
    }

    this.setState({ errors })
  }

  /**
   * resetForm is a function to reset form data
   */
  resetForm() {
    this.setState({ im_test_sharepoint_link: '', im_test_score: '' }, () => this.isValid());
  }

  /**
   * setSkillset is a function to get and set the skillset data
   * @param {roster_process} rosterProcess roster_process data from props
   */
  setSkillset(rosterProcess) {
    if (!isEmpty(rosterProcess)) {
      this.setState({ skillset: !isEmpty(rosterProcess.skillset) ? rosterProcess.skillset : ''})
    }
  }

  /**
   * saveTest is a function to save IM/M&E/GIS score data
   * @param {Event} e
   */
  saveTest(e) {
    e.preventDefault();
    const { id, im_test_sharepoint_link, im_test_score } = this.state;
    axios.post(`/api/roster/save-im-test-score/${id}`, {
      _method: 'PUT',
      im_test_sharepoint_link,
      im_test_score
    }).then(res => {
      this.props.reloadProfiles();
      this.setState({ showForm: false });
      this.props.addFlashMessage({ type: 'success', text: 'Saved!' });
    })
    .catch(err => {
      this.props.addFlashMessage({ type: 'error', text: textSelector('error', 'default') });
    })
  }

  render() {
    const { showForm, id, im_test_sharepoint_link, im_test_score, errors, skillset } = this.state;
    const { classes, width, isIMTest } = this.props;

    return (
      (isEmpty(im_test_sharepoint_link) && isEmpty(im_test_score) && !isIMTest) ? null : (
        <>
          {this.props.divider}
          <form onSubmit={this.saveTest}>
            <Grid container spacing={16} alignItems="flex-end">
              <Grid item xs={12} className={classes.titleGrid}>
                <Typography color="primary" variant="subtitle1" component="div" className={classes.title}>{!isEmpty(skillset) ? `${skillset} `: ''}Test Score</Typography>
              </Grid>
              {showForm ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={9}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id={`${id}-sharepoint-link`}
                          label="Sharepoint Link"
                          margin="dense"
                          required
                          fullWidth
                          name="im_test_sharepoint_link"
                          value={im_test_sharepoint_link}
                          onChange={this.onChange}
                          error={!isEmpty(errors.im_test_sharepoint_link) && isIMTest}
                          helperText={errors.im_test_sharepoint_link && isIMTest ? errors.im_test_sharepoint_link : ''}
                          disabled={!isIMTest}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id={`${id}-score-test`}
                          label="Score (%)"
                          margin="dense"
                          required
                          fullWidth
                          name="im_test_score"
                          type="number"
                          value={im_test_score}
                          onChange={this.onChange}
                          error={!isEmpty(errors.im_test_score) && isIMTest}
                          helperText={errors.im_test_score && isIMTest ? errors.im_test_score : ''}
                          disabled={!isIMTest}
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
                      disabled={!isIMTest}
                    >
                      <Save fontSize='small' className={classes.iconRightMargin}/> Save
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={9}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} md={6}>
                        <Typography>Sharepoint Link</Typography>
                        <a href={im_test_sharepoint_link} target="_blank">
                          <Typography color="primary" className={classes.link}>{im_test_sharepoint_link.substring(0, 52)} {(im_test_sharepoint_link.length > 52) ? '...' : ''}</Typography>
                        </a>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Score</Typography>
                        <Typography>{im_test_score} %</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={3}>
                    {isIMTest && (
                      <>
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
                      </>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </>
      )
    )
  }
}

IMTestScore.propTypes = {
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
   * profile is a prop containing applicant roster recruitment data
   */
  profile: PropTypes.object.isRequired,
  /**
   * isIMTest is a prop containing data about the step is an IM/M&E/GIS Test or not
   */
  isIMTest: PropTypes.bool.isRequired,
  /**
   * roster_process is a prop containing selected roster process data
   */
  roster_process: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string // empty string
  ]).isRequired,
  /**
   * reloadProfiles is a prop containing function to reload profile list on roster page
   */
   reloadProfiles: PropTypes.func.isRequired,
   /**
    * divider is a prop containing roster card divider
    */
   divider: PropTypes.node.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
 const mapDispatchToProps = {
  addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
 const mapStateToProps = (state) => ({
  roster_process: state.roster.roster_process
});

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

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTestScore)))
