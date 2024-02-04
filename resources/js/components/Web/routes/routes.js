import React from 'react';
import Loadable from 'react-loadable';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import LoadingSpinner from '../common/LoadingSpinner';


const CookiePolicy = Loadable({
  loader: () => import('../pages/CookiePolicy'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Home = Loadable({
  loader: () => import('../pages/Home'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Login = Loadable({
  loader: () => import('../pages/Login'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Register = Loadable({
  loader: () => import('../pages/Register'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ResetPassword = Loadable({
  loader: () => import('../pages/ResetPassword'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ResetPasswordForm = Loadable({
  loader: () => import('../pages/ResetPasswordForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const MicrosoftLogin = Loadable({
  loader: () => import('../pages/MicrosoftLogin'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const ReferenceForm = Loadable({
  loader: () => import('../pages/ReferenceForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
// const Profile = Loadable({
// 	loader: () => import('../pages/profile/Profile'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// });
const Page404 = Loadable({
  loader: () => import('../pages/Page404'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Profile = Loadable({
  loader: () => import('../pages/profile/Profile'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ProfileV2 = Loadable({
  loader: () => import('../pages/profileV2/ProfileV2'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const RemoveMyAccountPage = Loadable({
  loader: () => import('../pages/removeMyAccount/RemoveMyAccountPage'),
  loading: LoadingSpinner,
  timeout: 20000,
  delay: 500
})
const Dashboard = Loadable({
  loader: () => import('../pages/dashboard/Dashboard'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Users = Loadable({
  loader: () => import('../pages/dashboard/Users'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const CompletionStatus = Loadable({
  loader: () => import('../pages/dashboard/CompletionStatus/CompletionStatus'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const UserForm = Loadable({
  loader: () => import('../pages/dashboard/UserForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const AllProfiles = Loadable({
  loader: () => import('../pages/AllProfiles'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ImmaperForm = Loadable({
  loader: () => import('../pages/dashboard/immaperForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const RosterDashboard = Loadable({
  loader: () => import('../pages/dashboard/Roster/RosterV2'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const UserView = Loadable({
  loader: () => import('../pages/dashboard/UserView'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Roles = Loadable({
  loader: () => import('../pages/dashboard/Roles'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const RoleForm = Loadable({
  loader: () => import('../pages/dashboard/RoleFormV2'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const GroupForm = Loadable({
  loader: () => import('../pages/dashboard/Groups/GroupForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Permissions = Loadable({
  loader: () => import('../pages/dashboard/Permissions'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const PermissionForm = Loadable({
  loader: () => import('../pages/dashboard/PermissionForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Immapers = Loadable({
  loader: () => import('../pages/dashboard/Immapers'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Countries = Loadable({
  loader: () => import('../pages/dashboard/Countries'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const CountryForm = Loadable({
  loader: () => import('../pages/dashboard/CountryForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Durations = Loadable({
  loader: () => import('../pages/dashboard/Durations'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const DurationForm = Loadable({
  loader: () => import('../pages/dashboard/DurationForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ThirdParty = Loadable({
  loader: () => import('../pages/dashboard/thirdParty/ThirdParty'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ThirdPartyForm = Loadable({
  loader: () => import('../pages/dashboard/thirdParty/ThirdPartyForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Languages = Loadable({
  loader: () => import('../pages/dashboard/Languages'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const LanguageForm = Loadable({
  loader: () => import('../pages/dashboard/LanguageForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const LanguageLevels = Loadable({
  loader: () => import('../pages/dashboard/LanguageLevels'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const LanguageLevelForm = Loadable({
  loader: () => import('../pages/dashboard/LanguageLevelForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Sectors = Loadable({
  loader: () => import('../pages/dashboard/Sectors'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const SectorForm = Loadable({
  loader: () => import('../pages/dashboard/SectorForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const FieldOfWorks = Loadable({
  loader: () => import('../pages/dashboard/FieldOfWorks'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const FieldOfWorkForm = Loadable({
  loader: () => import('../pages/dashboard/FieldOfWorkForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const DegreeLevels = Loadable({
  loader: () => import('../pages/dashboard/DegreeLevels'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const DegreeLevelForm = Loadable({
  loader: () => import('../pages/dashboard/DegreeLevelForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Skills = Loadable({
  loader: () => import('../pages/dashboard/Skills'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const SkillForm = Loadable({
  loader: () => import('../pages/dashboard/SkillForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const UNOrganizations = Loadable({
  loader: () => import('../pages/dashboard/UNOrganizations'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const UNOrganizationForm = Loadable({
  loader: () => import('../pages/dashboard/UNOrganizationForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Contract = Loadable({
  loader: () => import('../pages/contract/Contract'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ContractForm = Loadable({
  loader: () => import('../pages/contract/ContractForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ContractTemplates = Loadable({
  loader: () => import('../pages/dashboard/HR/HRContractTemplates'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ContractTemplateForm = Loadable({
  loader: () => import('../pages/dashboard/HR/HRContractTemplateForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const Quiz = Loadable({
  loader: () => import('../pages/quiz/Quiz'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const QuizTemplates = Loadable({
  loader: () => import('../pages/dashboard/Quiz/QuizTemplates'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const QuizTemplateForm = Loadable({
  loader: () => import('../pages/dashboard/Quiz/QuizTemplateForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const IMTestTemplates = Loadable({
  loader: () => import('../pages/dashboard/IMTest/IMTestTemplates'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const IMTestTemplateForm = Loadable({
  loader: () => import('../pages/dashboard/IMTest/IMTestTemplateForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ImmapOffices = Loadable({
  loader: () => import('../pages/dashboard/ImmapOffices'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ImmapOfficeForm = Loadable({
  loader: () => import('../pages/dashboard/ImmapOfficeForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
// const ImTest = Loadable({
// 	loader: () => import('../pages/imtest/IMTest'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// });
// const EditedImTest = Loadable({
// 	loader: () => import('../pages/imTest/EditedImTest'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// });
const Settings = Loadable({
  loader: () => import('../pages/dashboard/Settings'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const SettingForm = Loadable({
  loader: () => import('../pages/dashboard/SettingForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
// Security Officer in the dashboard
const SecurityAdvisors = Loadable({
  loader: () => import('../pages/dashboard/SecurityModule/SecurityAdvisors'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const RiskLocations = Loadable({
  loader: () => import('../pages/dashboard/SecurityModule/RiskLocations'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
})
const RiskLocationForm = Loadable({
  loader: () => import('../pages/dashboard/SecurityModule/RiskLocationForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
})
const NotifyTravelSettings = Loadable({
  loader: () => import('../pages/dashboard/SecurityModule/NotifyTravelSettings'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11 = Loadable({
  loader: () => import('../pages/p11/P11'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const NotVerified = Loadable({
  loader: () => import('../pages/NotVerified'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const VerifyUser = Loadable({
  loader: () => import('../pages/VerifyUser'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const VerifyImmapUser = Loadable({
  loader: () => import('../pages/VerifyImmapUser'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Jobs = Loadable({
  loader: () => import('../pages/jobs/Jobs'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobForm = Loadable({
  loader: () => import('../pages/jobs/JobForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobDetail = Loadable({
  loader: () => import('../pages/jobs/JobDetail'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobStatus = Loadable({
  loader: () => import('../pages/dashboard/JobStatus'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobStatusForm = Loadable({
  loader: () => import('../pages/dashboard/JobStatusForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const Applicants = Loadable({
  loader: () => import('../pages/jobs/applicants/Applicants'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobApplications = Loadable({
  loader: () => import('../pages/jobs/applications/JobApplications'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const JobRecommendations = Loadable({
  loader: () => import('../pages/jobs/recommendations/JobRecommendations'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobLevels = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobLevels'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobLevelForm = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobLevelForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobCategories = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobCategories'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobCategoryForm = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobCategoryForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobStandards = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobStandards'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const HRJobStandardForm = Loadable({
  loader: () => import('../pages/dashboard/HR/HRJobStandardForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ToR = Loadable({
  loader: () => import('../pages/tor/ToR'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ToRForm = Loadable({
  loader: () => import('../pages/tor/ToRForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const ToRRecommendation = Loadable({
  loader: () => import('../pages/tor/ToRRecommendations'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const Roster = Loadable({
  loader: () => import('../pages/roster/Roster'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const SurgeRosterDeploymentDashboard = Loadable({
  loader: () => import('../pages/roster/DeploymentDashboard'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const RosterProcesses = Loadable({
  loader: () => import('../pages/dashboard/Roster/RosterProcesses'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const RosterProcessForm = Loadable({
  loader: () => import('../pages/dashboard/Roster/RosterProcessForm'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

// Route Permission
const AuthRoute = Loadable({
  loader: () => import('./AuthRoute'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const NormalRoute = Loadable({
  loader: () => import('./NormalRoute'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const VerifiedRoute = Loadable({
  loader: () => import('./VerifiedRoute'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const P11Route = Loadable({
  loader: () => import('./P11Route'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});
const PermissionRoute = Loadable({
  loader: () => import('./PermissionRoute'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const PageNotFoundRoute = Loadable({
  loader: () => import('./PageNotFoundRoute'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const Questioncategory = Loadable({
  loader: () => import('../pages/referenceformcheck/Questioncategory.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});
const QuestionCategoryForm = Loadable({
  loader: () => import('../pages/referenceformcheck/QuestionCategoryForm.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});

const QuestionCategoryEditForm = Loadable({
  loader: () => import('../pages/referenceformcheck/QuestionCategoryEditForm.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});

const ReferenceQuestion = Loadable({
  loader: () => import('../pages/referenceformcheck/ReferenceQuestion.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});
const Referencecheck = Loadable({
  loader: () => import('../pages/referenceformcheck/Referencecheck.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});
const ReferencecheckForm = Loadable({
  loader: () => import('../pages/referenceformcheck/ReferencecheckForm.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});
const ReferencecheckEditForm = Loadable({
  loader: () => import('../pages/referenceformcheck/ReferencecheckEditForm.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});
const IMTest = Loadable({
  loader: () => import('../pages/imtestUser/imTest'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const Mail = Loadable({
  loader: () => import('../pages/dashboard/mail/Mail'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

// const ReferenceQuestionEditForm = Loadable({
// 	loader: () => import('../pages/referenceformcheck/ReferenceQuestionEditForm.js'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// 	// referenceformcheck
// });
// const ReferenceQuestionForm = Loadable({
// 	loader: () => import('../pages/referenceformcheck/ReferenceQuestionForm.js'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// 	// referenceformcheck
// });

const Workreference = Loadable({
  loader: () => import('../pages/referenceformcheck/Workreference.js'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
  // referenceformcheck
});

const Onboarding = Loadable({
  loader: () => import('../pages/onboarding/OnboardingForm.js'),
  loading: LoadingSpinner,
  timeout: 20000 // 20 seconds
  // referenceformcheck
});

const Repository = Loadable({
  loader: () => import('../pages/dashboard/Repository/Repository.js'),
  loading: LoadingSpinner,
  timeout: 20000 // 20 seconds
  // referenceformcheck
});

const RepositoryForm = Loadable({
  loader: () => import('../pages/dashboard/Repository/RepositoryForm.js'),
  loading: LoadingSpinner,
  timeout: 20000 // 20 seconds
  // referenceformcheck
});

const RepositoryEditForm = Loadable({
  loader: () => import('../pages/dashboard/Repository/RepositoryEditForm.js'),
  loading: LoadingSpinner,
  timeout: 20000 // 20 seconds
  // referenceformcheck
});
const TARForm = Loadable({
  loader: () => import('../pages/security-module/TARForm'),
  loading: LoadingSpinner,
  timeout: 20000

});

const MRFForm = Loadable({
  loader: () => import('../pages/security-module/MRFForm'),
  loading: LoadingSpinner,
  timeout: 20000 // 20 seconds
  // referenceformcheck
});

const Security = Loadable({
  loader: () => import('../pages/security-module/Security'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
})

const Travel = Loadable({
  loader: () => import('../pages/security-module/Travel'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
})

const TravelEvent = Loadable({
  loader: () => import('../pages/security-module/TravelEvent'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
})

const FileViewer = Loadable({
  loader: () => import('../pages/storage/FileViewer'),
  loading: LoadingSpinner,
  timeout: 20000,
  delay: 100
})

// const UserAnswerReferenceForm = Loadable({
// 	loader: () => import('../pages/referenceformcheck/UserAnswerReferenceForm.js'),
// 	loading: LoadingSpinner,
// timeout: 20000, // 20 seconds
// 	// referenceformcheck
// });

const Routes = () => (
  // <BrowserRouter>
  <Switch>
    {/* LOGIN N REGISTER */}
    <AuthRoute exact path="/login" component={Login} />
    <AuthRoute exact path="/register" component={Register} />
    <AuthRoute exact path="/reset-password" component={ResetPassword} />
    <AuthRoute exact path="/reset-password-form" component={ResetPasswordForm} />

    {/* VERIFY */}
    <VerifiedRoute exact path="/verify/:userId" component={VerifyUser} />
    <VerifiedRoute exact path="/immap-email/verify/:userId" component={VerifyImmapUser} />
    <VerifiedRoute exact path="/not-verified" component={NotVerified} />

    {/* MICROSOFT LOGIN */}
    <NormalRoute exact path="/microsoft-login" component={MicrosoftLogin} />
    <ReferenceForm exact path="/reference-checks/type/roster/recruitment/:profile_roster_id/reference/:reference_id" component={ReferenceForm} />
    <ReferenceForm exact path="/reference-checks/type/job/recruitment/:job_user_id/reference/:reference_id" component={ReferenceForm} />


    {/* HOME */}
    <NormalRoute exact path="/" component={Home} isHome />
    <NormalRoute exact path="/pages/:page" component={Home} isHome />
    <NormalRoute exact path="/pages/:page/:tab" component={Home} isHome />
    <NormalRoute exact path="/cookie-policy" component={CookiePolicy} />


    <NormalRoute exact path="/question-category" component={Questioncategory} permission="View Applicant List" />
    <NormalRoute
      exact
      path="/question-category/add"
      component={QuestionCategoryForm}
      permission="View Applicant List"
    />
    <NormalRoute
      exact
      path="/question-category/:id/edit"
      component={QuestionCategoryEditForm}
      permission="View Applicant List"
    />

    <NormalRoute exact path="/reference-check" component={Referencecheck} permission="View Reference Check List" />

    <NormalRoute
      exact
      path="/reference-check/:id/edit"
      component={ReferencecheckEditForm}
      permission="Edit Reference Check"
    />
    <NormalRoute
      exact
      path="/reference-check/add"
      component={ReferencecheckForm}
      permission="Add Reference Check"
    />

    <NormalRoute
      exact
      path="/reference-questions/:id/profile/:profilID"
      component={Workreference}
      permission="View Applicant List"
    />

    <PermissionRoute exact path="/im-test/:id" component={IMTest} permission="P11 Access" />

    {/* Remove My Account Page */}
    <PermissionRoute exact path="/remove-my-account/:token" component={RemoveMyAccountPage} permission="P11 Access" />

    {/* JOB */}
    <PermissionRoute exact path="/jobs/create" component={JobForm} permission="Add Job" isIMMAPer={true} />
    <NormalRoute exact path="/jobs" component={Jobs} />
    <NormalRoute exact path="/jobs/pages/:page" component={Jobs} />
    <NormalRoute exact path="/jobs/pages/:page/:tab" component={Jobs} />
    <NormalRoute exact path="/jobs/:id/" component={JobDetail} />
    <PermissionRoute exact path="/jobs/:id/edit" component={JobForm} permission="Edit Job" isIMMAPer={true} />

    {/* VIEW APPLICANT LIST */}
    <PermissionRoute exact path="/jobs/:id/applicants" component={Applicants} permission="Apply Job" isIMMAPer={true}/>

    {/* VIEW RECOMMENDATIONS LIST */}
    <PermissionRoute
      exact
      path="/jobs/:id/recommendations"
      component={JobRecommendations}
      permission="View Applicant List"
      isIMMAPer={true}
    />

    {/* APPLY JOB */}
    <PermissionRoute exact path="/job-applications" component={JobApplications} permission="Apply Job" />

    {/* VIEW CURRENT PROFILE */}
    <PermissionRoute exact path="/profile" component={ProfileV2} permission="P11 Access" />

    {/* VIEW OTHER PROFILE */}
    <PermissionRoute exact path="/profile/:id" component={ProfileV2} permission="View Other Profile" redirectUrl="/profile" />

    {/* Roster  */}
    <PermissionRoute exact path="/roster" component={Roster} permission="Index Roster" isIMMAPer={true}/>

    {/* All Profiles  */}
    {/* All Profiles / Talent Pool  */}
    <PermissionRoute
      exact
      path="/all-profiles/archived"
      component={AllProfiles}
      permission="Set as Admin|Can Archive a Profile"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/all-profiles/talent-pool"
      component={AllProfiles}
      permission="See Completed Profiles"
      isIMMAPer={true}
    />

    {/* DASHBOARD  */}
    {/*<PermissionRoute exact path="/dashboard" component={Dashboard} permission="Dashboard Access" />*/}
    <PermissionRoute exact path="/dashboard/users" component={Users} permission="Index User" isIMMAPer={true} />
    <PermissionRoute exact path="/dashboard/users/add" component={UserForm} permission="Add User" isIMMAPer={true} />
    <PermissionRoute exact path="/dashboard/users/:id" component={UserView} permission="Show User|Set as Admin" isIMMAPer={true} />
    <PermissionRoute exact path="/dashboard/users/:id/edit" component={UserForm} permission="Edit User" isIMMAPer={true} />


    <PermissionRoute
      exact
      path="/dashboard/completion-status/"
      component={CompletionStatus}
      permission="Set as Admin"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/completion-status/pages/:page"
      component={CompletionStatus}
      permission="Set as Admin"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/roles" component={Roles} permission="Index Role" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/roles/add" component={RoleForm} permission="Add Role" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/roles/:id/edit" component={RoleForm} permission="Edit Role" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/permissions/groups" component={Permissions} permission="Index Permission|Add Role|Add Permission|Set as Admin" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/permissions/groups/add" component={GroupForm} permission="Add Role|Add Permission|Set as Admin" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/permissions/groups/:id/edit" component={GroupForm} permission="Edit Role|Edit Permission|Set as Admin" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/permissions" component={Permissions} permission="Index Permission|Add Role|Add Permission|Set as Admin" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/permissions/add"
      component={PermissionForm}
      permission="Add Permission"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/permissions/:id/edit"
      component={PermissionForm}
      permission="Edit Permission"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/immapers" component={Immapers} permission="Index Immaper" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/immapers/:id/edit" component={ImmaperForm} permission="Edit Immaper" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/roster/:slug"
      component={RosterDashboard}
      permission="Index Roster Dashboard"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/countries" component={Countries} permission="Index Country" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/countries/add" component={CountryForm} permission="Add Country" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/countries/:id/edit" component={CountryForm} permission="Edit Country" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/un-organizations"
      component={UNOrganizations}
      permission="Index UN Org"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/un-organizations/add"
      component={UNOrganizationForm}
      permission="Add UN Org"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/un-organizations/:id/edit"
      component={UNOrganizationForm}
      permission="Edit UN Org"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/languages" component={Languages} permission="Index Language" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/languages/add" component={LanguageForm} permission="Add Language" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/languages/:id/edit"
      component={LanguageForm}
      permission="Edit Language"
      isIMMAPer={true}
    />

    <PermissionRoute
      exact
      path="/dashboard/language-levels"
      component={LanguageLevels}
      permission="Index Language Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/language-levels/add"
      component={LanguageLevelForm}
      permission="Add Language Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/language-levels/:id/edit"
      component={LanguageLevelForm}
      permission="Edit Language Level"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/sectors" component={Sectors} permission="Index Sector" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/sectors/add" component={SectorForm} permission="Add Sector" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/sectors/:id/edit" component={SectorForm} permission="Edit Sector" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/field-of-works"
      component={FieldOfWorks}
      permission="Index Field of Work"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/field-of-works/add"
      component={FieldOfWorkForm}
      permission="Add Field of Work"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/field-of-works/:id/edit"
      component={FieldOfWorkForm}
      permission="Edit Field of Work"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/degree-levels"
      component={DegreeLevels}
      permission="Index Degree Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/degree-levels/add"
      component={DegreeLevelForm}
      permission="Add Degree Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/degree-levels/:id/edit"
      component={DegreeLevelForm}
      permission="Edit Degree Level"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/skills" component={Skills} permission="Select Skill for Matching" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/skills/add"
      component={SkillForm}
      permission="Select Skill for Matching"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/skills/:id/edit"
      component={SkillForm}
      permission="Select Skill for Matching"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/dashboard/job-status" component={JobStatus} permission="Index Job Status" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/job-status/add" component={JobStatusForm} permission="Add Job Status" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/job-status/:id/edit"
      component={JobStatusForm}
      permission="Edit Job Status"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/immap-offices"
      component={ImmapOffices}
      permission="Index Immap Office"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/immap-offices/add"
      component={ImmapOfficeForm}
      permission="Add Immap Office"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/immap-offices/:id/edit"
      component={ImmapOfficeForm}
      permission="Edit Immap Office"
      isIMMAPer={true}
    />

    <PermissionRoute exact path="/dashboard/settings" component={Settings} permission="Index Setting" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/settings/add" component={SettingForm} permission="Add Setting" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/settings/:id/edit" component={SettingForm} permission="Edit Setting" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/durations" component={Durations} permission="Index Duration" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/durations/add" component={DurationForm} permission="Add Duration" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/durations/:id/edit"
      component={DurationForm}
      permission="Edit Duration"
      isIMMAPer={true}
    />

    {/* Third Party */}
    <PermissionRoute exact path="/dashboard/third-party" component={ThirdParty} permission="Set as Admin" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/third-party/add" component={ThirdPartyForm} permission="Set as Admin" isIMMAPer={true}/>
    <PermissionRoute exact path="/dashboard/third-party/:id/edit" component={ThirdPartyForm} permission="Set as Admin" isIMMAPer={true}/>

    {/* Country Security advisor page (Assign officer with country he/she will responsible with)*/}
    <PermissionRoute exact path="/dashboard/security-advisors" component={SecurityAdvisors} permission="Manage Security Module" isIMMAPer={true}/>
    {/* Notify Travel Settings */}
    <PermissionRoute exact path="/dashboard/notify-travel" component={NotifyTravelSettings} permission="Set as Admin" isIMMAPer={true}/>
    {/* High risk location */}
    <PermissionRoute exact path="/dashboard/risk-locations" component={RiskLocations} permission="Set as Admin" isIMMAPer={true}/>
    {/* High risk location form */}
    <PermissionRoute exact path="/dashboard/risk-locations/:countryid/edit" component={RiskLocationForm} permission="Set as Admin" isIMMAPer={true}/>


    {/* HR */}
    <PermissionRoute
      exact
      path="/dashboard/hr-job-levels"
      component={HRJobLevels}
      permission="Index HR Job Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-levels/add"
      component={HRJobLevelForm}
      permission="Add HR Job Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-levels/:id/edit"
      component={HRJobLevelForm}
      permission="Edit HR Job Level"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-categories"
      component={HRJobCategories}
      permission="Index HR Job Category"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-categories/add"
      component={HRJobCategoryForm}
      permission="Add HR Job Category"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-categories/:id/edit"
      component={HRJobCategoryForm}
      permission="Edit HR Job Category"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-standards"
      component={HRJobStandards}
      permission="Index HR Job Standard"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-standards/add"
      component={HRJobStandardForm}
      permission="Add HR Job Standard"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-job-standards/:id/edit"
      component={HRJobStandardForm}
      permission="Edit HR Job Standard"
      isIMMAPer={true}
    />
    <PermissionRoute exact path="/tor" component={ToR} permission="Index ToR" isIMMAPer={true}/>
    <PermissionRoute exact path="/tor/add" component={ToRForm} permission="Add ToR" isIMMAPer={true}/>
    <PermissionRoute exact path="/tor/:id/edit" component={ToRForm} permission="Edit ToR" isIMMAPer={true}/>
    <PermissionRoute exact path="/tor/:id/recommendations" component={ToRRecommendation} permission="Edit ToR" isIMMAPer={true}/>

    <PermissionRoute exact path="/contract" component={Contract} permission="Index Contract" isIMMAPer={true}/>
    <PermissionRoute exact path="/contract/add" component={ContractForm} permission="Add Contract" isIMMAPer={true}/>
    <PermissionRoute exact path="/contract/:id/edit" component={ContractForm} permission="Edit Contract" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/dashboard/hr-contract-templates"
      component={ContractTemplates}
      permission="Index Contract Template"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-contract-templates/add"
      component={ContractTemplateForm}
      permission="Add Contract Template"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/hr-contract-templates/:id/edit"
      component={ContractTemplateForm}
      permission="Edit Contract Template"
      isIMMAPer={true}
    />

    {/* Roster Process */}
    <PermissionRoute
      exact
      path="/dashboard/roster-processes"
      component={RosterProcesses}
      permission="Index Roster Process"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/roster-processes/add"
      component={RosterProcessForm}
      permission="Add Roster Process"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/roster-processes/:id/edit"
      component={RosterProcessForm}
      permission="Edit Roster Process"
      isIMMAPer={true}
    />

    {/* Quiz */}
    {/* Still on the development, just in case the current IM Test is not enough */}
    {/* <PermissionRoute exact path="/quiz" component={Quiz} permission="Index Quiz" />
    <PermissionRoute
      exact
      path="/dashboard/quiz-templates"
      component={QuizTemplates}
      permission="Index Quiz Template"
    />
    <PermissionRoute
      exact
      path="/dashboard/quiz-templates/add"
      component={QuizTemplateForm}
      permission="Add Quiz Template"
    />
    <PermissionRoute
      exact
      path="/dashboard/quiz-templates/:id/edit"
      component={QuizTemplateForm}
      permission="Edit Quiz Template"
    /> */}

    {/* IMTEST */}
    {/* IM Test Template */}
    <PermissionRoute
      exact
      path="/dashboard/im-test-templates"
      component={IMTestTemplates}
      permission="Index IM Test Template"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/im-test-templates/add"
      component={IMTestTemplateForm}
      permission="Add IM Test Template"
      isIMMAPer={true}
    />
    <PermissionRoute
      exact
      path="/dashboard/im-test-templates/:id/edit"
      component={IMTestTemplateForm}
      permission="Edit IM Test Template"
      isIMMAPer={true}
    />

    <PermissionRoute exact path="/policy-repository" component={Repository} permission="Show Repository" isIMMAPer={true}/>
    <PermissionRoute exact path="/policy-repository/add" component={RepositoryForm} permission="Add Repository" isIMMAPer={true}/>
    <PermissionRoute
      exact
      path="/policy-repository/edit/:id"
      component={RepositoryEditForm}
      permission="Edit Repository"
      isIMMAPer={true}
    />

    {/* Travel Request Page */}
    <PermissionRoute exact path="/travel" component={Travel} permission="Can Make Travel Request" isIMMAPer={true}/>
     {/* Travel Dashboard event view Page */}
     <PermissionRoute exact path="/travel-dashboard" component={TravelEvent} permission="View Travel Dashboard" isIMMAPer={true}/>

    {/* Domestic Travel Request (MRF) for iMMAPer */}
    <PermissionRoute exact path="/dom/add" component={MRFForm} permission="Can Make Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/dom/:id/edit" component={MRFForm} permission="Can Make Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/dom/:id/view" component={MRFForm} permission="Can Make Travel Request" isIMMAPer={true}/>

    {/* Domestic Travel Request (MRF) for Security Officer */}
    <PermissionRoute exact path="/dom/:id/security/edit" component={MRFForm} permission="Approve Global Travel Request|Approve Domestic Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/dom/:id/security/view" component={MRFForm} permission="Approve Global Travel Request|Approve Domestic Travel Request|View Other Travel Request|View SBP Travel Request|View Only On Security Page" isIMMAPer={true}/>

    {/* International Travel Request (TAR) for iMMAPer */}
    <PermissionRoute exact path="/int/add" component={TARForm} permission="Can Make Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/int/:id/edit" component={TARForm} permission="Can Make Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/int/:id/view" component={TARForm} permission="Can Make Travel Request" isIMMAPer={true}/>

    {/* International Travel Request (TAR) for Security Officer */}
    <PermissionRoute exact path="/int/:id/security/edit" component={TARForm} permission="Approve Global Travel Request" isIMMAPer={true}/>
    <PermissionRoute exact path="/int/:id/security/view" component={TARForm} permission="Approve Global Travel Request|Approve Domestic Travel Request|View Other Travel Request|View SBP Travel Request|View Only On Security Page" isIMMAPer={true}/>

    {/* Security Page for travel request approval system */}
    <PermissionRoute exact path="/security" component={Security} permission="Approve Global Travel Request|Approve Domestic Travel Request|View Other Travel Request|View SBP Travel Request|View Only On Security Page" isIMMAPer={true}/>

    {/* P11  */}
    <P11Route exact path="/p11" component={P11} permission="P11 Access" />

    {/* File Route */}
    <Route exact path="/storage/:fileId/conversions/:fileName" component={(props) => <FileViewer isConversion={true} {...props}/>}/>
    <Route exact path="/storage/:fileId/:fileName" component={FileViewer}/>

    {/* 404 */}
    <PageNotFoundRoute exact path="/404" component={Page404} />
    <PageNotFoundRoute component={Page404} />
  </Switch>
);

export default Routes;
