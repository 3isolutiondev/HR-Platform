import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import Loadable from 'react-loadable';
import LoadingSpinner from '../../../common/LoadingSpinner';
const PhoneNumberForm = Loadable({
	loader: () => import('./PhoneNumberForm'),
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
	addMarginRight: {
		'margin-right': '8px'
	}
});

class PhoneNumberLists extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataId: '',
			openDialog: false,
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
					name: 'Phone',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Primary',
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
			options: {
				responsive: 'scroll',
				filterType: 'checkbox',
				download: false,
				print: false,
				customToolbar: () => {
					return (
						<Button
							variant="contained"
							color="primary"
							size="small"
							className={this.props.classes.addMarginRight}
							onClick={this.dialogOpen}
						>
							<Add />
							Add Phone Number
						</Button>
					);
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;
					const { records } = this.state;
					deletedRows.forEach((rowData, index) => {
						let recordId = records[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + recordId)
							.then((res) => {
								const { status, message } = res.data;
								this.props.addFlashMessage({
									type: status,
									text: message
								});
								this.getData();
								this.props.checkValidation();
								// this.props.getP11();
								this.props.updatePhoneCount();
							})
							.catch((err) => {
								this.props.addFlashMessage({
									type: 'error',
									text: 'There is an error while processing the delete request'
								});
							});
					});

					this.getData();
				}
			},
			alertOpen: false,
			name: '',
			deleteId: 0,
			records: [],
			apiURL: '/api/p11-phones/',

			dataTemp: [],
			isMounted: false
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.isPrimaryChange = this.isPrimaryChange.bind(this);
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.dialogUpdate = this.dialogUpdate.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	async getData() {
		await this.props
			.getAPI(this.state.apiURL)
			.then((res) => {
				this.dataToArray(res.data.data.phones);
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
			.deleteAPI(this.state.apiURL + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false, name: '' }, () => {
					this.getData();
					this.props.checkValidation();
					// this.props.getP11();
					this.props.updatePhoneCount();
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	isPrimaryChange(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + 'update-primary-phone', { id: dataId })
			.then((res) => {
				this.dataToArray(res.data.data);
				this.props.addFlashMessage({
					type: 'success',
					text: 'Primary phone successfully updated'
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while updating primary phone'
				});
			});
	}

	dataToArray(jsonData) {
		const { classes } = this.props;

		let dataInArray = jsonData.map((data, index) => {
			const isPrimary = (
				<div>
					<Checkbox
						checked={data.is_primary == 1 ? true : false}
						onChange={(e) => this.isPrimaryChange(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			const actions = (
				<div className={classes.actions}>
					<CircleBtn
						onClick={() => this.dialogUpdate(data.id)}
						color={classes.purple}
						size="small"
						icon={<Edit />}
					/>
					<CircleBtn
						color={classes.red}
						size="small"
						icon={<Delete />}
						onClick={() => {
							this.setState({
								deleteId: data.id,
								name: data.phone,
								alertOpen: true
							});
						}}
					/>
				</div>
			);
			let dataTemp = [ data.id, data.phone, isPrimary, actions ];

			return dataTemp;
		});

		this.setState({ records: dataInArray });
	}

	dialogOpen() {
		this.setState({ openDialog: true });
	}

	dialogClose() {
		this.setState({ openDialog: false, dataId: '' }, () => this.props.checkValidation());
	}

	dialogUpdate(id) {
		this.setState({ dataId: id }, () => this.dialogOpen());
	}

	render() {
		let { records, columns, options, alertOpen, name, dataId, openDialog } = this.state;
		return (
			<div>
				<PhoneNumberForm
					isOpen={openDialog}
					recordId={dataId}
					title="Mobile Phone Number"
					onClose={this.dialogClose}
					updateList={this.getData}
					updatePhoneCount={this.props.updatePhoneCount}
					remove={false}
					onRef={(ref) => (this.child = ref)}
				/>
				<MUIDataTable
					title="Mobile Phone Number"
					data={records}
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
					text={'Are you sure to delete your phone ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

PhoneNumberLists.propTypes = {
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

export default withStyles(styles)(connect('', mapDispatchToProps)(PhoneNumberLists));
