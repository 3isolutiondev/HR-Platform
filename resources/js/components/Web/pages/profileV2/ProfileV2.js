/** import React, Prop Types and React Loadable */
import React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

/** import Material UI styles, Components and Icons */
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Send from "@material-ui/icons/Send";
import Star from '@material-ui/icons/Grade';
import Archive from '@material-ui/icons/Archive';
import Unarchive from '@material-ui/icons/Unarchive';

/** import React Helmet for SEO purpose */
import { Helmet } from "react-helmet";

/** import configuration values needed on this component */
import { APP_NAME } from "../../config/general";
import {
  blueIMMAP, blueIMMAPHover, white, archive, archiveHover, star, blue, blueHover, starHover,
  recommendationColor, recommendationHoverColor
} from "../../config/colors";

/** import FortAwesome for showing an SVG Icon */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';

/** import third party package */
import queryString from "query-string";
import axios from "axios";
import FileDownload from 'js-file-download';
import moment from 'moment';

const timeoutTime = 20000;
const delayTime = 1000;

/** import permission checker */
import { can } from '../../permissions/can';

/** import component needed on this component (without lazy load) */
import DeleteAccount from './parts/DeleteAccount';
import LoadingSpinner from "../../common/LoadingSpinner";
import SingleInvite from "../allprofiles/SingleInvite";

// lazy load component needed on this component
const Button = Loadable({
  loader: () => import("@material-ui/core/Button"),
  loading: LoadingSpinner,
  timeout: timeoutTime,
  delay: delayTime,
});
const BasicBio = Loadable({
  loader: () => import("./parts/BasicBio"),
  loading: LoadingSpinner,
  timeout: timeoutTime,
  delay: delayTime,
});

const PhoneNumber = Loadable({
  loader: () => import("./parts/PhoneNumber"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const EmploymentRecords = Loadable({
  loader: () => import("./parts/EmploymentRecords"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Education = Loadable({
  loader: () => import("./parts/Education"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Language = Loadable({
  loader: () => import("./parts/Language"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Skill = Loadable({
  loader: () => import("./parts/Skill"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Training = Loadable({
  loader: () => import("./parts/Training"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Portfolio = Loadable({
  loader: () => import("./parts/Portfolio"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Publication = Loadable({
  loader: () => import("./parts/Publication"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const Reference = Loadable({
  loader: () => import("./parts/Reference"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const WorkedWithiMMAP = Loadable({
  loader: () => import("./parts/WorkedWithiMMAP"),
  loading: LoadingSpinner,
  timeout: timeoutTime,
  delay: delayTime,
});

const RelativesEmployedByIMMAP = Loadable({
  loader: () => import("./parts/RelativesEmployedByIMMAP"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const CV = Loadable({
  loader: () => import("./parts/CV"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const FieldofWorks = Loadable({
  loader: () => import("./parts/FieldofWorks"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const PermanentCivilServants = Loadable({
  loader: () => import("./parts/PermanentCivilServants"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const LegalPermanentStatus = Loadable({
  loader: () => import("./parts/LegalPermanentStatus"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const LegalStepChangingNationality = Loadable({
  loader: () => import("./parts/LegalStepChangingNationality"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const RelevantFacts = Loadable({
  loader: () => import("./parts/RelevantFacts"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const RosterControl = Loadable({
  loader: () => import("./parts/Roster/RosterControl"),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime, // 0.5 seconds
});

const IMMAPERBox = Loadable({
  loader: () => import("./parts/iMMAPerBox"),
  loading: LoadingSpinner,
  timeout: timeoutTime,
  delay: delayTime,
});

const JobApplications = Loadable({
  loader: () => import('../../pages/jobs/applications/ApplicationLists2'),
  loading: LoadingSpinner,
  timeout: timeoutTime, // 20 seconds
  delay: delayTime // 0.5 seconds
});


const MyTeam = Loadable({
  loader: () => import("./parts/MyTeam"),
  loading: LoadingSpinner,
  timeout: timeoutTime,
  delay: delayTime,
});

/** import React redux and it's actions */
import { connect } from "react-redux";
import {
  getNationalities,
  getP11Countries,
  getLanguages,
  getYears,
  getRosterProcess as getRosterProcessOptions,
} from "../../redux/actions/optionActions";
import {
  getRosterProcess,
  setRosterProcessID,
  setProfileID,
  resetProfile,
  getVerifiedRoster,
} from "../../redux/actions/profile/rosterProcessActions";
import { getAPI } from "../../redux/actions/apiActions";
import { toggleArchive, toggleStar } from '../../redux/actions/allprofiles/AllProfilesActions';
import { addFlashMessage } from '../../redux/actions/webActions';

/** import validation and helper needed on this component */
import isEmpty from "../../validations/common/isEmpty";
import { pluck } from "../../utils/helper";

/**
 * Profile is a component to show Profile page
 *
 * @name Profile
 * @component
 * @category Page
 * @subcategory Profile
 *
 */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: true,
      profileID: false,
      tabValue: 'detail',
      tabValueRoster: 0,
      single_invite_profile_id: "",
      single_invite_profile_name: "",
      starArchiveData: {},
      starLoading: false,
      archiveLoading: false,
      downloadLoading: false,
      downloadAnonymizedLoading: false,
      archived_user: "no",
      rosterAccessData: [],
      hasRosterAccess: false
    };
    this.refreshSkill = this.refreshSkill.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.sendSingleEmail = this.sendSingleEmail.bind(this);
    this.closeSingleInvitation = this.closeSingleInvitation.bind(this);
    this.checkParam = this.checkParam.bind(this);
    this.setRosterProcess = this.setRosterProcess.bind(this);
    this.getStarArchiveStatus = this.getStarArchiveStatus.bind(this);
    this.toggleArchive = this.toggleArchive.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.downloadResume = this.downloadResume.bind(this);
    this.checkProfile = this.checkProfile.bind(this);
    this.copyProfileLink = this.copyProfileLink.bind(this);
    this.tabChangeRoster = this.tabChangeRoster.bind(this);
    this.checkRosterAccess = this.checkRosterAccess.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  async componentDidMount() {
    await this.checkProfile();
    this.props.getNationalities();
    this.props.getLanguages();
    this.props.getP11Countries();
    this.props.getYears();
    this.props.getRosterProcessOptions();

    if (typeof this.props.match.params.id !== "undefined") {
      this.setState({ editable: false });
      this.props.getRosterProcess(this.props.match.params.id);
      this.props.setProfileID(this.props.match.params.id);
      this.props.getVerifiedRoster(this.props.match.params.id);
      this.getStarArchiveStatus(this.props.match.params.id);
      await this.checkRosterAccess(this.props.match.params.id);
    } else {
      this.setState({ profileID: '' })
      this.props.getRosterProcess();
      this.props.setProfileID(true);
      this.props.getVerifiedRoster();
      await this.checkRosterAccess();
    }

    if (this.props.preview === true) {
      this.setState({ editable: false });
    }

    if (this.state.rosterAccessData.length != 0) {
      this.setState({ tabValueRoster: this.state.rosterAccessData[0].value });
    }

    this.checkParam()

    //press backbutton
    window.addEventListener('popstate', (event) => {
      this.checkParam(true)
    });
  }

  /**
   * componentWillMount is a lifecycle function called where the component will be mounted
   */
  componentWillMount() {
    this.props.resetProfile();
  }

  /**
   * componentWillUnmount is a lifecycle function called where the component will be unmounted
   */
  componentWillUnmount() {
    this.props.setProfileID(false);
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps){
    if (typeof this.props.match.params.id === "undefined" && !this.props.preview) {
      if (JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)) {
        if (this.props.location.search !== prevProps.location.search) {
          this.checkParam()
        }
      }
    }
  }

  /**
   * checkProfile is a function to check if profile data can be access
   * @returns {boolean}
   */
  checkProfile() {
    if (typeof this.props.match.params.id !== "undefined") {
      return this.props.getAPI(`/api/check-profile/${this.props.match.params.id}`)
        .then(async (res) => {
          const { authProfileId, canAccess, archived_user } = res.data.data

          if (!canAccess) {
            this.props.addFlashMessage({
              type: 'error',
              text: "Profile does not exist"
            })
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

          if (authProfileId.toString() === this.props.match.params.id || !canAccess) {
            window.location.href = "/profile";
          }

          this.setState({ archived_user });

          return canAccess;
        })
        .catch(err => {
          if (!isEmpty(err.response)) {
            if (err.response.status) {
              if (err.response.status === 404) {
                this.props.addFlashMessage({
                  type: 'error',
                  text: "Profile does not exist"
                })
              }
            }
          }

          window.location.href = "/profile";
          return false;
        })
    } else {
      return this.props.getAPI(`/api/check-current-profile`)
        .then(async (res) => {
          const { archived_user } = res.data.data

          this.setState({ archived_user });

          return true;
        })
        .catch(err => {
          this.setState({ archived_user: 'no' });
          return true;
        });
    }
  }

  /**
   * refreshSkill is a function to refresh list of skills inside profile page triggered by adding, updating or deleting a skill
   */
  refreshSkill() {
    this.child.refreshSkill();
  }

  /**
   * setRosterProcess is a function to set selected roster process (iMMAP or SBP) and get Roster Process data related to the Profile
   *
   * @param {number} tabValue
   */
  setRosterProcess(tabValue) {
    this.props.setRosterProcessID(tabValue)
    if (typeof this.props.match.params.id !== "undefined") {
      this.props.getRosterProcess(this.props.match.params.id);
    } else {
      this.props.getRosterProcess();
    }
  }

  /**
   * tabChange is a function to change tab inside profile page by clicking the tab inside the page or by receiving query parameter from url
   *
   * @param {Object} e
   * @param {number} tabValue
   * @param {Boolean} [updateTravelStatus=false]
   * @param {Boolean} [pushHistory=true]
   */
  tabChange(e, tabValue, updateTravelStatus = false, pushHistory = true) {
    this.setState({ tabValue }, () => {

      // Roster Tab
      if (tabValue === 'surge-roster-status') {
        if (typeof this.props.match.params.id === "undefined" || pushHistory === false) {
          this.props.history.push({
            url: '/profile',
            search: '?roster=' + this.state.tabValueRoster
          })
        }
        this.setRosterProcess(this.state.tabValueRoster)
      }

      // Detail tab is selected and update the url
      if (tabValue === 0 || tabValue === 'detail') {
        this.props.setRosterProcessID("");
        if ((typeof this.props.match.params.id === "undefined" || pushHistory === false) && typeof this.props.history.push !== "undefined") {
          this.props.history.push({
            url: '/profile',
          })
        }
      }
    });
  }

  tabChangeRoster(e, tabValueRoster, updateTravelStatus = false, pushHistory = true) {
    this.setState({ tabValueRoster }, () => {
        const invitation = this.state.showSurgeTab ? '&invitation=' + this.state.showSurgeTab : ''
        if (typeof this.props.match.params.id === "undefined" || pushHistory === false) {
          this.props.history.push({
            url: '/profile',
            search: '?roster=' + tabValueRoster + invitation
          })
        }
        this.setRosterProcess(tabValueRoster)
    });
  }

  /**
   * sendSingleEmail is a function to call api to send email invitation
   *
   * @param {number} single_invite_profile_id
   */
  sendSingleEmail(single_invite_profile_id) {
    axios.get("/api/get-name/" + single_invite_profile_id).then((res) => {
      this.setState({
        single_invite_profile_id,
        single_invite_profile_name: res.data.data,
      });
    });
  }

  /**
   * closeSingleInvitation is a function to close invitation dialog
   */
  closeSingleInvitation() {
    this.setState({
      single_invite_profile_id: "",
      single_invite_profile_name: "",
    });
  }

  /**
   * checkParam is a function to determine the tabValue by checking query parameter from url
   *
   * @param {Boolean} [fromBackButton=false]
   */
  checkParam(fromBackButton = false) {
    if (typeof this.props.match.params.id === "undefined" && !this.props.preview) {
      if (!isEmpty(this.props.location)) {
        if (!isEmpty(this.props.location.search)) {
          const queryParams = queryString.parse(this.props.location.search);

          if (!isEmpty(queryParams.roster)) {
            const rosterids = pluck(this.props.roster_processes, "value");
            const pos = rosterids.indexOf(Number(queryParams.roster));
            if (pos > -1) {
              if (fromBackButton) {
                 this.setState({ tabValue: 'surge-roster-status', showSurgeTab: !isEmpty(queryParams.invitation) && queryParams.invitation === 'true' }, () => {
                  this.setRosterProcess(Number(queryParams.roster))
                })
              } else {
                this.setState({ tabValue: 'surge-roster-status', showSurgeTab: !isEmpty(queryParams.invitation) && queryParams.invitation === 'true' })
                this.tabChangeRoster("", Number(queryParams.roster));
              }
            }
          }
        } else {
          this.setState({ tabValue: 'detail' })
        }
      }
    }
  }

  /**
   * getStarArchiveStatus is a function Get Star and Archive Status
   *
   * @param {number} profileId
   */
  getStarArchiveStatus(profileId) {
    return axios.get(`/api/profile/star-archive-status/${profileId}`)
      .then(res => this.setState({ starArchiveData: res.data.data }))
      .catch(err => this.props.addFlashMessage({ type: 'error', text: 'There is an error while getting profile status'}))
  }

  /**
   * toggleArchive is a function to Toggle Archive Status
   *
   * @param {number} userId
   */
  toggleArchive(userId) {
    this.setState({ archiveLoading: true }, async () => {
      await this.props.toggleArchive(userId)
      this.getStarArchiveStatus(this.props.profileID)
      this.setState({ archiveLoading: false })
    })
  }

  /**
   * toggleStar is a function to Toggle Star Status
   *
   * @param {number} userId
   */
  toggleStar(userId) {
    this.setState({ starLoading: true }, async () => {
      await this.props.toggleStar(userId)
      this.getStarArchiveStatus(this.props.profileID)
      this.setState({ starLoading: false })
    })
  }

  /**
   * downloadResume is a function to download profile resume
   *
   * @param {number|string|Boolean} profileId
   */
  downloadResume(profileId) {
    this.setState({ downloadLoading: true })
    return axios
    .get(`/api/profile/download-resume/${profileId}`, { responseType: 'blob'})
    .then((res) => {
      this.setState({ downloadLoading: false })
      return FileDownload(
        res.data,
        `iMMAP Careers Profile Resume - ${this.props.profileName} - ${moment().format('YYYY-MM-DD-HH-mm-ss')}.pdf`
      );
    })
    .catch((err) => {
      this.setState({ downloadLoading: false })
      return this.props.addFlashMessage({
          type: 'error',
          text: 'Error while trying to download the resume'
        })
    });
  }

  /**
   * downloadAnonymizedResume is a function to download anonymized profile resume
   *
   * @param {number|string|Boolean} profileId
   */
   downloadAnonymizedResume(profileId) {
    this.setState({ downloadAnonymizedLoading: true })
    return axios
    .get(`/api/profile/download-anonymized-resume/${profileId}`, { responseType: 'blob'})
    .then((res) => {
      this.setState({ downloadAnonymizedLoading: false })
      return FileDownload(
        res.data,
        `iMMAP Careers Profile Resume - ${profileId} - ${moment().format('YYYY-MM-DD-HH-mm-ss')}.pdf`
      );
    })
    .catch((err) => {
      this.setState({ downloadAnonymizedLoading: false })
      return this.props.addFlashMessage({
          type: 'error',
          text: 'Error while trying to download the resume'
        })
    });
  }

  /**
   * copyProfileLink is a function to copy and open profile link
   */
  copyProfileLink() {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${this.props.match.params.id}`);
    this.props.addFlashMessage({
      type: 'info',
      text: 'Profile Link Copied to Clipboard'
    })
  }

  /**
   * checkRosterAccess is a function get data of roster that the user has applied
   *
   * @param {number} [profileId = ""]
   *
   * @returns {Promise}
   */
  checkRosterAccess(profileId = '') {
    const profileIdURI = isEmpty(profileId) ? '' : `${profileId}/`;
    return axios.get(`/api/profile/${profileIdURI}check-roster-access`).then(res => {
      this.setState({ rosterAccessData: res.data.data, hasRosterAccess: isEmpty(res.data.data) ? false : true })
    })
  }

  render() {
    const { editable, tabValue, starArchiveData, archiveLoading, starLoading, downloadLoading, downloadAnonymizedLoading, archived_user, tabValueRoster } = this.state;
    const {
      classes,
      roster_processes,
      width,
      profileID,
      p11Completed,
      history,
      isLineManager
    } = this.props;

    const profileIDNotEmpty = (!isEmpty(profileID) && profileID !== true && profileID !== false) ? true : false

    return (
      <Grid container spacing={16}>
        <Helmet>
          <title>{APP_NAME} - Profile</title>
          <meta name="description" content={APP_NAME + " Profile"} />
        </Helmet>
        <Grid item xs={12}>
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={this.tabChange}
            indicatorColor="primary"
            centered={isWidthDown("sm", width) ? false : true}
            textColor="primary"
            variant={isWidthDown("sm", width) ? "scrollable" : "standard"}
            scrollButtons={isWidthDown("sm", width) ? "auto" : "off"}
          >
            <Tab label="Detail" value="detail" />
            { ((this.props.preview !== true && this.state.hasRosterAccess) || this.state.showSurgeTab) &&
              <Tab label="Surge Roster Status" value="surge-roster-status" />
            }
             {(can('Dashboard Access|See Profile Applicant History|Set as Admin') === true && typeof this.props.match.params.id !== "undefined") && (<Tab label="Application Status" value="job-applications"/>)}
          </Tabs>
        </Grid>
        {/* Profile Detail */}
        {tabValue === "detail" && (
          <Grid item xs={12} sm={12} md={3}>
            <BasicBio editable={editable} profileID={profileID} starArchiveData={starArchiveData} />
            <PhoneNumber editable={editable} profileID={profileID} />
            {this.props.showImmaperBox && <IMMAPERBox editable={can('Set as Admin')} profileID={profileID} history={history} />}
            {isLineManager && !profileIDNotEmpty && p11Completed &&
               <MyTeam/>
            }
            {(!profileIDNotEmpty && p11Completed) && (
              <DeleteAccount />
            )}
          </Grid>
        )}
        {tabValue === "detail" && (
          <Grid item xs={12} sm={12} md={6}>
            <EmploymentRecords
              editable={editable}
              profileID={profileID}
              refreshSkill={this.refreshSkill}
            />
            <Education editable={editable} profileID={profileID} />
            <Language editable={editable} profileID={profileID} />
            <Skill
              editable={editable}
              profileID={profileID}
              onRef={(ref) => (this.child = ref)}
            />
            <Training editable={editable} profileID={profileID} />
            <Portfolio
              editable={editable}
              profileID={profileID}
              refreshSkill={this.refreshSkill}
            />
            <Publication editable={editable} profileID={profileID} />
            <Reference editable={editable} profileID={profileID} />
            <WorkedWithiMMAP editable={editable} profileID={profileID} />
            <RelativesEmployedByIMMAP
              editable={editable}
              profileID={profileID}
            />
            <PermanentCivilServants editable={editable} profileID={profileID} />
          </Grid>
        )}
        {tabValue === "detail" && (
          <Grid item xs={12} sm={12} md={3}>
            {profileIDNotEmpty && !isEmpty(starArchiveData) && can('Can Star a Profile') && (
              <Button
                variant="contained"
                className={classes.starGrp}
                fullWidth
                size="small"
                onClick={() => this.toggleStar(starArchiveData.user_id)}
              >
                <Star/> {starArchiveData.starred_user === 'yes' ? 'Unstar ' : 'Star '} Profile
                {starLoading && (
                  <CircularProgress size={22} thickness={5} className={classes.loading}/>
                )}
              </Button>
            )}
            {profileIDNotEmpty && !isEmpty(starArchiveData) && can('Set as Admin|Can Archive a Profile') && (
              <Button
                variant="contained"
                className={classes.archive}
                fullWidth
                size="small"
                onClick={() => this.toggleArchive(starArchiveData.user_id)}
              >
                {starArchiveData.archived_user === 'no' ? (
                  <Archive
                    fontSize="small"
                    className={classes.addSmallMarginRight}
                  />
                ): (
                  <Unarchive
                    fontSize="small"
                    className={classes.addSmallMarginRight}
                  />
                )}
                {starArchiveData.archived_user === 'no' ? ' Archive ' : ' Unarchive '} Profile
                {archiveLoading && (
                  <CircularProgress size={22} thickness={5} className={classes.loading}/>
                )}
              </Button>
            )}
            {profileIDNotEmpty && (
              <Button
                variant="contained"
                fullWidth
                size="small"
                className={classes.blueIMMAP}
                onClick={() => this.sendSingleEmail(profileID)}
              >
                Send Invitation{" "}
                <Send fontSize="small" className={classes.addSmallMarginLeft} />
              </Button>
            )}
            {profileIDNotEmpty && (
              <SingleInvite
                isOpen={
                  !isEmpty(this.state.single_invite_profile_id) ? true : false
                }
                profile_id={this.state.single_invite_profile_id}
                profile_name={this.state.single_invite_profile_name}
                onClose={this.closeSingleInvitation}
              />
            )}
            {(can("View Other Profile") && profileIDNotEmpty) && (
              <Button
                variant="contained"
                fullWidth
                size="small"
                color="secondary"
                className={classes.addMarginBottom}
                onClick={this.copyProfileLink}
              >
                <FontAwesomeIcon
                  icon={faCopy}
                  size="lg"
                  className={classes.addSmallMarginRight}
                />
                COPY LINK TO PROFILE
              </Button>
            )}
            <CV editable={editable} profileID={profileID} />
            {profileIDNotEmpty && (
              <Button
                variant="contained"
                fullWidth
                size="small"
                className={classes.recommendation}
                onClick={() => this.downloadResume(profileID)}
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="lg"
                  className={classes.recommendationIcon}
                />
                Download iMMAP Careers Profile
                {downloadLoading && (
                  <CircularProgress size={22} thickness={5} className={classes.loading}/>
                )}
              </Button>
            )}
            <FieldofWorks editable={editable} profileID={profileID} />
            <LegalPermanentStatus editable={editable} profileID={profileID} />
            <LegalStepChangingNationality
              editable={editable}
              profileID={profileID}
            />
            <RelevantFacts editable={editable} profileID={profileID} />

            {profileIDNotEmpty && (
              <Button
                variant="contained"
                fullWidth
                size="small"
                className={classes.anonymizedRecommendation}
                onClick={() => this.downloadAnonymizedResume(profileID)}
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="lg"
                  className={classes.recommendationIcon}
                />
                Download Anonymized Careers Profile
                {downloadAnonymizedLoading && (
                  <CircularProgress size={22} thickness={5} className={classes.loading}/>
                )}
              </Button>
            )}

          </Grid>
        )}
         {/* Roster Status */}
         { tabValue === "surge-roster-status" && this.props.roster_processes.find(val => val.value === tabValueRoster) && (
          <Grid item xs={12}>
            <RosterControl isFromUrl={this.state.showSurgeTab} editable={editable} profileID={profileID} archived_user={archived_user} tabValueRoster={tabValueRoster} rosterAccessData={this.state.rosterAccessData} changeRoster={this.tabChangeRoster}/>
          </Grid>
        )}
        {tabValue === 'job-applications' && (
          <Grid item xs={12}>
            <JobApplications userId={this.props.match.params.id} />
          </Grid>
        )}

      </Grid>
    );
  }
}

Profile.defaultProps = {
  showImmaperBox: true,
  isLineManager: false
}

Profile.propTypes = {
  /**
   * getNationalities is a prop to call redux action to get list of nationalities.
   */
  getNationalities: PropTypes.func.isRequired,
  /**
   * getLanguages is a prop to call redux action to get list of languages.
   */
  getLanguages: PropTypes.func.isRequired,
  /**
   * getP11Countries is a prop to call redux action to get list of countries.
   */
  getP11Countries: PropTypes.func.isRequired,
  /**
   * getYears is a prop to call redux action to get list of years.
   */
  getYears: PropTypes.func.isRequired,
  /**
   * getRosterProcess is a prop to call redux action to get detail of selected roster process.
   */
  getRosterProcess: PropTypes.func.isRequired,
  /**
   * getRosterProcessOptions is a prop to call redux action to get list of roster process in value label format.
   * Format: [{value: 1, label: Surge Roster}]
   */
  getRosterProcessOptions: PropTypes.func.isRequired,
  /**
   * setRosterProcessID is a prop to call redux action to set roster process id (triggered when choosing roster tab).
   */
  setRosterProcessID: PropTypes.func.isRequired,
  /**
   * setProfileID is a prop to call redux action to set and get user profile id.
   */
  setProfileID: PropTypes.func.isRequired,
  /**
   * resetProfile is a prop to call redux action to reset profile id and data.
   */
  resetProfile: PropTypes.func.isRequired,
  /**
   * getVerifiedRoster is a prop to call redux action to get profile roster process status (verified / not).
   */
  getVerifiedRoster: PropTypes.func.isRequired,
  /**
   * profileID is a prop containing profile id, if it's a number will show other people profile, otherwise it will show the logged in user profile.
   */
  profileID: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string // empty string
  ]),
  /**
   * roster_processes is a prop containing all roster process data
   */
  roster_processes: PropTypes.array.isRequired,
  /**
   * preview is a prop containing boolean data to make this component behave for profile preview in registration process.
   */
  preview: PropTypes.bool,
  /**
   * history is a prop containing react router history data.
   */
  history: PropTypes.object,
  /**
   * toggleArchive is a prop containing data that shown the current profile is an archived/unarchived profile.
   */
  toggleArchive: PropTypes.func.isRequired,
  /**
   * toggleStar is a prop containing data that shown the current profile is an starred/unstar profile.
   */
  toggleStar: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * profileName is a prop containing full name of the profile
   */
  profileName: PropTypes.string,
  /**
   * getAPI is a prop function to call get api
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * p11Completed is a prop containing data to detect if the current user is submitted user or not
   */
  p11Completed: PropTypes.bool.isRequired,
  /**
   * showImmaperBox is a prop that indicates if the iMMAPer Box should be displayed or not.
   */
  showImmaperBox: PropTypes.bool,
  /**
   * isLineManager is a prop that indicates if the my team section should be displayed or not.
   */
  isLineManager: PropTypes.bool
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getP11Countries,
  getLanguages,
  getNationalities,
  getYears,
  getRosterProcess,
  getRosterProcessOptions,
  setRosterProcessID,
  setProfileID,
  resetProfile,
  getVerifiedRoster,
  toggleArchive,
  toggleStar,
  addFlashMessage,
  getAPI
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  profileID: state.profileRosterProcess.profileID,
  roster_processes: state.options.roster_processes,
  profileName: state.bio.full_name,
  p11Completed: state.auth.user.p11Completed,
  isLineManager: state.auth.user.isLineManager
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  blueIMMAP: {
    background: blueIMMAP,
    marginBottom: theme.spacing.unit * 2,
    color: white,
    "&:hover": {
      background: blueIMMAPHover,
    },
  },
  recommendation: {
		'background-color': recommendationColor,
		color: white,
    marginBottom: theme.spacing.unit * 2,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
  },
  anonymizedRecommendation: {
		'background-color': blue,
		color: white,
    marginBottom: theme.spacing.unit * 2,
		'&:hover': {
			'background-color': blueHover
		}
  },
  recommendationIcon: { width: '1.1em !important', marginRight: theme.spacing.unit },
  addSmallMarginRight: { marginRight: theme.spacing.unit },
  addSmallMarginLeft: { marginLeft: theme.spacing.unit },
  addMarginBottom: { marginBottom: theme.spacing.unit * 2 },
  archive: { background: archive, color: white, marginBottom: theme.spacing.unit * 2, '&:hover': { color: white, background: archiveHover } },
  starGrp: { background: star, color: white,
    marginBottom: theme.spacing.unit * 2,
    '&:hover': { color: white, background: starHover }
  },
  loading: { color: white, marginLeft: theme.spacing.unit }
});

export default withWidth()(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile))
);
