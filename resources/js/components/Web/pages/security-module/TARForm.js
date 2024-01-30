import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { primaryColor, blueIMMAP, darkBlueIMMAP, red, redHover, purpleHover, greenHover, purple, green, white, secondaryColor } from '../../config/colors'
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
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import DoneIcon from '@material-ui/icons/Done'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import EditIcon from '@material-ui/icons/Edit'
import ItineraryField from './TARForm/ItineraryField'
import YesNoField from '../../common/formFields/YesNoField'
import ButtonPicker from '../../common/formFields/ButtonPicker';
import SelectField from '../../common/formFields/SelectField'
import {
  deleteConnection,
  addConnection,
  itineraryOnChange,
  onChange,
  isValid,
  selectOnChange,
  resetForm,
  getData
} from '../../redux/actions/security-module/iMMAPerTARFFormActions';
import { getSecurityModulePurposes, getSecurityModuleCountries } from '../../redux/actions/optionActions';
import { addFlashMessage } from '../../redux/actions/webActions'
import { postAPI } from '../../redux/actions/apiActions'
import { APP_NAME } from "../../config/general";
import { security_module_all_travel_type, security_module_default_travel_type } from '../../config/options'

import isEmpty from '../../validations/common/isEmpty';
import validator from 'validator';
import arrayMove from 'array-move'
import { can } from '../../permissions/can';
import textSelector from "../../utils/textSelector";
import { securityLinkRiskLevels } from '../../config/general';

// International Travel Request (TAR) Form > used by iMMAPer and Security
class TARForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isView: false,
      isEdit: false,
      isSave: true,
      redirectURL: '/profile?travel=all',
      alertOpen: false,
      securityConfirm: false,
      securityView: false,
      travelTypeList: [],
      editFlightNumber: false,
      checkInConfirm: false
    }

    this.itineraryOnChange = this.itineraryOnChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.saveProcess = this.saveProcess.bind(this)
    this.alertOpenClose = this.alertOpenClose.bind(this)
    this.moveArray = this.moveArray.bind(this)
    this.showEdit = this.showEdit.bind(this)
    this.securityConfirmation = this.securityConfirmation.bind(this)
    this.purposeOnChange = this.purposeOnChange.bind(this)
    this.setTravelTypeList = this.setTravelTypeList.bind(this)
    this.travelTypeOnChange = this.travelTypeOnChange.bind(this)
    this.firstMount = this.firstMount.bind(this)
    this.updateCheckIn = this.updateCheckIn.bind(this);
    this.checkInConfirmation = this.checkInConfirmation.bind(this);

  }

  componentWillMount() {
    const search =this.props.location.search;
    const params = new URLSearchParams(search);
    const editFlightNumber =  params.get('editFlightNumber')  === 'true' ? true : false;

    this.setState({ isView: false, isEdit: false, editFlightNumber: editFlightNumber }, () => this.props.resetForm())
  }

  componentDidMount() {
    this.props.getSecurityModuleCountries()
    this.props.getSecurityModulePurposes()
    this.firstMount()
  }

  componentDidUpdate(prevProps) {
    if (
      (JSON.stringify(prevProps.itineraries) !== JSON.stringify(this.props.itineraries)) ||
      (JSON.stringify(prevProps.risk_level) !== JSON.stringify(this.props.risk_level)) ||
      (prevProps.action !== this.props.action) ||
      (prevProps.revision_needed !== this.props.revision_needed) ||
      (prevProps.disapproved_reasons !== this.props.disapproved_reasons) ||
      (prevProps.approved_comments !== this.props.approved_comments)
    ) {
      this.props.isValid()
    }

    if (prevProps.travel_type !== this.props.travel_type ||
      prevProps.travel_purpose !== this.props.travel_purpose ||
      prevProps.security_module_purposes !== this.props.security_module_purposes
    ) {
      this.setTravelTypeList(this.props.travel_purpose, true);
    }
  }

  // funtion to setup this form when the page is load
  firstMount() {
    const security_edit_path = '/int/:id/security/edit';
    const security_view_path = '/int/:id/security/view';
    if (typeof this.props.match.params.id !== 'undefined') {
      if (validator.isInt(this.props.match.params.id.toString())) {
        this.props.onChange('isLoading', true)
        this.props.getData(this.props.isSecurity, this.props.match.params.id)
        if (this.props.match.path === '/int/:id/view') {
          this.setState({ isView: true })
        } else if (this.props.match.path === security_edit_path || this.props.match.path === security_view_path) {
          this.setState({ isEdit: false, isView: false })
          this.props.onChange('action', '')
        } else {
          this.setState({ isEdit: true })
        }
        if (this.props.match.path === security_view_path || this.props.match.path === security_edit_path) {
          this.props.onChange('isSecurity', true)
        } else {
          this.props.onChange('isSecurity', false)
        }
        if (this.props.match.path === security_view_path) {
          this.setState({ securityView: true })
        }
      }
    } else {
      if (this.props.match.path === "/int/add") {
        this.props.onChange('isSecurity', false)
        this.props.onChange('action', '')
        this.props.onChange('travel_purpose', 'leave')
        this.setState({
          securityView: false,
          isView: false,
          isEdit: false
        }, () => this.setTravelTypeList('leave', true))
      }
    }

    this.setState({ travelTypeList: security_module_default_travel_type })
  }

  // Update itineraries data when there is a change in itinerary field
  itineraryOnChange(itinerary) {
    let itineraries = this.props.itineraries.map((item, index) => {
      if (index == itinerary.itineraryIndex) {
        return itinerary.value
      }
      return item
    })
    this.props.itineraryOnChange(itineraries)
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
      travel_purpose,
      itineraries,
      remarks,
      action,
      revision_needed,
      disapproved_reasons,
      approved_comments,
      isSecurity,
      travel_type,
      is_high_risk,
      heat_certificate,
      security_measure_email,
      security_measure_smart24,
      security_measure_immap_careers,
      edit_flight_number,
      risk_level
    } = this.props

    const { isEdit } = this.state

    let tarData = {
      travel_purpose,
      itineraries,
      remarks,
      travel_type,
      is_high_risk,
      heat_certificate,
      edit_flight_number,
      risk_level: risk_level.value,
    }
    if (isSubmit) {
      tarData.isSubmit = true
    }

    let tarURL = '/api/security-module/tar'

    if (isEdit && !isSecurity) {
      tarData._method = 'PUT'
      tarURL = tarURL + '/' + this.props.match.params.id
    }

    if (!isEmpty(action) && isSecurity) {
      tarURL = tarURL + '/' + this.props.match.params.id + '/security-update'
    }

    if (action == "revision") {
      tarData.status = "revision"
      tarData.revision_needed = revision_needed
    }

    if (action == "disapprove") {
      tarData.status = "disapproved"
      tarData.disapproved_reasons = disapproved_reasons
    }

    if (action == "approve") {
      tarData.status = "approved"
      tarData.approved_comments = approved_comments,
        tarData.security_measure_email = security_measure_email,
        tarData.security_measure_smart24 = security_measure_smart24,
        tarData.security_measure_immap_careers = security_measure_immap_careers
    }

    if (isEmpty(errors)) {
      this.props.onChange('isLoading', true)
      this.props.postAPI(tarURL, tarData)
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
    this.setState({ alertOpen: this.state.alertOpen ? false : true, isSave })
  }

  // Move down the itinerary
  moveArray(upordown, index) {
    let { itineraries } = this.props
    let newIndex = (index > 0 && upordown == "up") ? index - 1 : (index < itineraries.length - 1 && upordown == "down") ? index + 1 : index
    if (index != newIndex) {
      let newItineraries = [...itineraries]
      newItineraries = arrayMove(newItineraries, index, newIndex)
      this.props.itineraryOnChange(newItineraries)
    }
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

  /** Function to change Travel Purpose data */
  purposeOnChange(value) {
    this.props.onChange('travel_purpose', value)
    this.setTravelTypeList(value);
  }

  /** Function to set travelTypeList data and check if travel purpose has round trip */
  setTravelTypeList(value, checkValid = false) {
    let selectedPurpose = this.props.security_module_purposes.find(purpose => {
      return purpose.value == value
    })
    if (!isEmpty(selectedPurpose)) {
      let travelTypeList = selectedPurpose.has_round_trip == 0 || selectedPurpose.has_round_trip == "0" ? security_module_default_travel_type : security_module_all_travel_type
      if (checkValid) {
        this.setState({ travelTypeList }, () => this.props.isValid())
      } else {
        if (selectedPurpose.has_round_trip == 0) {
          if (this.props.travel_type == 'round-trip') {
            this.props.onChange('travel_type', 'one-way-trip')
          }
          this.props.onChange('return_date_travel', null)
        }
        this.setState({ travelTypeList })
      }
    }
  }

  /** Function to change travel_type and modified itineraries data based on the travel_type */
  travelTypeOnChange(value) {
    let itineraries = this.props.itineraries.map(itinerary => {
      const newItinerary = { ...itinerary, return_date_travel: '' }
      return newItinerary
    })

    if (value !== 'multi-location') {
      this.props.itineraryOnChange([itineraries[0]])
    } else {
      this.props.itineraryOnChange(itineraries)
    }
    this.props.onChange('travel_type', value)
  }

  checkInConfirmation() {
    const { checkInConfirm } = this.state;

    this.setState({ checkInConfirm: checkInConfirm ? false : true });
  }

  async updateCheckIn() {
    let { itineraries, errors } = this.props;
    if (itineraries.length > 0) {
        itineraries = itineraries.map(({id, check_in, check_in_outbound, check_in_return}) => ({id, check_in, check_in_outbound, check_in_return}));
        let tarData = { itineraries }
        let tarURL = '/api/security-module/tar';

        tarData._method = 'PUT';
        tarURL = tarURL + '/' + this.props.match.params.id + '/check-in';

        if (isEmpty(errors)) {
          this.props.onChange('isLoading', true)
          this.props.postAPI(tarURL, tarData)
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
      deleteConnection,
      addConnection,
      travel_purpose,
      remarks,
      errors,
      security_module_purposes,
      isLoading,
      submitted_date,
      isSecurity,
      disapproved_reasons,
      revision_needed,
      approved_comments,
      security_measure_email,
      security_measure_smart24,
      security_measure_immap_careers,
      immaper_name,
      immaper_line_manager,
      immaper_country_office,
      immaper_position,
      immaper_end_of_current_contract,
      action,
      status,
      last_edit,
      is_sbp_member,
      travel_type,
      is_high_risk,
      heat_certificate,
      itineraries,
      allriskLevels,
      risk_level
    } = this.props;

    const { isView, isEdit, alertOpen, isSave, securityConfirm, securityView, travelTypeList, checkInConfirm, editFlightNumber } = this.state
    const metaText = (isView || securityView) ? APP_NAME + ' > View International Request' : isEdit ? APP_NAME + ' > Edit International Request' : APP_NAME + ' > New International Request'

    const alreadySubmitted = !isEmpty(submitted_date) ? true : false;
    const isDisabled = editFlightNumber ?  (isView || isSecurity || status == "approved" || status == "disapproved" ? true : false) : (isView || isSecurity || status == "disapproved" ? true : false);
    const securityNational = !can('Approve Global Travel Request') && can('Approve Domestic Travel Request');

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
                <hr className={classes.primaryBorder} style={{ marginBottom: '16px' }} />
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
                <Typography color="primary" variant="h6">{(isView || securityView) ? 'VIEW' : isEdit ? 'EDIT ' : 'NEW '} INTERNATIONAL REQUEST FORM</Typography>
              </Grid>
              <Grid item xs={12}>
                <hr className={classes.primaryBorder} />
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
              {!isSecurity && action == "revision" && !isEmpty(revision_needed) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary" className={classes.addSmallMarginBottom}>Revision Explanation</Typography>
                  <TextField
                    id="revision_needed"
                    label="Type explanation here"
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
              {!isSecurity && action == "approve" && !isEmpty(approved_comments) && (
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
                <ButtonPicker
                  title="Purpose"
                  name="travel_purpose"
                  value={travel_purpose}
                  options={security_module_purposes}
                  onChange={this.purposeOnChange}
                  error={errors.travel_purpose}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ButtonPicker
                  title="Type of Travel"
                  name="travel_type"
                  value={travel_type}
                  options={travelTypeList}
                  onChange={this.travelTypeOnChange}
                  error={errors.travel_type}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ItineraryField
                  title="ITINERARY"
                  value={itineraries}
                  deleteConnection={(index) => deleteConnection(index)}
                  addConnection={addConnection}
                  onChange={this.itineraryOnChange}
                  moveArray={this.moveArray}
                  error={errors.itineraries}
                  disabled={isDisabled}
                  travelType={travel_type}
                  editFlightNumber={editFlightNumber}
                  status={status}
                  updateCheckIn={this.updateCheckIn}
                  checkInConfirmation={this.checkInConfirmation}
                  showCheckInBtn={risk_level.value == 'High' || risk_level.value == 'Moderate' || is_sbp_member.toString() == '1' || is_sbp_member == 1 ? true : false}
                  isSecurity={isSecurity}
                  isSbpMember={is_sbp_member.toString() == '1' || is_sbp_member == 1 ? true : false}
                />
              </Grid>
              {(is_high_risk.toString() == '1' || is_high_risk == 1) && (
                <Grid item xs={12}>
                  <div className={(isDisabled || heat_certificate.toString() == '1') ? classes.normal : classes.needHeat}>
                    <YesNoField
                      ariaLabel="I have a HEAT (Hostile Environment Awareness Training) certificate since less than 3 years"
                      label="I have a HEAT (Hostile Environment Awareness Training) certificate since less than 3 years"
                      value={heat_certificate.toString()}
                      onChange={(e, value) => this.props.onChange(e.target.name, value)}
                      name="heat_certificate"
                      error={errors.heat_certificate}
                      margin="none"
                      className={(isDisabled || heat_certificate.toString() == '1') ? classes.normal : classes.needHeat}
                      disabled={isDisabled}
                    />
                  </div>
                </Grid>
              )}
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
              <Grid item xs={12}>
                <Typography color="primary" variant="subtitle1" className={!isEmpty(errors.remarks) ? classes.titleError : isDisabled ? classes.disabledTitle : classes.title}>Comments</Typography>
                <TextField
                  id="remarks"
                  label={isDisabled ? "" : "Additional comments"}
                  multiline={true}
                  rows={5}
                  variant="outlined"
                  name="remarks"
                  fullWidth
                  value={remarks}
                  error={!isEmpty(errors.remarks)}
                  helperText={errors.remarks}
                  onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                  disabled={isDisabled}
                />
              </Grid>
              {/* iMMAPer */}
              {(!isDisabled || editFlightNumber) && (
                <Grid item xs={12}>
                  <div className={classes.actionContainer}>
                    {!alreadySubmitted && (
                      <Button type="submit" variant="contained" color="secondary" className={classnames(classes.saveBtn, classes.addMarginRight, classes.actionBtn)} disabled={(!isEmpty(errors) || isLoading || isView) ? true : false}>
                        <SaveIcon className={classes.addMarginRight} /> Save
                        {isSave && isLoading && (
                          <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                        )}
                      </Button>
                    )}
                    <Button type={alreadySubmitted ? "submit" : "button"} onClick={(e) => this.alertOpenClose(e, false)} variant="contained" color="primary" className={classes.actionBtn} disabled={(!isEmpty(errors) || isLoading || isView) ? true : false} >
                     {alreadySubmitted ? editFlightNumber ? 'Save flight number' : 'Resubmit ' : 'Submit '} <DoneIcon />
                    </Button>
                  </div>
                </Grid>
              )}
              {/* Security Officer */}
              {isSecurity && status !== "disapproved" && status !== "approved" && !securityView && !securityNational && !isView && !isEdit && (
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
              {isSecurity && action == "disapprove" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={isView || status == "disapproved" || securityView ? "secondary" : "primary"} className={classes.addSmallMarginBottom}>Reason & Comments</Typography>
                  <TextField
                    id="disapproved_reasons"
                    label={status == "disapproved" || securityView ? "" : "Type explanation here"}
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
                    label={securityView ? "" : "Type explanation here"}
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
              {isSecurity && action == "approve" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={isView || status == "approved" || securityView ? "secondary" : "primary"} className={classes.addSmallMarginBottom}>Comments & Recommendations</Typography>
                  <TextField
                    id="approved_comments"
                    label={status == "approved" || securityView ? "" : "Type explanation here"}
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
              {isSecurity && action == "approve" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={isView || status == "approved" || securityView ? "secondary" : "primary"}>Security Measures Required</Typography>
                  <FormControl margin="none" style={{ 'display': 'block' }} error={!isEmpty(errors.security_measure)}>
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
                  <FormControl margin="none" error={!isEmpty(errors.security_measure)}>
                    {!isEmpty(errors.security_measure) && (
                      <FormHelperText>{errors.security_measure}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              {isSecurity && (
                <Grid item xs={12} className={classes.textRight}>
                  {action == "disapprove" && status !== "disapproved" && !securityView && (
                    <Button variant="contained" className={classes.disapprovedBtn} onClick={this.securityConfirmation} disabled={isLoading}>
                      <CloseIcon className={classes.addSmallMarginRight} /> Disapprove Travel Request
                      {isLoading && (
                        <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                      )}
                    </Button>
                  )}
                  {action == "revision" && !securityView && (
                    <Button variant="contained" className={classes.reviseBtn} onClick={this.securityConfirmation} disabled={isLoading}>
                      <EditIcon className={classes.addSmallMarginRight} /> Set Travel Request as Need Revision
                      {isLoading && (
                        <span className={classes.circleLoading}><CircularProgress color="secondary" className={classes.circular} thickness={5} size={22} disableShrink /></span>
                      )}
                    </Button>
                  )}
                  {action == "approve" && status !== "approved" && !securityView && (
                    <Button variant="contained" className={classes.approvedBtn} onClick={this.securityConfirmation} disabled={isLoading}>
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

        {/* iMMAPer Submit Confirmation */}
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
      </form>
    )
  }
}

TARForm.propTypes = {
  deleteConnection: PropTypes.func.isRequired,
  addConnection: PropTypes.func.isRequired,
  itineraryOnChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.func.isRequired,
  selectOnChange: PropTypes.func.isRequired,
  getSecurityModulePurposes: PropTypes.func.isRequired,
  getSecurityModuleCountries: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,

  itineraries: PropTypes.array,
  itinerary: PropTypes.object,
  is_high_risk: PropTypes.oneOf(['1', '0', 0, 1]),
  heat_certificate: PropTypes.oneOf(['1', '0', 0, 1]),
  travel_purpose: PropTypes.oneOf(['', 'start-of-contract', 'end-of-contract', 'leave', 'work-related', 'rr', 'personal-reason']),
  remarks: PropTypes.string,
  errors: PropTypes.object,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  submitted_date: PropTypes.string,
  security_module_purposes: PropTypes.array,
  isSecurity: PropTypes.bool,
  disapproved_reasons: PropTypes.string,
  revision_needed: PropTypes.string,
  approved_comments: PropTypes.string,
  security_measure_email: PropTypes.oneOf(['1', '0', 0, 1]),
  security_measure_smart24: PropTypes.oneOf(['1', '0', 0, 1]),
  security_measure_immap_careers: PropTypes.oneOf(['1', '0', 0, 1]),
  immaper_name: PropTypes.string,
  immaper_line_manager: PropTypes.string,
  immaper_country_office: PropTypes.string,
  immaper_position: PropTypes.string,
  immaper_end_of_current_contract: PropTypes.string,
  last_edit: PropTypes.string,
  is_sbp_member: PropTypes.oneOf(['1', '0', 0, 1]),
  status: PropTypes.oneOf(['', 'revision', 'approved', 'disapproved', 'saved', 'submitted']),
  action: PropTypes.oneOf(['', 'revision', 'approve', 'disapprove']),
  security_module_countries: PropTypes.array,
  security_module_movements: PropTypes.array,
  travel_type: PropTypes.string.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  deleteConnection,
  addConnection,
  itineraryOnChange,
  onChange,
  isValid,
  selectOnChange,
  getSecurityModulePurposes,
  getSecurityModuleCountries,
  addFlashMessage,
  postAPI,
  resetForm,
  getData

}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  itineraries: state.immaperTARForm.itineraries,
  itinerary: state.immaperTARForm.itinerary,
  travel_purpose: state.immaperTARForm.travel_purpose,
  remarks: state.immaperTARForm.remarks,
  errors: state.immaperTARForm.errors,
  isEdit: state.immaperTARForm.isEdit,
  isLoading: state.immaperTARForm.isLoading,
  submitted_date: state.immaperTARForm.submitted_date,
  security_module_purposes: state.options.security_module_purposes,
  isSecurity: state.immaperTARForm.isSecurity,
  disapproved_reasons: state.immaperTARForm.disapproved_reasons,
  revision_needed: state.immaperTARForm.revision_needed,
  approved_comments: state.immaperTARForm.approved_comments,
  security_measure_email: state.immaperTARForm.security_measure_email,
  security_measure_smart24: state.immaperTARForm.security_measure_smart24,
  security_measure_immap_careers: state.immaperTARForm.security_measure_immap_careers,
  immaper_name: state.immaperTARForm.immaper_name,
  immaper_line_manager: state.immaperTARForm.immaper_line_manager,
  immaper_country_office: state.immaperTARForm.immaper_country_office,
  immaper_position: state.immaperTARForm.immaper_position,
  immaper_end_of_current_contract: state.immaperTARForm.immaper_end_of_current_contract,
  last_edit: state.immaperTARForm.last_edit,
  is_sbp_member: state.immaperTARForm.is_sbp_member,
  action: state.immaperTARForm.action,
  status: state.immaperTARForm.status,
  security_module_countries: state.options.security_module_countries,
  security_module_movements: state.options.security_module_movements,
  travel_type: state.immaperTARForm.travel_type,
  is_high_risk: state.immaperTARForm.is_high_risk,
  heat_certificate: state.immaperTARForm.heat_certificate,
  edit_flight_number: state.immaperTARForm.edit_flight_number,
  allriskLevels: state.immaperTARForm.allriskLevels,
  risk_level: state.immaperTARForm.risk_level

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
  actionContainer: { float: 'right' },
  backBtn: {
    color: secondaryColor,
    width: 'fit-content',
    cursor: 'pointer',
    '&:hover': { borderBottom: '1px solid ' + secondaryColor }
  },
  saveBtn: {
    background: blueIMMAP,
    '&:hover': { background: darkBlueIMMAP }
  },
  addMarginRight: { marginRight: theme.spacing.unit },
  addSmallMarginRight: { marginRight: theme.spacing.unit / 2 },
  addMarginLeft: { marginLeft: theme.spacing.unit },
  addSmallMarginBottom: { marginBottom: theme.spacing.unit / 2 },
  actionBtn: {  width: 'auto' },
  circleLoading: { marginLeft: theme.spacing.unit },
  circular: { verticalAlign: 'middle' },
  detailBox: {
    border: '1px solid ' + primaryColor,
    borderRadius: theme.spacing.unit / 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  detailTitle: { marginBottom: theme.spacing.unit - 1 },
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
  title: { color: primaryColor, marginBottom: theme.spacing.unit },
  disabledTitle: { color: 'rgba(0,0,0,0.54)', marginBottom: theme.spacing.unit },
  titleError: { color: red, marginBottom: theme.spacing.unit },
  normal: { '& label': { color: 'rgba(0,0,0,0.54)' } },
  needHeat: { color: primaryColor, '& label': { color: primaryColor }, '& svg': { color: primaryColor }, '& span': { color: primaryColor } },
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(TARForm)))
