import React, { Component } from 'react';
import classname from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import isEmpty from '../../../../validations/common/isEmpty';
import WysiwygField from '../../../../common/formFields/WysiwygField';
import { validate } from '../../../../validations/HR/SubSection';
import { white, borderColor, blueIMMAP, blueIMMAPRed, blueIMMAPGreen, blueIMMAPBlue, red } from '../../../../config/colors';

class JobCategorySubSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sub_section: '',
			sub_section_content: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onMoveItem = this.onMoveSection.bind(this);
		this.onDelete = this.onDeletSection.bind(this);
		this.updateState = this.updateState.bind(this);
		this.onAddSection = this.onAddSection.bind(this);
	}

	componentDidMount() {
		this.updateState();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.sectionData.level != this.props.sectionData.level) {
			this.updateState();
		}
	}

	async onMoveSection(action, index) {
		await this.props.moveArray(action, index);
		this.updateState();
	}

	async onDeletSection(index) {
		await this.props.deleteSection(index);
		this.updateState();
	}

	async onAddSection(index) {
		this.props.addSectionBelow(index);
		this.updateState();
	}

	updateState() {
		const { sub_section, sub_section_content } = this.props.sectionData;
		this.setState({ sub_section, sub_section_content }, async () => {
			await this.isValid();
			this.props.updateSection(
				this.props.level,
				{
					sub_section: this.state.sub_section,
					sub_section_content: this.state.sub_section_content
				},
				this.state.errors
			);
		});
	}

	isValid() {
		const { errors, isValid } = validate(this.state);

		if (!isValid) {
			this.setState({ errors });
		} else {
			this.setState({ errors: {} });
		}

		return isValid;
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value }, () => {
			if (this.isValid()) {
				this.props.updateSection(
					this.props.level,
					{
						sub_section: this.state.sub_section,
						sub_section_content: this.state.sub_section_content
					},
					this.state.errors
				);
			}
		});
	}

	render() {
		const { sub_section, sub_section_content, errors } = this.state;
		const { classes, level, isFirst, isLast } = this.props;

		return (
			<div
				className={classname(
					classes.subSectionContainer,
					!isEmpty(errors) ? classes.subSectionErrorBorder : null
				)}
			>
				<Grid container spacing={16} alignItems="center" className={classes.container}>
					<Grid item xs={12} sm={7} md={9} lg={12}>
						<TextField
							id={'sub-section-' + level}
							label="Sub Section"
							margin="normal"
							required
							fullWidth
							name="sub_section"
							value={sub_section}
							onChange={this.onChange}
							error={!isEmpty(errors.sub_section)}
							helperText={errors.sub_section}
						/>
					</Grid>
					<Grid item xs={12}>
						<WysiwygField
							label="Sub Section Content"
							name="sub_section_content"
							value={sub_section_content ? sub_section_content : ''}
							onChange={this.onChange}
							error={errors.sub_section_content}
						/>
					</Grid>
					<Fab
						color="primary"
						size="small"
						className={classes.deleteBtn}
						onClick={() => this.onDeletSection(level)}
						classes={{ disabled: classes.deleteDisabled }}
					>
					  <DeleteIcon />
					</Fab>
					<div className={isEmpty(errors) ? classes.actionContainer : classnames(classes.actionContainer, classes.cardError)}>
						<IconButton className={classnames(classes.actionBtn, classes.addMarginRight)} onClick={() => this.onAddSection(level)}>
						   <Add size="small" />
						</IconButton>
						<IconButton color="primary" disabled={isFirst} className={classnames(classes.actionBtn, classes.addMarginRight)} onClick={() => this.onMoveSection("up", level)}>
						   <KeyboardArrowUpIcon />
						</IconButton>
						<IconButton disabled={isLast} className={classnames(classes.actionBtn, classes.blueColor)} onClick={() => this.onMoveSection("down", level)}>
						    <KeyboardArrowDownIcon />
						</IconButton>
					</div>
				</Grid>
			</div>
		);
	}
}

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
 const styles = (theme) => ({
	subSectionContainer: {
		padding: '0 16px 16px 16px',
		border: '1px solid #ccc',
		'border-radius': '4px',
		'margin-top': '28px',
		'&:first-of-type': {
			'margin-top': '18px',
		  }
	},
	container: {
		position: 'relative',
		overflow: 'visible',
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 4,
		'&:first-of-type': {
		  marginTop: theme.spacing.unit * 2
		},
		'&:last-of-type': {
		  marginBottom: theme.spacing.unit * 2
		}
	},
	subSectionErrorBorder: {
		borderColor: 'red'
	},
	actionContainer: {
		position: 'absolute',
		top: '-38px',
		right: '28px',
		border: '1px solid ' + borderColor,
		borderRadius: theme.spacing.unit * 4,
		background: white,
		padding: theme.spacing.unit / 2
	  },
	  cardError: {
		borderColor: red
	  },
	  deleteBtn: {
		position: 'absolute',
		top: '-40px',
		right: '-22px'
	  },
	  actionBtn: {
		padding: theme.spacing.unit / 2
	  },
	  blueColor: {
		color: blueIMMAP,
		'&:hover': {
		  backgroundColor: 'rgba(' + blueIMMAPRed + ', ' + blueIMMAPGreen + ', ' + blueIMMAPBlue + ', 0.08)'
		}
	  },
	  addMarginRight: {
		marginRight: theme.spacing.unit
	  },
	  deleteDisabled: {
		background: borderColor + ' !important'
	  },
});

export default withStyles(styles)(JobCategorySubSection);
