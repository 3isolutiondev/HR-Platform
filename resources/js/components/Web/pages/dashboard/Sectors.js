import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
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
import SectorPicker from '../../common/formFields/SectorPicker';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs } from '@material-ui/core';

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
	},
	'dialog-title': {
		fontWeight:'semibold',
		height: 16
	}
});

class Sectors extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sectors: [],
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
					name: 'Name',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Set is Approved',
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
							if(this.state.tabValue === 'sector') return null;
							return <Button onClick={() => {
											this.setState({originSector: {label: tableMeta.rowData[1], value: tableMeta.rowData[0]}})
										}} color="primary" variant="contained" > 
										Merge 
									</Button> ;
						},
					}
				}
			],
			options: {
				responsive: 'scroll',
				filterType: 'checkbox',
				download: false,
				print: false,
				selectableRows: 'none',
				customToolbar: () => {
					if (can('Add Sector')) {
						return (
							<Btn
								link="/dashboard/sectors/add"
								btnText="Add New Sector"
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

				// 	const { roles } = this.state;
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
			apiURL: '/api/sectors',
			tabValue: 'sector',
			originSector: null,
			showMergingFields: false,
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.changeTabValue = this.changeTabValue.bind(this);
		this.mergeTab = this.mergeTab.bind(this);
	}

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
			this.getData(`?isApproved=${value === 'sector' ? 1 : 0}`);
		});
	}

		/**
     * mergeTab is a function that merges two sectors
	 * @param {string} originField - the value of the tab
	 * @param {string} targetFied - the event object
     */
		 mergeTab(originField, targetFied) {
			this.props.postAPI(`/api/sectors/merge`, {
				origin: originField,
				destination: targetFied
			}).then((res) => {
				const { status, message } = res.data;
				this.setState({mergingFields: null, showMergingFields: false, originSector:  null});
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.getData(`?isApproved=${this.state.tabValue === 'sector' ? 1 : 0}`);
			}).catch((err) => {
				this.setState({mergingFields: null, showMergingFields: false});
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the merge request'
				});
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
					text: message
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
			let dataTemp = [ data.id, data.name ];

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
					{/* {can('Show Sector') && (
						<CircleBtn
							link={'/dashboard/sectors/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Edit Sector') && (
						<CircleBtn
							link={'/dashboard/sectors/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete Sector') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.name,
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

		this.setState({ roles: dataInArray });
	}

	setIsApproved(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-approved', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData(this.state.tabValue === 'sector' ? '?isApproved=1' : '?isApproved=0');
				this.props.addFlashMessage({
					type: 'success',
					text: 'Approve status updated'
				});
			})
			.catch((err) => {});
	}

	render() {
		let { roles, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				{this.state.originSector && <Dialog
			open={true}
			keepMounted
			onClose={() => {this.setState({originSector: null})}}
			style={{overflow: 'visible'}}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle id="alert-dialog-slide-title" style={{minWidth: 400, maxWidth: 400}}>
				Merge <span className='dialog-title'>{this.state.originSector.label}</span>
			</DialogTitle>
			<DialogContent style={{overflow: 'visible'}}>
				<div style={{ minWidth: 400, zIndex: 1000, position: 'fixed', marginTop: 20}}>
					<SectorPicker
						name="preferred_sector"
						placeholder="Select destination sector"
						sectors={[]}
						onChange={(value, e) => {
							this.setState({mergingFields: {
								destination: value,
								origin: this.state.originSector
							}});
						}} 
						isMulti={false}
					/>
				</div>
			</DialogContent>
			<DialogActions style={{ justifyContent: 'space-between', marginLeft: 15, marginRight: 15, marginTop: 100 }}>
				<Button variant="outlined" color='primary' onClick={() => { this.setState({originSector: null}) }}>
					Cancel
				</Button>
				<Button variant="contained" color='primary' onClick={() => { this.setState({showMergingFields: true})}}>
					Continue
				</Button>
			</DialogActions>
		</Dialog>
			}
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Sector List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Sector List'} />
				</Helmet>
				<Tabs value={this.state.tabValue} 
				    onChange={this.changeTabValue}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab label={'Sectors'} value={'sector'}/>
					<Tab label={'Archived'} value={'archived'}/>
				</Tabs>
				<MUIDataTable
					title={'Sector List'}
					data={roles}
					columns={columns}
					options={options}
					download={false}
					print={false}
					
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
					text={'Are you sure to delete Sector : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
				{(this.state.mergingFields && this.state.showMergingFields) ? <Alert
					isOpen={this.state.mergingFields ? true : false}
					onClose={() => {
						this.setState({ mergingFields: null, showMergingFields: false });
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

Sectors.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
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

export default withStyles(styles)(connect('', mapDispatchToProps)(Sectors));
