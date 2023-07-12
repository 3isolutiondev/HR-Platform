import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import isEmpty from '../../../validations/common/isEmpty';
import Rating from 'material-ui-rating';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

import { withStyles } from '@material-ui/core/styles';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	iconButton: {
		'&:hover': {
			'background-color': 'transparent !important',
		},
		overflow: 'visible',
		textTransform: 'capitalize',
	},
	icon: {
		'margin-left': '-8px',
		marginRight: '4px',
	},
	root: {
		'max-width': '200px',
		width: '100%',
		overflow: 'visible'
	}
});

class SkillModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			years: 0,
			rating: 1,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.sendParameters = this.sendParameters.bind(this);
		this.autoCompleteOnChange = this.autoCompleteOnChange.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	sendParameters() {
		this.props.setParameters({
			id: this.props.parameters.id,
			years: this.state.years,
			rating: this.state.rating
		});
		this.setState({
			id: '',
			years: 0,
			rating: 1
		});
	}

	autoCompleteOnChange(name, value) {
		// this.setState({ [name]: value }, () => this.isValid())
		this.setState({ [name]: value });
	}

	render() {
		const { isOpen, classes } = this.props;
		const { years, rating, errors } = this.state;
		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.props.onClose}>
				<DialogTitle>Skill Parameters</DialogTitle>
				<DialogContent>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<TextField
								id="years"
								label="Years"
								autoComplete="years"
								margin="dense"
								required
								fullWidth
								name="years"
								value={years}
								onChange={this.onChange}
								error={!isEmpty(errors.years)}
								helperText={errors.years}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth error={!isEmpty(errors.rating) ? true : false}>
								<FormLabel>Proficiency Rating</FormLabel>
								<Rating
									value={rating}
									max={5}
									name="rating"
									onChange={(value) => this.autoCompleteOnChange('rating', value)}
									iconFilled={<Star color="primary" />}
									iconHovered={<Star color="primary" />}
									iconNormal={<StarBorder color="primary" />}
									classes={classes}
								/>
								{!isEmpty(errors.rating) && <FormHelperText>{errors.rating}</FormHelperText>}
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => this.props.onClose()} color="secondary" variant="contained">
						Close
					</Button>
					<Button onClick={this.sendParameters} color="primary" variant="contained">
						Set Parameters
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withStyles(styles)(SkillModal);
