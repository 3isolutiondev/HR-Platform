import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import WysiwygField from '../../../Web/common/formFields/WysiwygField';

const style = {
	border: '1px solid #ccc',
	padding: '0 16px 16px 16px',
	marginTop: '16px',
	borderRadius: '4px'
};

class Fq extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jawaban: '',
			fd: []
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e, index) {
		this.state.fd[index] = e.target.value;
		this.setState({
			//            [e.target.name]: e.target.value
			fd: this.state.fd
		});
		//        this.setState({
		//            [e.target.name]: e.target.value
		//        }, () => {
		//            this.props.getVal(
		//                this.props.index,
		//                e.target.value,
		//                {
		//                    jawaban: this.state.jawaban,
		//                }
		//            );
		//        });
		//        this.setState({
		//            jawaban: e.target.value
		//        });
	}

	render() {
		return (
			<Grid container spacing={16} alignItems="center" style={style}>
				<Grid item xs={12}>
					<Typography component="p">{this.props.nilai.question}</Typography>
				</Grid>

				<Grid item xs={12}>
					<WysiwygField
						label=""
						name="jabawan"
						value={this.state.jawaban ? this.state.jawaban : ''}
						onChange={(e) => this.handleChange(e, this.props.nilai.index)}
					/>
				</Grid>
			</Grid>
		);
	}
}

export default Fq;
