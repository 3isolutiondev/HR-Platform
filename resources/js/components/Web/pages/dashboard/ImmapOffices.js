import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
// import isEmpty from '../../validations/common/isEmpty';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import Btn from '../../common/Btn';
import CircleBtn from '../../common/CircleBtn';
import Alert from '../../common/Alert';
import { red, blue, purple, white, secondaryColor, primaryColor } from '../../config/colors';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
	},
	checkbox: {
		padding: 0
	}
});

class ImmapOffices extends Component {
	constructor(props) {
		super(props);
		this.state = {
			immap_offices: [],
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
					name: 'Country',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'City',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Still Active & Shown in P11',
					options: {
						filter: false,
						sort: false
					}
				},
				{
					name: 'iMMAP HQ',
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
				rowsPerPage: 10,
				rowsPerPageOptions: [ 10, 15, 25, 100 ],
				filterType: 'checkbox',
				download: false,
				print: false,
				selectableRows: 'none',
				customToolbar: () => {
					if (can('Add Immap Office')) {
						return (
							<Btn
								link="/dashboard/immap-offices/add"
								btnText="Add New iMMAP Office"
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

				// 	const { immap_offices } = this.state;
				// 	deletedRows.forEach((rowData, index) => {
				// 		let immapOfficeId = immap_offices[rowData.dataIndex][0];

				// 		this.props
				// 			.deleteAPI(this.state.apiURL + '/' + immapOfficeId)
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
			apiURL: '/api/immap-offices'
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
				this.setState({ deleteId: 0, alertOpen: false, name: '' }, () => this.getData());
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
			let dataTemp = [ data.id, data.country.name, data.city ];

			const setIsActive = (
				<div>
					<Checkbox
						checked={data.is_active === 1 ? true : false}
						onChange={(e) => this.setIsActive(data.id, e)}
						value={data.id.toString()}
						color="primary"
						className={this.props.classes.checkbox}
					/>
				</div>
			);

			dataTemp.push(setIsActive);

			const setIsHQ = (
				<div>
					<Checkbox
						checked={data.is_hq === 1 ? true : false}
						onChange={(e) => this.setIsHQ(data.id, e)}
						value={data.id.toString()}
						color="primary"
						className={this.props.classes.checkbox}
					/>
				</div>
			);

			dataTemp.push(setIsHQ);

			const actions = (
				<div className={classes.actions}>
					{/* {can('Show Immap Office') && (
						<CircleBtn
							link={'/dashboard/immap-offices/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Edit Immap Office') && (
						<CircleBtn
							link={'/dashboard/immap-offices/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete Immap Office') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.city + ' - ' + data.country.name,
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

		this.setState({ immap_offices: dataInArray });
	}

	setIsActive(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-active', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData();
				this.props.addFlashMessage({
					type: 'success',
					text: 'iMMAP Office status updated'
				});
			})
			.catch((err) => {});
	}

	setIsHQ(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-hq', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData();
				this.props.addFlashMessage({
					type: 'success',
					text: 'iMMAP Office status updated'
				});
			})
			.catch((err) => {});
	}

	getMuiTheme() {
		return createMuiTheme({
			palette: {
				primary: {
					main: primaryColor
				}
			},
			typography: {
				useNextVariants: true,
				fontFamily: "'Barlow', sans-serif",
				fontSize: 14
			},
			overrides: {
				MUIDataTableBodyCell: {
					root: {
						'&:nth-last-of-type(-n+2)': {
							height: '50px'
						}
					}
				}
			}
		});
	}

	render() {
		let { immap_offices, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > iMMAP Office List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > iMMAP Office List'} />
				</Helmet>
				<MuiThemeProvider theme={this.getMuiTheme()}>
					<MUIDataTable
						title={'iMMAP Office List'}
						data={immap_offices}
						columns={columns}
						options={options}
						download={false}
						print={false}
					/>
				</MuiThemeProvider>
				<Alert
					isOpen={alertOpen}
					onClose={() => {
						this.setState({ alertOpen: false });
					}}
					onAgree={() => {
						this.deleteData();
					}}
					title="Delete Warning"
					text={'Are you sure to delete immap office : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

ImmapOffices.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
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

export default withStyles(styles)(connect('', mapDispatchToProps)(ImmapOffices));
