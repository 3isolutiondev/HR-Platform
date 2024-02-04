/** import React, Prop Types, and connect  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/** import Material UI styles, Component(s) and Icon(s) */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import withWidth from "@material-ui/core/withWidth";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import moment from 'moment';

/** import configuration value needed on this component */
import { primaryColor, white } from '../../config/colors';

/** import Redux actions and components needed on this component */
import { getAPI } from "../../redux/actions/apiActions";
import { addFlashMessage } from '../../redux/actions/webActions';

/**
 * ContractHistoryModal is a component to show the historic of user's contract.
 * @name ContractHistoryModal
 * @component
 * @category Consultant
 * @subcategory Contract History
 *
 */
class ContractHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            apiURL: '/api/contract-history/',
            histories: []
        };

        this.getData = this.getData.bind(this);
        this.onClose = this.onClose.bind(this);

    }

    /**
    * componentDidUpdate is a lifecycle function called where the component is updated
    */
    componentDidUpdate(previousProps, previousState) {
        if (this.props.isOpen && previousState.isLoading == this.state.isLoading) {
            this.getData();
        }
    }

    /**
    * getData is a function to fetch cantract history data from the API
    */
    getData() {
        this.props.getAPI(this.state.apiURL + this.props.userId)
            .then((res) => {
                this.setState({ isLoading: false, histories: res.data.data });
            })
            .catch((err) => {
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'There is an error while processing the request'
                });
            });
    }

    /**
    * onClose is a function to close the modal
    */
    onClose() {
        this.setState({ isLoading: true });
        this.props.onClose();
    }

    render() {
        const { isOpen, selectedImmaper, classes, isFromProfile } = this.props;
        const { isLoading, histories } = this.state;

        return (
            <Dialog open={isOpen} fullWidth maxWidth="xl" onClose={() => this.onClose()}>
                 { !isFromProfile &&
                    <DialogTitle>Contract History : {selectedImmaper}
                        {isLoading && (
                            <CircularProgress size={22} thickness={5} className={classes.loading} />
                        )}
                    </DialogTitle>
                 }
                <DialogContent>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>3iSolution Office</CustomTableCell>
                                <CustomTableCell>3iSolution</CustomTableCell>
                                <CustomTableCell>iMMAP France</CustomTableCell>
                                <CustomTableCell>Project Code</CustomTableCell>
                                <CustomTableCell>3iSolution Email</CustomTableCell>
                                <CustomTableCell>Job Title</CustomTableCell>
                                <CustomTableCell>Duty Station</CustomTableCell>
                                <CustomTableCell>Line Manager</CustomTableCell>
                                <CustomTableCell>Start of Contract</CustomTableCell>
                                <CustomTableCell>End of Contract</CustomTableCell>
                                { !isFromProfile &&
                                    <CustomTableCell>Role</CustomTableCell>
                                }
                                <CustomTableCell>International Contract</CustomTableCell>
                                <CustomTableCell>Under SBP Program</CustomTableCell>
                                { !isFromProfile &&
                                     <CustomTableCell>Date creation</CustomTableCell>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {histories.map((history) => (
                                <TableRow key={history.id}>
                                    <CustomTableCell component="th" scope="row">
                                        {history.immap_office.city}
                                    </CustomTableCell>
                                    <CustomTableCell>{history.is_immap_inc ? 'Yes' : 'No'}</CustomTableCell>
                                    <CustomTableCell>{history.is_immap_france ? 'Yes' : 'No'}</CustomTableCell>
                                    <CustomTableCell>{history.project_code}</CustomTableCell>
                                    <CustomTableCell>{history.immap_email}</CustomTableCell>
                                    <CustomTableCell>{history.job_title}</CustomTableCell>
                                    <CustomTableCell>{history.duty_station}</CustomTableCell>
                                    <CustomTableCell>{history.line_manager}</CustomTableCell>
                                    <CustomTableCell>{moment(history.start_of_contract).format('DD-MM-YYYY')}</CustomTableCell>
                                    <CustomTableCell>{moment(history.end_of_contract).format('DD-MM-YYYY')}</CustomTableCell>
                                    { !isFromProfile &&
                                        <CustomTableCell>{history.role}</CustomTableCell>
                                    }
                                    <CustomTableCell>{history.immap_contract_international ? 'Yes' : 'No'}</CustomTableCell>
                                    <CustomTableCell>{history.under_sbp_program ? 'Yes' : 'No'}</CustomTableCell>
                                    { !isFromProfile &&
                                        <CustomTableCell>{moment(history.created_at).format('DD-MM-YYYY')}</CustomTableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.onClose()} color="secondary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


ContractHistoryModal.propTypes = {
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
    * addFlashMessage prop: function to show flash message
    */
    addFlashMessage: PropTypes.func.isRequired,
}



/**
 * set up map dispatch for this component
 * @returns {object} mapDispatchToProps - contain several redux actions map as a prop to be accessed in the component
 */
const mapDispatchToProps = {
    getAPI,
    addFlashMessage
}

/**
* set up map state for this component
* @param {object} state
* @returns {object} data object prop to be accessed in the component
*/
const mapStateToProps = (state) => ({});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
    loading: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: primaryColor
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    }
});


/**
 * set up customised Table cell for this component
 * @param {object} theme
 * @returns {object}
 */
const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: primaryColor,
        color: white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export default withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContractHistoryModal)))
