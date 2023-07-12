/** import React and Prop Types  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI styles, Components and Icon */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Save from '@material-ui/icons/Save';

/** import React redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import {
	setFormIsEdit,
	onChange,
	isValid,
	onSubmit
} from '../../../redux/actions/dashboard/roster/rosterProcessActions';

/** import cofiguration value and validaton helper */
import isEmpty from '../../../validations/common/isEmpty';
import { APP_NAME } from '../../../config/general';
import { white } from '../../../config/colors';
import { quarter, campaignYears } from '../../../config/options';

/** import React Helmet for SEO purpose */
import { Helmet } from 'react-helmet';

/** import component needed on this component */
import RosterStepForm from './RosterStepForm';
import WysiwygField from '../../../common/formFields/WysiwygField';
import SelectField from '../../../common/formFields/SelectField';

/**
 * RosterProcessForm is a component to show Roster Process Form when adding or editing roster process
 *
 * @name RosterProcessForm
 * @component
 * @category Page
 *
 */
class RosterProcessForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      years: []
    }

    this.getData = this.getData.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.getData();
    this.setState({ years: campaignYears() });
	}

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	componentDidUpdate(prevProps) {
		const currentRosterProcess = JSON.stringify(this.props.rosterProcess);
		const prevRosterProcess = JSON.stringify(prevProps.rosterProcess);

		if (currentRosterProcess !== prevRosterProcess) {
			this.props.isValid();
		}

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.getData()
    }
	}

  getData() {
    if (typeof this.props.match.params.id !== 'undefined') {
			this.props.setFormIsEdit(true, this.props.match.params.id);
		} else {
      this.props.setFormIsEdit(false, null);
    }
  }

	render() {
		let {
			name,
			is_default,
      under_sbp_program,
      campaign_is_open,
      campaign_open_at_quarter,
      campaign_open_at_year,
      description,
      read_more_text,
			errors,
			isEdit,
			showLoading,
      skillsets,
      skillset
		} = this.props.rosterProcess;

		const { classes, onChange, history, onSubmit } = this.props;
    const { years } = this.state;
		return (
			<form onSubmit={(e) => onSubmit(e, history)}>
				<Helmet>
					<title>
						{isEdit ? (
							APP_NAME + ' - Dashboard > Edit Roster Process : ' + name
						) : (
							APP_NAME + ' - Dashboard > Add Roster Process'
						)}
					</title>
					<meta
						name="description"
						content={
							isEdit ? (
								APP_NAME + ' Dashboard > Edit Roster Process : ' + name
							) : (
								APP_NAME + ' Dashboard > Add Roster Process'
							)
						}
					/>
				</Helmet>
				<Paper className={classes.paper}>
					<Grid container spacing={16} alignItems="flex-start">
						<Grid item xs={12}>
							<Typography variant="h5" component="h3">
								{isEdit && 'Edit Roster Process : ' + name}
								{!isEdit && 'Add Roster Process'}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="name"
								label="Name"
								autoComplete="name"
								autoFocus
								margin="dense"
								required
								fullWidth
								name="name"
								value={name}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={!isEmpty(errors.name)}
								helperText={errors.name}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControlLabel
								control={
									<Checkbox
										checked={is_default === 1 ? true : false}
										name="is_default"
										color="primary"
										onChange={(e) => onChange(e.target.name, e.target.checked ? 1 : 0)}
									/>
								}
								label="Set as Default Roster Process"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControlLabel
								control={
									<Checkbox
										checked={under_sbp_program === "yes" ? true : false}
										name="under_sbp_program"
										color="primary"
										onChange={(e) => {
                      if (!isEmpty(skillsets)) {
                        onChange(e.target.name, e.target.checked ? "yes" : "no")
                        if (!e.target.checked) {
                          onChange('skillset', null)
                        }
                      }
                    }}
                    disabled={under_sbp_program === "no" && isEmpty(skillsets) ? true : false}
									/>
								}
								label="Set as Roster Process under Surge Program"
							/>
              {(under_sbp_program === "no" && isEmpty(skillsets)) && (
                <Typography color='primary' variant='body2'>You might not be able to set this roster process under surge program since all skillset has been selected to other roster process</Typography>
              )}
              {under_sbp_program === "yes" && (
                <SelectField
                  label="Skillset"
                  options={skillsets}
                  value={skillsets.find((s) => s.value === skillset)}
                  onChange={(value, e) => onChange(e.name, value.value)}
                  placeholder="Please select the skillset"
                  isMulti={false}
                  name="skillset"
                  fullWidth={true}
                  margin="dense"
                  error={errors.skillset}
                />
              )}
						</Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label="Open Roster Campaign"
                labelPlacement="start"
                style={{ marginLeft: 0, display: 'none' }}
                control={
                  <Switch
                    classes={{ switchBase: classes.switch }}
                    name="campaign_is_open"
                    checked={campaign_is_open === 'yes' ? true : false}
                    onChange={(e) => {
                      onChange(e.target.name, e.target.checked ? "yes" : "no")
                      if (e.target.checked) {
                        onChange('campaign_open_at_quarter', '');
                        onChange('campaign_open_at_year', '');
                      }
                    }}
                    color="primary"
                  />
                }
              />
            </Grid>
            {campaign_is_open === "no" && (
              <>
                <Grid item xs={12} sm={5} md={4} lg={3} xl={2} style={{ display: 'none' }}>
                  <SelectField
                    label="Next Opening Schedule (Quarter)"
                    options={quarter}
                    value={{ value: campaign_open_at_quarter, label: campaign_open_at_quarter}}
                    onChange={(value, e) => onChange(e.name, value.value) }
                    placeholder="Next Opening Schedule (Quarter)"
                    isMulti={false}
                    name="campaign_open_at_quarter"
                    fullWidth={true}
                    margin="dense"
                    error={errors.campaign_open_at_quarter}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4} lg={3} xl={2} style={{ display: 'none' }}>
                  <SelectField
                    label="Next Opening Schedule (Year)"
                    options={years}
                    value={{ value: campaign_open_at_year, label: campaign_open_at_year}}
                    onChange={(value, e) => onChange(e.name, value.value) }
                    placeholder="Next Opening Schedule (Year)"
                    isMulti={false}
                    name="campaign_open_at_year"
                    fullWidth={true}
                    margin="dense"
                    error={errors.campaign_open_at_year}
                  />
                </Grid>
              </>
            )}
						<Grid item xs={12}>
							<WysiwygField
								label="Description"
								margin="dense"
								name="description"
								value={description}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={errors.description}
							/>
						</Grid>
						<Grid item xs={12}>
							<WysiwygField
								label="Read More Text"
								margin="dense"
								name="read_more_text"
								value={read_more_text}
								onChange={(e) => onChange(e.target.name, e.target.value)}
								error={errors.read_more_text}
							/>
						</Grid>
						<Grid item xs={12}>
							<RosterStepForm />
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

RosterProcessForm.propTypes = {
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux action to call an api using POST HTTP Request
   */
	postAPI: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
	classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * rosterProcess is a prop containing roster process data
   */
  rosterProcess: PropTypes.object.isRequired,
  /**
   * setFormIsEdit is a redux action to set the form in edit mode
   */
  setFormIsEdit: PropTypes.func.isRequired,
  /**
   * onChange is a redux action to change the form data
   */
	onChange: PropTypes.func.isRequired,
  /**
   * isValid is a redux action to check if the form is valid
   */
	isValid: PropTypes.func.isRequired,
  /**
   * onSubmit is a redux action to submit the form
   */
	onSubmit: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage,
	setFormIsEdit,
	onChange,
	isValid,
	onSubmit
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	rosterProcess: state.rosterProcess.rosterProcess,
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
	},
  switch: { height: 'auto' }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RosterProcessForm));
