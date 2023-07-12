import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI } from '../../redux/actions/apiActions';
{/* ======================= HIDE DELETE CAPABILITY =========================  */}
// import { deleteAPI } from '../../redux/actions/apiActions';
{/* ========================================================================  */}
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import isEmpty from '../../validations/common/isEmpty';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../common/Btn';
import CircleBtn from '../../common/CircleBtn';
import ProfileModal from '../../common/ProfileModal';
import { red, blue, purple, white, secondaryColor } from '../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../permissions/can';
import { pluck, arrowGenerator } from '../../utils/helper'
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import UserView from './UserView';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  actions: {
    width: 144
  },
  red: {
    'background-color': red,
    color: white,
    '&:hover': {
      color: secondaryColor
    }
  },
  blue: {
    'background-color': blue,
    color: white,
    '&:hover': {
      color: secondaryColor
    }
  },
  purple: {
    'background-color': purple,
    color: white,
    '&:hover': {
      color: secondaryColor
    }
  },
  loading: {
		'margin-left': theme.spacing.unit,
		color: white
	},
  arrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      marginLeft: theme.spacing.unit * 12
    },
  },
  arrowPopper: arrowGenerator(theme.palette.grey[700]),
  white: { color: white }
});

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      openProfile: false,
      id: 0,
      alertOpen: false,
      full_name: '',
      deleteId: 0,
      apiURL: '/api/users',
      loadingText: 'Loading Super Human Profiles...',
      emptyDataText: 'Sorry, No User Data can be found',
      firstLoaded: false,
      isLoading: false,
      count: 0,
      page: 0,
      search: '',
      getRoles: false,
      filters: [[], [], [], [], [], [], []],
      serverSideFilterList: [],
      roleFilters: { names: [] },
      filterRoles: '',
      filterStatus: '',
      userId: '',
      notifyEmail: false,
      deleteLoading: false,
      openUser: false
    };
    this.timer = null;

    this.getUser = this.getUser.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
    this.handleViewProfile = this.handleViewProfile.bind(this);
    this.openCloseProfile = this.openCloseProfile.bind(this);
    this.openCloseUser = this.openCloseUser.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.timerCheck = this.timerCheck.bind(this);
    this.openCloseDeleteAlert = this.openCloseDeleteAlert.bind(this);
    // =================== HIDE DELETE USER FUNCTION ====================
    // this.deleteUser = this.deleteUser.bind(this);
    // ==================================================================  }
  }

  componentDidMount() {
    this.getRoles();
    this.getUser(true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.timerCheck();
    }
  }

  getRoles() {
    this.props.getAPI('/api/roles')
    .then(res => {
      this.setState({ roleFilters: pluck(res.data.data, 'name') })
    })
    .catch(err => {
      this.setState({ roleFilters: { names: [] } })
    })
  }

  getUser(firstTime = false, page, filterList = []) {
    let queryData = '';

    if (this.state.search) queryData = `?search=${this.state.search}`;

    if (!isEmpty(page)) {
      page = page == 0 ? 1 : page;
      queryData = queryData + ((!isEmpty(queryData)) ? '&' : '?') + 'page=' + page;
    }

    const filterRoles = (!isEmpty(filterList)) ? (!isEmpty(filterList[3])) ? filterList[3].map(value => `filter=${encodeURIComponent(value)}`).join('&') : '' : this.state.filterRoles;
    const filterStatus = (!isEmpty(filterList)) ? (!isEmpty(filterList[4])) ? filterList[4].map(value => `status[]=${encodeURIComponent(value)}`).join('&') : '' : this.state.filterStatus;
    this.setState({ filterRoles, filterStatus })
    if (!isEmpty(filterRoles)) queryData = (!isEmpty(queryData)) ? `${queryData}&${filterRoles}` : `${queryData}?${filterRoles}`;
    if (!isEmpty(filterStatus)) queryData = (!isEmpty(queryData)) ? `${queryData}&${filterStatus}` : `${queryData}?${filterStatus}`;

    this.props
      .getAPI(`${this.state.apiURL}${queryData}`)
      .then((res) => {
        this.setState({count: res.data.data.total, page: res.data.data.current_page-1})
        this.dataToArray(res.data.data, firstTime);
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'There is an error while processing the request'
        });
      });
  }

  // ============================================= HIDE DELETE USER FUNCTION =============================================
  // deleteUser() {
  //   this.setState({ deleteLoading: true }, () => {
  //     this.props
  //       .deleteAPI(this.state.apiURL + '/' + this.state.deleteId, { notifyEmail: this.state.notifyEmail })
  //       .then((res) => {
  //         const { status, message } = res.data;
  //         this.props.addFlashMessage({
  //           type: status,
  //           text: message
  //         });
  //         this.setState({ deleteId: 0, alertOpen: false, full_name: '', deleteLoading: false }, () => this.getUser());
  //       })
  //       .catch((err) => {
  //         this.setState({ deleteLoading: false });
  //         this.props.addFlashMessage({
  //           type: 'error',
  //           text: 'There is an error while processing the delete request'
  //         });
  //       });
  //   })
  // }
  // =====================================================================================================================

  dataToArray(jsonData, firstTime = false) {
    const { classes } = this.props;
    let usersInArray = jsonData.data.map((user, index) => {
      let userTemp = [user.id, user.email];
      let name = user.full_name;
      if (can('Set as Admin') && user.archived_user === "yes") {
        name = `${name} [Archived]`;
      }
      userTemp.push(name);
      userTemp.push(isEmpty(user.role) ? '' : user.role);
      if (user.status == 'Hidden') {
        const hiddenData = (
          <div>
            <Tooltip
              title={
                <React.Fragment>
                  <Typography className={classes.white}>Hidden Date (UTC): {user.hidden_date}</Typography>
                  <Typography className={classes.white}>Scheduled Deletion Date (UTC): {user.schedule_deletion_date}</Typography>
                  <span className={classes.arrow} />
                </React.Fragment>
              }
              placement="bottom"
              classes={{ popper: classes.arrowPopper }}
            >
              <Typography>{user.status}</Typography>
            </Tooltip>
          </div>
        )
        userTemp.push(hiddenData)
      } else {
        userTemp.push(user.status);
      }
      userTemp.push(user.access_platform == 1 ? 'Yes' : 'No');
      userTemp.push(user.job_title);

      const actions = (
        <div className={classes.actions}>
          {can('Show User') && (
            <CircleBtn
              onClick={user.status !== 'Not Submitted' ? () => this.handleViewProfile(user.profile_id) : () => this.openCloseUser(user.id)}
              color={classes.blue}
              size="small"
              icon={<RemoveRedEye />}
            />
          )}
          {can('Edit User') && (
            <CircleBtn
              link={'/dashboard/users/' + user.id + '/edit'}
              color={classes.purple}
              size="small"
              icon={<Edit />}
            />
          )}
          {can('Delete User') && (
            <CircleBtn
              color={classes.red}
              size="small"
              icon={<Delete />}
              onClick={() => this.openCloseDeleteAlert({ deleteId: user.id, full_name: user.full_name })}
            />
          )}
        </div>
      );

      userTemp.push(actions);

      return userTemp;
    });

    if (firstTime) {
      this.setState({ users: usersInArray, firstLoaded: true, isLoading: false });
    } else {
      this.setState({ users: usersInArray, isLoading: false });
    }
  }

  handleViewProfile(id) {
    this.setState({ id }, () => this.setState({ openProfile: !this.state.openProfile }));
  }

  openCloseProfile() {
    this.setState({ openProfile: !this.state.openProfile });
  }

  openCloseUser(id = '') {
    this.setState({ openUser: this.state.openUser ? false : true, userId: this.state.openUser ? '' : id })
  }

  handleFilter(filterList) {
    this.setState({ isLoading: true, filters: filterList, serverSideFilterList: filterList }, () => this.getUser(false, this.state.page, filterList) )
  }

  timerCheck() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.getUser(false, this.state.page);
    }, 500)
  }

  openCloseDeleteAlert(userData = { id: '', full_name: '' }) {
    userData.alertOpen = !this.state.alertOpen
    this.setState(userData);
  }

  render() {
    let { users, alertOpen, full_name, openProfile, id, firstLoaded, isLoading, loadingText, emptyDataText, count, page, notifyEmail } = this.state;
    const columns = [
      {
        name: 'id',
        options: {
          display: 'excluded',
          filter: false,
          sort: false
        }
      },
      {
        name: 'Email',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: 'Full Name',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: 'Role',
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[3],
          filterOptions: this.state.roleFilters
        }
      },
      {
        name: 'Status',
        options: {
          filter: true,
          sort: false,
          filterList: this.state.filters[4],
          filterOptions: {
            names: ['Not Submitted', 'Active', 'Inactive', 'Hidden']
          },
          filterType: 'multiselect'
        }
      },
      {
        name: 'Access Platform',
        options: {
          filter: true,
          sort: false,
        }
      },
      {
        name: 'Title',
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: 'Action',
        options: {
          filter: false,
          sort: false
        }
      }
    ];

    const options = {
      responsive: 'scroll',
      filterType: 'dropdown',
      download: false,
      print: false,
      selectableRows: 'none',
      rowsPerPageOptions: [],
      onChangePage: (e) => {
        this.setState({isLoading: true}, () => {
          this.getUser(false,e+1);
        });
      },
      onSearchChange: (e) => {
        this.setState({search: e, isLoading: true, page: page == 0 ? 1 : page });
      },
      onFilterChange: (column, filterList) => {
        this.handleFilter(filterList)
      },
      serverSideFilterList: this.state.serverSideFilterList,
      serverSide: true,
      rowsPerPage: 200,
      page,
      count,
      customToolbar: () => {
        if (can('Add User')) {
          return (
            <Btn
              link="/dashboard/users/add"
              btnText="Add New User"
              btnStyle="contained"
              color="primary"
              size="small"
              icon={<Add />}
            />
          );
        }

        return false;
      },
      textLabels: {
        body: {
          noMatch: (firstLoaded === false) ? loadingText : (isLoading) ? loadingText : emptyDataText
        }
      }
    }

    return (
      <div>
        <Helmet>
          <title>{APP_NAME + ' - Dashboard > User List'}</title>
          <meta name="description" content={APP_NAME + ' Dashboard > User List'} />
        </Helmet>
          <MUIDataTable
            title={'User List'}
            data={users}
            columns={columns}
            options={options}
            download={false}
            print={false}
          />
        <ProfileModal
          isOpen={openProfile}
          profileId={id}
          onClose={this.openCloseProfile}
        />
        <Dialog open={this.state.openUser} onClose={this.openCloseUser} maxWidth="xl">
          <DialogContent>
            <UserView
              match={{params: {id: this.state.userId}}}
              forModal={true}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.openCloseUser}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.alertOpen} onClose={this.openCloseDeleteAlert} maxWidth="xl">
          <DialogTitle>User Deletion Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete ${full_name} ?`}
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifyEmail}
                  name="notifyEmail"
                  color="primary"
                  onChange={() => this.setState({ notifyEmail: !notifyEmail })}
                />
              }
              label="Notify user with by email"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={this.openCloseDeleteAlert}>Close</Button>
            <Tooltip title="Temporarily Unavailable" placement="top-end">
              <span>
                {/* HIDE DISABLE USER BUTTON  */}
                {/* <Button variant="contained" color="primary" onClick={this.deleteUser} disabled={this.state.deleteLoading}> */}
               <Button variant="contained" color="primary" onClick={this.deleteUser} disabled={true}>
                  Confirm {this.state.deleteLoading && (<CircularProgress className={this.props.classes.loading} size={22} thickness={5}/>)}
                </Button>
              </span>
            </Tooltip>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  getAPI: PropTypes.func.isRequired,
  // ======== HIDE DELETE FUNCTION ========
  // deleteAPI: PropTypes.func.isRequired,
  // ======================================
  addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  // ======== HIDE DELETE FUNCTION ========
  // deleteAPI,
  // ======== HIDE DELETE FUNCTION ========
  addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(Users));
