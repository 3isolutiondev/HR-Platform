import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import DatePickerField from '../../../common/formFields/DatePickerField'
import TimePickerField from '../../../common/formFields/TimePickerField'
import { white, borderColor, blueIMMAP, blueIMMAPRed, blueIMMAPGreen, blueIMMAPBlue, red } from '../../../config/colors'
import isEmpty from '../../../validations/common/isEmpty'
import DropzoneFileField from '../../../common/formFields/DropzoneFileField'
import SelectField from '../../../common/formFields/SelectField';
import YesNoField from '../../../common/formFields/YesNoField';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import {
  securityModuleMRFFileURL,
  securityModuleMRFDeleteFileURL,
  securityModuleMRFFileCollection,
  acceptedDocFiles
} from "../../../config/general";
import { addFlashMessage } from '../../../redux/actions/webActions'

class ItinerarySingle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      date_time: '',
      return_date_time: null,
      etd: null,
      from_city: '',
      to_city: '',
      eta: null,
      need_government_paper: 'no',
      need_government_paper_now: '0',
      government_paper: '',
      government_paper_id: '',
      itineraryIndex: '',
      overnight: '0',
      overnight_explanation: '',
      flight_number: '',
      flight_number_outbound_trip: '',
      flight_number_return_trip: '',
      travelling_by: '',
      outbound_trip_final_destination: 0,
      check_in:0,
      check_in_outbound:0,
      check_in_return:0
    }

    this.onChange = this.onChange.bind(this)
    this.onUpload = this.onUpload.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.dataManipulation = this.dataManipulation.bind(this)
  }

  componentDidMount() {
    const { value, itineraryIndex } = this.props
    this.setState({
      id: value.id,
      date_time: value.date_time,
      return_date_time: value.return_date_time,
      etd: value.etd,
      from_city: value.from_city,
      to_city: value.to_city,
      eta: value.eta,
      need_government_paper: value.need_government_paper,
      need_government_paper_now: value.need_government_paper_now,
      government_paper: value.government_paper,
      government_paper_id: value.government_paper_id,
      itineraryIndex,
      overnight: value.overnight,
      overnight_explanation: value.overnight_explanation,
      flight_number: value.flight_number,
      flight_number_outbound_trip: value.flight_number_outbound_trip,
      flight_number_return_trip: value.flight_number_return_trip,
      travelling_by: value.travelling_by,
      outbound_trip_final_destination: value.outbound_trip_final_destination,
      check_in: value.check_in,
      check_in_outbound: value.check_in_outbound,
      check_in_return: value.check_in_return
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({
        id: this.props.value.id,
        date_time: this.props.value.date_time,
        return_date_time: this.props.value.return_date_time,
        etd: this.props.value.etd,
        from_city: this.props.value.from_city,
        to_city: this.props.value.to_city,
        eta: this.props.value.eta,
        need_government_paper: this.props.value.need_government_paper,
        need_government_paper_now: this.props.value.need_government_paper_now,
        government_paper: this.props.value.government_paper,
        government_paper_id: this.props.value.government_paper_id,
        overnight: this.props.value.overnight,
        overnight_explanation: this.props.value.overnight_explanation,
        flight_number: this.props.value.flight_number,
        flight_number_outbound_trip: this.props.value.flight_number_outbound_trip,
        flight_number_return_trip: this.props.value.flight_number_return_trip,
        travelling_by: this.props.value.travelling_by,
        outbound_trip_final_destination: this.props.value.outbound_trip_final_destination,
        check_in: this.props.value.check_in,
        check_in_outbound: this.props.value.check_in_outbound,
        check_in_return: this.props.value.check_in_return
      })
    }

    if (JSON.stringify(this.props.itineraryIndex) !== JSON.stringify(prevProps.itineraryIndex)) {
      this.setState({
        itineraryIndex: this.props.itineraryIndex
      })
    }
  }

  async onChange(e) {
    this.setState({ [e.target.name]: e.target.value == "Invalid date" ? null : e.target.value }, async () => await this.props.onChange(this.dataManipulation()));

    if(e.target.name == 'check_in' || e.target.name == 'check_in_outbound' || e.target.name == 'check_in_return') {
      await this.props.onChange(this.dataManipulation());
      await this.props.checkInConfirmation();
   }
  }

  dataManipulation(blankPaper = false) {
    return {
      value: {
        id: this.state.id,
        date_time: isEmpty(this.state.date_time) ? null : moment(this.state.date_time).format('Y-MM-DD HH:mm:ss'),
        return_date_time: isEmpty(this.state.return_date_time) ? null : moment(this.state.return_date_time).format('Y-MM-DD HH:mm:ss'),
        etd: isEmpty(this.state.etd) ? null : this.state.etd,
        from_city: this.state.from_city,
        to_city: this.state.to_city,
        eta: isEmpty(this.state.etd) ? null : this.state.eta,
        need_government_paper: this.state.need_government_paper,
        need_government_paper_now: this.state.need_government_paper_now,
        government_paper: this.state.need_government_paper !== 'yes' ? '' : blankPaper ? '' : this.state.government_paper,
        government_paper_id: this.state.need_government_paper !== 'yes' ? '' : blankPaper ? '' : isEmpty(this.state.government_paper) ? '' : this.state.government_paper.file_id,
        overnight: this.state.overnight,
        overnight_explanation: (this.state.overnight == 1 && this.state.overnight == '1') ? !isEmpty(this.state.overnight_explanation) ? this.state.overnight_explanation : '' : '',
        flight_number: this.state.flight_number,
        flight_number_outbound_trip: this.state.flight_number_outbound_trip,
        flight_number_return_trip: this.state.flight_number_return_trip,
        travelling_by: this.state.travelling_by,
        outbound_trip_final_destination: this.state.outbound_trip_final_destination,
        check_in: this.state.check_in,
        check_in_outbound: this.state.check_in_outbound,
        check_in_return: this.state.check_in_return
      },
      itineraryIndex: this.state.itineraryIndex
    }
  }

  onUpload(name, files) {
    if (!isEmpty(files)) {
      const { file_id, file_url, mime, filename } = files[0];
      this.setState({ [name]: { file_id, file_url, mime, filename } }, () => this.props.onChange(this.dataManipulation()))

      this.props.addFlashMessage({
        type: 'success',
        text: 'Your file succesfully uploaded'
      });
    } else {
      this.props.onChange(this.dataManipulation(true))
    }
  }

  onDelete() {
    this.setState({ government_paper: '', government_paper_id: '' }, () => this.props.onChange(this.dataManipulation(true)))
  }


  render() {
    const { classes, moveup, movedown, deleteConnection, isFirst, isSecond,  isLast, value, disabled, travelType, transportationType, allTravellingTypes, legCount, status, isLoading, editFlightNumber, allTravellingTypesWithFlight, showCheckInBtn, isUnderSurgeProgram, isSbpMember, isSecurity  } = this.props
    const { date_time, return_date_time, from_city, to_city, government_paper, need_government_paper, need_government_paper_now, itineraryIndex, etd, eta,
      overnight, overnight_explanation, flight_number, flight_number_outbound_trip, flight_number_return_trip, travelling_by, outbound_trip_final_destination, check_in, check_in_outbound, check_in_return } = this.state
    const errors = !isEmpty(value.errors) ? value.errors : {}
    const hasRoundTrip = travelType == 'round-trip' ? true : false
    const isGroundTravel = transportationType == 'ground-travel' || transportationType == 'air-and-ground-travel' ? true : false
    const onlyOne = travelType == 'multi-location' ? false : true
    const smValue = isGroundTravel || !isGroundTravel && hasRoundTrip ? 3 : 4;
    const hasMultiLocationTrip = travelType == 'multi-location' ? true : false;
    const isOutbound = this.props.checkOutOfBoundMultiLocation() === true && outbound_trip_final_destination == 0 ?  true : false;
    const isTravelStart = moment(date_time).format('YYYY-MM-DD') <=  moment(new Date()).format('YYYY-MM-DD') ? true : false;
    const isReturnTravelStart = moment(return_date_time).format('YYYY-MM-DD') <=  moment(new Date()).format('YYYY-MM-DD') ? true : false;
    const travellingTypes = transportationType == 'air-and-ground-travel' ? allTravellingTypesWithFlight :  allTravellingTypes;
    const underSurgeProgram = isSecurity ? isSbpMember : isUnderSurgeProgram;
  
    return (
      <Card className={isEmpty(errors) ? classes.card : classnames(classes.card, classes.cardError)} key={'connection-' + itineraryIndex}>
        <CardContent>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={isGroundTravel ? 12 : hasRoundTrip ? 3 : 4} lg={isGroundTravel ? 2 : 3}>
              <DatePickerField
                id={"date-n-time-" + itineraryIndex}
                label={"Date"}
                name="date_time"
                value={
                  isEmpty(date_time) ? (
                    null
                  ) : (
                    moment(date_time)
                  )
                }
                usingSecond={false}
                usingTime={false}
                onChange={this.onChange}
                error={errors.date_time}
                margin="none"
                disabled={disabled}
              />
            </Grid>
            { (transportationType === 'ground-travel' || transportationType == 'air-and-ground-travel') &&
              <Grid item xs={12} sm={2} lg={isGroundTravel ? null : 2}>
                <SelectField
                  id={"travelling-by"}
                  label="Travelling By"
                  name="travelling_by"
                  required
                  fullWidth
                  placeholder="Select type of travelling"
                  options={travellingTypes}
                  value={{ label: travelling_by, value: travelling_by }}
                  onChange={(value) => this.onChange({ target: { name: "travelling_by", value: value.value } })}
                  error={errors.travelling_by}
                  margin="none"
                  isDisabled={disabled}
                />
             </Grid>  
            }
            {(transportationType == 'air-travel' || transportationType == '') && hasRoundTrip && (
              <Grid item xs={12} sm={3} lg={isGroundTravel ? null : 3}>
                <DatePickerField
                  id={"return-date-n-time-" + itineraryIndex}
                  label="Return Date"
                  name="return_date_time"
                  value={
                    isEmpty(return_date_time) ? (
                      null
                    ) : (
                      moment(return_date_time)
                    )
                  }
                  usingSecond={false}
                  usingTime={false}
                  onChange={this.onChange}
                  error={errors.return_date_time}
                  margin="none"
                  disabled={disabled}
                />
              </Grid>
            )}
            {(transportationType == 'ground-travel' || transportationType == 'air-and-ground-travel') && (
              <Grid item xs={12} sm={2} lg={isGroundTravel ? null : 2}>
                <TimePickerField
                  id={"etd" + itineraryIndex}
                  label={"Estimated Time Departure"}
                  name="etd"
                  value={isEmpty(etd) ? null : etd}
                  onChange={this.onChange}
                  error={errors.etd}
                  margin="none"
                  disabled={disabled}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={smValue} lg={isGroundTravel ? 2 : 3}>
              <TextField
                id={"from-city-" + itineraryIndex}
                label={isGroundTravel ? "From (City & Coordinates)" : "From (City)"}
                name="from_city"
                required
                fullWidth
                value={from_city}
                onChange={this.onChange}
                error={!isEmpty(errors.from_city)}
                helperText={errors.from_city}
                disabled={disabled || isGroundTravel && hasRoundTrip && itineraryIndex == 1}
              />
            </Grid>
            <Grid item xs={12} sm={smValue} lg={isGroundTravel ? 2 : 3}>
              <TextField
                id={"to-city-" + itineraryIndex}
                label={isGroundTravel ? "To (City & Coordinates)" : "To (City)"}
                name="to_city"
                required
                fullWidth
                value={to_city}
                onChange={this.onChange}
                error={!isEmpty(errors.to_city)}
                helperText={errors.to_city}
                disabled={disabled || isGroundTravel && hasRoundTrip && itineraryIndex == 1}
              />
            </Grid>
            {(transportationType == 'ground-travel' || transportationType == 'air-and-ground-travel') && (
              <Grid item xs={12} sm={2}>
                <TimePickerField
                  id={"eta" + itineraryIndex}
                  label={"Estimated Time Arrival"}
                  name="eta"
                  value={isEmpty(eta) ? null : (eta)}
                  onChange={this.onChange}
                  error={errors.eta}
                  margin="none"
                  disabled={disabled}
                />
              </Grid>
            )}
            {(transportationType == 'air-travel' || transportationType == '') && !hasRoundTrip && (
              <Grid item xs={12} sm={smValue} lg={isGroundTravel ? null : 3}>
                <TextField
                  id={"flight-number-" + itineraryIndex}
                  label={"Flight Number"}
                  name="flight_number"
                  fullWidth
                  value={flight_number === null ? '' : flight_number}
                  onChange={this.onChange}
                  error={!isEmpty(errors.flight_number)}
                  helperText={errors.flight_number}
                  disabled={(disabled && editFlightNumber === false) || isGroundTravel && hasRoundTrip && itineraryIndex == 1}
                />
              </Grid>
            )}
            {(transportationType == 'air-and-ground-travel' && travelling_by == 'Flight') && (
              <Grid item xs={12} sm={smValue} lg={isGroundTravel ? null : 3}>
                <TextField
                  id={"flight-number-" + itineraryIndex}
                  label={"Flight Number"}
                  name="flight_number"
                  fullWidth
                  value={flight_number === null ? '' : flight_number}
                  onChange={this.onChange}
                  error={!isEmpty(errors.flight_number)}
                  helperText={errors.flight_number}
                  disabled={disabled}
                />
              </Grid>
            )}
            {(transportationType == 'air-travel' || transportationType == '') && hasRoundTrip && (
              <>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    id={"flight-number-outbound-trip-" + itineraryIndex}
                    label={"Flight number outbound trip"}
                    name="flight_number_outbound_trip"
                    fullWidth
                    value={flight_number_outbound_trip === null ? '' : flight_number_outbound_trip}
                    onChange={this.onChange}
                    error={!isEmpty(errors.flight_number_outbound_trip)}
                    helperText={errors.flight_number_outbound_trip}
                    disabled={(disabled && editFlightNumber === false) || isGroundTravel && hasRoundTrip && itineraryIndex == 1}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    id={"flight-number-return-trip-" + itineraryIndex}
                    label={"Flight number return trip"}
                    name="flight_number_return_trip"
                    fullWidth
                    value={flight_number_return_trip === null ? '' : flight_number_return_trip}
                    onChange={this.onChange}
                    error={!isEmpty(errors.flight_number_return_trip)}
                    helperText={errors.flight_number_return_trip}
                    disabled={(disabled && editFlightNumber === false) || isGroundTravel && hasRoundTrip && itineraryIndex == 1}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={5} md={5}>
                <FormControl error={!isEmpty(errors.need_government_paper)} disabled={disabled} >
                  <FormLabel>Government Access Paper or UN Security Clearance Required</FormLabel>
                  <RadioGroup
                    name="need_government_paper"
                    value={need_government_paper}
                    onChange={this.onChange}
                    className={classes.block}
                  >
                    <FormControlLabel value="yes" control={<Radio className={classes.radio} />} label="Yes" disabled={disabled} />
                    <FormControlLabel value="no" control={<Radio className={classes.radio} />} label="No" disabled={disabled} />
                  </RadioGroup>
                  {!isEmpty(errors.need_government_paper) && <FormHelperText>{errors.need_government_paper}</FormHelperText>}
                </FormControl><br />
                {(need_government_paper == 'yes') && (
                  <div>
                    <FormControl error={!isEmpty(errors.need_government_paper_now)} disabled={disabled} >
                      <FormLabel>Attach Your Government Access Paper or UN Security Clearance Now?</FormLabel>
                      <RadioGroup
                        name="need_government_paper_now"
                        value={need_government_paper_now.toString()}
                        onChange={this.onChange}
                        className={classes.block}
                      >
                        <FormControlLabel value="1" control={<Radio className={classes.radio} />} label="Yes" disabled={disabled} />
                        <FormControlLabel value="0" control={<Radio className={classes.radio} />} label="No" disabled={disabled} />
                      </RadioGroup>
                      {!isEmpty(errors.need_government_paper_now) && <FormHelperText className={classes.noMarginTop}>{errors.need_government_paper_now}</FormHelperText>}
                    </FormControl><br />
                  </div>
                )}
                {(need_government_paper == 'yes' && underSurgeProgram == false && (need_government_paper_now == '0' || need_government_paper_now == 0)) && (
                  <Typography variant="subtitle1" color="primary" className={disabled ? classes.grey : classes.blue}>Please email your Government Access Papers or UN SC to your CSA or SFP prior to your mission. You should not travel without submitting these documents.</Typography>
                )}
                {(need_government_paper == 'yes' && (need_government_paper_now == '1' || need_government_paper_now == 1)) && (
                  <DropzoneFileField
                    name="government_paper"
                    label="Attach Your Government Access Paper or UN Security Clearance"
                    onUpload={this.onUpload}
                    onDelete={this.onDelete}
                    collectionName={securityModuleMRFFileCollection}
                    apiURL={securityModuleMRFFileURL}
                    deleteAPIURL={securityModuleMRFDeleteFileURL}
                    isUpdate={false}
                    filesLimit={1}
                    acceptedFiles={acceptedDocFiles}
                    gallery_files={
                      !isEmpty(government_paper) ? [government_paper] : []
                    }
                    error={errors.government_paper}
                    fullWidth={false}
                    disabled={disabled}
                    margin="none"
                  />
                )}
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <FormControl error={!isEmpty(errors.overnight)} disabled={disabled} >
                <FormLabel>Overnight Required</FormLabel>
                <RadioGroup
                  name="overnight"
                  value={overnight.toString()}
                  onChange={this.onChange}
                  className={classes.block}
                >
                  <FormControlLabel value="1" control={<Radio className={classes.radio} />} label="Yes" disabled={disabled} />
                  <FormControlLabel value="0" control={<Radio className={classes.radio} />} label="No" disabled={disabled} />
                </RadioGroup>
                {!isEmpty(errors.overnight) && <FormHelperText>{errors.overnight}</FormHelperText>}
              </FormControl><br />
              {(overnight === 1 || overnight === '1') && (
                <TextField
                  id="overnight_explanation"
                  label="Explanation"
                  multiline={true}
                  rows={2}
                  maxrows={5}
                  variant="outlined"
                  name="overnight_explanation"
                  fullWidth
                  value={overnight_explanation}
                  error={!isEmpty(errors.overnight_explanation)}
                  helperText={errors.overnight_explanation}
                  onChange={this.onChange}
                  disabled={disabled}
                />
              )}
            </Grid>
            {hasMultiLocationTrip && legCount > 1 && !isLast && (
              <Grid item xs={12} sm={4} md={4}>
                <YesNoField
                  label="Outbound Trip Final Destination?"
                  value={outbound_trip_final_destination.toString()}
                  onChange={this.onChange}
                  name="outbound_trip_final_destination"
                  error={errors.outbound_trip_final_destination}
                  margin="dense"
                  disabled={disabled ? disabled : isOutbound}
                />
						</Grid>
            )}
             {status === 'approved' && showCheckInBtn === true && (
              hasRoundTrip ?
                isGroundTravel === false ? 
                  <>
                    {isTravelStart && (
                        <Grid item xs={12} sm={3} md={3}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              className={classes.blueIMMAP}
                              disabled={isLoading || check_in_outbound == 1 ? true: false}
                              onClick={()=> this.onChange({ target: { name: "check_in_outbound", value: 1  } })}
                              >
                             <CheckIcon fontSize="small" />
                            { check_in_outbound  == 0 ? 'Check In Outbound Trip Now' : 'Checked In Outbound Trip'}
                           </Button>
                        </Grid>
                      )}
                      {isReturnTravelStart && (
                        <Grid item xs={12} sm={3} md={3}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              className={classes.blueIMMAP}
                              disabled={isLoading || check_in_return == 1 ? true: false}
                              onClick={()=> this.onChange({ target: { name: "check_in_return", value: 1  } })}
                          >
                          <CheckIcon fontSize="small" />
                            { check_in_return  == 0 ? 'Check In Return Trip Now' : 'Checked In Return Trip'}
                          </Button>
                        </Grid>
                      )}
                 </>
             :
             <>
             {isTravelStart && isFirst && (
                 <Grid item xs={12} sm={3} md={3}>
                      <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          className={classes.blueIMMAP}
                          disabled={isLoading || check_in_outbound == 1 ? true: false}
                          onClick={()=> this.onChange({ target: { name: "check_in_outbound", value: 1  } })}
                      >
                      <CheckIcon fontSize="small"/>
                         { check_in_outbound  == 0 ? 'Check In Outbound Trip Now' : 'Checked In Outbound Trip'}
                      </Button>
                 </Grid>
               )}
               {isTravelStart && isLast && (
                 <Grid item xs={12} sm={3} md={3}>
                      <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          className={classes.blueIMMAP}
                          disabled={isLoading || check_in_return == 1 ? true: false}
                          onClick={()=> this.onChange({ target: { name: "check_in_return", value: 1  } })}
                      >
                      <CheckIcon fontSize="small" />
                         { check_in_return  == 0 ? 'Check In Return Trip Now' : 'Checked In Return Trip'}
                      </Button>
                 </Grid>
               )}
              </>
             :
             <>
              {isTravelStart && (
                  <Grid item xs={12} sm={3} md={3}>
                       <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          className={classes.blueIMMAP}
                          disabled={isLoading || check_in == 1 ? true: false}
                          onClick={()=> this.onChange({ target: { name: "check_in", value: 1  } })}
                      >
                      <CheckIcon fontSize="small" />
                         { check_in  == 0 ? 'Check In Now' : 'Checked In'}
                      </Button>
                    </Grid>
                )}
              </>
            )}
          </Grid>
        </CardContent>
        {!onlyOne && !isFirst && !isSecond && (
          <Fab
            color="primary"
            size="small"
            className={classes.deleteBtn}
            onClick={() => deleteConnection(itineraryIndex)}
            disabled={disabled}
            classes={{ disabled: classes.deleteDisabled }}
          >
            <DeleteIcon />
          </Fab>
        )}
        {!onlyOne && (
          <div className={isEmpty(errors) ? classes.actionContainer : classnames(classes.actionContainer, classes.cardError)}>
            <IconButton color="primary" className={classnames(classes.actionBtn, classes.addMarginRight)} onClick={() => moveup(itineraryIndex)} disabled={isFirst || disabled}>
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton className={classnames(classes.actionBtn, classes.blueColor)} onClick={() => movedown(itineraryIndex)} disabled={isLast || disabled}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
        )}
      </Card>
    )
  }
}

ItinerarySingle.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  moveup: PropTypes.func.isRequired,
  movedown: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  value: PropTypes.object,
  disabled: PropTypes.bool,
  hasRoundTrip: PropTypes.bool,
  travelType: PropTypes.oneOf(['', 'one-way-trip', 'round-trip', 'multi-location']),
  transportationType: PropTypes.oneOf(['', 'air-travel', 'ground-travel', 'air-and-ground-travel']),
  allTravellingTypes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isUnderSurgeProgram: PropTypes.bool.isRequired,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  addFlashMessage
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
 const mapStateToProps = (state) => ({
  isLoading: state.immaperMRFForm.isLoading,
  isUnderSurgeProgram: state.auth.user.isUnderSurgeProgram
})

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
  block: {
    display: 'block'
  },
  radio: {
    display: 'inline-block'
  },
  noMarginTop: {
    marginTop: 0
  },
  blue: { color: blueIMMAP },
  grey: { color: 'rgba(0, 0, 0 ,0.38)' 
  },
  blueIMMAP: {
    'background-color': blueIMMAP,
    color: white,
    '&:hover': {
      'background-color': '#005A9B'
    }
  }
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ItinerarySingle))
