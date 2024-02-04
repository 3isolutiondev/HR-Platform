import React, { Component } from "react";
import PropTypes from 'prop-types';
import classname from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Edit from "@material-ui/icons/Edit";
import Email from "@material-ui/icons/Email";
import HistoryIcon from "@material-ui/icons/History";
import ReactCountryFlag from "react-country-flag";
import {
  borderColor,
  green,
  primaryColor,
  lightText,
  blueIMMAP,
  white,
  darkBlueIMMAP,
  blueIMMAPHover
} from "../../../config/colors";
import {
  getAlreadyImmaper,
  resetAlreadyiMMAPer,
  verifyEmail,
} from '../../../redux/actions/dashboard/immaperActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import { faUniversity } from "@fortawesome/free-solid-svg-icons/faUniversity";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";
import { faUserMd } from "@fortawesome/free-solid-svg-icons/faUserMd";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons/faMapMarkerAlt";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { faFileContract } from "@fortawesome/free-solid-svg-icons/faFileContract";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import isEmpty from "../../../validations/common/isEmpty";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContractHistoryModal from "../../dashboard/ContractHistoryModel";
import { can } from '../../../permissions/can';
class iMMAPerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      showLoading: false,
      openHistory: false
    };

    this.editOpen = this.editOpen.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  componentDidMount() {
    if (this.props.profileID !== false) {
      this.props.getAlreadyImmaper(this.props.profileID);
    }
  }

  componentDidUpdate(prevProps) {
    if ((this.props.profileID !== prevProps.profileID) && this.props.profileID !== false) {
      this.props.getAlreadyImmaper(this.props.profileID);
    }
  }

  editOpen() {
     window.open("/dashboard/immapers/" + this.props.user_id + "/edit", "_blank");
  }

  verifyEmail() {
    this.setState({ showLoading: true }, async () => {
      await this.props.verifyEmail();
      this.setState({ showLoading: false });
    });
  }

  render() {
    const {
      classes,
      editable,
      is_immaper,
      verified_immaper,
      immap_email,
      is_immap_inc,
      is_immap_france,
      immap_office,
      line_manager,
      job_title,
      duty_station,
      start_of_current_contract,
      end_of_current_contract,
      immap_contract_international,
      user_id
    } = this.props;
    const { showLoading, openHistory } = this.state;

    return (
      <Card className={classes.box}>
        <CardContent className={classes.card}>
          <Typography
            variant="subtitle1"
            color="primary"
            className={
              is_immaper == 1
                ? classname(classes.titleSection, classes.titleBorder)
                : classes.titleSection
            }
          > {moment(end_of_current_contract)  < moment.now() ? 'Was iMMAPer?' : 'Already iMMAPer?'}

            {is_immaper === 1 ? (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="lg"
                className={classname(classes.addMarginLeft, classes.yes)}
              />
            ) : (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="lg"
                  className={classname(classes.addMarginLeft, classes.no)}
                />
              )}
          </Typography>
          {editable && is_immaper === 1 ? (
            <IconButton
              onClick={this.editOpen}
              className={classes.addButton}
              aria-label="Delete"
              color="primary"
            >
              <Edit fontSize="small" />
            </IconButton>
          ) : null}
          {(is_immaper == 1) ? (
            <Grid container spacing={8} alignItems="flex-end">
              {is_immap_inc == 1 && is_immap_france == 0 ? (
                <Grid item xs={12}>
                  <Typography
                    component="div"
                    variant="subtitle1"
                    color="primary"
                    className={classes.HQ}
                  >
                    <Tooltip title="Headquarter">
                      <FontAwesomeIcon
                        icon={faUniversity}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    3iSolution{" "}
                    <Tooltip title="France">
                      <div className={classes.countryAvatar}>
                        <ReactCountryFlag
                          code="fr"
                          svg
                          styleProps={flag}
                          className={classes.countryAvatar}
                        />
                      </div>
                    </Tooltip>
                  </Typography>
                </Grid>
              ) : null}
              {is_immap_inc == 0 && is_immap_france == 1 ? (
                <Grid item xs={12}>
                  <Typography
                    component="div"
                    variant="subtitle1"
                    color="primary"
                    className={classes.HQ}
                  >
                    <Tooltip title="Headquarter">
                      <FontAwesomeIcon
                        icon={faUniversity}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    iMMAP France{" "}
                    <Tooltip title="France">
                      <div className={classes.countryAvatar}>
                        <ReactCountryFlag
                          code="fr"
                          svg
                          styleProps={flag}
                          className={classes.countryAvatar}
                        />
                      </div>
                    </Tooltip>
                  </Typography>
                </Grid>
              ) : null}
              {!isEmpty(immap_email) ? (
                <Grid item xs={12}>
                  <Link
                    variant="subtitle1"
                    className={classes.email}
                    href={"mailto:" + immap_email}
                  >
                    <Email fontSize="small" className={classes.iconEmail} />{" "}
                    {immap_email}
                  </Link>
                  {(verified_immaper === 0 || verified_immaper === "0") &&
                    (isEmpty(this.props.profileID) || this.props.profileID === true) ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        className={classes.verifyBtn}
                        onClick={this.verifyEmail}
                      >
                        Verify iMMAP Email{" "}
                        {showLoading ? (
                          <CircularProgress
                            thickness={5}
                            size={20}
                            className={classes.loading}
                          />
                        ) : null}
                      </Button>
                    ) : null}
                </Grid>
              ) : null}
              {!isEmpty(job_title) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="Job Title">
                      <FontAwesomeIcon
                        icon={faUserMd}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    Job Title: {job_title}
                  </Typography>
                </Grid>
              ) : null}
              {!isEmpty(duty_station) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="Duty Station">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    Duty Station: {duty_station}
                  </Typography>
                </Grid>
              ) : null}
              {!isEmpty(line_manager) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="Line Manager">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    Line Manager: {line_manager}
                  </Typography>
                </Grid>
              ) : null}
              {(!isEmpty(start_of_current_contract) && !isEmpty(end_of_current_contract)) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="Contract">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                      Contract:{" "}
                    {moment(start_of_current_contract).format("DD MMMM YYYY")}{" "}
                      - {moment(end_of_current_contract).format("DD MMMM YYYY")}
                  </Typography>
                </Grid>
              ) : null}
              {!isEmpty(immap_office) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="iMMAP Office">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    iMMAP Office: {immap_office.label}
                  </Typography>
                </Grid>
              ) : null}
              {!isEmpty(immap_contract_international) ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="secondary">
                    <Tooltip title="International Contract">
                      <FontAwesomeIcon
                        icon={faFileContract}
                        size="lg"
                        className={classes.faIcon}
                      />
                    </Tooltip>{" "}
                    International Contract:
                    {immap_contract_international === 1 ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size="lg"
                        className={classname(
                          classes.addMarginLeft,
                          classes.yes
                        )}
                      />
                    ) : (
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          size="lg"
                          className={classname(classes.addMarginLeft, classes.no)}
                        />
                      )}
                  </Typography>
                </Grid>
              ) : null}
              { can('View Previous Contract') &&
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    className={classes.blueIMMAP}
                    onClick={() => this.setState({ openHistory: true })}
                  >
                    Previous Contract
                    <HistoryIcon fontSize="small" className={classes.addSmallMarginLeft} />
                  </Button>
                </Grid>
              }
            </Grid>
          ) : null}
           <ContractHistoryModal
              isOpen={openHistory}
              userId={user_id}
              onClose={() => this.setState({ openHistory: false })}
              isFromProfile={true}
          />
        </CardContent>
      </Card>
    );
  }
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAlreadyImmaper,
  resetAlreadyiMMAPer,
  verifyEmail,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  errors: state.alreadyImmaper.errors,
  is_immaper: state.alreadyImmaper.is_immaper,
  verified_immaper: state.alreadyImmaper.verified_immaper,
  immap_email: state.alreadyImmaper.immap_email,
  is_immap_inc: state.alreadyImmaper.is_immap_inc,
  is_immap_france: state.alreadyImmaper.is_immap_france,
  immap_office: state.alreadyImmaper.immap_office,
  line_manager: state.alreadyImmaper.line_manager,
  job_title: state.alreadyImmaper.job_title,
  duty_station: state.alreadyImmaper.duty_station,
  start_of_current_contract: state.alreadyImmaper.start_of_current_contract,
  end_of_current_contract: state.alreadyImmaper.end_of_current_contract,
  immap_contract_international:
    state.alreadyImmaper.immap_contract_international,
  immap_offices: state.options.p11ImmapOffices,
  lineManagers: state.options.lineManagers,
  user_id: state.alreadyImmaper.user_id,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  box: { marginBottom: theme.spacing.unit * 2, overflow: "visible" },
  card: { position: "relative", paddingBottom: theme.spacing.unit * 2 + "px !important" },
  titleSection: { fontWeight: 700 },
  titleBorder: {
    paddingBottom: theme.spacing.unit * 2,
    borderBottom: "1px solid " + borderColor,
  },
  button: { marginLeft: theme.spacing.unit },
  border: {
    marginBottom: theme.spacing.unit / 2,
    borderBottom: "1px solid " + borderColor,
  },
  addButton: {
    position: "absolute",
    top: theme.spacing.unit,
    right: theme.spacing.unit / 2,
  },
  divider: { height: theme.spacing.unit * 2 },
  yes: { color: green },
  no: { color: primaryColor },
  addMarginLeft: { marginLeft: theme.spacing.unit },
  switch: { marginLeft: 0, },
  editIcon: {
    display: "inline-block",
    verticalAlign: "text-top",
    marginRight: theme.spacing.unit / 2,
  },
  countryAvatar: {
    width: "32px",
    height: "32px",
    overflow: "hidden",
    "border-radius": "50% !important",
    border: "1px solid " + lightText,
    verticalAlign: "middle",
    marginLeft: theme.spacing.unit,
    display: "inline-block",
  },
  check: {
    padding:
      theme.spacing.unit +
      "px " +
      (theme.spacing.unit + theme.spacing.unit / 2) +
      "px",
  },
  btnContainer: { marginTop: theme.spacing.unit, textAlign: "right" },
  HQ: { marginTop: theme.spacing.unit * 2 },
  faIcon: {
    marginRight: theme.spacing.unit / 2,
    fontSize: "20px",
    verticalAlign: "sub !important",
    display: "inline-block",
  },
  verifyBtn: {
    background: blueIMMAP,
    color: white,
    marginLeft: theme.spacing.unit,
    "&:hover": {
      background: darkBlueIMMAP,
    },
  },
  email: { color: blueIMMAP },
  iconEmail: {
    display: "inline-block",
    verticalAlign: "text-top",
    marginRight: theme.spacing.unit / 2,
  },
  loading: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: white,
  },
  blueIMMAP: {
    background: blueIMMAP,
    marginBottom: theme.spacing.unit * 2,
    color: white,
    "&:hover": {
      background: blueIMMAPHover,
    },
  },
  addSmallMarginLeft: { marginLeft: theme.spacing.unit }
});

const flag = {
  width: "32px",
  height: "32px",
  backgroundSize: "44px 44px",
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(iMMAPerBox)
);
