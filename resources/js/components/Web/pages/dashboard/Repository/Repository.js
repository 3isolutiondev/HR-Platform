import React, { Component } from 'react';
import classname from 'classnames';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { withStyles } from '@material-ui/core/styles';

import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

import { primaryColor, white } from '../../../config/colors';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';

import Btn from '../../../common/Btn';
import Add from '@material-ui/icons/Add';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';

import InputBase from '@material-ui/core/InputBase';

import Document from './ListSearchDocuments';
import { CircularProgress } from '@material-ui/core';
import isEmpty from '../../../validations/common/isEmpty';
import { can } from '../../../permissions/can';

/** v2 */
import SelectField from '../../../common/formFields/SelectField';
import TreeContainer from './parts-v2/TreeContainer';
import { setToggleEditCategoryDialog } from '../../../redux/actions/policy/policyActions'

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 3
	},
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
	addMarginBottom: {
		'margin-bottom': '.5em'
	},
	addMarginRight: {
		marginRight: theme.spacing.unit
	},
	iconBtn: {
		verticalAlign: 'middle'
	},
	noStyleInList: {
		'list-style-type': 'none !important'
	},
	primaryColor: {
		color: primaryColor
	},

	searchroot: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400
	},
	searchinput: {
		marginLeft: 12,
		flex: 1
	},
	searchiconButton: {
		padding: 10
	},
	searchdivider: {
		height: 28,
		margin: 4
	},
	displayBlock: {
		display: 'block'
	},
	loading: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: white
	}
});

class Repository extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEdit: false,
			category: '',
			content: '',
			categoryvalue: '',
			isValid: false,
			errors: {},
			datarepo: [],
			txtSearch: '',
			apiURL: '/api/repository/',
			apiSearch: '/api/repository/search/',
			searchable: false,
			id: '',
			name: '',
			valueTab: '2',
			alertOpen: false,

			open: false,
			cat_id: '',
			type: '2',
			category: '',
			status: '0',
			categoryLoading: false,
			categoryEdit: false,
			categoryErrors: {},
      categoriesByType: [],
      parent_category: ''
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.isValid = this.isValid.bind(this);
		this.openEditCategory = this.openEditCategory.bind(this);
		this.searchOnChange = this.searchOnChange.bind(this);
    this.getCategoriesByType = this.getCategoriesByType.bind(this);
	}

  componentDidUpdate(prevProps) {
    if (prevProps.openEditCategoryDialog !== this.props.openEditCategoryDialog)  {
      if (this.props.openEditCategoryDialog && !isEmpty(this.props.editCategory)) {
        this.openEditCategory(this.props.editCategory)
      }
    }
  }

	isValid() {
		let categoryErrors = {};

		if (isEmpty(this.state.category)) {
			categoryErrors.category = 'Category name is required';
			this.setState({ categoryErrors });
			return false;
		}

		this.setState({ categoryErrors: {} });
		return true;
	}

	handleOpen() {
    this.getCategoriesByType();
		this.setState({ open: true }, () => this.isValid());
	}

	handleClose() {
		this.setState({
			cat_id: '',
			open: false,
			type: '2',
			category: '',
			status: '0',
			categoryLoading: false,
			categoryEdit: false,
			categoryErrors: {},
      categoriesByType: [],
      parent_category: ''
		}, () => this.props.setToggleEditCategoryDialog());
	}

	searchOnChange(e) {
		let searchdata = {
			txtSearch: e.target.value
		};
		if (isEmpty(e.target.value)) {
			searchdata.searchable = false;
		}
		this.setState(searchdata);
	}

	async handleSave() {
		const valid = await this.isValid();

		if (valid) {
			this.setState({ categoryLoading: true }, () => {
				let recordData = {
          category: this.state.category,
          type: this.state.type,
          status: this.state.status,
          parent_id: isEmpty(this.state.parent_category) ? null : this.state.parent_category.value
        };
				let apiURL = '/api/repository-category/';

				if (this.state.categoryEdit) {
					recordData._method = 'PUT';
					recordData.id = this.state.cat_id;
					apiURL = apiURL + this.state.cat_id;
				}

				this.props
					.postAPI(apiURL, recordData)
					.then((res) => {
						this.setState({ categoryLoading: false, open: false }, () => {
							const { status, message } = res.data;

							this.props.addFlashMessage({
								type: status,
								text: message
							});

							this.setState(
								{
									cat_id: '',
									type: '2',
									category: '',
									status: '0',
									categoryLoading: false,
									categoryEdit: false,
									categoryErrors: {},
                  parent_category: ''
								},
								() => {
                  this.props.setToggleEditCategoryDialog()
                  this.getCategoriesByType();
									this.child.getCategory();
								}
							);
						});
					})
					.catch((err) => {
						this.props.addFlashMessage({
							type: 'error',
							text: 'There is an error while processing the request'
						});
					});
			});
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error in the form'
			});
		}
	}

	async openEditCategory(categoryData) {
    await this.getCategoriesByType();
    const parent_category = this.state.categoriesByType.filter(cat => cat.value == categoryData.parent_id)
		this.setState({
			cat_id: categoryData.id,
			category: categoryData.name,
			type: categoryData.type.toString(),
			status: categoryData.status.toString(),
      parent_category,
			open: true,
			categoryEdit: true
		}, () => this.isValid());
	}

	handleSearch(e) {
    if (e !== 'reload') {
      e.preventDefault();
    }
		if (!this.state.txtSearch) {
			this.setState({
				searchable: false
			});

			return;
		}

		this.setState({
			searchable: true
		});

		let recordData = {
			txtSearch: this.state.txtSearch
		};

		this.props
			.postAPI(this.state.apiSearch, recordData)
			.then((res) => {
				if (res.data.data.length > 0) {
					let response = res.data.data.map((data) => {
						return {
							id: data.id,
							name: data.name,
							file_name: data.file_name,
							file_url: data.file_url,
							status: data.status,
							category_status: data.category.status,
							category_name: data.category.name,
							category_type: data.category.type,
                            full_category: data.full_category
						};
					});

					this.setState({
						datarepo: response
					});
				} else {
					this.setState({
						datarepo: []
					});
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}

  getCategoriesByType() {
    return this.props.getAPI('/api/repository-category/category-by-type/' + this.state.type)
    .then(res => {
      return this.setState({ categoriesByType: res.data.data })
    })
    .catch(err => {
      return this.setState({ categoriesByType: [] })
    })
  }

  setScrollHeight() {
    setTimeout(() => {
      let element = document.getElementById("dialogContent")
      if (!isEmpty(element.scrollHeight)) {
        if (element.scrollHeight !== element.scrollTop) {
          element.scrollTop = element.scrollHeight
        }
      }
    }, 25)
  }


	render() {
		const { classes } = this.props;
		const { categoryErrors } = this.state;
		const showAddBtn = can('Add Repository') || can('Set as Admin') ? true : false;
		return (
			<Card>
				<CardContent>
					<Grid container spacing={24}>
						<Helmet>
							<title>{APP_NAME + ' - Policy Repository'}</title>
							<meta name="description" content={APP_NAME + ' Policy Repository'} />
						</Helmet>

						<Grid
							item
							xs={12}
							sm={12}
							md={showAddBtn ? 6 : 12}
							lg={showAddBtn ? 8 : 12}
							xl={showAddBtn ? 8 : 12}
						>
							<Typography variant="h6" component="h3">
								Policy Repository
							</Typography>
						</Grid>
						{showAddBtn && (
							<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
								<Button color="secondary" variant="contained" fullWidth onClick={this.handleOpen}>
									<Add style={{ marginRight: '4px' }} />{' '}
									<FolderIcon fontSize="small" className={classes.addMarginRight} /> Add Category
								</Button>
							</Grid>
						)}
						{showAddBtn && (
							<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
								<Btn
									link="/policy-repository/add"
									btnText="Add Document"
									btnStyle="contained"
									color="primary"
									size="small"
									icon={
										<div>
											<Add className={classes.iconBtn} />{' '}
											<DescriptionIcon
												fontSize="small"
												className={classname(classes.iconBtn, classes.addMarginRight)}
											/>
										</div>
									}
									fullWidth
								/>
							</Grid>
						)}
						<Grid item xs={12}>
							<Paper
								component="form"
								style={{ width: '100%', padding: 0 }}
								className={classes.searchroot}
								onSubmit={this.handleSearch}
							>
								<InputBase
									className={classes.searchinput}
									placeholder="Find document"
									inputProps={{ 'aria-label': 'Find document' }}
									onChange={this.searchOnChange}
								/>
								<IconButton
									onClick={this.handleSearch}
									className={classes.searchiconButton}
									aria-label="search"
								>
									<SearchIcon />
								</IconButton>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="p">
								Disclaimer: These documents are for internal use only - not for external distribution. These documents are the property of iMMAP. It contains proprietary and confidential information.
							</Typography>
						</Grid>

						<Grid item xs={12}>
							{!this.state.searchable ? (
								<div>
									<Tabs
										value={this.state.valueTab}
										onChange={(e, v) =>
											this.setState({
												valueTab: v
											})}
										indicatorColor="primary"
										textColor="primary"
										variant="scrollable"
										scrollButtons="auto"
									>
										<Tab value="2" label="HR" />
										<Tab value="1" label="Finance" />
										<Tab value="3" label="Security" />
										<Tab value="4" label="Communications" />
										<Tab value="5" label="IT" />
									</Tabs>
                  <TreeContainer
                    repoType={this.state.valueTab}
                    onRef={ref => this.child = ref}
                  />
								</div>
							) : (
                <div>
                  {this.state.datarepo.length > 0 ? (
                    <Document
                      repo_category={this.state.datarepo}
                      openEditCategory={this.openEditCategory}
                      search={this.handleSearch}
                    />
                  ) : (
                      <Grid item xs={12} style={{ margin: 'auto', width: '20%' }}>
                        <div>
                          <FormLabel>Sorry, no matching records found</FormLabel>
                        </div>
                      </Grid>
                    )}
                </div>
              )}
						</Grid>
					</Grid>
				</CardContent>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
					maxWidth="lg"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={{ paddingBottom: '8px' }}>
						{this.state.categoryEdit ? 'Edit ' : 'Add '} Category
					</DialogTitle>
					<DialogContent id="dialogContent" style={{ paddingBottom: '8px' }}>
						<TextField
							label="Category Name"
							margin="dense"
							required
							fullWidth
							name="category"
							value={this.state.category}
							onChange={(e) =>
								this.setState(
									{
										category: e.target.value
									},
									() => this.isValid()
								)}
							error={!isEmpty(categoryErrors.category) ? true : false}
							helperText={categoryErrors.category}
						/>
						<FormGroup style={{ marginTop: '8px' }}>
							<FormLabel>Type</FormLabel>
							<RadioGroup
								className={classes.displayBlock}
								value={this.state.type}
								onChange={(e) =>
									this.setState({
										type: e.target.value
									}, () => this.getCategoriesByType())}
							>
								<FormControlLabel value="2" control={<Radio />} label="HR" />
								<FormControlLabel value="1" control={<Radio />} label="Finance" />
								<FormControlLabel value="3" control={<Radio />} label="Security" />
								<FormControlLabel value="4" control={<Radio />} label="Communications" />
								<FormControlLabel value="5" control={<Radio />} label="IT" />
							</RadioGroup>
						</FormGroup>
            <SelectField
              label="Parent Category"
              margin="dense"
              options={this.state.categoriesByType}
              value={this.state.parent_category}
              placeholder="Choose Parent Category"
              isMulti={false}
              name="parent_category"
              fullWidth
              onChange={(val, e) => this.setState({ parent_category: val })}
              allowDanger={true}
              onMenuOpenOrClose={this.setScrollHeight}
            />
						<FormGroup style={{ marginTop: '8px' }}>
							<FormLabel>Status</FormLabel>
							<RadioGroup
								className={classes.displayBlock}
								value={this.state.status}
								onChange={(e) =>
									this.setState({
										status: e.target.value
									})}
							>
								<FormControlLabel value="0" control={<Radio />} label="Draft" />
								<FormControlLabel value="1" control={<Radio />} label="Publish" />
							</RadioGroup>
						</FormGroup>
					</DialogContent>
					<DialogActions styles={{ paddingTop: 0 }}>
						<Button onClick={this.handleClose} color="secondary" variant="contained">
							Close
						</Button>
						<Button onClick={this.handleSave} color="primary" variant="contained">
							Save{' '}
							{this.state.categoryLoading && (
								<CircularProgress thickness={5} size={22} className={classes.loading} />
							)}
						</Button>
					</DialogActions>
				</Dialog>
			</Card>
		);
	}
}

Repository.propTypes = {
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	setToggleEditCategoryDialog: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
  openEditCategoryDialog: PropTypes.bool.isRequired,
  // editCategory: PropTypes.oneOfType([ PropTypes.oneOf[''], PropTypes.object, PropTypes.array ])
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
	addFlashMessage,
  setToggleEditCategoryDialog
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
  openEditCategoryDialog: state.policy.openEditCategoryDialog,
  editCategory: state.policy.editCategory
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Repository));
