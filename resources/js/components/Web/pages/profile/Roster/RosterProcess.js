import React, { Component } from 'react';
import classname from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
	getCurrentRosterProcess,
	getHistoryRosterProcess
} from '../../../redux/actions/profile/rosterProcessActions';
import { borderColor, primaryColor, white, green, blueIMMAP } from '../../../config/colors';
import isEmpty from '../../../validations/common/isEmpty';
import moment from 'moment';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Skeleton from 'react-loading-skeleton';
import { Button } from '@material-ui/core';

class RosterProcess extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getCurrentRosterProcess();
	}

	componentDidUpdate(prevProps) {
		if (this.props.rosterProcessID !== prevProps.rosterProcessID || this.props.profileID !== prevProps.profileID) {
			if (this.props.status === 'current') {
				this.props.getCurrentRosterProcess();
			}

			if (this.props.status === 'history') {
				this.props.getHistoryRosterProcess();
			}
		}
	}

	render() {
		const {
			classes,
			profile_roster_process_data,
			rosterProcessID,
			currentRosterProcess,
            currentRosterProcessLoading,
			historyRosterProcess,
			historyRosterProcessLoading,
			status,
			isAccepted
		} = this.props;

		return (
			<div>
				{status === 'about' && (
					<Paper className={classes.about}>
						<Typography variant="subtitle1" color="primary" className={classes.titleSection}>
							What is {profile_roster_process_data.name}
						</Typography>
						{profile_roster_process_data.description ? (
							<Typography dangerouslySetInnerHTML={{ __html: profile_roster_process_data.description }} />
						) : (
							<div className={classes.addMarginTop}>
								<Skeleton count={10} />
							</div>
						)}
						{this.props.showApplyBtn && <Button
							variant="contained"
							color="primary"
							onClick={this.props.showApplyRosterDialog}
							className={classes.applyBtn}
							>
							APPLY
						</Button> }
					</Paper>
				)}
				{status === 'current' && (
					<Paper className={classes.about}>
            {currentRosterProcessLoading ? (
              <>
                <Skeleton count={1} />
                <hr className={classes.borderLine} />
              </>
            ) : (
              <Typography variant="subtitle1" color="primary" className={classes.titleSection}>
                {profile_roster_process_data.name}
              </Typography>
            )}
            {currentRosterProcessLoading ? (
              <Skeleton count={8} />
            ) : (
              <>
                { isAccepted === true ? <Typography>Verified as {profile_roster_process_data.name} member </Typography> :
                isEmpty(currentRosterProcess) ? (
                  <Typography>No Current Process</Typography>
                ) : (
                  <Stepper
                    activeStep={currentRosterProcess.pivot.current_step}
                    alternativeLabel
                    className={classes.stepper}
                  >
                    {currentRosterProcess.roster_steps.length > 0 &&
                      currentRosterProcess.roster_steps.map((roster_step) => (
                        <Step key={'stepid-' + roster_step.id} className={classes.step}>
                          <StepLabel>{roster_step.step}</StepLabel>
                        </Step>
                      ))}
                  </Stepper>
                )}
              </>
            )}
					</Paper>
				)}
				{status === 'history' && (
					<Paper className={classname(classes.about)}>
            {historyRosterProcessLoading ? (
              <>
                <Skeleton count={1} />
                <hr className={classes.borderLine} />
              </>
            ) : (
              <Typography
                variant="subtitle1"
                color="primary"
                className={classname(classes.titleSection, classes.historyTitle)}
              >
                {profile_roster_process_data.name}
              </Typography>
            )}
            {historyRosterProcessLoading ? (
              <Skeleton count={8} />
            ) : (
              <>
                {historyRosterProcess.length == 0 ? (
                  <Typography>No History</Typography>
                ) : isEmpty(historyRosterProcess) ? (
                  <div className={classes.addMarginTop}>
                    <Skeleton count={5} />
                  </div>
                ) : (
                  <VerticalTimeline className={classes.timeline} layout="1-column">
                    {historyRosterProcess.map((history, index) => {
                      return (
                        <VerticalTimelineElement
                          key={'history-' + index}
                          className={
                            history.pivot.is_completed == 1 ? (
                              classname(classes.timelineBox, classes.greenTimelineBox)
                            ) : history.pivot.is_completed == 0 &&
                            history.pivot.is_rejected == 0 ? (
                              classname(classes.timelineBox, classes.blueTimelineBox)
                            ) : (
                              classes.timelineBox
                            )
                          }
                          iconStyle={{
                            backgroundColor: white,
                            color: primaryColor,
                            boxShadow: 'none',
                            border: '4px solid ' + primaryColor
                          }}
                          icon={<AccessTimeIcon fontSize="large" />}
                        >
                          {history.pivot.is_completed == 1 ? (
                            <Typography className={classes.dateText}>
                              CONGRATULATIONS! You are now an official member of{' '}
                              {profile_roster_process_data.name}
                            </Typography>
                          ) : history.pivot.is_completed == 0 && history.pivot.is_rejected == 0 ? (
                            <Typography className={classes.dateText}>On Process</Typography>
                          ) : (
                            <Typography className={classes.dateText}>
                              Thank you for your interest in the{' '}
                              {profile_roster_process_data.name}, Unfortunately, you were not
                              selected as {profile_roster_process_data.name} Member
                            </Typography>
                          )}
                          <Typography color="primary" className={classes.dateText}>
                            Applied at :{' '}
                            {moment(history.pivot.created_at).local().format('DD MMMM YYYY')}
                          </Typography>
                          {history.pivot.is_completed == 1 && (
                            <Typography color="primary" className={classes.dateText}>
                              Verified at :{' '}
                              {moment(history.pivot.updated_at).local().format('DD MMMM YYYY')}
                            </Typography>
                          )}
                        </VerticalTimelineElement>
                      );
                    })}
                  </VerticalTimeline>
                )}
              </>
            )}
					</Paper>
				)}
			</div>
		);
	}
}

RosterProcess.propTypes = {
	profile_roster_process_data: PropTypes.any,
	getCurrentRosterProcess: PropTypes.func.isRequired,
	getHistoryRosterProcess: PropTypes.func.isRequired,
  currentRosterProcessLoading: PropTypes.bool.isRequired,
  historyRosterProcessLoading: PropTypes.bool.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getCurrentRosterProcess,
	getHistoryRosterProcess
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	profile_roster_process_data: state.profileRosterProcess.profile_roster_process_data,
	status: state.profileRosterProcess.status,
	rosterProcessID: state.profileRosterProcess.rosterProcessID,
	profileID: state.profileRosterProcess.profileID,
	currentRosterProcess: state.profileRosterProcess.currentRosterProcess,
	historyRosterProcess: state.profileRosterProcess.historyRosterProcess,
  currentRosterProcessLoading: state.profileRosterProcess.currentRosterProcessLoading,
  historyRosterProcessLoading: state.profileRosterProcess.historyRosterProcessLoading
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	about: {
		padding: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 6,
		'& p': {
			marginTop: theme.spacing.unit * 2,
			marginBottom: theme.spacing.unit * 2
		}
	},
	history: {
		padding: 0,
		background: borderColor
	},
	titleSection: {
		borderBottom: '1px solid ' + borderColor,
		paddingBottom: theme.spacing.unit * 2,
		fontWeight: 700
	},
	historyTitle: {
		borderBottom: '1px solid ' + primaryColor
	},
	timeline: {
		'&::before': {
			background: primaryColor + ' !important'
		}
	},
	timelineBox: {
		'& .vertical-timeline-element-content': {
			padding: theme.spacing.unit + 'px ' + theme.spacing.unit * 2 + 'px !important',
			boxShadow: 'none',
			background: primaryColor
		},
		'& .vertical-timeline-element-content p': {
			margin: 0
		},
		'& .vertical-timeline-element-content .vertical-timeline-element-date': {
			padding: 0
		},
		'& .vertical-timeline-element-content-arrow': {
			borderRight: theme.spacing.unit + 'px solid ' + primaryColor,
			top: theme.spacing.unit + theme.spacing.unit / 2
		}
	},
	greenTimelineBox: {
		'& .vertical-timeline-element-content': {
			background: green
		},
		'& .vertical-timeline-element-content-arrow': {
			borderRight: theme.spacing.unit + 'px solid ' + green
		}
	},
	blueTimelineBox: {
		'& .vertical-timeline-element-content': {
			background: blueIMMAP
		},
		'& .vertical-timeline-element-content-arrow': {
			borderRight: theme.spacing.unit + 'px solid ' + blueIMMAP
		}
	},
	dateText: {
		fontSize: theme.spacing.unit * 2 + 'px !important',
		marginTop: theme.spacing.unit,
		color: white
	},
	addMarginTop: {
		marginTop: theme.spacing.unit * 2
	},
  borderLine: { border: `1px solid ${borderColor}` },
  applyBtn: {
	float: 'right'
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterProcess));
