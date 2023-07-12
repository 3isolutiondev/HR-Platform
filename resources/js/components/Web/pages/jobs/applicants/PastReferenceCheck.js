import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { addFlashMessage } from '../../../redux/actions/webActions';
import { getPDF, getWORD } from '../../../redux/actions/common/PDFViewerActions';
import {
	red,
	redHover,
	blue,
	blueIMMAP,
	blueIMMAPHover,
	purple,
	purpleHover,
	white,
	secondaryColor,
	recommendationColor,
	recommendationHoverColor,
	primaryColor,
	primaryColorHover,
	green,
	greenHover,
	lightGrey
} from '../../../config/colors';
import classname from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import Error from '@material-ui/icons/Error';
import Retry from '@material-ui/icons/Replay';
import { Card, CardContent, Fab, Tooltip, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import PDFViewer from '../../../common/pdf-viewer/PDFViewer';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { getAPI } from '../../../redux/actions/apiActions';

class PastReferenceCheck extends Component {
	constructor(props) {
		super(props);

        this.state = {
            referenceHistories: [],
        }
	}
    

   /**
   * componentDidMount is a lifecycle function called where the component is mounted
   */
    componentDidMount() {
        this.props.getAPI(`/api/reference-check-history/${this.props.profile_id}`).then(res => {
            this.setState({referenceHistories: res.data.data})
        }).catch(err => {
            this.props.addFlashMessage({
                type: 'error',
                text: 'There is an error in fetching reference check history'
              });
        });
    }

	render() {
		const { classes } = this.props;
        const { referenceHistories } = this.state;
		return (
        <>
            <Grid container spacing={16} alignItems="center" className={classes.inviteContainer}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                    {
                        referenceHistories.map(reference => {
                            const file = reference.reference_file;
                            return (
                                <Card className={classname(classes.noRadius, classes.cardMarginBottom)}>
                                    <CardContent className={classes.cardPadding}>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12} md={3} lg={3} xl={3}>
                                                <Typography variant="subtitle1" component="label" color="primary">
                                                    Reference Name: 
                                                </Typography>
                                                <Typography variant="body1">
                                                    {reference.reference.full_name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3} lg={3} xl={3}>
                                                <Typography variant="subtitle1" component="label" color="primary">
                                                    Reference Type: 
                                                </Typography>
                                                <Typography variant="body1">
                                                    {reference.job ? 'Job' : 'Roster'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                                <Typography variant="subtitle1" component="label" color="primary">
                                                    Title
                                                </Typography>
                                                <Typography variant="body1" >
                                                    {reference.job ? reference.job.title : reference.roster_process.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2} lg={2} xl={2}>
                                                <div className={classes.iconContainer}>
                                                    {(file && file.url) &&
                                                        <Tooltip title="Download File">
                                                            <Fab
                                                                size="medium"
                                                                variant="extended"
                                                                color="primary"
                                                                href={file.url}
                                                                target="_blank"
                                                                className={classes.download}
                                                            >
                                                                {file.mime_type === 'application/pdf' ? (
                                                                    <FontAwesomeIcon icon={faFilePdf} size="lg" className={classes.fontAwesome} />
                                                                ) : <FontAwesomeIcon icon={faFileWord} size="lg" className={classes.fontAwesome} />}
                                                            </Fab>
                                                        </Tooltip> }
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </Grid>
            </Grid>
            <PDFViewer />
		</>
		);
	}
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	addFlashMessage,
	getPDF,
	getWORD,
    getAPI
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	reference_checks: state.options.reference_checks,
	job_status: state.options.job_status,
	jobStatusTab: state.applicant_lists.jobStatusTab,
	lastStepIndex: state.applicant_lists.lastStepIndex,
	interviewIndex: state.applicant_lists.interviewIndex,
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	inviteContainer: {
		'margin-bottom': '0px'
	},
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    cardPadding: {
		padding: '8px 16px !important',
		[theme.breakpoints.down('sm')]: {
			display: 'block'
		}
	},
	interviewBtn: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	resultBtn: {
		'background-color': recommendationColor,
		color: white,
		'&:hover': {
			'background-color': recommendationHoverColor
		}
	},
	addSmallMarginLeft: {
		'margin-left': '.25em'
	},
	addSmallMarginRight: {
		'margin-right': '.25em'
	},
	loading: {
		'margin-left': theme.spacing.unit,
		'margin-right': theme.spacing.unit,
		color: white
	}, 
	details: {
		marginBottom: 10,
		borderRadius: 3,
		marginTop: 10,
		paddingLeft: 8,
		paddingTop: 5,
		paddingBottom: 5,
		display: 'flex',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#eeeeee',
        alignItems: 'center'
	},
	detailsText: {
		fontSize: '16px !important',
		fontWeight: 500,
	},
	iconContainer: {
		display: 'flex',
		gap: 10,
		flexDirection: 'row',
	},
	referenceTitle: {
		fontSize: '18px !important',
        marginRight: '20px'
	},
    referenceName: {
		fontSize: '18px !important',
		fontWeight: 'bold',
        marginRight: '20px'
	},
    jobTitle: {
        fontSize: '16px !important',
		fontWeight: 500,
    },
	red: {
		'background-color': red,
		color: white,
		'&:hover': {
			'background-color': redHover
		}
	},
	blue: {
		'background-color': blue,
		color: white,
		'&:hover': {
			color: secondaryColor
		}
	},
	green: {
		'background-color': green,
		color: white,
		'&:hover': {
			color: greenHover
		}
	},
	grey: {
		'background-color': lightGrey,
		color: white,
		'&:hover': {
			color: grey
		}
	},
	purple: {
		'background-color': purple,
		color: white,
		'&:hover': {
			'background-color': purpleHover
		}
	},
	pdf: {
		'background-color': primaryColor,
		color: white,
		'&:hover': {
			'background-color': primaryColorHover
		}
	},
	word: {
		'background-color': blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
	download:{
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
	},
	successBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: green,
		color: white,
		'&:hover': {
			'background-color': green
		}
	},
	errorBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: red,
		color: white,
		'&:hover': {
			'background-color': red
		}
	},
	resendBtn: {
		marginRight: 5,
		width: "40px !important",
		marginTop: 3,
		backgroundColor: blueIMMAP,
		color: white,
		'&:hover': {
			'background-color': blueIMMAPHover
		}
	},
    cardMarginBottom: {
        marginBottom: 10
    }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PastReferenceCheck));
