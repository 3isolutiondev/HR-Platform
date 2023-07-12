import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAPI, deleteAPI, postAPI } from '../../redux/actions/apiActions';
import { addFlashMessage } from '../../redux/actions/webActions';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Btn from '../../common/Btn';
import CircleBtn from '../../common/CircleBtn';
import Alert from '../../common/Alert';
import { red, blue, purple, white, secondaryColor } from '../../config/colors';
import { withStyles } from '@material-ui/core/styles';
import { can } from '../../permissions/can';
import { Helmet } from 'react-helmet';
import { APP_NAME } from '../../config/general';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@material-ui/core';
import SkillPicker from '../../common/formFields/SkillPicker';


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
	},
	'dialog-title': {
		fontWeight:'semibold',
		height: 16
	}
});

class Skills extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skills: [],
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
					name: 'Skill',
					options: {
						filter: true,
						sort: true
					}
				},
				{
					name: 'Category',
					options: {
						filter: true,
						sort: true,
						filterOptions: {
							names: ['', 'technical', 'software', 'soft']
						},
						customFilterListOptions: { render: v => `Category: ${v}` },
					},
					
				},
				{
					name: 'Set Skill for Matching',
					options: {
						filter: false,
						sort: false
					}
				},
        		{
					name: 'Merge',
					options: {
						filter: false,
						sort: false,
						customBodyRender: (valueDestination, tableMeta, updateValue) => {
							if(this.state.tabValue === 'skill') return null;
							return <Button onClick={() => {
											this.setState({originSkill: {label: tableMeta.rowData[1], value: tableMeta.rowData[0]}})
										}} color="primary" variant="contained" > 
										Merge 
									</Button> ;
						},
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
				responsive: 'scroll',
				filterType: 'checkbox',
				download: false,
				print: false,
				selectableRows: 'none',
				sortFilterList: true,
				customToolbar: () => {
					if (can('Select Skill for Matching')) {
						return (
							<Btn
								link="/dashboard/skills/add"
								btnText="Add New Skill"
								btnStyle="contained"
								color="primary"
								size="small"
								icon={<Add />}
							/>
						);
					}

					return false;
				},
				onFilterChange: (type, list) => {
					if(type === 'Category') {
						this.getData(`?isApproved=${this.state.tabValue === 'skill' ? 1 : 0}`, list[2][0]);
					}
				},
				// onRowsDelete: (rows) => {
				// 	let deletedRows = rows.data;

				// 	const { skills } = this.state;
				// 	deletedRows.forEach((rowData, index) => {
				// 		let userId = roles[rowData.dataIndex][0];

				// 		this.props
				// 			.deleteAPI(this.state.apiURL + '/' + userId)
				// 			.then((res) => {
				// 				const { status, message } = res.data;
				// 				this.props.addFlashMessage({
				// 					type: status,
				// 					text: message
				// 				});
				// 			})
				// 			.catch((err) => {
				// 				this.props.addFlashMessage({
				// 					type: 'error',
				// 					text: 'There is an error while processing the delete request'
				// 				});
				// 			});
				// 	});

				// 	this.getData();
				// }
			},
			alertOpen: false,
			name: '',
			deleteId: 0,
			apiURL: '/api/skills',
			tabValue: 'skill',
			mergingFields: null,
			originSkill: null,
			showMergingFields: false,
		};

		this.getData = this.getData.bind(this);
		this.deleteData = this.deleteData.bind(this);
		this.dataToArray = this.dataToArray.bind(this);
		this.setForMatching = this.setForMatching.bind(this);
    	this.changeTabValue = this.changeTabValue.bind(this);
		this.mergeTab = this.mergeTab.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

  /**
   * ChangeTabValue is a function that gets triggered when the value of the tab changes
	 * @param {string} value - the value of the tab
	 * @param {object} event - the event object
     */
	changeTabValue(e, value) {
		this.setState({ tabValue: value }, () => {
			this.getData(`?isApproved=${value === 'skill' ? 1 : 0}`);
		});
	}

		/**
	 * mergeTab is a function that merges two skills
	 * @param {string} originField - the value of the tab
	 * @param {string} targetFied - the event object
	 */
			mergeTab(originField, targetFied) {
			this.props.postAPI(`/api/skills/merge`, {
				origin: originField,
				destination: targetFied
			}).then((res) => {
				const { status, message } = res.data;
				this.setState({mergingFields: null, showMergingFields: false, originSkill: null});
				this.props.addFlashMessage({
					type: status,
					text: message
				});
				this.getData(`?isApproved=${this.state.tabValue === 'skill' ? 1 : 0}`);
			}).catch((err) => {
				this.setState({mergingFields: null, showMergingFields: false});
				this.props.addFlashMessage({
					type: 'error',
					text: 'There is an error while processing the merge request'
				});
			});
		}

	getData(query='?isApproved=1', category = '') {
		this.props
			.getAPI(this.state.apiURL+query+(category ? '&category='+category: ''))
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
			let dataTemp = [ data.id, data.skill, data.category ];

			const setForMatching = (
				<div>
					<Checkbox
						checked={data.skill_for_matching === 1 ? true : false}
						onChange={(e) => this.setForMatching(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			dataTemp.push(setForMatching);

      const setIsApproved = (
				<div>
					<Checkbox
						checked={data.is_approved === 1 ? true : false}
						onChange={(e) => this.setIsApproved(data.id, e)}
						value={data.id.toString()}
						color="primary"
					/>
				</div>
			);

			dataTemp.push(setIsApproved);

			const actions = (
				<div className={classes.actions}>
					{/* {can('Select Skill for Matching') && (
						<CircleBtn
							link={'/dashboard/skills/' + data.id}
							color={classes.blue}
							size="small"
							icon={<RemoveRedEye />}
						/>
					)} */}
					{can('Select Skill for Matching') && (
						<CircleBtn
							link={'/dashboard/skills/' + data.id + '/edit'}
							color={classes.purple}
							size="small"
							icon={<Edit />}
						/>
					)}
					{can('Select Skill for Matching') && (
						<CircleBtn
							color={classes.red}
							size="small"
							icon={<Delete />}
							onClick={() => {
								this.setState({
									deleteId: data.id,
									name: data.skill,
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

		this.setState({ skills: dataInArray });
	}

	setForMatching(dataId, e) {
		this.props
			.postAPI(this.state.apiURL + '/set-for-matching', { id: dataId })
			.then((res) => {
				// this.dataToArray(res.data.data)
				this.getData('?isApproved='+(this.state.tabValue === 'skill' ? '1' : '0'));
				this.props.addFlashMessage({
					type: 'success',
					text: 'Skill selected for matching'
				});
			})
			.catch((err) => {});
	}

	render() {
		let { skills, columns, options, alertOpen, name, deleteId } = this.state;
		return (
			<div>
			{this.state.originSkill && (
				<Dialog
					open={true}
					keepMounted
					onClose={() => {this.setState({originSkill: null})}}
					style={{overflow: 'visible'}}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle id="alert-dialog-slide-title" style={{minWidth: 400, maxWidth: 400}}>
						Merge <span className='dialog-title'>{this.state.originSkill.label}</span>
					</DialogTitle>
					<DialogContent style={{overflow: 'visible'}}>
						<div style={{ minWidth: 400, zIndex: 1000, position: 'fixed', marginTop: 20}}>
							<SkillPicker
								name="preferred_skill"
								placeholder="Select destination skill"
								skills={[]}
								onChange={(value, e) => {
									this.setState({mergingFields: {
										destination: value[0],
										origin: this.state.originSkill
									}});
								}}
								isMulti={false}
							/>
						</div>
					</DialogContent>
					<DialogActions style={{ justifyContent: 'space-between', marginLeft: 15, marginRight: 15, marginTop: 100 }}>
						<Button variant="outlined" color='primary' onClick={() => { this.setState({originSkill: null}) }}>
							Cancel
						</Button>
						<Button variant="contained" color='primary' onClick={() => { this.setState({showMergingFields: true})}}>
							Continue
						</Button>
					</DialogActions>
				</Dialog>
			)}
				<Helmet>
					<title>{APP_NAME + ' - Dashboard > Skill List'}</title>
					<meta name="description" content={APP_NAME + ' Dashboard > Skill List'} />
				</Helmet>
        <Tabs value={this.state.tabValue}
				  onChange={this.changeTabValue}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab label={'Skills'} value={'skill'}/>
					<Tab label={'Archived'} value={'archived'}/>
				</Tabs>
				<MUIDataTable
					title={'Skill List'}
					data={skills}
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
					text={'Are you sure to delete skill : ' + name + ' ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/>
        {(this.state.mergingFields && this.state.showMergingFields) ? <Alert
					isOpen={this.state.mergingFields ? true : false}
					onClose={() => {
						this.setState({ mergingFields: null });
					}}
					onAgree={() => {
						this.mergeTab(this.state.mergingFields.origin.value, this.state.mergingFields.destination.value)
					}}
					title="Merge Warning"
					text={'This will merge ' + this.state.mergingFields.origin.label + ' into '+ this.state.mergingFields.destination.label+' and permanently remove ' + this.state.mergingFields.origin.label+'. Would you like to continue ?'}
					closeText="Cancel"
					AgreeText="Yes"
				/> : null}
			</div>
		);
	}
}

Skills.propTypes = {
	user: PropTypes.object.isRequired,
	getAPI: PropTypes.func.isRequired,
	deleteAPI: PropTypes.func.isRequired,
	postAPI: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	user: state.auth.user
});

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	getAPI,
	deleteAPI,
	postAPI,
	addFlashMessage
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Skills));
