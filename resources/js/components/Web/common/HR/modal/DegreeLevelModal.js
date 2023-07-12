import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import isEmpty from '../../../validations/common/isEmpty';

class DegreeLevelModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			degree: '',
			study: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.sendParameters = this.sendParameters.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	sendParameters() {
		this.props.setParameters({
			id: this.props.parameters.id,
			degree: this.state.degree,
			study: this.state.study
		});
		this.setState({
			id: '',
			degree: '',
			study: ''
		});
	}

	render() {
		const { isOpen } = this.props;
		const { degree, study, errors } = this.state;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.props.onClose}>
				<DialogTitle>Degree Level Parameters</DialogTitle>
				<DialogContent>
					<Grid container spacing={8}>
						<Grid item xs={12} sm={6}>
							<TextField
								id="degree"
								label="Degree or Academic Obtained"
								autoComplete="degree"
								margin="dense"
								required
								fullWidth
								name="degree"
								value={degree}
								onChange={this.onChange}
								error={!isEmpty(errors.degree)}
								helperText={errors.degree}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="study"
								label="Main Course of Study"
								autoComplete="study"
								margin="dense"
								required
								fullWidth
								name="study"
								value={study}
								onChange={this.onChange}
								error={!isEmpty(errors.study)}
								helperText={errors.study}
							/>
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

export default DegreeLevelModal;
