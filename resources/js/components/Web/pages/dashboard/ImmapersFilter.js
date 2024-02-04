/** import React, classname, moment  and react input range */
import React, { Component } from 'react';
import moment from 'moment'

/** import Materiaul UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

/** import react redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, postAPI } from '../../redux/actions/apiActions';
import {
  onChange,
  resetFilter,
  filterArray,
  isFilterIsReset
} from '../../redux/actions/dashboard/immapersFilterActions';

/** import css, configuration value, permission checker and validation helper */
import 'react-input-range/lib/css/index.css';
import { primaryColor } from '../../config/colors';
import '../jobs/job.css';
import isEmpty from '../../validations/common/isEmpty';
import DatePickerField from '../../common/formFields/DatePickerField'


/**
 * ImmapersFilter is a component to show filter in ToR page
 *
 * @name ImmapersFilter
 * @component
 * @category Page
 * @subcategory ToR
 *
 */
class ImmapersFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
        dutyStationFilters: [],
        immapOfficeFilters: [],
        lineManagerFilters: [],
        projectCodeFilters: [],
        contractStatusFilters: ["Active", "Not Active"],
    };

    this.onChange = this.onChange.bind(this);
    this.getFiltersData = this.getFiltersData.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }

   /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
    componentDidMount() {
        this.getFiltersData();
      }

  /**
   * onChange is a function to change data of search box in the filter
   * @param {Event} e
   */
  onChange(e) {
    this.props.setLoadingImmapers(true);
    this.props.onChange(e.target.name, e.target.value)
    this.props.isFilterIsReset(true, false)
  }

  /**
   * onChangeDate is a function to change data of search box in the filter
   * @param {Event} e
   */
   onChangeDate(name, value) {
    value = value == 'Invalid date' ? '' : value;
    this.props.setLoadingImmapers(true);
    this.props.onChange(name, value)
    this.props.isFilterIsReset(true, false)
  }

  /**
   * getFiltersData is a function to get all fliter data 
   */
  getFiltersData() {
    this.props
      .getAPI("/api/immapers-filter-data")
      .then((res) => {
        const {
          dutyStationFilters,
          immapOfficeFilters,
          lineManagerFilters,
          projectCodeFilters,
        } = res.data.data;
        this.setState({
          dutyStationFilters: dutyStationFilters ,
          immapOfficeFilters: immapOfficeFilters,
          lineManagerFilters: lineManagerFilters ,
          projectCodeFilters: projectCodeFilters,
        });
      })
      .catch((err) => {
        this.setState({
          dutyStationFilters: [],
          immapOfficeFilters: [],
          lineManagerFilters: [],
          projectCodeFilters: [],
        });
      });
  }

  render() {
    const { classes, immaperFilter } = this.props;
    const {
      search,
      contract_expire_date,
      duty_station,
      immap_office,
      line_manager,
      status_contract,
      project_code,
      errors
    } = immaperFilter;

    const {  contractStatusFilters, dutyStationFilters, immapOfficeFilters, lineManagerFilters, projectCodeFilters } = this.state;

    return (
      <Card>
        <CardHeader
          title="Filter"
          className={classes.filterTitle}
          action={
            <Typography
              variant="body1"
              color="primary"
              className={classes.resetBtn}
              onClick={() => {
                this.props.setLoadingImmapers(true);
                this.props.resetFilter()
                this.props.isFilterIsReset(true, false)
              }}
            >
              Reset
			</Typography>
          }
        />
        <CardContent>
          <div>
            <TextField
              id="search"
              name="search"
              label="Search"
              fullWidth
              value={search}
              onChange={this.onChange}
              error={!isEmpty(errors.search)}
              helperText={errors.search}
              autoFocus={false}
            />  
            <FormControl
                margin="normal"
                className={classes.contractStatusFormControl}
                fullWidth
                error={!isEmpty(errors.status_contract) ? true : false}
            >
                <FormLabel>Status of contract</FormLabel>
                <FormGroup>
                  {contractStatusFilters.length > 0 &&
                    contractStatusFilters.map((status, index) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={index}
                          control={
                            <Checkbox
                              checked={
                                status_contract.indexOf(status) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={status}
                              color="primary"
                              name="status_contract"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingImmapers(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={status}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.status_contract) && (
                  <FormHelperText>{errors.status_contract}</FormHelperText>
                )}
            </FormControl>
            <FormControl
                margin="normal"
                className={classes.contractStatusFormControl}
                fullWidth
                error={!isEmpty(errors.status_contract) ? true : false}
            >
                <FormLabel>Project Code</FormLabel>
                <FormGroup>
                  {projectCodeFilters.length > 0 &&
                    projectCodeFilters.map((code, index) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={index}
                          control={
                            <Checkbox
                              checked={
                                project_code.indexOf(code) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={code}
                              color="primary"
                              name="project_code"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingImmapers(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={code}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.status_contract) && (
                  <FormHelperText>{errors.status_contract}</FormHelperText>
                )}
            </FormControl>
            <FormControl
                margin="normal"
                className={classes.contractStatusFormControl}
                fullWidth
                error={!isEmpty(errors.duty_station) ? true : false}
            >
                <FormLabel>Duty Station</FormLabel>
                <FormGroup>
                  {dutyStationFilters.length > 0 &&
                    dutyStationFilters.map((dutyStation, index) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={index}
                          control={
                            <Checkbox
                              checked={
                                duty_station.indexOf(dutyStation) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={dutyStation}
                              color="primary"
                              name="duty_station"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingImmapers(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={dutyStation}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.duty_station) && (
                  <FormHelperText>{errors.duty_station}</FormHelperText>
                )}
            </FormControl>
            <FormControl
                margin="normal"
                className={classes.contractStatusFormControl}
                fullWidth
                error={!isEmpty(errors.immap_office) ? true : false}
            >
                <FormLabel>iMMAP Officer</FormLabel>
                <FormGroup>
                  {immapOfficeFilters.length > 0 &&
                    immapOfficeFilters.map((office, index) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={index}
                          control={
                            <Checkbox
                              checked={
                                immap_office.indexOf(office) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={office}
                              color="primary"
                              name="immap_office"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingImmapers(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={office}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.immap_office) && (
                  <FormHelperText>{errors.immap_office}</FormHelperText>
                )}
            </FormControl>
            <FormControl
                margin="normal"
                className={classes.contractStatusFormControl}
                fullWidth
                error={!isEmpty(errors.line_manager) ? true : false}
            >
                <FormLabel>Line Manager</FormLabel>
                <FormGroup>
                  {lineManagerFilters.length > 0 &&
                    lineManagerFilters.map((lineManager, index) => {
                      return (
                        <FormControlLabel
                          classes={{ label: classes.addMarginTop }}
                          color="primary"
                          key={index}
                          control={
                            <Checkbox
                              checked={
                                line_manager.indexOf(lineManager) > -1 ? (
                                  true
                                ) : (
                                    false
                                  )
                              }
                              value={lineManager}
                              color="primary"
                              name="line_manager"
                              className={classes.noPaddingBottom}
                              onChange={(e) => {
                                this.props.setLoadingImmapers(true);
                                this.props.filterArray(e.target.name, e.target.value);
                              }}
                            />
                          }
                          label={lineManager}
                        />
                      );
                    })}
                </FormGroup>
                {!isEmpty(errors.line_manager) && (
                  <FormHelperText>{errors.line_manager}</FormHelperText>
                )}
            </FormControl>
            <br /> <br />
            <FormLabel className={classes.period}>Contract expire</FormLabel>
            <DatePickerField
              label="Date"
              name="contract_expire_date"
              value={
                isEmpty(contract_expire_date) ? (
                  null
                ) : (
                    moment(contract_expire_date)
                  )
              }
              onChange={(e) => this.onChangeDate(e.target.name, isEmpty(e.target.value) ? null : moment(e.target.value).format('YYYY-MM-DD'))}
              error={errors.contract_expire_date}
              margin="dense"
              clearable={true}
            />
          </div>
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
  getAPI,
  postAPI,
  onChange,
  resetFilter,
  filterArray,
  isFilterIsReset
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
    addMarginTop: {
      'margin-top': '.75em'
    },
    addMarginBottom: {
      'margin-bottom': '.75em'
    },
    addPaddingBottom: {
      'padding-bottom': '.75em'
    },
    sliderLabel: {
      'padding-bottom': '1.5em'
    },
    sliderFormControl: {
      'margin-bottom': '1.5em'
    },
    sliderFormHelperText: {
      'margin-top': '2.5em'
    },
    contractStatusFormControl: {
      'margin-top': '2em'
    },
    noPaddingBottom: {
      'padding-bottom': '0'
    },
    sliderColor: {
      background: primaryColor
    },
    filterTitle: {
      'padding-bottom': 0
    },
    resetBtn: {
      marginTop: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  });

export default withStyles(styles)(connect(mapStatetoProps, mapDispatchToProps)(ImmapersFilter));
