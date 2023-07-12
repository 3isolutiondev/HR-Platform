import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import isEmpty from "../../../validations/common/isEmpty";
import { validatePublication } from "../../../validations/p11";
import { getAPI, postAPI, deleteAPI } from "../../../redux/actions/apiActions";
import { addFlashMessage } from "../../../redux/actions/webActions";
import { getYears } from "../../../redux/actions/optionActions";
import { profileLastUpdate } from "../../../redux/actions/profile/bioActions";
import moment from "moment";
import DropzoneFileField from "../../../common/formFields/DropzoneFileField";
import {
  publicationFileCollection,
  p11PublicationFileURL,
  p11DeletePublicationFileURL,
  acceptedDocImageFiles,
} from "../../../config/general";
import { white } from "../../../config/colors";

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

class PublicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      year: "",
      url: "",
      publication_file: {},
      errors: {},
      apiURL: "/api/p11-publications",
      isEdit: false,
      recordId: 0,
      showLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.getData = this.getData.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    if (isEmpty(this.props.years)) {
      this.props.getYears();
    }

    //reference event method from parent
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
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
  }

  selectOnChange(value, e) {
    this.setState({ [e.name]: value }, () => this.isValid());
  }

  isValid() {
    const { errors, isValid } = validatePublication(this.state);

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
          let { title, year, url, publication_file } = res.data.data;
          this.setState(
            {
              title,
              year: moment(year).format("YYYY"),
              url,
              publication_file: isEmpty(publication_file)
                ? {}
                : publication_file,
              isEdit: true,
              recordId: id,
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
      let uploadData = {
        title: this.state.title,
        year: this.state.year,
        url: this.state.url,
      };

      if (!isEmpty(this.state.publication_file)) {
        uploadData.publication_file_id = this.state.publication_file.file_id;
      }

      let recId = "";

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
                text: "Your publication has been saved",
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
                text: "Error",
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
        year: "",
        recordId: 0,
        isEdit: false,
        url: "",
        publication_file: {},
        apiURL: "/api/p11-publications",
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
      year: "",
      recordId: 0,
      isEdit: false,
      url: "",
      publication_file: {},
      apiURL: "/api/p11-publications",
      showLoading: false,
    });
  }

  handleRemove() {
    this.props.handleRemove();
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
      // await this.props.onChangeForm8([ name ], {});
      this.setState({ [name]: {} }, () => {
        this.isValid();
        this.props
          .deleteAPI(deleteURL)
          .then((res) => {
            this.props.addFlashMessage({
              type: "success",
              text: "Your file succesfully deleted",
            });
          })
          .catch((err) => {
            this.props.addFlashMessage({
              type: "error",
              text: "There is an error while deleting Your file",
            });
          });
      });
    } else {
      // await this.props.onChangeForm8([ name ], files);
      this.setState({ [name]: files }, () => this.isValid());
    }
  }

  render() {
    let { isOpen, classes, years, remove } = this.props;
    let {
      title,
      year,
      url,
      publication_file,
      errors,
      showLoading,
    } = this.state;

    return (
      <Dialog
        open={isOpen}
        fullWidth
        maxWidth="lg"
        onClose={this.handleClose}
        // PaperProps={{ style: { overflow: 'visible' } }}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={9}>
              <TextField
                required
                id="title"
                name="title"
                label="Publication Title"
                fullWidth
                value={title}
                autoComplete="title"
                onChange={this.onChange}
                error={!isEmpty(errors.title)}
                helperText={errors.title}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                id="year"
                name="year"
                select
                label="Year"
                value={year}
                onChange={this.onChange}
                error={!isEmpty(errors.year)}
                helperText={errors.year}
                margin="none"
                fullWidth
              >
                {years.map((year1, index) => (
                  <MenuItem key={index} value={year1}>
                    {year1}
                  </MenuItem>
                ))}
              </TextField>
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
                name="publication_file"
                label="Upload your document (if any)"
                onUpload={this.onUpload}
                onDelete={this.onDelete}
                collectionName={publicationFileCollection}
                apiURL={p11PublicationFileURL}
                deleteAPIURL={p11DeletePublicationFileURL}
                isUpdate={false}
                filesLimit={1}
                acceptedFiles={acceptedDocImageFiles}
                gallery_files={
                  !isEmpty(publication_file) ? [publication_file] : []
                }
                error={errors.publication_file}
                fullWidth={false}
              />
            </Grid>
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

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  deleteAPI,
  addFlashMessage,
  getYears,
  profileLastUpdate,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  years: state.options.years,
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublicationForm)
);
