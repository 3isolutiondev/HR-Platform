import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../common/Btn';
import CircleBtn from '../../common/CircleBtn';
import Alert from '../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { Tab, Tabs } from '@material-ui/core';
import AutoCompleteSingleValue from '../../common/formFields/AutoCompleteSingleValue';
import FieldOfWorkPicker from '../../common/formFields/FieldOfWorkPicker';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	actions: {
		width: 144
	},
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			color: secondaryColor
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
			color: secondaryColor
		}
	}
});

class FieldOfWorks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldOfWorks: [],
			mergingFields: null,
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
					name: 'Area of Expertise',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Approved',
					options: {
						filter: false,
						sort: false
					}
				},
				{
					name: 'Action',
					options: {
						filter: false,
						sort: false
					}
				},
				{
					name: 'Merge',
					options: {
						filter: false,
						sort: false,
						customBodyRender: (valueDestination, tableMeta, updateValue) => {
							if(this.state.tabValue === 'area-of-expertise') return null;
							return <div style={{minWidth: '120px', marginLeft: 0, zIndex: 100 +tableMeta.tableData.length - tableMeta.rowIndex}}>
										<div style={{ zIndex: 100 +tableMeta.tableData.length - tableMeta.rowIndex, width: '100%' }}>
												<FieldOfWorkPicker
													name="preferred_field_of_work"
													field_of_works={[]}
													onChange={(value, e) => {
														this.setState({mergingFields: {
															destination: value,
															origin: {label: tableMeta.rowData[1], value: tableMeta.rowData[0]}
														}});
													}} 
													isMulti={false}
												/>
										</div>
								</div>
						},
					},
				}
			],
			options: {
				responsive: 'scroll',
				filterType: 'checkbox',
				download: false,
				print: false,
				selectableRows: 'none',
				customToolbar: () => {
					if (can('Add Field of Work')) {
						return (
							<Btn
								link="/dashboard/field-of-works/add"
								btnText="Add New Area of Expertise"
								btnStyle="contained"
								color="primary"
								size="small"
								icon={<Add />}
							/>
						);
					}

					return false;
				}
				// onRowsDelete: (rows) => {
				// 	let deletedRows = rows.data;

				// 	const { fieldOfWorks } = this.state;
				// 	deletedRows.forEach((rowData, index) => {
				// 		let userId = roles[rowData.dataIndex][0];

				// 		this.props
				// 			.deleteAPI(this.state.apiURL + '/' + userId)
				// 			.then((res) => {
				// 				const { status, message } = res.data;
				// 				this.props.addFlashMessage({
				// 					type: status,
				// 					text: message
				// 				});
				// 			})
				// 			.catch((err) => {
				// 				this.props.addFlashMessage({
				// 					type: 'error',
				// 					text: 'There is an error while processing the delete request'
				// 				});
				// 			});
				// 	});

				// 	this.getData();
				// }
			},
			alertOpen: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/field-of-works',
			tabValue: 'area-of-expertise'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.setIsApproved = this.setIsApproved.bind(this);
		this.changeTabValue = this.changeTabValue.bind(this);
		this.mergeTab = this.mergeTab.bind(this);
	}

	/**
     * mergeTab is a function that merges two field of works
	 * @param {string} originField - the value of the tab
	 * @param {string} targetFied - the event object
     */
	mergeTab(originField, targetFied) {
		this.props.postAPI(`/api/field-of-works/merge`, {
			origin: originField,
			destination: targetFied
		}).then((res) => {
			const { status, message } = res.data;
			this.setState({mergingFields: null});
			this.props.addFlashMessage({
				type: status,
				text: "Area of expertise merged successfully"
			});
			this.getData(`?isApproved=${this.state.tabValue === 'area-of-expertise' ? 1 : 0}`);
		}).catch((err) => {
			this.setState({mergingFields: null});
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while processing the merge request'
			});
		});
	}

	/**
     * componentDidMount is a lifecycle function called where the component is mounted
     */
	componentDidMount() {
		this.getData();
	}

	/**
     * ChangeTabValue is a function that gets triggered when the value of the tab changes
	 * @param {string} value - the value of the tab
	 * @param {object} event - the event object
     */
	changeTabValue(e, value) {
		this.setState({ tabValue: value }, () => {
			this.getData(`?isApproved=${value === 'area-of-expertise' ? 1 : 0}`);
		});
	}

	getData(query='?isApproved=1') {
		this.props
			.getAPI(this.state.apiURL+query)
			.then((res) => {
				this.dataToArray(res.data.data);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}

	deleteData() {
		this.props
			.deleteAPI(this.state.apiURL + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: "Area of expertise deleted successfully"
				});
				this.setState({ deleteId: 0, alertOpen: false, full_name: '' }, () => this.getData());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	dataToArray(jsonData) {
		const { classes } = this.props;
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [ data.id, data.field ];

			const setIsApproved = (
				<div>
					<Checkbox
						checked={data.is_approved === 1 ? true : false}
						onChange={(e) => this.setIsApproved(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			dataTemp.push(setIsApproved);

			const actions = (
				<div className={classes.actions}>
					{/* {can('Show Field of Work') && (
						<CircleBtn
							link={'/dashboard/field-of-works/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Edit Field of Work') && (
						<CircleBtn
							link={'/dashboard/field-of-works/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete Field of Work') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.field,
									alertOpen: true
								});
							}}
						/>
					)}
				</div>
			);

			dataTemp.push(actions);

			return dataTemp;
		});

		this.setState({ fieldOfWorks: dataInArray });
	}

	setIsApproved(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-approved', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData('?isApproved=0');
				this.props.addFlashMessage({
					type: 'success',
					text: 'Approve status updated'
				});
			})
			.catch((err) => {});
	}

	render() {
		let { fieldOfWorks, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Area of Expertise List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Area of Expertise List'} />
				</Helmet>
				<Tabs value={this.state.tabValue} 
				    onChange={this.changeTabValue}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab label={'Area of Expertise'} value={'area-of-expertise'}/>
					<Tab label={'Archived'} value={'archived'}/>
				</Tabs>
				<MUIDataTable
					title={'Area of Expertise List'}
					data={fieldOfWorks}
					columns={columns}
					options={options}
					download={false}
					print={false}
					tableBodyHeight="100%"
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
					text={'Are you sure to delete area of expertise : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
				{this.state.mergingFields ? <Alert
					isOpen={this.state.mergingFields ? true : false}
					onClose={() => {
						this.setState({ mergingFields: null });
					}}
					onAgree={() => {
						this.mergeTab(this.state.mergingFields.origin.value, this.state.mergingFields.destination.value)
					}}
					title="Merge Warning"
					text={'This will merge ' + this.state.mergingFields.origin.label + ' into '+ this.state.mergingFields.destination.label+' and permanently remove ' + this.state.mergingFields.origin.label+'. Would you like to continue ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/> : null}
			</div>
		);
	}
}

FieldOfWorks.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	deleteAPI,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FieldOfWorks));
