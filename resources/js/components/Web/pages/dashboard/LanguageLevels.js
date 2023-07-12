import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import { red } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import { getAPI, postAPI, deleteAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import SortableLists from '../../common/SortableLists';
import arrayMove from 'array-move';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	noTextDecoration: {
		'text-decoration': 'none'
	}
});

class LanguageLevels extends Component {
	constructor(props) {
		super(props);
		this.state = {
			languageLevels: [],
			alertOpen: false,
			apiURL: '/api/language-levels',
			baseLink: '/dashboard/language-levels/'
		};

		this.getData = this.getData.bind(this);
		this.updateOrder = this.updateOrder.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.props
			.getAPI(this.state.apiURL)
			.then((res) => {
				this.setState({ languageLevels: res.data.data ? res.data.data : [] });
			})
			.catch((err) => {});
	}

	updateOrder({ oldIndex, newIndex }) {
		let { languageLevels } = this.state;
		this.setState({ languageLevels: arrayMove(languageLevels, oldIndex, newIndex) }, () => {
			this.props
				.postAPI(this.state.apiURL + '/change-order', { languageLevels: this.state.languageLevels })
				.then((res) => {
					this.props.addFlashMessage({
						type: res.data.status,
						text: res.data.message
					});
				})
				.catch((err) => {});
		});
	}

	onDelete(id) {
		this.props
			.deleteAPI(this.state.apiURL + '/' + id)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.getData();
				// this.setState({ deleteId: 0, alertOpen: false, full_name: ''}, () => this.getData())
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	render() {
		const { languageLevels, baseLink, alertOpen } = this.state;
		const { classes } = this.props;
		return (
			<Grid container>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Language Level List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Language Level List'} />
				</Helmet>
				<Grid item xs={12} sm={9} md={10} lg={11}>
					<Typography variant="h4">Language Levels</Typography>
				</Grid>
				<Grid item xs={12} sm={3} md={2} lg={1}>
					<Link to="/dashboard/language-levels/add" className={classes.noTextDecoration}>
						<Button variant="contained" color="primary" fullWidth>
							<Add /> Add Level
						</Button>
					</Link>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1">Change Order / Step</Typography>
				</Grid>
				<Grid item xs={12}>
					<SortableLists
						items={languageLevels}
						onSortEnd={this.updateOrder}
						onDelete={this.onDelete}
						baseLink={baseLink}
						distance={2}
					/>
				</Grid>
				{/* <Alert
          isOpen={alertOpen}
          onClose={ () => {this.setState({ alertOpen: false })} }
          onAgree={ () => {this.deleteData() }}
          title="Delete Warning"
          text={"Are you sure to delete user : " + name + ' ?'}
          closeText="Cancel"
          AgreeText="Yes"
        /> */}
			</Grid>
		);
	}
}

LanguageLevels.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	postAPI,
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(LanguageLevels));
