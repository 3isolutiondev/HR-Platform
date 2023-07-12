import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Loadable from 'react-loadable';
import LoadingSpinner from '../../common/LoadingSpinner';
import { tabChange } from '../../redux/actions/roster/rosterActions';
import isEmpty from '../../validations/common/isEmpty';
import ReferenceCheckResults from './card/results/ReferenceCheckResults';
import JobQuestionDialog from '../jobs/JobQuestionDialog';
// import IMTestResults from './card/results/IMTestResults';

const RosterStep = Loadable({
	loader: () => import('./steps/RosterStep'),
	loading: LoadingSpinner,
	timeout: 20000, // 20 seconds
	delay: 500 // 0.5 seconds
});

class RosterLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.getCountPerStep = this.getCountPerStep.bind(this);
  }

	getCountPerStep(step, stepCount){
    if (!isEmpty(stepCount)) {
      if(step.set_rejected === 1 && !this.props.showAllRejected){
        return stepCount.rejectedThisYear;
      }
      return stepCount.steps.find(s => s.current_step === step.order) ? (stepCount.steps.find(s => s.current_step === step.order)).total : 0;
    } else { return 0 }
	}

	render() {
		const { roster_steps, tabValue, tabChange, stepCount } = this.props;
		return (
			<Grid container>
				{!isEmpty(roster_steps) ? (
					<Grid item xs={12}>
						<Tabs
							value={tabValue}
							onChange={tabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							scrollButtons="auto"
						>
							{roster_steps.map((rosterStep, index) => (
								<Tab key={'roster-step-' + index} label={`${rosterStep.step} (${this.getCountPerStep(rosterStep, stepCount)})` } />
							))}
						</Tabs>
						<RosterStep
              roster_process_id={this.props.roster_process_id}
              toogleShowQuestionDialog={this.props.toogleShowQuestionDialog}
              getStepCount={this.props.getStepCount}
              reloadProfiles={this.props.reloadProfiles}
            />
						<ReferenceCheckResults />
					</Grid>
				) : null}
			</Grid>
		);
	}
}


RosterLists.propTypes = {
	tabChange: PropTypes.func.isRequired,
  getStepCount: PropTypes.func.isRequired,

  stepCount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  roster_steps: PropTypes.array.isRequired,
	tabValue: PropTypes.number.isRequired,
  showAllRejected: PropTypes.bool.isRequired,
  reloadProfiles: PropTypes.func.isRequired
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	tabChange
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	roster_steps: state.roster.roster_steps,
	tabValue: state.roster.tabValue,
	showAllRejected: state.roster.showAllRejected
});

export default connect(mapStateToProps, mapDispatchToProps)(RosterLists);
