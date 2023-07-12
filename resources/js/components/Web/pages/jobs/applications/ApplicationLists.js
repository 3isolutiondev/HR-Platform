import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getAPI } from '../../../redux/actions/apiActions';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import moment from 'moment';

const styles = () => ({
	capitalize: {
		'text-transform': 'capitalize'
	},
	addMarginTop: {
		'margin-top': '1em'
	}
});

class ApplicationLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobApplications: [],
			statusData: {}
		};

		this.getData = this.getData.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.statusData !== this.props.statusData) {
			this.getData();
		}
	}

	getData() {
		if (this.props.statusData && typeof this.props.statusData.value !== 'undefined') {
			this.props
				.getAPI(this.props.apiURL + '/' + this.props.statusData.value+ '/'+ this.props.userId)
				.then((res) => {
					this.setState({ jobApplications: res.data.data, statusData: this.props.statusData });
				})
				.catch((err) => {});
		}
	}

	render() {
		const { classes } = this.props;
		const { jobApplications } = this.state;
		return (
			<Grid container>
				<Grid item xs={12}>
					{jobApplications.map((job, index) => (
						<Card className={classes.addMarginTop} key={index}>
							<CardContent>
								<Grid container>
									<Grid item xs={12} sm={4}>
										<Typography variant="subtitle1" component="span">
											Job Title :
											<Typography variant="h6" color="primary" component="span">
												{job.title}
											</Typography>
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4}>
										<Typography variant="subtitle1">Date of Application :</Typography>
										<Typography variant="h6" color="primary" className={classes.capitalize}>
											{moment(job.job_user[0].created_at).format('DD MMMM YYYY')}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={2}>
										<Typography variant="subtitle1">Country :</Typography>
										<Typography variant="h6" color="primary" className={classes.capitalize}>
											{job.country.name}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={2}>
										<Button
											size="small"
											fullWidth
											variant="contained"
											color="primary"
											href={'/jobs/' + job.pivot.job_id}
										>
											<RemoveRedEye fontSize="small" /> View Vacancy
										</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					))}
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

export default withStyles(styles)(connect(null, mapDispatchToProps)(ApplicationLists));
