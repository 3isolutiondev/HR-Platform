import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
// import AutocompleteTagsField from '../../../common/formFields/AutocompleteTagsField';
// import SelectField from '../../../common/formFields/SelectField';
import isEmpty from "../../../validations/common/isEmpty";
import { validatePortfolio } from "../../../validations/p11";
import { getAPI, postAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import { getApprovedSectors } from "../../../redux/actions/optionActions";
import { profileLastUpdate } from "../../../redux/actions/profile/bioActions";
// import { pluck } from '../../../utils/helper';
import {
  p11PortfolioFileURL,
  p11DeletePortfolioFileURL,
  portfolioFileCollection,
  acceptedDocImageFiles,
} from "../../../config/general";
import { white } from "../../../config/colors";
import DropzoneFileField from "../../../common/formFields/DropzoneFileField";
// import SkillPicker from "../../../common/formFields/SkillPicker";
// import SectorPicker from "../../../common/formFields/SectorPicker";

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  capitalize: {
    textTransform: "capitalize",
  },
  overflowVisible: {
    overflow: "visible",
  },
  responsiveImage: {
    "max-width": "200px",
    width: "100%",
  },
  addMarginRight: {
    marginRight: "4px",
  },
  removeButton: {
    position: "absolute",
    left: "10px",
    bottom: "10px",
  },
  loading: {
    "margin-left": theme.spacing.unit,
    "margin-right": theme.spacing.unit,
    color: white,
  },
});

class PortfolioForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      attachment_file: "",
      url: "",
      //   skills: [],
      //   sectors: [],
      errors: {},
      apiURL: "/api/p11-portfolios",
      isEdit: false,
      recordId: 0,
      showLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.selectedFile = this.selectedFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getData = this.getData.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    this.props.getApprovedSectors();
    // if (isEmpty(this.props.allSectors)) {
    // 	this.props.getSectors();
    // }

    //reference event method from parent
    this.props.onRef(this);

    // this.props.getAPI('/api/skills/skills-for-matching/').then((res) => {
    //   let skills = res.data.data.map((res) => {
    //     return { value: res.id, label: res.skill };
    //   });

    //   this.setState({ allSkills: skills });
    // });
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
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid());
  }

  isValid() {
    const { errors, isValid } = validatePortfolio(this.state);

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
          let {
            title,
            description,
            attachment_file,
            url,
            // skills,
            // sectors,
          } = res.data.data;

          this.setState(
            {
              title,
              description,
              attachment_file,
              url,
              isEdit: true,
              recordId: id,
              //   sectors,
              //   skills,
            },
            () => this.isValid()
          );
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
      const {
        title,
        description,
        url,
        attachment_file,
        // skills,
        // sectors,
      } = this.state;
      let recId = "";

      let uploadData = {
        title,
        description,
        url,
        // skills,
      };

      //   if (!isEmpty(sectors)) {
      //     // uploadData.sectors = JSON.stringify(pluck(sectors, 'value'));
      //     uploadData.sectors = this.state.sectors;
      //   }

      if (!isEmpty(attachment_file)) {
        uploadData.attachment_id = attachment_file.file_id;
      }

      if (this.state.isEdit) {
        uploadData._method = "PUT";
        recId = "/" + this.state.recordId;
      }

      this.setState({ showLoading: true }, () => {
        this.props
          .postAPI(this.state.apiURL + recId, uploadData)
          .then((res) => {
            this.setState({ showLoading: false }, () => {
              this.props.updateList();
              this.props.addFlashMessage({
                type: "success",
                text: "Your portfolio has been saved",
              });
              this.props.getP11();
              if (this.props.getProfileLastUpdate) {
                this.props.profileLastUpdate();
              }
              this.handleClose();
            });
          })
          .catch((err) => {
            this.setState({ showLoading: false }, () => {
              this.props.addFlashMessage({
                type: "error",
                text: "There is an error while saving your data",
              });
            });
          });
      });
    }
  }

  handleClose() {
    this.setState(
      {
        title: "",
        description: "",
        attachment_file: "",
        url: "",
        // skills: [],
        // sectors: [],
        recordId: 0,
        isEdit: false,
        apiURL: "/api/p11-portfolios",
        errors: {},
        showLoading: false,
      },
      () => {
        this.props.onClose();
      }
    );
  }

  clearState() {
    this.setState({
      title: "",
      description: "",
      attachment_file: "",
      url: "",
      //   skills: [],
      //   sectors: [],
      recordId: 0,
      isEdit: false,
      apiURL: "/api/p11-portfolios",
      errors: {},
      showLoading: false,
    });
  }

  handleRemove() {
    this.props.handleRemove();
  }

  selectedFile(e) {
    this.setState({ attachment_file: e.target.files[0] }, () => this.isValid());
  }

  onUpload(name, files) {
    if (!isEmpty(files)) {
      const { file_id, file_url, mime, filename } = files[0];
      this.setState({ [name]: { file_id, file_url, mime, filename } }, () => {
        this.isValid();
        this.props.addFlashMessage({
          type: "success",
          text: "Your file succesfully uploaded",
        });
      });
    } else {
      this.setState({ [name]: {} }, () => this.isValid());
    }
  }

  onDelete(name, deleteURL, files, deletedFileId) {
    if (isEmpty(files)) {
      this.props
        .postAPI(deleteURL, {
          id: deletedFileId,
          portfolio_id: !isEmpty(this.props.recordId)
            ? this.props.recordId
            : null,
        })
        .then((res) => {
          this.props.addFlashMessage({
            type: "success",
            text: res.data.data.message
              ? res.data.data.message
              : "Your file succesfully deleted",
          });
          this.setState({ [name]: {} }, () => this.isValid());
        })
        .catch((err) => {
          this.props.addFlashMessage({
            type: "error",
            text: "There is an error while deleting Your file",
          });
        });
    } else {
      this.setState({ [name]: files }, () => this.isValid());
    }
  }

  render() {
    let {
      isOpen,
      classes,
      remove,
      // allSectors
    } = this.props;
    let {
      title,
      description,
      url,
      //   skills,
      //   sectors,
      errors,
      attachment_file,
      showLoading,
    } = this.state;

    return (
      <Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.handleClose}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <TextField
                required
                id="title"
                name="title"
                label="Portfolio Title"
                fullWidth
                value={title}
                autoComplete="title"
                onChange={this.onChange}
                error={!isEmpty(errors.title)}
                helperText={errors.title}
                autoFocus
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="description"
                name="description"
                label="Description"
                value={description}
                autoComplete="description"
                onChange={this.onChange}
                error={!isEmpty(errors.description)}
                helperText={errors.description}
                margin="none"
                fullWidth
                multiline
                rows="5"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="url"
                name="url"
                label="Website URL (if any)"
                fullWidth
                value={url}
                autoComplete="url"
                onChange={this.onChange}
                error={!isEmpty(errors.url)}
                helperText={errors.url}
                autoFocus
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <DropzoneFileField
                name="attachment_file"
                label="File (if any)"
                onUpload={this.onUpload}
                onDelete={this.onDelete}
                collectionName={portfolioFileCollection}
                apiURL={p11PortfolioFileURL}
                deleteAPIURL={p11DeletePortfolioFileURL}
                isUpdate={false}
                filesLimit={1}
                acceptedFiles={acceptedDocImageFiles}
                gallery_files={
                  !isEmpty(attachment_file) ? [attachment_file] : []
                }
                error={errors.attachment_file}
                fullWidth={false}
              />
            </Grid>
            {/* <Grid item xs={12}>
							<SkillPicker
								name="skills"
								skills={skills}
								onChange={this.selectOnChange}
								errors={errors.skills}
							/>
						</Grid>
						<Grid item xs={12}>
							<SectorPicker
								name="sectors"
								sectors={sectors}
								onChange={this.selectOnChange}
								errors={errors.sectors}
							/>
						</Grid> */}
            {/* <Grid item xs={12}>
							<AutocompleteTagsField
								label="Skills *"
								name="skills"
								value={skills}
								suggestionURL="/api/skills/suggestions"
								onChange={(name, value) => this.autoCompleteOnChange(name, value, () => this.isValid())}
								error={errors.skills}
								labelField="skill"
							/>
						</Grid>
            <Grid item xs={12}>
              <AutoCompleteSingleValue
                options={allSkills}
                value={skills}
                suggestionURL="/api/skills/suggestions"
                name="skills"
                label="skill"
                placeholder="Add or Search Skill"
                onChange={(e, val) => this.selectOnChange(val, e)}
              />
            </Grid> */}
            {/* <Grid item xs={12}>
							<SelectField
								label="Sector *"
								options={allSectors}
								value={sectors}
								onChange={this.selectOnChange}
								placeholder="Select sectors"
								isMulti={false}
								name="sectors"
								error={errors.sectors}
								required
								isMulti={true}
								fullWidth={true}
								margin="none"
							/>
						</Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          {remove ? (
            <Button
              onClick={this.handleRemove}
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
            Save{" "}
            {showLoading && (
              <CircularProgress
                className={classes.loading}
                size={22}
                thickness={5}
              />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

PortfolioForm.defaultProps = {
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
  getApprovedSectors,
  profileLastUpdate,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  // allSectors: state.options.sectors
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PortfolioForm)
);
