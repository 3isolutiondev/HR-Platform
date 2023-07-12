import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip';
import { getCriticalities, getPurposes, filterOnChange, filterArray, resetFilter, onChange } from '../../../redux/actions/security-module/securityFilterActions'
import { onChange as paramOnChange } from '../../../redux/actions/security-module/securityActions'
import { getP11ImmapOffices } from '../../../redux/actions/optionActions'
import isEmpty from '../../../validations/common/isEmpty'
import DatePickerField from '../../../common/formFields/DatePickerField'

class SecurityFilter extends React.Component {
  constructor(props) {
    super(props)

    this.changeFilter = this.changeFilter.bind(this)
    this.checkParam = this.checkParam.bind(this)
    this.timeout = 0;
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.getCriticalities()
    this.props.getPurposes()
    this.props.getP11ImmapOffices()
    this.props.onRef(this);
    this.checkParam()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filterMobile !== this.props.filterMobile && this.props.filterMobile) {
      this.checkParam()
    }
  }

  async checkParam(fromBackButton = false) {
    if (!isEmpty(this.props.location)) {
      if (!isEmpty(this.props.location.search)) {
        const queryParams = queryString.parse(this.props.location.search)
        let search = isEmpty(queryParams.search) ? '' : queryParams.search
        let status = isEmpty(queryParams['status[]']) ? [] : Array.isArray(queryParams['status[]']) ? queryParams['status[]'] : [...[], queryParams['status[]']]
        let criticalities = isEmpty(queryParams['criticalities[]']) ? [] : Array.isArray(queryParams['criticalities[]']) ? queryParams['criticalities[]'] : [...[], queryParams['criticalities[]']]
        let purposes = isEmpty(queryParams['purposes[]']) ? [] : Array.isArray(queryParams['purposes[]']) ? queryParams['purposes[]'] : [...[], queryParams['purposes[]']]
        let offices = isEmpty(queryParams['offices[]']) ? [] : Array.isArray(queryParams['offices[]']) ? queryParams['offices[]'] : [...[], queryParams['offices[]']]
        let submitted_from = isEmpty(queryParams.submitted_from) ? '' : queryParams.submitted_from
        let submitted_to = isEmpty(queryParams.submitted_to) ? '' : queryParams.submitted_to
        let traveled_from = isEmpty(queryParams.traveled_from) ? '' : queryParams.traveled_from
        let traveled_to = isEmpty(queryParams.traveled_to) ? '' : queryParams.traveled_to

        this.props.onChange('search', search)
        this.props.onChange('status', status)
        this.props.onChange('criticalities', criticalities)
        this.props.onChange('offices', offices)
        this.props.onChange('purposes', purposes)
        this.props.onChange('submitted_from', submitted_from)
        this.props.onChange('submitted_to', submitted_to)
        this.props.onChange('traveled_from', traveled_from)
        this.props.onChange('traveled_to', traveled_to)
      }
    }
  }

  async changeFilter(name, value, isArray = false, isDate = false) {
    let change = isArray ? await this.props.filterArray(name, value) : await this.props.filterOnChange(name, value, isDate)
    this.props.redirectURL()
  }

  handleSearch(e) {
    this.props.onChange('searchTemp', e.target.value);
    let value = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    this.props.filterOnChange('search', value);
    }, 1000);
  }

  render() {
    const {
      classes, tab,
      allCriticalities, allPurposes, allStatus, allImmapOffices,
      criticalities, purposes, status, offices, submitted_from, submitted_to, traveled_from, traveled_to, searchTemp,
      errors, archiveTypes, allArchiveTypes
    } = this.props

    return (
      <Card>
        <CardHeader
          title="Filter"
          className={classes.noPaddingBottom}
          action={
            <Typography
              variant="body1"
              color="primary"
              className={classes.resetBtn}
              onClick={async () => { await this.props.resetFilter(); this.props.redirectURL() }}
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
              label="Search iMMAPer"
              fullWidth
              value={searchTemp}
              onChange={(e) => this.handleSearch(e)}
              error={!isEmpty(errors.search)}
              helperText={errors.search}
              autoFocus={false}
            />
            <FormControl margin="normal" fullWidth>
              <FormLabel>Show Travel Requests</FormLabel>
              <FormGroup>
                {allArchiveTypes.map(arcType => (
                  <Tooltip title={arcType.tooltip}>
                      <FormControlLabel
                        classes={{ label: classes.addMarginTop }}
                        color="primary"
                        key={"type_" + arcType.value}
                        control={
                          <Checkbox
                            checked={archiveTypes.indexOf(arcType.value) > -1 ? true : false}
                            value={arcType.value}
                            color="primary"
                            name="archiveTypes"
                            className={classes.noPaddingBottom}
                            onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                            tool
                          />
                        }
                        label={arcType.label}
                      />
                   </Tooltip>
                ))}
              </FormGroup>
            </FormControl>
            <FormControl margin="normal" fullWidth error={!isEmpty(errors.status) ? true : false}>
              <FormLabel>Status</FormLabel>
              <FormGroup>
                {allStatus.map(reqStatus => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"status_" + reqStatus.value}
                    control={
                      <Checkbox
                        checked={status.indexOf(reqStatus.value) > -1 ? true : false}
                        value={reqStatus.value}
                        color="primary"
                        name="status"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={reqStatus.label}
                  />

                ))}
              </FormGroup>
            </FormControl>
            {tab == 1 && (
              <FormControl margin="normal" fullWidth error={!isEmpty(errors.purposes) ? true : false}>
                <FormLabel>Purpose</FormLabel>
                <FormGroup>
                  {allPurposes.map(purpose => (
                    <FormControlLabel
                      classes={{ label: classes.addMarginTop }}
                      color="primary"
                      key={"status_" + purpose.value.toString()}
                      control={
                        <Checkbox
                          checked={purposes.indexOf(purpose.value.toString()) > -1 ? true : false}
                          value={purpose.value.toString()}
                          color="primary"
                          name="purposes"
                          className={classes.noPaddingBottom}
                          onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                        />
                      }
                      label={purpose.label}
                    />

                  ))}
                </FormGroup>
              </FormControl>
            )}
            {tab == 2 && (
              <FormControl margin="normal" fullWidth error={!isEmpty(errors.criticalities) ? true : false}>
                <FormLabel>Criticality</FormLabel>
                <FormGroup>
                  {allCriticalities.map(criticality => (
                    <FormControlLabel
                      classes={{ label: classes.addMarginTop }}
                      color="primary"
                      key={"status_" + criticality.value.toString()}
                      control={
                        <Checkbox
                          checked={criticalities.indexOf(criticality.value.toString()) > -1 ? true : false}
                          value={criticality.value.toString()}
                          color="primary"
                          name="criticalities"
                          className={classes.noPaddingBottom}
                          onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                        />
                      }
                      label={criticality.label}
                    />

                  ))}
                </FormGroup>
              </FormControl>
            )}
            <FormControl margin="normal" fullWidth error={!isEmpty(errors.purposes) ? true : false}>
              <FormLabel>Country Office</FormLabel>
              <FormGroup>
                {allImmapOffices.map(office => (
                  <FormControlLabel
                    classes={{ label: classes.addMarginTop }}
                    color="primary"
                    key={"status_" + office.value.toString()}
                    control={
                      <Checkbox
                        checked={offices.indexOf(office.value.toString()) > -1 ? true : false}
                        value={office.value.toString()}
                        color="primary"
                        name="offices"
                        className={classes.noPaddingBottom}
                        onChange={(e) => this.changeFilter(e.target.name, e.target.value, true)}
                      />
                    }
                    label={office.label}
                  />

                ))}
              </FormGroup>
            </FormControl>
            <FormLabel className={classes.period}>Travel Period</FormLabel>
            <DatePickerField
              label="From"
              name="traveled_from"
              value={
                isEmpty(traveled_from) ? (
                  null
                ) : (
                    moment(traveled_from)
                  )
              }
              onChange={(e) => this.changeFilter(e.target.name, isEmpty(e.target.value) ? null : moment(e.target.value).format('YYYY-MM-DD'), false, true)}
              error={errors.traveled_from}
              margin="dense"
              clearable={true}
            />
            <DatePickerField
              label="To"
              name="traveled_to"
              value={
                isEmpty(traveled_to) ? (
                  null
                ) : (
                    moment(traveled_to)
                  )
              }
              onChange={(e) => this.changeFilter(e.target.name, isEmpty(e.target.value) ? null : moment(e.target.value).format('YYYY-MM-DD'), false, true)}
              error={errors.traveled_to}
              margin="dense"
              clearable={true}
            />
             <FormLabel className={classes.period}>Submission Period</FormLabel>
            <DatePickerField
              label="From"
              name="submitted_from"
              value={
                isEmpty(submitted_from) ? (
                  null
                ) : (
                    moment(submitted_from)
                  )
              }
              onChange={(e) => this.changeFilter(e.target.name, isEmpty(e.target.value) ? null : moment(e.target.value).format('YYYY-MM-DD'), false, true)}
              error={errors.submitted_from}
              margin="dense"
              clearable={true}
            />
            <DatePickerField
              label="To"
              name="submitted_to"
              value={
                isEmpty(submitted_to) ? (
                  null
                ) : (
                    moment(submitted_to)
                  )
              }
              onChange={(e) => this.changeFilter(e.target.name, isEmpty(e.target.value) ? null : moment(e.target.value).format('YYYY-MM-DD'), false, true)}
              error={errors.submitted_to}
              margin="dense"
              clearable={true}
            />
          </div>
        </CardContent>
      </Card >
    )
  }
}

SecurityFilter.defaultProps = {
  filterMoble: false,
  allImmapOffices: [],
  allStatus: [],
  allCriticalities: [],
  allPurposes: []
}

SecurityFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  tab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  search: PropTypes.string,
  allStatus: PropTypes.array.isRequired,
  status: PropTypes.array,
  allPurposes: PropTypes.array.isRequired,
  purposes: PropTypes.array,
  allCriticalities: PropTypes.array.isRequired,
  criticalities: PropTypes.array,
  allImmapOffices: PropTypes.array.isRequired,
  offices: PropTypes.array,
  traveled_from: PropTypes.string,
  traveled_to: PropTypes.string,
  submitted_from: PropTypes.string,
  submitted_to: PropTypes.string,
  errors: PropTypes.object,
  getCriticalities: PropTypes.func.isRequired,
  getPurposes: PropTypes.func.isRequired,
  getP11ImmapOffices: PropTypes.func.isRequired,
  queryParams: PropTypes.string,
  paramOnChange: PropTypes.func.isRequired,
  filterArray: PropTypes.func.isRequired,
  filterOnChange: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  filterMobile: PropTypes.bool
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getCriticalities,
  getPurposes,
  getP11ImmapOffices,
  filterOnChange,
  paramOnChange,
  filterArray,
  resetFilter,
  onChange
}

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  tab: state.security.tab,
  search: state.securityFilter.search,
  allStatus: state.securityFilter.allStatus,
  status: state.securityFilter.status,
  allPurposes: state.securityFilter.allPurposes,
  purposes: state.securityFilter.purposes,
  allCriticalities: state.securityFilter.allCriticalities,
  criticalities: state.securityFilter.criticalities,
  allImmapOffices: state.options.p11ImmapOffices,
  offices: state.securityFilter.offices,
  traveled_from: state.securityFilter.traveled_from,
  traveled_to: state.securityFilter.traveled_to,
  submitted_from: state.securityFilter.submitted_from,
  submitted_to: state.securityFilter.submitted_to,
  errors: state.securityFilter.errors,
  allArchiveTypes: state.securityFilter.allArchiveTypes,
  archiveTypes: state.securityFilter.archiveTypes,
  queryParams: state.security.queryParams
})

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
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
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(SecurityFilter)))
