import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { DropzoneArea } from 'material-ui-dropzone';
import { maxFileSize } from '../../../../../config/general';
import { postAPI } from '../../../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../../../redux/actions/webActions';
import LoadingSpinner from '../../../../../common/LoadingSpinner';
import isEmpty from '../../../../../validations/common/isEmpty';
import FormData from 'form-data';
import { CircularProgress } from '@material-ui/core';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	defaultFont: {
		'font-family': 'Barlow'
	},
	normalPadding: {
		padding: '0.5em'
	},
	addMarginRight: {
		'margin-right': '0.25em'
	}
});

class DropzoneFileModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: [],
			errorUpload: false,
			showLoading: false
		};

		this.onChange = this.onChange.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onChange(files) {
		this.setState({ files });
	}

	onUpload() {
		if (this.state.files.length > 0) {
			let files = this.state.files.map((file) => {
				let fileData = new FormData();
				fileData.append('file', file, file.name);
				fileData.append('collection_name', this.props.collectionName);

				if (this.props.isUpdate) {
					fileData.append('_method', 'PUT');
				}

				this.setState({ showLoading: true });
				return this.props
					.postAPI(this.props.apiURL, fileData)
					.then((res) => {
						const attachment = res.data.data;

						return {
							file_id: attachment.id,
							filename: file.name,
							download_url: !isEmpty(attachment.download_url)
								? attachment.download_url
								: attachment.file_url,
							file_url: attachment.file_url,
							mime: attachment.mime,
							model_id: !isEmpty(attachment.model_id) ? attachment.model_id : '',
							can_be_downloaded: false
						};
					})
					.catch((err) => {
						this.props.addFlashMessage({
							type: err.response.data.status ? err.response.data.status : 'error',
							text: err.response.data.message
								? err.response.data.message
								: 'There is an error while uploading your file'
						});
						this.setState({ errorUpload: true, showLoading: false });
						// }
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

	onClose() {
		this.setState({ files: [] }, () => {
			this.props.onClose();
		});
	}

	render() {
		const { filesLimit, classes, acceptedFiles, isOpen } = this.props;

		const { showLoading } = this.state;

		return (
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
						maxFileSize={12582912}
					/>
				</DialogContent>
				<DialogActions>
					<LoadingSpinner isLoading={showLoading} />
					<Button onClick={this.onClose}>Cancel</Button>
					<Button variant="contained" color="primary" onClick={this.onUpload}>
						<CloudUpload className={classes.addMarginRight} /> Upload
						{showLoading && (
							<CircularProgress
								thickness={5}
								size={22}
								style={{ marginLeft: '8px', marginRight: '8px', color: '#fff' }}
							/>
						)}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

DropzoneFileModal.defaultProps = {
	filesLimit: 1,
	isUpdate: false
};

DropzoneFileModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onUpload: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	filesLimit: PropTypes.number.isRequired,
	postAPI: PropTypes.func.isRequired,
	apiURL: PropTypes.string.isRequired,
	collectionName: PropTypes.string.isRequired,
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
