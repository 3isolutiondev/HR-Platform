import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactCountryFlag from 'react-country-flag';
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FlagIcon from '@material-ui/icons/Flag'
import SearchIcon from '@material-ui/icons/Search'
import SaveIcon from '@material-ui/icons/Save'
import MUIDataTable from 'mui-datatables'
import { lightText, primaryColor } from '../../../config/colors'
import { getAPI, postAPI } from '../../../redux/actions/apiActions'
import { addFlashMessage } from '../../../redux/actions/webActions'
import { borderColor, white } from '../../../config/colors'
import isEmpty from '../../../validations/common/isEmpty'

const flag = {
  width: '32px',
  height: '32px',
  backgroundSize: '44px 44px',
  borderRadius: '16px'
};

// Security Advisors Page accessed from Sidebar (navigation in the left),
// Contain list of country security advisors
class SecurityAdvisors extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      advisors: [],
      national_columns: [
        {
          name: 'id',
          options: {
            display: 'excluded',
            filter: false,
            sort: false
          }
        },
        {
          name: 'Name',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'Role',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'Assigned Countries',
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
      ],
      global_columns: [
        {
          name: 'id',
          options: {
            display: 'excluded',
            filter: false,
            sort: false
          }
        },
        {
          name: 'Name',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'Role',
          options: {
            filter: true,
            sort: true
          }
        }
      ],
      dialogOpen: false,
      name: "",
      apiURL: '/api/security-module/security-advisors/',
      loadingText: 'Loading Security Officers...',
      emptyDataText: 'Sorry, No security officer can be found',
      firstLoaded: false,
      isLoading: false,

      allCountries: [],
      shownCountries: [],
      selectedCountries: [],
      search: '',
      userId: '',
      assignCountriesLoading: false,
      getSelectedLoading: false,
      tabValue: 'national',

      toggleImmaperForm: false,
      iMMAPerName: '',
      iMMAPerId: ''
    };
    this.timer = null;

    this.getData = this.getData.bind(this)
    this.dataToArray = this.dataToArray.bind(this)
    this.openDialog = this.openDialog.bind(this)
    this.checkChange = this.checkChange.bind(this)
    this.searchCountry = this.searchCountry.bind(this)
    this.deleteCountry = this.deleteCountry.bind(this)
    this.assignCountries = this.assignCountries.bind(this)
    this.tabChange = this.tabChange.bind(this)
    this.openImmaperDialog = this.openImmaperDialog.bind(this)
    this.closeImmaperDialog = this.closeImmaperDialog.bind(this)
    this.assignCountriesToImmaper = this.assignCountriesToImmaper.bind(this)
  }

  componentDidMount() {
    // get all countries data
    this.props.getAPI('/api/security-module/countries')
      .then(res => this.setState({ allCountries: res.data.data, shownCountries: res.data.data }))

    // get national security officers list
    this.getData()
  }

  // call api
  getData() {
    this.props
      .getAPI(this.state.apiURL + this.state.tabValue)
      .then((res) => {
        this.dataToArray(res.data.data);
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'There is an error while processing the request'
        });
      });
  }

  // modified data to fill in datatable
  dataToArray(jsonData) {
    const { classes } = this.props;
    let dataInArray = jsonData.map((data) => {
      let dataTemp = [data.id, data.name, data.role];
      if (this.state.tabValue == "national" || this.state.tabValue == "immaper") {
        const assignedCountries = (
          <div>
            {data.officer_country.map((country, index) => (
              <Chip
                key={'chip-country-' + index}
                icon={null}
                label={country.name}
                className={classes.chip}
                avatar={
                  <ReactCountryFlag
                    code={country.country_code}
                    svg
                    styleProps={flag}
                  />
                }
              />
            ))}
          </div>
        )
        dataTemp.push(assignedCountries);

        const actions = (
          <div className={classes.actions} onClick={() => {
            if (this.state.tabValue == 'immaper') {
              this.openImmaperDialog(data.id, data.name)
            } else {
              this.openDialog(data.id)
            }

          }}>
            <Button variant="contained" size="small" color="primary">
              <FlagIcon /> Assign Countries
            </Button>
          </div >
        );

        dataTemp.push(actions);
      }


      return dataTemp;
    });

    this.setState({ advisors: dataInArray, firstLoaded: true });
  }

  // open assign county dialog
  openDialog(userId) {
    this.setState({ dialogOpen: this.state.dialogOpen ? false : true, userId, getSelectedLoading: true }, () => {
      if (this.state.dialogOpen === true) {
        this.props.getAPI('/api/security-module/security-advisors/national/user/' + this.state.userId + '/countries')
          .then(res => {
            this.setState({ getSelectedLoading: false, selectedCountries: res.data.data })
          })
          .catch(err => {
            this.setState({ getSelectedLoading: false })
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while retrieving user data'
            })
          })
      }
    });
  }

  // select / deselect county
  checkChange(e) {
    const clickedCountry = this.state.allCountries.find(country => country.value.toString() == e.target.value.toString())

    const isExist = this.state.selectedCountries.some(country => country.value.toString() == e.target.value.toString())

    const selectedCountries = isExist ? this.state.selectedCountries.filter(country => country.value.toString() !== e.target.value.toString()) : [...this.state.selectedCountries, clickedCountry]

    this.setState({ selectedCountries })

  }

  // search county
  searchCountry(e) {
    let shownCountries = this.state.allCountries.filter(country => country.label.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
    this.setState({ shownCountries, search: e.target.value })
  }

  // delete selected country from chip
  deleteCountry(value) {
    const selectedCountries = this.state.selectedCountries.filter(country => country.value.toString() !== value.toString())
    this.setState({ selectedCountries })
  }

  // open assign county to immaper dialog
  openImmaperDialog(iMMAPerId, iMMAPerName) {
    this.setState({ toggleImmaperForm: true, iMMAPerId, iMMAPerName, getSelectedLoading: true }, () => {
      if (this.state.toggleImmaperForm === true) {
        this.props.getAPI(`/api/security-module/security-advisors/immaper/user/${this.state.iMMAPerId}/countries`)
          .then(res => {
            this.setState({ getSelectedLoading: false, selectedCountries: res.data.data })
          })
          .catch(err => {
            this.setState({ getSelectedLoading: false })
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while retrieving user data'
            })
          })
      }
    });
  }

  // save country
  assignCountries() {
    this.setState({ assignCountriesLoading: true }, () => {
      this.props.postAPI('/api/security-module/security-advisors/national/assign-countries/user/' + this.state.userId, { selectedCountries: this.state.selectedCountries })
        .then(res => {
          this.setState({ assignCountriesLoading: false, dialogOpen: false }, this.getData())
          this.props.addFlashMessage({
            type: 'success',
            text: 'Successfully assigned country (ies) to the user'
          })
        })
        .catch(err => {
          this.setState({ assignCountriesLoading: false })
          this.props.addFlashMessage({
            type: 'error',
            text: 'There is an error while assigning country (ies)'
          })
        })
    })
  }

  // change tab
  tabChange(e, tabValue) {
    this.setState({
      loadingText: (tabValue == 'immaper') ? 'Loading Consultants...' : 'Loading Security Officers...',
      emptyDataText: (tabValue == 'immaper') ? 'Sorry, No Consultant can be found' : 'Sorry, No security officer can be found',
      tabValue
    }, () => this.getData());
  }

  // timer check then call immaper api
  timerCheck() {
    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      if (!isEmpty(this.state.keyword)) {
        await this.props.getAPI(`/api/security-module/security-advisors/get-view-only-immaper?keyword=${this.state.keyword}`)
        .then(res => {
          this.setState({ iMMAPers: res.data.data })
        })
        .catch(err => {
          this.setState({ iMMAPers: [] })
        })
      }
      this.setState({ immaperLoading: false })
    }, 500)
  }

  closeImmaperDialog() {
    this.setState({
      toggleImmaperForm: false,
      iMMAPerName: '',
      iMMAPerId: '',
      selectedCountries: []
    })
  }

  assignCountriesToImmaper()  {
    const { iMMAPerId, selectedCountries } = this.state
    this.setState({ assignCountriesLoading: true }, () => {
      this.props.postAPI(`/api/security-module/security-advisors/immaper/assign-countries/user/${iMMAPerId}`, { selectedCountries })
        .then(res => {
          const iMMAPerName = this.state.iMMAPerName;
          this.setState({ assignCountriesLoading: false, toggleImmaperForm: false, iMMAPerName: '', iMMAPerId: '', selectedCountries: [] }, this.getData())
          this.props.addFlashMessage({
            type: 'success',
            text: `Successfully assigned country (ies) to ${iMMAPerName}`
          })
        })
        .catch(err => {
          this.setState({ assignCountriesLoading: false })
          this.props.addFlashMessage({
            type: 'error',
            text: 'There is an error while assigning country (ies)'
          })
        })
    })
  }

  render() {
    const {
      advisors, national_columns, global_columns, loadingText, emptyDataText, firstLoaded, isLoading, dialogOpen,
      search, shownCountries, selectedCountries, assignCountriesLoading, getSelectedLoading, tabValue,
      toggleImmaperForm, iMMAPerName
    } = this.state
    const { classes } = this.props

    let options = {
      responsive: 'scroll',
      filterType: 'dropdown',
      download: false,
      print: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: (firstLoaded === false) ? loadingText : (isLoading) ? loadingText : emptyDataText
        }
      }
    }

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h4">Security Advisors</Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={tabValue}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Country Security Advisors" value="national" />
            <Tab label="Global Security Advisors" value="global" />
            <Tab label="Assign Country to Consultant" value="immaper" />
          </Tabs>
        </Grid>
        {tabValue == 'national' && (
          <Grid item xs={12}>
            <MUIDataTable
              title={'Country Security Advisors'}
              data={advisors}
              columns={national_columns}
              options={options}
              download={false}
              print={false}
            />
          </Grid>
        )}
        {tabValue == 'global' && (
          <Grid item xs={12}>
            <MUIDataTable
              title={'Global Security Advisors'}
              data={advisors}
              columns={global_columns}
              options={options}
              download={false}
              print={false}
            />
          </Grid>
        )}
        {tabValue == 'immaper' && (
          <Grid item xs={12}>
            <MUIDataTable
              title={'Assign Country to Consultant'}
              data={advisors}
              columns={national_columns}
              options={options}
              download={false}
              print={false}
            />
            <Typography style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.54)' }}>*notes: only for an Consultant who has 'View Other Travel Request' permission only</Typography>
          </Grid>
        )}
        {/* assign country dialog for country security advisor */}
        <Dialog open={dialogOpen} onClose={this.openDialog} fullWidth maxWidth="lg">
          <DialogTitle className={classes.header} >Assign Security Officer to Country</DialogTitle>
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  label="Search Country"
                  name="search"
                  value={search}
                  fullWidth
                  onChange={this.searchCountry}
                  margin="dense"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.searchCountry}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              {getSelectedLoading ? (
                <div>
                  <Typography color="primary" variant="subtitle1">Loading... <CircularProgress className={classes.redLoading} thickness={5} size={18} /></Typography>
                </div>
              ) : !isEmpty(shownCountries) ? shownCountries.map((country, index) => (
                <Grid item xs={12} sm={6} lg={3} xl={2} key={'shown-countries' + index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCountries.some(selected => selected.value === country.value)}
                        name="selectedCountries"
                        color="primary"
                        onChange={this.checkChange}
                        value={country.value.toString()}
                        className={classes.check}
                      />
                    }
                    label={country.label}
                  />
                </Grid>
              )) : (
                    <Typography>No Country</Typography>
                  )}

            </Grid>
          </DialogContent>
          {!isEmpty(selectedCountries) && (
            <div className={classes.selectedCountries}>
              <FormControl component="fieldset" className={classes.borderWithLegend}>
                <FormLabel component="legend" className={classes.legend}>Selected Countries</FormLabel>
                {!isEmpty(selectedCountries) && selectedCountries.map((country, index) => (
                  <Chip
                    key={'chip-c-' + index}
                    icon={null}
                    label={country.label}
                    onDelete={() => this.deleteCountry(country.value)}
                    className={classes.chip}
                    avatar={
                      <ReactCountryFlag
                        code={country.country_code}
                        svg
                        styleProps={flag}
                      />
                    }
                  />
                ))}
              </FormControl>
            </div>
          )}
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.assignCountries}>
              <SaveIcon style={{ marginRight: '4px' }} /> Save Countries
              {assignCountriesLoading && <CircularProgress className={classes.loading} thickness={5} size={22} />}
            </Button>
            <Button variant="contained" color="secondary" onClick={this.openDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* assign country to an immaper form */}
        <Dialog open={toggleImmaperForm} onClose={this.closeImmaperDialog} fullWidth maxWidth="lg">
          <DialogTitle className={classes.header} >Assign Country to {iMMAPerName}</DialogTitle>
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  label="Search Country"
                  name="search"
                  value={search}
                  fullWidth
                  onChange={this.searchCountry}
                  margin="dense"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.searchCountry}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              {getSelectedLoading ? (
                <div>
                  <Typography color="primary" variant="subtitle1">Loading... <CircularProgress className={classes.redLoading} thickness={5} size={18} /></Typography>
                </div>
              ) : !isEmpty(shownCountries) ? shownCountries.map((country, index) => (
                <Grid item xs={12} sm={6} lg={3} xl={2} key={'shown-countries' + index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCountries.some(selected => selected.value === country.value)}
                        name="selectedCountries"
                        color="primary"
                        onChange={this.checkChange}
                        value={country.value.toString()}
                        className={classes.check}
                      />
                    }
                    label={country.label}
                  />
                </Grid>
              )) : (
                    <Typography>No Country</Typography>
                  )}

            </Grid>
          </DialogContent>
          {!isEmpty(selectedCountries) && (
            <div className={classes.selectedCountries}>
              <FormControl component="fieldset" className={classes.borderWithLegend}>
                <FormLabel component="legend" className={classes.legend}>Selected Countries</FormLabel>
                {!isEmpty(selectedCountries) && selectedCountries.map((country, index) => (
                  <Chip
                    key={'chip-c-' + index}
                    icon={null}
                    label={country.label}
                    onDelete={() => this.deleteCountry(country.value)}
                    className={classes.chip}
                    avatar={
                      <ReactCountryFlag
                        code={country.country_code}
                        svg
                        styleProps={flag}
                      />
                    }
                  />
                ))}
              </FormControl>
            </div>
          )}
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.assignCountriesToImmaper}>
              <SaveIcon style={{ marginRight: '4px' }} /> Save Countries
              {assignCountriesLoading && <CircularProgress className={classes.loading} thickness={5} size={22} />}
            </Button>
            <Button variant="contained" color="secondary" onClick={this.closeImmaperDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  }
}

SecurityAdvisors.propTypes = {
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  exp: {
    color: lightText
  },
  check: {
    paddingTop: theme.spacing.unit / 4,
    paddingBottom: theme.spacing.unit / 4,
  },
  chip: {
    marginLeft: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit / 4,
    marginTop: theme.spacing.unit / 4,
    marginBottom: theme.spacing.unit / 4,
    width: 'fit-content',
    '&:first-child': {

    }
  },
  header: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: 0,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  },
  selectedCountries: {
    display: 'block'
  },
  borderWithLegend: {
    width: 'calc(100% - 18px)',
    border: '1px solid ' + borderColor,
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    display: 'block'
  },
  legend: {
    marginLeft: theme.spacing.unit
  },
  loading: {
    "margin-left": theme.spacing.unit,
    color: white,
  },
  redLoading: {
    "margin-left": theme.spacing.unit,
    color: primaryColor,
    verticalAlign: 'sub'
  },
})

export default withStyles(styles)(connect(null, mapDispatchToProps)(SecurityAdvisors))
