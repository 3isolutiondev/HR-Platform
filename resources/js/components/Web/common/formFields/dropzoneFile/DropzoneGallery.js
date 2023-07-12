/** import React, React.Component, PropTypes and classnames */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** import Material ui withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';

/** import fontawesome icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';

/** import configuration value and validation helper */
import {
  primaryColor,
  primaryColorRed,
  primaryColorBlue,
  primaryColorGreen,
  white,
  secondaryColorRed,
  secondaryColorGreen,
  borderColor
} from '../../../config/colors';
import { acceptedImageFiles } from '../../../config/general';
import isEmpty from '../../../validations/common/isEmpty';

/** import custom component */
import Thumb from './Thumb';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    overflow: 'hidden'
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  gridListTile: {
    'margin-bottom': '0.75em'
  },
  title: {
    color: theme.palette.primary,
    'overflow-x': 'auto'
  },
  titleBar: {
    background: 'rgba(' + primaryColorRed + ',' + primaryColorGreen + ',' + primaryColorBlue + ',' + '0.8)'
  },
  titleDisabled: {
    background: 'rgba(' + secondaryColorRed + ',' + secondaryColorGreen + ',' + secondaryColorGreen + ',' + '0.5)'
  },
  addMarginTop: {
    'margin-top': '0.5em !important'
  },
  pdfContainer: {
    'text-align': 'center',
    color: primaryColor,
    minWidth: 300
  },
  containerProfile: {
    position: 'relative',
    width: '100%',
    '&:hover $pdfContainer': {
      opacity: 0.3
    },
    '&:hover $photo': {
      opacity: 0.3
    },
    '&:hover $middle': {
      opacity: 1
    }
  },
  upload: {
    cursor: 'pointer'
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
  photo: {
    width: '100%',
    margin: '0 auto',
    cursor: 'pointer'
  },
  gridSingle: {
    width: '100%'
  },
  buttonContainer: {
    display: 'inline-flex'
  },
  iconColor: {
    color: white
  },
  disabledIcon: {
    color: borderColor
  }
});

/**
 * DropzoneGallery is a component to show the uploaded files on DropzoneFileField
 *
 * @name DropzoneGallery
 * @component
 * @category Common
 */
class DropzoneGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };

    this.onDelete = this.onDelete.bind(this);
  }

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
  componentDidMount() {
    if (this.props.files) {
      this.setState({ files: this.props.files });
    }
  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    const prevFiles = JSON.stringify(prevProps.files);
    const currentFiles = JSON.stringify(this.props.files);
    if (prevFiles !== currentFiles) {
      this.setState({ files: this.props.files });
    }
  }

  /**
   * onDelete is a function to handle deleting a file from this component
   * @param {string|integer} fileIndex
   * @param {string|integer} file_id
   */
  onDelete(fileIndex, file_id) {
    let { files } = this.state;
    files.splice(fileIndex, 1);

    this.setState({ files }, () => {
      this.props.onDelete(this.state.files, file_id);
    });
  }

  render() {
    const { name, classes, filesLimit, fullWidth, deleted, disabled } = this.props;
    const { files } = this.state;

    return (
      <div className={classes.root}>
        <GridList
          className={fullWidth ? classnames(classes.addMarginTop, classes.gridSingle) : classes.addMarginTop}
          cellHeight={fullWidth ? 240 : 'auto'}
        >
          {files &&
            files.map(
              (file, index) =>
                file && (
                  <GridListTile
                    key={'file-' + name + '-' + index}
                    className={classes.gridListTile}
                    cols={2}
                  >
                    <div className={classes.containerProfile}>
                      {file.mime === 'application/pdf' ? (
                        <div className={classes.pdfContainer}>
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            size="10x"
                            style={{ width: '100%' }}
                            className={disabled ? classes.disabledIcon : ""}
                          />
                        </div>
                      ) : (acceptedImageFiles.indexOf(file.mime) !== -1) ? (
                        <Thumb fileUrl={file.file_url}/>
                      ) : (
                        <div className={classes.pdfContainer}>
                          <FontAwesomeIcon
                            icon={faFile}
                            size="10x"
                            style={{ width: '100%' }}
                            className={disabled ? classes.disabledIcon : ""}
                          />
                        </div>
                      )}
                      <div className={classes.middle}>
                        <IconButton color="primary" onClick={this.props.openModal} disabled={disabled}>
                          <CloudUpload fontSize="large" className={classes.upload} />
                        </IconButton>
                      </div>
                    </div>

                    <GridListTileBar
                      title={file.filename}
                      classes={{
                        root: disabled ? classes.titleDisabled : classes.titleBar,
                        title: classes.title
                      }}
                      actionIcon={
                        <div className={classes.buttonContainer}>
                          <a
                            href={
                              !isEmpty(file.download_url) ? (
                                file.download_url
                              ) : (
                                  file.file_url
                                )
                            }
                            target="_blank"
                          >
                            <IconButton className={classes.iconColor} disabled={disabled}>
                              <CloudDownloadIcon className={classes.title} />
                            </IconButton>
                          </a>
                          {deleted && (
                            <IconButton
                              color="inherit"
                              className={classes.iconColor}
                              onClick={(fileIndex) =>
                                this.onDelete(fileIndex, file.file_id)}
                              disabled={disabled}
                            >
                              <DeleteIcon className={classes.title} />
                            </IconButton>
                          )}
                        </div>
                      }
                    />
                  </GridListTile>
                )
            )}
        </GridList>
      </div>
    );
  }
}

DropzoneGallery.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * name is a prop containing name of the field (DropzoneFileField)
   */
  name: PropTypes.string.isRequired,
  /**
   * files is a prop containing array of file data
   */
  files: PropTypes.array.isRequired
};

export default withStyles(styles)(DropzoneGallery);
