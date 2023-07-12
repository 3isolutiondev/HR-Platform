import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI } from '../../redux/actions/apiActions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { pluck } from '../../utils/helper';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
  noPaper: {
    padding: 0,
    border: 'none'
  },
	submit: {
		marginTop: theme.spacing.unit * 3
	}
});

class UserView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			first_name: '',
			middle_name: '',
			family_name: '',
			full_name: '',
			email: '',
			role: 'User',
			access_platform: '',
			apiURL: '/api/users'
		};
	}

	componentDidMount() {
		this.props
			.getAPI(this.state.apiURL + '/' + this.props.match.params.id)
			.then((res) => {
				const { first_name, middle_name, family_name, full_name, email, role, access_platform } = res.data.data;
        const roles = pluck(role, 'label').join(', ');

				this.setState({
					first_name,
					middle_name: !middle_name ? '' : middle_name,
					family_name,
					full_name,
					email,
					role: roles,
					access_platform
				});
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while requesting user data'
				});
			});
	}

	render() {
		let { first_name, middle_name, family_name, email, role, full_name, access_platform } = this.state;

		const { classes, forModal } = this.props;

		return (
			<Paper className={forModal ? classes.noPaper: classes.paper}>
				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Typography variant="h5" component="h3">
							{'View User : ' + full_name}
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">First Name</Typography>
						<Typography variant="body1">{first_name}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Middle Name</Typography>
						<Typography variant="body1">{middle_name}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Family Name</Typography>
						<Typography variant="body1">{family_name}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Full Name</Typography>
						<Typography variant="body1">{full_name}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Email Address</Typography>
						<Typography variant="body1">{email}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Role</Typography>
						<Typography variant="body1">{role}</Typography>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6">Access Platform</Typography>
						<Typography variant="body1">{access_platform == 1 ? 'Yes' : 'No'}</Typography>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

UserView.defaultProps = {
  forModal: false
}

UserView.propTypes = {
	classes: PropTypes.object.isRequired,
  forModal: PropTypes.bool.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(UserView));
