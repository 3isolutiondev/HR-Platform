import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import isEmpty from '../../../validations/common/isEmpty';

class SectorModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			years: 1,
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
			years: this.state.years
		});
		this.setState({
			id: '',
			years: 1
		});
	}

	render() {
		const { isOpen } = this.props;
		const { years, errors } = this.state;

		return (
			<Dialog open={isOpen} fullWidth maxWidth="lg" onClose={this.props.onClose}>
				<DialogTitle>Sector Parameters</DialogTitle>
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

export default SectorModal;
