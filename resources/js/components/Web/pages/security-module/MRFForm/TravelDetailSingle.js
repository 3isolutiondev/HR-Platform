import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { white, borderColor, blueIMMAP, blueIMMAPRed, blueIMMAPGreen, blueIMMAPBlue, red } from '../../../config/colors'
import YesNoField from '../../../common/formFields/YesNoField'
import isEmpty from '../../../validations/common/isEmpty'

class TravelDetailSingle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      vehicle_make: '',
      vehicle_model: '',
      vehicle_color: '',
      vehicle_plate: '',
      comm_gsm: '',
      comm_sat_phone: '',
      comm_vhf_radio: '',
      comm_sat_tracker: '',
      ppe: '0',
      medical_kit: '0',
      personnel_on_board: '',
      travelDetailIndex: '',
      comm_vhf_radio_call_sign: '',
      company_name: '',
      company_email: '',
      company_phone_number: '',
      company_driver: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    const { value, travelDetailIndex } = this.props
    this.setState({
      id: value.id,
      vehicle_make: value.vehicle_make,
      vehicle_model: value.vehicle_model,
      vehicle_color: value.vehicle_color,
      vehicle_plate: value.vehicle_plate,
      comm_gsm: value.comm_gsm,
      comm_sat_phone: value.comm_sat_phone,
      comm_vhf_radio: value.comm_vhf_radio,
      comm_sat_tracker: value.comm_sat_tracker,
      ppe: value.ppe,
      medical_kit: value.medical_kit,
      personnel_on_board: value.personnel_on_board,
      travelDetailIndex,
      comm_vhf_radio_call_sign: value.comm_vhf_radio_call_sign,
      company_name: value.company_name,
      company_email: value.company_email,
      company_phone_number: value.company_phone_number,
      company_driver: value.company_driver
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({
        id: this.props.value.id,
        vehicle_make: this.props.value.vehicle_make,
        vehicle_model: this.props.value.vehicle_model,
        vehicle_color: this.props.value.vehicle_color,
        vehicle_plate: this.props.value.vehicle_plate,
        comm_gsm: this.props.value.comm_gsm,
        comm_sat_phone: this.props.value.comm_sat_phone,
        comm_vhf_radio: this.props.value.comm_vhf_radio,
        comm_sat_tracker: this.props.value.comm_sat_tracker,
        ppe: this.props.value.ppe,
        medical_kit: this.props.value.medical_kit,
        personnel_on_board: this.props.value.personnel_on_board,
        comm_vhf_radio_call_sign: this.props.value.comm_vhf_radio_call_sign,
        company_name: this.props.value.company_name,
        company_email: this.props.value.company_email,
        company_phone_number: this.props.value.company_phone_number,
        company_driver: this.props.value.company_driver,
      })
    }

    if (JSON.stringify(this.props.travelDetailIndex) !== JSON.stringify(prevProps.travelDetailIndex)) {
      this.setState({
        travelDetailIndex: this.props.travelDetailIndex
      })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.props.onChange({
      value: {
        id: this.state.id,
        vehicle_make: this.state.vehicle_make,
        vehicle_model: this.state.vehicle_model,
        vehicle_color: this.state.vehicle_color,
        vehicle_plate: this.state.vehicle_plate,
        comm_gsm: this.state.comm_gsm,
        comm_sat_phone: this.state.comm_sat_phone,
        comm_vhf_radio: this.state.comm_vhf_radio,
        comm_sat_tracker: this.state.comm_sat_tracker,
        ppe: this.state.ppe,
        medical_kit: this.state.medical_kit,
        personnel_on_board: this.state.personnel_on_board,
        comm_vhf_radio_call_sign: this.state.comm_vhf_radio_call_sign,
        company_name: this.state.company_name,
        company_email: this.state.company_email,
        company_phone_number: this.state.company_phone_number,
        company_driver: this.state.company_driver,
      },
      travelDetailIndex: this.state.travelDetailIndex
    }))
  }

  render() {
    const { classes, moveup, movedown, deleteTravelDetail, isFirst, isLast, value, disabled, width, multiVehicle, transportationType, vehicleCheck, showTravelDetails, securityMeasure } = this.props
    const {
      id,
      vehicle_make,
      vehicle_model,
      vehicle_color,
      vehicle_plate,
      comm_gsm,
      comm_sat_phone,
      comm_vhf_radio,
      comm_vhf_radio_call_sign,
      comm_sat_tracker,
      ppe,
      medical_kit,
      personnel_on_board,
      travelDetailIndex,
      company_name,
      company_email,
      company_phone_number,
      company_driver
    } = this.state
    const errors = isEmpty(this.props.error) ? {} : !isEmpty(value.errors) ? value.errors : {}

    return (
      <Card className={isEmpty(errors) ? classes.card : classnames(classes.card, classes.cardError)} key={'travel-detail-' + travelDetailIndex}>
        { securityMeasure == 'use-of-hire-car' ? 
         <CardContent>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                id={"company-name-" + travelDetailIndex}
                label="Name of Car Hire Company"
                name="company_name"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={company_name}
                onChange={this.onChange}
                error={!isEmpty(errors.company_name)}
                helperText={errors.company_name}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                id={"company-email-" + travelDetailIndex}
                label="Email address of Hire Company"
                name="company_email"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={company_email}
                onChange={this.onChange}
                error={!isEmpty(errors.company_email)}
                helperText={errors.company_email}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                id={"company-phone-number-" + travelDetailIndex}
                label="Telephone Number of Hire Company"
                name="company_phone_number"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={company_phone_number}
                onChange={this.onChange}
                error={!isEmpty(errors.company_phone_number)}
                helperText={errors.company_phone_number}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                id={"comapny-driver-" + travelDetailIndex}
                label="Driver Details"
                name="company_driver" 
                fullWidth
                value={company_driver}
                onChange={this.onChange}
                error={!isEmpty(errors.company_driver)}
                helperText={errors.company_driver}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </CardContent> : 
        <CardContent>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="subtitle1" className={disabled ? classnames(classes.addMarginBottom, classes.disabledText) : classes.addMarginBottom}>Vehicle</Typography>
              <TextField
                id={"vehicle-make-" + travelDetailIndex}
                label="Make"
                name="vehicle_make"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={vehicle_make}
                onChange={this.onChange}
                error={!isEmpty(errors.vehicle_make)}
                helperText={errors.vehicle_make}
                disabled={disabled}
              />
              <TextField
                id={"vehicle-model-" + travelDetailIndex}
                label="Model"
                name="vehicle_model"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={vehicle_model}
                onChange={this.onChange}
                error={!isEmpty(errors.vehicle_model)}
                helperText={errors.vehicle_model}
                disabled={disabled}
              />
              <TextField
                id={"vehicle-color-" + travelDetailIndex}
                label="Color"
                name="vehicle_color"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={vehicle_color}
                onChange={this.onChange}
                error={!isEmpty(errors.vehicle_color)}
                helperText={errors.vehicle_color}
                disabled={disabled}
              />
              <TextField
                id={"vehicle-plate-" + travelDetailIndex}
                label="Plate"
                name="vehicle_plate"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={vehicle_plate}
                onChange={this.onChange}
                error={!isEmpty(errors.vehicle_plate)}
                helperText={errors.vehicle_plate}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="subtitle1" className={disabled ? classnames(classes.addMarginBottom, classes.disabledText) : classes.addMarginBottom}>Communications</Typography>
              <TextField
                id={"comm-gsm-" + travelDetailIndex}
                label="GSM"
                name="comm_gsm"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={comm_gsm}
                onChange={this.onChange}
                error={!isEmpty(errors.comm_gsm)}
                helperText={errors.comm_gsm}
                disabled={disabled}
              />
              <TextField
                id={"comm-sat-phone-" + travelDetailIndex}
                label="Sat. Phone"
                name="comm_sat_phone"
                fullWidth
                value={comm_sat_phone}
                onChange={this.onChange}
                error={!isEmpty(errors.comm_sat_phone)}
                helperText={errors.comm_sat_phone}
                disabled={disabled}
              />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={12} md={6}>
                  <YesNoField
                    ariaLabel="VHF Radio"
                    label="VHF Radio"
                    value={comm_vhf_radio.toString()}
                    onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
                    name="comm_vhf_radio"
                    error={errors.comm_vhf_radio}
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Typography variant="subtitle1" style={{color: disabled || comm_vhf_radio.toString() === '0' ? 'grey' : 'black'}} className={classes.customLabel}>Call Sign</Typography>
                    <TextField
                      id={"comm-sat-phone-call_sign" + travelDetailIndex}
                      label=""
                      name="comm_vhf_radio_call_sign"
                      className={classes.customInput}
                      fullWidth
                      value={comm_vhf_radio_call_sign}
                      onChange={this.onChange}
                      error={!isEmpty(errors.comm_vhf_radio_call_sign)}
                      helperText={errors.comm_vhf_radio_call_sign}
                      disabled={disabled || comm_vhf_radio.toString() === '0'}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className={classes.negativeMarginTop}>
                  <YesNoField
                    ariaLabel="Sat Tracker"
                    label="Sat Tracker"
                    value={comm_sat_tracker.toString()}
                    onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
                    name="comm_sat_tracker"
                    error={errors.comm_sat_tracker}
                    disabled={disabled}
                    forTravelDetail={isWidthDown('sm', width) ? true : false}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <YesNoField
                    ariaLabel="PPE"
                    label="PPE"
                    value={isEmpty(ppe) ? '0' : ppe.toString()}
                    onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
                    name="ppe"
                    error={errors.ppe}
                    disabled={disabled}
                    margin="dense"
                    forTravelDetail={true}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <YesNoField
                    ariaLabel="Medical Kit"
                    label="Medical Kit"
                    value={isEmpty(medical_kit) ? '0' : medical_kit.toString()}
                    onChange={(e, value) => this.onChange({ target: { name: e.target.name, value } })}
                    name="medical_kit"
                    error={errors.medical_kit}
                    disabled={disabled}
                    margin="dense"
                    forTravelDetail={true}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="subtitle1" className={disabled ? classnames(classes.addMarginBottom, classes.disabledText) : classes.addMarginBottom}>Personnel On Board</Typography>
              <TextField
                id={"personnel-on-board-" + travelDetailIndex}
                label="Personnel on Board"
                name="personnel_on_board"
                required ={transportationType == 'ground-travel' && showTravelDetails && vehicleCheck ? true : false}
                fullWidth
                value={personnel_on_board}
                onChange={this.onChange}
                error={!isEmpty(errors.personnel_on_board)}
                helperText={errors.personnel_on_board}
                multiline={true}
                rows={8}
                variant="outlined"
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </CardContent>
        } 
        {(multiVehicle || securityMeasure == 'use-of-hire-car') && (
          <Fab
            color="primary"
            size="small"
            className={classes.deleteBtn}
            onClick={() => deleteTravelDetail(travelDetailIndex)}
            disabled={disabled}
            classes={{ disabled: classes.deleteDisabled }}
          >
            <DeleteIcon />
          </Fab>
        )}
        {(multiVehicle || securityMeasure == 'use-of-hire-car') && (
          <div className={isEmpty(errors) ? classes.actionContainer : classnames(classes.actionContainer, classes.cardError)}>
            <IconButton color="primary" className={classnames(classes.actionBtn, classes.addMarginRight)} onClick={() => moveup(travelDetailIndex)} disabled={isFirst || disabled}>
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton className={classnames(classes.actionBtn, classes.blueColor)} onClick={() => movedown(travelDetailIndex)} disabled={isLast || disabled}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
        )}
      </Card>
    )
  }

}

TravelDetailSingle.defaultProps = {
  error: ''
}

TravelDetailSingle.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  travelDetailIndex: PropTypes.number.isRequired,
  deleteTravelDetail: PropTypes.func.isRequired,
  movedown: PropTypes.func.isRequired,
  moveup: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  multiVehicle: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  card: {
    position: 'relative',
    overflow: 'visible',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 4,
    '&:first-of-type': {
      marginTop: theme.spacing.unit * 2
    },
    '&:last-of-type': {
      marginBottom: theme.spacing.unit * 2
    }
  },

  actionContainer: {
    position: 'absolute',
    top: '-23px',
    right: '28px',
    border: '1px solid ' + borderColor,
    borderRadius: theme.spacing.unit * 4,
    background: white,
    padding: theme.spacing.unit / 2
  },
  cardError: {
    borderColor: red
  },
  deleteBtn: {
    position: 'absolute',
    top: '-23px',
    right: '-18px'
  },
  deleteDisabled: {
    background: borderColor + ' !important'
  },
  actionBtn: {
    padding: theme.spacing.unit / 2
  },
  blueColor: {
    color: blueIMMAP,
    '&:hover': {
      backgroundColor: 'rgba(' + blueIMMAPRed + ', ' + blueIMMAPGreen + ', ' + blueIMMAPBlue + ', 0.08)'
    }
  },
  addMarginRight: {
    marginRight: theme.spacing.unit
  },
  addMarginBottom: {
    marginBottom: theme.spacing.unit
  },
  disabledText: { color: 'rgba(0, 0, 0, 0.38)' },

  [theme.breakpoints.up("md")]: {
  customLabel: {
    marginBottom: 0,
    marginTop: 10
  },
  customInput: {
    marginBottom: 10,
  },
  negativeMarginTop: {
    marginTop: -30
  }},
  [theme.breakpoints.down("sm")]: {
    customLabel: {
      marginBottom: 0,
      marginTop: -15
    },
    customInput: {
      marginBottom: 10,
    },
    negativeMarginTop: {
      marginTop: 10
    },
    reduceMarginBottom: {
      marginTop: 10
    }
  }
})

export default withWidth()(withStyles(styles)(TravelDetailSingle))
