import React, { Component } from 'react';
import { connect } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { switchShowProfileSection } from '../../redux/actions/profile/showProfileSection';

const menu = [
	{ title: 'Languages', props: 'language', name: 'languages' },
	{ title: 'Mobile Phone Numbers', props: 'phoneNumber', name: 'phone_number' },
	// { title: 'Bio Information', props: 'bioAddress', name: 'bio_address' },
	// { title: 'CV', props: 'cvAndSignature', name: 'cv' },
	{ title: 'Education (Universiy or Equivalent)', props: 'educationUniversity', name: 'education_universities' },
	{ title: 'Formal Trainings / Workshops', props: 'educationSchool', name: 'education_schools' },
	{ title: 'Skills', props: 'skill', name: 'skills' },
	{ title: 'Employment History', props: 'employmentRecords', name: 'employment_records' },
	// { title: 'Professional Societies', props: 'profesionalSocieties', name: 'professional_societies' },
	{ title: 'Portfolio', props: 'portofolio', name: 'portfolios' },
	{ title: 'Publications', props: 'publication', name: 'publications' },
	// { title: 'Disabilities', props: 'disabilities', name: 'disabilities' },
	// { title: 'Dependents', props: 'dependent', name: 'dependents' },
	{
		title: 'Legal Permanent Residence Status',
		props: 'legalPermanentResidenceStatus',
		name: 'legal_permanent_residence_status'
	},
	{
		title: 'Legal Steps, Changing Your Present Nationality',
		props: 'legalStep',
		name: 'legal_step_changing_present_nationality_explanation'
	},
	{ title: 'Relatives Employed by iMMAP', props: 'relativeEmployed', name: 'relatives_employed' },
	{ title: 'Previously Worked with iMMAP', props: 'submittedAplicationUn', name: 'previously_submitted_for_un' },
	{ title: 'Permanent Civil Servant', props: 'permanentCivilServants', name: 'permanent_civil_servants' },
	{ title: 'Reference Lists', props: 'references', name: 'references' },
	{ title: 'Facts, Regarding Residence Outside Country', props: 'relevanFact', name: 'relevant_facts' }
];

class DropDownListMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openProfileSection: false,
			openColapse: false,
			anchorEl: null
		};
		this.handleClickMenu = this.handleClickMenu.bind(this);
		this.handleCloseMenu = this.handleCloseMenu.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.switchOnChange = this.switchOnChange.bind(this);
	}

	handleClickMenu(event) {
		this.setState({ anchorEl: event.currentTarget });
	}

	handleCloseMenu() {
		this.setState({ anchorEl: null });
	}
	switchOnChange(e) {
		let { name } = e.target;
		let booleanData = e.target.value === 'false' ? false : true;
		this.props.switchShowProfileSection(!booleanData, name);
	}
	handleClick() {
		this.setState((state) => ({ openColapse: !state.openColapse }));
	}
	render() {
		const { anchorEl } = this.state;
		const open = Boolean(anchorEl);
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Button
					className={classes.capitalize}
					variant="contained"
					color="primary"
					aria-owns={open ? 'fade-menu' : undefined}
					aria-haspopup="true"
					onClick={this.handleClickMenu}
				>
					View Profile Section
					{open ? <ArrowDropUp /> : <ArrowDropDown />}
				</Button>
				<Menu
					id="fade-menu"
					anchorEl={anchorEl}
					getContentAnchorEl={null}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					open={open}
					onClose={this.handleCloseMenu}
					TransitionComponent={Fade}
					PaperProps={{
						style: {
							maxHeight: 600
						}
					}}
				>
					{menu.map((option, index) => (
						<MenuItem key={index}>
							<ListItemText
								primary={
									<Typography variant="subtitle2" className={classes.listText}>
										{option.title}
									</Typography>
								}
							/>
							<Switch
								checked={this.props.reduxData[option.props].show}
								onChange={this.switchOnChange}
								value={this.props.reduxData[option.props].show}
								color="primary"
								name={option.name}
							/>
						</MenuItem>
					))}
				</Menu>
			</div>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	root: {
		float: 'right'
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4
	},
	capitalize: {
		'text-transform': 'capitalize'
	},
	popperRoot: {
		marginTop: 5,
		zIndex: 99
	},
	listText: {
		color: 'black',
		fontWeight: 'bold'
	}
});

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	reduxData: state
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	switchShowProfileSection
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DropDownListMenu));
