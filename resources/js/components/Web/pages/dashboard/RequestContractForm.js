/** import React,moment, Loadable,  Prop Types, and connect  */
import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

/** import Material UI styles, Component(s) and Icon(s) */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import LoadingSpinner from "../../common/LoadingSpinner";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

/** import Redux actions and components needed on this component */
import { addFlashMessage } from "../../redux/actions/webActions";
import { postAPI, getAPI } from "../../redux/actions/apiActions";
import { getP11CompletedUsers } from "../../redux/actions/dashboard/immaperFormActions";

/** import configuration value needed on this component */
import { validate } from "../../validations/RequestContract";
import { blueIMMAP, blueIMMAPHover, white } from "../../config/colors";
import SelectField from "../../common/formFields/SelectField";
import isEmpty from "../../validations/common/isEmpty";
import SearchField from "../../common/formFields/SearchField";

const DatePickerField = Loadable({
  loader: () => import("../../common/formFields/DatePickerField"),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const menuMap = [{ id: 1, name: "HQ" }, { id: 2, name: "Field" }];
const menuMaphomeBase = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }];
const menuMapCurrency = [{ id: 1, name: "Dollar ($)" }, { id: 2, name: "Euro (€)" }];

/** RequestContractForm is component to show request contract form inside job applicants page when candidate already accepted (accepted tab), URL: http://localhost:8000/jobs/{id}/applicants */
class RequestContractForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      id: null,
      first_name: "",
      last_name: "",
      position: "",
      paid_from: "",
      project_code: "",
      project_task: "",
      contract_start: moment(new Date()),
      contract_end: moment(new Date()).add(6, "M"),
      supervisor: "",
      unanet_approvers: "",
      hosting_agency: "",
      duty_station: "",
      home_based: 2,
      monthly_rate: "",
      profile_id: 0,
      housing: false,
      perdiem: false,
      phone: false,
      other: false,
      not_applicable: false,
      other_text: "",
      isLoadingSendNotification: false,
      apiURL: "/api/jobs/request-contract",
      apiURLSendNotification: "/api/jobs/send-email-request-contract",
      confirmationOpen: false,
      cost_center: "",
      under_surge_program: false,
      search: "",
      isLoading: false,
      user: "",
      currency: "",
      request_type: 'new-contract',
      immap_office: ""
    };
    this.timer = null;

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.isValid = this.isValid.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
    this.timerCheck = this.timerCheck.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  /** componentDidUpdate is a lifecycle function called where the component is updated function to */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.timerCheck();
    }
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
      under_surge_program,
      currency,
      request_type,
      position,
      immap_office
    } = this.state;

    let apiURL = this.state.apiURLSendNotification;

    let data = {
      profile_id,
      job_id: null,
      paid_from: paid_from - 1,
      first_name,
      last_name,
      project_code,
      project_task,
      supervisor: supervisor.id,
      unanet_approver_name:
        unanet_approvers.id == 0 || unanet_approvers == "0"
          ? null
          : unanet_approvers.id,
      hosting_agency,
      duty_station,
      home_based: home_based - 1,
      monthly_rate,
      housing: housing ? 1 : 0,
      perdiem: perdiem ? 1 : 0,
      phone: phone ? 1 : 0,
      not_applicable: not_applicable ? 1 : 0,
      is_other: other,
      other: other ? other_text : "",
      cost_center,
      contract_start: moment(contract_start).format("YYYY-MM-DD"),
      contract_end: moment(contract_end).format("YYYY-MM-DD"),
      under_surge_program: under_surge_program ? 1 : 0,
      currency,
      request_type,
      position,
      immap_office_id: immap_office.value,
    };

    if (isSend) {
      data.id = id;
    }

    if (isEmpty(errors)) {
      if (isSend) {
        this.setState({ isLoadingSendNotification: true });
      }
      this.props
        .postAPI(apiURL, data)
        .then(res => {
          this.props.addFlashMessage({
            type: "success",
            text: isSend ? "Send notification success" : "Saved"
          });
          this.setState({
            isLoadingSendNotification: false,
            isButtonSave: false,
            id: res.data.data.id,
            confirmationOpen: isSend ? false : this.state.confirmationOpen
          });
          this.onClose();
        })
        .catch(err => {
          this.props.addFlashMessage({
            type: "error",
            text: isSend
              ? "Error sending notification"
              : "Error while saving data"
          });
          this.setState({
            isLoadingSendNotification: false
          });
        });
    }
  }

  /** function to request contract form data */
  onChange(e, status) {
    if (status) {
      this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
    }
  }

  /** function to request contract form data */
  onChangeSearch(name, value, status) {
    if (status) {
      this.setState({ [name]: value });
      if (!isEmpty(value)) {
        this.props
          .getAPI("/api/get-profile/" + value.value)
          .then(res => {
            let firstName = "";
            let lastName = "";
            if (typeof res.data.data.full_name !== 'undefined') {
                let names = res.data.data.full_name.split(" ");
                names.map((name, index)=>{ if (index != names.length - 1) {firstName = firstName ? firstName + " " + name : name } });
                lastName = names[names.length - 1];
            }
            this.setState(
              {
                first_name: firstName,
                last_name: lastName,
                profile_id: res.data.data.profile.id
              },
              () => this.isValid()
            );
          })
          .catch(err => {
            this.props.addFlashMessage({
              type: "error",
              text: "Error while retrieving profile data"
            });
          });
      }
    }
  }

  /** function to request contract form data (DatePickerField) */
  dateOnChange(e) {
    this.setState({ [e.target.name]: moment(e.target.value) }, () =>
      this.isValid()
    );
  }

  /** function to request contract form data (TextField as Select Field) */
  selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid());
  }

  /** function to request contract form data (Checkbox) */
  onChangeCheckbox(e) {
    if (e.target.name === "not_applicable") {
      this.setState(
        {
          not_applicable: e.target.checked,
          housing: false,
          perdiem: false,
          phone: false,
          other: false,
          other_text: ""
        },
        () => this.isValid()
      );
    } else {
      this.setState({ [e.target.name]: e.target.checked }, () =>
        this.isValid()
      );
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
    this.setState({
      confirmationOpen: this.state.confirmationOpen ? false : true
    });
  }

  /** function timerCheck to make user search */
  timerCheck() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      if (!isEmpty(this.state.search)) {
        await this.props.getP11CompletedUsers(this.state.search);
      }
      this.setState({ isLoading: false });
    }, 500);
  }

  /** onClose is a function to close the model */
  onClose() {
    this.setState({
      first_name: "",
      last_name: "",
      position: "",
      paid_from: "",
      project_code: "",
      project_task: "",
      contract_start: moment(new Date()),
      contract_end: moment(new Date()).add(6, "M"),
      supervisor: "",
      unanet_approvers: "",
      hosting_agency: "",
      duty_station: "",
      home_based: 2,
      monthly_rate: "",
      profile_id: 0,
      housing: false,
      perdiem: false,
      phone: false,
      other: false,
      not_applicable: false,
      other_text: "",
      user: "",
      currency: "",
      cost_center: "",
      under_surge_program: false,
      search: "",
      errors: {},
      immap_office: ""
    });
    this.props.onClose();
  }

  render() {
    const {
      isOpen,
      classes,
      onClose,
      title,
      immapers,
      hqOffices,
      users,
      immap_offices
    } = this.props;

    const {
      errors,
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
      isLoading,
      isLoadingSendNotification,
      cost_center,
      under_surge_program,
      search,
      user,
      currency,
      immap_office
    } = this.state;
    return (
      <div>
        <Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.onClose}>
          <DialogTitle>{title ? title : "Request Contract"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={24} alignItems="flex-end">
              <Grid item xs={12}>
                <SearchField
                  required
                  id="user"
                  label="Select User"
                  name="user"
                  keyword={search}
                  placeholder="Search and Pick User"
                  onKeywordChange={e => {
                    this.setState({ search: e.target.value, isLoading: true });
                  }}
                  value={!isEmpty(user.label) ? user.label : ""}
                  options={users}
                  loadingText="Loading completed users..."
                  searchLoading={isLoading}
                  onSelect={value => {
                    this.setState({ search: "" }, () => {
                      this.onChangeSearch(
                        "user",
                        { value: value.value, label: value.label },
                        true
                      );
                    });
                  }}
                  onDelete={() => this.onChangeSearch("user", "", true)}
                  optionSelectedProperty="label"
                  isImmperProperty="status"
                  secondProperty="label_second"
                  thirdProperty="label_third"
                  profileProperty="profile"
                  requestContractProperty="interview_request_contract"
                  notFoundText="Sorry, your search terms do not match with any completed user"
                  error={errors.user}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="first_name"
                  name="first_name"
                  label="First Name (as on the passport)"
                  fullWidth
                  value={first_name}
                  autoComplete="first_name"
                  onChange={e => this.onChange(e, false)}
                  error={!isEmpty(errors.first_name)}
                  helperText={errors.first_name}
                  margin="dense"
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="last_name"
                  name="last_name"
                  label="Last Name (as on the passport)"
                  fullWidth
                  value={last_name}
                  autoComplete="last_name"
                  onChange={e => this.onChange(e, false)}
                  error={!isEmpty(errors.last_name)}
                  helperText={errors.last_name}
                  margin="dense"
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="position"
                  name="position"
                  label="Position's Full Title"
                  fullWidth
                  value={position}
                  autoComplete="position"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.position)}
                  helperText={errors.position}
                  margin="dense"
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="paid_from"
                  name="paid_from"
                  select
                  label="Paid From"
                  value={paid_from}
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.paid_from)}
                  helperText={errors.paid_from}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                >
                  {menuMap.map(data => (
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
								label="3iSolution Office *"
								options={immap_offices}
								value={immap_office}
								onChange={this.selectOnChange}
								placeholder="Select 3iSolution Office"
								isMulti={false}
								name="immap_office"
								error={errors.immap_office}
								required
								fullWidth={true}
								margin="none"
							/>
						</Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="cost_center"
                  name="cost_center"
                  select
                  label="Cost Center"
                  value={cost_center}
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.cost_center)}
                  helperText={errors.cost_center}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                >
                  {hqOffices.map(data => (
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
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="project_code"
                  name="project_code"
                  label="Project Code"
                  fullWidth
                  value={project_code}
                  autoComplete="project_code"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.project_code)}
                  helperText={errors.project_code}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="project_task"
                  name="project_task"
                  label="Project Task/Activity, if any"
                  fullWidth
                  value={project_task}
                  autoComplete="project_task"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.project_task)}
                  helperText={errors.project_task}
                  margin="dense"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <DatePickerField
                  label="Contract Start Date"
                  name="contract_start"
                  value={contract_start}
                  onChange={this.dateOnChange}
                  error={errors.contract_start}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePickerField
                  label="Contract End Date"
                  name="contract_end"
                  value={contract_end}
                  onChange={this.dateOnChange}
                  error={errors.contract_end}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectField
                  label="Supervisor's Full Name *"
                  options={immapers}
                  value={supervisor}
                  onChange={this.selectOnChange}
                  placeholder="Supervisor's Full Name"
                  name="supervisor"
                  error={errors.supervisor}
                  required
                  isMulti={false}
                  fullWidth={true}
                  margin="dense"
                  obj={this}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  id="hosting_agency"
                  name="hosting_agency"
                  label="Hosting Agency, if any:"
                  fullWidth
                  value={hosting_agency}
                  autoComplete="hosting_agency"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.hosting_agency)}
                  helperText={errors.hosting_agency}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="duty_station"
                  name="duty_station"
                  label="Duty Station "
                  fullWidth
                  value={duty_station}
                  autoComplete="duty_station"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.duty_station)}
                  helperText={errors.duty_station}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="home_based"
                  name="home_based"
                  select
                  label="Home Based"
                  value={home_based}
                  onChange={e => this.onChange(e, false)}
                  error={!isEmpty(errors.home_based)}
                  helperText={errors.home_based}
                  fullWidth
                  className={classes.capitalize}
                  autoFocus
                  margin="dense"
                  disabled={true}
                >
                  {menuMaphomeBase.map(data => (
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
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  id="monthly_rate"
                  name="monthly_rate"
                  label="Monthly Rate "
                  fullWidth
                  value={monthly_rate}
                  autoComplete="monthly_rate"
                  onChange={e => this.onChange(e, true)}
                  error={!isEmpty(errors.monthly_rate)}
                  helperText={errors.monthly_rate}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" className={classes.marginTop}>
                  <FormLabel component="legend">Allowances *</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={housing}
                          onChange={e => this.onChangeCheckbox(e)}
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
                          onChange={e => this.onChangeCheckbox(e)}
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
                          onChange={e => this.onChangeCheckbox(e)}
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
                          onChange={e => this.onChangeCheckbox(e)}
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
                          onChange={e => this.onChangeCheckbox(e)}
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
              <Grid item xs={12} sm={3}>
                <FormControl component="fieldset" className={classes.marginTop}>
                  <FormLabel component="legend">Surge Deployment</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={under_surge_program}
                          onChange={e => this.onChangeCheckbox(e)}
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
              {other ? (
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="other_text"
                    name="other_text"
                    label="Other"
                    fullWidth
                    value={other_text}
                    autoComplete="other_text"
                    onChange={e => this.onChange(e, true)}
                    error={!isEmpty(errors.other_text)}
                    helperText={errors.other_text}
                  />
                </Grid>
              ) : null}
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
            <Button
              onClick={this.toggleConfirmation}
              color="primary"
              className={classes.sendbtn}
              variant="contained"
              disabled={isButtonSave}
            >
              {isLoadingSendNotification ? (
                <CircularProgress
                  className={classes.loading}
                  size={22}
                  thickness={5}
                />
              ) : (
                "Send Notification "
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.confirmationOpen}
          onClose={this.toggleConfirmation}
        >
          <DialogTitle>Request Contract Confirmation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure to send request contract notification?
            </Typography>
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
              {isLoadingSendNotification ? (
                <CircularProgress
                  className={classes.loading}
                  size={22}
                  thickness={5}
                />
              ) : (
                "Send Notification "
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RequestContractForm.propTypes = {
  /** "immapers" prop: contain list of Consultant for select field used in request contract form [Array] */
  immapers: PropTypes.array.isRequired,
  /** "hqOffices" prop: contain list of HQ Office data for select field used in request contract form [Array] */
  hqOffices: PropTypes.array.isRequired,
  /** "postAPI" prop: function to make post api call */
  postAPI: PropTypes.func.isRequired,
  /** "addFlashMessage" prop: function to show flash message */
  addFlashMessage: PropTypes.func.isRequired,
   /** "getAPI" prop: function to make get api call */
   getAPI: PropTypes.func.isRequired,
   /** "getP11CompletedUsers" prop: function to seach users */
   getP11CompletedUsers: PropTypes.func.isRequired,
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
  getAPI,
  addFlashMessage,
  getP11CompletedUsers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = state => ({
  user: state.immaperForm.user,
  users: state.immaperForm.users,
  immapers: state.options.immapers,
  hqOffices: state.options.hqOffices,
  immap_offices: state.options.immapOffices,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = theme => ({
  capitalize: {
    textTransform: "capitalize"
  },
  marginTop: {
    marginTop: "10px"
  },
  sendbtn: {
    "background-color": blueIMMAP,
    color: white,
    "&:hover": {
      "background-color": blueIMMAPHover
    }
  },
  loading: {
    "margin-left": theme.spacing.unit,
    "margin-right": theme.spacing.unit,
    color: white
  }
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequestContractForm)
);
