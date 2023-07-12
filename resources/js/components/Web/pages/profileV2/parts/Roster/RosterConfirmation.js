import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { white } from  '../../../../config/colors';
import Typography from '@material-ui/core/Typography';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	overflowVisible: {
		overflow: 'visible'
	},
	loading: {
		color: 'red',
		animationDuration: '550ms',
		left: 0
	},
	loading2: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	removeButton: {
		position: 'absolute',
		left: '10px',
		bottom: '10px'
	}
});
class RosterConfirmation extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			open,
			handleClose,
			fullWidth,
			maxWidth,
			handleConfirm,
			scroll,
      classes,
      rosterTitle,
      rosterPopUpText
		} = this.props;
		let divider = scroll === 'paper' ? 'true' : 'false';
		return (
			<div>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					fullWidth={fullWidth}
					maxWidth={maxWidth}
					disableEnforceFocus
					PaperProps={{ style: { overflow: 'visible' } }}
				>
					<DialogTitle id="scroll-dialog-title">{rosterTitle} Application</DialogTitle>
					<DialogContent className={classes.about} dividers={divider}>
					<Typography dangerouslySetInnerHTML={{ __html: rosterPopUpText}}></Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="secondary" variant="contained">
							Close
						</Button>
            <Button onClick={()=>{handleConfirm(), handleClose()}} color="primary" variant="contained">
              Confirm
            </Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

RosterConfirmation.propTypes = {
  rosterTitle: PropTypes.string.isRequired,
  rosterPopUpText: PropTypes.string.isRequired,
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	loading: state.p11.loading
});

export default withStyles(styles)(connect(mapStateToProps)(RosterConfirmation));
