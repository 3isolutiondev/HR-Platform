import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { green, primaryColor, borderColor } from '../../../../config/colors';

const AcceptedRoster = ({ classes, verified_roster_count, verified_roster_process }) => (
	<div>
		{verified_roster_count > 0 ? verified_roster_process.map((roster_process, index) => {
				return (
					<Typography color="primary" variant="h6" key={'accepted-roster-' + index}>
						<span className={classes.successProcessText}>{roster_process.name}</span>
						<FontAwesomeIcon icon={faCheckCircle} size="sm" className={classes.successProcess} />{' '}
						{(index < verified_roster_count - 1 ) ? <div className={classes.divider} /> : null}
					</Typography>
				);
			}) : null }
	</div>
);

AcceptedRoster.propTypes = {
	verified_roster_count: PropTypes.number.isRequired,
	verified_roster_process: PropTypes.array.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	verified_roster_count: state.profileRosterProcess.verified_roster_count,
	verified_roster_process: state.profileRosterProcess.verified_roster_process
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	successProcess: {
		color: green
	},
	successProcessText: {
		color: primaryColor,
		marginRight: theme.spacing.unit
	},
	divider: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
		borderBottom: '1px solid ' + borderColor
	}
});

export default withStyles(styles)(connect(mapStateToProps, '')(AcceptedRoster));
