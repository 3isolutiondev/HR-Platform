import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import SkillPicker from '../../../common/formFields/SkillPicker';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
// import AutocompleteTagsField from '../../../common/formFields/AutocompleteTagsField';
import isEmpty from '../../../validations/common/isEmpty';
import { validateSkills } from '../../../validations/p11';
import { getAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { profileLastUpdate } from '../../../redux/actions/profile/bioActions';
import Rating from 'material-ui-rating';
import { white } from '../../../config/colors';
import SelectField from '../../../common/formFields/SelectField';
import { skillCategories } from '../../../config/options';

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	capitalize: {
		textTransform: 'capitalize'
	},
	overflowVisible: {
		overflow: 'visible'
	},
	responsiveImage: {
		'max-width': '200px',
		width: '100%'
	},
	addMarginRight: {
		marginRight: '4px'
	},
	iconButton: {
		'background-color': 'transparent !important',
		'&:first-child': {
			marginLeft: theme.spacing.unit * -1
		}
	},
	removeButton: {
		position: 'absolute',
		left: '10px',
		bottom: '10px'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	},
	rootRating: {
		marginTop: theme.spacing.unit
	}
});

class SkillForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skill: [],
			proficiency: 0,
			errors: {},
			apiURL: '/api/p11-skills',
			isEdit: false,
			recordId: 0,
			isLoading: false,
			category: '',
		};

		this.onChange = this.onChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.getData = this.getData.bind(this);
		this.selectOnChange = this.selectOnChange.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEmpty(this.props.recordId)) {
			if (this.props.recordId !== '' && this.props.recordId !== prevProps.recordId) {
				this.getData(this.props.recordId);
			}
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => this.isValid());
	}

	isValid() {
		const { errors, isValid } = validateSkills(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}
	selectOnChange(value, e) {
		this.setState({ [e.name]: value }, () => this.isValid());
	}

	getData(id) {
		if (!isEmpty(id)) {
			this.props
				.getAPI(this.state.apiURL + '/' + id)
				.then((res) => {
					let { skill, proficiency } = res.data.data;


					this.setState({
						// skill: [ skill.skill ],
						skill: [ { value: skill.id, label: skill.skill, category: skill.category} ],
						proficiency,
						isEdit: true,
						recordId: id,
						category: skill.category
					});
				})
				.catch((err) => {
					this.props.addFlashMessage({
						type: 'error',
						text: 'There is an error while processing the request'
					});
				});
		}
	}

	handleSave() {
		if (this.isValid()) {
			this.setState({ isLoading: true }, () => {
				let label = this.state.skill[0].label;
				let uploadData = {
					skill: [ label ],
					proficiency: this.state.proficiency
				};

				let recId = '';

				if (this.state.isEdit) {
					uploadData._method = 'PUT';
					recId = '/' + this.state.recordId;
				}
				this.props
					.postAPI(this.state.apiURL + recId, uploadData)
					.then((res) => {
						this.setState({ isLoading: false }, () => {
							this.props.updateList();
							this.props.addFlashMessage({
								type: 'success',
								text: 'Your skill has been saved'
							});
							this.props.getP11();
							if (this.props.getProfileLastUpdate) {
								this.props.profileLastUpdate();
							}
							this.handleClose();
						});
					})
					.catch((err) => {
						this.setState({ isLoading: false }, () => {
							this.props.addFlashMessage({
								type: 'error',
								text: 'Error'
							});
						});
					});
			});
		}
	}

	handleClose() {
		this.setState(
			{
				skill: [],
				proficiency: 0,
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-skills'
			},
			() => {
				this.props.onClose();
			}
		);
	}

	handleRemove() {
		this.setState(
			{
				skill: [],
				proficiency: 0,
				recordId: 0,
				isEdit: false,
				apiURL: '/api/p11-skills'
			},
			() => {
				this.props.handleRemove();
			}
		);
	}

	autoCompleteOnChange(name, value) {
		this.setState({ [name]: value }, () => this.isValid());
	}

	render() {
		let { isOpen, title, classes, remove, skills } = this.props;
		let { skill, proficiency, errors, isEdit, isLoading } = this.state;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.handleClose}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent
				  style={{height:'300px'}}
				>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<SelectField
									label="Category *"
									options={skillCategories}
									value={skillCategories.find(x => x.value === this.state.category)}
									onChange={(value) => {
										this.selectOnChange(value.value, { name: 'category' });
									}}
									placeholder="Select Skill Category"
									isMulti={false}
									name="category"
									error={errors.category}
									fullWidth={true}
									onClear={() => this.setState({category: ''})}
									clearable={true}
									isDisabled={isEdit}
								/>
						</Grid>
						<Grid item xs={12}>
							{/* <AutocompleteTagsField
								label="Skill *"
								name="skill"
								value={skill}
								suggestionURL="/api/skills/suggestions"
								onChange={(name, value) => this.autoCompleteOnChange(name, value)}
								error={errors.skill}
								labelField="skill"
								required={true}
								isMulti={false}
								chipPlaceholder="Type your skill and press enter to add tag. Click X to remove it."
							/> */}
							<SkillPicker
								isMulti={false}
								name="skill"
								skills={skill}
								onChange={this.selectOnChange}
								errors={errors.skill}
								skillsAlreadyHave={skills}
								category={this.state.category}
								excludedSkills={this.props.excludedSkills}
                				// limit={5}
								isDisabled={isEdit}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth error={!isEmpty(errors.proficiency) ? true : false}>
								<FormLabel>Proficiency Rating</FormLabel>
								<Rating
									value={proficiency}
									max={5}
									name="proficiency"
									classes={{
										iconButton: classes.iconButton,
										root: classes.rootRating
									}}
									onChange={(value) => this.autoCompleteOnChange('proficiency', value)}
									iconFilled={<Star color="primary" />}
									iconHovered={<Star color="primary" />}
									iconNormal={<StarBorder color="primary" />}
								/>
								{!isEmpty(errors.proficiency) && <FormHelperText>{errors.proficiency}</FormHelperText>}
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					{remove ? (
						<Button
							onClick={this.handleRemove}
							color="primary"
							className={classes.removeButton}
							justify="space-between"
						>
							Remove
						</Button>
					) : null}
					<Button onClick={this.handleClose} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.handleSave} color="primary" variant="contained">
						Save {isLoading && <CircularProgress className={classes.loading} thickness={5} size={22} />}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

SkillForm.defaultProps = {
	getProfileLastUpdate: false
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	addFlashMessage,
	profileLastUpdate
};

export default withStyles(styles)(connect('', mapDispatchToProps)(SkillForm));
