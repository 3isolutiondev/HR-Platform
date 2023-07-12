/** import React, Prop Types, and connect  */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/** import Material UI styles, Component(s) and Icon(s) */
import MUIDataTable from 'mui-datatables';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

/** import Redux actions and components needed on this component */
import { getAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import Btn from '../../../common/Btn';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

/**
 * ThirdParty is a component to show Third part client data
 *
 * @name ThirdPartyForm
 * @component
 * @category Third part client
 * @subcategory Third part client
 *
 */
class ThirdParty extends Component {
	constructor(props) {
		super(props);
		this.state = {
			durations: [],
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
					name: 'Permission',
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
				selectableRows: 'none',
				customToolbar: () => {
					if (can('Set as Admin')) {
						return (
							<Btn
								link="/dashboard/third-party/add"
								btnText="Add New Third Party"
								btnStyle="contained"
								color="primary"
								size="small"
								icon={<Add />}
							/>
						);
					}

					return false;
				}
			},
			alertOpen: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/third-party/get-all'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
	}

   /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
	componentDidMount() {
		this.getData();
	}

   /**
   * getData is a function to process the fetching data of third party client from the endpoint
   */
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

   /**
   * deleteData is a function to process the daleting of third party client
   */
	deleteData() {
		this.props
			.deleteAPI('/api/third-party/' + this.state.deleteId)
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

   /**
   * dataToArray is a function to process data coming from an api so it can be presented using MUI Data tables
   * @param {object}  jsonData  - data coming from api call
   */
	dataToArray(jsonData) {
		const { classes } = this.props;
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [ data.id, data.username, data.permissions ];

			const actions = (
				<div className={classes.actions}>
					{can('Set as Admin') && (
						<CircleBtn
							link={'/dashboard/third-party/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Set as Admin') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.username,
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

	render() {
		let { roles, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Third Party List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Third Party List'} />
				</Helmet>
				<MUIDataTable
					title={'Third Party List'}
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
					text={'Are you sure to delete the third party client : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

ThirdParty.propTypes = {
	/**
    * getAPI is a prop containing redux actions to call an api using GET HTTP Request
    */
	getAPI: PropTypes.func.isRequired,

	/**
	 * deleteAPI is a prop to call redux action to delete data based on url parameter.
	*/
	deleteAPI: PropTypes.func.isRequired,

	/**
    * addFlashMessage" prop: function to show flash message
    */
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(ThirdParty));
