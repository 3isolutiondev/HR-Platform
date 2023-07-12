/** import React, PropTypes and Loadable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

/** import configuration helper and validation helper */
import {
	p11UpdateCVURL,
	p11DeleteCVURL,
	p11UpdateSignatureURL,
	p11DeleteSignatureURL,
	p11UpdatePhotoURL,
	p11DeletePhotoURL,
	acceptedDocFiles,
	cvCollectionName,
	signatureCollectionName,
	photoCollectionName,
	acceptedImageFiles,
	YesNoURL
} from '../../config/general';

import { primaryColor } from '../../config/colors';
import { validateP11Form8 } from '../../validations/p11';
import isEmpty from '../../validations/common/isEmpty';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import {
	onChangeForm8,
	checkError,
	setP11FormData,
	setP11Status,
	updateP11Status
} from '../../redux/actions/p11Actions';
import { getAPI, deleteAPI, postAPI  } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';

/** import custom components needed for this component */
import LoadingSpinner from '../../common/LoadingSpinner';
import YesNoField from '../../common/formFields/YesNoField';
// const SkillLists = Loadable({
// 	loader: () => import('./skills/SkillLists'),
// 	loading: LoadingSpinner
// });
const DropzoneFileField = Loadable({
	loader: () => import('../../common/formFields/DropzoneFileField'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		textTransform: 'capitalize'
	},
	link: {
    color: '#2b6dad;',
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2 * -1,
		'&:hover': {
			background: 'transparent',
			'text-decoration': 'underline'
		}
	},
	title: {
		'& h6': {
			color: primaryColor
		}
  },
  redText: {
	color: 'red'
  }
});


/**
 * P11Form8 is a component to show Step 8 in P8 page
 *
 * @name P11Form8
 * @component
 * @category Page
 * @subcategory P8
 *
 */
class P11Form8 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			
		};

		this.isValid = this.isValid.bind(this);
		this.getP8 = this.getP8.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onChange = this.onChange.bind(this);
		this.yesNoChange = this.yesNoChange.bind(this)
    /**
     * UNCOMMENT IF WE WANT TO USE THE LABEL FROM THE SETTINGS
     */
    // this.getRosterLabel = this.getRosterLabel.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.getP8();
  }

  /**
     * UNCOMMENT IF WE WANT TO USE THE LABEL FROM THE SETTINGS
     */
  // getRosterLabel() {
  //   this.props.getAPI('/api/settings/options/roster-label-in-step-8')
  //   .then(res => {
  //     this.setState({ roster_label: res.data.data })
  //   })
  //   .catch(err => {
  //     this.props.addFlashMessage({
  //       type: 'error',
  //       text: 'Error while retrieving roster label'
  //     });
  //   })
  // }

  /**
   * getP8 is a function to get step 8 form data
   */
	getP8() {
		this.props
			.getAPI('/api/p11-profile-form-8')
			.then((res) => {
				let { form8 } = this.props;
				if (isEmpty(res.data.data.selected_roster_process)) {
					res.data.data.selected_roster_process = [];
				}
				if (isEmpty(res.data.data.linkedin_url)) {
					res.data.data.linkedin_url = '';
				}
				Object.keys(res.data.data)
					.filter((key) => key in form8)
					.forEach((key) => (form8[key] = res.data.data[key]));
				if (!isEmpty(res.data.data.p11Status)) {
					this.props.setP11Status(JSON.parse(res.data.data.p11Status));
				}
				this.props.setP11FormData('form8', form8).then(() => this.isValid());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'Error while retrieving your data'
				});
			});
	}

  /** isValid is a function to check step8 form data */
	isValid() {
		let { errors, isValid } = validateP11Form8(this.props.form8);
		this.props.updateP11Status(8, isValid, this.props.p11Status);
		this.props.checkError(errors, isValid);
		return isValid;
	}

  /** onUpload is a function to handle upload file */
	async onUpload(name, files) {
		if (!isEmpty(files)) {
			const { file_id, file_url, mime, filename, download_url } = files[0];
			await this.props.onChangeForm8([name], { file_id, download_url, file_url, mime, filename });
			this.isValid();
			this.props.addFlashMessage({
				type: 'success',
				text: 'Your file succesfully uploaded'
			});
		} else {
			await this.props.onChangeForm8([name], {});
			this.isValid();
		}
	}

  /** onDelete is a function to handle delete file */
	async onDelete(name, deleteURL, files, deletedFileId) {
		if (isEmpty(files)) {
			await this.props.onChangeForm8([name], {});
			this.isValid();
			this.props
				.deleteAPI(deleteURL)
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'Your file succesfully deleted'
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while deleting Your file'
					});
				});
		} else {
			await this.props.onChangeForm8([name], files);
			this.isValid();
		}
	}

  /** onChange is a function to handle textfield form */
	async onChange(e) {
		await this.props.onChangeForm8(e.target.name, e.target.value);
		this.isValid();
	}

	 /**
   * yesNoChange is a function to handle change of data coming from a yes no field
   * @param {Event} e
   */
	  yesNoChange(e) {
		const yesNoName = e.target.name;
		const yesNoValue = e.target.value;
		this.props
			.postAPI(YesNoURL[yesNoName], { [yesNoName]: yesNoValue, _method: 'PUT' })
			.then((res) => {
				this.props.onChangeForm8(yesNoName, yesNoValue);
				this.props.addFlashMessage({
					type: res.data.status ? res.data.status : 'success',
					text: res.data.message ? res.data.message : 'Update Success'
				});
				this.getP8();
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status ? err.response.data.status : 'success',
					text: err.response ? err.response.data.message : 'Update Success'
				});
			});
	}

	render() {
		let { classes, errors } = this.props;
		let { cv, photo, linkedin_url, share_profile_consent, hear_about_us_from, other_text } = this.props.form8;
		
		return (
			<Grid container spacing={24}>
				<Grid item xs={12} sm={6}>
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
						error={errors.cv}
					/>
				</Grid>
       		    {/* UNHIDE IF WE NEED TO UPLOAD SIGNATURE */}
					{/* <Grid item xs={12} sm={4} xs={12} sm={4}>
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
							error={errors.signature}
						/>
					</Grid> */}
				<Grid item xs={12} sm={6}>
					<DropzoneFileField
						name="photo"
						label="Your Photo"
						onUpload={this.onUpload}
						onDelete={this.onDelete}
						collectionName={photoCollectionName}
						apiURL={p11UpdatePhotoURL}
						deleteAPIURL={p11DeletePhotoURL}
						isUpdate={false}
						filesLimit={1}
						acceptedFiles={acceptedImageFiles}
						gallery_files={!isEmpty(photo) ? [photo] : []}
						error={errors.photo}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						id="linkedin_url"
						name="linkedin_url"
						label="your linkedin profile"
						fullWidth
						value={linkedin_url}
						autoComplete="linkedin_url"
						onChange={this.onChange}
						error={!isEmpty(errors.linkedin_url)}
						helperText={errors.linkedin_url}
						className={classes.capitalize}
						autoFocus
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<YesNoField
						ariaLabel="share_profile_consent"
						label="Do you give your consent to share your profile with a potential partner?"
						value={share_profile_consent.toString()}
						onChange={this.yesNoChange}
						name="share_profile_consent"
						error={errors.share_profile_consent}
						margin="dense"
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<FormLabel>One more thing: How did you hear about us ?</FormLabel>
					<RadioGroup
						name="hear_about_us_from"
						value={hear_about_us_from}
						onChange={this.onChange}
					>
						<FormControlLabel value="Browsers" control={<Radio />} label="Browsers" />
						<FormControlLabel value="Our website: immap.org" control={<Radio />} label="Our website: immap.org" />
						<FormControlLabel value="Social Media (Facebook, Twitter etc…)" control={<Radio />} label="Social Media (Facebook, Twitter etc…)" />
						<FormControlLabel value="Job boards (LinkedIn, Indeed, WTTJ, Relief Web, Development Aid etc..)" control={<Radio />} label="Job boards (LinkedIn, Indeed, WTTJ, Relief Web, Development Aid etc..)" />
						<FormControlLabel value="Word of Mouth" control={<Radio />} label="Word of Mouth" />
						<FormControlLabel value="Partners (UN agencies)" control={<Radio />} label="Partners (UN agencies)" />
						<FormControlLabel value="Other" control={<Radio />} label="Other:" />

					</RadioGroup>
					{!isEmpty(errors.hear_about_us_from) && <FormHelperText className={classes.redText}>{errors.hear_about_us_from}</FormHelperText>}
				</Grid>
				{hear_about_us_from == 'Other' ? (
					<Grid item xs={12} sm={12}>
					<TextField
						required
						id="other_text"
						name="other_text"
						label="Other"
						fullWidth
						value={other_text}
						autoComplete="other_text"
						onChange={this.onChange}
						error={!isEmpty(errors.other_text)}
						helperText={errors.other_text}
					/>
					</Grid>
              ) : null}
			</Grid>
		);
	}
}

P11Form8.propTypes = {
  /**
   * setP8FormData is a prop action to save step8 form data on redux
   */
	setP11FormData: PropTypes.func.isRequired,
  /**
   * onChangeForm8 is a prop action to handle change data coming from step8 form
   */
	onChangeForm8: PropTypes.func.isRequired,
  /**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
	getAPI: PropTypes.func.isRequired,
  /**
   * deleteAPI is a prop containing redux actions to call an api using DELETE HTTP Request
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
   */
	addFlashMessage: PropTypes.func.isRequired,
  /**
   * checkError is a prop containing function to checkError on P8 page.
   */
	checkError: PropTypes.func.isRequired,
  /**
   * form8 is a prop containing form8 data.
   */
	form8: PropTypes.object.isRequired,
  /**
   * errors is a prop containing errors data of form8
   */
	errors: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	checkError,
	onChangeForm8,
	deleteAPI,
	addFlashMessage,
	setP11FormData,
	setP11Status,
	updateP11Status,
	postAPI	
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	form8: state.p11.form8,
	errors: state.p11.errors,
	p11Status: state.p11.p11Status
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(P11Form8));
