import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import isEmpty from '../../validations/common/isEmpty';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CircleBtn from '../../common/CircleBtn';
import ProfileModal from '../../common/ProfileModal';
import Alert from '../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

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

class Roster extends Component {
	constructor(props) {
		super(props);
		this.state = {
			immapers: [],
			roster: [],
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
					name: 'Email',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Full Name',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Last Job Position',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Under Contract or Not',
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
				filterType: 'dropdown',
				download: false,
				print: false,
				selectableRows: 'none'
			},
			openProfile: false,
			id: 0,
			alertOpen: false,
			full_name: '',
			deleteId: 0,
			apiURL: '/api/profile-roster-dashboard/',
			apiURLUser: '/api/users/'
		};

		this.getUser = this.getUser.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.handleViewImmaper = this.handleViewImmaper.bind(this);
		this.openCloseProfile = this.openCloseProfile.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
	}
	componentDidMount() {
		let roster = this.props.rosterDashboard.find((dt) => dt.slug === this.props.match.params.slug);
		if (!isEmpty(roster)) {
			this.setState({ roster });
			this.getUser(roster.id);
		} else {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while processing the request'
			});
			this.props.history.push('/');
		}
	}

	componentDidUpdate(prevProps) {
		let roster = this.props.rosterDashboard.find((dt) => dt.slug === this.props.match.params.slug);
		if (prevProps.match.url !== this.props.match.url) {
			this.setState({ roster });
			this.getUser(roster.id);
		}
	}

	getUser(id) {
		this.props
			.getAPI(this.state.apiURL + id)
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
		let rosterInArray = jsonData.map((roster, index) => {
			let rosterTemp = [ roster.id, roster.email, roster.user.full_name, roster.job_title, roster.untilNow ];
			const actions = (
				<div className={classes.actions}>
					{can('Show Roster Dashboard') && (
						<CircleBtn
							onClick={() => this.handleViewImmaper(roster.id)}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)}
				</div>
			);

			rosterTemp.push(actions);

			return rosterTemp;
		});

		this.setState({ immapers: rosterInArray });
	}

	deleteUser() {
		this.props
			.deleteAPI(this.state.apiURLUser + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false, full_name: '' }, () => this.getUser());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	handleViewImmaper(id) {
		this.setState({ id }, () => this.setState({ openProfile: !this.state.openProfile }));
	}

	openCloseProfile() {
		this.setState({ openProfile: !this.state.openProfile });
	}

	render() {
		const { immapers, columns, options, openProfile, id, alertOpen, full_name, roster } = this.state;
		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > ' + roster.name}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > ' + roster.name} />
				</Helmet>
				<MUIDataTable
					title={roster.name}
					data={immapers}
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
						this.deleteUser();
					}}
					title="Delete Warning"
					text={'Are you sure to delete user : ' + full_name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>

				<ProfileModal
					isOpen={openProfile}
					profileId={id}
					onClose={this.openCloseProfile}
				/>
			</div>
		);
	}
}

Roster.propTypes = {
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
	rosterDashboard: state.rosterDashboard.rosterDashboard
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Roster));
