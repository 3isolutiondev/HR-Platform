/** import React, React.Component, PropTypes and classnames */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

/** import Fontawesome icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';

/** import configuration value and validation helper */
import {
	primaryColor,
	primaryColorRed,
	primaryColorBlue,
	primaryColorGreen,
	white
} from '../../../../../config/colors';
import { acceptedImageFiles } from '../../../../../config/general';
import isEmpty from '../../../../../validations/common/isEmpty';

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
	addMarginTop: {
		'margin-top': '0.5em !important'
	},
	pdfContainer: {
		'text-align': 'center',
		color: primaryColor
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
	label: {
		color: white
	}
});

/**
 * DropzoneGallery is a component to show list of files for DropzoneFileField component
 * This component is specifically develop for Policy Page
 *
 * @name DropzoneGallery
 * @component
 * @category Policy
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
   * onChangeFile is a function to update "can be download" checkbox value
   * @param {boolean} can_be_downloaded
   * @param {integer} index
   */
	onChangeFile(can_be_downloaded, index) {
		const newFiles = this.state.files;
		newFiles[index].can_be_downloaded = !can_be_downloaded;
		const files = newFiles;
		this.props.onFileChange(files)
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
   * onDelete is a function to delete on of the file in the gallery
   * @param {integer} fileIndex
   * @param {integer} file_id
   */
	onDelete(fileIndex, file_id) {
		let { files } = this.state;
		files.splice(fileIndex, 1);

		this.setState({ files }, () => {
			this.props.onDelete(this.state.files, file_id);
		});
	}

	render() {
		const { name, classes, filesLimit, fullWidth, deleted } = this.props;
		const { files } = this.state;
		const downloadableMimeTypes = ['application/pdf' ];

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
                      <div className={classes.pdfContainer}>
                        <FontAwesomeIcon
                          icon={file.mime === 'application/pdf' ? faFilePdf :
                            acceptedImageFiles.indexOf(file.mime) !== -1 ? faFileImage :
                            faFile
                          }
                          size="10x"
                          style={{ width: '100%' }}
                        />
                      </div>
											<div className={classes.middle}>
												<IconButton color="primary" onClick={this.props.openModal}>
													<CloudUpload fontSize="large" className={classes.upload} />
												</IconButton>
											</div>
										</div>

										<GridListTileBar
											title={file.filename}
											classes={{
												root: classes.titleBar,
												title: classes.title
											}}
											actionIcon={
												<div className={classes.buttonContainer}>
													{downloadableMimeTypes.includes(file.mime) && <FormControlLabel
													    sx={{
															label: {
																color: "white"
															}
														}}
													    control={
														<Checkbox
														 style={{color: "white"}}
														 onChange={()=>this.onChangeFile(file.can_be_downloaded, index)}
															defaultChecked={file.can_be_downloaded === 1} />}
												    	label={	<Typography variant="body1" component="p" className={classes.label}>
														            Can be downloaded
																</Typography> }
													/>
													}
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
														<IconButton className={classes.iconColor}>
															<CloudDownloadIcon className={classes.title} />
														</IconButton>
													</a>
													{deleted && (
														<IconButton
															color="inherit"
															className={classes.iconColor}
															onClick={(fileIndex) =>
																this.onDelete(fileIndex, file.file_id)}
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
   * name is a prop containing the name of the field
   */
	name: PropTypes.string.isRequired,
  /**
   * files is a prop containing array of file data to be shown in gallery
   */
	files: PropTypes.array.isRequired,
  /**
   * onFileChange is a prop containing function to update files data when there "can be downloaded" checkbox value is changed
   */
	onFileChange: PropTypes.func
};

export default withStyles(styles)(DropzoneGallery);
