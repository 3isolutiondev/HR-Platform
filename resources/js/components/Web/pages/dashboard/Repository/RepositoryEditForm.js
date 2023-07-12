/** import React, React.Component, PropTypes and React Helmet */
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import Material UI withStyles, components and icons */
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

/** import configuration value and validation helper */
import { white } from '../../../config/colors';
import { APP_NAME } from '../../../config/general';
import documentTypes from '../../../utils/documentExtensions';
import { contractValidation } from '../../../validations/HR/contracts/contract';
import isEmpty from '../../../validations/common/isEmpty';

/** import custom components */
import Alert from '../../../common/Alert';
import SelectField from '../../../common/formFields/SelectField';
import WysiwygField from '../../../common/formFields/WysiwygField';
import FileField from './Dropzone/FileField';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	displayBlock: {
		display: 'block'
	}
});

/**
 * RepositoryEditForm is a component to edit Policy Document page
 *
 * @name RepositoryEditForm
 * @component
 * @category Page
 */
class RepositoryEditForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEdit: false,
			category: '',
			content: '',
			categoryvalue: '',
			isValid: false,
			errors: {},
			repo_category: [],
			idOffice: [],
			immapoffice: [],
			levelsection: '',
			addsection: [],
			setrole: [],
			OfficePermission: [],
			apiDoc: '/api/repository/getDocById/',
			apiURL: '/api/repository/',
			apiCategory: '/api/repository-category/',
			apiCountry: '/api/repository/getImmapOffice',
			redirectURL: '/policy-repository/',
			apiDeleteSection: '/api/repository-delete-section/',
			status: '',
			type: '',
			id: '',
			name: '',
			categoryId: '',
			selectedcategory: '',
			alertOpen: false,
			alertOpenSection: false,
			isLoading: false,
			is_upload: '0',
			policy_files: []
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.onSubmit = this.onSubmit.bind(this);
		this.getCategory = this.getCategory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.delete = this.delete.bind(this);
		this.addSection = this.addSection.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.updatePolicyFiles = this.updatePolicyFiles.bind(this);
	}

  /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.props
			.getAPI(this.state.apiDoc + this.props.match.params.id)
			.then((res) => {
				const {
					id,
					name,
					status,
					type,
					is_upload,
					section,
					category,
					category_id,
					media_id,
					file_name,
					file_url,
					download_url,
          mime,
					can_be_downloaded
				} = res.data.data;

				this.setState(
					{
						id,
						name,
						status,
						type,
						addsection: section,
						selectedcategory: {
							value: category.id,
							label: category.status == 0 ? category.name + ' - Draft' : category.name
						},
						categoryId: category_id,
						is_upload: is_upload.toString(),
						policy_files: [
							{
								file_id: media_id,
								filename: file_name,
								file_url: file_url,
								download_url: download_url,
								mime: mime,
								model_id: '',
								can_be_downloaded: can_be_downloaded
							}
						]
					},
					() => this.getCategory()
				);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while requesting tor data'
				});
				this.getCategory();
			});
	}

  /**
   * delete is a function to delete section when using document builder
   */
	delete() {
		if (this.state.deleteId > 0) {
			this.props
				.deleteAPI(this.state.apiDeleteSection + this.state.deleteId)
				.then((res) => {
					const { status, message } = res.data;
					this.props.addFlashMessage({
						type: status,
						text: message
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the delete request'
					});
				});
		}

		this.setState({ alertOpenSection: false, deleteId: 0 });
		this.state.addsection.splice(this.state.levelsection, 1);
	}

  /**
   * getCategory is a function to get list of policy category based on the type
   */
	getCategory() {
    this.props.getAPI('/api/repository-category/category-by-type/' + this.state.type).then((res) => {
			let response = res.data.data.map((data) => {
				return { value: data.id, label: data.status == 0 ? data.name + ' - Draft' : data.name };
			});

			this.setState({ repo_category: res.data.data });
		});
	}

  /**
   * isValid is a function to validate the form
   * @returns {boolean}
   */
	isValid() {
		const { errors, isValid } = contractValidation(this.state);
		this.setState({ errors, isValid });
		return isValid;
	}

  /**
   * handleClose is a function to close deletion confirmation modal
   */
	handleClose() {
		this.setState({ alertOpen: false });
	}

  /**
   * handleSave is a function to handle saving policy document
   */
	handleSave() {
		if (this.state.category) {
			let recordData = {
				category: this.state.category
			};

			this.props
				.postAPI(this.state.apiCategory, recordData)
				.then((res) => {
					const { status, message } = res.data;

					this.props.addFlashMessage({
						type: status,
						text: message
					});
					this.getCategory();

					this.setState({
						alertOpen: false
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
		}
	}

  /**
   * addSection is a function to add section on document builder
   */
	addSection() {
		this.setState((prevState) => ({
			addsection: [ ...prevState.addsection, { section: '', subsection: '' } ]
		}));
		this.isValid();
	}

  /**
   * handleChange is a function to handle change value on the form
   * @param {*} e
   */
	handleChange(e) {
		let addsectionn = [ ...this.state.addsection ];
		addsectionn[e.target.a[0]][e.target.a[1]] = e.target.value;

		this.setState({ addsectionn });
	}

  /**
   * onSubmit is a function to handle submit form
   * @param {*} e
   * @returns
   */
	onSubmit(e) {
		e.preventDefault();

		this.setState({
			isLoading: true
		});
		let {
			categoryvalue,
			selectedcategory,
			addsection,
			name,
			status,
			type,
			apiURL,
			is_upload,

			policy_files
		} = this.state;

		let recordData = {
			category: selectedcategory ? selectedcategory.value : this.state.categoryId,
			status: status,
			type: type,
			is_upload: is_upload
		};
		recordData._method = 'PUT';

		if (isEmpty(recordData.category)) {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Please select the category'
			});

			this.setState({
				isLoading: false
			});

			return;
		}

		if (is_upload.toString() == '0') {
			recordData.addsection = addsection;
			recordData.name = name;

			if (addsection.length == 0) {
				this.props.addFlashMessage({
					type: 'error',
					text: 'Please fill section'
				});

				this.setState({
					isLoading: false
				});

				return;
			}
		}

		if (is_upload.toString() == '1') {
			if (isEmpty(policy_files)) {
				this.props.addFlashMessage({
					type: 'error',
					text: 'Please choose files '
				});

				this.setState({
					isLoading: false
				});

				return;
			}
			recordData.policy_files = policy_files;
		}

		this.props
			.postAPI(apiURL + this.props.match.params.id, recordData)
			.then((res) => {
				const { status, message } = res.data;

				this.setState({
					isLoading: false
				});

				this.props.addFlashMessage({
					type: status,
					text: message
				});

				this.props.history.push(this.state.redirectURL);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
				this.setState({
					isLoading: false
				});
			});
	}

  /**
   * onUpload is a function to handle upload document on the form
   * @param {*} name ignored
   * @param {array} files array of files data
   */
	async onUpload(name, files) {
		if (!isEmpty(files)) {
			this.setState({ policy_files: files });
		} else {
			this.setState({ policy_files: [] });
		}
	}

  /**
   * onDelete is a function to handle file deletion on the form
   * @param {*} name          ignored
   * @param {*} deleteURL     ignored
   * @param {array} files         array of files data
   * @param {(string|integer)} deletedFileId file id
   */
	async onDelete(name, deleteURL, files, deletedFileId) {
		if (isEmpty(files)) {
			this.setState({ policy_files: [] });
		}
	}

  /**
   * updatePolicyFiles is a function to update files data
   * @param {array} files
   */
	async updatePolicyFiles(files) {
		this.setState({policy_files: files});
	}

	render() {
		const { classes } = this.props;
		const { isEdit, isLoading, isValid, immapoffice, errors, addsection, name, repo_category } = this.state;

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<Helmet>
						<title>{APP_NAME + ' - Edit Policy / Document'}</title>
						<meta name="description" content={APP_NAME + ' Edit Policy / Document '} />
					</Helmet>
					<Paper className={classes.paper}>
						<Grid container spacing={16}>
							<Grid item xs={12}>
								<Typography variant="h5" component="h3">
									Edit Policy / Document
								</Typography>
							</Grid>

							<Grid item xs={12} sm={12} md={6}>
								<FormLabel>Create Document or Upload ?</FormLabel>
								<RadioGroup
									className={classes.displayBlock}
									value={this.state.is_upload}
									onChange={(e) =>
										this.setState({
											is_upload: e.target.value,
											status: e.target.value == '1' ? '2' : '1'
										})}
								>
									<FormControlLabel value="0" control={<Radio />} label="Create Policy" />
									<FormControlLabel value="1" control={<Radio />} label="Upload Policy (ies)" />
								</RadioGroup>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								<FormLabel>Status</FormLabel>
								<RadioGroup
									className={classes.displayBlock}
									value={this.state.status}
									onChange={(e) =>
										this.setState({
											status: e.target.value
										})}
									required
								>
									<FormControlLabel
										value="1"
										required={true}
										control={<Radio />}
										label="Draft"
										disabled={this.state.is_upload == '1' ? true : false}
									/>
									<FormControlLabel
										value="2"
										required={true}
										control={<Radio />}
										label="Publish"
										disabled={this.state.is_upload == '1' ? true : false}
									/>
								</RadioGroup>
							</Grid>
							<Grid item xs={12}>
								<FormLabel>Type</FormLabel>
								<RadioGroup
									className={classes.displayBlock}
									value={this.state.type}
									onChange={(e) =>
										this.setState(
											{
												type: e.target.value,
												selectedcategory: ''
											},
											() => this.getCategory()
										)}
								>
									<FormControlLabel value="2" control={<Radio />} label="HR" />
                  <FormControlLabel value="1" control={<Radio />} label="Finance" />
                  <FormControlLabel value="3" control={<Radio />} label="Security" />
                  <FormControlLabel value="4" control={<Radio />} label="Communications" />
                  <FormControlLabel value="5" control={<Radio />} label="IT" />
								</RadioGroup>
							</Grid>
							<Grid item xs={12}>
								<SelectField
									label="Select Category *"
									margin="none"
									options={repo_category}
									placeholder="Choose Category"
									isMulti={false}
									value={this.state.selectedcategory}
									fullWidth
									onChange={(e) => {
										this.setState({
											selectedcategory: { value: e.value, label: e.label }
										});
									}}
									required
									allowDanger={true}
								/>
							</Grid>

							{this.state.is_upload == '0' && (
								<Grid item xs={12}>
									<TextField
										label="Name"
										margin="none"
										required
										fullWidth
										name="name"
										value={name}
										onChange={(e) =>
											this.setState({
												name: e.target.value
											})}
									/>
								</Grid>
							)}
							{this.state.is_upload == '0' && (
								<Grid item xs={12}>
									<Button
										variant="contained"
										color="primary"
										size="small"
										onClick={this.addSection}
										style={{ marginBottom: '15px' }}
									>
										<AddIcon /> Add Section
									</Button>
								</Grid>
							)}
							{this.state.is_upload == '0' && (
								<Grid item xs={12}>
									{addsection.map((val, index) => {
										return (
											<Grid
												container
												spacing={16}
												alignItems="center"
												key={index}
												style={{ marginBottom: '10px' }}
											>
												<Grid item xs={12} sm={7} md={9} lg={10}>
													<TextField
														label="Sub Section "
														margin="dense"
														required
														fullWidth
														name="sub_section"
														value={
															addsection[index].sub_section ? (
																addsection[index].sub_section
															) : (
																''
															)
														}
														onChange={(e) =>
															this.handleChange({
																target: {
																	value: e.target.value,
																	a: [ index, e.target.name ]
																}
															})}
														error={!isEmpty(errors.sub_section)}
														helperText={errors.sub_section}
													/>
												</Grid>
												<Grid item xs={12} sm={5} md={3} lg={2}>
													<Button
														variant="contained"
														color="primary"
														size="small"
														fullWidth
														onClick={() => {
															this.setState({
																deleteId: addsection[index].id
																	? addsection[index].id
																	: 0,
																levelsection: index,
																alertOpenSection: true
															});
														}}
													>
														<Delete fontSize="small" /> Delete Section
													</Button>
												</Grid>

												<Grid item xs={12}>
													<WysiwygField
														label="Sub Section Content"
														name="sub_section_content"
														value={
															addsection[index].sub_section_content ? (
																addsection[index].sub_section_content
															) : (
																''
															)
														}
														onChange={(e) =>
															this.handleChange({
																target: {
																	value: e.target.value,
																	a: [ index, 'sub_section_content' ]
																}
															})}
														error={errors.sub_section_content}
													/>
												</Grid>
											</Grid>
										);
									})}
								</Grid>
							)}

							{this.state.is_upload == '1' && (
								<Grid item xs={12}>
									<FileField
										name="policy_files"
										label="Policy Files"
										onUpload={this.onUpload}
										onDelete={this.onDelete}
										collectionName="repository"
										apiURL="/api/upload-policy-repository"
										deleteAPIURL={'/api/delete-policy-repository/'}
										isUpdate={false}
										filesLimit={1}
										acceptedFiles={documentTypes}
										updatePolicyFiles={this.updatePolicyFiles}
										gallery_files={!isEmpty(this.state.policy_files) ? this.state.policy_files : []}
										error={errors.policy_files}
									/>
								</Grid>
							)}

							<Grid item xs={12}>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Save{' '}
									{isLoading && (
										<CircularProgress className={classes.loading} thickness={4} size={18} />
									)}
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</form>
				<Dialog open={this.state.alertOpen} fullWidth maxWidth="lg" onClose={this.handleClose}>
					<DialogTitle>Add Category</DialogTitle>
					<DialogContent>
						<Grid container spacing={24}>
							<Grid item xs={12}>
								<TextField
									label="Category"
									margin="dense"
									required
									fullWidth
									name="category"
									onChange={(e) =>
										this.setState({
											category: e.target.value
										})}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="secondary" variant="contained">
							Close
						</Button>
						<Button onClick={this.handleSave} color="primary" variant="contained">
							Save {isLoading && <CircularProgress className={classes.loading} thickness={4} size={18} />}
						</Button>
					</DialogActions>
				</Dialog>

				<Alert
					isOpen={this.state.alertOpenSection}
					onClose={() => {
						this.setState({ alertOpenSection: false });
					}}
					onAgree={() => {
						this.delete();
					}}
					title="Delete Warning"
					text={'Are you sure to delete repository ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

RepositoryEditForm.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(RepositoryEditForm));
