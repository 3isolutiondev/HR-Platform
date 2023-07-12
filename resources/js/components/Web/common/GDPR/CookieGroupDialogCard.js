import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { Card, CardHeader, Collapse, Switch } from '@material-ui/core'
import { Add, Minimize } from '@material-ui/icons'


class CookieGroupDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		}
	}

	render() {
        const { classes, title, description, isEditable, active, toogleAcceptCookies, value, setSelectedGroup } = this.props;
		return <>
		<Card className={classes.cookieCard} >
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
				action={
					isEditable ? <Switch defaultChecked={active} onChange={()=>{
						toogleAcceptCookies(value)
					}} color="primary" className={classes.switch} /> :<Typography
						variant="body1"
						color="primary"
						className={classes.textAction}
					>
						Always Active
					</Typography>
				}
			/>
			<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
				<div className={classes.cookieContent}>
					<Typography variant="body1" className={classes.description}>{description}</Typography>
					<Typography variant="body1" color="primary" className={classes.link} onClick={()=>{
						setSelectedGroup(value)
					}}>
						Cookie Details
					</Typography>
				</div>
			</Collapse>
	    </Card>
	</>
	}
}


CookieGroupDialog.propTypes = {
	title: PropTypes.string.isRequired,
    isEditable: PropTypes.bool,
    cookies: PropTypes.arrayOf(PropTypes.string),
	active: PropTypes.bool
};

CookieGroupDialog.defaultProps = {
    isEditable: true,
    cookies: [],
	active: false
};

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
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
  cookieCard: {
    marginBottom: theme.spacing.unit
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
		marginBottom: 10
	},
	textAction: {
		paddingTop: 8,
		paddingRight: 15
	},
	description: {
		whiteSpace: 'pre-line'
	},
	link: {
		cursor: 'pointer',
		marginTop: 15,
		marginBottom: 10
	}
});

export default withWidth()(withStyles(styles)(CookieGroupDialog));
