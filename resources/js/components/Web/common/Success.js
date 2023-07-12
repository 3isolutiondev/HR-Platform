import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	button: {
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700]
		},
		color: 'white'
	},
	check: {
		width: 70,
		height: 70,
		borderRadius: 70 / 2,
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700]
		},
		color: 'white',
		marginLeft: '40%',
		marginRight: '40%'
	},
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none',
		borderRadius: 10
	},
	center: {
		margin: 'auto'
	}
});
const Success = ({ isOpen, onClose, classes, continueHandler }) => {
	return (
		<Dialog
			open={isOpen}
			TransitionComponent={Transition}
			keepMounted
			onClose={onClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle id="alert-dialog-slide-title">
				<Grid container alignItems="flex-start" justify="flex-end" direction="row">
					<CheckIcon className={classes.check} />
				</Grid>
			</DialogTitle>
			<DialogContent>
				<DialogContentText component='div' id="alert-dialog-slide-description">
					<Typography style={{ textAlign: 'center' }} variant="h6" id="modal-title">
						Success
					</Typography>
					<Typography style={{ textAlign: 'center' }} variant="subtitle1" id="simple-modal-description">
						You have successfully completed your profile
					</Typography>
				</DialogContentText>
			</DialogContent>
			<DialogActions style={{ justifyContent: 'center' }}>
				<Button variant="contained" className={classes.button} onClick={continueHandler}>
					Continue
				</Button>
			</DialogActions>
		</Dialog>
	);
};

Success.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Success);
