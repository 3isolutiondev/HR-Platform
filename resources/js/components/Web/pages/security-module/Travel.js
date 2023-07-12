import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import classname from 'classnames'
import queryString from 'query-string'
import moment from 'moment'
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer'
import UpdateIcon from '@material-ui/icons/Update'
import AllInboxIcon from '@material-ui/icons/AllInbox'
import SaveIcon from '@material-ui/icons/Save'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility'
import FilterListIcon from '@material-ui/icons/FilterList'
import { borderColor, red, redHover, white, green, greenHover, purple, purpleHover, blue, primaryColor, primaryColorHover, blueHover } from '../../config/colors';
import { isEmpty } from 'lodash'
import { addFlashMessage } from '../../redux/actions/webActions'
import { getPDFInNewTab } from '../../redux/actions/common/PDFViewerActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import DoneIcon from '@material-ui/icons/Done'

class Travel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      status: 'all',
      travel_requests: [],
      request_type: 'all',
      apiURL: '/api/security-module',
      firstTime: true,
      deleteId: '',
      deleteName: '',
      deleteLoading: false,
      deleteType: 'tar',
      alertOpen: false,
      alertOpenEdit: false,
      filterMobile: false,
      editId: '',
      editType: 'tar'
    }
    this.navChange = this.navChange.bind(this)
    this.requestChange = this.requestChange.bind(this)
    this.getTravelRequests = this.getTravelRequests.bind(this)
    this.checkParam = this.checkParam.bind(this)
    this.alertOpenClose = this.alertOpenClose.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.toggleFilterMobile = this.toggleFilterMobile.bind(this)
    this.alertOpenCloseEdit = this.alertOpenCloseEdit.bind(this)

  }

  componentDidMount() {
    this.checkParam()
  }

  // Check query parameter on url
  checkParam() {
    if (!isEmpty(this.props.location)) {
      if (!isEmpty(this.props.location.search)) {
        const queryParams = queryString.parse(this.props.location.search)
        let request_type = isEmpty(queryParams.travel) ? 'all' : queryParams.travel
        let status = isEmpty(queryParams.status) ? 'all' : queryParams.status

        this.setState({ request_type, status }, () => this.getTravelRequests())
      } else {
        this.setState({ request_type: 'all', status: 'all' }, () => this.getTravelRequests())
        this.props.history.push({
          url: '/travel',
          search: '?travel=all&status=all'
        })
      }
    }
  }

  // Change url when status is changed (All, Saved, Submitted, Needs Revision, Approved, Disapproved)
  navChange(status) {
    this.setState({ status }, () => {
      this.props.history.push({
        url: '/travel',
        search: '?travel=' + this.state.request_type + '&status=' + status
      })
      this.getTravelRequests()
    })
  }

  // Change url when request type is changed (All, International, Domestic)
  requestChange(e) {
    this.setState({ request_type: e.target.value }, () => {
      this.props.history.push({
        url: '/travel',
        search: '?travel=' + this.state.request_type + '&status=' + this.state.status
      })
      this.getTravelRequests()
    })
  }

  // Get travel requests data using api
  getTravelRequests() {
    const { status, apiURL, request_type } = this.state
    let url = apiURL + '/travel-requests/' + request_type + '/immaper/lists/' + status

    this.setState({ isLoading: true, firstTime: false }, () => {
      axios.get(url)
        .then(res => {
          this.setState({ travel_requests: res.data.data, isLoading: false })
        })
        .catch(err => {
          this.setState({ isLoading: false }, () => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while retrieving your request'
            })
          })
        })
    })
  }

  // Delete confirmation dialog
  alertOpenClose() {
    this.setState({ alertOpen: this.state.alertOpen ? false : true });
  }

  // Edit confirmation dialog
  alertOpenCloseEdit() {
    this.setState({ alertOpenEdit: this.state.alertOpenEdit ? false : true });
  }

  // Delete travel request
  onDelete() {
    const { deleteId, apiURL, deleteType } = this.state
    let url = apiURL + '/' + deleteType + '/' + deleteId

    this.setState({ deleteLoading: true }, () => {
      axios.delete(url)
        .then((res) => {
          this.setState({ alertOpen: false, deleteId: '', deleteName: '', deleteLoading: false }, () => {
            this.props.addFlashMessage({
              type: 'success',
              text: res.data.message
            })
            this.getTravelRequests()
          })
        })
        .catch((err) => {
          this.setState({ deleteLoading: false }, () => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while deleting the travel request'
            })
          })
        })
    })
  }

  // open / close filter (travel type (request_type) and status) in mobile
  toggleFilterMobile() {
    this.setState({ filterMobile: this.state.filterMobile ? false : true })
  }

  render() {
    const { classes, width } = this.props
    const { isLoading, status, travel_requests, firstTime, deleteName, alertOpen, deleteLoading, request_type, filterMobile, alertOpenEdit } = this.state
    const isMobile = width == 'xs' ? true : false
    const columnClass = width == 'xs' ? classes.noUnderline : classes.underline

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h5">My Travel Request</Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={4} lg={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            to={'/int/add'}
            component={Link}
            className={classes.addMarginBottom}
          >
            <AddIcon /> International Request
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            to={'/dom/add'}
            component={Link}
            className={classes.addMarginBottom}
          >
            <AddIcon /> Domestic Request
          </Button>
          {!isMobile && (
            <FormControl component="fieldset" className={classname(classes.travelType, classes.addMarginBottom)}>
              <FormLabel component="legend" className={classes.legend}>Travel Type</FormLabel>
              <RadioGroup
                aria-label="Travel Type"
                name="request_type"
                className={classes.travelOptions}
                value={request_type}
                onChange={this.requestChange}
              >
                <FormControlLabel value="all" control={<Radio className={classes.option} color="primary" />} label="All" />
                <FormControlLabel value="tar" control={<Radio className={classes.option} color="primary" />} label="International" />
                <FormControlLabel value="mrf" control={<Radio className={classes.option} color="primary" />} label="Domestic" />
              </RadioGroup>
            </FormControl>
          )}
          {!isMobile && (
            <List component="nav" className={classes.list}>
              <ListItem button divider selected={status === 'all'} onClick={() => this.navChange('all')}>
                <ListItemIcon><AllInboxIcon /></ListItemIcon>
                <ListItemText primary="All Travel Requests" />
              </ListItem>
              <ListItem button divider selected={status === 'saved'} onClick={() => this.navChange('saved')}>
                <ListItemIcon><SaveIcon /></ListItemIcon>
                <ListItemText primary="Saved / Not Submitted" />
              </ListItem>
              <ListItem button divider selected={status === 'submitted'} onClick={() => this.navChange('submitted')}>
                <ListItemIcon><QueryBuilderIcon /></ListItemIcon>
                <ListItemText primary="Submitted" />
              </ListItem>
              <ListItem button divider selected={status === 'revision'} onClick={() => this.navChange('revision')}>
                <ListItemIcon><UpdateIcon className={classes.purple} /></ListItemIcon>
                <ListItemText primary="Needs Revision" />
              </ListItem>
              <ListItem button divider selected={status === 'approved'} onClick={() => this.navChange('approved')}>
                <ListItemIcon className={classes.green}><CheckCircleIcon /></ListItemIcon>
                <ListItemText primary="Approved" />
              </ListItem>
              <ListItem button selected={status === 'disapproved'} onClick={() => this.navChange('disapproved')}>
                <ListItemIcon className={classes.red}><CancelIcon /></ListItemIcon>
                <ListItemText primary="Disapproved" />
              </ListItem>
            </List>
          )}

        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={10}>
          {(firstTime || isLoading) && (
            <Typography color="primary" variant="subtitle1">
              Loading...
              <CircularProgress
                color="primary"
                size={22}
                thickness={5}
                className={classes.loading}
                disableShrink
              />
            </Typography>
          )}
          {!firstTime && !isLoading && !isEmpty(travel_requests) && travel_requests.map((request, index) => (
            <Card key={"travel-lists-" + index} className={classes.addSmallMarginBottom}>
              <CardContent className={classes.cardContent}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>TRAVEL ID</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>COUNTRY</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.country}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>SUBMISSION DATE</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.submitted_date == '-' ? request.submitted_date : moment(request.submitted_date).format('DD/MM/YYYY')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>Status</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classname(classes.addSmallMarginBottom, classes.capitalize)}>{request.status == "revision" ? "Need Revision" : request.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>Last Edit By</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classname(classes.addSmallMarginBottom, classes.capitalize)}>{request.last_edit}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>Actions</Typography>
                    <div>
                      <Fab
                        component="button"
                        onClick={() => this.props.getPDFInNewTab('/api/security-module/' + request.request_type + '/' + request.id + '/pdf')} size="small"
                        className={classname(classes.actionBtn, classes.pdfBtn)}
                      >
                        <FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />
                      </Fab>
                      <Fab
                        component={Link}
                        to={'/' + (request.request_type === 'mrf' ? 'dom' : 'int') + '/' + request.id + '/view'}
                        size="small"
                        className={classname(classes.actionBtn, classes.blueBtn)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </Fab>
                      {(request.status !== "disapproved") && (
                        (request.edit_on_approval == false) && (
                          request.status == "approved" ? (
                            request.editable == true && 
                                <Fab
                                  onClick={() => this.setState({ alertOpenEdit: true, editId: request.id, editType: request.request_type })}
                                  size="small"
                                  className={classname(classes.actionBtn, classes.greenBtn)}
                                >
                                    <EditIcon fontSize="small" />
                                </Fab>
                            ) : (
                              <Fab
                                component={Link}
                                to={'/' + (request.request_type === 'mrf' ? 'dom' : 'int') + '/' + request.id + '/edit'}
                                size="small"
                                className={classname(classes.actionBtn, classes.purpleBtn)}
                                >
                                  <EditIcon fontSize="small" />
                              </Fab>
                            )
                          )
                      )}
                      {(request.status !== "disapproved" && request.status !== "approved") && (
                        <Fab
                          onClick={() => this.setState({ deleteId: request.id, alertOpen: true, deleteName: request.name, deleteType: request.request_type })}
                          size="small"
                          className={classname(classes.actionBtn, classes.redBtn)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Fab>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          {!firstTime && !isLoading && isEmpty(travel_requests) && <Typography color="primary" variant="subtitle1">No Travel Request Data</Typography>}

          <Dialog open={alertOpen} onClose={this.alertOpenClose}>
            <DialogTitle>Delete Travel Request</DialogTitle>
            <DialogContent><DialogContentText>Are you sure to delete your travel request ({deleteName}) ?</DialogContentText></DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={this.alertOpenClose} color="secondary" disabled={deleteLoading}>
                <CancelIcon className={classes.addSmallMarginRight} /> Cancel
              </Button>
              <Button variant="contained" onClick={this.onDelete} color="primary" disabled={deleteLoading}>
                <DeleteIcon className={classes.addSmallMarginRight} /> Delete
                {deleteLoading && (
                  <CircularProgress color="secondary" className={classes.deleteLoading} thickness={5} size={22} />
                )}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Confirmation for edit the approved travel */}
          <Dialog open={alertOpenEdit} onClose={this.alertOpenCloseEdit}>
            <DialogTitle>Edit Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  By clicking on CONFIRM you are requesting to edit your TAR. <br/>
                  Your TAR may be edited once before your departure date.<br/>
                  Your TAR will then be re-submitted for approval.<br/>
                  Should you need to make changes after your departure date (e.g. for your return travel), you will be required to submit a new TAR showing all flights of travel again.<br/><br/>
                  Do you confirm your choice ? <br/>
              </DialogContentText>
             </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={this.alertOpenCloseEdit} color="secondary">
                <CancelIcon className={classes.addSmallMarginRight} /> Cancel
              </Button>
              <Button variant="contained" component={Link} to={'/' + (this.state.editType === 'mrf' ? 'dom' : 'int') + '/' + this.state.editId + '/edit'} color="primary">
                <DoneIcon className={classes.addSmallMarginRight} /> Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        {isMobile && (
          <Fab
            variant="extended"
            color="primary"
            aria-label="Delete"
            className={classes.filterBtn}
            onClick={this.toggleFilterMobile}
          >
            <FilterListIcon className={classes.extendedIcon} />
            {filterMobile ? 'Set ' : ''} Filter
          </Fab>
        )}
        {isMobile && (
          <Drawer
            variant="persistent"
            anchor="bottom"
            open={filterMobile}
            classes={{
              paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
            }}
          >
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <FormControl component="fieldset" className={classname(classes.travelType, classes.addMarginBottom, classes.addMarginTop)}>
                  <FormLabel component="legend" className={classes.legend}>Travel Type</FormLabel>
                  <RadioGroup
                    aria-label="Travel Type"
                    name="request_type"
                    className={classes.travelOptions}
                    value={request_type}
                    onChange={this.requestChange}
                  >
                    <FormControlLabel value="all" control={<Radio className={classes.option} color="primary" />} label="All" />
                    <FormControlLabel value="tar" control={<Radio className={classes.option} color="primary" />} label="International" />
                    <FormControlLabel value="mrf" control={<Radio className={classes.option} color="primary" />} label="Domestic" />
                  </RadioGroup>
                </FormControl>
                <List component="nav" className={classes.list}>
                  <ListItem button divider selected={status === 'all'} onClick={() => this.navChange('all')}>
                    <ListItemIcon><AllInboxIcon /></ListItemIcon>
                    <ListItemText primary="All Travel Requests" />
                  </ListItem>
                  <ListItem button divider selected={status === 'saved'} onClick={() => this.navChange('saved')}>
                    <ListItemIcon><SaveIcon /></ListItemIcon>
                    <ListItemText primary="Saved / Not Submitted" />
                  </ListItem>
                  <ListItem button divider selected={status === 'submitted'} onClick={() => this.navChange('submitted')}>
                    <ListItemIcon><QueryBuilderIcon /></ListItemIcon>
                    <ListItemText primary="Submitted" />
                  </ListItem>
                  <ListItem button divider selected={status === 'revision'} onClick={() => this.navChange('revision')}>
                    <ListItemIcon><UpdateIcon className={classes.purple} /></ListItemIcon>
                    <ListItemText primary="Needs Revision" />
                  </ListItem>
                  <ListItem button divider selected={status === 'approved'} onClick={() => this.navChange('approved')}>
                    <ListItemIcon className={classes.green}><CheckCircleIcon /></ListItemIcon>
                    <ListItemText primary="Approved" />
                  </ListItem>
                  <ListItem button selected={status === 'disapproved'} onClick={() => this.navChange('disapproved')}>
                    <ListItemIcon className={classes.red}><CancelIcon /></ListItemIcon>
                    <ListItemText primary="Disapproved" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Drawer>
        )}
      </Grid>
    )
  }
}

Travel.propTypes = {
  classes: PropTypes.object.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  getPDFInNewTab: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  addFlashMessage,
  getPDFInNewTab
}

const mapStateToProps = (state) => ({})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  addMarginTop: {
    marginTop: theme.spacing.unit * 2
  },
  addMarginBottom: {
    marginBottom: theme.spacing.unit * 2
  },
  addSmallMarginBottom: {
    marginBottom: theme.spacing.unit
  },
  list: {
    border: '1px solid ' + borderColor,
    padding: 0
  },
  red: {
    color: red
  },
  green: {
    color: green
  },
  purple: {
    color: purple
  },
  loading: {
    marginLeft: theme.spacing.unit,
    verticalAlign: 'text-top'
  },
  underline: {
    borderBottom: '1px solid ' + borderColor,
    paddingBottom: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  noUnderline: { borderBottom: 0 },
  capitalize: { textTransform: 'capitalize' },
  cardContent: {
    paddingBottom: theme.spacing.unit * 2,
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2
    }
  },
  actionBtn: {
    width: theme.spacing.unit * 4 + theme.spacing.unit / 2,
    height: theme.spacing.unit * 4 + theme.spacing.unit / 2,
    marginRight: theme.spacing.unit / 2
  },
  pdfBtn: {
    'background-color': primaryColor,
    color: white,
    '&:hover': {
      'background-color': primaryColorHover
    }
  },
  redBtn: {
    'background-color': red,
    color: white,
    '&:hover': {
      'background-color': redHover
    }
  },
  blueBtn: {
    'background-color': blue,
    color: white,
    '&:hover': {
      backgroundColor: blueHover
    }
  },
  purpleBtn: {
    'background-color': purple,
    color: white,
    '&:hover': {
      'background-color': purpleHover
    }
  },
  greenBtn: {
    'background-color': green,
    color: white,
    '&:hover': {
      'background-color': greenHover
    }
  },
  deleteLoading: {
    marginLeft: theme.spacing.unit,
    color: white
  },
  travelOptions: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
  },
  travelType: {
    width: 'calc(100% - 2px)',
    border: '1px solid ' + borderColor
  },
  legend: {
    marginLeft: theme.spacing.unit * 2
  },
  option: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
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
    border: '1px solid ' + primaryColor
  },
  extendedIcon: { marginRight: theme.spacing.unit },
  filterDrawer: {
    height: '100%',
    'padding-left': theme.spacing.unit * 3,
    'padding-right': theme.spacing.unit * 3
  },
  filterDrawerHide: { bottom: 'auto' },
  mobileFilter: { height: '100%', 'margin-top': theme.spacing.unit * 3 },
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(Travel))))
