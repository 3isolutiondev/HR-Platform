import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { Card, CardHeader, Collapse, Switch } from '@material-ui/core'
import { Add, Minimize } from '@material-ui/icons'
import Cookies from 'js-cookie';


class CookieGroupDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		}
	}

	render() {
        const { classes, title, data, details } = this.props;
		return <>
		<Card className={classes.cookieCard} variant="outline" >
			<CardHeader
				title={<div className={classes.cookieHeader}>
						{!this.state.expanded && <Add className={classes.cardPlusIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  />}
						{this.state.expanded && <Minimize className={classes.cardMinimizeIcon} onClick={()=>{this.setState({expanded: !this.state.expanded})}}  />}
						<Typography
							variant="body1"
							className={classes.cardTitle}
							onClick={() => {
								this.setState({ keyword: '' })
								this.props.resetFilter()
							}}
						>
							 {title}
						</Typography>
					</div>
				}
				className={classes.noPaddingBottom}
			/>
			<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
						<Typography
							variant="body1"
							className={classes.details}
						>
							{details}
						</Typography>
				<div className={classes.descriptionContainer}>
					{data.map(d => <div key={d} className={classes.descriptionItem}>
						<Typography
							variant="body1"
							color="primary"
							className={classes.description}
						>
							{d}
						</Typography>
					</div>)}
				</div>
			</Collapse>
	    </Card>
	</>
	}
}


CookieGroupDialog.propTypes = {
	title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isEditable: PropTypes.bool,
    cookies: PropTypes.arrayOf(PropTypes.string)
};

CookieGroupDialog.defaultProps = {
    isEditable: true,
    cookies: []
};

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	cardTitle: {
		fontWeight: 'bold',
		marginTop: '0px',
		paddingBottom: '15px',

	},
	cardPlusIcon: {
		marginRight: 10,
		fontSize: '22px',
		marginTop: 2,
		cursor: 'pointer'
	},
	noPaddingBottom: {
		'padding-bottom': '0'
	},
	cookieHeader: {
		display: 'flex',
		marginTop: '0px',
		marginLeft: -5
	},
	cardMinimizeIcon: {
		marginRight: 10,
		fontSize: '22px',
		marginTop: -5,
		cursor: 'pointer'
	},
	cookieContent: {
		paddingLeft: 15,
		paddingRight: 10
	},
	switch: {
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 15,
		marginBottom: 2
	},
	textAction: {
		paddingTop: 8,
		paddingRight: 15
	},
	cookieCard: {
		boxShadow: "none",
    marginBottom: theme.spacing.unit
	},
	descriptionContainer: {
		backgroundColor: '#f8f7f7',
		borderRadius: 5,
		marginTop: 0,
		margin: 15
	},
	descriptionItem: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	description: {
		fontSize: 12,
		padding: 10
	},
	details: {
		paddingLeft: 15,
		paddingRight: 10,
		marginBottom: 10
	}
});

export default withWidth()(withStyles(styles)(CookieGroupDialog));
