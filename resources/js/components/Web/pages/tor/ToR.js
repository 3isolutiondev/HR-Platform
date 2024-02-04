import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import queryString from 'query-string'
import Grid from '@material-ui/core/Grid';
import MUIDataTable from 'mui-datatables';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Star from '@material-ui/icons/Star';
import Delete from '@material-ui/icons/Delete';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import FilterListIcon from '@material-ui/icons/FilterList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import Button from '../../common/Button';
import CircleBtn from '../../common/CircleBtn';
import Alert from '../../common/Alert';
import {
	red,
	redHover,
	blue,
	blueIMMAP,
	blueIMMAPHover,
	purple,
	purpleHover,
	white,
	secondaryColor,
	recommendationColor,
	recommendationHoverColor,
	primaryColor,
	primaryColorHover,
	iMMAPSecondaryColor2022,
	iMMAPSecondaryColor2022Hover
} from '../../config/colors';
import { getAPI, deleteAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { getPDF, getWORD } from '../../redux/actions/common/PDFViewerActions';
import { can } from '../../permissions/can';
import PDFViewer from '../../common/pdf-viewer/PDFViewer';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import check_office from '../../permissions/checkImmapOffice';
import { onReset, duplicateToR } from '../../redux/actions/tor/torFormActions';
import { onChange, AddtabValue } from '../../redux/actions/tor/torTabActions';
import ToRPageFilter from './ToRPageFilter';
import isEmpty from '../../validations/common/isEmpty';
import { onChange as onChangeTorPageFilter, resetFilter } from '../../redux/actions/tor/torPageFiterAction';

class ToR extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tors: [],
			columns: [
				{
					name: 'id',
					options: {
						display: 'excluded',
						filter: false,
						sort: false
					}
				},
				{
					name: 'Title',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Cluster',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Country',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Owner',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Action',
					options: {
						filter: false,
						sort: false
					}
				}
			],
			alertOpen: false,
			alertClearRedux: false,
			open: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/tor',
			link: '',
			loadingToR: true,
			filterMobile: false,
			firstLoad: true,
			duplicatingLoading: false,
			torIndex: null
		};

		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.getJobStandard = this.getJobStandard.bind(this);
		this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
		this.setLoadingToR = this.setLoadingToR.bind(this);
		this.defaultValue = this.defaultValue.bind(this);
		this.checkQueryParameter = this.checkQueryParameter.bind(this);
		this.duplicateToR = this.duplicateToR.bind(this);

	}

	async componentDidMount()  {
		await this.getJobStandard();
		//check the query parameter
		this.checkQueryParameter();
	}

	  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   * @param {object} prevProps - previous props state
   */
	   componentDidUpdate(prevProps) {
		if (this.props.torPageFilter.isFilter && (JSON.stringify(prevProps.torPageFilter) !== JSON.stringify(this.props.torPageFilter) || prevProps.torPageFilter !== this.props.torPageFilter)) {
		  this.getTorData();
		}
	  }

	handleCheck(link) {
		const { isEdit, change } = this.props;

		if (change && !isEdit) {
			this.setState({ alertClearRedux: true, link });
		} else if (change && isEdit) {
			this.props.onReset();
			this.props.history.push(link);
		} else {
			this.props.history.push(link);
		}
	}

	handleCheckEdit(idParams, link) {
		const { change, id } = this.props;
		if (change && id == idParams) {
			this.setState({ alertClearRedux: true, link });
		} else {
			this.props.onReset();
			this.props.history.push(link, { fromEdit: true});
		}
	}

	deleteData() {
		this.props
			.deleteAPI(this.state.apiURL + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false, full_name: '' }, () => this.getTorData());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	/**
    * getJobStandard is a function to get all jobs standard
    */
    getJobStandard() {
		this.props
			.getAPI(this.state.apiURL + '/jobstandard')
			.then(async (res)  => {
				const { data} = res.data;
				await data.forEach(function(item,i){
					if(item.name === "iMMAP Standard"){
					  data.splice(i, 1);
					  data.unshift(item);
					}
				  });
				let firstJobStandard = data[0];
				const valuesQueryString = queryString.parse(this.props.location.search)
				await this.props.AddtabValue('tabs', data);
				if(!isEmpty(valuesQueryString)) {
					await this.props.onChange({tab: Number(valuesQueryString['tabValue']), page: '1'});
					await this.getTorData();	
				} else {
					await this.props.onChange({tab: firstJobStandard.job_standard_id, page: '1'});
					await this.getTorData();	
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while retrieving the ToR'
				});
			});
	}

	async duplicateToR(data, torId, index) {
		await this.setState({ duplicatingLoading: true, torIndex: index });
		this.props.onReset();
		this.props.duplicateToR(torId, this.props.history);
		this.dataToArray(data)
	}

	dataToArray(jsonData) {
		const { classes, tabFilterTor } = this.props;
		const { duplicatingLoading,  torIndex } = this.state;
		
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [
				data.id,
				data.title,
				data.cluster_seconded ? data.cluster_seconded : data.cluster,
				data.country ? data.country.name : '',
				data.created_by_immaper ? data.created_by_immaper.full_name : '',
			];

			const check_office_permission = check_office(data.immap_office_id);
			let tabData = tabFilterTor.tabs.find((dt) => dt.job_standard_id === tabFilterTor.tabValue);

			const actions = (
				<div className={classes.actions}>
					{can('Show ToR') ? (
						<CircleBtn
							color={classes.pdf}
							size="small"
							onClick={() => this.props.getPDF('/api/tor/' + data.id + '/pdf')}
							icon={<FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />}
						/>
					) : null}
					{can('Show ToR') ? (
						<CircleBtn
							color={classes.word}
							size="small"
							onClick={() => this.props.getWORD('/api/tor/'+ data.id +'/word')}
							icon={<FontAwesomeIcon icon={faFileWord} size="lg" className={classes.fontAwesome} />}
						/>
					) : null}
					{(can('Edit ToR') && (check_office_permission || tabData.sbp_recruitment_campaign == 'no' || tabData.under_sbp_program == 'no')) ? (
						<CircleBtn
							onClick={() => this.duplicateToR(jsonData, data.id, index)}
							color={classes.duplicate}
							size="small"
							icon={ duplicatingLoading && index === torIndex ? <CircularProgress className={classes.isLoading} size={22} thickness={5} /> : <FontAwesomeIcon icon={faCopy} size="lg" className={classes.fontAwesome} /> }
						/>
					) : null}
					{can('View Applicant List') ? (
						<CircleBtn
							link={'/tor/' + data.id + '/recommendations'}
							color={classes.recommendation}
							size="small"
							icon={<Star />}
						/>
					) : null}
					{(can('Edit ToR') && (check_office_permission || tabData.sbp_recruitment_campaign == 'yes' || tabData.under_sbp_program == 'yes')) ? (
						<CircleBtn
							onClick={() => this.handleCheckEdit(data.id, '/tor/' + data.id + '/edit')}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					) : null}
					{(can('Delete ToR') && (check_office_permission || tabData.sbp_recruitment_campaign == 'yes' || tabData.under_sbp_program == 'yes')) ? (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.title,
									alertOpen: true
								});
							}}
						/>
					) : null}
				</div>
			);

			dataTemp.push(actions);

			return dataTemp;
		});

		this.setState({ tors: dataInArray });
	}

/**
   * tabChange is a function to handle the change of the tab
   * @param {number} valuetab
   */
	  tabChange(valuetab) {
		const updateTab = true;
		this.props.resetFilter();
		this.props.onChange({ tab: valuetab, page: "1" })
		  .then(() => {
			this.getTorData()
		  });
		this.setState({ loadingToR: true })
	  }

    /**
   * toggleFilterMobile is a function to toggle filter in mobile
   */
	toggleFilterMobile() {
		this.setState({ filterMobile: this.state.filterMobile ? false : true });
	}
	
	/**
   * setLoadingJob is a function to show / hide loading text
   * @param {Boolean} loading
   */
	setLoadingToR(loading = false) {
		this.setState({ loadingToR: loading })
	}

	/**
   	* defaultValue is a function reset filter and tab value
   	*/
	defaultValue() {
		this.tabChange(this.props.tabFilterTor.tabs[0].job_standard_id)
		this.getTorData()
	  }

	/**
   * getTorData is a function to get tor data according to the tab and filter selected
   */
  getTorData() {;
	const { tabValue, tabs } = this.props.tabFilterTor;
    const { choosen_country, choosen_immap_office, contract_length, search, isFilter } = this.props.torPageFilter;

    const filterData = {
      tabValue,
      search,
      contract_length_min: contract_length.min,
      contract_length_max: contract_length.max,
      choosen_country,
      choosen_immap_office
    };

    // create query parameter
    const queryStringData = Object.keys(filterData).map(key => {
      if (key === "contract_length_max") {
        if (filterData[key] !== 12) {
          return key + '=' + filterData[key]
        }
      } else if (key === "contract_length_min") {
        if (filterData[key] !== 0) {
          return key + '=' + filterData[key]
        }
      } else if (key === "tabValue") {
        if (filterData[key] !== 0) {
          return key + '=' + filterData[key]
        }
      } else if (!isEmpty(filterData[key])) {
        if (key === "choosen_country" || key === "choosen_immap_office") {
          return filterData[key].map((data) => key + '=' + data).join('&')
        } else {
          return key + '=' + filterData[key]
        }
      }
    });

    const queryString = queryStringData.filter(function (element) {
      return element !== undefined;
    }).join('&');

    let tabData = tabs.find(
      (dt) => dt.job_standard_id === tabValue
    );
    
    this.props.onChange({ tab: tabData.job_standard_id }).then(() => {
        if (isFilter) {
			this.props.postAPI(this.state.apiURL + '/' + tabData.job_standard_id + '/all', filterData)
			.then((res) => {
				this.dataToArray(res.data.data);
				this.setState({ loadingToR: false})
				if (!isEmpty(queryString)) {
				  this.props.history.push({
					pathname: '/tor',
					search: queryString,
				  })
				} else {
				  this.props.history.push('/tor')
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
        } else
        {
			this.props.postAPI(this.state.apiURL + '/' + tabData.job_standard_id + '/all', filterData)
			.then((res) => {
				this.dataToArray(res.data.data);
				this.setState({ loadingToR: false})
				if (!isEmpty(queryString)) {
				  this.props.history.push({
					pathname: '/tor',
					search: queryString,
				  })
				} else {
				  this.props.history.push('/tor')
				}
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
        }

      });
  }

   /**
   * checkQueryParameter is a function check query parameter on the url
   */
	checkQueryParameter() {
		const valuesQueryString = queryString.parse(this.props.location.search)

		// check if empty data querystring
		if (!('search' in valuesQueryString)) {
		  this.props.onChangeTorPageFilter('search', '')
		}
		if (!('contract_length_min' in valuesQueryString)) {
		  const tempContractLength = this.props.torPageFilter.contract_length
		  tempContractLength.min = 0
		  this.props.onChangeTorPageFilter('contract_length', tempContractLength)
		}
		if (!('contract_length_max' in valuesQueryString)) {
		  const tempContractLength = this.props.torPageFilter.contract_length
		  tempContractLength.max = 24
		  this.props.onChangeTorPageFilter('contract_length', tempContractLength)
		}
		if (!('choosen_country' in valuesQueryString)) {
		  this.props.onChangeTorPageFilter('countries', [])
		}
		if (!('choosen_immap_office' in valuesQueryString)) {
		  this.props.onChangeTorPageFilter('choosen_immap_office', [])
		}
		if (!('job_status' in valuesQueryString)) {
		  this.props.onChangeTorPageFilter('job_status', [])
		}
	
		// querystring map
		Object.keys(valuesQueryString).map(key => {
		  if (key === "search") {
			this.props.onChangeTorPageFilter(key, valuesQueryString[key])
		  } else if (key === "contract_length_min") {
			const tempContractLength = this.props.torPageFilter.contract_length
			tempContractLength.min = Number(valuesQueryString[key])
			this.props.onChangeTorPageFilter('contract_length', tempContractLength)
		  } else if (key === "contract_length_max") {
			const tempContractLength = this.props.torPageFilter.contract_length
			tempContractLength.max = Number(valuesQueryString[key])
			this.props.onChangeTorPageFilter('contract_length', tempContractLength)
		  } else if (key === "choosen_country") {
			if (typeof valuesQueryString[key] === "string") {
			  this.props.onChangeTorPageFilter(key, [valuesQueryString[key]])
			} else {
			  this.props.onChangeTorPageFilter(key, valuesQueryString[key])
			}
		  } else if (key === "choosen_immap_office") {
			if (typeof valuesQueryString[key] === "string") {
			  this.props.onChangeTorPageFilter(key, [valuesQueryString[key]])
			} else {
			  this.props.onChangeTorPageFilter(key, valuesQueryString[key])
			}
		  }
		})
	  }

	render() {
		let { tors, columns, alertOpen, name, alertClearRedux, filterMobile, loadingToR  } = this.state;
		const { tabFilterTor, classes, width } = this.props;
		const { tabValue, tabs } = tabFilterTor;
		let tabData = tabs.find((dt) => dt.job_standard_id === tabValue);
		
		const options = {
			responsive: 'scroll',
			filterType: 'checkbox',
			download: false,
			print: false,
			customToolbar: () => {
				if (can('Add ToR')) {
					return (
						<Button
							btnText="Add New ToR"
							btnStyle="contained"
							color="primary"
							size="small"
							icon={<Add />}
							onClick={() => this.handleCheck('/tor/add')}
						/>
					);
				}

				return false;
			},
			onRowsDelete: (rows) => {
				let deletedRows = rows.data;

				const { tors } = this.state;
				deletedRows.forEach((rowData, index) => {
					let recordId = tors[rowData.dataIndex][0];

					this.props
						.deleteAPI(this.state.apiURL + '/' + recordId)
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
				});

				this.getTorData();
			},
			textLabels: {
				body: {
					noMatch: this.state.loadingToR ?
					   <CircularProgress thickness={5} size={22} className={this.props.classes.loading} /> :
					   "Sorry, there is no matching ToR to display"
				},
			}
		};

		let sbpTab = typeof tabData != "undefined" ? tabData.sbp_recruitment_campaign : 'no';
		let alertTab = typeof tabData != "undefined" ? tabData.under_sbp_program : 'no';
		
		return (
			<Grid container spacing={24}>
				<Helmet>
					<title>{APP_NAME + '- ToR'}</title>
					<meta name="description" content={APP_NAME + ' ToR'} />
				</Helmet>
				{width != 'sm' && width != 'xs' && (
				<Grid item xs={12} sm={12} md={3}>
					<ToRPageFilter sbpTab={sbpTab} alertTab={alertTab } setLoadingToR={this.setLoadingToR} reseter={() => this.defaultValue()} />
				</Grid>
				)}
				<Grid item
					  xs={12}
					  sm={12}
					  md={9}
					  className={width == 'sm' || width == 'xs' ? classes.torListContainer : ''}>
					<Tabs
					    value={tabValue}
						indicatorColor="primary"
						textColor="primary"
						onChange={(e, v) => { this.tabChange(v) }}
						variant="scrollable"
						scrollButtons="auto"
					>
						{tabs.map((value) => (
							<Tab key={value.id} label={value.name} value={value.job_standard_id} classes={{ root: classes.tab, wrapper: classes.tabWrapper }}/>
						))}
					</Tabs>
				<Grid item xs={12}>
					<MUIDataTable
						title={'ToR List'}
						data={tors}
						columns={columns}
						options={options}
						download={false}
						print={false}
					/>

					<PDFViewer />
					<Alert
						isOpen={alertClearRedux}
						onClose={() => {
							this.setState({ alertClearRedux: false }, () => {
								this.props.onReset();
								this.props.history.push(this.state.link, { fromEdit: true});
							});
						}}
						onAgree={() => {
							this.setState({ alertClearRedux: false }, () => this.props.history.push(this.state.link, { fromEdit: true}));
						}}
						title="Draft ToR found"
						text={'Would you like to load it?'}
						closeText="No"
						AgreeText="Yes"
						withOutBackDropOnClose={true}
					/>
					<Alert
						isOpen={alertOpen}
						onClose={() => {
							this.setState({ alertOpen: false });
						}}
						onAgree={() => {
							this.deleteData();
						}}
						title="Delete Warning"
						text={'Are you sure to delete tor : ' + name + ' ?'}
						closeText="Cancel"
						AgreeText="Yes"
					/>
				</Grid>
			  </Grid>
			  {(width == 'sm' || width == 'xs') && (
				<Fab
					variant="extended"
					color="primary"
					aria-label="Delete"
					className={classes.filterBtn}
					onClick={this.toggleFilterMobile}
				>
					<FilterListIcon className={classes.extendedIcon} />
								Filter
				</Fab>
				)}
			 {(width == 'sm' || width == 'xs') && (
				<Drawer
					variant="persistent"
					anchor="bottom"
					open={filterMobile}
					classes={{
					paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
					}}
				>
					<div className={classes.mobileFilter}>
					<ToRPageFilter setLoadingToR={this.setLoadingToR} reseter={() => this.defaultValue()} />
					</div>
				</Drawer>
				)}
			</Grid>
		);
	}
}

ToR.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	getPDF: PropTypes.func.isRequired,
	getWORD: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired,
	duplicateToR: PropTypes.func.isRequired,
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
 const styles = (theme) => ({
	actions: {
		width: 300
	},
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			'background-color': redHover
		}
	},
	blue: {
		'background-color': blue,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	},
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			'background-color': purpleHover
		}
	},
	recommendation: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	pdf: {
		'background-color': primaryColor,
		color: white,
		'&:hover': {
			'background-color': primaryColorHover
		}
	},
	word: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	fontAwesome: {
		width: '1.1em !important'
	},
  tab: {
    whiteSpace: "nowrap !important"
  },
  tabWrapper: {
    width: "auto !important",
  },
  torListContainer: {
    marginBottom: theme.spacing.unit * 5
  },
  filterBtn: {
    margin: theme.spacing.unit,
    position: 'fixed',
    zIndex: 9999999,
    bottom: theme.spacing.unit * 6,
    left: '49%',
    transform: 'translateX(-51%)',
    color: primaryColor + ' !important',
    'background-color': white + ' !important',
    border: `1px solid ${primaryColor} !important`
  },
  filterDrawer: {
    height: '100%',
    'padding-left': theme.spacing.unit * 3,
    'padding-right': theme.spacing.unit * 3
  },
  filterDrawerHide: {
    bottom: 'auto'
  },
  mobileFilter: {
    height: '100%',
    'margin-top': theme.spacing.unit * 3
  },
  loading: {
	marginLeft: theme.spacing.unit,
	marginRight: theme.spacing.unit
  },
  duplicate: {
	'background-color': iMMAPSecondaryColor2022,
	color: white,
	'&:hover': {
		'background-color': iMMAPSecondaryColor2022Hover
	}
 }
});

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user,
	change: state.torForm.change,
	isEdit: state.torForm.isEdit,
	id: state.torForm.id,
	tabFilterTor: state.tabFilterTor,
	torPageFilter: state.torPageFilter,
	tabFilterTor: state.tabFilterTor
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	deleteAPI,
	addFlashMessage,
	getPDF,
	getWORD,
	onReset,
	onChange,
	AddtabValue,
	postAPI,
	onChangeTorPageFilter,
	resetFilter,
	duplicateToR
};
export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ToR)));
