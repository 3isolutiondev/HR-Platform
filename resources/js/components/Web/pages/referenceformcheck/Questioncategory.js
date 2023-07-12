import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
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

class Questioncategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ndata: [],
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
					name: 'Is Default',
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
				filterType: 'dropdown',
				download: false,
				print: false,
				customToolbar: () => {
					//   if ( can("Add User") ) {
					return (
						<Btn
							link="/question-category/add"
							btnText="Add New Category"
							btnStyle="contained"
							color="primary"
							size="small"
							icon={<Add />}
						/>
					);
					//   }

					return false;
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { ndata } = this.state;
					deletedRows.forEach((rowData, index) => {
						let userId = ndata[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + userId)
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
			alertOpen: false,
			full_name: '',
			deleteId: 0,
			apiURL: '/api/reference-question-category'
		};

		this.getData = this.getData.bind(this);
		this.delete = this.delete.bind(this);
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

	delete() {
		this.props
			.deleteAPI(this.state.apiURL + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false }, () => this.getData());
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
		let usersInArray = jsonData.map((user, index) => {
			let userTemp = [ user.id, user.title, user.name, user.is_default ];
			const actions = (
				<div className={classes.actions}>
					{can('Show Question Category') ? (
						<CircleBtn
							link={'/question-category/' + user.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					) : null }
					{can('Edit User') ? (
						<CircleBtn
							link={'/question-category/' + user.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					): null}
					{can('Delete User') ? (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: user.id,
									name: user.name,
									alertOpen: true
								});
							}}
						/>
					) : null}
				</div>
			);

			userTemp.push(actions);

			return userTemp;
		});

		this.setState({ ndata: usersInArray });
	}

	render() {
		let { ndata, columns, options, alertOpen } = this.state;

		return (
			<div>
				<MUIDataTable
					title={'Question Category List'}
					data={ndata}
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
						this.delete();
					}}
					title="Delete Warning"
					text={'Are you sure to delete question category ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

Questioncategory.propTypes = {
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

export default withStyles(styles)(connect('', mapDispatchToProps)(Questioncategory));
