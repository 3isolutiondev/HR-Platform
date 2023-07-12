/** import React and PropTypes */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import CameraAlt from '@material-ui/icons/CameraAlt';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

/** import custom components */
import Modal from '../../../common/Modal';
import SelectField from '../../../common/formFields/SelectField';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { onChangeBio, onChangeBioPresentNationality } from '../../../redux/actions/profile/bioActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getNationalities } from '../../../redux/actions/optionActions';
import { postAPI } from '../../../redux/actions/apiActions';
import { getBio } from '../../../redux/actions/profile/bioActions';
import { checkError } from '../../../redux/actions/webActions';
import { setLoading } from '../../../redux/actions/p11Actions';

/** import configuration value and validation helper */
import { p11UpdatePhotoURL, photoCollectionName } from '../../../config/general';
import { genderData } from '../../../config/options';
import { acceptedFileTypes, verifyFile, imageSize } from '../../../validations/common/isImage';
import { validateBiodata } from '../../../validations/profile';
import isEmpty from '../../../validations/common/isEmpty';

/**
 * BioForm is a component to show BioForm in profile page
 *
 * @name BioForm
 * @component
 * @category Page
 * @category Profile
 *
 */
class BioForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      apiURL: '/api/update-profile-biodata/',
      file: {}
    };
    this.onChange = this.onChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.isValid = this.isValid.bind(this);
    this.selectOnChange = this.selectOnChange.bind(this);
    this.multiSelect = this.multiSelect.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.props.getNationalities();
    this.isValid();
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
  componentDidUpdate(prevProps) {
    const strForm2 = JSON.stringify(this.props.bio);
    const strPrevForm2 = JSON.stringify(prevProps.bio);
    if (strForm2 !== strPrevForm2 || (this.props.open == true && (this.props.open !== prevProps.open)) ) {
      this.isValid();
    }
  }

  /**
   * handleClose is a function to close bio form modal
   */
  handleClose() {
    this.setState({ src: null, image: {} });
    if (isEmpty(this.props.errors)) {
      this.props.handleClose();
    }
  }

  /**
   * handleSave is a function to save bio form
   * @returns {Promise}
   */
  handleSave() {
    let { errors, isValid } = this.props;

    let { src, file } = this.state;
    if (src) {
      let fileData = new FormData();
      fileData.append('file', file, file.name);
      fileData.append('collection_name', photoCollectionName);

      this.props.setLoading(true);
      return this.props
        .postAPI(p11UpdatePhotoURL, fileData)
        .then((res) => {
          this.props.setLoading(false);
          this.props.addFlashMessage({
            type: res.data.status,
            text: res.data.message
          });
          this.props.getBio(this.props.profileID);
          this.setState({ src: null, file: {} });
        })
        .catch((err) => {
          this.props.setLoading(false);
          if (typeof err.response !== 'undefined' && err.response && err.response !== null) {
            if (typeof err.response.data.status !== "undefined" && err.response.data.status !== null && typeof err.response.data.message !== "undefined" && err.response.data.message !== null) {
              this.props.addFlashMessage({
                type: err.response.data.status ? err.response.data.status : 'error',
                text: err.response.data.message
                  ? err.response.data.message
                  : 'There is an error while uploading your file'
              });
            } else {
              this.props.addFlashMessage({
                type: 'error',
                text: 'There is an error while uploading your file'
              });
            }
          } else {
            this.props.addFlashMessage({
              type: 'error',
              text: 'There is an error while uploading your file'
            });
          }
        });
    } else {
      if (isEmpty(errors) && isValid) {
        this.props.setLoading(true);
        this.props
          .postAPI(this.state.apiURL, this.props.bio)
          .then((res) => {
            this.props.setLoading(false);
            this.props.addFlashMessage({
              type: res.data.status,
              text: res.data.message
            });
            this.props.getBio(this.props.profileID);
            this.props.handleClose();
          })
          .catch((err) => {
            this.props.setLoading(false);
            this.props.addFlashMessage({
              type: 'error',
              text: 'error'
            });
          });
      }
    }
  }

  /**
   * isValid is a function to validate bio form
   * @param {Event} e
   * @returns {boolean}
   */
  isValid(e) {
    let { errors, isValid } = validateBiodata(this.props.bio);
    this.props.checkError(errors, isValid);
    return isValid;
  }

  /**
   * onChange is a function handle change of data in the form that are coming from a field
   * @param {Event} e
   */
  onChange(e) {
    this.props.onChangeBio(e.target.name, e.target.value);
  }

  /**
   * multiSelect is a function to handle the change of data in present nationality select field
   * @param {*} values
   * @param {*} e
   */
  multiSelect(values, e) {
    this.props.onChangeBioPresentNationality(e.name, values);
  }

  /**
   * selectOnChange is a function to handle change of data on the select field
   * @param {*} values
   * @param {*} e
   */
  selectOnChange(values, e) {
    this.props.onChangeBio(e.name, values);
  }

  /**
   * handleUploadImage is a function to hanlde upload profile picture
   * @param {Event} e
   */
  handleUploadImage(e) {
    const files = event.target.files;
    if (e.target.files && e.target.files.length > 0) {
      const isVerified = verifyFile(files);
      if (isVerified) {
        this.setState({
          src: URL.createObjectURL(files[0]),
          file: files[0]
        });
      } else {
        this.props.addFlashMessage({
          type: 'error',
          text: 'This file is not allowed. greater than ' + imageSize + ' Mb and Only images are allowed'
        });
      }
    }
  }

  render() {
    const { classes, open, errors, nationalities, p11Countries } = this.props;
    const { src } = this.state;
    const {
      photo,
      full_name,
      first_name,
      family_name,
      middle_name,
      gender,
      linkedin_url,
      skype,
      present_nationalities,
      country_residence
    } = this.props.bio;

    return (
      <Modal
        open={open}
        title="Edit Profile"
        handleClose={this.handleClose}
        maxWidth="md"
        scroll="body"
        handleSave={this.handleSave}
      >
        {src ? (
          <div className={classes.containerProfile}>
            <img
              src={this.state.src}
              className={classes.imagePreview}
              onClick={(e) => this.photo.click()}
            />
            <input
              id="photo"
              name="photo"
              type="file"
              ref={(ref) => (this.photo = ref)}
              style={{ display: 'none' }}
              onChange={this.handleUploadImage}
              accept={acceptedFileTypes}
            />
            <div className={classes.middle}>
              <IconButton onClick={(e) => this.photo.click()}>
                <CameraAlt fontSize="large" className={classes.camera} />
              </IconButton>
            </div>
          </div>
        ) : (
            <Grid container spacing={24}>
              <Grid item xs={12} sm={12} md={3}>
                <div className={classes.containerProfile}>
                  <Avatar
                    src={photo}
                    className={classes.avatarChangeImage}
                    alt={full_name}
                    onClick={(e) => this.photo.click()}
                  />
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    ref={(ref) => (this.photo = ref)}
                    style={{ display: 'none' }}
                    onChange={this.handleUploadImage}
                    accept={acceptedFileTypes}
                  />
                  <div className={classes.middle}>
                    <IconButton onClick={(e) => this.photo.click()}>
                      <CameraAlt fontSize="large" className={classes.camera} />
                    </IconButton>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={9}>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="family_name"
                      name="family_name"
                      label="Family name"
                      fullWidth
                      value={family_name}
                      autoComplete="new-password"
                      margin="dense"
                      onChange={this.onChange}
                      error={!isEmpty(errors.family_name)}
                      helperText={errors.family_name}
                      className={classes.dense}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="first_name"
                      name="first_name"
                      label="First name"
                      fullWidth
                      autoComplete="new-password"
                      value={first_name}
                      margin="dense"
                      onChange={this.onChange}
                      error={!isEmpty(errors.first_name)}
                      helperText={errors.first_name}
                      className={classes.dense}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id="middle_name"
                      name="middle_name"
                      label="Middle Name"
                      fullWidth
                      autoComplete="new-password"
                      value={middle_name}
                      margin="dense"
                      onChange={this.onChange}
                      error={!isEmpty(errors.middle_name)}
                      helperText={errors.middle_name}
                      className={classes.dense}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="gender"
                      select
                      name="gender"
                      label="Select Gender"
                      fullWidth
                      margin="normal"
                      value={gender}
                      onChange={this.onChange}
                      error={!isEmpty(errors.gender)}
                      helperText={errors.gender}
                    >
                      {genderData.map((sex, index) => (
                        <MenuItem key={index} value={sex.value}>
                          {sex.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="Your Linkedin Profile"
                      id="linkedin_url"
                      name="linkedin_url"
                      margin="normal"
                      value={linkedin_url}
                      onChange={this.onChange}
                      error={!isEmpty(errors.linkedin_url)}
                      helperText={errors.linkedin_url}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id="skype"
                      name="skype"
                      label="Your Skype"
                      fullWidth
                      required
                      margin="normal"
                      autoComplete="skype"
                      value={skype}
                      onChange={this.onChange}
                      error={!isEmpty(errors.skype)}
                      helperText={errors.skype}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <SelectField
                  label="Nationality (ies)"
                  options={nationalities}
                  value={present_nationalities}
                  onChange={this.multiSelect}
                  placeholder="Select nationality"
                  isMulti={true}
                  name="present_nationalities"
                  error={errors.present_nationalities}
                  margin="none"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <SelectField
                  label="Country of Residence *"
                  options={p11Countries}
                  value={country_residence}
                  onChange={this.selectOnChange}
                  placeholder="Select country of residence"
                  isMulti={false}
                  name="country_residence"
                  error={errors.country_residence}
                  margin="none"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
      </Modal>
    );
  }
}

BioForm.propTypes = {
  /**
   * checkError is a prop containing redux action to set error on redux
   */
  checkError: PropTypes.func.isRequired,
  /**
   * onChangeBio is a prop containing redux action to handle change of data in the bio form
   */
  onChangeBio: PropTypes.func.isRequired,
  /**
   * onChangeBioPresentNationality is a prop containing redux action to handle present nationality data in the bio form
   */
  onChangeBioPresentNationality: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
  addFlashMessage: PropTypes.func.isRequired,
  /**
   * postAPI is a prop containing redux actions to call an api using POST HTTP Request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * getBio is a prop containing redux action to get bio form data
   */
  getBio: PropTypes.func.isRequired,
  /**
   * setLoading is a prop containing redux action to show / hiding loading indicator value
   */
  setLoading: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  bio: state.bio,
  years: state.options.years,
  errors: state.web.errors,
  isValid: state.web.isValid,
  nationalities: state.options.nationalities,
  p11Countries: state.options.p11Countries
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  checkError,
  onChangeBio,
  onChangeBioPresentNationality,
  addFlashMessage,
  postAPI,
  getBio,
  getNationalities,
  setLoading
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  avatar: {
    width: 200,
    height: 200,
    margin: '0 auto'
  },
  avatarChangeImage: {
    width: 200,
    height: 200,
    margin: '0 auto',
    cursor: 'pointer'
  },

  capitalize: {
    'text-transform': 'capitalize'
  },
  noTextDecoration: {
    'text-decoration': 'none'
  },
  button: {
    float: 'right',
    '&:hover': {
      backgroundColor: '#be2126'
    },
    '&:hover $iconAdd': {
      color: 'white'
    }
  },
  iconAdd: {
    color: '#be2126'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  containerProfile: {
    position: 'relative',
    width: '100%',
    '&:hover $avatarChangeImage': {
      opacity: 0.3
    },
    '&:hover $imagePreview': {
      opacity: 0.3
    },
    '&:hover $middle': {
      opacity: 1
    }
  },
  middle: {
    transition: '.5s ease',
    opacity: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },
  camera: {
    cursor: 'pointer'
  },
  imagePreview: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    cursor: 'pointer',
    maxHeight: '450px',
    maxWidth: '500px'
  }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BioForm));
