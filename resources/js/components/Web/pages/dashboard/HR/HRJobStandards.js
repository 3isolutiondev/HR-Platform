/** import React, PropTypes and React Helmet */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { getAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';

/** import Material UI withStyles, components and icons */
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

/** import custom components for this component */
import Btn from '../../../common/Btn';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';

/** import configuration value and permission checker */
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { can } from '../../../permissions/can';
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

/**
 * HRJobStandards is a component to show Job Standard Page
 *
 * @name HRJobStandards
 * @component
 * @category Page
 *
 */
class HRJobStandards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hrJobStandards: [],
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
					if (can('Add HR Job Standard')) {
						return (
							<Btn
								link="/dashboard/hr-job-standards/add"
								btnText="Add New Job Standard"
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
			apiURL: '/api/hr-job-standards'
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
   * getData is a function to get list of job standard
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
   * deleteData is a function delete job standard
   */
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

  /**
   * dataToArray is a function to handle data coming from api to be shown in MUIDatatable
   * @param {Object[]} jsonData - array of object coming from an api
   */
	dataToArray(jsonData) {
		const { classes } = this.props;
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [ data.id, data.name ];

			const actions = (
				<div className={classes.actions}>
					{/* {can('Show HR Job Standard') && (
						<CircleBtn
							link={'/dashboard/hr-job-standards/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Edit HR Job Standard') && (
						<CircleBtn
							link={'/dashboard/hr-job-standards/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete HR Job Standard') && (
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

	render() {
		let { roles, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Job Standard List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Job Standard List'} />
				</Helmet>
				<MUIDataTable
					title={'Job Standard List'}
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
					text={'Are you sure to delete job standard : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

HRJobStandards.propTypes = {
	/**
   * getAPI is a prop containing redux actions to call an api using GET HTTP Request
   */
  getAPI: PropTypes.func.isRequired,
  /**
   * deleteAPI is a prop containing redux actions to call an api using DELETE HTTP Request
   */
	deleteAPI: PropTypes.func.isRequired,
  /**
   * addFlashMessage is a prop to call redux action to show flash message.
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

export default withStyles(styles)(connect('', mapDispatchToProps)(HRJobStandards));
