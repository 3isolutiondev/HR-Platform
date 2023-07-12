import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { white } from '../config/colors';

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

/**
 * ModalCommon is component to show a form inside a pop up modal.
 *
 * Put the form as a child component of this component.
 *
 * It has Close button to close the modal, Save button to save the form,
 * and Remove button to delete the existing data loaded inside the form.
 *
 * @name ModalCommon
 * @component
 * @category Common
 *
 */
class ModalCommon extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			open,
			handleClose,
			fullWidth,
			maxWidth,
			title,
			handleSave,
			scroll,
			classes,
			saveButton,
			handleRemove,
			remove
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
					scroll={scroll}
					disableEnforceFocus
					PaperProps={{ style: { overflow: 'visible' } }}
				>
					<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
					<DialogContent className={scroll === 'body' ? classes.overflowVisible : null} dividers={divider}>
						{this.props.children}
					</DialogContent>
					<DialogActions>
						{remove ? (
							<Button
								onClick={handleRemove}
								color="primary"
								className={classes.removeButton}
								justify="space-between"
							>
								Remove
							</Button>
						) : null}
						<Button onClick={handleClose} color="secondary" variant="contained">
							Close
						</Button>
						{saveButton === false ? null : (
							<Button onClick={handleSave} color="primary" variant="contained" autoFocus>
								Save{' '}
								{this.props.loading ? (
									<CircularProgress className={classes.loading2} size={22} thickness={5} />
								) : null}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			</div>
		);
	}
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

export default withStyles(styles)(connect(mapStateToProps)(ModalCommon));
