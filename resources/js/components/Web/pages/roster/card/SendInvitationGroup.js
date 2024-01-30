/** import React, React.Component, moment, and axios */
import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

/** import Material UI withStyles, components and icons */
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Close from "@material-ui/icons/Close";
import Send from "@material-ui/icons/Send";
import Cookies from "js-cookie";


/** import custom components */
import SelectField from "../../../common/formFields/SelectField";
import DatePickerField from "../../../common/formFields/DatePickerField";

/** import Redux and it's actions */
import { connect } from "react-redux";
import {
  getTimezones,
  getImmapers
} from "../../../redux/actions/optionActions";
import { addFlashMessage } from "../../../redux/actions/webActions";

/** import configuration value and validation helper */
import { blueIMMAP, white, blueIMMAPHover, blue } from "../../../config/colors";
import isEmpty from "../../../validations/common/isEmpty";

/**
 * SendInvitationGroup is a component to be shown in the roster page under Interview tab
 *
 * @name SendInvitationGroup
 * @component
 * @category Roster
 */
class SendInvitationGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interview_date: moment(new Date()).add("2", "days"),
      interview_skype: "",
      interview_timezone: "",
      alreadySent: false,
      immaper_invite: [],
      isLoading: false,
      errors: {},
      microsoft_login: false,
      new_step: "",
      id: "",
      commentText: ""
    };

    this.interview = this.interview.bind(this);
    this.onChange = this.onChange.bind(this);

    this.dateOnChange = this.dateOnChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.closeMicrosoftLogin = this.closeMicrosoftLogin.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.props.getTimezones();
    this.props.getImmapers(false, "forRoster");
    let { profiles } = this.props;
    this.isValid()

  }

  /**
   * onChange is a function to handle change of value in the form
   * @param {*} e
   */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  /**
   * selectOnChange is a function handle change of value for select field
   * when the interview in physical mode
   * @param {array} value
   * @param {*} e
   */
   selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid());
}

  /**
   * dateOnChange is a function to handle change of date for DatePickerField
   * @param {*} e
   */
  dateOnChange(e) {
    this.setState({ [e.target.name]: moment(e.target.value) }, () =>
      this.isValid()
    );
  }

  /** function to close microsoft login */
  closeMicrosoftLogin() {
    this.setState({ microsoft_login: false, microsoft_login_url: "" });
  }

  /**
   * interview is a function to send interview invitation
   */
  interview() {
    let {
      interview_timezone,
      interview_date,
    } = this.state;

    if (
      !isEmpty(interview_timezone) &&
      !isEmpty(interview_date)

    ) {
      let { selected_step, roster_process, profiles } = this.props;
      let { has_interview, id, order } = selected_step;

      const additionalData = {};
      additionalData.commentText = this.state.commentText;

      this.setState({ isLoading: true }, () => {
        axios
          .post("api/roster/send-group-invitations", {
            roster_process,
            roster_step_id: id,
            has_interview: has_interview,
            current_step: order,
            profiles,
            interview_timezone: interview_timezone.value,
            interview_date: moment(interview_date).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            ...additionalData,
            microsoft_access_token: Cookies.get("microsoft_access_token")
              ? Cookies.get("microsoft_access_token")
              : "",
            microsoft_refresh_token: Cookies.get("microsoft_refresh_token")
              ? Cookies.get("microsoft_refresh_token")
              : "",
            microsoft_token_expire: Cookies.get("microsoft_token_expire")
              ? Cookies.get("microsoft_token_expire")
              : ""
          })
          .then(res => {
            if (res.data.data) {
              if (res.data.data.access_token)
                Cookies.set(
                  "microsoft_access_token",
                  res.data.data.access_token
                );
              if (res.data.data.refresh_token)
                Cookies.set(
                  "microsoft_refresh_token",
                  res.data.data.refresh_token
                );
              if (res.data.data.expires_in)
                Cookies.set("microsoft_token_expire", res.data.data.expires_in);
            }
            this.props.closeSendInvitationsModal()
            this.setState(
              { isLoading: false, alreadySent: true },
              () => {
                this.props.reloadProfiles();
                this.props.addFlashMessage({
                  type: "success",
                  text: "Invitation Sent!"
                });
              }
            );
          })
          .catch(err => {
            if (
              err.response.status === 500 &&
              err.response.data.message &&
              err.response.data.message.startsWith("http")
            ) {
              this.setState({
                microsoft_login: true,
                microsoft_login_url: err.response.data.message,
                isLoading: false
              });
            } else {
              this.setState({ isLoading: false }, () => {
                this.props.addFlashMessage({
                  type: "error",
                  text: "There is an error while sending invitation"
                });
              });
            }
          });
      });
    } else {
      this.props.addFlashMessage({
        type: "error",
        text: "There is an error in the interview form"
      });
    }
  }

  /**
   * isValid is a function to check if the interview form data is valid or not
   */
  isValid() {
    let errors = {};
    const {
      interview_type,
      interview_address,
      interview_timezone,
      immaper_invite
    } = this.state;


    if (interview_type === 1) {
      if (isEmpty(interview_address)) {
        errors.interview_address = "Address is required";
      }
    }

    if (isEmpty(interview_timezone)) {
      errors.interview_timezone = "Timezone is required";
    }

    this.setState({ errors });
  }

  render() {
    const { timezones, classes, profiles, openSendInvitation } = this.props;
    const {
      interview_timezone,
      interview_date,
      isLoading,
      errors
    } = this.state;

    return (
      <>
        <Dialog
          open={openSendInvitation}
          onClose={this.props.closeSendInvitationsModal}
        >
          <DialogTitle>{"Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to invite those ${profiles.length} applicants to
              ${this.props.selected_step.step}?`}
            </DialogContentText>
            <SelectField
              label="Timezone"
              margin="none"
              options={timezones}
              value={interview_timezone}
              placeholder="Choose Timezone"
              isMulti={false}
              name="interview_timezone"
              fullWidth
              onChange={this.selectOnChange}
              error={errors.interview_timezone}
              required
            />
            <br/>
            <br/>
            <DatePickerField
              label="Interview Date & Time"
              name="interview_date"
              value={interview_date}
              onChange={this.dateOnChange}
              error={errors.interview_date}
              margin="none"
              usingTime={true}
            />
             <FormControl margin="none" className={classes.interviewComment}>
              <FormControlLabel
                className={classes.interviewCommentLabel}
                labelPlacement="top"
                control={
                  <TextField
                    onChange={this.onChange}
                    className={classes.interviewCommentText}
                    rows={5}
                    multiline
                    name="commentText"
                  />
                }
                label="Comments to share with the candidate"
              />
              {!isEmpty(errors.interview_type) && (
                <FormHelperText>{errors.interview_type}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.props.closeSendInvitationsModal}
            >
              <Close fontSize="small" /> Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.blueIMMAP}
              onClick={this.interview}
              disabled={isLoading || !isEmpty(errors)}
            >
              Confirm
              {isLoading ? (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              ) : (
                <Send fontSize="small" className={classes.addMarginLeft} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.microsoft_login}
          onClose={this.closeMicrosoftLogin}
        >
          <DialogTitle>{"Microsoft Login"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You will be redirected to Microsoft Outlook in order to login with
              your 3iSolution account. Please confirm the invitation after being
              authenticated.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.closeMicrosoftLogin();
              }}
            >
              <Close fontSize="small" /> Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.blueIMMAP}
              onClick={() => {
                window.open(this.state.microsoft_login_url, "_blank").focus();
                this.closeMicrosoftLogin();
              }}
            >
              Proceed
              {isLoading ? (
                <CircularProgress
                  thickness={5}
                  size={22}
                  className={classes.loading}
                />
              ) : (
                <Send fontSize="small" className={classes.addMarginLeft} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getTimezones,
  addFlashMessage,
  getImmapers
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = state => ({
  selected_step: state.roster.selected_step,
  roster_process: state.roster.roster_process,
  timezones: state.options.timezones,
  immapers: state.options.immapers,
  authSkype: state.options.skype
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = theme => ({
  inviteContainer: {
    "margin-bottom": (theme.spacing.unit / 2) * -1
  },

  interviewBtn: {
    "background-color": blue,
    color: white,
    "&:hover": {
      "background-color": blueIMMAPHover
    }
  },
  addSmallMarginLeft: {
    "margin-left": ".25em"
  },
  loading: {
    "margin-left": theme.spacing.unit,
    "margin-right": theme.spacing.unit,
    color: white
  },
  switchBase: {
    height: "auto"
  },
  switch: {
    marginLeft: 0
  },
  blueIMMAP: {
    background: blueIMMAP,
    "&:hover": {
      background: blueIMMAPHover
    },
    marginLeft: theme.spacing.unit * 1
  },
  interviewCommentText: {
    width: "100%",
    marginLeft: 0
  },
  interviewComment: {
    width: "100%",
    marginLeft: 0,
    padding: 0,
    alignItems: "left",
    alignContent: "left",
    marginTop: 15
  },
  interviewCommentLabel: {
    textAlign: "left",
    marginLeft: "0px",
    marginRight: "0px",
    alignItems: "start"
  }
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SendInvitationGroup)
);
