import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepLabel from '@material-ui/core/StepLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
// import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { getRosterProcess } from '../../../redux/actions/profile/rosterProcessActions';
import { green, secondaryColor } from '../../../config/colors';
// import AutoCompleteSingleValue from '../../../../common/formFields/AutoCompleteSingleValue';

class RosterDone extends Component {
	// componentDidMount() {
	// 	this.props.getRosterProcess();
	// }

	render() {
		const { profile_roster_process, classes } = this.props;

		return (
			<div>
				{profile_roster_process.length > 0 && (
					<Paper className={classes.paper}>
						<Grid container spacing={0}>
							{profile_roster_process.map((roster_process, index) => {
								if (roster_process.pivot.is_completed == 1 || roster_process.pivot.is_rejected == 1) {
									return (
										// <div>
										<Grid item xs={12} key={'roster-done-' + index}>
											{roster_process.pivot.is_completed == 1 && (
												<Typography variant="h6" component="h6" color="primary">
													{roster_process.name + ' : '}
													<FontAwesomeIcon
														icon={faCheckCircle}
														size="md"
														className={classes.successProcess}
													/>{' '}
													<span className={classes.successProcessText}>Verified Roster</span>
												</Typography>
											)}
											{/* : (
											<Typography variant="h6" component="h6" color="primary">
												{roster_process.name + ' : '}
												<FontAwesomeIcon icon={faTimesCircle} size="md" /> {'Not Roster'}
											</Typography>
										)} */}
										</Grid>
										// </div>
									);
								}
							})}
						</Grid>
					</Paper>
				)}
			</div>
		);
	}
}

RosterDone.propTypes = {
	profile_roster_process: PropTypes.array.isRequired,
	getRosterProcess: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getRosterProcess
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	profile_roster_process: state.profileRosterProcess.profile_roster_process
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		marginBottom: theme.spacing.unit * 3,
		padding: theme.spacing.unit * 2
	},
	successProcess: {
		color: green
	},
	successProcessText: {
		color: secondaryColor
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterDone));
