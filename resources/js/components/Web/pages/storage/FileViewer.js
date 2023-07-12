/** import React and PropTypes */
import React from 'react';
import PropTypes from 'prop-types';

/** import third party library */
import axios from 'axios';
import FileDownload from 'js-file-download';
import { Helmet } from 'react-helmet';

/** import Material UI component */
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

/** import component needed for this component */
import AuthLogo from '../../common/AuthLogo';
import PDFViewer from '../../common/pdf-viewer/PDFViewer';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { onPDFLoaded } from '../../redux/actions/common/PDFViewerActions';

/** import configuration value and validation helper */
import { acceptedImageFiles, acceptedDocFiles } from '../../config/general';
import isEmpty from '../../validations/common/isEmpty';

/**
 * FileViewer ia a component to show or download File
 *
 * @name FileViewer
 * @component
 * @category Page
 *
 */
class FileViewer extends React.Component
{
  constructor(props) {
    super(props)

    this.state = {
      /** isLoading is to determine the loading circle is shown or not*/
      isLoading: true,
      /** imageBlob is a place to put the image file under blob string */
      imageBlob: null,
      /** isPdf is a place to put the value of boolean which determine the file is pdf or not */
      isPdf: false,
      /** errorMsg is the place to show the error message text*/
      errorMsg: null,
    }

    this.getFile = this.getFile.bind(this);
    this.processDownload = this.processDownload.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    this.getFile();
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.fileId !== prevProps.match.params.fileId ||
      this.props.match.params.fileName !== prevProps.match.params.fileName ||
      this.props.isConversion !== prevProps.isConversion
    ) {
      this.getFile();
    }
  }

  /**
   * getFile is a function get the file by calling an api and decided where to handle the file based on the mime_type
   */
  async getFile() {
    // download file by caling an api
    await axios.get(
      `/api/storage/${this.props.match.params.fileId}${this.props.isConversion === true ? '/conversions/' : '/'}${this.props.match.params.fileName}`,
      {responseType: 'blob'})
    .then((res) => {
      // check image
      if (acceptedImageFiles.indexOf(res.data.type) > -1) {
        // show image
        this.setState({ imageBlob: URL.createObjectURL(res.data), isLoading: false });
        return true;
      }

      // check pdf
      if (acceptedDocFiles.indexOf(res.data.type) > -1) {
        // set data for pdf
        this.setState({ isPdf: true, isLoading: false }, () => {
          let fileReader = new window.FileReader();
          fileReader.readAsDataURL(res.data);
          fileReader.onload = async () => {
            this.props.onPDFLoaded('fileURL', this.props.match.params.fileName);
            this.props.onPDFLoaded('canClosePdfViewer', false);
            await this.props.onPDFLoaded('blobFile', fileReader.result);
            this.props.onPDFLoaded('pdfViewerOpen', true);
            return true;
          };
        });
        return true;
      }

      // download the file if is not image or pdf
      return this.processDownload(res.data);
    })
    .catch(err => {
      let errorMsg = "Sorry, we cannot process your request. Please try again later."
      if (!isEmpty(err.response)) {
        if (err.response.status === 404 || err.response.status === 401) {
          errorMsg = "File Not Found!"
        }
      }

      this.setState({ isLoading: false, errorMsg })
    })
  }

  /**
   * processDownload is a function to download file
   * @param {*} fileResponse blob file from api call
   * @returns
   */
  processDownload(fileResponse) {
    return this.setState({ isLoading: false }, () => {
      return FileDownload(fileResponse, this.props.match.params.fileName);
    })
  }

  render() {
    const { isLoading, imageBlob, errorMsg, isPdf } = this.state;
    const styleContent = `body { margin: 0 auto !important; }`;

    if (isLoading) {
      return (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '5%' }}>
          <CircularProgress color="primary" size={22} thickness={5} />
        </div>
      )
    } else if (isPdf) {
      return (
        <div style={{ textAlign: 'center', marginTop: '5%' }}>
          <AuthLogo />
          <PDFViewer />
        </div>
      )
    } else if (!isEmpty(imageBlob)) {
      return (
        <React.Fragment>
          <Helmet>
            <style type="text/css">
              {styleContent}
            </style>
          </Helmet>
          <img src={imageBlob} />
        </React.Fragment>
      )
    } else {
      return (
        <div style={{ textAlign: 'center', marginTop: '5%' }}>
          <AuthLogo />
          {errorMsg ? (
            <Typography variant="h5">{errorMsg}</Typography>
          ) : (
            <Typography variant="h5">File ready to download.</Typography>
          )}
        </div>
      )
    }
  }
}

FileViewer.defaultProps = {
  isConversion: false
}

FileViewer.propTypes = {
  /**
   * isConversion is a prop containing boolean value to determined if the file link is conversion link or not.
   */
  isConversion: PropTypes.bool,
  /**
   * fileId (number) and fileName(string) props under react router parameter props is required.
   */
  match: PropTypes.shape({
    params: PropTypes.shape({
      fileId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string // number in string format
      ]).isRequired,
      fileName: PropTypes.string.isRequired
    })
  }),
  /**
   * onPDFLoaded is a prop containing redux actions to set up data on pdf viewer reducer state
   */
  onPDFLoaded: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
  onPDFLoaded
}

export default connect('', mapDispatchToProps)(FileViewer)
