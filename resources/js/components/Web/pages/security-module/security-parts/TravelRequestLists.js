import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classname from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import withWidth from "@material-ui/core/withWidth"
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { borderColor, red, redHover, white, purple, purpleHover, blue, primaryColor, primaryColorHover, blueHover, green, greenHover } from '../../../config/colors'
import isEmpty from '../../../validations/common/isEmpty'
import { getPDFInNewTab } from '../../../redux/actions/common/PDFViewerActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf'
import { deleteTravelRequests, getTravelRequestsForExport } from '../../../redux/actions/security-module/securityActions'
import { can } from '../../../permissions/can'

class TravelRequestLists extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      deleteId: '',
      deleteName: '',
      deleteLoading: false,
      request_type: '',
      alertOpen: false
    }

    this.alertOpenClose = this.alertOpenClose.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  alertOpenClose() {
    this.setState({ alertOpen: this.state.alertOpen ? false : true })
  }

  onDelete() {
    this.setState({ deleteLoading: true }, async () => {
      await this.props.deleteTravelRequests(this.state.deleteId, this.state.request_type)
      this.setState({ alertOpen: false, deleteId: '', deleteName: '', deleteLoading: false })
    })
  }

  render() {
    const { classes, isLoading, firstTime, travel_requests, width, isLoadingTravelRequestExport } = this.props
    const { alertOpen, deleteName, deleteLoading } = this.state
    const securityNational = !can('Approve Global Travel Request') && can('Approve Domestic Travel Request')
    const globalSecurity = (can('Approve Global Travel Request') && can('Approve Domestic Travel Request')) || can('Set as Admin')
    const canViewTravelOnly = (can('View Other Travel Request') || can('View SBP Travel Request') || can('View Only On Security Page')) && !can('Approve Global Travel Request') && !can('Approve Domestic Travel Request');
    const columnClass = width !== "sm" && width !== 'xs' ? classes.underline : classes.noUnderline

    return (
      <div>
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
        {!firstTime && !isLoading && !isEmpty(travel_requests) && can('Export Travel Requests') && (
           <Grid container spacing={0} className={classes.addSmallMarginBottom}>
              <Grid item xs={12} >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => this.props.getTravelRequestsForExport()}
                  disabled={isLoadingTravelRequestExport}
                  >
                  <CloudDownloadIcon className={classes.addMarginRight} />
                   Download Travel Requests
                  { isLoadingTravelRequestExport &&
                     <CircularProgress color="secondary" className={classes.dataExportLoading} thickness={5} size={22} />
                  }
                </Button>
            </Grid>
          </Grid>
         )}
        {!firstTime && !isLoading && !isEmpty(travel_requests) && travel_requests.map((request, index) => {
          const seeEditAndDeleteBtn = (request.status !== "disapproved" && request.status !== "approved") && ((request.request_type == "mrf" && securityNational) || !securityNational)
          const seeApprovedDeleteBtn = (request.status === "approved") && globalSecurity;

          return (
            <Card key={"travel-lists-" + index} className={classes.addSmallMarginBottom}>
              <CardContent className={classes.cardContent}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>TRAVEL ID</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>iMMAPer</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.immaper}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>COUNTRY</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{request.country}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>SUBMISSION DATE</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classes.addSmallMarginBottom}>{moment(request.submitted_date).format('DD/MM/YYYY')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>STATUS</Typography>
                    <Typography color="secondary" variant="subtitle2" className={classname(classes.capitalize, classes.addSmallMarginBottom)}>{request.status == 'revision' ? 'Need Revision' : request.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2}>
                    <Typography color="primary" variant="subtitle2" className={columnClass}>Actions</Typography>
                    <div>
                      <Fab
                        component="button"
                        onClick={() => this.props.getPDFInNewTab('/api/security-module/' + request.request_type + '/' + request.id + '/pdf')}
                        size="small"
                        className={classname(classes.actionBtn, classes.pdfBtn)}
                      >
                        <FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />
                      </Fab>
                      <Fab
                        component={Link}
                        to={'/' + (request.request_type === 'mrf' ? 'dom' : 'int') + '/' + request.id + '/security/view'}
                        size="small"
                        className={classname(classes.actionBtn, classes.blueBtn)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </Fab>
                      {(seeEditAndDeleteBtn && !canViewTravelOnly) && (
                        <Fab
                          component={Link}
                          to={'/' + (request.request_type === 'mrf' ? 'dom' : 'int') + '/' + request.id + '/security/edit'}
                          size="small"
                          className={classname(classes.actionBtn, request.edit_on_approval ? classes.greenBtn : classes.purpleBtn)}
                        >
                          <EditIcon fontSize="small" />
                        </Fab>
                      )}
                      {((seeEditAndDeleteBtn && !canViewTravelOnly) || seeApprovedDeleteBtn) && (
                        <Fab
                          onClick={() => this.setState({ deleteId: request.id, alertOpen: true, deleteName: request.name, request_type: request.request_type })}
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
          )
        })}
        {!firstTime && !isLoading && isEmpty(travel_requests) && <Typography color="primary" variant="subtitle1">No Travel Request</Typography>}

        <Dialog open={alertOpen} onClose={this.alertOpenClose}>
          <DialogTitle>Delete Travel Request</DialogTitle>
          <DialogContent><DialogContentText>Are you sure to delete travel request : {deleteName} ?</DialogContentText></DialogContent>
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
      </div>
    )
  }
}

TravelRequestLists.propTypes = {
  classes: PropTypes.object.isRequired,
  travel_requests: PropTypes.array.isRequired,
  firstTime: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingTravelRequestExport: PropTypes.bool.isRequired,
  getPDFInNewTab: PropTypes.func.isRequired,
  deleteTravelRequests: PropTypes.func.isRequired,
  getTravelRequestsForExport: PropTypes.func.isRequired,
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getPDFInNewTab,
  deleteTravelRequests,
  getTravelRequestsForExport
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  travel_requests: state.security.travel_requests,
  firstTime: state.security.firstTime,
  isLoading: state.security.isLoading,
  isLoadingTravelRequestExport: state.security.isLoadingTravelRequestExport
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  addSmallMarginBottom: {
    marginBottom: theme.spacing.unit
  },
  addSmallMarginRight: {
    marginRight: theme.spacing.unit
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
  noUnderline: {
    borderBottom: 0,
  },
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
    marginLeft: theme.spacing.unit
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  addMarginRight: {
    marginRight: '.25em'
  },
  dataExportLoading: {
    marginLeft: theme.spacing.unit
  },
})

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TravelRequestLists)))
