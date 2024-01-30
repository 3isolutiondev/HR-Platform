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
import YesNoField from '../../common/formFields/YesNoField';
import SelectField from '../../common/formFields/SelectField';
import {
	setFormIsEdit,
	isValid,
	onChange,
	onSubmit
} from '../../redux/actions/dashboard/immap-office/immapOfficeActions';
import { getCountries } from '../../redux/actions/optionActions';
import isEmpty from '../../validations/common/isEmpty';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white } from '../../config/colors';

class ImmapOfficeForm extends Component {
	componentDidMount() {
		this.props.getCountries();
		if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		}
	}

	componentDidUpdate(prevProps) {
		const currentDashboardImmapOffice = JSON.stringify(this.props.dashboardImmapOffice);
		const prevDashboardImmapOffice = JSON.stringify(prevProps.dashboardImmapOffice);

		if (currentDashboardImmapOffice !== prevDashboardImmapOffice) {
			this.props.isValid();
		}
	}

	render() {
		let { city, country, is_active, is_hq, errors, isEdit, showLoading } = this.props.dashboardImmapOffice;

		const { classes, onSubmit, onChange, history, countries } = this.props;

		return (
			<form onSubmit={(e) => onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit 3iSolution Office : ' + country.label
						) : (
							APP_NAME + ' - Dashboard > Add 3iSolution Office'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit 3iSolution Office : ' + country.label
							) : (
								APP_NAME + ' Dashboard > Add 3iSolution Office'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit iMMAP Office : ' + country.label}
								{!isEdit && 'Add iMMAP Office'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<SelectField
								id="country"
								label="Country *"
								margin="dense"
								options={countries}
								value={country}
								placeholder="Country"
								isMulti={false}
								onChange={(value) => onChange('country', value)}
								required={true}
								name="country"
								error={errors.country}
								fullWidth={true}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="city"
								label="City"
								name="city"
								placeholder="City"
								value={city}
								margin="dense"
								onChange={(e) => onChange(e.target.name, e.target.value)}
								required
								error={!isEmpty(errors.city)}
								helperText={errors.city}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_active"
								label="Office Active ? (Also Shown in P11 Form)"
								ariaLabel="is_active"
								value={is_active.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_active"
								error={errors.is_active}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12}>
							<YesNoField
								id="is_hq"
								label="Is Headquarter ?"
								ariaLabel="is_hq"
								value={is_hq.toString()}
								onChange={(e) => onChange(e.target.name, e.target.value == 1 ? 1 : 0)}
								name="is_hq"
								error={errors.is_hq}
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

ImmapOfficeForm.propTypes = {
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
	onSubmit,
	getCountries
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	dashboardImmapOffice: state.dashboardImmapOffice,
	countries: state.options.countries
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
		marginRight: theme.spacing.unit,
		marginLeft: theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ImmapOfficeForm));
