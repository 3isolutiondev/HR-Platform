import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI, postAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
// import CircularProgress from '@material-ui/core/CircularProgress'
import MUIDataTable from 'mui-datatables';
// import isEmpty from '../../../validations/common/isEmpty';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import CheckCircle from '@material-ui/icons/CheckCircle';
// import Button from '@material-ui/core/Button'
// import Fab from '@material-ui/core/Fab';
import Checkbox from '@material-ui/core/Checkbox';
import Btn from '../../../common/Btn';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../../config/general';

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	actions: {
		width: 144
	},
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	},
	blue: {
		'background-color': blue,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	},
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	}
});

class QuizTemplates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quizTemplates: [],
			columns: [
				{
					name: 'id',
					options: {
						display: 'excluded',
						filter: false,
						sort: false
					}
				},
				{
					name: 'Title',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Default',
					options: {
						filter: false,
						sort: false
					}
				},
				{
					name: 'IM Test',
					options: {
						filter: false,
						sort: false
					}
				},
				{
					name: 'Duration',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Pass Score',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Action',
					options: {
						filter: false,
						sort: false
					}
				}
			],
			options: {
				filterType: 'checkbox',
				download: false,
				print: false,
				customToolbar: () => {
					if (can('Add Quiz Template')) {
						return (
							<Btn
								link="/dashboard/quiz-templates/add"
								btnText="Add New Quiz Template"
								btnStyle="contained"
								color="primary"
								size="small"
								icon={<Add />}
							/>
						);
					}

					return false;
				},
				onRowsDelete: (rows) => {
					let deletedRows = rows.data;

					const { roles } = this.state;
					deletedRows.forEach((rowData, index) => {
						let userId = roles[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + userId)
							.then((res) => {
								const { status, message } = res.data;
								this.props.addFlashMessage({
									type: status,
									text: message
								});
							})
							.catch((err) => {
								this.props.addFlashMessage({
									type: 'error',
									text: 'There is an error while processing the delete request'
								});
							});
					});

					this.getData();
				}
			},
			alertOpen: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/quiz-templates'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.props
			.getAPI(this.state.apiURL)
			.then((res) => {
				this.dataToArray(res.data.data);
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the request'
				});
			});
	}

	deleteData() {
		this.props
			.deleteAPI(this.state.apiURL + '/' + this.state.deleteId)
			.then((res) => {
				const { status, message } = res.data;
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.setState({ deleteId: 0, alertOpen: false }, () => this.getData());
			})
			.catch((err) => {
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the delete request'
				});
			});
	}

	dataToArray(jsonData) {
		const { classes } = this.props;
		let dataInArray = jsonData.map((data, index) => {
			let dataTemp = [ data.id, data.title ];

			const setIsDefault = (
				<div>
					<Checkbox
						checked={data.is_default === 1 ? true : false}
						onChange={(e) => this.setIsDefault(data.id, e)}
						value={data.id.toString()}
						color="primary"
						// isD/
					/>
				</div>
			);

			dataTemp.push(setIsDefault);
			const setIsIMTest = <div>{data.is_im_test === 1 && <CheckCircle color="primary" />}</div>;

			dataTemp.push(setIsIMTest);
			dataTemp.push(data.duration);
			dataTemp.push(data.pass_score);

			const actions = (
				<div className={classes.actions}>
					{can('Show Quiz Template') && (
						<CircleBtn
							link={'/dashboard/quiz-templates/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)}
					{can('Edit Quiz Template') && (
						<CircleBtn
							link={'/dashboard/quiz-templates/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Delete Quiz Template') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.title,
									alertOpen: true
								});
							}}
						/>
					)}
				</div>
			);

			dataTemp.push(actions);

			return dataTemp;
		});

		this.setState({ quizTemplates: dataInArray });
	}

	setIsDefault(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-is-default', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData();
				this.props.addFlashMessage({
					type: 'success',
					text: 'Default status updated'
				});
			})
			.catch((err) => {});
	}

	render() {
		let { quizTemplates, columns, options, alertOpen, name, deleteId } = this.state;

		return (
			<div>
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Quiz Template List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Quiz Template List'} />
				</Helmet>
				<MUIDataTable
					title={'Quiz Template List'}
					data={quizTemplates}
					columns={columns}
					options={options}
					download={false}
					print={false}
				/>
				<Alert
					isOpen={alertOpen}
					onClose={() => {
						this.setState({ alertOpen: false });
					}}
					onAgree={() => {
						this.deleteData();
					}}
					title="Delete Warning"
					text={'Are you sure to delete quiz template : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
			</div>
		);
	}
}

QuizTemplates.propTypes = {
	getAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
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

export default withStyles(styles)(connect('', mapDispatchToProps)(QuizTemplates));

// const QuizTemplates = () => <div>sgsg</div>;

// export default QuizTemplates;
