import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import Modal from '../../../common/Modal';
import isEmpty from '../../../validations/common/isEmpty';
import { white } from '../../../config/colors';

class iMMAPerForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_immap_inc: 0,
			showLoading: false,
			errors: {}
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
	}

	switchOnChange() {}

	handleClose() {
		this.props.dialogClose();
	}
	handleSave() {}

	handleRemove() {}

	render() {
		const { classes, isOpen } = this.props;
		const { errors, showLoading, is_immap_inc } = this.state;

		return (
			<Dialog
				open={isOpen}
				onClose={this.handleClose}
				aria-labelledby="already-immaper-box"
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>Already Consultant ?</DialogTitle>
				<DialogContent>
					<Grid container spacing={16}>
						<Grid item xs={12} sm={4}>
							<FormControl margin="none" error={!isEmpty(errors.is_immap_inc)}>
								<FormControlLabel
									control={
										<Checkbox
											checked={is_immap_inc === 1 ? true : false}
											name="is_immap_inc"
											color="primary"
											onChange={this.switchOnChange}
											className={classes.check}
										/>
									}
									label="iMMAP inc."
								/>
								{!isEmpty(errors.is_immap_inc) ? (
									<FormHelperText>{errors.is_immap_inc}</FormHelperText>
								) : null}
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.handleSave} color="primary" variant="contained" style={{ marginLeft: '5px' }}>
						<SaveIcon fontSize="small" className={classes.addMarginRight} /> Save{' '}
						{showLoading ? <CircularProgress className={classes.loading} size={22} thickness={5} /> : null}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginRight: {
		marginRight: theme.spacing.unit / 2
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	check: {
		padding: theme.spacing.unit + 'px ' + theme.spacing.unit + theme.spacing.unit / 2 + 'px'
	}
});

export default withStyles(styles)(iMMAPerForm);
