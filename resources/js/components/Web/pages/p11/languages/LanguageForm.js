import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import TextField from '@material-ui/core/TextField'
// import MenuItem from '@material-ui/core/MenuItem'
import SelectField from "../../../common/formFields/SelectField";
import YesNoField from "../../../common/formFields/YesNoField";
import isEmpty from "../../../validations/common/isEmpty";
import { validateLanguage } from "../../../validations/p11";
import { getAPI, postAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import { getLanguageLevels } from "../../../redux/actions/optionActions";
import { profileLastUpdate } from "../../../redux/actions/profile/bioActions";

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  capitalize: {
    textTransform: "capitalize",
  },
  overflowVisible: {
    overflow: "visible",
  },
  removeButton: {
    position: "absolute",
    left: "10px",
    bottom: "10px",
  },
});

class LanguageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "",
      other_language: "",
      language_level: "",
      is_mother_tongue: 1,
      errors: {},
      apiURL: "/api/p11-languages",
      isEdit: false,
      recordId: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.getData = this.getData.bind(this);
    this.clearState = this.clearState.bind(this);
  }
  componentDidMount() {
    this.props.getLanguageLevels();
    // this.isValid();
    this.props.onRef(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEmpty(this.props.recordId)) {
      if (
        this.props.recordId !== "" &&
        this.props.recordId !== prevProps.recordId
      ) {
        this.getData(this.props.recordId);
      }
    }

    const currentLanguageLevels = JSON.stringify(this.props.language_levels);
    const oldLanguageLevels = JSON.stringify(prevProps.language_levels);

    if (currentLanguageLevels !== oldLanguageLevels) {
      this.props.getLanguageLevels();
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid());
  }

  isValid() {
    const { errors, isValid } = validateLanguage(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      this.setState({ errors: {} });
    }

    return isValid;
  }

  getData(id) {
    if (!isEmpty(id)) {
      this.props
        .getAPI(this.state.apiURL + "/" + id)
        .then((res) => {
          let { language, language_level, is_mother_tongue } = res.data.data;
          this.setState({
            language: { value: language.id, label: language.name },
            language_level: !isEmpty(language_level)
              ? { value: language_level.id, label: language_level.name }
              : "",
            is_mother_tongue,
            isEdit: true,
            recordId: id,
          });
        })
        .catch((err) => {
          this.props.addFlashMessage({
            type: "error",
            text: "There is an error while processing the request",
          });
        });
    }
  }

  handleSave() {
    if (this.isValid()) {
      let uploadData = {
        language: this.state.language,
        language_level: this.state.language_level,
        is_mother_tongue: this.state.is_mother_tongue,
      };

      let recId = "";

      if (this.state.isEdit) {
        uploadData._method = "PUT";
        recId = "/" + this.state.recordId;
      }

      this.props
        .postAPI(this.state.apiURL + recId, uploadData)
        .then((res) => {
          this.props.updateList();
          this.props.addFlashMessage({
            type: "success",
            text: "Your language has been saved",
          });
          this.props.getP11();
          if (this.props.getProfileLastUpdate) {
            this.props.profileLastUpdate();
          }
          this.handleClose();
        })
        .catch((err) => {
          if (!isEmpty(err.response)) {
            if (!isEmpty(err.response.data)) {
              this.props.addFlashMessage({
                type: err.response.data.status
                  ? err.response.data.status
                  : "error",
                text: err.response.data.message
                  ? err.response.data.message
                  : "Error",
              });
            } else {
              this.props.addFlashMessage({
                type: "error",
                text: "Error",
              });
            }
          } else {
            this.props.addFlashMessage({
              type: "error",
              text: "Error",
            });
          }
        });
    }
  }

  handleClose() {
    this.setState(
      {
        language: "",
        language_level: "",
        is_mother_tongue: 1,
        recordId: 0,
        isEdit: false,
        apiURL: "/api/p11-languages",
      },
      () => {
        this.props.onClose();
      }
    );
  }

  clearState() {
    this.setState({
      language: "",
      language_level: "",
      is_mother_tongue: 1,
      recordId: 0,
      isEdit: false,
      apiURL: "/api/p11-languages",
    });
  }

  render() {
    let {
      isOpen,
      title,
      classes,
      languages,
      remove,
      handleRemove,
      p11Languages,
      language_levels,
    } = this.props;
    let {
      language,
      language_level,
      is_mother_tongue,
      errors,
      languageSkill,
    } = this.state;

    const p11Langs = p11Languages.map(function(lang) {
      if (isEmpty(lang[1])) {
        return lang.language.name;
      }
      return lang[1];
    });
    let availLanguages = isEmpty(p11Languages)
      ? languages
      : languages.filter((language) => {
          return !p11Langs.includes(language.label);
        });

    return (
      <Dialog
        open={isOpen}
        fullWidth
        onClose={this.handleClose}
        // PaperProps={{ style: { overflow: 'visible' } }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent className={classes.overflowVisible}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <SelectField
                label="Language *"
                options={availLanguages}
                value={language}
                onChange={this.selectOnChange}
                placeholder="Select language"
                isMulti={false}
                name="language"
                error={errors.language}
                required
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectField
                label="Proficiency"
                options={language_levels}
                value={language_level}
                onChange={this.selectOnChange}
                placeholder="Select proficiency"
                isMulti={false}
                name="language_level"
                error={errors.language_level}
                required
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12}>
              <YesNoField
                ariaLabel="Is this your native language?"
                label="Is this your native language?"
                value={is_mother_tongue.toString()}
                onChange={this.onChange}
                name="is_mother_tongue"
                error={errors.is_mother_tongue}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {remove ? (
            <Button
              onClick={this.props.handleRemove}
              color="primary"
              className={classes.removeButton}
              justify="space-between"
            >
              Remove
            </Button>
          ) : null}

          <Button
            onClick={this.handleClose}
            color="secondary"
            variant="contained"
          >
            Close
          </Button>
          <Button onClick={this.handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

LanguageForm.defaultProps = {
  getProfileLastUpdate: false,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  getLanguageLevels,
  profileLastUpdate,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  language_levels: state.options.language_levels,
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LanguageForm)
);
