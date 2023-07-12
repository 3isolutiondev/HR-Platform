import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { withStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../common/Btn';
import { getAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import { red, blue, purple, white, secondaryColor } from '../../config/colors';
import CircleBtn from '../../common/CircleBtn';
import Alert from '../../common/Alert';
import { can } from '../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

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
class Contract extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contract: [],
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
					name: 'Name',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Email',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Contract Start',
					options: {
						filter: false,
						sort: true
					}
				},
				{
					name: 'Contract End',
					options: {
						filter: false,
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
				filterType: 'checkbox',
				download: false,
				print: false,
				customToolbar: () => {
					if (can('Add Contract')) {
						return (
							<Btn
								link="/contract/add"
								btnText="Add Contract"
								btnStyle="contained"
								color="primary"
								size="small"
								icon={<Add />}
							/>
						);
					}

					return false;
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { contract } = this.state;
					deletedRows.forEach((rowData, index) => {
						let contractId = contract[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + contractId)
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

					this.getData();
				}
			},
			apiURL: '/api/contract',
			alertOpen: false,
			name: '',
			deleteId: 0
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

	dataToArray(jsonData) {
		const { classes } = this.props;
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [
				data.id,
				data.title,
				data.user.full_name,
				data.user.email,
				data.date_start,
				data.date_end
			];

			const actions = (
				<div className={classes.actions}>
					{can('Show Contract') && (
						<CircleBtn
							link={'/contract/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)}
					{can('Edit Contract') && (
						<CircleBtn
							link={'/contract/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete Contract') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.template_name,
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

		this.setState({ contract: dataInArray });
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

	render() {
		let { contract, columns, options, alertOpen, name } = this.state;
		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Contract List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Contract List'} />
				</Helmet>
				<MUIDataTable
					title={'Contract List'}
					data={contract}
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
					text={'Are you sure to delete contract template : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

Contract.propTypes = {
	// user: PropTypes.object.isRequired,
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
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(Contract));
