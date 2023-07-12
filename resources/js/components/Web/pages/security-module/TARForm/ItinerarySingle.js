import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import DatePickerField from '../../../common/formFields/DatePickerField'
import SelectField from '../../../common/formFields/SelectField'
import { white, borderColor, blueIMMAP, blueIMMAPRed, blueIMMAPGreen, blueIMMAPBlue, red } from '../../../config/colors'
import isEmpty from '../../../validations/common/isEmpty'
import { checkHighRisk } from '../../../redux/actions/security-module/iMMAPerTARFFormActions';
import YesNoField from '../../../common/formFields/YesNoField';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import DropzoneFileField from '../../../common/formFields/DropzoneFileField'
import {
  securityModuleTARFileURL,
  securityModuleTARDeleteFileURL,
  securityModuleTARFileCollection,
  acceptedDocFiles
} from "../../../config/general";
import { addFlashMessage } from '../../../redux/actions/webActions'
class ItinerarySingle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      date_travel: null,
      return_date_travel: '',
      from_country: '',
      from_city: '',
      to_country: '',
      to_city: '',
      flight_number : '',
      flight_number_outbound_trip: '',
      flight_number_return_trip: '',
      itineraryIndex: '',
      overnight: 0,
      overnight_explanation: '',
      is_high_risk: '0',
      high_risk_cities: [],
      outbound_trip_final_destination:0,
      check_in:0,
      check_in_outbound:0,
      check_in_return:0,
      need_government_paper: 'no',
      need_government_paper_now: '0',
      government_paper: '',
      government_paper_id: '',
    }

    this.onChange = this.onChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.setItinerary = this.setItinerary.bind(this);
    this.checkHighRiskCity = this.checkHighRiskCity.bind(this);
  }


  componentDidMount() {
    const { value, itineraryIndex } = this.props

    this.setState({
      id: value.id,
      date_travel: value.date_travel,
      return_date_travel: value.return_date_travel,
      from_country: value.from_country,
      from_city: value.from_city,
      to_country: value.to_country,
      to_city: value.to_city,
      flight_number : value.flight_number,
      flight_number_outbound_trip: value.flight_number_outbound_trip,
      flight_number_return_trip: value.flight_number_return_trip,
      itineraryIndex,
      overnight: value.overnight,
      overnight_explanation: value.overnight_explanation,
      is_high_risk: value.is_high_risk,
      outbound_trip_final_destination: value.outbound_trip_final_destination,
      check_in: value.check_in,
      check_in_outbound: value.check_in_outbound,
      check_in_return: value.check_in_return,
      need_government_paper: value.need_government_paper,
      need_government_paper_now: value.need_government_paper_now,
      government_paper: value.government_paper,
      government_paper_id: value.government_paper_id,
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({
        id: this.props.value.id,
        date_travel: this.props.value.date_travel,
        return_date_travel: this.props.value.return_date_travel,
        from_country: this.props.value.from_country,
        from_city: this.props.value.from_city,
        to_country: this.props.value.to_country,
        to_city: this.props.value.to_city,
        flight_number : this.props.value.flight_number,
        flight_number_outbound_trip: this.props.value.flight_number_outbound_trip,
        flight_number_return_trip: this.props.value.flight_number_return_trip,
        overnight: this.props.value.overnight,
        overnight_explanation: this.props.value.overnight_explanation,
        is_high_risk: this.props.value.is_high_risk,
        outbound_trip_final_destination: this.props.value.outbound_trip_final_destination,
        check_in: this.props.value.check_in,
        check_in_outbound: this.props.value.check_in_outbound,
        check_in_return: this.props.value.check_in_return,
        need_government_paper: this.props.value.need_government_paper,
        need_government_paper_now: this.props.value.need_government_paper_now,
        government_paper: this.props.value.government_paper,
        government_paper_id: this.props.value.government_paper_id,
      })
    }

    if (JSON.stringify(this.props.itineraryIndex) !== JSON.stringify(prevProps.itineraryIndex)) {
      this.setState({
        itineraryIndex: this.props.itineraryIndex
      })
    }
  }

  setItinerary(blankPaper = false) {
    this.props.onChange({
      value: {
        id: this.state.id,
        date_travel: isEmpty(this.state.date_travel) ? null : moment(this.state.date_travel).format('Y-MM-DD HH:mm:ss'),
        return_date_travel: isEmpty(this.state.return_date_travel) ? null : moment(this.state.return_date_travel).format('Y-MM-DD HH:mm:ss'),
        from_country: this.state.from_country,
        from_city: this.state.from_city,
        to_country: this.state.to_country,
        to_city: this.state.to_city,
        flight_number : this.state.flight_number,
        flight_number_outbound_trip: this.state.flight_number_outbound_trip,
        flight_number_return_trip: this.state.flight_number_return_trip,
        overnight: this.state.overnight,
        overnight_explanation: (this.state.overnight == 1 || this.state.overnight == '1') ? this.state.overnight_explanation : '',
        is_high_risk: this.state.is_high_risk,
        outbound_trip_final_destination: this.state.outbound_trip_final_destination,
        check_in: this.state.check_in,
        check_in_outbound: this.state.check_in_outbound,
        check_in_return: this.state.check_in_return,
        need_government_paper: this.state.need_government_paper,
        need_government_paper_now: this.state.need_government_paper_now,
        government_paper: this.state.need_government_paper !== 'yes' ? '' : blankPaper ? '' : this.state.government_paper,
        government_paper_id: this.state.need_government_paper !== 'yes' ? '' : blankPaper ? '' : isEmpty(this.state.government_paper) ? '' : this.state.government_paper.file_id,
      },
      itineraryIndex: this.state.itineraryIndex
    })
  }

  checkHighRiskCity(currentHighRisk, value) {
    const { high_risk_cities } = this.state
    let is_high_risk = currentHighRisk
    if (!isEmpty(high_risk_cities)) {
      return !isEmpty(high_risk_cities.find(city => city.city.toLowerCase() == value.toLowerCase())) ? '1' : '0'
    }

    return is_high_risk
  }

  async onChange(e) {

    if (e.target.name == 'to_country') {
      this.setState({ to_country: e.target.value }, () => {
        axios.get('/api/security-module/countries/' + e.target.value.value)
          .then(res => {
            const { high_risk_cities } = res.data.data
            this.setState({ high_risk_cities }, () => {
              let is_high_risk = this.checkHighRiskCity(res.data.data.is_high_risk.toString(), this.state.to_city)
              this.setState({ is_high_risk }, async () => {
                await this.setItinerary();
                this.props.checkHighRisk(is_high_risk);
              })
            })
          })
      })
    } else if (e.target.name == 'to_city') {
      let is_high_risk = this.checkHighRiskCity(this.state.is_high_risk.toString(), e.target.value)
      this.setState({ is_high_risk, to_city: e.target.value }, async () => {
        await this.setItinerary();
        this.props.checkHighRisk(is_high_risk);
      })
    } else {
      this.setState({ [e.target.name]: e.target.value == "Invalid date" ? '' : e.target.value }, async () => {
        await this.setItinerary();
      });

      if(e.target.name == 'check_in' || e.target.name == 'check_in_outbound' || e.target.name == 'check_in_return') {
         await this.setItinerary();
         await this.props.checkInConfirmation();
  
      }
    }
  }

  async onUpload(name, files) {
    if (!isEmpty(files)) {
      const { file_id, file_url, mime, filename } = files[0];
      this.setState({ [name]: { file_id, file_url, mime, filename } }, async () =>  await this.setItinerary());
      this.props.addFlashMessage({
        type: 'success',
        text: 'Your file succesfully uploaded'
      });
    } else {
      await this.setItinerary(true);
    }
  }

  async onDelete() {
    this.setState({ government_paper: '', government_paper_id: '' }, async () =>  await this.setItinerary(true));
  }

  render() {
    const { classes, moveArray, deleteConnection, isFirst, isLast, value, security_module_countries, itineraryIndex, disabled, width, travelType, legCount, status, isLoading, editFlightNumber, showCheckInBtn, isUnderSurgeProgram, isSecurity, isSbpMember } = this.props
    const { date_travel, return_date_travel, from_country, to_country, from_city, to_city, flight_number, flight_number_outbound_trip, flight_number_return_trip, overnight, 
             overnight_explanation, outbound_trip_final_destination, check_in, check_in_outbound, check_in_return, need_government_paper, need_government_paper_now, government_paper } = this.state
    const errors = !isEmpty(value.errors) ? value.errors : {}
    const isMobile = isWidthDown('sm', width)
    const hasRoundTrip = travelType == 'round-trip' ? true : false;
    const onlyOne = travelType == 'multi-location' ? false : true;
    const hasMultiLocationTrip = travelType == 'multi-location' ? true : false;
    const isOutbound = this.props.checkOutOfBoundMultiLocation() === true && outbound_trip_final_destination == 0 ?  true : false;
    const isTravelStart = moment(date_travel).format('YYYY-MM-DD') <=  moment(new Date()).format('YYYY-MM-DD') ? true : false;
    const isReturnTravelStart = moment(return_date_travel).format('YYYY-MM-DD') <=  moment(new Date()).format('YYYY-MM-DD') ? true : false;
    const underSurgeProgram = isSecurity ? isSbpMember : isUnderSurgeProgram;

    return (
      <Card className={isEmpty(errors) ? classes.card : classnames(classes.card, classes.cardError)} key={'connection-' + itineraryIndex}>
        <CardContent>
          <Grid container spacing={16} alignItems={isMobile ? "flex-start" : "stretch"} wrap={isMobile ? "wrap" : "nowrap"}>

            <Grid item xs={12} sm={hasRoundTrip ? 6 : 12} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3}>
              <DatePickerField
                id={"date-travel"}
                label={hasRoundTrip ? "Departure Date" : "Date"}
                name="date_travel"
                required
                fullWidth
                value={isEmpty(date_travel) ? null : moment(date_travel)}
                onChange={this.onChange}
                error={isEmpty(errors) && isEmpty(errors.date_travel) ? '' : errors.date_travel}
                margin="none"
                disabled={disabled}
              />
            </Grid>
            {hasRoundTrip && (
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <DatePickerField
                  id={"return-date-travel"}
                  label="Return Date"
                  name="return_date_travel"
                  fullWidth
                  value={isEmpty(return_date_travel) ? null : moment(return_date_travel)}
                  onChange={this.onChange}
                  error={isEmpty(errors) && isEmpty(errors.return_date_travel) ? '' : errors.return_date_travel}
                  margin="none"
                  disabled={disabled}
                  clearable={true}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3} style={{ marginTop: '-4px' }}>
              <SelectField
                id={"from-country"}
                label="From (Country)"
                name="from_country"
                required
                fullWidth
                placeholder="Select country"
                options={security_module_countries}
                value={from_country}
                onChange={(value) => this.onChange({ target: { name: "from_country", value } })}
                error={errors.from_country}
                margin="none"
                isDisabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3}>
              <TextField
                id={"from-city"}
                label="From (City)"
                placeholder="From (City)"
                name="from_city"
                required
                fullWidth
                value={from_city}
                onChange={this.onChange}
                error={!isEmpty(errors.from_city)}
                helperText={errors.from_city}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3} style={{ marginTop: '-4px' }}>
              <SelectField
                id={"to-country"}
                label="To (Country)"
                name="to_country"
                required
                fullWidth
                placeholder="Select country"
                options={security_module_countries}
                value={to_country}
                onChange={(value) => this.onChange({ target: { name: "to_country", value } })}
                error={errors.to_country}
                margin="none"
                isDisabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3}>
              <TextField
                id={"to-city"}
                label="To (City)"
                placeholder="To (City)"
                name="to_city"
                required
                fullWidth
                value={to_city}
                onChange={this.onChange}
                error={!isEmpty(errors.to_city)}
                helperText={errors.to_city}
                disabled={disabled}
              />
            </Grid>
            {!hasRoundTrip && (
              <Grid item xs={12} sm={6} md={hasRoundTrip ? 3 : 4} lg={hasRoundTrip ? 2 : 3}>
                <TextField
                  id={"flight-number"}
                  label="Flight Number"
                  placeholder="Flight Number"
                  name="flight_number"
                  fullWidth
                  value={flight_number === null ? '' : flight_number }
                  onChange={this.onChange}
                  error={!isEmpty(errors.flight_number)}
                  helperText={errors.flight_number}
                  disabled={disabled && editFlightNumber === false}
                />
              </Grid>
            )}
          </Grid>
          {hasRoundTrip && (
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  id={"flight-number-outbound-trip"}
                  label="Flight Number Outbound Trip"
                  placeholder="Flight Number Outbound Trip"
                  name="flight_number_outbound_trip"
                  fullWidth
                  value={flight_number_outbound_trip === null ? '' : flight_number_outbound_trip}
                  onChange={this.onChange}
                  error={!isEmpty(errors.flight_number_outbound_trip)}
                  helperText={errors.flight_number_outbound_trip}
                  disabled={disabled && editFlightNumber === false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  id={"flight-number-return-trip"}
                  label="Flight Number Return Trip"
                  placeholder="Flight Number Return Trip"
                  name="flight_number_return_trip"
                  fullWidth
                  value={flight_number_return_trip === null ? '' : flight_number_return_trip }
                  onChange={this.onChange}
                  error={!isEmpty(errors.flight_number_return_trip)}
                  helperText={errors.flight_number_return_trip}
                  disabled={disabled && editFlightNumber === false}
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={16}>
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
                      collectionName={securityModuleTARFileCollection}
                      apiURL={securityModuleTARFileURL}
                      deleteAPIURL={securityModuleTARDeleteFileURL}
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
        {!onlyOne && (
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
            <IconButton color="primary" className={classnames(classes.actionBtn, classes.addMarginRight)} onClick={() => moveArray("up", itineraryIndex)} disabled={isFirst || disabled}>
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton className={classnames(classes.actionBtn, classes.blueColor)} onClick={() => moveArray("down", itineraryIndex)} disabled={isLast || disabled}>
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
  classes: PropTypes.object.isRequired,
  isUnderSurgeProgram: PropTypes.bool.isRequired,
  moveArray: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  value: PropTypes.object,
  security_module_countries: PropTypes.array,
  itineraryIndex: PropTypes.number,
  disabled: PropTypes.bool,
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
  travelType: PropTypes.oneOf(['one-way-trip', 'round-trip', 'multi-location']),
  isLoading: PropTypes.bool,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  checkHighRisk,
  addFlashMessage,
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  security_module_countries: state.options.security_module_countries,
  is_high_risk: state.immaperTARForm.is_high_risk,
  isLoading: state.immaperTARForm.isLoading,
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
  addMarginBottom: {
    marginBottom: theme.spacing.unit * 1.5
  },
  addMarginTop: {
    marginTop: theme.spacing.unit * 2
  },
  block: {
    display: 'block'
  },
  radio: {
    display: 'inline-block'
  },
  blue: { color: blueIMMAP },
  grey: { color: 'rgba(0, 0, 0 ,0.38)'},
  blueIMMAP: {
    'background-color': blueIMMAP,
    color: white,
    '&:hover': {
      'background-color': '#005A9B'
    }
  }
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ItinerarySingle)))
