/** import React, PropTypes and classnames */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloudUpload from '@material-ui/icons/CloudUpload';

/** import validation helper */
import isEmpty from '../../validations/common/isEmpty';

/** import custom component needed */
import DropzoneFileModal from './dropzoneFile/DropzoneFileModal';
import DropzoneGallery from './dropzoneFile/DropzoneGallery';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
  addMarginRight: {
    'margin-right': '0.25em'
  },
  addMarginTop: {
    'margin-top': '0.5em'
  },
  btnChoose: {
    width: 'max-content'
  }
});

/**
 * DropzoneFileField is a component to upload file
 *
 * @name DropzoneFileField
 * @component
 * @category Common
 */
class DropzoneFileField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropzoneOpen: false,
      files: [],
      gallery_files: [],
      fullWidth: true
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
  */
  componentDidMount() {
    if (this.props.hasOwnProperty('fullWidth')) {
      this.setState({ fullWidth: this.props.fullWidth });
    }

    if (!isEmpty(this.props.gallery_files)) {
      this.setState({ gallery_files: this.props.gallery_files });
    }
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps
  */
  componentDidUpdate(prevProps) {
    if (prevProps.fullWidth !== this.props.fullWidth) {
      this.setState({ fullWidth: this.props.fullWidth });
    }

    if (prevProps.gallery_files !== this.props.gallery_files) {
      this.setState({ gallery_files: this.props.gallery_files });
    }
  }

  /**
   * closeModal is a function to close dropzone file modal
   */
  closeModal() {
    this.setState({ dropzoneOpen: false });
  }

  /**
   * openModal is a function to open dropzone file modal
   */
  openModal() {
    this.setState({ dropzoneOpen: true });
  }

  /**
   * onUpload is a function to update gallery_files in dropzone gallery component
   * and send the files to be handled by onUpload function props from parent component
   * @param {Array} gallery_files
   */
  onUpload(gallery_files) {
    this.setState({ gallery_files }, () => {
      this.props.onUpload(this.props.name, this.state.gallery_files);
    });
  }

  /**
   * onDelete is a function to delete a file from gallery_files data in dropzone gallery component
   * and send the files to be handled by onDelete function props from parent component
   * @param {Array} gallery_files
   * @param {string|number} deletedFileId
   */
  onDelete(gallery_files, deletedFileId) {
    this.setState({ gallery_files }, () => {
      this.props.onDelete(this.props.name, this.props.deleteAPIURL, this.state.gallery_files, deletedFileId);
    });
  }

  render() {
    const {
      name,
      label,
      buttonLabel,
      margin,
      error,
      filesLimit,
      acceptedFiles,
      apiURL,
      collectionName,
      classes,
      isUpdate,
      deleted,
      disabled
    } = this.props;

    const { fullWidth, gallery_files, dropzoneOpen } = this.state;

    return (
      <FormControl margin={margin} fullWidth={fullWidth} error={!isEmpty(error)}>
        <FormLabel>{label}</FormLabel>

        {isEmpty(gallery_files) ? (
          <Button
            variant="contained"
            color="primary"
            onClick={this.openModal}
            className={classnames(classes.btnChoose, classes.addMarginTop)}
            disabled={disabled}
          >
            <CloudUpload className={classes.addMarginRight} /> {buttonLabel}
          </Button>
        ) : (
            <DropzoneGallery
              openModal={this.openModal}
              name={name}
              files={gallery_files}
              onDelete={this.onDelete}
              filesLimit={filesLimit}
              fullWidth={fullWidth}
              deleted={deleted}
              disabled={disabled}
            />
          )}

        <DropzoneFileModal
          isOpen={dropzoneOpen}
          name={name}
          apiURL={apiURL}
          onUpload={this.onUpload}
          onClose={this.closeModal}
          filesLimit={filesLimit}
          acceptedFiles={acceptedFiles}
          collectionName={collectionName}
          isUpdate={isUpdate}
          beforeUploadText={this.props.beforeUploadText}
          showBeforeUploadAlert={this.props.showBeforeUploadAlert}
          additionalElements={this.props.additionalElements}
        />

        {!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
}

/**
 * DropzoneFileField default props
 */
DropzoneFileField.defaultProps = {
  margin: 'normal',
  fullWidth: true,
  buttonLabel: 'Choose File',
  filesLimit: 1,
  acceptedFiles: ['image/jpeg', 'image/jpg', 'image/png'],
  isUpdate: false,
  deleted: true
};

DropzoneFileField.propTypes = {
  /**
   * name is a prop containing the name of the field
   */
  name: PropTypes.string.isRequired,
  /**
   * label is a prop containing the label of the field
   */
  label: PropTypes.string.isRequired,
  /**
   * error is a prop containing error message
   */
  error: PropTypes.string,
  /**
   * onUpload is a function prop to handle upload file
   */
  onUpload: PropTypes.func.isRequired,
  /**
   * onDelete is a function prop to handle delete file
   */
  onDelete: PropTypes.func.isRequired,
  /**
   * filesLimit is a prop containing the number of the files that this component can handle
   */
  filesLimit: PropTypes.number.isRequired,
  /**
   * acceptedFiles is a prop containing accepted file type
   */
  acceptedFiles: PropTypes.array.isRequired,
  /**
   * apiURL is a prop containing api url for uploading a file
   */
  apiURL: PropTypes.string.isRequired,
  /**
   * deleteAPIURL is a prop containing api url for deleting a file
   */
  deleteAPIURL: PropTypes.string.isRequired,
  /**
   * colectionName is a prop containing collection name value saved in the database (media table)
   */
  collectionName: PropTypes.string.isRequired,
  /**
   * isUpdate is a prop containing boolean value to check if this component in update mode or not
   */
  isUpdate: PropTypes.bool,
  /**
   * gallery_files is a prop containing array of data to be shown on dropzone gallery component
   */
  gallery_files: PropTypes.array,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DropzoneFileField);
