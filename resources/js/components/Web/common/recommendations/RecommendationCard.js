import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import classname from 'classnames';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Send from '@material-ui/icons/Send';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { postAPI } from '../../redux/actions/apiActions';
// import { addFlashMessage } from '../../redux/actions/webActions';
import { blueIMMAP, blueIMMAPHover, white } from '../../config/colors';
import { openCloseProfile } from '../../redux/actions/common/RecommendationActions';

class RecommendationCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCheck: false
		};

		this.checkChange = this.checkChange.bind(this);
	}

	componentDidMount() {
		this.setState({ isCheck: this.props.profileIds.includes(this.props.profileId) });
	}

	componentDidUpdate(prevProps) {
		const currentProfileIds = JSON.stringify(this.props.profileIds);
		const prevProfileIds = JSON.stringify(prevProps.profileIds);

		if (currentProfileIds != prevProfileIds) {
			this.setState({ isCheck: this.props.profileIds.includes(this.props.profileId) });
		}
	}

	checkChange(e) {
		this.setState({ isCheck: e.target.checked }, () => {
			this.props.checkChange();
		});
	}

	render() {
		let { profileId, name, checkChange, classes, canSendInvitation, openCloseProfile, isLoading, sendInvitation } = this.props;
		let { isCheck } = this.state;

		return (
			<Card className={classes.addMarginTop}>
				<CardContent className={classes.cardContent}>
					<Grid container spacing={24} alignItems="flex-end">
						<Grid item xs={12} sm={12} md={6} lg={7}>
							{canSendInvitation && (
								<Checkbox
									checked={isCheck}
									name="profileIds"
									color="primary"
									className={classes.checkBox}
									onChange={this.checkChange}
									// value={permission.name}
								/>
							)}
							<Typography variant="h6" color="primary" component="span" className={classes.name}>
								{name}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={5}>
							<Grid container spacing={8} direction="row-reverse" alignItems="center">
								{canSendInvitation && (
									<Grid item xs={12} sm={12} md={6}>
										<Button
											size="small"
											className={classes.blueIMMAP}
											fullWidth
											variant="contained"
											color="primary"
											onClick={sendInvitation}
										>
											Send Invitation{' '}
											<Send fontSize="small" className={classes.addSmallMarginLeft} /> {' '}
											{isLoading && (
												<CircularProgress className={classes.loading} size={22} thickness={5} />
											)}
										</Button>
									</Grid>
								)}
								<Grid item xs={12} sm={12} md={6}>
									{/* <Link to={'/profile/' + profileId} className={classname(classes.noTextDecoration)}> */}
									<Button
										size="small"
										fullWidth
										variant="contained"
										color="primary"
										onClick={() => openCloseProfile(profileId)}
									>
										<RemoveRedEye fontSize="small" className={classes.addSmallMarginRight} /> View
										Profile
									</Button>
									{/* </Link> */}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	openCloseProfile
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	profileIds: state.recommendations.profileIds
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	addMarginTop: {
		'margin-top': '1em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	noTextDecoration: {
		'text-decoration': 'none'
	},
	blueIMMAP: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	checkBox: {
		padding: '0 0 4px',
		cursor: 'pointer'
	},
	cardContent: {
		'&:last-child': {
			'padding-bottom': '16px'
		}
	},
	name: {
		display: 'inline',
		'margin-left': '12px'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RecommendationCard));
