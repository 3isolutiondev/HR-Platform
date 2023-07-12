import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import isEmpty from '../../../validations/common/isEmpty';
import Modal from '../../../common/Modal';
import { getCVAndSignature } from '../../../redux/actions/profile/cvAndSignatureActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import DropzoneFileField from '../../../common/formFields/DropzoneFileField';
import { addFlashMessage } from '../../../redux/actions/webActions';
import {
	p11UpdateCVURL,
	p11DeleteCVURL,
	// p11UpdateSignatureURL,
	// p11DeleteSignatureURL,
	acceptedDocFiles,
	cvCollectionName
	// signatureCollectionName,
	// acceptedImageFiles
} from '../../../config/general';
import { onChangeForm8 } from '../../../redux/actions/p11Actions';
import { primaryColor } from '../../../config/colors';

class CV extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	componentDidMount() {
		this.props.getCVAndSignature(this.props.profileID);
	}

	componentDidUpdate(prevProps) {
		if (this.props.profileID !== prevProps.profileID) {
			this.props.getCVAndSignature(this.props.profileID);
		}
	}
	handleOpen() {
		this.setState({ open: true });
	}

	handleClose() {
		this.setState({ open: false }, () => {
			this.props.getCVAndSignature(this.props.profileID);
			this.props.profileLastUpdate();
		});
	}

	async onUpload(name, files) {
		if (!isEmpty(files)) {
			const { file_id, download_url, file_url, mime, filename } = files[0];
			await this.props.onChangeForm8([name], { file_id, download_url, file_url, mime, filename });
			this.props.addFlashMessage({
				type: 'success',
				text: 'Your file succesfully uploaded'
			});
			this.props.getCVAndSignature(this.props.profileID);
			this.props.profileLastUpdate();
		} else {
			await this.props.onChangeForm8([name], {});
			this.props.getCVAndSignature(this.props.profileID);
			this.props.profileLastUpdate();
		}
	}

	async onDelete(name, deleteURL, files, deletedFileId) {
		if (isEmpty(files)) {
			await this.props.onChangeForm8([name], {});
			this.props
				.deleteAPI(deleteURL)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your file succesfully deleted'
					});
					this.props.getCVAndSignature(this.props.profileID);
					this.props.profileLastUpdate();
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while deleting Your file'
					});
				});
		} else {
			await this.props.onChangeForm8([name], files);
			this.props.getCVAndSignature(this.props.profileID);
		}
	}

	render() {
		const { classes, editable } = this.props;
		const { cv, signature, show } = this.props.cvAndSignature;
		let { open } = this.state;
		let file_name = '';
    let cvData = Object.assign({}, cv);
		if (!isEmpty(cvData)) {
			if (!isEmpty(cvData.filename)) {
				if (cvData.filename.length > 25) {
					file_name = cvData.filename.substring(0, 24) + '...';
				} else {
					file_name = cvData.filename;
				}
			}
      cvData = Object.assign({ noCv: false }, cvData);
		} else {
      file_name = "Please upload your CV"
      cvData = Object.assign({ filename: file_name, file_url: '', noCv: true}, cvData)
    }

		return (
			<div>
				{show ? (
					<Card className={classes.box}>
						<CardContent className={(!cvData.noCv) ? classes.card : classname(classes.card, classes.noCV)}>
							{(cvData) ? (
								<div className={classes.record}>
									{editable ? (
										<IconButton
											onClick={this.handleOpen}
											className={classes.button}
											aria-label="Edit"
										>
											<Edit fontSize="small" className={classes.iconEdit} />
										</IconButton>
									) : null}
                  {!cvData.noCv ? (
                    <Tooltip title="Download CV">
                      <Fab
                        size="small"
                        variant="extended"
                        color="primary"
                        href={cvData.file_url}
                        target="_blank"
                        className={classes.download}
                      >
                        <CloudDownload className={classes.downloadIcon} />
                        Download CV
                      </Fab>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Upload CV">
                      <Fab
                        size="small"
                        variant="extended"
                        color="primary"
											  onClick={this.handleOpen}
                        className={classes.download}
                      >
                        <CloudUpload className={classes.downloadIcon} />
                        Upload CV
                      </Fab>
                    </Tooltip>
                  )}
									{!isEmpty(file_name) ? (
										<Tooltip title={cvData.filename}>
											<Typography
												variant="subtitle2"
												color="primary"
												className={classes.filename}
											>
												{file_name}
											</Typography>
										</Tooltip>
									) : null}
								</div>
							) : null}
							{editable ? (
								<Modal
									open={open}
									title={cvData.noCv ? "Upload your CV" : "Update your CV"}
									handleClose={() => this.handleClose()}
									maxWidth="md"
									scroll="body"
									saveButton={false}
								>
									<Paper className={classes.root} elevation={1}>
										<FormLabel>CV *</FormLabel>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={12}>
												<DropzoneFileField
													name="cv"
													label="Your CV file"
													onUpload={this.onUpload}
													onDelete={this.onDelete}
													collectionName={cvCollectionName}
													apiURL={p11UpdateCVURL}
													deleteAPIURL={p11DeleteCVURL}
													isUpdate={false}
													filesLimit={1}
													acceptedFiles={acceptedDocFiles}
													gallery_files={!isEmpty(cv) ? [cv] : []}
													deleted={false}
												/>
											</Grid>
											{/* <Grid item xs={12} sm={6}>
                    <DropzoneFileField
                      name="signature"
                      label="Your Signature"
                      onUpload={this.onUpload}
                      onDelete={this.onDelete}
                      collectionName={signatureCollectionName}
                      apiURL={p11UpdateSignatureURL}
                      deleteAPIURL={p11DeleteSignatureURL}
                      isUpdate={false}
                      filesLimit={1}
                      acceptedFiles={acceptedImageFiles}
                      gallery_files={!isEmpty(signature) ? [ signature ] : []}
                      deleted={false}
                    />
                  </Grid> */}
										</Grid>
									</Paper>
									<br />
								</Modal>
							): null}
						</CardContent>
					</Card>
				) : null}
			</div>
		);
	}
}

CV.propTypes = {
	getCVAndSignature: PropTypes.func.isRequired,
	profileLastUpdate: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getCVAndSignature,
	onChangeForm8,
	profileLastUpdate,
	addFlashMessage,
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	cvAndSignature: state.cvAndSignature
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		border: 'none'
	},
	box: {
		marginBottom: theme.spacing.unit * 2
	},
	imgResponsive: {
		width: '100%'
	},
	download: {
		width: theme.spacing.unit * 4 + 2,
		height: theme.spacing.unit * 4 + 2,
		minHeight: theme.spacing.unit * 4 + 2,
		border: '1px solid ' + primaryColor,
		marginRight: theme.spacing.unit
	},
	downloadIcon: {
		fontSize: theme.spacing.unit * 3 - 2,
		marginRight: theme.spacing.unit
	},
	filename: {
		display: 'inline-block'
	},
	card: {
		paddingBottom: theme.spacing.unit * 2 + 'px !important'
	},
  noCV: {
    border: `2px solid ${primaryColor}`
  },
	record: {
		position: 'relative',
		'&:hover $iconEdit': {
			color: primaryColor
		}
	},
	button: {
		position: 'absolute',
		right: theme.spacing.unit * -1,
		top: theme.spacing.unit * -1,
		'&:hover': {
			backgroundColor: primaryColor
		},
		'&:hover $iconEdit': {
			color: 'white'
		}
	},
	iconEdit: {
		color: 'transparent'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CV));
