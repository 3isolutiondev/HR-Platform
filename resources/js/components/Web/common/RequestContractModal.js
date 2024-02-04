import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import LoadingSpinner from "../common/LoadingSpinner";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Tooltip from '@material-ui/core/Tooltip';


import { addFlashMessage } from '../redux/actions/webActions';
import { postAPI } from '../redux/actions/apiActions';
import { validate } from '../validations/Jobs/Aplicant/RequestContract';
import { blueIMMAP, blueIMMAPHover, white } from '../config/colors';
import SelectField from '../common/formFields/SelectField';
import isEmpty from "../validations/common/isEmpty";

const DatePickerField = Loadable({
  loader: () => import("../common/formFields/DatePickerField"),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500, // 0.5 seconds
});

const menuMap = [{ id: 1, name: "HQ" }, { id: 2, name: "Field" }];
const menuMaphomeBase = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }];
const menuMapCurrency = [{ id: 1, name: "Dollar ($)" }, { id: 2, name: "Euro (€)" }];

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  capitalize: {
    textTransform: 'capitalize'
  },
  marginTop: {
    marginTop: "10px"
  },
  sendbtn: {
    'background-color': blueIMMAP,
    color: white,
    '&:hover': {
      'background-color': blueIMMAPHover
    }
  },
  loading: {
    'margin-left': theme.spacing.unit,
    'margin-right': theme.spacing.unit,
    color: white
  },
  adio: { display: 'inline-block' },
  block: { display: 'block' }
});


/** RequestContractModal is component to show request contract form inside job applicants page when candidate already accepted (accepted tab), URL: http://localhost:8000/jobs/{id}/applicants */
class RequestContractModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      id: null,
      first_name: '',
      last_name: '',
      position: '',
      paid_from: '',
      project_code: '',
      project_task: '',
      contract_start: moment(new Date()),
      contract_end: moment(new Date()).add(6, 'M'),
      supervisor: '',
      unanet_approvers: '',
      hosting_agency: '',
      duty_station: '',
      home_based: '',
      monthly_rate: '',
      profile_id: 0,
      housing: false,
      perdiem: false,
      phone: false,
      other: false,
      not_applicable: false,
      other_text: '',
      request_status: 'unsent',
      isButtonSave: true,
      isLoadingButtonSave: false,
      isLoadingSendNotification: false,
      apiURL: '/api/jobs/request-contract',
      apiURLSendNotification: '/api/jobs/send-email-request-contract',
      confirmationOpen: false,
      cost_center: '',
      request_type: 'new-contract',
      under_surge_program: false,
      currency: '',
      immap_office: '',
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.isValid = this.isValid.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this)
    this.handleProcess = this.handleProcess.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    let firstName = "";
    let lastName = "";
    if (typeof this.props.full_name !== 'undefined') {
       let names = this.props.full_name.split(" ");
       names.map((name, index)=>{ if (index != names.length - 1) {firstName = firstName ? firstName + " " + name : name } });
       lastName = names[names.length - 1];
    }
    this.setState({
      contract_start: moment(this.props.contract_start),
      contract_end: moment(this.props.contract_end),
      position: this.props.job_title,
      home_based: this.props.home_based + 1,
      profile_id: typeof this.props.profile !== "undefined" ? this.props.profile.id : 0,
      first_name: firstName,
      last_name: lastName,
      request_status: 'unsent',
      immap_office_id: this.props.immap_office_id,
      immap_office: this.props.immap_offices.find((val) => val.value === this.props.immap_office_id)
    }, () => this.isValid())
    if (typeof this.props.profile !== "undefined") {
      if (!isEmpty(this.props.profile.interview_request_contract)) {
        let tempSupervisor = this.props.immapers.find((val) => val.id === this.props.profile.interview_request_contract[0].supervisor);
        let tempImmapOffice = this.props.immap_offices.find((val) => val.value === (this.props.immap_office_id ? this.props.immap_office_id : this.props.profile.interview_request_contract[0].immap_office_id));
        let tempUnanetApprovers = this.props.immapers.find((val) => {
          let unanet_name = this.props.profile.interview_request_contract[0].unanet_approver_name
          if (unanet_name == null) unanet_name = 0
          return val.id === unanet_name
        })
        this.setState({
          id: this.props.profile.interview_request_contract[0].id,
          supervisor: tempSupervisor,
          unanet_approvers: tempUnanetApprovers,
          immap_office: tempImmapOffice,
          first_name: this.props.profile.interview_request_contract[0].first_name,
          last_name: this.props.profile.interview_request_contract[0].last_name,
          paid_from: this.props.profile.interview_request_contract[0].paid_from + 1,
          project_code: this.props.profile.interview_request_contract[0].project_code,
          project_task: this.props.profile.interview_request_contract[0].project_task,
          hosting_agency: this.props.profile.interview_request_contract[0].hosting_agency,
          duty_station: this.props.profile.interview_request_contract[0].duty_station,
          monthly_rate: this.props.profile.interview_request_contract[0].monthly_rate,
          cost_center: this.props.profile.interview_request_contract[0].cost_center,
          currency: this.props.profile.interview_request_contract[0].currency,
          housing: this.props.profile.interview_request_contract[0].housing === 0 ? false : true,
          perdiem: this.props.profile.interview_request_contract[0].perdiem === 0 ? false : true,
          not_applicable: this.props.profile.interview_request_contract[0].not_applicable === 0 ? false : true,
          phone: this.props.profile.interview_request_contract[0].phone === 0 ? false : true,
          other: this.props.profile.interview_request_contract[0].is_other === 0 ? false : true,
          other_text: this.props.profile.interview_request_contract[0].is_other === 0 ? "" : this.props.profile.interview_request_contract[0].other,
          contract_start: isEmpty(this.props.profile.interview_request_contract[0].contract_start) ? moment(this.props.contract_start) : moment(this.props.profile.interview_request_contract[0].contract_start),
          contract_end: isEmpty(this.props.profile.interview_request_contract[0].contract_end) ? moment(this.props.contract_end) : moment(this.props.profile.interview_request_contract[0].contract_end),
          under_surge_program: this.props.profile.interview_request_contract[0].under_surge_program === 0 ? false : true,
          request_status: this.props.profile.interview_request_contract[0].request_status,
        }, () => this.isValid())
      } else {
        this.resetForm();
      }
    } else {
      this.resetForm()
    }
  }

   /**
    * componentDidUpdate is a lifecycle function called where the component is updated
    */
    componentDidUpdate(previousProps, previousState) {
      if (this.props.isOpen  != previousProps.isOpen) {
        if (!isEmpty(this.props.immaper) && this.props.defaultRequest != 'new-contract') {
          this.handleProcess();
        }
      }
  }

  /**
   * resetForm is a function to reset form data
   */
  resetForm() {
    this.setState({
      paid_from: '',
      project_code: '',
      project_task: '',
      supervisor: '',
      unanet_approvers: '',
      hosting_agency: '',
      duty_station: '',
      monthly_rate: '',
      other_text: '',
      cost_center: '',
      currency: '',
      other: false,
      request_status: 'unsent'
    }, () => this.isValid())
  }

  handleProcess() {
    let tempSupervisor = this.props.immapers.find((val) => val.id === this.props.immaper.supervisor_id)
    let tempUnanetApprovers = this.props.immapers.find((val) => val.id === this.props.immaper.unanet_approver_id)
    let tempImmapOffice = this.props.immap_offices.find((val) => val.value === this.props.immaper.immap_office_id);
      this.setState({
        profile_id: this.props.immaper.profile_id,
        first_name: this.props.immaper.first_name,
        last_name: this.props.immaper.family_name,
        request_type: this.props.defaultRequest,
        contract_start: moment(this.props.immaper.end_of_current_contract),
        contract_end: moment(this.props.immaper.end_of_current_contract).add(6, 'M'),
        position: this.props.immaper.job_position,
        monthly_rate: this.props.immaper.monthly_rate == 0 ? '' : this.props.immaper.monthly_rate,
        cost_center: this.props.immaper.cost_center != null ? this.props.immaper.cost_center : '',
        currency: this.props.immaper.currency != null ? this.props.immaper.currency : '',
        supervisor: tempSupervisor,
        unanet_approvers: tempUnanetApprovers,
        immap_office: tempImmapOffice,
        hosting_agency: this.props.immaper.hosting_agency,
        paid_from: (this.props.immaper.paid_from != '' && this.props.immaper.paid_from != null) ? parseInt(this.props.immaper.paid_from) + 1 : '',
        project_task: this.props.immaper.project_task,
        housing: this.props.immaper.housing,
        perdiem: this.props.immaper.perdiem,
        not_applicable: this.props.immaper.not_applicable,
        phone: this.props.immaper.phone,
        other_text: this.props.immaper.other,
        other: this.props.immaper.is_other,
        project_code: this.props.immaper.project_code,
        duty_station: this.props.immaper.duty_station,
        request_status: 'unsent',

      }, () => this.isValid());
  }


  /** function to store and update request contract data, also can send request contract email */
  onSubmit(isSend = false) {
    const {
      id,
      first_name,
      last_name,
      errors,
      paid_from,
      project_code,
      project_task,
      supervisor,
      unanet_approvers,
      hosting_agency,
      duty_station,
      home_based,
      monthly_rate,
      housing,
      perdiem,
      phone,
      other,
      not_applicable,
      profile_id,
      other_text,
      contract_start,
      contract_end,
      cost_center,
      request_type,
      under_surge_program,
      currency,
      position,
      immap_office
    } = this.state
    let apiURL = isSend ? this.state.apiURLSendNotification : this.state.apiURL

    let data = {
      profile_id,
      job_id: this.props.job_id == 0 ? null : this.props.job_id,
      paid_from: paid_from ? paid_from - 1 : 0,
      first_name,
      last_name,
      project_code,
      project_task,
      supervisor: supervisor ? supervisor.id : null,
      unanet_approver_name: (unanet_approvers.id == 0 || unanet_approvers == '0' || unanet_approvers == '') ? null : unanet_approvers.id,
      hosting_agency,
      duty_station,
      home_based: home_based - 1,
      monthly_rate,
      housing: housing ? 1 : 0,
      perdiem: perdiem ? 1 : 0,
      phone: phone ? 1 : 0,
      not_applicable: not_applicable ? 1 : 0,
      is_other: other,
      other: other ? other_text : '',
      cost_center,
      contract_start: moment(contract_start).format('YYYY-MM-DD'),
      contract_end: moment(contract_end).format('YYYY-MM-DD'),
      request_type,
      under_surge_program: under_surge_program ? 1 : 0,
      currency,
      position,
      immap_office_id: this.props.immap_office_id ? this.props.immap_office_id : immap_office.value,
    }


    if (!isSend && id !== null) {
      data._method = 'PUT';
      apiURL = apiURL + '/' + id
    }

    if (isSend) {
      data.id = id
    }

    if (isEmpty(errors)) {
      if (isSend) {
        this.setState({ isLoadingSendNotification: true })
      } else {
        this.setState({ isLoadingButtonSave: true })
      }
      this.props
        .postAPI(apiURL, data)
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: isSend ? "Send notification success" : "Saved"
          });
          this.setState({
            isLoadingButtonSave: false,
            isLoadingSendNotification: false,
            isButtonSave: false,
            id: res.data.data.id,
            confirmationOpen: isSend ? false : this.state.confirmationOpen,
            request_status: isSend ? 'sent' : this.state.request_status,
          })
          this.props.reload();
          this.onClose();
        })
        .catch((err) => {
          this.props.addFlashMessage({
            type: 'error',
            text: isSend ? "Error sending notification" : "Error while saving data"
          });
          this.setState({ isLoadingButtonSave: false, isLoadingSendNotification: false })
        });
    }
  }

  /** function to request contract form data */
  onChange(e, status) {
    if (status) {
      this.setState({ [e.target.name]: e.target.value }, () => this.isValid())
    }
  }

  /** function to request contract form data (DatePickerField) */
  dateOnChange(e) {
    this.setState({ [e.target.name]: moment(e.target.value) }, () => this.isValid());
  }

  /** function to request contract form data (TextField as Select Field) */
  selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid())
  }

  /** function to request contract form data (Checkbox) */
  onChangeCheckbox(e) {
    if (e.target.name === "not_applicable") {
      this.setState({
        not_applicable: e.target.checked,
        housing: false,
        perdiem: false,
        phone: false,
        other: false,
        other_text: '',
      }, () => this.isValid())
    } else {
      this.setState({ [e.target.name]: e.target.checked }, () => this.isValid())
    }
  }

  /** function to check if request contract form data is valid */
  isValid() {
    const { errors, isValid } = validate(this.state);
    if (!isValid) {
      this.setState({ errors, isButtonSave: true });
    } else {
      this.setState({ errors: {}, isButtonSave: false });
    }

    return isValid;
  }

  /** function to open or close confirmation pop up while sending notification */
  toggleConfirmation() {
    this.setState({ confirmationOpen: this.state.confirmationOpen ? false : true })
  }

  /** onClose is a function to close the model */
  onClose() {
    this.setState({
      errors: {},
      id: null,
      first_name: '',
      last_name: '',
      position: '',
      paid_from: '',
      project_code: '',
      project_task: '',
      contract_start: moment(new Date()),
      contract_end: moment(new Date()).add(6, 'M'),
      supervisor: '',
      unanet_approvers: '',
      hosting_agency: '',
      duty_station: '',
      monthly_rate: '',
      profile_id: 0,
      housing: false,
      perdiem: false,
      phone: false,
      other: false,
      not_applicable: false,
      other_text: '',
      cost_center: '',
      request_type: 'new-contract',
      under_surge_program: false,
      currency: '',
      immap_office: '',
    });
    this.props.onClose();
  }

  render() {
    const {
      isOpen,
      classes,
      onClose,
      immapers,
      hqOffices,
      defaultRequest,
      immap_offices
    } = this.props;

    const { errors,
      first_name,
      last_name,
      position,
      paid_from,
      project_code,
      project_task,
      contract_start,
      contract_end,
      supervisor,
      unanet_approvers,
      hosting_agency,
      duty_station,
      home_based,
      monthly_rate,
      housing,
      perdiem,
      phone,
      not_applicable,
      other,
      other_text,
      isButtonSave,
      isLoadingButtonSave,
      isLoadingSendNotification,
      cost_center,
      request_type,
      under_surge_program,
      currency,
      request_status,
      immap_office
    } = this.state;

    let title = 'New Contract';

    if (request_type === 'contract-extension') {
      title = 'Contract Extension';
    }

    if (request_type === 'contract-amendment') {
      title = 'Contract Amendment';
    }

    const disabledSendAndSaveBtn = request_status == "sent" ? true : false;
    let checkImmapOffice = request_type != 'new-contract' ? null : this.props.immap_office_id;

    return (
      <div>
        <Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.onClose}>
          <DialogTitle>{'Request '+ title}</DialogTitle>
          <DialogContent>
            <Grid container spacing={24} alignItems="flex-end">
            <Grid item xs={12} sm={12}>
                <FormControl >
                  <FormLabel>What do you request ?</FormLabel>
                  <RadioGroup
                    name="request_type"
                    value={request_type}
                    onChange={(e) => this.onChange(e, true)}
                    className={classes.block}
                  >
                    <FormControlLabel disabled={(defaultRequest == 'new-contract' || defaultRequest == 'contract-amendment') ? true : false} value="contract-extension" control={<Radio className={classes.radio} />} label="Contract Extension" />
                    <FormControlLabel disabled={defaultRequest == 'new-contract' ? true : false} value="contract-amendment" control={<Radio className={classes.radio} />} label="Contract Amendment" />
                    <FormControlLabel disabled={(defaultRequest == 'contract-extension' ||  defaultRequest == 'contract-amendment') ? true : false} value="new-contract" control={<Radio className={classes.radio} />} label="New Contract" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required
                  id="first_name"
                  name="first_name"
                  label="First Name (as on the passport)"
                  fullWidth
                  value={first_name}
                  autoComplete="first_name"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.first_name)}
                  helperText={errors.first_name}
                  margin="dense"
                  disabled={request_type != 'new-contract' ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required
                  id="last_name"
                  name="last_name"
                  label="Last Name (as on the passport)"
                  fullWidth
                  value={last_name}
                  autoComplete="last_name"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.last_name)}
                  helperText={errors.last_name}
                  margin="dense"
                  disabled={request_type != 'new-contract' ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required={request_type != 'contract-extension' ? true : false}
                  id="position"
                  name="position"
                  label="Position's Full Title"
                  fullWidth
                  value={position}
                  autoComplete="position"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.position)}
                  helperText={errors.position}
                  margin="dense"
                  disabled={request_type == 'contract-extension' || request_type == 'new-contract' ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required
                  id="paid_from"
                  name="paid_from"
                  select
                  label="Paid From"
                  value={paid_from}
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.paid_from)}
                  helperText={errors.paid_from}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                >
                  {menuMap.map((data) => (
                    <MenuItem
                      key={data.id}
                      value={data.id}
                      className={classes.capitalize}
                    >
                      {data.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
							<SelectField
								label="iMMAP Office *"
								options={immap_offices}
								value={immap_office}
								onChange={this.selectOnChange}
								placeholder="Select iMMAP Office"
								isMulti={false}
								name="immap_office"
								error={errors.immap_office}
								required
								fullWidth={true}
								margin="none"
                isDisabled={checkImmapOffice}
							/>
						</Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required
                  id="cost_center"
                  name="cost_center"
                  select
                  label="Cost Center"
                  value={cost_center}
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.cost_center)}
                  helperText={errors.cost_center}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                >
                  {hqOffices.map((data) => (
                    <MenuItem
                      key={data.value}
                      value={data.value}
                      className={classes.capitalize}
                    >
                      {data.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required
                  id="project_code"
                  name="project_code"
                  label="Project Code"
                  fullWidth
                  value={project_code}
                  autoComplete="project_code"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.project_code)}
                  helperText={errors.project_code}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  id="project_task"
                  name="project_task"
                  label="Project Task/Activity, if any"
                  fullWidth
                  value={project_task}
                  autoComplete="project_task"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.project_task)}
                  helperText={errors.project_task}
                  margin="dense"
                />
              </Grid>

              <Grid item xs={12} sm={4} >
                <DatePickerField
                  label="Contract Start Date"
                  name="contract_start"
                  value={contract_start}
                  onChange={this.dateOnChange}
                  error={errors.contract_start}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <DatePickerField
                  label="Contract End Date"
                  name="contract_end"
                  value={contract_end}
                  onChange={this.dateOnChange}
                  error={errors.contract_end}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <SelectField
                  label="Supervisor's Full Name *"
                  options={immapers}
                  value={supervisor}
                  onChange={this.selectOnChange}
                  placeholder="Supervisor's Full Name"
                  name="supervisor"
                  error={errors.supervisor}
                  required={true}
                  isMulti={false}
                  fullWidth={true}
                  margin="dense"
                  obj={this}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <SelectField
                  label="Unanet Approver's Name *"
                  options={immapers}
                  value={unanet_approvers}
                  onChange={this.selectOnChange}
                  placeholder="Unanet Approver's Name"
                  name="unanet_approvers"
                  error={errors.unanet_approvers}
                  required
                  isMulti={false}
                  fullWidth={true}
                  margin="dense"
                  obj={this}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  id="hosting_agency"
                  name="hosting_agency"
                  label="Hosting Agency, if any:"
                  fullWidth
                  value={hosting_agency}
                  autoComplete="hosting_agency"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.hosting_agency)}
                  helperText={errors.hosting_agency}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required={request_type != 'contract-extension' ? true : false}
                  id="duty_station"
                  name="duty_station"
                  label="Duty Station "
                  fullWidth
                  value={duty_station}
                  autoComplete="duty_station"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.duty_station)}
                  helperText={errors.duty_station}
                  margin="dense"
                  disabled={request_type == 'contract-extension' ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField
                  required={request_type != 'contract-extension' ? true : false}
                  id="home_based"
                  name="home_based"
                  select
                  label="Home Based"
                  value={home_based}
                  onChange={(e) => this.onChange(e, false)}
                  error={!isEmpty(errors.home_based)}
                  helperText={errors.home_based}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                  disabled={request_type == 'contract-extension' ? true : false}
                >
                  {menuMaphomeBase.map((data) => (
                    <MenuItem
                      key={data.id}
                      value={data.id}
                      className={classes.capitalize}
                    >
                      {data.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  required
                  id="currency"
                  name="currency"
                  select
                  label="Currency"
                  value={currency}
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.currency)}
                  helperText={errors.currency}
                  fullWidth
                  className={classes.capitalize}
                  margin="dense"
                >
                  {menuMapCurrency.map((data) => (
                    <MenuItem
                      key={data.id}
                      value={data.name}
                      className={classes.capitalize}
                    >
                      {data.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  required
                  id="monthly_rate"
                  name="monthly_rate"
                  label="Monthly Rate "
                  fullWidth
                  value={monthly_rate}
                  autoComplete="monthly_rate"
                  onChange={(e) => this.onChange(e, true)}
                  error={!isEmpty(errors.monthly_rate)}
                  helperText={errors.monthly_rate}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6} >
                <FormControl component="fieldset" className={classes.marginTop}>
                  <FormLabel component="legend">Allowances *</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={housing}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="housing"
                          name="housing"
                          color="primary"
                          disabled={not_applicable}
                        />
                      }
                      label="Housing"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={perdiem}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="perdiem"
                          name="perdiem"
                          color="primary"
                          disabled={not_applicable}
                        />
                      }
                      label="Per Diem"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={phone}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="phone"
                          name="phone"
                          color="primary"
                          disabled={not_applicable}
                        />
                      }
                      label="Phone"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={other}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="other"
                          name="other"
                          color="primary"
                          disabled={not_applicable}
                        />
                      }
                      label="Other"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={not_applicable}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="not_applicable"
                          name="not_applicable"
                          color="primary"
                        />
                      }
                      label="N/A"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3} >
                <FormControl component="fieldset" className={classes.marginTop}>
                  <FormLabel component="legend">Surge Deployment</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={under_surge_program}
                          onChange={(e) => this.onChangeCheckbox(e)}
                          value="under_surge_program"
                          name="under_surge_program"
                          color="primary"
                        />
                      }
                      label="Under Surge Deployment ?"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              {other ?
                <Grid item xs={12} sm={12} >
                  <TextField
                    required
                    id="other_text"
                    name="other_text"
                    label="Other"
                    fullWidth
                    value={other_text}
                    autoComplete="other_text"
                    onChange={(e) => this.onChange(e, true)}
                    error={!isEmpty(errors.other_text)}
                    helperText={errors.other_text}
                  />
                </Grid>
                : null}

            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.onClose}
              color="secondary"
              variant="contained"
            >
              Close
            </Button>
            { request_type == 'new-contract' &&
               <Tooltip title={disabledSendAndSaveBtn ? 'There is a contract request is being processed for this user' : 'Contract Request'}>
                 <span>
                    <Button
                      onClick={() => this.onSubmit()}
                      color="primary"
                      variant="contained"
                      disabled={isButtonSave || disabledSendAndSaveBtn}
                      >
                        {isLoadingButtonSave ? <CircularProgress className={classes.loading} size={22} thickness={5} /> : "Save "}
                    </Button>
                  </span>
                </Tooltip>
            }
             <Tooltip title={disabledSendAndSaveBtn ? 'There is a contract request is being processed for this user' : 'Contract Request'}>
                 <span>
                    <Button
                      onClick={this.toggleConfirmation}
                      color="primary"
                      className={classes.sendbtn}
                      variant="contained"
                      disabled={isButtonSave || disabledSendAndSaveBtn}
                    >
                      {isLoadingSendNotification ? <CircularProgress className={classes.loading} size={22} thickness={5} /> : "Send Notification "}
                    </Button>
                </span>
              </Tooltip>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.confirmationOpen} onClose={this.toggleConfirmation}>
          <DialogTitle>Request Contract Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure to send request contract notification?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.toggleConfirmation}
              color="secondary"
              variant="contained"
            >
              Close
            </Button>
            <Button
              onClick={() => this.onSubmit(true)}
              color="primary"
              className={classes.sendbtn}
              variant="contained"
              disabled={isLoadingSendNotification}
            >
              {isLoadingSendNotification ? <CircularProgress className={classes.loading} size={22} thickness={5} /> : "Send Notification "}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RequestContractModal.defaultProps = {
  reload: () => null
}

RequestContractModal.propTypes = {
  /** "profile" prop: holding profile data related to request contract form [Object] */
  profile: PropTypes.object.isRequired,
  /** "job_title" prop: contain job title information [String] */
  job_title: PropTypes.string.isRequired,
  /** "job_id" prop: contain job id information [Number] */
  job_id: PropTypes.number.isRequired,
  /** "contract_start" prop: contain contract start information inside request contract form data [Date|Moment] */
  contract_start: PropTypes.string.isRequired,
  /** "contract_end" prop: contain contract end information inside request contract form data [Date] */
  contract_end: PropTypes.string.isRequired,
  /** "home_based" prop: contain home based information inside request contract form data [Boolean] */
  home_based: PropTypes.number.isRequired,
  /** "immapers" prop: contain list of iMMAPer for select field used in request contract form [Array] */
  immapers: PropTypes.array.isRequired,
  /** "hqOffices" prop: contain list of HQ Office data for select field used in request contract form [Array] */
  hqOffices: PropTypes.array.isRequired,

  /** "postAPI" prop: function to make post api call */
  postAPI: PropTypes.func.isRequired,
  /** "addFlashMessage" prop: function to show flash message */
  addFlashMessage: PropTypes.func.isRequired,
  /** "reload" prop: function to reload data */
  reload: PropTypes.func,
  /** "immap_offices" prop: function to get immap offices */
  immap_offices: PropTypes.array,

};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  postAPI,
  addFlashMessage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  profile: state.request_contract_user.profile,
  full_name: state.request_contract_user.full_name,
  job_title: state.request_contract_user.job_title,
  job_id: state.request_contract_user.job_id,
  contract_start: state.request_contract_user.contract_start,
  contract_end: state.request_contract_user.contract_end,
  home_based: state.request_contract_user.home_based,
  immap_office_id: state.request_contract_user.immap_office_id,
  immapers: state.options.immapers,
  hqOffices: state.options.hqOffices,
  immap_offices: state.options.immapOffices,

});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RequestContractModal));
