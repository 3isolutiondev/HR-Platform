import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import { red } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import SortableLists from '../../common/SortableLists';
import arrayMove from 'array-move';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	noTextDecoration: {
		'text-decoration': 'none'
	}
});

class JobStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobStatuses: [],
			alertOpen: false,
			apiURL: '/api/job-status',
			baseLink: '/dashboard/job-status/'
		};

		this.getData = this.getData.bind(this);
		this.updateOrder = this.updateOrder.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.props
			.getAPI(this.state.apiURL)
			.then((res) => {
				this.setState({ jobStatuses: res.data.data ? res.data.data : [] });
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status ? err.response.data.status : 'error',
					text: err.response.data.message
						? err.response.data.message
						: 'There is an error while retrieving Your job status data'
				});
			});
	}

	updateOrder({ oldIndex, newIndex }) {
		let { jobStatuses } = this.state;
		this.setState({ jobStatuses: arrayMove(jobStatuses, oldIndex, newIndex) }, () => {
			this.props
				.postAPI(this.state.apiURL + '/change-order', { jobStatuses: this.state.jobStatuses })
				.then((res) => {
					this.props.addFlashMessage({
						type: 'success',
						text: res.data.message
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: err.response.data.status ? err.response.data.status : 'error',
						text: err.response.data.message
							? err.response.data.message
							: 'There is an error while updating job order'
					});
				});
		});
	}

	onDelete(id) {
		this.props
			.deleteAPI(this.state.apiURL + '/' + id)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.getData();
				// this.setState({ deleteId: 0, alertOpen: false, full_name: ''}, () => this.getData())
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: err.response.data.status ? err.response.data.status : 'error',
					text: err.response.data.message
						? err.response.data.message
						: 'There is an error while processing the delete request'
				});
			});
	}

	render() {
		const { jobStatuses, baseLink, alertOpen } = this.state;
		const { classes } = this.props;
		return (
			<Grid container>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Job Status'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Job Status'} />
				</Helmet>
				<Grid item xs={12} sm={8} md={9} lg={10}>
					<Typography variant="h4">Job Status</Typography>
				</Grid>
				<Grid item xs={12} sm={4} md={3} lg={2}>
					<Link to="/dashboard/job-status/add" className={classes.noTextDecoration}>
						<Button variant="contained" color="primary" fullWidth>
							<Add /> Add Status
						</Button>
					</Link>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1">Change Order / Step</Typography>
				</Grid>
				<Grid item xs={12}>
					<SortableLists
						items={jobStatuses}
						onSortEnd={this.updateOrder}
						onDelete={this.onDelete}
						baseLink={baseLink}
						distance={2}
					/>
				</Grid>
				{/* <Alert
          isOpen={alertOpen}
          onClose={ () => {this.setState({ alertOpen: false })} }
          onAgree={ () => {this.deleteData() }}
          title="Delete Warning"
          text={"Are you sure to delete user : " + name + ' ?'}
          closeText="Cancel"
          AgreeText="Yes"
        /> */}
			</Grid>
		);
	}
}

JobStatus.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(JobStatus));
