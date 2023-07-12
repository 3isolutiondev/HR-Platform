import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

class IMTestResults extends Component {
	render() {
		return <div>asdf</div>;
	}
}

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({});

const styles = (theme) => ({});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IMTestResults));
