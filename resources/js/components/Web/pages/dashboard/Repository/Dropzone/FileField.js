import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import CloudUpload from '@material-ui/icons/CloudUpload';
// import CloudDownload from '@material-ui/icons/CloudDownload';
import isEmpty from '../../../../validations/common/isEmpty';
import DropzoneFileModal from './dropzoneFile/DropzoneFileModal';
import DropzoneGallery from './dropzoneFile/DropzoneGallery';
// import { isArray } from 'util';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
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

class FileField extends Component {
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
		this.onFileChange = this.onFileChange.bind(this);
	}

	componentDidMount() {
		if (this.props.hasOwnProperty('fullWidth')) {
			this.setState({ fullWidth: this.props.fullWidth });
		}

		if (!isEmpty(this.props.gallery_files)) {
			this.setState({ gallery_files: this.props.gallery_files });
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.fullWidth !== this.props.fullWidth) {
			this.setState({ fullWidth: this.props.fullWidth });
		}

		if (prevProps.gallery_files !== this.props.gallery_files) {
			this.setState({ gallery_files: this.props.gallery_files });
		}
	}

	closeModal() {
		this.setState({ dropzoneOpen: false });
	}

	openModal() {
		this.setState({ dropzoneOpen: true });
	}

	// onChange(name)

	onUpload(gallery_files) {
		this.setState({ gallery_files }, () => {
			this.props.onUpload(this.props.name, this.state.gallery_files);
		});
	}

	onDelete(gallery_files, deletedFileId) {
		this.setState({ gallery_files }, () => {
			this.props.onDelete(this.props.name, this.props.deleteAPIURL, this.state.gallery_files, deletedFileId);
		});
	}

	onFileChange(gallery_files) {
		this.props.updatePolicyFiles(gallery_files);
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
			deleted
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
						onFileChange={this.onFileChange}
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
					// onChange={this.onChange}
				/>

				{/* { !isEmpty( filename ) &&
          <Button target="_blank" href={cv} size="small"  color="primary" variant="contained">
            <CloudDownload className={classes.addMarginRight}/>
            Download
          </Button>
        } */}

				{!isEmpty(error) && <FormHelperText>{error}</FormHelperText>}
			</FormControl>
		);
	}
}

FileField.defaultProps = {
	margin: 'normal',
	fullWidth: true,
	buttonLabel: 'Choose File',
	filesLimit: 1,
	acceptedFiles: [ 'image/jpeg', 'image/jpg', 'image/png' ],
	isUpdate: false,
	deleted: true
};

FileField.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	error: PropTypes.string,
	onUpload: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	filesLimit: PropTypes.number.isRequired,
	acceptedFiles: PropTypes.array.isRequired,
	apiURL: PropTypes.string.isRequired,
	deleteAPIURL: PropTypes.string.isRequired,
	collectionName: PropTypes.string.isRequired,
	isUpdate: PropTypes.bool,
	gallery_files: PropTypes.array,

};

export default withStyles(styles)(FileField);
