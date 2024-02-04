/** import React, classnames, queryString, moment, PropTypes and React Helmet*/
import React from 'react';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import queryString from 'query-string'

/** import Material UI withStyles, datatables, components and icons */
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import withWidth from '@material-ui/core/withWidth';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import LoopIcon from '@material-ui/icons/Loop';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import FilterListIcon from '@material-ui/icons/FilterList';
import PresentToAll from '@material-ui/icons/PresentToAll';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';

/** import custom components needed on this component */
import CircleBtn from '../../common/CircleBtn';
import ProfileModal from '../../common/ProfileModal';
import ContractHistoryModal from "./ContractHistoryModel";
import ChangeLineManagerModel from "./ChangeLineManagerModel";
import ImmapersFilter from './ImmapersFilter';
// import AddImmaperForm from './AddImmaperForm';
import RequestContractForm from './RequestContractForm';
import RequestContractModal from "../../common/RequestContractModal";
import Modal from '../../common/Modal';
import DropzoneFileField from '../../common/formFields/DropzoneFileField';


/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { onChange } from '../../redux/actions/dashboard/immaperFormActions';
import { onChange as onChangeImmaperFilter, isFilterIsReset } from '../../redux/actions/dashboard/immapersFilterActions';

/** import configuration value, permission checker, validation and helper */
import { APP_NAME } from '../../config/general';
import { blue, purple, white, secondaryColor, green, yellow, red, primaryColor, iMMAPSecondaryColor2022, iMMAPSecondaryColor2022Hover, darkBlueIMMAP, lightText } from '../../config/colors';
import { can } from '../../permissions/can';
import isEmpty from '../../validations/common/isEmpty';
import { pluck } from "../../utils/helper";
import { getHQ, getImmapers, getImmapOffices } from '../../redux/actions/optionActions';
import { themeOptions } from "../../App";
import {importImmapersURL, immapersCollectionName, acceptedImmapersFiles } from '../../config/general';

const overrideImmapersTable = createMuiTheme({
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
 * iMMAPers is a component to show iMMAPers list page
 *
 * @name iMMAPers
 * @component
 * @category Page
 * @subcategory iMMAPers List
 *
 */
class iMMAPers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoaded: false,
      isLoading: false,
      loadingText: "Loading Super Human Profiles...",
      emptyDataText: "Sorry, No User Data can be found",
      immapers: [],
      count: 0,
      page: 0,
      search: "",
      filters: [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      dutyStationFilters: { names: [] },
      immapOfficeFilters: { names: [] },
      lineManagerFilters: { names: [] },
      serverSideFilterList: [],
      filterDutyStation: "",
      filterImmapOffice: "",
      filterLineManager: "",
      filterStatusContract: "",
      filterContractExpire: "",
      filterProjectCode: "",
      filterRole: "",
      apiURL: "/api/immapers",
      apiFilterURL: "/api/get-immapers-by-filter",
      openProfile: false,
      openHistory: false,
      openChangeLineManager: false,
      profileId: "",
      userId: "",
      selectedImmaper: "",
      roleFilters: { names: [] },
			filterMobile: false,
      openRequestContractForm: false,
      openRequestContract: false,
      immaper: null,
      openImportImmmapers: false
    };
    this.timer = null;

    this.getImmapers = this.getImmapers.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
    this.getFiltersData = this.getFiltersData.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.timerCheck = this.timerCheck.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.setLoadingImmapers = this.setLoadingImmapers.bind(this);
		this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
    this.getImmaperData = this.getImmaperData.bind(this);
    this.checkQueryParameter = this.checkQueryParameter.bind(this);
    this.handleOpenImportModel = this.handleOpenImportModel.bind(this);
    this.handleCloseImportModel = this.handleCloseImportModel.bind(this);
		this.onUpload = this.onUpload.bind(this);

  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.getRoles();
    this.getFiltersData();
    this.getImmapers(true);
    this.checkQueryParameter();
    this.props.getHQ();
    this.props.getImmapers(true);
    this.props.getImmapOffices();
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.timerCheck();
    }
    if (this.props.immaperFilter.isFilter && (JSON.stringify(prevProps.immaperFilter) !== JSON.stringify(this.props.immaperFilter) || prevProps.immaperFilter !== this.props.immaperFilter)) {
      this.getImmaperData();
    }
  }

  /**
   * getRoles is a function to get roles
   */
  getRoles() {
    this.props
      .getAPI("/api/roles")
      .then((res) => {
        this.setState({ roleFilters: pluck(res.data.data, "name") });
      })
      .catch((err) => {
        this.setState({ roleFilters: { names: [] } });
      });
  }

   /**
   * getFiltersData is a function to get filters data
   */
  getFiltersData() {
    this.props
      .getAPI("/api/immapers-filter-data")
      .then((res) => {
        const {
          dutyStationFilters,
          immapOfficeFilters,
          lineManagerFilters,
        } = res.data.data;
        this.setState({
          dutyStationFilters: { names: dutyStationFilters },
          immapOfficeFilters: { names: immapOfficeFilters },
          lineManagerFilters: { names: lineManagerFilters },
        });
      })
      .catch((err) => {
        this.setState({
          dutyStationFilters: { names: [] },
          immapOfficeFilters: { names: [] },
          lineManagerFilters: { names: [] },
        });
      });
  }

  /**
   * getImmapers is a function to get iMMAPers list data
   * @param {boolean} firstTime   - first time call
   * @param {number}  page        - page number
   * @param {array}   filterList  - array consist of filter data
   */
  getImmapers(firstTime = false, page, filterList = []) {
    let queryData = "";

    if (this.state.search) queryData = `?search=${this.state.search}`;

    if (!isEmpty(page)) {
      page = page == 0 ? 1 : page;
      queryData =
        queryData + (!isEmpty(queryData) ? "&" : "?") + "page=" + page;
    }

    const filterRole = !isEmpty(filterList)
      ? !isEmpty(filterList[4])
        ? filterList[4]
            .map((value) => `role=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterRole;
    const filterProjectCode = !isEmpty(filterList)
      ? !isEmpty(filterList[5])
        ? filterList[5]
            .map((value) => `projectCode=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterProjectCode;
    const filterDutyStation = !isEmpty(filterList)
      ? !isEmpty(filterList[6])
        ? filterList[6]
            .map((value) => `station=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterDutyStation;
    const filterImmapOffice = !isEmpty(filterList)
      ? !isEmpty(filterList[7])
        ? filterList[7]
            .map((value) => `office=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterImmapOffice;
    const filterLineManager = !isEmpty(filterList)
      ? !isEmpty(filterList[8])
        ? filterList[8]
            .map((value) => `manager=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterLineManager;
    const filterStatusContract = !isEmpty(filterList)
      ? !isEmpty(filterList[11])
        ? filterList[11]
            .map((value) => `contract=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterStatusContract;
    const filterContractExpire = !isEmpty(filterList)
      ? !isEmpty(filterList[12])
        ? filterList[12]
            .map((value) => `expire=${encodeURIComponent(value)}`)
            .join("&")
        : ""
      : this.state.filterContractExpire;
    this.setState({
      filterDutyStation,
      filterImmapOffice,
      filterLineManager,
      filterStatusContract,
      filterContractExpire,
      filterRole,
      filterProjectCode,
    });
    if (!isEmpty(filterDutyStation))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterDutyStation}`
        : `${queryData}?${filterDutyStation}`;
    if (!isEmpty(filterImmapOffice))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterImmapOffice}`
        : `${queryData}?${filterImmapOffice}`;
    if (!isEmpty(filterLineManager))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterLineManager}`
        : `${queryData}?${filterLineManager}`;
    if (!isEmpty(filterStatusContract))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterStatusContract}`
        : `${queryData}?${filterStatusContract}`;
    if (!isEmpty(filterContractExpire))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterContractExpire}`
        : `${queryData}?${filterContractExpire}`;
    if (!isEmpty(filterRole))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterRole}`
        : `${queryData}?${filterRole}`;
    if (!isEmpty(filterProjectCode))
      queryData = !isEmpty(queryData)
        ? `${queryData}&${filterProjectCode}`
        : `${queryData}?${filterProjectCode}`;

    this.props
      .getAPI(`${this.state.apiURL}${queryData}`)
      .then((res) => {
        this.setState({
          count: res.data.data.total,
          page: res.data.data.current_page - 1,
        });
        this.dataToArray(res.data.data, firstTime);
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: "error",
          text: "There is an error while processing the request",
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
      if (can('Set as Admin') && immaper.archived_user === "yes") {
        immaperName = `${immaperName} [Archived]`;
      }

      const contractBeingProcessed = immaper.request_status === "sent" ? true : false;

      let immaperTemp = [
        immaper.id,
        immaper.immap_email,
        immaperName,
        immaper.job_position,
        immaper.role,
        immaper.project_code,
        immaper.duty_station,
        immaper.immap_office,
        immaper.line_manager_name || immaper.line_manager,
        immaper.start_of_current_contract,
        immaper.end_of_current_contract,
        contractBeingProcessed ? contractBeingProcessedText : immaper.status_contract
      ];

      const endDate =   moment(immaper.end_of_current_contract);
      const currentDate = moment(new Date());

      let checkExpiredContract =  endDate.diff(currentDate, "days") <= 30 ? true: false;

      const actions = (
        <div className={classes.actions}>
          {can("Show Immaper") && (
            <CircleBtn
              onClick={() =>
                this.setState({
                  openProfile: true,
                  profileId: immaper.profile_id,
                })
              }
              color={classes.blue}
              size='small'
              icon={<RemoveRedEye />}
              tooltipText="View Profile"
            />
          )}
           {can("Edit Immaper") && ((checkExpiredContract && immaper.status_contract !== 'not active') || immaper.status_contract == 'active') && (
            <CircleBtn
              onClick={() =>
                this.setState({
                  openRequestContract: true,
                  userId: immaper.id,
                  immaper: immaper
                })
              }
              color={classes.contract}
              size='small'
              icon={<PresentToAll />}
              disabled={contractBeingProcessed}
              tooltipText={contractBeingProcessed ? contractBeingProcessedText : ''}
            />
          )}
          {can("Show Immaper") && (
            <CircleBtn
              onClick={() =>
                this.setState({
                  openHistory: true,
                  userId: immaper.id,
                  selectedImmaper: immaperName,
                })
              }
              color={classes.red}
              size='small'
              icon={<HistoryIcon />}
              tooltipText="Past Contract"
            />
          )}
          {can("Show Immaper") && immaper.status_contract == 'active' && (
            <CircleBtn
              onClick={() =>
                this.setState({
                  openChangeLineManager: true,
                  userId: immaper.id,
                  selectedImmaper: immaperName,
                })
              }
              color={classes.green}
              size='small'
              icon={<LoopIcon />}
            />
          )}
          {(can('Set as Admin') || can('Edit Immaper')) && (
            <CircleBtn
              // link={'/dashboard/users/' + immaper.id + '/edit'}
              // UNCOMMENT LINK ABOVE AND COMMENT LINK BELOW TO WHEN MOVE IT TO PRODUCTION
              link={"/dashboard/immapers/" + immaper.id + "/edit"}
              color={classes.purple}
              size='small'
              icon={<Edit />}
              tooltipText="Edit User"
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
        firstLoaded: true,
        isLoading: false,
      });
    } else {
      this.setState({ immapers: immapersInArray, isLoading: false });
    }
  }

  /**
   * handleFilter is a function set filter data
   * @param {array} filterList - filter data
   */
  handleFilter(filterList) {
    this.setState(
      {
        isLoading: true,
        filters: filterList,
        serverSideFilterList: filterList,
      },
      () => this.getImmapers(false, this.state.page, filterList)
    );
  }

  /**
   * timerCheck is a function to delay getting data when the user type something in the search box
   */
  timerCheck() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getImmapers(false, this.state.page);
    }, 500);
  }

  /**
   * setLoadingImmapers is a function to show / hide loading text
   * @param {Boolean} loading
   */
  setLoadingImmapers(isLoading = false) {
		this.setState({ isLoading })
	}

   /**
   * toggleFilterMobile is a function to toggle filter in mobile
   */
	toggleFilterMobile() {
		this.setState({ filterMobile: this.state.filterMobile ? false : true });
	}

  /**
   * getImmaperData is a function to get tor data according to the filter selected
   */
    getImmaperData(firstTime = false) {
       const {  search, contract_expire_date, duty_station, immap_office, line_manager, status_contract, project_code, isFilter } = this.props.immaperFilter;

        const filterData = {
          search,
          contract_expire_date,
          duty_station,
          immap_office,
          line_manager,
          status_contract,
          project_code,
        };

        // create query parameter
        const queryStringData = Object.keys(filterData).map(key => {
          if (!isEmpty(filterData[key])) {
            if (key === "duty_station" || key === "immap_office" || key === "line_manager" || key === "status_contract" || key === "project_code") {
              return filterData[key].map((data) => key + '=' + data).join('&')
            } else {
              return key + '=' + filterData[key]
            }
          }
        });

        const queryString = queryStringData.filter(function (element) {
          return element !== undefined;
        }).join('&');

        if (isFilter) {
          this.props.postAPI(this.state.apiFilterURL, filterData)
          .then((res) => {
            this.setState({
              count: res.data.data.total,
              page: res.data.data.current_page - 1,
            });
            this.dataToArray(res.data.data, firstTime);
            if (!isEmpty(queryString)) {
              this.props.history.push({
              pathname: '/dashboard/immapers',
              search: queryString,
              })
            } else {
              this.props.history.push('/dashboard/immapers')
            }
          })
          .catch((err) => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while processing the request'
            });
          });
      }
    }

   /**
   * checkQueryParameter is a function check query parameter on the url
   */
	checkQueryParameter() {
		const valuesQueryString = queryString.parse(this.props.location.search)

		// check if empty data querystring
		if (!('search' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('search', '')
		}
		if (!('contract_expire_date' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('contract_expire_date', '')
		}
		if (!('duty_station' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('duty_station', [])
		}
		if (!('immap_office' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('immap_office', [])
		}
		if (!('line_manager' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('line_manager', [])
		}
    if (!('status_contract' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('status_contract', [])
		}
    if (!('project_code' in valuesQueryString)) {
		  this.props.onChangeImmaperFilter('project_code', [])
		}

		// querystring map
		Object.keys(valuesQueryString).map(key => {
        if (key === "search") {
           this.props.onChangeImmaperFilter(key, valuesQueryString[key])
        } else if (key === "contract_expire_date") {
           this.props.onChangeImmaperFilter(key, valuesQueryString[key])
        } else if (key === "duty_station") {
          if (typeof valuesQueryString[key] === "string") {
            this.props.onChangeImmaperFilter(key, [valuesQueryString[key]])
          } else {
            this.props.onChangeImmaperFilter(key, valuesQueryString[key])
          }
        } else if (key === "immap_office") {
          if (typeof valuesQueryString[key] === "string") {
            this.props.onChangeImmaperFilter(key, [valuesQueryString[key]])
          } else {
            this.props.onChangeImmaperFilter(key, valuesQueryString[key])
          }
        } else if (key === "line_manager") {
          if (typeof valuesQueryString[key] === "string") {
            this.props.onChangeImmaperFilter(key, [valuesQueryString[key]])
          } else {
            this.props.onChangeImmaperFilter(key, valuesQueryString[key])
          }
        } else if (key === "status_contract") {
          if (typeof valuesQueryString[key] === "string") {
            this.props.onChangeImmaperFilter(key, [valuesQueryString[key]])
          } else {
            this.props.onChangeImmaperFilter(key, valuesQueryString[key])
          }
        } else if (key === "project_code") {
          if (typeof valuesQueryString[key] === "string") {
            this.props.onChangeImmaperFilter(key, [valuesQueryString[key]])
          } else {
            this.props.onChangeImmaperFilter(key, valuesQueryString[key])
          }
        }
      });
      this.props.isFilterIsReset(true, false)
	  }

  /**
   * handleOpenImportModel is a function to open the import immapers model
   */
    handleOpenImportModel() {
      this.setState({ openImportImmmapers: true });
    }

   /**
   * handleCloseImportModel is a function to close the import immapers model
   */
    handleCloseImportModel() {
      this.setState({ openImportImmmapers: false }, () => {
      });
    }

   /**
   * onUpload is a function to becalled after immporting new immapers
   */
   async onUpload(name, files) {
      if (!isEmpty(files)) {
        this.props.addFlashMessage({
          type: 'success',
          text: files[0].data.message
        });
      }
      this.getImmaperData();
      this.handleCloseImportModel();
    }

  render() {
    const {
      immapers,
      count,
      page,
      firstLoaded,
      loadingText,
      emptyDataText,
      isLoading,
      openProfile,
      openHistory,
      openChangeLineManager,
      profileId,
      userId,
      selectedImmaper,
      filterMobile,
      openRequestContractForm,
      openRequestContract,
      immaper,
      openImportImmmapers
    } = this.state;

    const { classes, width } = this.props;

    const columns = [
      {
        name: "id",
        options: {
          display: "excluded",
          filter: false,
          sort: false,
        },
      },
      {
        name: "3iSolution Email",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "80px", maxWidth: "80px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "30px", maxWidth: "30px" },
          }),
        },
      },
      {
        name: "Full Name",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Job Position",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Role",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[4],
          filterOptions: this.state.roleFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Project Code",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[5],
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Duty Station",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[6],
          filterOptions: this.state.dutyStationFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "3iSolution Office",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[7],
          filterOptions: this.state.immapOfficeFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Line Manager",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[8],
          filterOptions: this.state.lineManagerFilters,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
        },
      },
      {
        name: "Start Contract",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
          customBodyRender: (value, key) => {
            if (!isEmpty(value)) {
              return (
                <div key={key} style={{ width: 72 }}>
                  {value}
                </div>
              );
            }
          },
        },
      },
      {
        name: "End Contract",
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: "20px", maxWidth: "20px" },
          }),
          setCellHeaderProps: () => ({
            style: { minWidth: "10px", maxWidth: "10px" },
          }),
          customBodyRender: (value, key) => {
            if (!isEmpty(value)) {
              return (
                <div key={key} style={{ width: 72 }}>
                  {value}
                </div>
              );
            }
          },
        },
      },
      {
        name: "Status of Contract",
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[11],
          filterOptions: { names: ["Active", "Not Active"] },
          setCellProps: () => ({
            style: { minWidth: "20px" },
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
                  color='primary'
                  variant='outlined'
                />
              );
            }
          },
        },
      },
      {
        name: "Action",
        options: {
          filter: false,
          sort: false.valueOf,
          download: false,
        },
      },
    ];

    const options = {
      responsive: "scroll",
      filterType: "dropdown",
      download: true,
      print: false,
      selectableRows: "none",
      rowsPerPageOptions: [],
      onChangePage: (e) => {
        this.setState({ isLoading: true }, () => {
          this.getImmapers(false, e + 1);
        });
      },
      onSearchChange: (e) => {
        this.setState({
          search: e,
          isLoading: true,
          page: page == 0 ? 1 : page,
        });
      },
      onFilterChange: (column, filterList) => {
        this.handleFilter(filterList);
      },
      serverSideFilterList: this.state.serverSideFilterList,
      serverSide: true,
      rowsPerPage: 200,
      page,
      count,
      customToolbar: () => {
        if (can("Edit Immaper")) {
          return (
            <>
               <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={() =>
                this.setState({
                  openRequestContractForm: true,
                })
              }>
              <Add /> Create Contract Request for Offline User
            </Button>
            <Button
              className={classes.importBtn}
              variant='contained'
              size='small'
              onClick={() => this.handleOpenImportModel() }>
              <Add /> Import Consultants
            </Button>
            </>
          );
        }

        return false;
      },
      downloadOptions: { filename: "iMMAPers.csv", filterOptions: { useDisplayedColumnsOnly: true } },
      textLabels: {
        body: {
          noMatch:
            firstLoaded === false
              ? loadingText
              : isLoading
              ? loadingText
              : emptyDataText,
        },
      },
    };

    return (
      <Grid container spacing={24}>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Consultant List"}</title>
          <meta
            name='description'
            content={APP_NAME + " Dashboard > Consultant List"}
          />
        </Helmet>
           {width != 'sm' && width != 'xs' && (
              <Grid item xs={12} sm={12} md={3}>
                 <ImmapersFilter setLoadingImmapers={this.setLoadingImmapers}  />
              </Grid>
            )}
            <Grid
               xs={12}
               sm={12}
               md={9}
               className={width == 'sm' || width == 'xs' ? classes.immapersListContainer : ''}
              >
                <MUIDataTable
                  title={"Consultants List"}
                  data={immapers}
                  columns={columns}
                  options={options}
                  download={true}
                  print={false}
                />
            </Grid>
        {/* <AddImmaperForm getImmaper={this.getImmapers} /> */}
        <RequestContractForm
          isOpen={openRequestContractForm}
          onClose={() => this.setState({ openRequestContractForm: false })}
        />
        <ProfileModal
          isOpen={openProfile}
          profileId={profileId}
          history={this.props.history}
          onClose={() => this.setState({ openProfile: false })}
        />
        <ContractHistoryModal
          isOpen={openHistory}
          userId={userId}
          selectedImmaper={selectedImmaper}
          onClose={() => this.setState({ openHistory: false })}
          isFromProfile={false}
        />
        <ChangeLineManagerModel
          isOpen={openChangeLineManager}
          userId={userId}
          selectedImmaper={selectedImmaper}
          onClose={() => this.setState({ openChangeLineManager: false })}
          refeshImmapers={this.getImmapers}
        />
         <RequestContractModal
            isOpen={openRequestContract}
            onClose={() => this.setState({ openRequestContract: false })}
            immaper={immaper}
            defaultRequest={immaper != null ? (immaper.status_contract !== 'active' ? 'contract-extension' : 'contract-amendment') : 'contract-extension'}
            reload={() => this.getImmapers(false, this.state.page, this.state.serverSideFilterList)}
          />
          <Modal
              open={openImportImmmapers}
              title="Import Consultants (excel file)"
              handleClose={() => this.handleCloseImportModel()}
              maxWidth="md"
              scroll="body"
              saveButton={false}
								>
									<Paper className={classes.root} elevation={1}>
										<FormLabel>Excel *</FormLabel>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={12}>
												<DropzoneFileField
													name="immapers_file"
													label="The excel file"
													onUpload={this.onUpload}
													collectionName={immapersCollectionName}
													apiURL={importImmapersURL}
													isUpdate={false}
													filesLimit={1}
													acceptedFiles={acceptedImmapersFiles}
													deleted={false}
												/>
											</Grid>
										</Grid>
									</Paper>
									<br />
								</Modal>
         {(width == 'sm' || width == 'xs') && (
          <Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterBtn}
            onClick={this.toggleFilterMobile}
          >
            <FilterListIcon className={classes.extendedIcon} />
                  Filter
          </Fab>
          )}
        {(width == 'sm' || width == 'xs') && (
          <Drawer
            variant="persistent"
            anchor="bottom"
            open={filterMobile}
            classes={{
            paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
            }}
          >
            <div className={classes.mobileFilter}>
              <ImmapersFilter setLoadingImmapers={this.setLoadingImmapers}  />
            </div>
          </Drawer>
				)}
       </Grid>
    );
  }
}

iMMAPers.propTypes = {
  classes: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  onChange,
  onChangeImmaperFilter,
  isFilterIsReset,
  getHQ,
  getImmapers,
  getImmapOffices
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
 const mapStatetoProps = (state) => ({
  immaperFilter: state.immaperFilter
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  root: {
		border: 'none'
	},
  actions: {
    width: 194,
  },
  blue: {
    "background-color": blue,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  purple: {
    "background-color": purple,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  contract: {
    "background-color": iMMAPSecondaryColor2022,
    color: white,
    "&:hover": {
      color: iMMAPSecondaryColor2022Hover,
    },
  },
  red: {
    "background-color": red,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  green: {
    "background-color": green,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  },
  capitalize: {
    "text-transform": "capitalize",
  },
  chip: {
    margin: theme.spacing.unit,
  },
  btnActive: {
    borderColor: green,
    color: green,
  },
  btnRenew: {
    borderColor: yellow,
    color: yellow,
  },
  immapersListContainer: {
    marginBottom: theme.spacing.unit * 5
  },
  filterBtn: {
    margin: theme.spacing.unit,
    position: 'fixed',
    zIndex: 9999999,
    bottom: theme.spacing.unit * 6,
    left: '49%',
    transform: 'translateX(-51%)',
    color: primaryColor + ' !important',
    'background-color': white + ' !important',
    border: `1px solid ${primaryColor} !important`
  },
  filterDrawer: {
    height: '100%',
    'padding-left': theme.spacing.unit * 3,
    'padding-right': theme.spacing.unit * 3
  },
  filterDrawerHide: {
    bottom: 'auto'
  },
  mobileFilter: {
    height: '100%',
    'margin-top': theme.spacing.unit * 3
  },
  btnOffboarding: {
    borderColor: lightText,
    color: lightText
  },
  btnContract: {
    borderColor: darkBlueIMMAP,
    color: darkBlueIMMAP
  },
  importBtn: {
    margin: theme.spacing.unit,
    "background-color": blue,
    color: white,
    "&:hover": {
      color: secondaryColor,
    },
  }
});

export default withWidth()(withStyles(styles)(connect( mapStatetoProps, mapDispatchToProps)(iMMAPers)));
