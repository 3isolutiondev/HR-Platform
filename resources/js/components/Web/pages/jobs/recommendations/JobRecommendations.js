import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Drawer from '@material-ui/core/Drawer';
import FilterListIcon from '@material-ui/icons/FilterList';
import Recommendations from '../../../common/recommendations/Recommendations';
import { getJobRecommendationProfiles, sendInvitation, updateCurrentPage } from '../../../redux/actions/jobs/jobRecommendationActions';
import { onChange, resetFilter } from '../../../redux/actions/jobs/jobRecommendationFilterActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { Helmet } from 'react-helmet';
import { getAPI } from '../../../redux/actions/apiActions';
import { APP_NAME } from '../../../config/general';
import JobRecommendationFilter from './JobRecommendationFilter';
import { primaryColor, white } from '../../../config/colors';
import debounce from 'lodash/debounce';
import isEmpty from '../../../validations/common/isEmpty';
import { pluck } from '../../../utils/helper';

class JobRecommendations extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filterMobile: false
		};

		this.inputDebounce = debounce(this.inputDebounce.bind(this), 500);
		this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
	}

	componentWillMount() {
		if (this.props.match.params.id !== this.props.job_id) {
			this.props.resetFilter();
		}
	}

	componentDidMount() {
		const { auth } = this.props;

		const immap_email =
			typeof auth.immap_email === 'undefined' ? '' : !isEmpty(auth.immap_email) ? auth.immap_email : '';
		this.props.onChange('job_id', this.props.match.params.id);
		this.props.getAPI('/api/jobs/' + this.props.match.params.id).then((res) => {
			const exclude_immaper = isEmpty(res.data.data.exclude_immaper)
				? false
				: pluck(JSON.parse(res.data.data.exclude_immaper), 'value').includes(immap_email);
			if (exclude_immaper) {
				this.props.history.push('/jobs');
			} else {
				this.props.getJobRecommendationProfiles(this.props.match.params.id);
			}
		}).catch((err) => {
			this.props.addFlashMessage({
				type: 'error',
				text: 'There is an error while getting the job data'
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.search !== this.props.search) {
			this.inputDebounce();
		} else if (
			this.props.job_id != prevProps.job_id ||
			prevProps.experience !== this.props.experience ||
			JSON.stringify(prevProps.chosen_language) !== JSON.stringify(this.props.chosen_language) ||
			JSON.stringify(prevProps.chosen_degree_level) !== JSON.stringify(this.props.chosen_degree_level) ||
			JSON.stringify(prevProps.chosen_sector) !== JSON.stringify(this.props.chosen_sector) ||
			JSON.stringify(prevProps.chosen_skill) !== JSON.stringify(this.props.chosen_skill) ||
			JSON.stringify(prevProps.chosen_field_of_work) !== JSON.stringify(this.props.chosen_field_of_work) ||
			JSON.stringify(prevProps.chosen_country) !== JSON.stringify(this.props.chosen_country) ||
			JSON.stringify(prevProps.chosen_nationality) !== JSON.stringify(this.props.chosen_nationality) ||
			JSON.stringify(prevProps.chosen_country_of_residence) !==
				JSON.stringify(this.props.chosen_country_of_residence) ||
			JSON.stringify(prevProps.is_available) !== JSON.stringify(this.props.is_available) ||
			JSON.stringify(prevProps.immaper_status) !== JSON.stringify(this.props.immaper_status) ||
			JSON.stringify(prevProps.select_gender) !== JSON.stringify(this.props.select_gender)
		) {
      this.props.updateCurrentPage(1);
			this.props.getJobRecommendationProfiles();
		}
	}

	inputDebounce() {
    this.props.updateCurrentPage(1);
		this.props.getJobRecommendationProfiles();
	}

	toggleFilterMobile() {
		this.setState({ filterMobile: this.state.filterMobile ? false : true });
	}

	render() {
		const { title, job_id, sendInvitation, country, width, classes, current_page, last_page } = this.props;
		const { filterMobile } = this.state;
		const page_title = APP_NAME + ' - Job > ' + title + ' - ' + country + ' > View Recommendation';

		return (
			<Grid container spacing={16}>
				<Helmet>
					<title>{page_title}</title>
					<meta
						name="description"
						content={APP_NAME + ' Job > ' + title + ' - ' + country + ' > View Recommendation'}
					/>
				</Helmet>
				<Grid item xs={12}>
					<Typography variant="h5">Job : {title} - Profile Recommendation</Typography>
				</Grid>
				{width != 'sm' &&
				width != 'xs' && (
					<Grid item xs={12} sm={12} md={4} lg={3}>
						<JobRecommendationFilter  />
					</Grid>
				)}
				<Grid item xs={12} sm={12} md={8} lg={9}>
					<Recommendations
            job_id={job_id}
            sendInvitation={sendInvitation}
            title={title}
            current_page={current_page}
            last_page={last_page}
            changePage={(page) => {
              this.props.updateCurrentPage(page)
              this.props.getJobRecommendationProfiles()
            }}
          />
				</Grid>
				{(width == 'sm' || width == 'xs') && (
					<Fab
						variant="extended"
						color="primary"
						aria-label="Delete"
						className={classes.filterBtn}
						onClick={this.toggleFilterMobile}
					>
						<FilterListIcon className={classes.extendedIcon} />
						Filter
					</Fab>
				)}
				{(width == 'sm' || width == 'xs') && (
					<Drawer
						variant="persistent"
						anchor="bottom"
						open={filterMobile}
						classes={{
							paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
						}}
					>
						<div className={classes.mobileFilter}>
							<JobRecommendationFilter />
						</div>
					</Drawer>
				)}
			</Grid>
		);
	}
}

JobRecommendations.propTypes = {
  classes: PropTypes.object.isRequired,

  title: PropTypes.string,
  country: PropTypes.string,
  auth: PropTypes.object.isRequired,
  job_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  search: PropTypes.string,
  experience: PropTypes.number,
  chosen_language: PropTypes.array.isRequired,
  chosen_degree_level: PropTypes.array.isRequired,
  chosen_sector: PropTypes.array.isRequired,
	chosen_skill: PropTypes.array.isRequired,
	chosen_field_of_work: PropTypes.array.isRequired,
	chosen_country: PropTypes.array.isRequired,
	chosen_nationality: PropTypes.array.isRequired,
	chosen_country_of_residence: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.oneOf([''])]),
	immaper_status: PropTypes.array.isRequired,
	is_available: PropTypes.array.isRequired,
	select_gender: PropTypes.array.isRequired,

  getJobRecommendationProfiles: PropTypes.func.isRequired,
	sendInvitation: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	getAPI: PropTypes.func.isRequired,
	resetFilter: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,

  current_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  last_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updateCurrentPage: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getJobRecommendationProfiles,
	sendInvitation,
	onChange,
	getAPI,
	resetFilter,
  addFlashMessage,
  updateCurrentPage
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	title: state.jobRecommendations.title,
	country: state.jobRecommendations.country,
	current_page: state.jobRecommendations.current_page,
	last_page: state.jobRecommendations.last_page,
	auth: !isEmpty(state.auth.user) ? state.auth.user.data : { immap_email: '' },

	job_id: state.jobRecommendationFilter.job_id,
	search: state.jobRecommendationFilter.search,
	experience: state.jobRecommendationFilter.experience,
	chosen_language: state.jobRecommendationFilter.chosen_language,
	chosen_degree_level: state.jobRecommendationFilter.chosen_degree_level,
	chosen_sector: state.jobRecommendationFilter.chosen_sector,
	chosen_skill: state.jobRecommendationFilter.chosen_skill,
	chosen_field_of_work: state.jobRecommendationFilter.chosen_field_of_work,
	chosen_country: state.jobRecommendationFilter.chosen_country,
	chosen_nationality: state.jobRecommendationFilter.chosen_nationality,
	chosen_country_of_residence: state.jobRecommendationFilter.chosen_country_of_residence,
	immaper_status: state.jobRecommendationFilter.immaper_status,
	is_available: state.jobRecommendationFilter.is_available,
	select_gender: state.jobRecommendationFilter.select_gender
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	filterBtn: {
		margin: theme.spacing.unit,
		position: 'fixed',
		zIndex: 9999999,
		bottom: theme.spacing.unit * 6,
		left: '49%',
		transform: 'translateX(-51%)',
		color: primaryColor + ' !important',
		'background-color': white + ' !important',
    border: `1px solid ${primaryColor} !important`
	},
	extendedIcon: {
		marginRight: theme.spacing.unit
	},
	filterDrawer: {
		height: '100%',
		'padding-left': theme.spacing.unit * 3,
		'padding-right': theme.spacing.unit * 3
	},
	filterDrawerHide: {
		bottom: 'auto'
	},
	mobileFilter: {
		height: '100%',
		'margin-top': theme.spacing.unit
	}
});

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobRecommendations)));
