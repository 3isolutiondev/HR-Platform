import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import classname from 'classnames'
import MUIDataTable from 'mui-datatables'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import Edit from "@material-ui/icons/Edit"
import Delete from "@material-ui/icons/Delete"
import Alert from '../../../common/Alert'
import CircleBtn from '../../../common/CircleBtn'
import YesNoField from '../../../common/formFields/YesNoField'
import isEmpty from '../../../validations/common/isEmpty'
import { addFlashMessage } from '../../../redux/actions/webActions'
import { lightGrey, primaryColor, white, red, secondaryColor, purple } from '../../../config/colors'
import { Helmet } from "react-helmet"
import { APP_NAME } from "../../../config/general"

class RiskLocationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      is_high_risk: '0',
      cities: [],
      highRiskError: '',
      city: '',
      cityError: '',
      city_is_high_risk: '1',
      cityHighRiskError: '',
      addCityLoading: false,
      columns: [
        {
          name: "id",
          options: {
            display: "excluded",
            filter: false,
            sort: false,
          },
        },
        {
          name: "City",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "Action",
          options: {
            filter: false,
            sort: false,
          }
        }
      ],
      options: {
        responsive: "scroll",
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 15, 100],
        filterType: "checkbox",
        download: false,
        print: false,
        selectableRows: "none"
      },
      deleteId: '',
      deleteOpen: false,
      deleteName: '',
      editId: '',
      editIsHighRisk: '1',
      editCityHighRiskError: '',
      editOpen: false,
      editCity: '',
      editCityError: '',
      editCityLoading: false
    }

    this.getData = this.getData.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onAddCity = this.onAddCity.bind(this)
    this.isValid = this.isValid.bind(this)
    this.highRiskOnChange = this.highRiskOnChange.bind(this)
    this.editDialog = this.editDialog.bind(this)
    this.saveCity = this.saveCity.bind(this)
    this.deleteCity = this.deleteCity.bind(this)
  }

  componentDidMount() {
    if (this.props.match.params.countryid !== 'undefined') {
      this.getData()
    }
  }

  getData() {
    axios.get('/api/security-module/countries/' + this.props.match.params.countryid)
    .then(res => {
      const { classes } = this.props
      let cities = res.data.data.high_risk_cities.map((city) => {
        let dataTemp = [ city.id, city.city ];
        const actions = (
          <div className={classes.actions}>
            <CircleBtn
              color={classes.purple}
              size="small"
              icon={<Edit />}
              onClick={() => {
                this.setState({
                  editId: city.id,
                  editCity: city.city,
                  editIsHighRisk: city.is_high_risk,
                  editOpen: true,
                });
              }}
            />
            <CircleBtn
              color={classes.red}
              size="small"
              icon={<Delete />}
              onClick={() => {
                this.setState({
                  deleteId: city.id,
                  deleteName: city.city,
                  deleteOpen: true,
                });
              }}
            />
          </div>
        );

        dataTemp.push(actions);

        return dataTemp;
      });
      this.setState({ name: res.data.data.name, is_high_risk: res.data.data.is_high_risk, cities })
    })
    .catch(err => {
      this.props.addFlashMessage({ type: 'error', text: 'There is an error while retrieving risk location data' })
    })
  }

  isValid(isEdit = false) {
    let errors = {}

    if (!isEdit) {
      if (isEmpty(this.state.city)) {
        errors.cityError = 'City is required'
      } else if (isEmpty(this.state.city_is_high_risk)) {
        errors.cityHighRiskError = 'High risk city is required'
      } else if (this.state.city_is_high_risk.toString() !== '1' && this.state.city_is_high_risk.toString() !== '0') {
        errors.cityHighRiskError = 'Invalid high risk city data'
      }

      if (!isEmpty(errors)) {
        this.setState({
          cityError: isEmpty(errors.cityError) ? '' : errors.cityError,
          cityHighRiskError: isEmpty(errors.cityHighRiskError) ? '' : errors.cityHighRiskError,
        })

        return false;
      }

      this.setState({ cityError: '', cityHighRiskError: '' })
    } else {
      if (isEmpty(this.state.editCity)) {
        errors.editCityError = 'City is required'
      } else if (isEmpty(this.state.editIsHighRisk)) {
        errors.editCityHighRiskError = 'High risk city is required'
      } else if (this.state.editIsHighRisk.toString() !== '1' && this.state.editIsHighRisk.toString() !== '0') {
        errors.editCityHighRiskError = 'Invalid high risk city data'
      }

      if (!isEmpty(errors)) {
        this.setState({
          editCityError: isEmpty(errors.editCityError) ? '' : errors.editCityError,
          editCityHighRiskError: isEmpty(errors.editCityHighRiskError) ? '' : errors.editCityHighRiskError,
        })

        return false;
      }

      this.setState({ editCityError: '', editCityHighRiskError: '' })
    }

    return true;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {this.state.editOpen ? this.isValid(true) : this.isValid()})
  }

  onAddCity(e) {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ addCityLoading: true }, () => {
        axios.post('/api/security-module/risk-location/add', { city: this.state.city, is_high_risk: this.state.city_is_high_risk, country_id: this.props.match.params.countryid })
        .then(res => {
          this.setState({ city: '', cityError: '', addCityLoading: false }, () => {
            this.getData()
            this.props.addFlashMessage({
              type: 'success',
              text: 'Successfully saved city data'
            })
          })
        })
        .catch(err => {
          this.setState({ addCityLoading: false }, () => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while saving city data'
            })
          })
        })
      })
    } else {
      this.props.addFlashMessage({ type: 'error', text: 'Please check city form' })
    }
  }

  highRiskOnChange(value) {
    if (isEmpty(value)) {
      this.setState({ highRiskError: 'Is the whole country high risk? is required' })
    } else if (value.toString() !== '1' && value.toString() !== '0') {
      this.setState({ highRiskError: 'Invalid is the whole country high risk? data' })
    } else {
      axios.post('/api/security-module/countries/set-high-risk', { country_id: this.props.match.params.countryid, is_high_risk: value })
      .then(res => {
        this.setState({ highRiskError: '', is_high_risk: value }, () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Successfully saved risk location data'
          })
        })
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'There is an error while saving risk location data'
        })
      })
    }
  }

  editDialog() {
    this.setState({ editOpen: this.state.editOpen ? false : true })
  }

  saveCity() {
    if (this.isValid(true)) {
      this.setState({ editCityLoading: true }, () => {
        axios.post('/api/security-module/risk-location/edit/' + this.state.editId, {
          _method: "PUT", city: this.state.editCity, is_high_risk: this.state.editIsHighRisk, country_id: this.props.match.params.countryid
        })
        .then(res => {
          this.setState({ editId: '', editCity: '', editIsHighRisk: '1', editCityLoading: false, editOpen: false }, () => {
            this.getData()
            this.props.addFlashMessage({
              type: 'success',
              text: 'Successfully saved city data'
            })
          })
        })
        .catch(err => {
          this.setState({ editCityLoading: false }, () => {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while saving city data'
            })
          })
        })
      })
    } else {
      this.props.addFlashMessage({ type: 'error', text: 'Please check edit form' })
    }
  }

  deleteCity() {
    axios.delete('/api/security-module/risk-location/delete/' + this.state.deleteId)
    .then(res => {
      const { status, message } = res.data;
      this.props.addFlashMessage({
        type: status,
        text: message,
      });
      this.setState({ deleteId: '', deleteOpen: false, deleteName: '' }, () =>
        this.getData()
      );
    })
    .catch(err => {
      this.props.addFlashMessage({
        type: "error",
        text: "There is an error while processing the delete request",
      });
    })
  }

  render() {
    const { name, is_high_risk, highRiskError, cities, city, cityError, city_is_high_risk, cityHighRiskError, columns, options,
      editIsHighRisk, editCity, editOpen, editCityError, editCityHighRiskError, deleteName, deleteOpen,
      addCityLoading, editCityLoading
    } = this.state
    const { classes } = this.props
    return(
      <form
        onSubmit={this.onAddCity}
      >
        <Helmet>
          <title>
            {APP_NAME + ' - Dashboard > Risk Location Setup'}
          </title>
          <meta
            name="description"
            content={APP_NAME + ' Dashboard > Risk Location Setup'}
          />
        </Helmet>
        <Paper className={classes.paper}>
          <Grid container spacing={16} alignItems="flex-end">
            <Grid item xs={12}>
              <Typography variant="h5" component="h3">
                {'Risk Location Setup : ' + name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Country"
                margin="normal"
                fullWidth
                name="name"
                value={name}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <YesNoField
								ariaLabel="Is the whole country high risk?"
								label="Is the whole country high risk?"
								value={is_high_risk.toString()}
								onChange={(e, value) => this.highRiskOnChange(value)}
								name="is_high_risk"
								error={highRiskError}
								margin="none"
							/>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="secondary">High Risk Cities</Typography>
              <div className={classes.border}>
                <Grid container spacing={16} alignItems="flex-end">
                  <Grid item xs={12} sm={4} lg={6}>
                    <TextField
                      id="city"
                      label="City"
                      autoComplete="city"
                      margin="normal"
                      required
                      fullWidth
                      name="city"
                      value={city}
                      onChange={this.onChange}
                      error={!isEmpty(cityError)}
                      helperText={cityError}
                      className={classname(classes.noMarginBottom, classes.noMarginTop)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
                    <div className={classes.cityHighRisk}>
                      <YesNoField
                        ariaLabel="Is this city high risk?"
                        label="Is this city high risk?"
                        value={city_is_high_risk.toString()}
                        onChange={(e, value) => this.onChange({ target: { name: e.target.name, value }})}
                        name="city_is_high_risk"
                        error={cityHighRiskError}
                        margin="none"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
                    <Button variant="contained" color="primary" type="submit" fullWidth><AddIcon/> Add City {addCityLoading && <CircularProgress className={classes.loading} thickness={5} size={22}/>}</Button>
                  </Grid>
                  {!isEmpty(cities) && (
                    <Grid item xs={12}>
                      <hr className={classes.line}/>
                      <MUIDataTable
                        title={"Cities"}
                        data={cities}
                        columns={columns}
                        options={options}
                        download={false}
                        print={false}
                      />
                    </Grid>
                  )}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Dialog open={editOpen} onClose={this.editDialog} fullWidth maxWidth="lg">
          <DialogTitle>Edit City</DialogTitle>
          <DialogContent>
            <Grid container spacing={16} alignItems="flex-end">
              <Grid item xs={12} sm={8} md={9}>
                <TextField
                  id="editCity"
                  label="City"
                  autoComplete="editCity"
                  margin="normal"
                  required
                  fullWidth
                  name="editCity"
                  value={editCity}
                  onChange={this.onChange}
                  error={!isEmpty(editCityError)}
                  helperText={editCityError}
                  className={classname(classes.noMarginBottom, classes.noMarginTop)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <div className={classes.cityHighRisk}>
                  <YesNoField
                    ariaLabel="Is this city high risk?"
                    label="Is this city high risk?"
                    value={editIsHighRisk.toString()}
                    onChange={(e, value) => this.onChange({ target: { name: e.target.name, value }})}
                    name="editIsHighRisk"
                    error={editCityHighRiskError}
                    margin="none"
                  />
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={this.editDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={this.saveCity}>
              <SaveIcon style={{ marginRight: '4px' }} /> Save City
              {editCityLoading && <CircularProgress className={classes.loading} thickness={5} size={22} />}
            </Button>
          </DialogActions>
        </Dialog>
        <Alert
          isOpen={deleteOpen}
          onClose={() => {
            this.setState({ deleteOpen: false });
          }}
          onAgree={() => {
            this.deleteCity();
          }}
          title="Delete Warning"
          text={"Are you sure to delete this city : " + deleteName + " ?"}
          closeText="Cancel"
          AgreeText="Yes"
        />
      </form>
    )
  }
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  addFlashMessage
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  noMarginBottom: { marginBottom: 0 },
  noMarginTop: { marginTop: 0 },
  border: { border: '1px solid ' + lightGrey, padding: theme.spacing.unit * 2 },
  cityHighRisk: { marginBottom: theme.spacing.unit * -1},
  line: { borderColor: primaryColor, marginTop: theme.spacing.unit * 2, marginBottom: theme.spacing.unit * 3 },
  actions: { width: 144 },
  red: {
    "background-color": red,
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
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}
})

export default withStyles(styles)(connect('', mapDispatchToProps)(RiskLocationForm))
