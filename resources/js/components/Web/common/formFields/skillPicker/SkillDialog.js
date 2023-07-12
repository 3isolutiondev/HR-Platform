import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import AutoCompleteSingleValue from '../AutoCompleteSingleValue';
import isEmpty from '../../../validations/common/isEmpty';
import { getSkillsForMatching } from '../../../redux/actions/optionActions';
// import SaveIcon from '@material-ui/icons/Save';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	selectAddMore: {
		'overflow-y': 'visible'
	}
});

class SkillDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skills: []
		};

		this.handleClose = this.handleClose.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getSkillsForMatching();
	}

	componentDidUpdate(prevProps, prevState) {
		let currentSkills = JSON.stringify(this.props.skills);
		let oldSkills = JSON.stringify(prevProps.skills);
		const currentAllSkills = JSON.stringify(this.props.allSkills);
		const prevAllSkills = JSON.stringify(prevProps.allSkills);

		if (oldSkills !== currentSkills) {
			this.setState({ skills: this.props.skills });
		}

		if (prevAllSkills !== currentAllSkills) {
			this.props.getSkillsForMatching();
		}
	}

	handleClose() {
		this.props.onClose();
	}

	selectOnChange(value, e) {
		if (this.props.isMulti) {
			this.setState({ skills: value }, () => {
				this.props.onChange(value, e);
			});
		} else if (!isEmpty(value) && !this.props.isMulti) {
			let index = value.length - 1;
			this.setState({ skills: [ value[index] ] }, () => {
				this.props.onChange([ value[index] ], e);
			});
		}
	}

	render() {
		const { isOpen, classes, allSkills } = this.props;
		const { skills } = this.state;

		return (
			<Dialog
				open={isOpen}
				fullWidth
				maxWidth="lg"
				onClose={this.handleClose}
				PaperProps={{ style: { overflow: 'visible' } }}
			>
				<DialogTitle>Add Other Skill</DialogTitle>
				{/* <DialogContent className={(addMore) ? classes.selectAddMore : ''}> */}
				<DialogContent className={classes.selectAddMore}>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<AutoCompleteSingleValue
								options={allSkills}
								value={skills}
								suggestionURL="/api/skills/suggestions"
								name="skills"
								label="skill"
								placeholder="Add or Search Skill"
								onChange={(e, val) => this.selectOnChange(val, e)}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						<ArrowLeft /> Back
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

SkillDialog.propTypes = {
	onClose: PropTypes.func.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getSkillsForMatching
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	allSkills: state.options.skillsForMatching
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SkillDialog));
