import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';
import Save from '@material-ui/icons/Save';
import Add from '@material-ui/icons/Add';
import Email from '@material-ui/icons/Email';
import MUIDataTable from 'mui-datatables';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { APP_NAME } from "../../../config/general";
import { white } from "../../../config/colors";
import isEmpty from '../../../validations/common/isEmpty';
import validator from 'validator';

const notifyColumns = [
  {
    name: "id",
    options: {
      display: "excluded",
      filter: false,
      sort: false,
    },
  },
  {
    name: "Country",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "Email List",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Action",
    options: {
      filter: false,
      sort: false,
    },
  },
];

class NotifyTravelSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      countries: [],
      formOpen: false,
      editId: '',
      editCountryName: '',
      email: '',
      selectedEmails: [],
      isLoading: false,
      errorEmail: ''
    }

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.dataToArray = this.dataToArray.bind(this);
    this.getData = this.getData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.email !== this.state.email) {
      if (isEmpty(this.state.email) && !isEmpty(this.state.errorEmail)) this.setState({ errorEmail: '' })
    }
  }

  getData() {
    this.props.getAPI('/api/security-module/notify-countries')
    .then(res => {
      this.dataToArray(res.data.data)
    })
    .catch(err => this.setState({ countries: [] }))
  }

  dataToArray(jsonData) {
    const { classes } = this.props;
    let dataInArray = jsonData.map((data, index) => {
      let dataTemp = [
        data.id,
        data.name,
        data.emails.toString(),
      ];

      const actions = (
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              this.openForm(data.id, data.name);
            }}
          >
            <Email fontSize="small" style={{ marginRight: 8 }}/> Manage Emails
          </Button>
        </div>
      );

      dataTemp.push(actions);

      return dataTemp;
    });

    this.setState({ countries: dataInArray });
  }

  openForm(countryId, countryName) {
    this.setState({ formOpen: true, editId: countryId, editCountryName: countryName }, () => {
      this.props.getAPI(`/api/security-module/notify-settings/${countryId}`)
      .then(res => {
        this.setState({ selectedEmails: res.data.data })
      })
      .catch(err => this.setState({ selectedEmails: [] }))
    });
  }

  closeForm(reloadData = false) {
    this.setState({ formOpen: false, editId: '', selectedEmails: [], editCountryName: '', email: '', errorEmail: '', isLoading: false }, () => {
      if (reloadData) this.getData();
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const { editId, editCountryName, selectedEmails } = this.state;
    this.setState({ isLoading: true }, () => {
      this.props.postAPI(`/api/security-module/notify-settings/${editId}/update`, {
        _method: "PUT", emails: selectedEmails
      })
      .then(res => {
        this.props.addFlashMessage({ type: 'success', text: `Notify emails for ${editCountryName} successfully update`})
        this.closeForm(true)
      })
      .catch(err => {
        this.props.addFlashMessage({ type: 'error', text: `There is an error while updating email notification for ${editCountryName}` })
        this.setState({ isLoading: false })
      })
    })
  }

  addEmail() {
    const { email, editId, selectedEmails } = this.state;
    if (isEmpty(email)) {
      this.setState({ errorEmail: 'Email is required' })
    } else if (!validator.isEmail(email)){
      this.setState({ errorEmail: 'Invalid email address' })
    } else {
      this.setState({ selectedEmails: [...selectedEmails, {email, country_id: editId}], email: '', errorEmail: '' })
    }
  }

  removeEmail(selectedEmail) {
    const selectedEmails = this.state.selectedEmails.filter(email => email.email !== selectedEmail)
    this.setState({ selectedEmails });
  }

  render() {
    const { formOpen, countries, email, isLoading, errorEmail, selectedEmails, editCountryName } = this.state;
    const { classes } = this.props;

    const options = {
      responsive: "scroll",
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 15, 100],
      filterType: "checkbox",
      download: false,
      print: false,
      selectableRows: "none"
    };

    return(
      <div>
        <Helmet>
          <title>{APP_NAME + " - Dashboard > Email Notification Setup for Travel Requests Based on Country"}</title>
          <meta
            name="description"
            content={APP_NAME + " Dashboard > Email Notification Setup for Travel Requests Based on Country"}
          />
        </Helmet>
        <MUIDataTable
          title={"Email Notification Setup for Travel Requests Based on Country"}
          data={countries}
          columns={notifyColumns}
          options={options}
          download={false}
          print={false}
        />
        <Dialog open={formOpen} fullWidth maxWidth="lg" onClose={this.closeForm}>
          <DialogTitle>Manage Email Addresses for {editCountryName}</DialogTitle>
          <DialogContent>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder="Put email"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button variant="contained" color="primary" className={classes.addEmailBtn} onClick={this.addEmail}>
                          <Add fontSize="small" style={{ marginRight: 4 }}/> Add Email
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  error={!isEmpty(errorEmail)}
                  helperText={errorEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Selected Emails</Typography>
                <Paper style={{ paddingTop: 4, paddingLeft: 4}}>
                  {!isEmpty(selectedEmails) ? selectedEmails.map((email, index) => (
                    <Chip
                      key={`sel-email-${index}`}
                      label={email.email}
                      color="primary"
                      style={{ marginRight: 4, marginBottom: 4 }}
                      onDelete={() => this.removeEmail(email.email)}
                    />
                  )) : (
                    <Typography variant="body1" style={{ marginLeft: 4, marginBottom: 4}}>No Selected Email for {editCountryName}</Typography>
                  )
                }
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeForm} color="secondary" variant="contained" size="medium">
              <Close fontSize="small" /> Close
            </Button>
            <Button type="submit" onClick={this.onSubmit} color="primary" variant="contained" size="medium">
              <Save fontSize="small" /> Save{' '}
              {isLoading && <CircularProgress thickness={5} size={22} className={classes.loading} />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

NotifyTravelSettings.propTypes = {
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
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
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	},
  addEmailBtn: { position: 'absolute', right: 0, bottom: theme.spacing.unit / 2, padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px` }
})

export default withStyles(styles)(connect('', mapDispatchToProps)(NotifyTravelSettings))
