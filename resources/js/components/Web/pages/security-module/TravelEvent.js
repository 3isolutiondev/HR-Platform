/** import React, Prop Types, and connect  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/** import calendar and moment  */
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

/** import Material UI styles, Component(s) and Icon(s) */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CancelIcon from '@material-ui/icons/Cancel';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import FilterListIcon from '@material-ui/icons/FilterList';

/** import Redux actions and components needed on this component */
import { onChange, getApprovalTravelRequests, updateTripViewStatus } from '../../redux/actions/security-module/securityActions';
import { filterTravelApprovedOnChange } from '../../redux/actions/security-module/securityFilterActions';
import TravelFilter from './approved-travel-parts/TravelFilter';

/** import configuration value needed on this component */
import '../../assets/css/calendar.css';
import { primaryColor, white } from '../../config/colors';
import { can } from '../../permissions/can';

/**
 * TravelEvent is a component to show the calendar of approval travels of iMMAPers
 *
 * @name TravelEvent
 * @component
 * @category Security Module
 * @subcategory Travel Dashboard
 *
 */
class TravelEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            filterMobile: false,
            event: {},
            activeView: 'month'
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.dialogOpenClose = this.dialogOpenClose.bind(this);
        this.redirectURL = this.redirectURL.bind(this);
        this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
        this.hideOrUnhideTrip = this.hideOrUnhideTrip.bind(this);

    }

    /**
    * componentDidMount is a lifecycle function called where the component is mounted
    */
    componentDidMount() {
        this.props.getApprovalTravelRequests();
    }

    /**
    * componentDidUpdate is a lifecycle function called where the component is updated
    */
    componentDidUpdate() {
        if (this.props.loadData) {
            this.props.getApprovalTravelRequests();
            this.props.onChange('loadData', false);
        }
    }

    /**
    * handleShow is a function to show the popup in order to review the details of a single approved travel
    * @param {event} event - event
    */
    handleShow(event) {
        this.setState({
            event,
            dialogOpen: true
        });
    }

    /**
    * redirectURL is a function to redirect the URL accoriding to the params
    */
    async redirectURL() {
        await this.props.history.push({
            url: '/travel-dashboard',
            search: this.props.queryParamsApprovedTravel
        });
    }

    /**
    * handleChangeDate is a function  that handle the change of date of calendar
    * @param {string} date
    */
    async handleChangeDate(date) {
        date = moment(date).format('DD/MM/Y');
        await this.props.filterTravelApprovedOnChange('date', date, true);
        this.redirectURL();
    }

    /**
     * dialogOpenClose is a function to open or to close the popup
     * @param {event} e - event
     */
    dialogOpenClose(e) {
        e.preventDefault();
        this.setState({ dialogOpen: this.state.dialogOpen ? false : true });
    }

    /**
    * toggleFilterMobile is a function to open or to close the drawer on mobile devise
    */
    toggleFilterMobile() {
        this.setState({ filterMobile: this.state.filterMobile ? false : true })
    }

    /**
    * hideOrUnhideTrip is a function to hide or unhide the trip on the calendar
    */
    async hideOrUnhideTrip(id, type, status) {
        this.setState({ dialogOpen: false });
        await this.props.updateTripViewStatus(id, type, status);
    }

    render() {

        const localizer = momentLocalizer(moment);
        const views = ['month', 'week'];
        const maxTime = new Date();
        maxTime.setHours(0, 0, 0);
        const { travel_approval_requests, isLoading, classes, width } = this.props;
        const { dialogOpen, event, filterMobile, activeView } = this.state;
        const isMobile = isWidthDown("sm", width)

        return (
            <div>
                <Grid container spacing={24}>
                    {!isMobile && (
                        <Grid item xs={12} sm={3} md={3} xl={2} >
                            <TravelFilter redirectURL={this.redirectURL} />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={!isMobile ? 9 : 12} md={!isMobile ? 9 : 12} xl={!isMobile ? 10 : 12}>
                        <div className={classes.content}>
                            <div className={isLoading ? classes.filtering : null}>
                                <div className={classes.title}>Approved Travel {isLoading ? <CircularProgress className={classes.loading} size={22} thickness={5} /> : null}</div>
                                <Calendar
                                    views={views}
                                    localizer={localizer}
                                    events={travel_approval_requests ? travel_approval_requests : []}
                                    max={maxTime}
                                    onSelectEvent={event => this.handleShow(event)}
                                    style={activeView === 'month' ? { height: 500 } : {}}
                                    onNavigate={(date) => this.handleChangeDate(date)}
                                    onView={(view) => this.setState({ activeView: view })}
                                    messages={{ "previous": 'Previous' }}
                                    popup={true}
                                    eventPropGetter={(event) => {
                                        const backgroundColor = event.color;
                                        const opacityNumber = event.completedTrip ? 0.5 : 1;
                                        const style = {
                                            backgroundColor: backgroundColor,
                                            opacity: opacityNumber,
                                        };
                                        return { style }
                                    }}
                                />
                                <Dialog maxWidth="md" open={dialogOpen} onClose={this.dialogOpenClose}>
                                    <DialogContent>
                                        <table className={classes.eventShowtable}>
                                            <tbody>
                                                <tr className={classes.immapBg}><td className={classes.txtWhite} colSpan="17">Travel Info</td></tr>
                                                <tr>
                                                    <td><b>Travel ID:</b></td>
                                                    <td colSpan={event.travel_type !== 'multi-location' ? 3 : 6}>
                                                        {can('Approve Global Travel Request|Approve Domestic Travel Request') ?
                                                            <a className={classes.link} href={'/' + (event.transportation_type === 'INT' ? 'int' : 'dom') + '/' + event.id + '/view'} target="_blank">{event.name}</a>
                                                            : event.name}
                                                    </td>
                                                    <td><b>Travel Type:</b></td>
                                                    <td colSpan={event.travel_type !== 'multi-location' ? 6 : 9}>{event.transportation_travel_type}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Consultant:</b></td>
                                                    <td colSpan="16">{event.immaper}</td>
                                                </tr>
                                                {event.travel_type !== 'multi-location' &&
                                                    <tr>
                                                        <td><b>From:</b></td>
                                                        <td colSpan="3">{event.from_city}</td>
                                                        <td><b>To:</b></td>
                                                        <td colSpan="7">{event.to_city}</td>
                                                    </tr>
                                                }
                                                <tr className={classes.immapBg}>
                                                    <td className={classes.txtWhite} colSpan="17">
                                                        Departure
                                                    </td>
                                                </tr>
                                                {event.travel_type !== 'multi-location' &&
                                                    <tr>
                                                        <td><b>Date:</b></td>
                                                        <td colSpan={event.departure_etd && event.departure_eta ? 0 : 6}>{moment(event.date_travel).format('MMMM Do YYYY')}</td>
                                                        {event.departure_etd &&
                                                            <>
                                                                <td colSpan="2"><b>ETD:</b></td>
                                                                <td>{event.departure_etd.replace(/:[^:]*$/, '')}</td>
                                                            </>
                                                        }
                                                        {event.departure_eta &&
                                                            <>
                                                                <td colSpan="2"><b>ETA:</b></td>
                                                                <td>{event.departure_eta.replace(/:[^:]*$/, '')}</td>
                                                            </>
                                                        }
                                                        {event.flight_number && event.travel_type !== 'round-trip' &&
                                                            <>
                                                                <td><b>Flight Number:</b></td>
                                                                <td>{event.flight_number}</td>
                                                            </>
                                                        }
                                                        {event.flight_number_outbound_trip && event.travel_type === 'round-trip' &&
                                                            <>
                                                                <td><b>Flight Number:</b></td>
                                                                <td>{event.flight_number_outbound_trip}</td>
                                                            </>
                                                        }
                                                        {(event.risk_level == 'High' || event.risk_level == 'Moderate' || event.under_sbp_program == 1) && (
                                                            event.travel_type === 'one-way-trip' ?
                                                                <>
                                                                    <td><b>Checked in:</b></td>
                                                                    <td>{event.check_in == 1 ? 'Yes' : 'No'}</td>
                                                                </>
                                                                :
                                                                <>
                                                                    <td><b>Checked in outbound:</b></td>
                                                                    <td>{event.check_in_outbound == 1 ? 'Yes' : 'No'}</td>
                                                                </>
                                                        )}
                                                    </tr>
                                                }
                                                {event.travel_type === 'round-trip' && event.travel_type !== 'multi-location' &&
                                                    <>
                                                        <tr className={classes.immapBg}><td colSpan="11" className={classes.txtWhite}>Return</td></tr>
                                                        <tr>
                                                            <td><b>Date:</b></td>
                                                            <td colSpan={event.return_etd && event.return_eta ? 0 : 6}>{moment(event.return_date_travel).format('MMMM Do YYYY')}</td>
                                                            {event.return_etd &&
                                                                <>
                                                                    <td colSpan="2"><b>ETD:</b></td>
                                                                    <td>{event.return_etd.replace(/:[^:]*$/, '')}</td>
                                                                </>
                                                            }
                                                            {event.return_eta &&
                                                                <>
                                                                    <td colSpan="2"><b>ETA:</b></td>
                                                                    <td>{event.return_eta.replace(/:[^:]*$/, '')}</td>
                                                                </>
                                                            }
                                                            {event.flight_number_return_trip && event.travel_type === 'round-trip' &&
                                                                <>
                                                                    <td><b>Flight Number:</b></td>
                                                                    <td>{event.flight_number_return_trip}</td>
                                                                </>
                                                            }
                                                            {(event.risk_level == 'High' || event.risk_level == 'Moderate' || event.under_sbp_program == 1) &&
                                                                <>
                                                                    <td><b>Checked in return:</b></td>
                                                                    <td>{event.check_in_return == 1 ? 'Yes' : 'No'}</td>
                                                                </>
                                                            }
                                                        </tr>
                                                    </>
                                                }
                                            </tbody>
                                            {event.travel_type === 'multi-location' &&
                                                event.itineraries.map((itinerary, index) => (
                                                    <tbody key={index}>
                                                        <tr>
                                                            <td><b>Date:</b></td>
                                                            {event.transportation_type === 'INT' ?
                                                                <td colSpan="2">{moment(itinerary.date_travel).format('MMMM Do YYYY')}</td>
                                                                :
                                                                <td colSpan="2">{moment(itinerary.date_time).format('MMMM Do YYYY')}</td>
                                                            }
                                                            <td><b>From:</b></td>
                                                            <td colSpan="2">{itinerary.from_city}</td>
                                                            <td><b>To:</b></td>
                                                            <td colSpan="2">{itinerary.to_city}</td>
                                                            {itinerary.etd &&
                                                                <>
                                                                    <td colSpan="2"><b>ETD:</b></td>
                                                                    <td>{itinerary.etd.replace(/:[^:]*$/, '')}</td>
                                                                </>
                                                            }
                                                            {itinerary.eta &&
                                                                <>
                                                                    <td colSpan="2"><b>ETA:</b></td>
                                                                    <td>{itinerary.eta.replace(/:[^:]*$/, '')}</td>
                                                                </>
                                                            }
                                                            {event.transportation_type === 'DOM AIR' || event.transportation_type === 'INT' ?
                                                                <>
                                                                    <td><b>Flight Number:</b></td>
                                                                    <td >{itinerary.flight_number ? itinerary.flight_number : '-'}</td>
                                                                </>
                                                                : null
                                                             }
                                                             {(event.risk_level == 'High' || event.risk_level == 'Moderate' || event.under_sbp_program == 1) &&
                                                               <>
                                                                   <td><b>Checked in:</b></td>
                                                                   <td>{itinerary.check_in == 1 ? 'Yes' : 'No'}</td>
                                                               </>
                                                            }
                                                        </tr>
                                                        {itinerary.outbound_trip_final_destination == 1 &&
                                                            <tr className={classes.immapBg} key={8787} >
                                                                <td className={classes.txtWhite} colSpan="17">
                                                                    Return
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                )
                                                )
                                            }
                                        </table>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" onClick={this.dialogOpenClose} color="secondary">
                                            <CancelIcon className={classes.addSmallMarginRight} /> CLOSE
                                        </Button>
                                        {can('Hide Travel Dashboard Events') && (
                                            event.view_status === 'hide' ?
                                                <Button variant="contained" color="primary" onClick={() => this.hideOrUnhideTrip(event.id, event.transportation_type, 'unhide')}>
                                                    <VisibilityIcon className={classes.addSmallMarginRight} /> Unhide
                                                </Button>
                                                :
                                                <Button variant="contained" color="primary" onClick={() => this.hideOrUnhideTrip(event.id, event.transportation_type, 'hide')}>
                                                    <VisibilityOffIcon className={classes.addSmallMarginRight} /> Hide
                                                </Button>
                                        )}
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                    </Grid>
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
                        <div className={classes.mobileFilter}>
                            <TravelFilter filterMobile={filterMobile} />
                        </div>
                    </Drawer>
                )}
            </div>
        )
    }
}

TravelEvent.propTypes = {
    /**
    * with is a prop containing the sizes of screen
    */
    width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
    /**
    * classes is a prop containing styles for this component generated by material-ui v3
    */
    classes: PropTypes.object.isRequired,

    /**
    * getApprovalTravelRequests is a prop containing the redux action for retrieving data
    */
    getApprovalTravelRequests: PropTypes.func.isRequired,

    /**
    * travel_approval_requests is a prop containing the approval travel data
    */
    travel_approval_requests: PropTypes.array.isRequired,

    /**
    * isLoading is a prop containing the status of loading data
    */
    isLoading: PropTypes.bool.isRequired,

    /**
    * queryParamsApprovedTravel is a prop containing query params
    */
    queryParamsApprovedTravel: PropTypes.string,

    /**
    * onChange is a prop containing function action to update the reducer
    */
    onChange: PropTypes.func.isRequired,

    /**
    * loadData is a prop containing the status load data
    */
    loadData: PropTypes.bool.isRequired
}

/**
 * set up map dispatch for this component
 * @returns {object} mapDispatchToProps - contain several redux actions map as a prop to be accessed in the component
 */
const mapDispatchToProps = {
    onChange,
    getApprovalTravelRequests,
    filterTravelApprovedOnChange,
    updateTripViewStatus
}

/**
* set up map state for this component
* @param {object} state
* @returns {object} data object prop to be accessed in the component
*/
const mapStateToProps = (state) => ({
    travel_approval_requests: state.security.travel_approval_requests,
    isLoading: state.security.isLoading,
    queryParamsApprovedTravel: state.security.queryParamsApprovedTravel,
    loadData: state.security.loadData,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
    addSmallMarginRight: {
        marginRight: theme.spacing.unit / 2
    },
    filtering: {
        opacity: 0.5
    },
    loading: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: primaryColor
    },
    title: {
        marginBottom: 20,
        marginRight: 30,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: "'Barlow', sans-serif",
        display: 'inline-flex',
        width: 240
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
    content: {
        textAlign: 'center'
    },
    eventShowtable: {
        borderCollapse: 'collapse',
        '& td': {
            border: '1px solid #ddd',
            padding: 8,
            fontFamily: "'Barlow', sans-serif"
        },
        '& tr': {
            border: '1px solid #ddd',
            padding: 8,
            fontFamily: "'Barlow', sans-serif"
        }
    },
    immapBg: {
        backgroundColor: primaryColor
    },
    txtWhite: {
        color: white
    },
    link: {
        textDecoration: 'none'
    }
});


export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TravelEvent)))
