// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
// Material UI
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Modal from '../../common/Modal';
// Setting for Color and API
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { primaryColor, white } from '../../config/colors';
// IMTest Component
import IMTestWelcome from './IMTestWelcome';
import IMTest1 from './IMTest1';
import IMTest2 from './IMTest2';
import IMTest3 from './IMTest3';
import IMTest4 from './IMTest4';
// IMTest Redux
import { nextBack, showHidePreview, handleNext, handleBack } from '../../redux/actions/imtest/imtestActions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  root: {
    width: '100%'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    marginBottom: 45,
    padding: 30
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  addSmallMarginRight: {
    'margin-right': '.25em'
  },
  addMarginTop: {
    'margin-top': '0.5em'
  },
  btnChoose: {
    width: 'max-content'
  },
  timmer: {
    fontWeight: 'bold',
    position: 'fixed',
    right: '50%',
    bottom: 0
  },
  active: {
    backgroundColor: primaryColor,
    color: white
  },
  deleteBtn: {
    position: 'absolute',
    right: 28
  }
});

const ImTestComponent = {
  0: IMTestWelcome,
  1: IMTest1,
  2: IMTest2,
  3: IMTest3,
  4: IMTest4
};

class IMTest extends Component {
  constructor(props) {
    super(props);

    this.getSteps = this.getSteps.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.getButton = this.getButton.bind(this);
  }

  getSteps() {
    return ['IM Test 1', 'IM Test 2', 'IM Test 3', 'IM Test 4', 'IM Test 5'];
  }

  getStepContent(stepIndex) {
    if (stepIndex < 5) {
      const ImTest = ImTestComponent[stepIndex];
      return <ImTest isEdit={this.props.isEdit} isAdd={this.props.isAdd} />;
    }

    return '';
  }

  getButton() {
    const { showHidePreview, nextBack, handleNext, handleBack } = this.props;
    const steps = this.getSteps();
    let data = '';

    let { activeStep, isValid } = this.props.imtest;
    let { isAdd, isEdit } = this.props;
    if (isEdit === null) {
      data = (
        <div style={{ marginLeft: -12 }}>
          {activeStep > 0 && (
            <Button variant="contained" color="primary" onClick={this.handleNext} style={{ margin: 5 }}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
          {activeStep <= 0 && (
            <Button variant="contained" color="primary" onClick={this.handleStart} style={{ margin: 5 }}>
              START
            </Button>
          )}
        </div>
      );
    } else {
      data = (
        <div style={{ marginLeft: -12 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 5 }}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
					</Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => showHidePreview('show')}
              disabled={!isValid}
            >
              Preview
            </Button>
          ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                style={{ margin: 5 }}
                disabled={!isValid}
              >
                Next
              </Button>
            )}
        </div>
      );
    }
    return data;
  }

  functionRenderPreview(classes) {
    var index;
    for (index = 0; index < this.props.dashboardIMTestTemplate.steps; ++index) {
      const ImTest = ImTestComponent[index];

      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <IMTestWelcome />
          </Paper>
          <Paper className={classes.paper}>
            <IMTest1 />
          </Paper>
          <Paper className={classes.paper}>
            <IMTest2 />
          </Paper>
          <Paper className={classes.paper}>
            <IMTest3 />
          </Paper>
          <Paper className={classes.paper}>
            <IMTest4 />
          </Paper>
        </div>
      );
    }
  }

  render() {
    const { classes, showHidePreview } = this.props;
    const steps = this.getSteps();
    let { activeStep, start, preview } = this.props.imtest;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
        {start && (
          <Typography className={classes.timmer} variant="h3" gutterBottom>
            04:00
          </Typography>
        )}
        <Paper className={classes.paper} onScroll={this.handleScroll}>
          {activeStep === steps.length ? (
            <div>
              <Typography variant="h5" component="h3" className={classes.instructions}>
                All steps completed
							</Typography>
              <Button onClick={this.handleReset}>Reset</Button>
            </div>
          ) : (
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div style={{ marginBottom: 10 }}>{this.getStepContent(activeStep)}</div>
                  {this.getButton()}
                </Grid>
              </Grid>
            )}
        </Paper>
        <Modal
          open={preview}
          saveButton={false}
          title="Preview IM Test"
          handleClose={() => showHidePreview('hide')}
          fullWidth={true}
          maxWidth="md"
          scroll="paper"
        >
          {this.functionRenderPreview(classes)}
        </Modal>
      </div>
    );
  }
}

IMTest.propTypes = {
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  nextBack: PropTypes.func.isRequired,
  showHidePreview: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  nextBack,
  showHidePreview,
  handleNext,
  handleBack
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  imtest: state.imtest,
  dashboardIMTestTemplate: state.dashboardIMTestTemplate
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTest));
