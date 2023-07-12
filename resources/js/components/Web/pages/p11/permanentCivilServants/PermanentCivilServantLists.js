import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import PermanentCivilServantForm from './PermanentCivilServantForm';
import moment from 'moment';

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

class PermanentCivilServantLists extends Component {
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
					name: 'From',
					options: {
						filter: true,
						sort: true,
						customBodyRender: (value) => moment(value).format('MMMM, YYYY')
					}
				},
				{
					name: 'To',
					options: {
						filter: true,
						sort: true,
						customBodyRender: (value) => moment(value).format('MMMM, YYYY')
					}
				},
				{
					name: 'Institution',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Currently work for government',
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
							Add Permanent Civil Servant
						</Button>
					);
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { records } = this.state;
					deletedRows.forEach((rowData, index) => {
						let recordId = records[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + recordId)
							.then((res) => {
								const { status, message } = res.data;
								this.props.addFlashMessage({
									type: status,
									text: message
								});
								this.props.getP11();
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
			motherTongue: 0,
			apiURL: '/api/p11-permanent-civil-servants'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.dialogUpdate = this.dialogUpdate.bind(this);
		this.isNowChange = this.isNowChange.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.props
			.getAPI(this.state.apiURL + '/lists')
			.then((res) => {
				this.dataToArray(res.data.data);
				this.props.checkValidation();
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
				this.setState({ deleteId: 0, alertOpen: false, name: '' }, () => {
					this.getData();
					this.props.checkValidation();
					this.props.getP11();
				});
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
			let dataTemp = [ data.id, data.from, data.to, data.institution ];

			const isNowInGovernment = (
				<div>
					<Checkbox
						checked={data.is_now === 1 ? true : false}
						onChange={(e) => this.isNowChange(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			dataTemp.push(isNowInGovernment);

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
								name: data.institution,
								alertOpen: true
							});
						}}
					/>
				</div>
			);

			dataTemp.push(actions);

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

	isNowChange(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/update-is-now', { id: dataId })
			.then((res) => {
				this.dataToArray(res.data.data);
				this.props.addFlashMessage({
					type: 'success',
					text: 'Default Permanent Civil Servant successfully saved'
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while updating your default permanent civil servant'
				});
			});
	}

	render() {
		let { records, columns, options, alertOpen, name, dataId, openDialog } = this.state;

		return (
			<div>
				<PermanentCivilServantForm
					isOpen={openDialog}
					recordId={dataId}
					title="Permanent Civil Servant History"
					onClose={this.dialogClose}
					updateList={this.getData}
					getP11={this.props.getP11}
					onRef={(ref) => (this.child = ref)}
				/>
				<MUIDataTable
					title="Permanent Civil Servants"
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
					text={
						'Are you sure to delete your permanent civil servant record with institution : ' + name + ' ?'
					}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

PermanentCivilServantLists.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
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
	postAPI,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PermanentCivilServantLists));
