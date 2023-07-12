/** import React and PropTypes */
import React from "react";
import PropTypes from 'prop-types';

/** import Material UI components */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

/** import custom components */
import Profile from "../pages/profileV2/ProfileV2";

/**
 * ProfileModal is a component to show a user profile inside the website.
 *
 * Currently used for viewing other profile in:
 *
 * - Talent Pool page
 * - iMMAPer List page
 * - Roster page
 * - Users page
 * - Profile Completion Status page
 * - Accepted Roster page (iMMAP Talent Pool and Surge Roster on the left side menu)
 * - View Applicants page
 * - P11 page (before submitting your profile)
 * - Job Recommendations page
 * - ToR Recommendations page
 *
 * @name ProfileModal
 * @component
 * @category Common
 *
 */
const ProfileModal = ({
  isOpen,
  profileId,
  onClose,
  preview,
  onSubmit,
  title,
  showImmaperBox,
  history
}) => (
  <Dialog open={isOpen} fullWidth maxWidth="xl" onClose={onClose}>
    <DialogTitle>{title ? title : "Profile"}</DialogTitle>
    <DialogContent>
      <Profile showImmaperBox={showImmaperBox} match={{ params: { id: profileId } }} preview={preview} history={history} />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => onClose()} color="secondary" variant="contained">
        Close
      </Button>
      {preview && (
        <Button onClick={() => onSubmit()} color="primary" variant="contained">
          Finish
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

ProfileModal.defaultPropTypes = {
  preview: false,
  showImmaperBox: true
};

ProfileModal.propTypes = {
  /**
   * isOpen is a prop containing value to open / close profile modal
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * profileId is a prop containing profile id
   */
  profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * onClose is a prop containing function to close profile modal
   */
  onClose: PropTypes.func.isRequired,
  /**
   * preview is a prop containing value to set profile modal in preview mode
   */
  preview: PropTypes.bool,
  /**
   * onSubmit is a prop containing function to submit profile in preview mode
   */
  onSubmit: PropTypes.func,
  /**
   * title is a prop containing profile modal title
   */
  title: PropTypes.string
}

export default ProfileModal;
