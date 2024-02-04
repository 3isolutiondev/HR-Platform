/** Import React, PropTypes, moment and classnames */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classname from "classnames";
import moment from "moment";

/** Import Material UI components, styles and icons */
import { createMuiTheme, MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MUIDataTable from "mui-datatables";
import Chip from "@material-ui/core/Chip";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import PresentToAll from "@material-ui/icons/PresentToAll";
import CloseIcon from "@material-ui/icons/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";

/** Import color set inside config/colors.js file */
import {
  archive,
  archiveHover,
  blue,
  darkBlueIMMAP,
  green,
  iMMAPSecondaryColor2022,
  iMMAPSecondaryColor2022Hover,
  lightText,
  purple,
  red,
  secondaryColor,
  white,
  yellow
} from "../../../config/colors";

/** Import validations, permissions, Redux, Redux Actions */
import { connect } from "react-redux";
import { getAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import { can } from "../../../permissions/can";
import isEmpty from "../../../validations/common/isEmpty";
import { getHQ, getImmapers, getImmapOffices } from "../../../redux/actions/optionActions";
import { storeStaffIds } from "../../../redux/actions/profile/myTeamActions";

/** import custom components needed on this component */
import CircleBtn from "../../../common/CircleBtn";
import ProfileModal from "../../../common/ProfileModal";
import ContractHistoryModal from "./../../dashboard/ContractHistoryModel";
import RequestContractModal from "../../../common/RequestContractModal";
import { themeOptions } from "../../../App";
import { pluck } from "../../../utils/helper";

const overrideMyTeamTable = createMuiTheme({
  ...themeOptions,
  overrides: {
    ...themeOptions.overrides,
    MuiTableCell: {
      root: {
        paddingLeft: 16,
        paddingRight: 16,
        minWidth: '80px !important',
        maxWidth: 'fit-content !important'
      }
    }
  }
});

const contractBeingProcessedText = "Contract is being processed";

/**
 * MyTeam is a component to show the all immapers under a line manager component inside Profile page
 *
 * @name MyTeam
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class MyTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      apiURL: "/api/immapers-by-line-manager",
      immapers: [],
      openMyTeam: false,
      openHistory: false,
      userId: "",
      selectedImmaper: "",
      roleFilters: { names: [] },
      openRequestContract: false,
      immaper: null
    };

    this.getData = this.getData.bind(this);
    this.onClose = this.onClose.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
  }
  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   */
  componentDidUpdate(previousProps, previousState) {
    if (this.state.isLoading == true && this.state.openMyTeam == true || (previousState.openMyTeam === false && this.state.openMyTeam === true)) {
      this.props.getHQ();
      this.props.getImmapOffices();
      this.props.getImmapers();
      this.getData();
    }
  }

  /**
   * getData is a function to fetch immapers data from the API
   */
  getData() {
    this.props
      .getAPI(this.state.apiURL)
      .then(res => {
        this.dataToArray(res.data);
        this.props.storeStaffIds(pluck(res.data.data, 'profile_id'))
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the request"
        });
      });
  }

  /**
   * dataToArray is a function to process data coming from an api so it can be presented using MUI Data tables
   * @param {object}  jsonData  - data coming from api call
   * @param {boolean} firstTime - first time call or not
   */
  dataToArray(jsonData, firstTime = false) {
    const { classes } = this.props;
    let immapersInArray = jsonData.data.map((immaper, index) => {
      let immaperName = immaper.full_name;
      if (can("Set as Admin") && immaper.archived_user === "yes") {
        immaperName = `${immaperName} [Archived]`;
      }

      const contractBeingProcessed = immaper.request_status === 'sent' ? true : false;

      let immaperTemp = [
        immaper.id,
        immaperName,
        immaper.immap_email,
        immaper.job_position,
        immaper.project_code,
        immaper.duty_station,
        immaper.immap_office,
        immaper.start_of_current_contract,
        immaper.end_of_current_contract,
        contractBeingProcessed ? contractBeingProcessedText : immaper.status_contract
      ];

      const endDate = moment(immaper.end_of_current_contract);
      const currentDate = moment(new Date());

      let checkExpiredContract =
        endDate.diff(currentDate, "days") <= 30 ? true : false;

      const actions = (
        <div className={classes.actions}>
          <CircleBtn
            openNewTab={true}
            link={`/profile/${immaper.profile_id}`}
            color={classes.blue}
            size="small"
            icon={<RemoveRedEye />}
            tooltipText="View Profile"
          />
          <CircleBtn
            onClick={() =>
              this.setState({
                openHistory: true,
                userId: immaper.id,
                selectedImmaper: immaperName
              })
            }
            color={classes.red}
            size="small"
            icon={<HistoryIcon />}
            tooltipText="Past Contract"
          />
          {(checkExpiredContract || immaper.status_contract == 'active') && (
            <CircleBtn
              onClick={() =>
                this.setState({
                  openRequestContract: true,
                  userId: immaper.id,
                  immaper: immaper
                })
              }
              color={classes.contract}
              size="small"
              icon={<PresentToAll />}
              disabled={contractBeingProcessed}
              tooltipText={contractBeingProcessed ? contractBeingProcessedText : 'Contract Request'}
            />
          )}
        </div>
      );

      immaperTemp.push(actions);

      return immaperTemp;
    });

    if (firstTime) {
      this.setState({
        immapers: immapersInArray,
        isLoading: false
      });
    } else {
      this.setState({ immapers: immapersInArray, isLoading: false });
    }
  }

  /**
   * onClose is a function to close the modal
   */
  onClose() {
    this.setState({ isLoading: true });
    this.props.onClose();
  }
  render() {
    const { classes } = this.props;
    const {
      immapers,
      openMyTeam,
      openHistory,
      userId,
      selectedImmaper,
      openRequestContract,
      immaper
    } = this.state;

    const columns = [
      {
        name: "id",
        options: {
          display: "excluded",
          filter: false,
          sort: false
        }
      },
      {
        name: "Full Name",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          })
        }
      },
      {
        name: "iMMAP Email",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "80px", maxWidth: "80px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "30px", maxWidth: "30px" }
          })
        }
      },
      {
        name: "Job Position",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          })
        }
      },
      {
        name: "Project Code",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          })
        }
      },
      {
        name: "Duty Station",
        options: {
          filter: false,
          sort: true,
          filterOptions: this.state.dutyStationFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          })
        }
      },
      {
        name: "iMMAP Office",
        options: {
          filter: false,
          sort: true,
          filterOptions: this.state.immapOfficeFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          })
        }
      },
      {
        name: "Start Contract",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          }),
          customBodyRender: (value, key) => {
            if (!isEmpty(value)) {
              return (
                <div key={key} style={{ width: 72 }}>
                  {value}
                </div>
              );
            }
          }
        }
      },
      {
        name: "End Contract",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" }
          }),
          customBodyRender: (value, key) => {
            if (!isEmpty(value)) {
              return (
                <div key={key} style={{ width: 72 }}>
                  {value}
                </div>
              );
            }
          }
        }
      },
      {
        name: "Status of Contract",
        options: {
          filter: false,
          sort: true,
          filterOptions: { names: ["Active", "Renew Period", "Offboarding Queue"] },
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" }
          }),
          customBodyRender: (value, key) => {
            let { classes } = this.props;
            if (!isEmpty(value)) {
              return (
                <Chip
                  key={key}
                  label={value}
                  className={classname(
                    classes.chip,
                    classes.capitalize,
                    value === contractBeingProcessedText ? classes.btnContract :
                    value == "active" ? classes.btnActive :
                    value == "off-boarding queue" ? classes.btnOffboarding :
                    value == 'renew period' ? classes.btnRenew : ''
                  )}
                  color="primary"
                  variant="outlined"
                />
              );
            }
          }
        }
      },
      {
        name: "Action",
        options: {
          filter: false,
          sort: false.valueOf,
          download: false
        }
      }
    ];

    const options = {
      responsive: "scroll",
      download: true,
      selectableRows: "none",
      filter: false,
      print: false,
      search: false,
      select: false,
      rowsPerPageOptions: [],
      rowsPerPage: 2000,
      downloadOptions: {
        filename: "Consultants.csv",
        filterOptions: { useDisplayedColumnsOnly: true }
      }
    };

    return (
      <div>
        <Button
          variant="contained"
          className={classes.myTeamtBtn}
          fullWidth
          size="small"
          onClick={() => this.setState({ openMyTeam: true })}
        >
          My Team{" "}
          <FontAwesomeIcon
            icon={faUsers}
            size="lg"
            className={classes.addMarginLeft}
          />
        </Button>
        <Dialog
          open={openMyTeam}
          fullWidth
          maxWidth="xl"
          onClose={() => this.setState({ openMyTeam: false })}
        >
          <DialogContent>
            <MuiThemeProvider theme={overrideMyTeamTable}>
              <MUIDataTable
                title={"My Team"}
                data={immapers}
                columns={columns}
                options={options}
                download={true}
                print={false}
              />
            </MuiThemeProvider>
            <ContractHistoryModal
              isOpen={openHistory}
              userId={userId}
              selectedImmaper={selectedImmaper}
              onClose={() => this.setState({ openHistory: false })}
              isFromProfile={false}
            />
            <RequestContractModal
              isOpen={openRequestContract}
              onClose={() => this.setState({ openRequestContract: false })}
              immaper={immaper}
              defaultRequest={immaper != null ? (immaper.status_contract !== 'active' ? 'contract-extension' : 'contract-amendment') : 'contract-extension'}
              reload={() => this.getData()}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ openMyTeam: false })}
              color="secondary"
              variant="contained"
            >
              <CloseIcon /> Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MyTeam.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * getAPI is a prop function to call get api
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * storeStaffIds is a prop function to save staff ids
   */
  storeStaffIds: PropTypes.func.isRequired,
};

/**
 * set up styles for this
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = theme => {
  const defaultSpacing = theme.spacing.unit * 2;
  const tinySpacing = theme.spacing.unit / 2;

  return {
    addMarginTop: { marginTop: defaultSpacing },
    bold: { fontWeight: 700 },
    redText: { color: "red" },
    myTeamtBtn: {
      background: archive,
      color: white,
      marginBottom: theme.spacing.unit * 2,
      "&:hover": { color: white, background: archiveHover }
    },
    loading: { color: white, marginRight: tinySpacing },
    addMarginLeft: { marginLeft: theme.spacing.unit },
    actions: {
      width: 144
    },
    blue: {
      "background-color": blue,
      color: white,
      "&:hover": {
        color: secondaryColor
      }
    },
    purple: {
      "background-color": purple,
      color: white,
      "&:hover": {
        color: secondaryColor
      }
    },
    contract: {
      "background-color": iMMAPSecondaryColor2022,
      color: white,
      "&:hover": {
        color: iMMAPSecondaryColor2022Hover
      }
    },
    red: {
      "background-color": red,
      color: white,
      "&:hover": {
        color: secondaryColor
      }
    },
    capitalize: {
      "text-transform": "capitalize"
    },
    chip: {
      margin: theme.spacing.unit
    },
    btnActive: {
      borderColor: green,
      color: green
    },
    btnRenew: {
      borderColor: yellow,
      color: yellow
    },
    btnOffboarding: {
      borderColor: lightText,
      color: lightText
    },
    btnContract: {
      borderColor: darkBlueIMMAP,
      color: darkBlueIMMAP
    }
  };
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  addFlashMessage,
  getHQ,
  getImmapers,
  getImmapOffices,
  storeStaffIds
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = state => ({});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyTeam)
);
