import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../../common/Btn';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

/**
 * set up styles for this component
 * @ignore
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

class IMTestTemplates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			im_test_templates: [],
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
					name: 'Set is Default',
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
				}
			],
			options: {
				responsive: 'scroll',
				filterType: 'checkbox',
				download: false,
				print: false,
				selectableRows: 'none',
				customToolbar: () => {
					if (can('Add IM Test Template')) {
						return (
							<Btn
								removeLocalStorage="imTestTemplate"
								link="/dashboard/im-test-templates/add"
								btnText="Add New IM Test Template"
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
			apiURL: '/api/im-test-templates'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.props
			.getAPI(this.state.apiURL)
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

			const setIsDefault = (
				<div>
					<Checkbox
						checked={data.is_default === 1 ? true : false}
						onChange={(e) => this.setIsDefault(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			dataTemp.push(setIsDefault);

			const actions = (
				<div className={classes.actions}>
					{/* {can('Show IM Test Template') && (
						<CircleBtn
							link={'/dashboard/im-test-templates/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Edit IM Test Template') && (
						<CircleBtn
							link={'/dashboard/im-test-templates/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete IM Test Template') && (
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

	setIsDefault(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-default', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData();
				this.props.addFlashMessage({
					type: 'success',
					text: 'Default status updated'
				});
			})
			.catch((err) => {});
	}

	render() {
		let { roles, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > IM Test Template List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > IM Test Template List'} />
				</Helmet>
				<MUIDataTable
					title={'IM Test Template List'}
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
					text={'Are you sure to delete IM Test Template : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

IMTestTemplates.propTypes = {
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

export default withStyles(styles)(connect('', mapDispatchToProps)(IMTestTemplates));
