import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Loadable from 'react-loadable';
import LoadingSpinner from '../../common/LoadingSpinner';
// import isEmpty from '../../validations/common/isEmpty';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

const Bio = Loadable({
	loader: () => import('./Bio'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const EducationUniversity = Loadable({
	loader: () => import('./EducationUniversity'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const EducationSchool = Loadable({
	loader: () => import('./EducationSchool'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const Skills = Loadable({
	loader: () => import('./Skills'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const EmploymentRecords = Loadable({
	loader: () => import('./EmploymentRecords'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
// const Disabilities = Loadable({
// 	loader: () => import('./Disabilities'),
// 	loading: LoadingSpinner,
// 	timeout: 20000, // 20 seconds
// 	delay: 500 // 0.5 seconds
// });
const Languages = Loadable({
	loader: () => import('./Languages'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const Publications = Loadable({
	loader: () => import('./Publications'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
// const ProfessionalSocieties = Loadable({
// 	loader: () => import('./ProfessionalSocieties'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// delay: 500 // 0.5 seconds
// });
// const Dependents = Loadable({
// 	loader: () => import('./Dependents'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// delay: 500 // 0.5 seconds
// });
const LegalPermanentResidenceStatus = Loadable({
	loader: () => import('./LegalPermanentResidenceStatus'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const LegalStep = Loadable({
	loader: () => import('./LegalStep'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const RelativesInUN = Loadable({
	loader: () => import('./RelativesInUN'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const PreviouslySubmittedInUN = Loadable({
	loader: () => import('./PreviouslySubmittedInUN'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const PermanentCivilServants = Loadable({
	loader: () => import('./PermanentCivilServants'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const References = Loadable({
	loader: () => import('./References'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const RelevantFacts = Loadable({
	loader: () => import('./RelevantFacts'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const Portfolios = Loadable({
	loader: () => import('./Portfolios'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const PhoneNumber = Loadable({
	loader: () => import('./PhoneNumber'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const CvAndSignature = Loadable({
	loader: () => import('./cvAndSignature'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const BioAddressAndNationality = Loadable({
	loader: () => import('./BioAddressAndNationality'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const RosterProcess = Loadable({
	loader: () => import('./Roster/RosterProcess'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});
const RosterDone = Loadable({
	loader: () => import('./Roster/RosterDone'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

import isEmpty from '../../validations/common/isEmpty';
import { getNationalities, getP11Countries, getLanguages, getYears } from '../../redux/actions/optionActions';
import { getRosterProcess } from '../../redux/actions/profile/rosterProcessActions';
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editable: true,
			profileID: ''
		};
		this.refreshSkill = this.refreshSkill.bind(this);
	}
	componentDidMount() {
		this.props.getNationalities();
		this.props.getLanguages();
		this.props.getP11Countries();
		this.props.getYears();
		if (!isEmpty(this.state.profileID)) {
			this.props.getRosterProcess(this.state.profileID);
		} else {
			this.props.getRosterProcess();
		}
	}

	componentWillMount() {
		if (typeof this.props.match.params.id !== 'undefined') {
			this.setState({
				editable: false,
				profileID: this.props.match.params.id
			});
		}
		if (this.props.preview === true) {
			this.setState({ editable: false });
		}
	}

	refreshSkill() {
		this.child.refreshSkill();
	}

	render() {
		const { editable, profileID } = this.state;
		const { roster_done_empty, roster_process_empty } = this.props;

		return (
			<Grid container spacing={24}>
				<Helmet>
					<title>{APP_NAME} - Profile</title>
					<meta name="description" content={APP_NAME + ' Profile'} />
				</Helmet>
				<Grid item xs={12}>
					<Bio editable={editable} profileID={profileID} />
				</Grid>
				{!roster_process_empty ? (
					<Grid item xs={12}>
						<RosterProcess />
					</Grid>
				) : null}
				{/* <Grid item xs={12}>
					<Languages editable={editable} />
				</Grid> */}
				<Grid item xs={12} md={8} lg={9}>
					<Languages editable={editable} profileID={profileID} />

					<EducationUniversity editable={editable} profileID={profileID} />

					<EducationSchool editable={editable} profileID={profileID} />

					<Skills editable={editable} profileID={profileID} onRef={(ref) => (this.child = ref)} />

					<EmploymentRecords editable={editable} profileID={profileID} refreshSkill={this.refreshSkill} />

					{/* <ProfessionalSocieties editable={editable} profileID={profileID} /> */}

					<Portfolios editable={editable} profileID={profileID} refreshSkill={this.refreshSkill} />

					<Publications editable={editable} profileID={profileID} />

					{/* <Disabilities editable={editable} profileID={profileID} /> */}

					{/* <Dependents editable={editable} profileID={profileID} /> */}

					<LegalPermanentResidenceStatus editable={editable} profileID={profileID} />

					<LegalStep editable={editable} profileID={profileID} />

					<RelativesInUN editable={editable} profileID={profileID} />

					<PreviouslySubmittedInUN editable={editable} profileID={profileID} />

					<PermanentCivilServants editable={editable} profileID={profileID} />

					<References editable={editable} profileID={profileID} />

					<RelevantFacts editable={editable} profileID={profileID} />
				</Grid>
				<Grid item xs={12} md={4} lg={3}>
					{!roster_done_empty && <RosterDone />}
					<PhoneNumber editable={editable} profileID={profileID} />
					<BioAddressAndNationality editable={editable} profileID={profileID} />
					<CvAndSignature editable={editable} profileID={profileID} />
				</Grid>
			</Grid>
		);
	}
}

Profile.propTypes = {
	getNationalities: PropTypes.func.isRequired,
	getLanguages: PropTypes.func.isRequired,
	getP11Countries: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getP11Countries,
	getLanguages,
	getNationalities,
	getYears,
	getRosterProcess
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	roster_process_empty: state.profileRosterProcess.roster_process_empty,
	roster_done_empty: state.profileRosterProcess.roster_done_empty
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
