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
import Recommendations from '../../common/recommendations/Recommendations';
import { getToRRecommendationProfiles, updateCurrentPage } from '../../redux/actions/tor/torRecommendationActions';
import { onChange, resetFilter } from '../../redux/actions/tor/torFilterActions';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { white, primaryColor } from '../../config/colors';
import ToRFilter from './ToRFilter';
import debounce from 'lodash/debounce';

class ToRRecommendations extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filterMobile: false
		};

		this.inputDebounce = debounce(this.inputDebounce.bind(this), 500);
		this.toggleFilterMobile = this.toggleFilterMobile.bind(this);
	}
	componentDidMount() {
    this.props.onChange('tor_id', this.props.match.params.id);
		this.props.getToRRecommendationProfiles();
	}

	componentWillMount() {
		if (this.props.match.params.id !== this.props.tor_id) {
			this.props.resetFilter();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.search !== this.props.search) {
			this.inputDebounce();
		} else if (
			this.props.tor_id != prevProps.tor_id ||
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
			this.props.getToRRecommendationProfiles();
		}
	}

	inputDebounce() {
    this.props.updateCurrentPage(1);
    this.props.getToRRecommendationProfiles();
	}

	toggleFilterMobile() {
		this.setState({ filterMobile: this.state.filterMobile ? false : true });
	}

	render() {
		const { title, country, width, classes, current_page, last_page } = this.props;
		const { filterMobile } = this.state;

		return (
			<Grid container spacing={16}>
				<Helmet>
					<title>{APP_NAME + '- ToR ' + title + ' ' + country}</title>
					<meta name="description" content={APP_NAME + ' ToR ' + title + ' ' + country} />
				</Helmet>
				<Grid item xs={12}>
					<Typography variant="h5">ToR : {title} - Profile Recommendation</Typography>
				</Grid>
				{(width != 'sm' && width != 'xs') ? (
					<Grid item xs={12} sm={12} md={4} lg={3}>
						<ToRFilter />
					</Grid>
				) : null}
				<Grid item xs={12} sm={12} md={8} lg={9}>
          <Recommendations
            current_page={current_page}
            last_page={last_page}
            changePage={(page) => {
              this.props.updateCurrentPage(page)
              this.props.getToRRecommendationProfiles()
            }}
          />
				</Grid>
				{(width == 'sm' || width == 'xs') ? (
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
				) : null}
				{(width == 'sm' || width == 'xs') ? (
					<Drawer
						variant="persistent"
						anchor="bottom"
						open={filterMobile}
						classes={{
							paper: filterMobile ? classes.filterDrawer : classes.filterDrawerHide
						}}
					>
						<div className={classes.mobileFilter}>
							<ToRFilter />
						</div>
					</Drawer>
				) : null}
			</Grid>
		);
	}
}

ToRRecommendations.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
  width: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
  match: PropTypes.object.isRequired,

	tor_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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

  getToRRecommendationProfiles: PropTypes.func.isRequired,
  updateCurrentPage: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	resetFilter: PropTypes.func.isRequired,

  current_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  last_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getToRRecommendationProfiles,
  updateCurrentPage,
	onChange,
	resetFilter
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	title: state.torRecommendations.title,
	country: state.torRecommendations.country,
  current_page: state.torRecommendations.current_page,
  last_page: state.torRecommendations.last_page,

	tor_id: state.torFilter.tor_id,
	search: state.torFilter.search,
	experience: state.torFilter.experience,
	chosen_language: state.torFilter.chosen_language,
	chosen_degree_level: state.torFilter.chosen_degree_level,
	chosen_sector: state.torFilter.chosen_sector,
	chosen_skill: state.torFilter.chosen_skill,
	chosen_field_of_work: state.torFilter.chosen_field_of_work,
	chosen_country: state.torFilter.chosen_country,
	chosen_nationality: state.torFilter.chosen_nationality,
	chosen_country_of_residence: state.torFilter.chosen_country_of_residence,
	immaper_status: state.torFilter.immaper_status,
	is_available: state.torFilter.is_available,
	select_gender: state.torFilter.select_gender
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
	},
  loading: {
    margin: theme.spacing.unit * 2 + 'px auto',
    display: 'block'
  },
});

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ToRRecommendations)));
