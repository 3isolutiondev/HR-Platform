import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ApplicationLists from './ApplicationLists2';
import { secondaryColor } from '../../../config/colors';
import { getAPI } from '../../../redux/actions/apiActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	tabsRoot: {
		'border-bottom': '1px solid ' + secondaryColor
	}
});


class JobApplications extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabValue: 0,
			allStatus: [],
			currentStatus: {}
		};

		this.tabChange = this.tabChange.bind(this);
	}

	componentDidMount() {

		this.props.getAPI('/api/job-status').then((res) => {
			this.setState({ allStatus: res.data.data }, () => {
				this.props.getAPI('/api/job-status/default').then((res) => {
					this.setState({ currentStatus: this.state.allStatus[res.data.data] });
				}).catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while retrieving default data'
					});
				})
			});
		}).catch((err) => {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while retrieving job status data'
			});
		})
	}

	tabChange(e, tabValue) {
		this.setState({ tabValue, currentStatus: this.state.allStatus[tabValue] });
	}

	render() {
		const { tabValue, allStatus, currentStatus } = this.state;
		const { classes, userId } = this.props;

		return (
			<Grid container>
				{!userId && (
				<Helmet>
					<title>{APP_NAME + ' - ' + 'My Job Application Status'}</title>
					<meta name="description" content={APP_NAME + ' ' + 'My Job Application Status'} />
				</Helmet>)}
				<Grid item xs={12}>
				{!userId && (<Typography variant="h5">My Job Application Status</Typography>)}
					<ApplicationLists
						jobStatus={allStatus}
						statusData={currentStatus}
						apiURL={`/api/job-applications${this.props.userId ? '_by_profile_id': ''}`}
						userId={this.props.userId || ''}
					/>
				</Grid>
			</Grid>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(JobApplications));
