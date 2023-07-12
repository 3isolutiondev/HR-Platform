import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import DependentForm from './DependentForm';

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
	addMarginRight: {
		'margin-right': '8px'
	}
});

class DependentLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			countries: [],
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
					name: 'Name',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Date of Birth',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Relationship',
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
							Add Dependents
						</Button>
					);
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { dependents } = this.state;
					deletedRows.forEach((rowData, index) => {
						let dependentId = dependents[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + dependentId)
							.then((res) => {
								const { status, message } = res.data;
								this.props.addFlashMessage({
									type: status,
									text: message
								});
								this.getData();
								this.props.checkValidation();
								// this.props.getP11();
								this.props.updateDependent();
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
			dependents: [],
			apiURL: '/api/p11-dependents'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.dialogOpen = this.dialogOpen.bind(this);
		this.dialogClose = this.dialogClose.bind(this);
		this.dialogUpdate = this.dialogUpdate.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	async getData() {
		await this.props
			.getAPI(this.state.apiURL + '/lists')
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
				this.setState({ deleteId: 0, alertOpen: false, full_name: '' }, () => {
					this.getData();
					this.props.checkValidation();
					// this.props.getP11();
					this.props.updateDependent();
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
			let dataTemp = [ data.id, data.full_name, data.date_of_birth, data.relationship ];

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
								name: data.full_name,
								alertOpen: true
							});
						}}
					/>
				</div>
			);

			dataTemp.push(actions);

			return dataTemp;
		});

		this.setState({ dependents: dataInArray });
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
		let { dependents, columns, options, alertOpen, name, dataId, openDialog } = this.state;

		return (
			<div>
				<DependentForm
					isOpen={openDialog}
					recordId={dataId}
					title="Dependent"
					onClose={this.dialogClose}
					updateList={this.getData}
					updateDependent={this.props.updateDependent}
					onRef={(ref) => (this.child = ref)}
				/>
				<MUIDataTable
					title={'Dependents'}
					data={dependents}
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
					text={'Are you sure to delete your dependent with name : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

DependentLists.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
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
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DependentLists));
