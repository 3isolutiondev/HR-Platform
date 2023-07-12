/** import React, Prop Types and classnames */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** import Material UI styles, component and icons */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUpload from '@material-ui/icons/CloudUpload';

/** import third party package */
import { DropzoneArea } from 'material-ui-dropzone';
import FormData from 'form-data';

/** import React redux and it's actions */
import { connect } from 'react-redux';
import { postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import configuration value and validation helper */
import { maxFileSize } from '../../../config/general';
import { white } from '../../../config/colors'
import isEmpty from '../../../validations/common/isEmpty';
import Alert from '../../Alert';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  defaultFont: {
    'font-family': 'Barlow'
  },
  normalPadding: {
    padding: '0.5em'
  },
  addMarginRight: {
    'margin-right': '0.25em'
  },
  loading: {
    'margin-left': theme.spacing.unit,
    'margin-right': theme.spacing.unit,
    color: white
  }
});

/**
 * DropzoneFileModal is a component to show Modal for uploading file into the system (used in DropzoneFileField.js)
 *
 * @name DropzoneFileModal
 * @component
 * @category Common
 * @subCategory Form Field
 */

class DropzoneFileModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      errorUpload: false,
      showLoading: false,
      showBeforeUploadAlert: false
    };

    this.onChange = this.onChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onClose = this.onClose.bind(this);
    this.upload = this.upload.bind(this);
  }

  /**
   * onChange is a function to change files data
   * @param {Object[]} files
   */
  onChange(files) {
    this.setState({ files });
  }

  /**
   * onUpload is a function to upload file using api
   */
  onUpload() {
    if (this.state.files.length > 0) {
      if(this.props.showBeforeUploadAlert) {
        this.setState({ showBeforeUploadAlert: true})
      } else {
        this.upload();
      }
    }
  }

  upload() {
    if (this.state.files.length > 0) {
      let files = this.state.files.map((file) => {
        let fileData = new FormData();
        fileData.append('file', file, file.name);
        fileData.append('collection_name', this.props.collectionName);
        if(this.props.additionalElements) {
          Object.keys(this.props.additionalElements).forEach(key => {
            fileData.append(key, this.props.additionalElements[key]);
          })
        }

        if (this.props.isUpdate) {
          fileData.append('_method', 'PUT');
        }

        this.setState({ showLoading: true });

        return this.props
          .postAPI(this.props.apiURL, fileData)
          .then((res) => {
            const attachment = res.data.data;

            return {
              data: res.data,
              file_id: attachment.id,
              filename: file.name,
              download_url: !isEmpty(attachment.download_url)
                ? attachment.download_url
                : attachment.file_url,
              file_url: attachment.file_url,
              mime: attachment.mime,
              model_id: !isEmpty(attachment.model_id) ? attachment.model_id : ''
            };
          })
          .catch((err) => {
            if (!isEmpty(err.response.data.message)) {
              this.props.addFlashMessage({
                type: 'error',
                text: err.response.data.message
              });
            } else {
              this.props.addFlashMessage({
                type: 'error',
                text: 'There is an error while uploading your file'
              });
            }
            this.setState({ errorUpload: true, showLoading: false });
          });
      });

      Promise.all(files).then((resultFiles) => {
        if (!this.state.errorUpload) {
          this.props.onUpload(resultFiles);
          this.setState({ errorUpload: false, showLoading: false }, () => {
            this.onClose();
          });
        }
      });
    }
  }

  /**
   * onClose is a function to close the modal
   */
  onClose() {
    this.setState({ files: [] }, () => {
      this.props.onClose();
    });
  }

  render() {
    const { filesLimit, classes, acceptedFiles, isOpen } = this.props;

    const { showLoading } = this.state;

    return (
      <>
      <Alert
          isOpen={this.state.showBeforeUploadAlert}
          onClose={() => {
            this.setState({ showBeforeUploadAlert: false });
          }}
          onAgree={() => {
            this.setState({ showBeforeUploadAlert: false }, () => {
              this.upload();
            });
          }}
          title="Alert"
          text={this.props.beforeUploadText}
          closeText="Cancel"
          AgreeText="Yes"
        />
      <Dialog open={isOpen} onClose={this.onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent className={classes.defaultFont}>
          <DropzoneArea
            acceptedFiles={acceptedFiles}
            dropzoneText="Drag & Drop File Here or Click"
            dropZoneClass={classnames(classes.defaultFont, classes.normalPadding)}
            dropzoneParagraphClass={classnames(classes.defaultFont, classes.normalPadding)}
            onChange={this.onChange}
            filesLimit={filesLimit}
            showPreviewsInDropzone={false}
            showPreviews={true}
            showFileNamesInPreview={true}
            maxFileSize={maxFileSize}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={this.onUpload}>
            <CloudUpload className={classes.addMarginRight} /> Upload
            {showLoading && (
              <CircularProgress className={classes.loading} size={22} thickness={5} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
}

DropzoneFileModal.defaultProps = {
  filesLimit: 1,
  isUpdate: false
};

DropzoneFileModal.propTypes = {
  /**
   * isOpen is a prop containing boolean value to open/close Dropzone File Modal
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * onUpload is a function to handle uploaded file
   */
  onUpload: PropTypes.func.isRequired,
  /**
   * onClose is a function to close Dropzone File Modal
   */
  onClose: PropTypes.func.isRequired,
  /**
   * filesLimit is a prop containing the number of files that can be uploaded
   */
  filesLimit: PropTypes.number.isRequired,
  /**
   * postAPI is a function to call api using post http request
   */
  postAPI: PropTypes.func.isRequired,
  /**
   * apiURL is a prop containing api url
   */
  apiURL: PropTypes.string.isRequired,
  /**
   * collectionName is a prop containing collection name
   */
  collectionName: PropTypes.string.isRequired,
  /**
   * isUpdate is a prop to determined http request, if isUpdate is true, api will use PUT if not then it will use POST
   */
  isUpdate: PropTypes.bool
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  postAPI,
  addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(DropzoneFileModal));
