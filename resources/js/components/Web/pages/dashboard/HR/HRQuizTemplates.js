import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../../common/Btn';
import CircleBtn from '../../../common/CircleBtn';
import Alert from '../../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../../config/colors';
import { getAPI, deleteAPI } from '../../../redux/actions/apiActions';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { can } from '../../../permissions/can';

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

class HRQuizTemplates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			template: [],
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
								btnText="Add New Template"
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

					const { tors } = this.state;
					deletedRows.forEach((rowData, index) => {
						let recordId = tors[rowData.dataIndex][0];

						this.props
							.deleteAPI(this.state.apiURL + '/' + recordId)
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
			open: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/quiz-templates'
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
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
				this.setState({ deleteId: 0, alertOpen: false, full_name: '' }, () => this.getData());
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

			const actions = (
				<div className={classes.actions}>
					{can('Edit Quiz Template') && (
						<CircleBtn
							link={this.state.apiURL + data.id}
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

		this.setState({ tors: dataInArray });
	}
	render() {
		let { template, columns, options, alertOpen, name } = this.state;
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<MUIDataTable
						title={'Quiz Template List'}
						data={template}
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
						text={'Are you sure to delete tor : ' + name + ' ?'}
						closeText="Cancel"
						AgreeText="Yes"
					/>
				</Grid>
			</Grid>
		);
	}
}

HRQuizTemplates.propTypes = {
	getAPI: PropTypes.func.isRequired,
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
	deleteAPI,
	addFlashMessage
};

export default withStyles(styles)(connect('', mapDispatchToProps)(HRQuizTemplates));
