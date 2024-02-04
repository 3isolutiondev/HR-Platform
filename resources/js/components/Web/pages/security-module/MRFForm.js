import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { primaryColor, blueIMMAP, darkBlueIMMAP, red, redHover, green, greenHover, purple, purpleHover, white, secondaryColor } from '../../config/colors'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormHelperText from '@material-ui/core/FormHelperText'
import DoneIcon from '@material-ui/icons/Done'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import EditIcon from '@material-ui/icons/Edit'
import arrayMove from 'array-move';
import SelectField from '../../common/formFields/SelectField'
import YesNoField from '../../common/formFields/YesNoField'
import ItineraryField from './MRFForm/ItineraryField'
import TravelDetailsField from './MRFForm/TravelDetailsField';
import ButtonPicker from '../../common/formFields/ButtonPicker';
import {
  addConnection,
  deleteConnection,
  itineraryOnChange,
  onChange,
  isValid,
  selectOnChange,
  travelDetailsOnChange,
  addTravelDetail,
  deleteTravelDetail,
  resetForm,
  getData,
  resetItinerary,
  resetTravelDetail
} from '../../redux/actions/security-module/iMMAPerMRFFormActions'
import { getSecurityModuleCountries, getSecurityModuleMovements, getSecurityModuleMovementStates, getSecurityModuleSecurityMeasures } from '../../redux/actions/optionActions'
import { addFlashMessage } from '../../redux/actions/webActions'
import { postAPI } from '../../redux/actions/apiActions'
import {
  APP_NAME
} from "../../config/general";
import isEmpty from '../../validations/common/isEmpty'
import validator from 'validator'
import moment from 'moment'
import { security_module_all_travel_type, security_module_only_multilocation } from '../../config/options'
import { checkTransportationByVehicle } from '../../utils/helper';
import textSelector from "../../utils/textSelector";
import { securityLinkRiskLevels } from '../../config/general';


// Domestic Travel Request (MRF) Form > used by iMMAPer and Security
class MRFForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isView: false,
      isEdit: false,
      alertOpen: false,
      isSave: true,
      securityConfirm: false,
      editFlightNumber: false,
      checkInConfirm: false
    }

    this.itineraryOnChange = this.itineraryOnChange.bind(this)
    this.travelDetailsOnChange = this.travelDetailsOnChange.bind(this)
    this.moveup = this.moveup.bind(this)
    this.movedown = this.movedown.bind(this)
    this.moveupTravel = this.moveupTravel.bind(this)
    this.movedownTravel = this.movedownTravel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.saveProcess = this.saveProcess.bind(this)
    this.alertOpenClose = this.alertOpenClose.bind(this)
    this.showEdit = this.showEdit.bind(this)
    this.securityConfirmation = this.securityConfirmation.bind(this)
    this.travelTypeOnChange = this.travelTypeOnChange.bind(this)
    this.securityMeasureOnChange = this.securityMeasureOnChange.bind(this)
    this.firstMount = this.firstMount.bind(this)
    this.updateCheckIn = this.updateCheckIn.bind(this);
    this.checkInConfirmation = this.checkInConfirmation.bind(this);

  }

  componentWillMount() {
    const search =this.props.location.search;
    const params = new URLSearchParams(search);
    const editFlightNumber =  params.get('editFlightNumber')  === 'true' ? true : false;

    this.setState({
      isView: false,
      isEdit: false,
      securityView: false,
      editFlightNumber: editFlightNumber
    }, () => this.props.resetForm());
  }

  componentDidMount() {
    this.props.getSecurityModuleCountries()
    this.props.getSecurityModuleMovements()
    this.props.getSecurityModuleMovementStates()
    this.props.getSecurityModuleSecurityMeasures()

    this.firstMount()
  }

  componentDidUpdate(prevProps) {
    if (
      (JSON.stringify(prevProps.itineraries) !== JSON.stringify(this.props.itineraries)) ||
      (JSON.stringify(prevProps.travel_details) !== JSON.stringify(this.props.travel_details)) ||
      (JSON.stringify(prevProps.country) !== JSON.stringify(this.props.country)) ||
      (JSON.stringify(prevProps.risk_level) !== JSON.stringify(this.props.risk_level)) ||
      (prevProps.transportation_type !== this.props.transportation_type) ||
      (prevProps.purpose !== this.props.purpose) ||
      (prevProps.travel_type !== this.props.travel_type) ||
      (prevProps.criticality_of_the_movement !== this.props.criticality_of_the_movement) ||
      (prevProps.action !== this.props.action) ||
      (prevProps.revision_needed !== this.props.revision_needed) ||
      (prevProps.disapproved_reasons !== this.props.disapproved_reasons) ||
      (prevProps.approved_comments !== this.props.approved_comments) ||
      (prevProps.security_assessment !== this.props.security_assessment) ||
      (prevProps.movement_state !== this.props.movement_state) ||
      (prevProps.security_measure !== this.props.security_measure) ||
      (prevProps.vehicle_filled_by_yourself !== this.props.vehicle_filled_by_yourself)
    ) {
      this.props.isValid()
    }
  }

  firstMount() {
    if (typeof this.props.match.params.id !== 'undefined') {
      if (validator.isInt(this.props.match.params.id.toString())) {
        this.props.onChange('isLoading', true)
        this.props.getData(this.props.isSecurity, this.props.match.params.id)
        if (this.props.match.path === '/dom/:id/view') {
          this.setState({ isView: true })
        } else {
          this.setState({ isEdit: true });
        }
        if (this.props.match.path === '/dom/:id/security/view' || this.props.match.path === '/dom/:id/security/edit') {
          this.props.onChange('isSecurity', true)
        } else {
          this.props.onChange('isSecurity', false)
        }
        if (this.props.match.path === '/dom/:id/security/view') {
          this.setState({ securityView: true })
        } else {
          this.setState({ securityView: false })
        }
      }
    } else {
      if (this.props.match.path === "/dom/add") {
        this.props.onChange('isSecurity', false)
        this.setState({
          securityView: false,
          isView: false,
          isEdit: false
        }, () => this.props.isValid())
      }
    }
  }

  // Update itineraries data when there is a change in itinerary field
  async itineraryOnChange(itinerary, updateRoundTrip = false) {
    let { travel_type, transportation_type, itineraries } = this.props

    let itinerariesTemp = itineraries.map((item, index) => {
      if (index == itinerary.itineraryIndex) {
        return itinerary.value
      }

      return item;
    })

    await this.props.itineraryOnChange(itinerariesTemp)
    if (!updateRoundTrip) {
      if (travel_type == 'round-trip' && (transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && itinerary.itineraryIndex == 0) {
        let roundTripItineraries = {
          itineraryIndex: 1,
          value: {
            ...itinerariesTemp[1],
            from_city: itinerary.value.to_city,
            to_city: itinerary.value.from_city
          }
        }
        this.itineraryOnChange(roundTripItineraries, true)
      }
    }

  }

  // Move up the itinerary
  moveup(index) {
    let { itineraries } = this.props
    if (index > 0) {
      let newItineraries = [...itineraries]
      newItineraries = arrayMove(newItineraries, index, index - 1)
      this.props.itineraryOnChange(newItineraries)
    }
  }

  // Move down the itinerary
  movedown(index) {
    let { itineraries } = this.props
    if (index < itineraries.length - 1) {
      let newItineraries = [...itineraries]
      newItineraries = arrayMove(newItineraries, index, index + 1)
      this.props.itineraryOnChange(newItineraries)
    }
  }

  // Update travel details data when there is a change in itinerary field
  travelDetailsOnChange(travel_detail) {
    let { travel_details } = this.props

    let travelDetailsTemp = travel_details.map((item, index) => {
      if (index == travel_detail.travelDetailIndex) {
        return travel_detail.value
      }

      return item;
    })

    this.props.travelDetailsOnChange(travelDetailsTemp)
  }

  // Move up the travel detail
  moveupTravel(index) {
    let { travel_details } = this.props
    if (index > 0) {
      let newTravelDetails = [...travel_details]
      newTravelDetails = arrayMove(newTravelDetails, index, index - 1)
      this.props.travelDetailsOnChange(newTravelDetails)
    }
  }

  // Move down the travel detail
  movedownTravel(index) {
    let { travel_details } = this.props
    if (index < travel_details.length - 1) {
      let newTravelDetails = [...travel_details]
      newTravelDetails = arrayMove(newTravelDetails, index, index + 1)
      this.props.travelDetailsOnChange(newTravelDetails)
    }
  }

  // Save the form in save status
  onSave(e) {
    e.preventDefault()
    this.saveProcess(false);

  }

  // Save the from in submit / approve / need revision / disapprove status
  onSubmit(e) {
    e.preventDefault()
    this.saveProcess(true);
  }

  // Call the save api
  async saveProcess(isSubmit = false) {
    await this.props.isValid();
    if(this.state.editFlightNumber){
      await this.props.onChange('edit_flight_number', true);
    }

    const {
      errors,
      transportation_type,
      country,
      purpose,
      criticality_of_the_movement,
      travel_details,
      itineraries,
      action,
      revision_needed,
      disapproved_reasons,
      approved_comments,
      security_assessment,
      security_measure,
      movement_state,
      travel_type,
      isSecurity,
      security_measure_email,
      security_measure_smart24,
      security_measure_immap_careers,
      vehicle_filled_by_yourself,
      edit_flight_number,
      risk_level
    } = this.props

    const { isEdit } = this.state

    let mrfData = {
      transportation_type,
      country_id: country.value,
      country_name: country.label,
      vehicle_filled_by_immaper: country.vehicle_filled_by_immaper,
      purpose,
      itineraries,
      travel_type,
      vehicle_filled_by_yourself,
      edit_flight_number,
      risk_level: risk_level.value,
    }

    if (isSubmit) {
      mrfData.isSubmit = true
    }

    let mrfURL = '/api/security-module/mrf'

    if (isEdit && !isSecurity) {
      mrfData._method = 'PUT'
      mrfURL = mrfURL + '/' + this.props.match.params.id
    }

    if (!isEmpty(action) && isSecurity) {
      mrfURL = mrfURL + '/' + this.props.match.params.id + '/security-update'
    }

    if (transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') {
      mrfData.criticality_of_the_movement = criticality_of_the_movement
      mrfData.security_measure = security_measure
      mrfData.movement_state = movement_state
    }

    if (((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'yes') ||
      ((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'no' && vehicle_filled_by_yourself == 'yes') ||
      ((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'no' && isSecurity)) {
      mrfData.travel_details = travel_details
    }

    if (action == "revision") {
      mrfData.status = "revision"
      mrfData.revision_needed = revision_needed
    }

    if (action == "disapprove") {
      mrfData.status = "disapproved"
      mrfData.disapproved_reasons = disapproved_reasons
    }

    if (action == "approve") {
      mrfData.status = "approved";
      mrfData.approved_comments = approved_comments;
      mrfData.security_measure_email = security_measure_email;
      mrfData.security_measure_smart24 = security_measure_smart24;
      mrfData.security_measure_immap_careers = security_measure_immap_careers;
    }

    if (action == 'approve' && (transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel')) {
      mrfData.security_assessment = security_assessment
    }

    if (isEmpty(errors)) {
      this.props.onChange('isLoading', true)
      this.props.postAPI(mrfURL, mrfData)
        .then((res) => {
          this.props.onChange('isLoading', false)
          this.props.addFlashMessage({
            type: 'success',
            text: res.data.message
          });

          if (isSubmit || !isEdit || isSecurity) {
            if (isSecurity) {
              Cookies.set('backToSecurity', true, { expires: 2 });
            }
            this.setState({ alertOpen: false, securityConfirm: false }, () => {
              this.props.resetForm();
              if (isEdit && !isSecurity) {
                this.props.history.push('/travel?travel=all');
              } else {
                 window.history.go(-1);
              }
            })
          }
        })
        .catch((err) => {
          this.props.onChange('isLoading', false)
          this.props.addFlashMessage({
            type: 'error',
            text: 'Sorry, there is an error while processing your request'
          });
        })
    } else {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Please complete your form'
      })
    }
  }

  // Show confirmation dialog for iMMAPer
  alertOpenClose(e, isSave = true) {
    e.preventDefault()
    this.setState({ alertOpen: this.state.alertOpen ? false : true, isSave });
  }

  // Update the Security Actions data
  showEdit(action) {
    if (this.props.action === action) {
      this.props.onChange('action', '');
    } else {
      this.props.onChange('action', action);
    }

    switch (action) {
      case "disapprove":
        if (this.props.action === action) {
          if (!isEmpty(this.props.disapproved_reasons)) { this.props.onChange('disapproved_reasons', ''); }
        } else {
          if (!isEmpty(this.props.revision_needed)) { this.props.onChange('revision_needed', ''); }
          if (!isEmpty(this.props.approved_comments)) { this.props.onChange('approved_comments', ''); }
        }
        break;
      case "revision":
        if (this.props.action === action) {
          if (!isEmpty(this.props.revision_needed)) { this.props.onChange('revision_needed', ''); }
        } else {
          if (!isEmpty(this.props.approved_comments)) { this.props.onChange('approved_comments', ''); }
          if (!isEmpty(this.props.disapproved_reasons)) { this.props.onChange('disapproved_reasons', ''); }
        }
        break;
      case "approve":
        if (this.props.action === action) {
          if (!isEmpty(this.props.approved_comments)) { this.props.onChange('approved_comments', ''); }
        } else {
          if (!isEmpty(this.props.revision_needed)) { this.props.onChange('revision_needed', ''); }
          if (!isEmpty(this.props.disapproved_reasons)) { this.props.onChange('disapproved_reasons', ''); }
        }
        break;
      default:
        break;
    }
  }

  // Show confirmation dialog for Security Officer
  securityConfirmation() {
    const { securityConfirm } = this.state

    this.setState({ securityConfirm: securityConfirm ? false : true })
  }

  // function to change travel type data
  travelTypeOnChange(value) {
    let itineraries = this.props.itineraries;

    if (value == 'one-way-trip') {
      this.props.itineraryOnChange([itineraries[0]])
    } else if (value == 'round-trip' && this.props.transportation_type == 'ground-travel') {
      let roundTripItineraries = itineraries.filter((itinerary, index) => index === 0)
      roundTripItineraries = [...roundTripItineraries, {
        id: '',
        date_time: null,
        return_date_time: null,
        etd: null,
        from_city: itineraries[0]['to_city'],
        to_city: itineraries[0]['from_city'],
        eta: null,
        need_government_paper: 'no',
        need_government_paper_now: '0',
        government_paper: '',
        government_paper_id: '',
        overnight: '0',
        overnight_explanation: '',
        upload_air_ticket: 'no',
        upload_air_ticket_now: '0',
        air_ticket: '',
        air_ticket_id: '',
        flight_number: null,
        flight_number_outbound_trip: null,
        flight_number_return_trip: null,
        travelling_by: '',
        outbound_trip_final_destination: 0,
        check_in: 0,
        check_in_outbound: 0,
        check_in_return: 0
      }]
      this.props.onChange('itineraries', roundTripItineraries)
    } else if (value == 'multi-location' && this.props.transportation_type == 'air-and-ground-travel') {
      let multilocationAirAndGroundTripItineraries = [{
        id: '',
        date_time: null,
        return_date_time: null,
        etd: null,
        from_city: itineraries[0]['to_city'],
        to_city: itineraries[0]['from_city'],
        eta: null,
        need_government_paper: 'no',
        need_government_paper_now: '0',
        government_paper: '',
        government_paper_id: '',
        overnight: '0',
        overnight_explanation: '',
        upload_air_ticket: 'no',
        upload_air_ticket_now: '0',
        air_ticket: '',
        air_ticket_id: '',
        flight_number: null,
        flight_number_outbound_trip: null,
        flight_number_return_trip: null,
        travelling_by: 'Vehicle',
        outbound_trip_final_destination: 0,
        check_in: 0,
        check_in_outbound: 0,
        check_in_return: 0
      },
      {
        id: '',
        date_time: null,
        return_date_time: null,
        etd: null,
        from_city: itineraries[0]['to_city'],
        to_city: itineraries[0]['from_city'],
        eta: null,
        need_government_paper: 'no',
        need_government_paper_now: '0',
        government_paper: '',
        government_paper_id: '',
        overnight: '0',
        overnight_explanation: '',
        upload_air_ticket: 'no',
        upload_air_ticket_now: '0',
        air_ticket: '',
        air_ticket_id: '',
        flight_number: null,
        flight_number_outbound_trip: null,
        flight_number_return_trip: null,
        travelling_by: 'Flight',
        outbound_trip_final_destination: 0,
        check_in: 0,
        check_in_outbound: 0,
        check_in_return: 0
      }]
      this.props.onChange('itineraries', multilocationAirAndGroundTripItineraries);
    } else {
      this.props.itineraryOnChange(itineraries)
    }

    this.props.onChange('travel_type', value)
  }

  // function to change security measure data
  securityMeasureOnChange(value) {
    this.props.onChange('security_measure', value)
    let selectedMeasure = this.props.security_module_security_measures.find(measure => {
      return measure.value == value
    })
    let isMultiVehicle = selectedMeasure.is_multi_vehicle.toString() == '1' ? true : false
    this.props.onChange('multiVehicle', isMultiVehicle)
    if (!isMultiVehicle) {
      let singleTravelDetails = this.props.travel_details.filter((item, index) => index === 0)
      this.props.travelDetailsOnChange(singleTravelDetails)
    }
  }

  checkInConfirmation() {
    const { checkInConfirm } = this.state;

    this.setState({ checkInConfirm: checkInConfirm ? false : true });
  }

  async updateCheckIn() {
    let { itineraries, errors } = this.props;
    if (itineraries.length > 0) {
        itineraries = itineraries.map(({id, check_in, check_in_outbound, check_in_return}) => ({id, check_in, check_in_outbound, check_in_return}));
        let mrfData = { itineraries }
        let tarURL = '/api/security-module/mrf';

        mrfData._method = 'PUT';
        tarURL = tarURL + '/' + this.props.match.params.id + '/check-in';

        if (isEmpty(errors)) {
          this.props.onChange('isLoading', true)
          this.props.postAPI(tarURL, mrfData)
            .then((res) => {
              this.props.onChange('isLoading', false)
              this.props.addFlashMessage({
                type: 'success',
                text: res.data.message
              });
              this.checkInConfirmation();
            }).catch((err) => {
              this.props.onChange('isLoading', false)
              this.props.addFlashMessage({
                type: 'error',
                text: textSelector('error', 'default')
              });
            })
        } else {
          this.props.addFlashMessage({
            type: 'error',
            text: textSelector('error', 'incompleteForm')
          })
        }
    }
  }

  render() {
    const {
      classes,
      addConnection,
      deleteConnection,
      transportation_type,
      country,
      purpose,
      criticality_of_the_movement,
      addTravelDetail,
      deleteTravelDetail,
      errors,
      security_module_countries,
      security_module_movements,
      isLoading,
      submitted_date,
      isSecurity,
      immaper_name,
      immaper_line_manager,
      immaper_country_office,
      immaper_position,
      immaper_end_of_current_contract,
      last_edit,
      is_sbp_member,
      action,
      status,
      disapproved_reasons,
      approved_comments,
      security_measure_email,
      security_measure_smart24,
      security_measure_immap_careers,
      revision_needed,
      movement_state,
      security_module_movement_states,
      security_assessment,
      security_measure,
      security_module_security_measures,
      travel_type,
      multiVehicle,
      itineraries,
      travel_details,
      vehicle_filled_by_yourself,
      allTravellingTypes,
      allTravellingTypesWithFlight,
      allriskLevels,
      risk_level
    } = this.props;

    const { isView, isEdit, alertOpen, isSave, securityConfirm, securityView, checkVehicle, checkInConfirm, editFlightNumber } = this.state
    const metaText = (isView || securityView) ? APP_NAME + ' > View Domestic Request' : isEdit ? APP_NAME + ' > Edit Domestic Request' : APP_NAME + ' > New Domestic Request'
    const alreadySubmitted = !isEmpty(submitted_date) ? true : false
    const isDisabled = editFlightNumber ?  (isView || isSecurity || status == "approved" || status == "disapproved" ? true : false) : (isView || isSecurity || status == "disapproved" ? true : false);
    const showTravelDetails = ((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'yes') ||
      ((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'no' && vehicle_filled_by_yourself == 'yes') ||
      ((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && country.vehicle_filled_by_immaper == 'no' &&
        (isSecurity || securityView || (isView && status == 'approved'))) ? true : false
    return (
      <form onSubmit={alreadySubmitted ? this.onSubmit : this.onSave}>
        <Helmet>
          <title>{metaText}</title>
          <meta
            name="description"
            content={metaText}
          />
        </Helmet>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography color="secondary" className={classes.backBtn} to="#" onClick={() => { window.history.go(-1); }}>{'<< Back'}</Typography>
          </Grid>
          {isSecurity && (
            <Grid item xs={12} sm={isSecurity ? 4 : 12} md={isSecurity ? 3 : 12}>
              <div className={classes.detailBox}>
                <Typography variant="h6" color="primary" className={classes.detailTitle}>DETAILS</Typography>
                <hr className={classes.primaryBorder} style={{ marginBottom: '20px' }} />
                <Typography variant="subtitle1" color="secondary">Consultant : {immaper_name}</Typography>
                <Typography variant="subtitle1" color="secondary">Country Office : {immaper_country_office}</Typography>
                <Typography variant="subtitle1" color="secondary">Line Manager : {immaper_line_manager}</Typography>
                <Typography variant="subtitle1" color="secondary">Position : {immaper_position}</Typography>
                <Typography variant="subtitle1" color="secondary">End Of Contract : {moment(immaper_end_of_current_contract).format('DD/MM/YYYY')}</Typography>
                <Typography variant="subtitle1" color="secondary">Date of Submission : {moment(submitted_date).format('DD/MM/YYYY')}</Typography>
              </div>
            </Grid>
          )}
          <Grid item xs={12} sm={isSecurity ? 8 : 12} md={isSecurity ? 9 : 12}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Typography color="primary" variant="h6">{(isView || securityView) ? 'VIEW' : isEdit ? 'EDIT ' : 'NEW '} DOMESTIC REQUEST FORM</Typography>
              </Grid>
              <Grid item xs={12}>
                <hr className={classes.primaryBorder} style={{ marginBottom: 0 }} />
              </Grid>

              {status === "disapproved" && (
                <Grid item xs={12}><Typography variant="subtitle1" color="primary" className={classnames(classes.statusBox, classes.disapprovedStatus)}><CancelIcon /> Travel request is disapproved</Typography></Grid>
              )}
              {status === "approved" && (
                <Grid item xs={12}><Typography variant="subtitle1" color="primary" className={classnames(classes.statusBox, classes.approvedStatus)}><CheckIcon /> Travel request is approved</Typography></Grid>
              )}

              {status === "revision" && (
                <Grid item xs={12}><Typography variant="subtitle1" color="primary" className={classnames(classes.statusBox, classes.reviseStatus)}><EditIcon /> Need revision for this travel request</Typography></Grid>
              )}

              {!isSecurity && action == "disapprove" && !isEmpty(disapproved_reasons) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" className={classes.addSmallMarginBottom}>Reason & Comments</Typography>
                  <TextField
                    id="disapproved_reasons"
                    label="Reason & Comments"
                    multiline={true}
                    rows={5}
                    variant="outlined"
                    name="disapproved_reasons"
                    fullWidth
                    value={disapproved_reasons}
                    disabled={true}
                  />
                </Grid>
              )}

              {!isSecurity && action == "revision" && !isEmpty(revision_needed) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" className={classes.addSmallMarginBottom}>Revision Explanation</Typography>
                  <TextField
                    id="revision_needed"
                    label="Revision Explanation"
                    multiline={true}
                    rows={5}
                    variant="outlined"
                    name="revision_needed"
                    fullWidth
                    value={revision_needed}
                    disabled={true}
                  />
                </Grid>
              )}

              {!isSecurity && action == "approve" && status == "approved" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" className={classes.addSmallMarginBottom}>Comments & Recommendations</Typography>
                  <TextField
                    id="approved_comments"
                    label="Comments & Recommendations"
                    multiline={true}
                    rows={5}
                    variant="outlined"
                    name="approved_comments"
                    fullWidth
                    value={approved_comments}
                    disabled={true}
                  />
                </Grid>
              )}

              {!isEmpty(last_edit) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary">Last Edit By: {last_edit}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl className={classes.addMarginTop} error={!isEmpty(errors.transportation_type)} disabled={isDisabled}>
                  <FormLabel>Transportation Type:</FormLabel>
                  <RadioGroup
                    name="transportation_type"
                    value={transportation_type}
                    onClick={async(e) => {
                      if (!isDisabled) {
                        e.persist();
                        await this.props.onChange(e.target.name, e.target.value);
                        if(e.target.value == 'air-and-ground-travel'){
                          this.travelTypeOnChange('multi-location')
                        }else{
                          this.travelTypeOnChange('one-way-trip');
                        }
                        if(e.target.value != 'air-and-ground-travel'){
                          this.props.resetItinerary();
                          this.props.resetTravelDetail();
                        }
                        this.securityMeasureOnChange('single-vehicle-movement');
                      }
                    }}
                    className={classes.block}
                    disabled={isDisabled}
                  >
                    <FormControlLabel value="air-travel" control={<Radio className={classes.radio} />} label="Air Travel" />
                    <FormControlLabel value="ground-travel" control={<Radio className={classes.radio} />} label="Ground Travel" />
                    <FormControlLabel value="air-and-ground-travel" control={<Radio className={classes.radio} />} label="Air and Ground Travel" />
                  </RadioGroup>
                  {!isEmpty(errors.transportation_type) && <FormHelperText style={{ marginTop: 0 }}>{errors.transportation_type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  label="Select Country *"
                  options={security_module_countries}
                  value={country}
                  onChange={this.props.selectOnChange}
                  placeholder="Select country"
                  isMulti={false}
                  name="country"
                  error={errors.country}
                  required
                  fullWidth={true}
                  isDisabled={isDisabled}
                  margin="none"
                />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: '8px', marginTop: '8px' }}>
                <Typography color="primary" variant="subtitle1" className={!isEmpty(errors.purpose) ? classes.titleError : classes.title}>Purpose and Justification</Typography>
                <TextField
                  id="purpose"
                  label="Purpose and Justification"
                  multiline={true}
                  rows={2}
                  maxrows={5}
                  variant="outlined"
                  name="purpose"
                  required
                  fullWidth
                  value={purpose}
                  error={!isEmpty(errors.purpose)}
                  helperText={errors.purpose}
                  onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ButtonPicker
                  title="Type of Travel"
                  name="travel_type"
                  value={travel_type}
                  options={transportation_type != 'air-and-ground-travel' ? security_module_all_travel_type : security_module_only_multilocation }
                  onChange={(value) => this.travelTypeOnChange(value)}
                  error={errors.travel_type}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ItineraryField
                  title="ITINERARY"
                  value={itineraries}
                  addConnection={addConnection}
                  deleteConnection={(index) => deleteConnection(index)}
                  moveup={this.moveup}
                  movedown={this.movedown}
                  onChange={this.itineraryOnChange}
                  error={errors.itineraries}
                  disabled={isDisabled}
                  travelType={travel_type}
                  transportationType={transportation_type}
                  allTravellingTypes={allTravellingTypes}
                  allTravellingTypesWithFlight={allTravellingTypesWithFlight}
                  editFlightNumber={editFlightNumber}
                  status={status}
                  checkInConfirmation={this.checkInConfirmation}
                  showCheckInBtn={risk_level.value == 'High' || risk_level.value == 'Moderate' || is_sbp_member.toString() == '1' || is_sbp_member == 1 ? true : false}
                  airAndGroundError={errors.airAndGroundTravel}
                  isSbpMember={is_sbp_member.toString() == '1' || is_sbp_member == 1 ? true : false}
                  isSecurity={isSecurity}
                />
              </Grid>
              <Grid item xs={12}>
                <span className={classes.note}>Please follow this link to select the correct risk level for your travel: </span>
                <a href={securityLinkRiskLevels.link} className={classes.linked} target="_blank">
                {securityLinkRiskLevels.title}
								</a>
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  label="Select Risk Level *"
                  options={allriskLevels}
                  value={risk_level}
                  onChange={this.props.selectOnChange}
                  placeholder="Select risk level"
                  isMulti={false}
                  name="risk_level"
                  error={errors.risk_level}
                  required
                  fullWidth={true}
                  isDisabled={isDisabled}
                  margin="none"
                />
              </Grid>
              {(transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && (
                <Grid item xs={12}>
                  <ButtonPicker
                    title="Criticality of the Movement"
                    name="criticality_of_the_movement"
                    value={criticality_of_the_movement}
                    options={security_module_movements}
                    onChange={(value) => this.props.onChange('criticality_of_the_movement', value)}
                    error={errors.criticality_of_the_movement}
                    disabled={isDisabled}
                  />
                </Grid>
              )}
              {(transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') &&  checkTransportationByVehicle(itineraries) && (
                <Grid item xs={12}>
                  <ButtonPicker
                    title="Security Measures"
                    name="security_measure"
                    value={security_measure}
                    options={security_module_security_measures}
                    onChange={this.securityMeasureOnChange}
                    error={errors.security_measure}
                    disabled={isDisabled}
                  />
                </Grid>
              )}
              {((transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && checkTransportationByVehicle(itineraries) && country.vehicle_filled_by_immaper == 'no') && (
                <Grid item xs={12}>
                  <YesNoField
                    label={`${isSecurity ? 'Vehicle Details filled by Requester' : 'Fill Vehicle Details Now'}?`}
                    value={vehicle_filled_by_yourself == 'yes' ? '1' : '0'}
                    onChange={(e) => this.props.onChange(e.target.name, e.target.value == '1' ? 'yes' : 'no')}
                    name="vehicle_filled_by_yourself"
                    error={errors.vehicle_filled_by_yourself}
                    margin="dense"
                    disabled={isDisabled}
                  />
                </Grid>
              )}
              <Grid item xs={12} style={{ display: showTravelDetails && checkTransportationByVehicle(itineraries) ? 'block' : 'none' }}>
                <TravelDetailsField
                  title={security_measure == 'use-of-hire-car' ? 'HIRE CAR DETAILS' : 'VEHICLE DETAILS'}
                  value={travel_details}
                  addTravelDetail={addTravelDetail}
                  deleteTravelDetail={(index) => deleteTravelDetail(index)}
                  moveup={this.moveupTravel}
                  movedown={this.movedownTravel}
                  onChange={this.travelDetailsOnChange}
                  error={errors.travel_details}
                  transportationType={transportation_type}
                  disabled={(isView || (country.vehicle_filled_by_immaper == 'yes' && isSecurity) || securityView ||
                    (country.vehicle_filled_by_immaper == 'no' && isSecurity && vehicle_filled_by_yourself == 'yes') ? true : false)}
                  multiVehicle={multiVehicle}
                  vehicleCheck={checkTransportationByVehicle(itineraries)}
                  showTravelDetails={showTravelDetails}
                  securityMeasure={security_measure}
                />
              </Grid>

              {/* immaper  */}
              <Grid item xs={12}>
                {(!isDisabled || editFlightNumber) && (
                  <div className={classes.actionContainer}>
                    {!alreadySubmitted && (
                      <Button type="submit" variant="contained" color="secondary" className={classnames(classes.saveBtn, classes.addMarginRight, classes.actionBtn)} disabled={(!isEmpty(errors) || isLoading || isView) ? true : false}>
                        <SaveIcon className={classes.addMarginRight} /> Save
                        {isSave && isLoading && (
                          <span className={classes.circleLoading}><CircularProgress color="secondary" thickness={5} size={20} className={classes.circular} /></span>
                        )}
                      </Button>
                    )}
                    <Button type={alreadySubmitted ? "submit" : "button"} onClick={(e) => this.alertOpenClose(e, false)} variant="contained" color="primary" className={classes.actionBtn} disabled={(!isEmpty(errors) || isLoading || isView) ? true : false} >
                      {alreadySubmitted ? editFlightNumber ? 'Save flight number' : 'Resubmit ' : 'Submit '} <DoneIcon />
                    </Button>
                  </div>
                )}
              </Grid>
              {/* Security Officer */}
              {isSecurity && status !== "disapproved" && status !== "approved" && !securityView && (
                <Grid item xs={12} sm={6}>
                  <FormControl error={!isEmpty(errors.action)} disabled={securityView}>
                    <FormLabel>Security Action</FormLabel>
                    <RadioGroup
                      name="action"
                      value={action}
                      onClick={(e) => { if (!securityView) { this.showEdit(e.target.value) } }}
                      className={classes.block}
                    >
                      <FormControlLabel value="disapprove" control={<Radio className={classes.radio} />} label="Disapprove" />
                      <FormControlLabel value="revision" control={<Radio className={classes.radio} />} label="Needs Revision" />
                      <FormControlLabel value="approve" control={<Radio className={classes.radio} />} label="Approve" />
                    </RadioGroup>
                    {!isEmpty(errors.action) && <FormHelperText style={{ marginTop: 0 }}>{errors.action}</FormHelperText>}
                  </FormControl>
                </Grid>
              )}
              {isSecurity && (action == "disapprove" || action == "approve" || action == "revision") && (
                <Grid item xs={12}>
                  <Grid container spacing={16}>
                    {(transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && (
                      <Grid item xs={12}>
                        <ButtonPicker
                          title="Current Move Risk"
                          name="movement_state"
                          value={movement_state}
                          options={action == "disapprove" ? security_module_movement_states : security_module_movement_states.slice(0, -1)}
                          onChange={(value) => this.props.onChange('movement_state', value)}
                          error={errors.movement_state}
                          disabled={securityView}
                        />
                      </Grid>
                    )}
                    {(transportation_type == 'ground-travel' || transportation_type == 'air-and-ground-travel') && action == "approve" && (
                      <Grid item xs={12}>
                        <TextField
                          id="security_assessment"
                          label="Security Assessment"
                          placeholder="Type Explanation Here"
                          multiline={true}
                          rows={5}
                          variant="outlined"
                          name="security_assessment"
                          fullWidth
                          value={security_assessment}
                          error={!isEmpty(errors.security_assessment)}
                          helperText={errors.security_assessment}
                          onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                          disabled={status == "disapproved" || securityView}
                        />
                      </Grid>
                    )}
                    {action == "approve" && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" color={isView || status == "approved" || securityView ? "secondary" : "primary"} className={classes.addSmallMarginBottom}>Comments & Recommendations</Typography>
                      <TextField
                        id="approved_comments"
                        label="Type explanation here"
                        multiline={true}
                        rows={5}
                        variant="outlined"
                        name="approved_comments"
                        fullWidth
                        value={approved_comments}
                        error={!isEmpty(errors.approved_comments)}
                        helperText={errors.approved_comments}
                        onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                        disabled={status == "approved" || securityView}
                      />
                    </Grid>
                    )}
                    {(action == "approve" || status == "approved") && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color={isView || status == "approved" || securityView ? "secondary" : "primary"}>Security Measures Required</Typography>
                        <FormControl margin="none" style={{ 'display': 'block' }} error={!isEmpty(errors.security_measures_required)}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={security_measure_email.toString() === '1' ? true : false}
                                name="security_measure_email"
                                color="primary"
                                onChange={(e) => this.props.onChange(e.target.name, e.target.checked ? '1' : '0')}
                                className={classes.check}
                                disabled={status == "approved" || securityView}
                              />
                            }
                            label="Check-in on arrival via Email"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={security_measure_smart24.toString() === '1' ? true : false}
                                name="security_measure_smart24"
                                color="primary"
                                onChange={(e) => this.props.onChange(e.target.name, e.target.checked ? '1' : '0')}
                                className={classes.check}
                                disabled={status == "approved" || securityView}
                              />
                            }
                            label="Check-in on arrival via Mobile App"
                          />
                           <FormControlLabel
                            control={
                              <Checkbox
                                checked={security_measure_immap_careers.toString() === '1' ? true : false}
                                name="security_measure_immap_careers"
                                color="primary"
                                onChange={(e) => this.props.onChange(e.target.name, e.target.checked ? '1' : '0')}
                                className={classes.check}
                                disabled={status == "approved" || securityView}
                              />
                            }
                            label="Check-in on arrival via 3iSolution Careers"
                          />
                        </FormControl>
                        <FormControl margin="none" error={!isEmpty(errors.security_measures_required)}>
                          {!isEmpty(errors.security_measures_required) && (
                            <FormHelperText>{errors.security_measures_required}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
              {isSecurity && action == "disapprove" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={isView || status == "disapproved" || securityView ? "secondary" : "primary"} className={classes.addSmallMarginBottom}>Reason & Comments</Typography>
                  <TextField
                    id="disapproved_reasons"
                    label="Type explanation here"
                    multiline={true}
                    rows={5}
                    variant="outlined"
                    name="disapproved_reasons"
                    fullWidth
                    value={disapproved_reasons}
                    error={!isEmpty(errors.disapproved_reasons)}
                    helperText={errors.disapproved_reasons}
                    onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                    disabled={status == "disapproved" || securityView}
                  />
                </Grid>
              )}
              {isSecurity && action == "revision" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={isView || securityView ? "secondary" : "primary"} className={classes.addSmallMarginBottom}>Revision Explanation</Typography>
                  <TextField
                    id="revision_needed"
                    label="Type explanation here"
                    multiline={true}
                    rows={5}
                    variant="outlined"
                    name="revision_needed"
                    fullWidth
                    value={revision_needed}
                    error={!isEmpty(errors.revision_needed)}
                    helperText={errors.revision_needed}
                    onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                    disabled={securityView}
                  />
                </Grid>
              )}
              {!isSecurity && (action == "disapprove" || action == "approve" || action == "revision") && (status == "approved" || status == 'disapproved' || status == 'revision') && (
                <Grid item xs={12}>
                  <Grid container spacing={16}>
                    <Grid item xs={12}>
                      <ButtonPicker
                        title="Current Move Risk"
                        name="movement_state"
                        value={movement_state}
                        options={action == "disapprove" ? security_module_movement_states.slice(-1) : security_module_movement_states.slice(0, -1)}
                        onChange={(value) => this.props.onChange('movement_state', value)}
                        disabled={true}
                      />
                    </Grid>
                    {!isSecurity && action == "approve" && status == "approved" && (
                    <Grid item xs={12}>
                      <TextField
                        id="security_assessment"
                        label="Security Assessment"
                        placeholder="Type Explanation Here"
                        multiline={true}
                        rows={5}
                        variant="outlined"
                        name="security_assessment"
                        fullWidth
                        value={security_assessment}
                        disabled={true}
                      />
                    </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
              {isSecurity && (
                <Grid item xs={12} className={classes.textRight}>
                  {action == "disapprove" && status !== "disapproved" && !securityView && (
                    <Button variant="contained" className={classes.disapprovedBtn} onClick={this.securityConfirmation} disabled={isLoading || !isEmpty(errors)}>
                      <CloseIcon className={classes.addSmallMarginRight} /> Disapprove Travel Request
                      {isLoading && (
                        <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                      )}
                    </Button>
                  )}
                  {action == "revision" && !securityView && (
                    <Button variant="contained" className={classes.reviseBtn} onClick={this.securityConfirmation} disabled={isLoading || !isEmpty(errors)}>
                      <EditIcon className={classes.addSmallMarginRight} /> Set Travel Request as Need Revision
                      {isLoading && (
                        <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                      )}
                    </Button>
                  )}
                  {action == "approve" && status !== "approved" && !securityView && (
                    <Button variant="contained" className={classes.approvedBtn} onClick={this.securityConfirmation} disabled={isLoading || !isEmpty(errors)}>
                      <CheckIcon className={classes.addSmallMarginRight} /> Approve Travel Request
                      {isLoading && (
                        <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                      )}
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* iMMAPer Confirmation  */}
        <Dialog open={alertOpen} onClose={this.alertOpenClose}>
          <DialogTitle>Submit Confirmation</DialogTitle>
          <DialogContent><DialogContentText>Are you sure to {alreadySubmitted ? editFlightNumber ? 'save' : 'resubmit' : 'submit'}  { editFlightNumber ? 'the Flight Number' : 'your movement request'}  ?</DialogContentText></DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.alertOpenClose} color="secondary" disabled={isLoading}>
              <CancelIcon className={classes.addMarginRight} /> Cancel
            </Button>
            <Button variant="contained" onClick={this.onSubmit} color="primary" disabled={isLoading}>
              {alreadySubmitted ? editFlightNumber ? 'Save' : 'Resubmit' : 'submit'} <DoneIcon className={classes.addMarginLeft} />
              {isLoading && (
                <CircularProgress color="secondary" className={classes.addMarginLeft} thickness={5} size={22} disableShrink />
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Security Action Confirmation  */}
        <Dialog open={securityConfirm} onClose={this.securityConfirmation}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent><DialogContentText>Are you sure to {action == 'revision' ? 'set travel request to need revision' : action == 'disapprove' ? 'disapprove travel request' : 'approve travel request'} ?</DialogContentText></DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.securityConfirmation} color="secondary" disabled={isLoading}>
              <CancelIcon className={classes.addMarginRight} /> Cancel
            </Button>
            <Button variant="contained" onClick={this.onSubmit} color="primary" disabled={isLoading}>
              {action == 'revision' ? 'Need Revision' : action == 'disapprove' ? 'Disapprove' : 'Approve'}
              {isLoading && (
                <CircularProgress color="secondary" className={classes.addMarginLeft} thickness={5} size={22} disableShrink />
              )}
            </Button>
          </DialogActions>
        </Dialog>
         {/* check in Confirmation  */}
         <Dialog open={checkInConfirm} onClose={() => {this.checkInConfirmation(); this.props.getData(this.props.isSecurity, this.props.match.params.id)}}>
          <DialogTitle>Check-In Confirmation</DialogTitle>
          <DialogContent><DialogContentText>Please confirm you've safely arrived at the destination?</DialogContentText></DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => {this.checkInConfirmation(); this.props.getData(this.props.isSecurity, this.props.match.params.id)}} color="secondary" disabled={isLoading}>
              <CancelIcon className={classes.addMarginRight} /> Cancel
            </Button>
            <Button variant="contained" onClick={this.updateCheckIn} color="primary" disabled={isLoading}>
              I've safely arrived!
              {isLoading && (
                <CircularProgress color="secondary" className={classes.addMarginLeft} thickness={5} size={22} disableShrink />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </form >
    )
  }
}

MRFForm.propTypes = {
  addConnection: PropTypes.func.isRequired,
  deleteConnection: PropTypes.func.isRequired,
  itineraryOnChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  selectOnChange: PropTypes.func.isRequired,
  travelDetailsOnChange: PropTypes.func.isRequired,
  addTravelDetail: PropTypes.func.isRequired,
  deleteTravelDetail: PropTypes.func.isRequired,
  getSecurityModuleCountries: PropTypes.func.isRequired,
  getSecurityModuleMovements: PropTypes.func.isRequired,
  getSecurityModuleMovementStates: PropTypes.func.isRequired,
  getSecurityModuleSecurityMeasures: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,

  itineraries: PropTypes.array,
  itinerary: PropTypes.object,
  transportation_type: PropTypes.oneOf(['', 'air-travel', 'ground-travel', 'air-and-ground-travel']),
  country: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.object]),
  travel_type: PropTypes.oneOf(['', 'one-way-trip', 'round-trip', 'multi-location']),
  purpose: PropTypes.string,
  criticality_of_the_movement: PropTypes.oneOf(['', 'routine', 'essential', 'critical']),
  travel_details: PropTypes.array,
  travel_detail: PropTypes.object,
  vehicle_filled_by_yourself: PropTypes.oneOf(['yes', 'no', '']),
  errors: PropTypes.object,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  submitted_date: PropTypes.string,

  isSecurity: PropTypes.bool,

  immaper_name: PropTypes.string,
  immaper_line_manager: PropTypes.string,
  immaper_country_office: PropTypes.string,
  immaper_position: PropTypes.string,
  immaper_end_of_current_contract: PropTypes.string,
  last_edit: PropTypes.string,
  is_sbp_member: PropTypes.oneOf(['1', '0', 0, 1]),

  movement_state: PropTypes.oneOf(['', 'low-risk', 'moderate-risk', 'high-risk', 'lock-down']),
  status: PropTypes.oneOf(['', 'revision', 'approved', 'disapproved', 'saved', 'submitted']),
  action: PropTypes.oneOf(['', 'revision', 'approve', 'disapprove']),
  disapproved_reasons: PropTypes.string,
  approved_comments: PropTypes.string,
  security_measure_email: PropTypes.oneOf(['', '0', '1', 0, 1]),
  security_measure_smart24: PropTypes.oneOf(['', '0', '1', 0, 1]),
  security_measure_immap_careers: PropTypes.oneOf(['', '0', '1', 0, 1]),
  revision_needed: PropTypes.string,
  security_assessment: PropTypes.string,
  security_measure: PropTypes.oneOf(['', 'single-vehicle-movement', 'multiple-vehicle-movements','use-of-hire-car']),

  security_module_countries: PropTypes.array,
  security_module_movements: PropTypes.array,
  security_module_movement_states: PropTypes.array,
  security_module_security_measures: PropTypes.array
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  addConnection,
  deleteConnection,
  itineraryOnChange,
  onChange,
  isValid,
  selectOnChange,
  travelDetailsOnChange,
  addTravelDetail,
  deleteTravelDetail,
  getSecurityModuleCountries,
  getSecurityModuleMovements,
  getSecurityModuleMovementStates,
  getSecurityModuleSecurityMeasures,
  addFlashMessage,
  postAPI,
  resetForm,
  getData,
  resetItinerary,
  resetTravelDetail
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  itineraries: state.immaperMRFForm.itineraries,
  itinerary: state.immaperMRFForm.itinerary,
  transportation_type: state.immaperMRFForm.transportation_type,
  country: state.immaperMRFForm.country,
  travel_type: state.immaperMRFForm.travel_type,
  purpose: state.immaperMRFForm.purpose,
  criticality_of_the_movement: state.immaperMRFForm.criticality_of_the_movement,
  travel_details: state.immaperMRFForm.travel_details,
  travel_detail: state.immaperMRFForm.travel_detail,
  vehicle_filled_by_yourself: state.immaperMRFForm.vehicle_filled_by_yourself,
  errors: state.immaperMRFForm.errors,
  isEdit: state.immaperMRFForm.isEdit,
  isLoading: state.immaperMRFForm.isLoading,
  submitted_date: state.immaperMRFForm.submitted_date,
  allTravellingTypes: state.immaperMRFForm.allTravellingTypes,
  allTravellingTypesWithFlight: state.immaperMRFForm.allTravellingTypesWithFlight,
  edit_flight_number: state.immaperMRFForm.edit_flight_number,
  risk_level: state.immaperMRFForm.risk_level,


  isSecurity: state.immaperMRFForm.isSecurity,
  multiVehicle: state.immaperMRFForm.multiVehicle,

  immaper_name: state.immaperMRFForm.immaper_name,
  immaper_line_manager: state.immaperMRFForm.immaper_line_manager,
  immaper_country_office: state.immaperMRFForm.immaper_country_office,
  immaper_position: state.immaperMRFForm.immaper_position,
  immaper_end_of_current_contract: state.immaperMRFForm.immaper_end_of_current_contract,
  last_edit: state.immaperMRFForm.last_edit,
  is_sbp_member: state.immaperMRFForm.is_sbp_member,

  movement_state: state.immaperMRFForm.movement_state,
  status: state.immaperMRFForm.status,
  action: state.immaperMRFForm.action,
  disapproved_reasons: state.immaperMRFForm.disapproved_reasons,
  approved_comments: state.immaperMRFForm.approved_comments,
  security_measure_email: state.immaperMRFForm.security_measure_email,
  security_measure_smart24: state.immaperMRFForm.security_measure_smart24,
  security_measure_immap_careers: state.immaperMRFForm.security_measure_immap_careers,
  revision_needed: state.immaperMRFForm.revision_needed,
  security_assessment: state.immaperMRFForm.security_assessment,
  security_measure: state.immaperMRFForm.security_measure,
  allriskLevels: state.immaperMRFForm.allriskLevels,

  security_module_countries: state.options.security_module_countries,
  security_module_movements: state.options.security_module_movements,
  security_module_movement_states: state.options.security_module_movement_states,
  security_module_security_measures: state.options.security_module_security_measures,
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  primaryBorder: {
    border: '1px solid ' + primaryColor,
    width: '100%'
  },
  actionContainer: {
    float: 'right'
  },
  backBtn: {
    color: secondaryColor,
    width: 'fit-content',
    cursor: 'pointer',
    '&:hover': {
      borderBottom: '1px solid ' + secondaryColor
    }
  },
  saveBtn: {
    background: blueIMMAP,
    '&:hover': {
      background: darkBlueIMMAP
    }
  },
  addMarginTop: {
    marginTop: theme.spacing.unit
  },
  addMarginRight: {
    marginRight: theme.spacing.unit
  },
  addSmallMarginRight: {
    marginRight: theme.spacing.unit / 2
  },
  addMarginLeft: {
    marginLeft: theme.spacing.unit
  },
  actionBtn: {
    width: 'auto'
  },
  circleLoading: {
    marginLeft: theme.spacing.unit
  },
  circular: {
    verticalAlign: 'middle'
  },
  detailBox: {
    border: '1px solid ' + primaryColor,
    borderRadius: theme.spacing.unit / 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  detailTitle: {
    marginBottom: theme.spacing.unit - 1
  },
  disapprovedBtn: { background: red, color: white, '&:hover': { background: redHover } },
  reviseBtn: { background: purple, color: white, '&:hover': { background: purpleHover } },
  approvedBtn: { background: green, color: white, '&:hover': { background: greenHover } },
  radio: { display: 'inline-block' },
  block: { display: 'block' },
  textRight: { textAlign: 'right' },
  statusBox: {
    padding: theme.spacing.unit + 'px ' + (theme.spacing.unit * 2) + 'px',
    borderRadius: theme.spacing.unit / 2,
    color: white,
    marginTop: theme.spacing.unit,
    '& > svg': {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginTop: '-2px'
    }
  },
  disapprovedStatus: { background: red },
  approvedStatus: { background: green },
  reviseStatus: { background: purple },
  title: { color: 'rgba(0,0,0,0.54)', marginBottom: theme.spacing.unit },
  titleError: { color: red, marginBottom: theme.spacing.unit },
  linked: {
		color: '#4C4C4C',
		textDecoration: 'none',
    fontFamily: 'Barlow',
    fontWeight: 'bold'
	},
  note: {
    color: '#696969',
    fontWeight: 'bold',
    fontFamily: 'Barlow',
  }
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(MRFForm)))
