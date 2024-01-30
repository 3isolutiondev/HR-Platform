import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloudDownload from '@material-ui/icons/CloudDownload';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import isEmpty from '../../validations/common/isEmpty';
import Modal from '../../common/Modal';
import { getCVAndSignature } from '../../redux/actions/profile/cvAndSignatureActions';
import DropzoneFileField from '../../common/formFields/DropzoneFileField';
import {
	p11UpdateCVURL,
	p11DeleteCVURL,
	p11UpdateSignatureURL,
	p11DeleteSignatureURL,
	acceptedDocFiles,
	cvCollectionName,
	signatureCollectionName,
	acceptedImageFiles
} from '../../config/general';
import { onChangeForm8 } from '../../redux/actions/p11Actions';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		padding: theme.spacing.unit * 3
	},
	imgResponsive: {
		width: '100%'
	},
	button: {
		float: 'right',
		'&:hover': {
			backgroundColor: '#043C6E'
		},
		'&:hover $iconAdd': {
			color: 'white'
		}
	},
	iconAdd: {
		color: '#043C6E'
	}
});

class CvAndSignature extends Component {
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
	handleOpen() {
		this.setState({ open: true });
	}

	handleClose() {
		this.setState({ open: false }, () => this.props.getCVAndSignature(this.props.profileID));
	}

	async onUpload(name, files) {
		if (!isEmpty(files)) {
			const { file_id, download_url, file_url, mime, filename } = files[0];
			await this.props.onChangeForm8([ name ], { file_id, download_url, file_url, mime, filename });
			this.isValid();
			this.props.addFlashMessage({
				type: 'success',
				text: 'Your file succesfully uploaded'
			});
			this.props.getCVAndSignature(this.props.profileID);
		} else {
			await this.props.onChangeForm8([ name ], {});
			this.isValid();
			this.props.getCVAndSignature(this.props.profileID);
		}
	}

	async onDelete(name, deleteURL, files, deletedFileId) {
		if (isEmpty(files)) {
			await this.props.onChangeForm8([ name ], {});
			this.isValid();
			this.props
				.deleteAPI(deleteURL)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your file succesfully deleted'
					});
					this.props.getCVAndSignature(this.props.profileID);
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while deleting Your file'
					});
				});
		} else {
			await this.props.onChangeForm8([ name ], files);
			this.isValid();
			this.props.getCVAndSignature(this.props.profileID);
		}
	}
	render() {
		const { classes, editable } = this.props;
		const { cv, signature, show } = this.props.cvAndSignature;
		let { open } = this.state;

		return (
			<div>
				{show && (
					<Card>
						<CardContent>
							<Grid container spacing={24}>
								<Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										CV
									</Typography>
									{cv ? (
										<Typography variant="body2">
											<Button size="small" variant="contained" color="primary" href={cv.file_url}>
												<CloudDownload className={classes.addSmallMarginRight} /> Download
											</Button>{' '}
											{cv.filename}
										</Typography>
									) : null}
								</Grid>
								{editable ? (
									<Grid item lg={1} xs={2} sm={4} md={3} xl={1}>
										<IconButton
											onClick={this.handleOpen}
											className={classes.button}
											aria-label="Delete"
										>
											<Edit fontSize="small" className={classes.iconAdd} />
										</IconButton>
									</Grid>
								) : null}
								{/* signature place */}
								{/* <Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
							<Typography variant="h6" color="primary">
								Passport
							</Typography>
							{profile.p11_passport && (
								<Typography variant="body2">
									<Button size="small" variant="contained" color="primary" href={signature.url}>
										<CloudDownload className={classes.addSmallMarginRight} /> Download
									</Button>{' '}
									{signature.file_name}
								</Typography>
							)}
						</Grid> */}
								{/* <Grid item xs={10} sm={8} md={9} lg={11} xl={11}>
									<Typography variant="h6" color="primary">
										Signature
									</Typography>
									{signature && <img src={signature.file_url} className={classes.imgResponsive} />}
								</Grid> */}
							</Grid>
						</CardContent>
					</Card>
				)}
				{editable ? (
					<Modal
						open={open}
						title="Edit CV and Signature"
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
										gallery_files={!isEmpty(cv) ? [ cv ] : []}
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
				) : null}
			</div>
		);
	}
}

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
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getCVAndSignature,
	onChangeForm8
};

CvAndSignature.propTypes = {
	getCVAndSignature: PropTypes.func.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CvAndSignature));
