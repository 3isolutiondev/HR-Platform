/** import React, Prop Types, withRouter and connect  */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/** import Material UI styles, Component(s) and Icon(s) */
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

/** import Redux actions needed on this component*/
import { filterOnChange, filterTravelApprovedArray, filterTravelApprovedOnChange, onChange } from '../../../redux/actions/security-module/securityFilterActions';

/** import configuration value needed on this component */
import { can } from '../../../permissions/can';
class TravelFilter extends React.Component {
  constructor(props) {
    super(props)

    this.changeFilter = this.changeFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.timeout = 0;

  }

  /**
  * changeFilter is a function to track the change on the filter
  */
  async changeFilter(name, value, isArray = false) {
    isArray ? await this.props.filterTravelApprovedArray(name, value) : await this.props.filterTravelApprovedOnChange(name, value)
    this.props.redirectURL()
  }

  /**
  * handleSearch is a function handle search of iMMAPer on the filter
  */
  handleSearch(e) {
    this.props.onChange('searchImmaperTemp', e.target.value);
    let value = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
       this.props.filterTravelApprovedOnChange('searchImmaper', value)
    }, 500);
  }

  render() {
    const { classes, allTravelTypes, immapUs, immapFrance, sbpRelated, allFromCities, allToCities, 
             allInCities, fromCities, toCities, inCities, travelTypes, hiddenTrip, showHiddenTrips , 
             showImmapUs, showImmapFrance, showSbpRelated, searchImmaperTemp } = this.props;
    
    return (
      <Card className={classes.card}>
        <CardHeader
          title="Filter"
          className={classes.noPaddingBottom}
        />
        <CardContent>
          <div>
          <TextField
              id="search"
              name="searchImmaper"
              label="Search iMMAPer"
              fullWidth
              value={searchImmaperTemp}
              onChange={(e) => this.handleSearch(e)}
              autoFocus={false}
            />
            <FormControl margin="normal" fullWidth>
              <FormLabel>Travel Type</FormLabel>
              <FormGroup>
                {allTravelTypes.map(reqType => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"type_" + reqType.value}
                    control={
                      <Checkbox
                        checked={travelTypes.indexOf(reqType.value) > -1 ? true : false}
                        value={reqType.value}
                        color="primary"
                        name="travelTypes"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={reqType.label}
                  />

                ))}
              </FormGroup>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <FormLabel>People travelling today from</FormLabel>
              <FormGroup>
                 {allFromCities.map(city => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"type_" + city.value}
                    control={
                      <Checkbox
                        checked={fromCities.indexOf(city.value) > -1 ? true : false}
                        value={city.value}
                        color="primary"
                        name="fromCities"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={city.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <FormLabel>People travelling today to</FormLabel>
              <FormGroup>
                 {allToCities.map(city => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"type_" + city.value}
                    control={
                      <Checkbox
                        checked={toCities.indexOf(city.value) > -1 ? true : false}
                        value={city.value}
                        color="primary"
                        name="toCities"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={city.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <FormLabel>People currently in</FormLabel>
              <FormGroup>
                 {allInCities.map(city => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"type_" + city.value}
                    control={
                      <Checkbox
                        checked={inCities.indexOf(city.value) > -1 ? true : false}
                        value={city.value}
                        color="primary"
                        name="inCities"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={city.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
            {can('Hide Travel Dashboard Events') &&
              <>
                <FormControl margin="normal" fullWidth>
                    <FormLabel>Cost Centre</FormLabel>
                      <FormGroup>
                      <FormControlLabel
                        classes={{ label: classes.addMarginTop }}
                        color="primary"
                        key={"show_immap_us_" + immapUs.value }
                        control={
                          <Checkbox
                            checked={showImmapUs == 1 ? true : false}
                            value={immapUs.value}
                            color="primary"
                            name="showImmapUs"
                            className={classes.noPaddingBottom}
                            onChange={(e) => this.changeFilter(e.target.name, e.target.value, false)}
                          />
                        }
                        label={immapUs.label}
                      />
                      <FormControlLabel
                        classes={{ label: classes.addMarginTop }}
                        color="primary"
                        key={"show_immap_france_" + immapFrance.value }
                        control={
                          <Checkbox
                            checked={showImmapFrance == 1 ? true : false}
                            value={immapFrance.value}
                            color="primary"
                            name="showImmapFrance"
                            className={classes.noPaddingBottom}
                            onChange={(e) => this.changeFilter(e.target.name, e.target.value, false)}
                          />
                        }
                        label={immapFrance.label}
                      />
                    </FormGroup>
                </FormControl>
                <FormControl margin="normal" fullWidth>
                    <FormLabel>Miscellaneous</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        classes={{ label: classes.addMarginTop }}
                        color="primary"
                        key={"show_sbp_member_" + sbpRelated.value }
                        control={
                          <Checkbox
                            checked={showSbpRelated == 1 ? true : false}
                            value={sbpRelated.value}
                            color="primary"
                            name="showSbpRelated"
                            className={classes.noPaddingBottom}
                            onChange={(e) => this.changeFilter(e.target.name, e.target.value, false)}
                          />
                        }
                        label={sbpRelated.label}
                      />
                      <FormControlLabel
                        classes={{ label: classes.addMarginTop }}
                        color="primary"
                        key={"show_hidden_trip_" + hiddenTrip.value }
                        control={
                          <Checkbox
                            checked={showHiddenTrips == 1 ? true : false}
                            value={hiddenTrip.value}
                            color="primary"
                            name="showHiddenTrips"
                            className={classes.noPaddingBottom}
                            onChange={(e) => this.changeFilter(e.target.name, e.target.value, false)}
                          />
                        }
                        label={hiddenTrip.label}
                      />
                    </FormGroup>
                </FormControl>
              </>
             }
          </div>
        </CardContent>
      </Card >
    )
  }
}

TravelFilter.defaultProps = {
  allTravelTypes: [],
  hiddenTrip: {},
  immapUs: {},
  immapFrance: {},
  sbpRelated: {},
  allFromCities: [],
  allToCities: [],
  allInCities: []
}

TravelFilter.propTypes = {

  /**
   * classes is a prop containing styles for this component generated by material-ui v3
  */
  classes: PropTypes.object.isRequired,

  /**
  * allTravelTypes is a prop containing all tarvel types data
  */
  allTravelTypes: PropTypes.array.isRequired,

  /**
  * travelTypes is a prop containing all tarvel types which is filted
  */
  travelTypes: PropTypes.array.isRequired,

  /**
  * fromCities is a prop containing all (from) Cities data
  */
  allFromCities: PropTypes.array.isRequired,

  /**
  * toCities is a prop containing all (to) Cities data
  */
  allToCities: PropTypes.array.isRequired,

  /**
  * inCities is a prop containing all (in) Cities data
  */
  allInCities: PropTypes.array.isRequired,

  /**
  * hiddenTrips is a prop containing object of hidden trip data
  */
  hiddenTrip: PropTypes.object.isRequired,

  /**
  * immapUs is a prop containing object of immap US data
  */
  immapUs: PropTypes.object.isRequired,

  /**
  * immapFrance is a prop containing object of immap France data
  */
  immapFrance: PropTypes.object.isRequired,

  /**
  * sbpRelated is a prop containing object of SBP related
  */
  sbpRelated: PropTypes.object.isRequired,

  /**
  * onChange is a prop containing function action to update the reducer
  */
  onChange: PropTypes.func.isRequired,

}

/**
* set up map dispatch for this component
* @returns {function} return functions prop to be accessed in the component
*/
const mapDispatchToProps = {
  onChange,
  filterOnChange,
  filterTravelApprovedArray,
  filterTravelApprovedOnChange
}

/**
* set up map state for this component
* @param {*} state
* @returns {objects} data object prop to be accessed in the component
*/
const mapStateToProps = (state) => ({
  allTravelTypes: state.securityFilter.allTravelTypes,
  allFromCities: state.securityFilter.allFromCities,
  allToCities: state.securityFilter.allToCities,
  allInCities: state.securityFilter.allInCities,
  travelTypes: state.securityFilter.travelTypes,
  fromCities: state.securityFilter.fromCities,
  toCities: state.securityFilter.toCities,
  inCities: state.securityFilter.inCities,
  hiddenTrip: state.securityFilter.hiddenTrip,
  showHiddenTrips: state.securityFilter.showHiddenTrips,
  immapUs: state.securityFilter.immapUs,
  immapFrance: state.securityFilter.immapFrance,
  sbpRelated: state.securityFilter.sbpRelated,
  showImmapUs: state.securityFilter.showImmapUs,
  showImmapFrance: state.securityFilter.showImmapFrance,
  showSbpRelated: state.securityFilter.showSbpRelated,
  searchImmaper: state.securityFilter.searchImmaper,
  searchImmaperTemp: state.securityFilter.searchImmaperTemp,
  errors: state.securityFilter.errors,

});

/**
 * set up styles for this component
 * @param {*} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  noPaddingBottom: { paddingBottom: 0 },
  addMarginTop: { 'margin-top': '.75em' },
  period: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    display: 'block'
  },
  resetBtn: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  },
  card: {
    position: 'relative',
    overflow: 'visible',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 4,
    '&:first-of-type': {
      marginTop: theme.spacing.unit * 2
    },
    '&:last-of-type': {
      marginBottom: theme.spacing.unit * 2
    }
  }
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(TravelFilter)))
