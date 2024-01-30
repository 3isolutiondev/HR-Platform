/** import React and PropTypes */
import React from 'react';
import PropTypes from 'prop-types';

/** import Material UI withStyles and components */
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { disclaimerOnChange, acceptDisclaimer } from '../../../redux/actions/p11Actions';

/**
 * Disclaimer is a component to show disclaimer in profile step
 *
 * @name Disclaimer
 * @component
 * @category Page
 * @subcategory P11
 *
 */
const Disclaimer = ({ classes, disclaimer_agree, disclaimer_open, disclaimerOnChange, acceptDisclaimer }) => (
	<Dialog open={disclaimer_open == 1 ? true : false} maxWidth="lg">
		<DialogTitle disableTypography={true}>
			<Typography variant="h4" component="h4" color="primary">
				DISCLAIMER
			</Typography>
		</DialogTitle>
		<DialogContent>
			<Typography variant="h6" component="h6" color="primary">
              3iSolution
			</Typography>
			<br />

			<Typography variant="body1" component="p">
                3iSolution is an <b>international not-for-profit organization</b> that provides{' '}
				<b>information management services</b> to humanitarian and development organizations, enabling partners
				to make informed decisions that ultimately provide <b>high-quality targeted assistance</b> to the
				world’s most vulnerable populations.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				We support humanitarian actors to <b>solve operational and strategic challenges</b>. Our{' '}
				<b>
					pioneering approach facilitates informed and effective emergency preparedness, humanitarian
					response, and development aid activities by enabling evidence-based decision-making
				</b>{' '}
				for UN agencies, humanitarian cluster/sector leads, NGOs, and government operations.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
                3iSolution has been at the forefront of information management <b>support for humanitarian clusters</b> (UN
				and International NGOs): Logistics, WASH, Health, Protection, Education, Nutrition, Camp Management,
				Protection, Food Security, and Gender-Based Violence.
			</Typography>
			<br />
			<Typography variant="h6" component="h6" color="primary">
				3iSolution Careers
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				As an Information Management organization, 3iSolution is always looking for new talents to welcome into the
				IM Family. Therefore, we developed 3iSolution Careers, an online tool totally built in house thanks to 3iSolution
				personnel. This platform aims to enhance 3iSolution operationality and efficiency when it comes to deployment
				and personnel follow-up. An important part of its purpose is to facilitate the recruitment, hiring and
				onboarding processes but also to invite people to learn more about 3iSolution and the opportunities that we
				offer. By registering on 3iSolution Careers, you will be able to create your own profile, check job vacancies
				and apply for our Roster.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				The Roster aims to gather a pool of talented people willing to work with 3iSolution. If you apply and your
				profile is selected as a match for our needs and projects, you will integrate our records and will be
				the first in line in the selection process when 3iSolution opens a new position for one of its numerous
				projects around the world. Information Management, GIS, web or tool development, communications,
				capacity strengthening, project management, field coordination are part of the many job categories
				present among the 3iSolution Family, so if you think your profile and expertise may be interesting assets for
				3iSolution, apply for the 3iSolution Talent Pool and be sure you will be informed as soon as a job position matches
				your profile and expectations.
			</Typography>
			<br />
			<Typography variant="h6" component="h6" color="primary">
				Use of Data
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				In the course of 3iSolution Careers, we may collect the following types of information about you as a
				potential candidate: name, telephone number, e-mail address, resume information (employment history,
				education, professional credentials, memberships in professional organizations, skills, etc.),
				citizenship, information from former employers and other references, and additional information to the
				extent we have acquired or you have provided us with such information. We also use photos of you that
				you provide to us or that you make publicly available on the Internet (e.g., LinkedIn). As permitted by
				applicable laws, we obtain background verification information. In certain cases, we request sensitive
				Personal Information about you.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				We may use this information to ensure that 3iSolution Careers conforms with legal requirements, including
				equal opportunity laws. In addition to this purpose, the main use of this information will be to enable
				us to offer you job opportunities matching your profile or filtering users on professional criteria in
				order to provide a recruitment service always tailored to our users’ needs as well as to 3iSolution needs.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				Any Personal Information shared via e-mail or electronic forms means that we have your consent to
				obtain, process, keep and share this information with relevant parties if necessary. If you submit any
				Personal Information about other people to us or to our service providers, you represent that you have
				the authority to do so and to permit us to use the information in accordance with this Policy.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				When providing 3iSolution Careers we may also obtain Personal Information about you from referrals, public
				databases, licensed databases, and social media platforms. The information we collect from these third
				parties includes information about the identity of potential candidates (e.g., an individual’s name,
				address, telephone number, e-mail address), information about their background and qualifications
				(employment history, education, professional credentials, memberships in professional organizations,
				skills, etc.), citizenship, information from former employers and other references.
			</Typography>
			<br />
			<Typography variant="h6" component="h6" color="primary">
				Get more information on the use of data and its deletion process:
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				All the data you will provide on 3iSolution Careers will remain at 3iSolution for internal use only and you will
				have the opportunity to ask for the complete deletion of it.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				3iSolution will keep your details up to 5 years starting from the moment you enter the data; you edit your
				profile or apply for a position through 3iSolution Careers. However, deletion of the entirety of your details
				is possible by contacting the 3iSolution Careers administrator by email at immapcareers@organization.org.
			</Typography>
			<br />
			<Typography variant="body1" component="p">
				For further details about 3iSolution Data Protection please do not hesitate to contact the email address
				stated above.
			</Typography>
		</DialogContent>
		<DialogActions className={classes.dialogActions}>
			<Grid container spacing={0}>
				<Grid item xs={12}>
					<FormControl>
						<FormControlLabel
							control={
								<Checkbox
									checked={disclaimer_agree == 1 ? true : false}
									name="disclaimer_agree"
									color="primary"
									onChange={disclaimerOnChange}
								/>
							}
							label="I understand and accept all the terms and conditions described below and allow 3iSolution to keep and use my information for internal purposes."
						/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<div className={classes.btnContainer}>
						<Button
							color="secondary"
							variant="contained"
						>
							Close
						</Button>
						<Button
							color="primary"
							variant="contained"
							disabled={disclaimer_agree == 0 ? true : false}
							className={classes.addMarginLeft}
							onClick={acceptDisclaimer}
						>
							Accept
						</Button>
					</div>
				</Grid>
			</Grid>
		</DialogActions>
	</Dialog>
);

Disclaimer.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * disclaimer_agree is a prop containing data to agree with the disclaimer
   */
  disclaimer_agree: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  /**
   * disclaimer_open is a prop containing data to show / hide disclaimer modal
   */
  disclaimer_open: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  /**
   * disclaimerOnChange is a prop containing function to handle disclaimer_agree data
   */
  disclaimerOnChange: PropTypes.func.isRequired,
  /**
   * acceptDisclaimer is a prop containing function to accept disclaimer
   */
	acceptDisclaimer: PropTypes.func.isRequired,
}

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	disclaimerOnChange,
	acceptDisclaimer
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	disclaimer_agree: state.p11.disclaimer_agree,
	disclaimer_open: state.p11.disclaimer_open
});

/**
 * set up styles for this component
 * @ignore
 * @param {object} theme
 * @returns {object} classes prop to apply styles in the component
 */
const styles = (theme) => ({
	btnContainer: {
		'text-align': 'right'
	},
	addMarginLeft: {
		'margin-left': '.5em'
	},
	dialogActions: {
		padding: theme.spacing.unit * 2 - 1
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Disclaimer));
