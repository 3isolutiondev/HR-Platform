import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

import SelectField from '../../../common/formFields/SelectField';

import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { contractValidation } from '../../../validations/HR/contracts/contract';
import isEmpty from '../../../validations/common/isEmpty';

import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';
import TextField from '@material-ui/core/TextField';

import WysiwygField from '../../../common/formFields/WysiwygField';
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
import { white } from '../../../config/colors';
import Alert from '../../../common/Alert';

import FileField from './Dropzone/FileField';
import documentTypes from '../../../utils/documentExtensions';

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

class RepositoryForm extends Component {
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
			apiURL: '/api/repository/',
			apiCategory: '/api/repository-category/',
			apiCountry: '/api/repository/getImmapOffice',
			redirectURL: '/policy-repository/',
			status: '1',
			type: '2',
			id: '',
			name: '',
			alertOpen: false,
			alertOpenSection: false,
			isLoading: false,
			is_upload: '0',
			policy_files: [],
			policyFiles: []
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.getCategory = this.getCategory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddMore = this.handleAddMore.bind(this);
		this.delete = this.delete.bind(this);
		this.addSection = this.addSection.bind(this);
		this.setPermission = this.setPermission.bind(this);
		this.setIdOffice = this.setIdOffice.bind(this);
		this.setOfficePermission = this.setOfficePermission.bind(this);
		this.onUpload = this.onUpload.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.updatePolicyFiles = this.updatePolicyFiles.bind(this);
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				isEdit: true,
				apiContract: '/api/contract/' + this.props.match.params.id
			});
		}
	}

	componentDidMount() {
    this.isValid();
    this.getCategory();
	}

	setOfficePermission(id, e) {
		if (e.target.checked) {
			this.setState((prevState) => ({
				OfficePermission: [ id, ...prevState.OfficePermission ]
			}));
		} else {
			let index = this.state.OfficePermission.indexOf(id);
			if (index > -1) {
				this.state.OfficePermission.splice(index, 1);
			}
		}
	}

	setPermission(role, permission, e) {
		let nv = e.target.value;

		let nameofpermission = '',
			codeofrole;
		if (permission == 1) {
			nameofpermission = 'view';
		} else if (permission == 2) {
			nameofpermission = 'update';
		} else if (permission == 3) {
			nameofpermission = 'delete';
		}

		if (role === 'manager') {
			codeofrole = 2;
		} else if (role === 'all') {
			codeofrole = 3;
		}

		if (e.target.checked) {
			this.setState((prevState) => ({
				setrole: [
					...prevState.setrole,
					{
						role: role,
						permission: permission,
						nameofpermission: nameofpermission,
						codeofrole: codeofrole,
						value: nv
					}
				]
			}));
		} else {
			let arrper = this.state.setrole;
			arrper.some((item) => {
				if (item.value === nv) {
					arrper.splice(arrper.indexOf(item), 1);
				}
			});
		}
	}

	setIdOffice(id, e) {
		let nv = e.target.value;

		if (e.target.checked) {
			this.setState((prevState) => ({
				idOffice: [ id, ...prevState.idOffice ]
			}));
		} else {
			let index = this.state.idOffice.indexOf(id);
			if (index > -1) {
				this.state.idOffice.splice(index, 1);
			}
		}
	}

	delete() {
		this.setState({ alertOpenSection: false, deleteId: 0 });
		this.state.addsection.splice(this.state.levelsection, 1);
	}

	getCategory() {
		this.props.getAPI('/api/repository-category/category-by-type/' + this.state.type).then((res) => {
			this.setState({ repo_category: res.data.data });
		}).catch((err) => {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while getting the category'
			});
		});
	}

	isValid() {
		const { errors, isValid } = contractValidation(this.state);
		this.setState({ errors, isValid });
		return isValid;
	}

	handleClose() {
		this.setState({ alertOpen: false });
	}

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

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			this.isValid();
		});
	}

	addSection() {
		this.setState((prevState) => ({
			addsection: [ ...prevState.addsection, { section: '', subsection: '' } ]
		}));
		this.isValid();
	}

	handleAddMore(e) {
		this.setState({
			alertOpen: e
		});
	}

	handleChange(e) {
		let addsectionn = [ ...this.state.addsection ];
		addsectionn[e.target.a[0]][e.target.a[1]] = e.target.value;

		this.setState({ addsectionn });
	}

	onSubmit(e) {
		e.preventDefault();

		this.setState({
			isLoading: true
		});
		let {
			categoryvalue,
			addsection,
			name,
			status,
			type,
			apiURL,
			is_upload,

			policy_files
		} = this.state;

		if (isEmpty(categoryvalue)) {
			this.props.addFlashMessage({
				type: 'error',
				text: 'Please select the category'
			});

			this.setState({
				isLoading: false
			});

			return;
		}

		let recordData = {
			category: categoryvalue,

			status: status,
			type: type,
			is_upload: is_upload
		};

		if (is_upload == '0') {
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

		if (is_upload == '1') {
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
			.postAPI(apiURL, recordData)
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

	async onUpload(name, files) {
		if (!isEmpty(files)) {
			this.setState({ policy_files: files });
		} else {
			this.setState({ policy_files: [] });
		}
	}

	async onDelete(name, deleteURL, files, deletedFileId) {
    this.setState({ policy_files: [] });
	}

	async updatePolicyFiles(files) {
		this.setState({policy_files: files});
	}

	render() {
		const { classes } = this.props;
		const {
			isLoading,
			errors,
			addsection,
			name,
			repo_category,
		} = this.state;

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<Helmet>
						<title>{APP_NAME} - Add Policy / Document</title>
						<meta name="description" content={APP_NAME + ' Add Policy / Document'} />
					</Helmet>
					<Paper className={classes.paper}>
						<Grid container spacing={16} alignItems="flex-end">
							<Grid item xs={12}>
								<Typography variant="h5" component="h3">
									Add Policy / Document
								</Typography>
							</Grid>

							<Grid item xs={12} sm={12} md={6}>
								<FormLabel>Create or Upload Document ?</FormLabel>
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
										disabled={this.state.is_upload == '1' ? true : false}
										required={true}
										control={<Radio />}
										label="Draft"
									/>
									<FormControlLabel
										value="2"
										disabled={this.state.is_upload == '1' ? true : false}
										required={true}
										control={<Radio />}
										label="Publish"
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
												type: e.target.value
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
									name="valTemplate"
									fullWidth
									onChange={(e) =>
										this.setState({
											categoryvalue: e.value
										})}
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
										updatePolicyFiles={this.updatePolicyFiles}
										collectionName="repository"
										apiURL="/api/upload-policy-repository"
										deleteAPIURL="/api/delete-policy-repository"
										isUpdate={false}
										filesLimit={25}
										acceptedFiles={documentTypes}
										gallery_files={!isEmpty(this.state.policy_files) ? this.state.policy_files : []}
										error={errors.policy_files}
										maxFileSize={12582912}
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

RepositoryForm.propTypes = {
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

export default withStyles(styles)(connect('', mapDispatchToProps)(RepositoryForm));
