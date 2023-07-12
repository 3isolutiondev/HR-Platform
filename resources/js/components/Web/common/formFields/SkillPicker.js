import React, { Component } from 'react';
import { unionBy } from 'lodash/array';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SelectField from './SelectField';
import { getSkillsForMatching } from '../../redux/actions/optionActions';
import isEmpty from '../../validations/common/isEmpty';
import SkillDialog from './skillPicker/SkillDialog';
import AddIcon from '@material-ui/icons/Add';
import { addFlashMessage } from '../../redux/actions/webActions';
// import { pluck } from '../../utils/helper';

class SkillPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addMore: false,
			skills: [],
			allSkills: []
		};

		this.handleAddMore = this.handleAddMore.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidMount() {
		this.props.getSkillsForMatching(this.props.category).then(() => this.setState({ allSkills: this.props.allSkills }));
	}

	componentDidUpdate(prevProps, prevState) {
		let currentSkills = JSON.stringify(this.props.skills);
		let oldSkills = JSON.stringify(prevProps.skills);
		let currentAllSkills = JSON.stringify(this.props.allSkills);
		let oldAllSkills = JSON.stringify(prevProps.allSkills);

		if (oldSkills !== currentSkills) {
			this.setState({ skills: this.props.skills });
		}

		if (currentAllSkills !== oldAllSkills) {
			this.props.getSkillsForMatching().then(() => this.setState({ allSkills: this.props.allSkills }));
		}
	}

	handleAddMore() {
		this.setState({ addMore: !this.state.addMore });
	}

	selectOnChange(value ) {
		if (!isEmpty(value)) {
			if (!Array.isArray(value)) {
				value = [ value ];
			}
			let allSkills = unionBy(this.props.allSkills, value, 'value');

        this.setState({ allSkills }, () => {
          this.setState({ skills: value }, () => {
            this.props.onChange(this.state.skills, { name: this.props.name });

          });
        });
		}
	}

	render() {
		const { addMore, skills, allSkills } = this.state;
		const { errors, classes, isMulti, onMenuOpenOrClose, excludedSkills = [] } = this.props;
		const filteredSkills = this.props.category ? skills.filter(skill => skill.category === this.props.category) : skills;
		let filteredAllSkills = this.props.category ? allSkills.filter(skill => skill.category === this.props.category) : allSkills;

		filteredAllSkills = filteredAllSkills.filter(skill => !excludedSkills.find(s => s.value === skill.value));

		return (
			<div>
				<SkillDialog
					isOpen={addMore}
					skills={this.props.category ? skills.filter(skill => skill.category === this.props.category) : skills}
					onChange={this.selectOnChange}
					onClose={this.handleAddMore}
					isMulti={isMulti}
				/>
				<Grid container spacing={24} alignItems="flex-end">
					{/* Uncomment Grid tag below if we want to add other skills
            <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
          */}
          {/* Comment Grid tag below if we want to add other skills */}
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<SelectField
							label={this.props.label || "Skills *"}
							options={filteredAllSkills}
							value={filteredSkills}
							onChange={this.selectOnChange}
							placeholder={this.props.placeholder || "Select skills"}
							name="skills"
							error={errors}
							required
							isMulti={isMulti}
							fullWidth={true}
							margin="none"
							/**Uncomment code below if we want to add other skills*/
							// added={true} // if added == true, then the option will follow the name of the SelectField
              				/*handleAddMore={this.handleAddMore}*/
							onMenuOpenOrClose={onMenuOpenOrClose}
							isDisabled={this.props.isDisabled}
						/>
					</Grid>
					{/* Uncomment code below if we want to add other skills
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
						<Button
							variant="contained"
							aria-label="large outlined secondary button group"
							color="primary"
							fullWidth
							onClick={this.handleAddMore}
							className={!isEmpty(errors) ? classes.btnErr : ''}
						>
							<AddIcon /> Add Other Skill
						</Button>
          </Grid>
          */}
				</Grid>
			</div>
		);
	}
}

SkillPicker.defaultProps = {
  isMulti: true,
  onMenuOpenOrClose: () => { return false; }
};

SkillPicker.propTypes = {
	name: PropTypes.string.isRequired,
	skills: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	allSkills: PropTypes.array.isRequired,
	getSkillsForMatching: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
  onMenuOpenOrClose: PropTypes.func
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getSkillsForMatching,
  addFlashMessage
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

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	btnErr: {
		'margin-top': '-4em'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SkillPicker));
