import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
// import { month } from '../../../config/options';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import PreviouslySubmittedApplicationForUnForm from './PreviouslySubmittedApplicationForUnForm';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
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

class PreviouslySubmittedApplicationForUnLists extends Component {
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
					name: 'Starting Date',
					options: {
						filter: true,
						sort: true,
						customBodyRender: (value) => moment(value).format('MMMM DD, YYYY')
					}
				},
				{
					name: 'Ending Date',
					options: {
						filter: true,
						sort: true,
						customBodyRender: (value) => moment(value).format('MMMM DD, YYYY')
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
					name: 'Project',
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
							Add Experience
						</Button>
					);
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { p11_submitted_applications_for_un } = this.state;
					deletedRows.forEach((rowData, index) => {
						let submitted_application_id = p11_submitted_applications_for_un[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + submitted_application_id)
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
			p11_submitted_applications_for_un: [],
			apiURL: '/api/p11-submitted-application-in-un'
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

	getData() {
		this.props
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
			let dataTemp = [ data.id, data.starting_date, data.ending_date, data.country.name, data.project ];

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
								name:
									'Starting Date: ' +
									data.starting_date +
									', Ending Date: ' +
									data.ending_date +
									', country: ' +
									data.country.name +
									', project: ' +
									data.project,
								alertOpen: true
							});
						}}
					/>
				</div>
			);

			dataTemp.push(actions);

			return dataTemp;
		});

		this.setState({ p11_submitted_applications_for_un: dataInArray });
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
		let { p11_submitted_applications_for_un, columns, options, alertOpen, name, dataId, openDialog } = this.state;

		return (
			<div>
				<PreviouslySubmittedApplicationForUnForm
					isOpen={openDialog}
					un_organizations={this.props.un_organizations}
					recordId={dataId}
					title="Time and Organization"
					onClose={this.dialogClose}
					updateList={this.getData}
					getP11={this.props.getP11}
				/>
				<MUIDataTable
					title={'Time and Organizations'}
					data={p11_submitted_applications_for_un}
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
					text={'Are you sure to delete your time and organization with ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

PreviouslySubmittedApplicationForUnLists.propTypes = {
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

export default withStyles(styles)(
	connect(mapStateToProps, mapDispatchToProps)(PreviouslySubmittedApplicationForUnLists)
);
