/** import React, Prop Types, and connect  */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/** import Material UI styles, Component(s) and Icon(s) */
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Save from "@material-ui/icons/Save";

/** import Redux actions and components needed on this component */
import { getAPI, postAPI } from "../../../redux/actions/apiActions";
import isEmpty from "../../../validations/common/isEmpty";
import { validate } from "../../../validations/thirdParty";
import { addFlashMessage } from "../../../redux/actions/webActions";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../config/general";
import { white } from "../../../config/colors";
import SelectField from '../../../common/formFields/SelectField';
import { getThirdPartyPermissions } from '../../../redux/actions/optionActions';


/**
 * ThirdPartyForm is a component to show Form of cretion Third part client
 *
 * @name ThirdPartyForm
 * @component
 * @category Third part client
 * @subcategory Third part client
 *
 */
class ThirdPartyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      permissions: [],
      errors: {},
      isEdit: false,
      apiURL: "/api/third-party/register",
      redirectURL: "/dashboard/third-party",
      showLoading: false
    };

    this.isValid = this.isValid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component will be mounted
  */
  componentWillMount() {
    if (typeof this.props.match.params.id !== "undefined") {
      this.setState({
        isEdit: true,
        apiURL: "/api/third-party/" + this.props.match.params.id
      });
    }
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
  */
  async componentDidMount() {
   await this.props.getThirdPartyPermissions();
    if (this.state.isEdit) {
      await this.props
          .getAPI(this.state.apiURL)
          .then(res => {
            const { id, username, third_party_permissions } = res.data.data;
            
            const permissions = third_party_permissions.map((permission)=> {
              return { 'label': permission.name, 'value': permission.name }
            })
  
            this.setState({ id, username, permissions });
          })
        .catch(err => {
          this.props.addFlashMessage({
            type: "error",
            text: "There is an error while requesting duration data"
          });
        });
    }
  }

  /**
   * isValid is a  function to validate data from state
  */
  isValid() {
    const { errors, isValid } = validate(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  }

  /**
   * onChange is a  function to chnage a value from state
  */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.isValid();
    });
  }

  /**
   * selectOnChange is a  function to chnage a value from state
  */
 selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid())
  }

  /**
   * onSubmit is a  function to handle the submission process
  */
  onSubmit(e) {
    e.preventDefault();

    const { username, password, permissions } = this.state;

    let thirdPartyData = {
      username,
      password,
      permissions
    };

    if (this.state.isEdit) {
      thirdPartyData._method = "PUT";
    }
    if (this.isValid()) {
      this.setState({ showLoading: true }, () => {
        this.props
          .postAPI(this.state.apiURL, thirdPartyData)
          .then(res => {
            this.setState({ showLoading: false }, () => {
              const { status, message } = res.data;
              this.props.history.push(this.state.redirectURL);
              this.props.addFlashMessage({
                type: status,
                text: message
              });
            });
          })
          .catch(err => {
            this.setState({ showLoading: false }, () => {
              this.props.addFlashMessage({
                type: "error",
                text: "There is an error while processing the request"
              });
            });
          });
      });
    }
  }

  render() {
    let { username, password, errors, isEdit, showLoading, permissions } = this.state;

    const { classes, third_party_permissions } = this.props;
   
    return (
      <form onSubmit={this.onSubmit}>
        <Helmet>
          <title>
            {isEdit
              ? APP_NAME + " - Dashboard > Edit Third Party : " + name
              : APP_NAME + " - Dashboard > Add Third Party"}
          </title>
          <meta
            name="description"
            content={
              isEdit
                ? APP_NAME + " Dashboard > Edit Third Party : " + name
                : APP_NAME + " Dashboard > Add Third Party"
            }
          />
        </Helmet>
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h5" component="h3">
                {isEdit && "Edit Third Party : " + name}
                {!isEdit && "Add Third Party"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="username"
                label="Client Name"
                margin="normal"
                required
                fullWidth
                name="username"
                value={username}
                onChange={this.onChange}
                error={!isEmpty(errors.username)}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Password"
                margin="normal"
                required={!isEdit}
                fullWidth
                type={"password"}
                name="password"
                value={password}
                onChange={this.onChange}
                error={!isEmpty(errors.password)}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectField
                label="Permissions *"
                options={third_party_permissions}
                value={permissions}
                onChange={this.selectOnChange}
                placeholder="Select at least one permission"
                isMulti={true}
                name="permissions"
                error={errors.permissions}
                required
                fullWidth={true}
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <Save /> Save{" "}
                {showLoading && (
                  <CircularProgress
                    thickness={5}
                    size={22}
                    className={classes.loading}
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    );
  }
}

ThirdPartyForm.propTypes = {
  getAPI: PropTypes.func.isRequired,
  postAPI: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
 const mapStateToProps = (state) => ({
	third_party_permissions: state.options.third_party_permissions || [],
});


/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  getThirdPartyPermissions
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
 const styles = theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  loading: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: white
  }
});

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(ThirdPartyForm));
