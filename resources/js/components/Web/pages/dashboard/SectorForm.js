import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import isEmpty from '../../validations/common/isEmpty';
import YesNoField from '../../common/formFields/YesNoField';
import { setFormIsEdit, isValid, onChange, onSubmit } from '../../redux/actions/dashboard/sector/sectorActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';

// give loading

class SectorForm extends Component {
	componentDidMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		}
	}

	componentDidUpdate(prevProps) {
		const currentDashboardSector = JSON.stringify(this.props.dashboardSector);
		const prevDashboardSector = JSON.stringify(prevProps.dashboardSector);

		if (currentDashboardSector !== prevDashboardSector) {
			this.props.isValid();
		}
	}

	render() {
		let { name, is_approved, errors, isEdit, showLoading } = this.props.dashboardSector;

		const { classes, onSubmit, onChange, history } = this.props;

		return (
			<form onSubmit={(e) => onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Sector : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Sector'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Sector : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Sector'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Sector : ' + name}
								{!isEdit && 'Add Sector'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="normal"
								required
								fullWidth
								name="name"
								value={name}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_approved"
								label="Approve this sector"
								ariaLabel="is_approved"
								value={is_approved.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_approved"
								error={errors.is_approved}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								<Save /> Save{' '}
								{showLoading && (
									<CircularProgress thickness={5} size={22} className={classes.loading} />
								)}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</form>
		);
	}
}

SectorForm.propTypes = {
	setFormIsEdit: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	isValid: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	setFormIsEdit,
	isValid,
	onChange,
	onSubmit
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	dashboardSector: state.dashboardSector
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
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectorForm));
