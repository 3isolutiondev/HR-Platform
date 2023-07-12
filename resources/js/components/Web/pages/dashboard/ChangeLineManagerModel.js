/** import React, Prop Types, and connect  */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/** import Material UI styles, Component(s) and Icon(s) */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from "@material-ui/core/Button";
import withWidth from "@material-ui/core/withWidth";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Send from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';

/** import configuration value needed on this component */
import { primaryColor, white } from "../../config/colors";

/** import Redux actions and components needed on this component */
import { getAPI, postAPI } from "../../redux/actions/apiActions";
import { addFlashMessage } from "../../redux/actions/webActions";
import { getLineManagers } from '../../redux/actions/optionActions';
import SearchField from '../../common/formFields/SearchField';
import isEmpty from '../../validations/common/isEmpty';

/**
 * ChangeLineManagerModel is a component to show the historic of user's contract.
 * @name ChangeLineManagerModel
 * @component
 * @category iMMAPer
 * @subcategory Contract History
 *
 */
class ChangeLineManagerModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      apiURL: "/api/users/change-line-manager/",
      managerSearch: '',
	  managerSearchLoading: false,
      lineManager: "",
      open_confirmation: false
    };

    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
	this.timerCheck = this.timerCheck.bind(this);
    this.openConfirmation = this.openConfirmation.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);

  }

  /**
   * componentDidUpdate is a lifecycle function called where the component is updated
   */
   componentDidUpdate(prevProps, prevState) {
    if ((prevState.managerSearch !== this.state.managerSearch)) {
        this.timerCheck();
    }
}

  /**
   * onSubmit is a function to send data of line manager to the API
   */
   onSubmit() {
    let data = {
        _method: 'PUT',
        line_manager_id: this.state.lineManager.value,
        line_manager_name: this.state.lineManager.label
    }
    this.setState({ isLoading: true });
    this.props.postAPI(this.state.apiURL + this.props.userId, data)
    .then((res) => {
        this.props.addFlashMessage({
          type: 'success',
          text: "The Change well Saved success"
        });
        this.setState({ isLoading: false, lineManager: "" });
        this.props.onClose();
        this.closeConfirmation();
        this.props.refeshImmapers()
      })
      .catch((err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: "Error while saving data"
        });
        this.setState({ isLoading: false, lineManager: "" });
        this.props.onClose();
      });
  }

  /**
   * onClose is a function to close the modal
   */
  onClose() {
    this.setState({ isLoading: false, lineManager: "" });
    this.props.onClose();
  }

   /**
   * timerCheck is a function to delay getting data when the user type something in the search box
   */
  timerCheck() {
    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
        if (!isEmpty(this.state.managerSearch)) { await this.props.getLineManagers(this.state.managerSearch); }
        this.setState({ isLoading: false, managerSearchLoading: false })
    }, 500)
 }

  /** function to open alert modal to confirm the change*/
  openConfirmation() {
    this.setState({ open_confirmation: true });
  }

  /** function to close alert modal tto confirm the change */
  closeConfirmation() {
        this.setState({ open_confirmation: false });
    }

  render() {
    const { isOpen, selectedImmaper, classes, lineManagers } = this.props;
    const { isLoading, managerSearch, managerSearchLoading, lineManager } = this.state;
    const errors = isEmpty(lineManager) ? { line_manager: 'Line Manager is required'} : {};

    return (
        <>
        <Dialog open={isOpen} fullWidth onClose={() => this.onClose()}>
            <DialogTitle>Change the Line manager of: {selectedImmaper}</DialogTitle>
            <DialogContent>
            <SearchField
                required
                label="Line Manager"
                id="line_manager"
                name="line_manager"
                margin="none"
                keyword={managerSearch}
                placeholder="Search and Pick Line manager"
                onKeywordChange={e => {
                this.setState({
                    managerSearch: e.target.value,
                    managerSearchLoading: true
                });
                }}
                value={!isEmpty(lineManager) ? lineManager.label : ""}
                options={lineManagers}
                loadingText="Loading line managers..."
                searchLoading={managerSearchLoading}
                onSelect={value => {
                this.setState({ managerSearch: "", lineManager: { value: value.id,label: value.full_name }});
                }}
                onDelete={() => {
                    this.setState({ lineManager: ""});
                }}
                optionSelectedProperty="full_name"
                notFoundText="Sorry, no line manager found"
                error={errors.line_manager}
            /> <br/><br/><br/>
            </DialogContent>
            <DialogActions>
            <Button
                onClick={() => this.onClose()}
                color="secondary"
                variant="contained"
            >
                Close
            </Button>
            <Button
                variant="contained"
                onClick={() => this.openConfirmation()}
                color="primary"
                disabled={isLoading || !isEmpty(errors)}
            >
                Save
                {isLoading  && (
                <CircularProgress
                    color="secondary"
                    className={classes.loading}
                    thickness={5}
                    size={22}
                />
                )}
            </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={this.state.open_confirmation} onClose={this.closeConfirmation}>
        <DialogTitle>Change Line Manager</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-remove-confirmation">
                Are you sure you want to move {selectedImmaper} staff to {lineManager.label}?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={this.closeConfirmation}
                color="secondary"
                variant="contained"
                disabled={isLoading ? true : false}
            >
            <CancelIcon fontSize="small" className={classes.addSmallMarginRight} />
                Cancel
            </Button>
            <Button
                onClick={this.onSubmit}
                color="primary"
                autoFocus
                variant="contained"
                disabled={isLoading ? true : false}
            >
                <Send fontSize="small" className={classes.addMarginLeft} />
                     Change
                {isLoading && (
                    <CircularProgress size={22} thickness={5} className={classes.loading} />
                )}
            </Button>
        </DialogActions>
        </Dialog>
      </>
    );
  }
}

ChangeLineManagerModel.propTypes = {
  /**
   * isOpen is a prop containing the status to open the midel or not
   */
  isOpen: PropTypes.bool.isRequired,

  /**
   * userId is a prop containing the user id of selected user
   */
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * getAPI is a prop function to close the modal
   */
  onClose: PropTypes.func.isRequired,

  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,

  /**
   * getAPI is a prop function to call get api
   */
  getAPI: PropTypes.func.isRequired,

   /**
   * postAPI is a prop function to call post api
   */
    postAPI: PropTypes.func.isRequired,

  /**
   * addFlashMessage prop: function to show flash message
   */
     addFlashMessage: PropTypes.func.isRequired,
   /**
   * getLineManagers prop: function to get all the line managers
   */
    getLineManagers: PropTypes.func.getLineManagers
};

/**
 * set up map dispatch for this component
 * @returns {object} mapDispatchToProps - contain several redux actions map as a prop to be accessed in the component
 */
const mapDispatchToProps = {
  getAPI,
  postAPI,
  addFlashMessage,
  getLineManagers,
};

/**
 * set up map state for this component
 * @param {object} state
 * @returns {object} data object prop to be accessed in the component
 */
const mapStateToProps = state => ({
    lineManagers: state.options.lineManagers || [],
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = theme => ({
  loading: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: primaryColor
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  addSmallMarginRight: {
    'margin-right': '.25em'
  },
});

export default withWidth()(withStyles(styles)(connect( mapStateToProps,mapDispatchToProps)(ChangeLineManagerModel)));
