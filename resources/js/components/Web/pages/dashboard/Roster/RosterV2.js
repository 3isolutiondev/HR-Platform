import React, { Component } from "react";
import classname from "classnames";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import Button from "@material-ui/core/Button";
import "react-input-range/lib/css/index.css";
import "../../../common/HR/job.css";
import { addFlashMessage } from "../../../redux/actions/webActions";
import MUIDataTable from "mui-datatables";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import CircleBtn from "../../../common/CircleBtn";
import ProfileModal from "../../../common/ProfileModal";
import {
  blue,
  white,
  secondaryColor,
  primaryColor,
} from "../../../config/colors";

import { can } from "../../../permissions/can";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../config/general";
import isEmpty from "../../../validations/common/isEmpty";
import {
  getRosters,
  setUserFormData as onChange,
  handleViewProfile,
  getRosterDashboard
} from "../../../redux/actions/dashboard/roster/rosterDashboardActions";
import RosterV2Filter from "./RosterV2Filter";
import { resetFilter } from "../../../redux/actions/dashboard/roster/rosterDashboardFilterActions";

// import moment from "moment";
// import Loadable from "react-loadable";
// import Add from "@material-ui/icons/Add";
// import Edit from "@material-ui/icons/Edit";
// import Close from "@material-ui/icons/Close";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
// import Typography from "@material-ui/core/Typography";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
// import InputRange from "react-input-range";
// import Drawer from "@material-ui/core/Drawer";
// import Grid from "@material-ui/core/Grid";
// import PropTypes from "prop-types";
// import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';



class RosterV2 extends Component {
  constructor(props) {
    super(props);

    this.dataToArray = this.dataToArray.bind(this);
    this.getData = this.getData.bind(this);
    this.setRosterData = this.setRosterData.bind(this);
  }

  componentDidMount() {
    this.setRosterData(true);
    this.props.onChange('isLoading', true);
    // this.props.getImmapers();
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.match.params.slug) !==
      JSON.stringify(this.props.match.params.slug)
    ) {
      this.props.onChange('isLoading', true);
      this.setRosterData(true);
      this.props.resetFilter();
    }
    if (
      prevProps.experience !== this.props.experience ||
      JSON.stringify(prevProps.chosen_language) !==
      JSON.stringify(this.props.chosen_language) ||
      JSON.stringify(prevProps.chosen_degree_level) !==
      JSON.stringify(this.props.chosen_degree_level) ||
      JSON.stringify(prevProps.chosen_sector) !==
      JSON.stringify(this.props.chosen_sector) ||
      JSON.stringify(prevProps.chosen_skill) !==
      JSON.stringify(this.props.chosen_skill) ||
      JSON.stringify(prevProps.chosen_field_of_work) !==
      JSON.stringify(this.props.chosen_field_of_work) ||
      JSON.stringify(prevProps.chosen_country) !==
      JSON.stringify(this.props.chosen_country) ||
      JSON.stringify(prevProps.chosen_country_of_residence) !==
      JSON.stringify(this.props.chosen_country_of_residence) ||
      JSON.stringify(prevProps.is_available) !==
      JSON.stringify(this.props.is_available) ||
      JSON.stringify(prevProps.immaper_status) !==
      JSON.stringify(this.props.immaper_status) ||
      JSON.stringify(prevProps.chosen_nationality) !==
      JSON.stringify(this.props.chosen_nationality)
    ) {
      this.dataToArray(this.props.roster.id);
    }
  }

  setRosterData(firstTime = false) {
    //   let roster = this.props.rosterDashboard.find(
    //     (dt) => dt.slug === this.props.match.params.slug
    //   );

    //   if (!isEmpty(roster)) {
    //     this.props.onChange("roster", roster);
    //     this.props.onChange("loadingText", "Loading Super Human Profiles...");
    //     this.props.onChange("emptyDataText", "Sorry, No Profile can be found");
    //     this.dataToArray(roster.id, firstTime);
    //   } else {
    //     this.props.addFlashMessage({
    //       type: "error",
    //       text: "There is an error while processing the request",
    //     });
    //     this.props.history.push("/");
    //   }
    // }
    this.props.getRosterDashboard()
      .then((data) => {
        if (!isEmpty(data) && typeof data !== 'undefined') {
          const isAdmin = can("Set as Admin")
          let rosterData = data.find(
            (dt) => dt.slug === this.props.match.params.slug && (isAdmin || (!isAdmin && dt.under_sbp_program == "yes"))
          );
          if (!isEmpty(rosterData)) {
            this.props.onChange("roster", rosterData);
            this.props.onChange("loadingText", "Loading Super Human Profiles...");
            this.props.onChange("emptyDataText", "Sorry, No Profile can be found");
            this.dataToArray(rosterData.id, firstTime);
          } else {
            // this.props.addFlashMessage({
            //   type: "error",
            //   text: "There is an error while processing the request",
            // });
            this.props.history.push("/404");
          }
        } else {
          this.props.history.push("/404");
        }
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the request",
        });
        this.props.history.push("/")
      })
  }

  getData(roster_process_id) {
    const { getRosters } = this.props;
    return new Promise(function (resolve, reject) {
      let result = getRosters(roster_process_id);
      resolve(result);
      // reject(errror);
    });
  }

  dataToArray(roster_process_id, firstTime = false) {
    this.getData(roster_process_id).then((res) => {
      let { classes, roster_members } = this.props;

      if (firstTime) {
        this.props.onChange('firstLoaded', true);
        this.props.onChange('isLoading', false);
      } else {
        this.props.onChange('isLoading', false);
      }

      if (!isEmpty(roster_members)) {
        let membersInArray = roster_members.map((member) => {
          let memberTemp = [
            member.id,
            member.email,
            member.user.full_name,
            member.job_title,
            member.untilNow,
          ];

          const actions = (
            <div className={classes.actions}>
              {can("Show Roster Dashboard") && (
                <CircleBtn
                  onClick={() => this.props.handleViewProfile(member.id)}
                  color={classes.blue}
                  size="small"
                  icon={<RemoveRedEye />}
                />
              )}
            </div>
          );

          memberTemp.push(actions);

          return memberTemp;
        });
        this.props.onChange("roster_members", membersInArray);
      } else {
        this.props.onChange("roster_members", []);
      }
    });
  }

  render() {
    const {
      roster,
      columns,
      roster_members,
      openDrawer,
      id,
      openProfile,
      classes,
      firstLoaded,
      isLoading,
      loadingText,
      emptyDataText
    } = this.props;

    const options = {
      responsive: 'scroll',
      filterType: 'dropdown',
      download: false,
      print: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: (firstLoaded === false) ? loadingText : (isLoading) ? loadingText : emptyDataText
        }
      },
    }

    return (
      <div >
        <Helmet>
          <title>{APP_NAME + " - Dashboard > " + roster.name}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > " + roster.name}
          />
        </Helmet>
        <Button
          className={classname(classes.capitalize, classes.filterBtn)}
          variant="contained"
          color="primary"
          aria-owns={openDrawer ? "fade-menu" : undefined}
          aria-haspopup="true"
          onClick={() => this.props.onChange("openDrawer", true)}
        >
          Filter
          {openDrawer ? <ArrowDropUp /> : <ArrowDropDown />}
        </Button>
        <MUIDataTable
          title={roster.name}
          data={roster_members}
          columns={columns}
          options={options}
          download={false}
          print={false}
        />
        <RosterV2Filter getRoster={this.dataToArray} classes={classes} />
        <ProfileModal
          isOpen={openProfile}
          profileId={id}
          onClose={() => this.props.onChange("openProfile", !openProfile)}
        />
      </div>
    );
  }
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getRosters,
  onChange,
  handleViewProfile,
  resetFilter,
  addFlashMessage,
  getRosterDashboard
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  rosterDashboard: state.rosterDashboard.rosterDashboard,
  roster: state.rosterDashboard.roster,
  columns: state.rosterDashboard.columns,
  isLoading: state.rosterDashboard.isLoading,
  firstLoaded: state.rosterDashboard.firstLoaded,
  emptyDataText: state.rosterDashboard.emptyDataText,
  loadingText: state.rosterDashboard.loadingText,
  roster_members: state.rosterDashboard.roster_members,
  openDrawer: state.rosterDashboard.openDrawer,
  id: state.rosterDashboard.id,
  openProfile: state.rosterDashboard.openProfile,
  isLoading: state.rosterDashboard.isLoading,

  experience: state.filter.experience,
  chosen_language: state.filter.chosen_language,
  chosen_degree_level: state.filter.chosen_degree_level,
  chosen_sector: state.filter.chosen_sector,
  chosen_skill: state.filter.chosen_skill,
  chosen_field_of_work: state.filter.chosen_field_of_work,
  chosen_country: state.filter.chosen_country,
  chosen_nationality: state.filter.chosen_nationality,
  chosen_country_of_residence: state.filter.chosen_country_of_residence,
  immaper_status: state.filter.immaper_status,
  is_available: state.filter.is_available,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  blue: {
    "background-color": blue,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  capitalize: {
    "text-transform": "capitalize",
  },
  filterBtn: {
    marginBottom: theme.spacing.unit * 2,
  },
  card: {
    overflow: "auto",
    padding: theme.spacing.unit * 2,
  },
  capitalize: {
    "text-transform": "capitalize",
  },
  addPaddingBottom: {
    "padding-bottom": ".75em",
  },
  sliderLabel: {
    "padding-bottom": "1.5em",
  },
  sliderColor: {
    background: primaryColor,
  },
  title: {
    borderBottom: "1px solid " + primaryColor,
    paddingBottom: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    position: "relative",
  },
  reset: {
    position: "absolute",
    top: "6px",
    right: theme.spacing.unit * 4,
    padding: 0,
    borderRadius: 0,
    width: "auto !important",
    minWidth: 0,
    "&:hover": {
      borderBottom: "1px solid " + primaryColor,
      background: "transparent",
    },
  },
  sliderFormHelperText: {
    "margin-top": "2.5em",
  },
  close: {
    position: "absolute",
    top: "6px",
    right: 0,
    cursor: "pointer",
    color: secondaryColor,
    "&:hover": {
      borderBottom: "1px solid " + secondaryColor,
    },
  },
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RosterV2)
);
