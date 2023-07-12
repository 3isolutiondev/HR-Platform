export const APP_NAME = 'iMMAP Careers';
export const maxFileSize = 2097152; // in bytes
export const p11UpdateCVURL = '/api/p11-update-cv';
export const p11DeleteCVURL = '/api/p11-delete-cv';
export const p11UpdateSignatureURL = '/api/p11-update-signature';
export const p11DeleteSignatureURL = '/api/p11-delete-signature';
export const p11UpdatePhotoURL = '/api/p11-update-photo';
export const p11DeletePhotoURL = '/api/p11-delete-photo';
export const importImmapersURL = '/api/import-immapers';
export const cvCollectionName = 'cv_files';
export const immapersCollectionName = 'immapers_files';
export const passportCollectionName = 'passport_files';
export const signatureCollectionName = 'signature_files';
export const photoCollectionName = 'photos';
export const acceptedImageFiles = ['image/jpg', 'image/png', 'image/jpeg'];
export const acceptedDocFiles = ['application/pdf'];
export const acceptedDocImageFiles = ['image/jpg', 'image/png', 'image/jpeg', 'application/pdf'];
export const acceptedImmapersFiles = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
export const YesNoURL = {
  objections_making_inquiry_of_present_employer: '/api/update-objections-making-inquiry-of-present-employer',
  has_disabilities: '/api/update-has-disabilities',
  sameWithPermanent: '/api/update-same-with-permanent',
  has_dependents: '/api/update-has-dependents',
  legal_permanent_residence_status: '/api/update-legal-permanent-residence',
  legal_step_changing_present_nationality: '/api/update-legal-step',
  relatives_employed_by_public_international_organization: '/api/update-relatives-employed',
  previously_submitted_application_for_UN: '/api/update-previously-submitted',
  has_professional_societies: '/api/update-has-professional-societies',
  has_publications: '/api/update-has-publications',
  permanent_civil_servant: '/api/update-permanent-civil-servant',
  is_immaper: '/api/update-is-immaper',
  immap_contract_international: '/api/update-is-international-contract',
  share_profile_consent: '/api/update-share-profile-consent',
};
export const p11UniversityCertificateURL = '/api/p11-update-university-certificate';
export const p11DeleteUniversityCertificateURL = '/api/p11-delete-university-certificate';
export const universityCertificateCollection = 'diploma_files';

export const p11SchoolCertificateURL = '/api/p11-update-school-certificate';
export const p11DeleteSchoolCertificateURL = '/api/p11-delete-school-certificate';
export const schoolCertificateCollection = 'certificate_files';

export const p11PortfolioFileURL = '/api/p11-update-portfolio-file';
export const p11DeletePortfolioFileURL = '/api/p11-delete-portfolio-file';
export const portfolioFileCollection = 'portfolios';

export const p11PublicationFileURL = '/api/p11-update-publication-file';
export const p11DeletePublicationFileURL = '/api/p11-delete-school-certificate';
export const publicationFileCollection = 'publication_files';

export const imTestFile_DatasetURL = '/api/im-test-update-data-set';
export const imTestFile_DatasetDeleteFileURL = '/api/im-test-destroy-data-set/';
export const imTestFile_DatasetFileCollection = 'file_dataset';

export const upload_cover_letter_url = '/api/upload-cover-letter';
export const delete_cover_letter_url = '/api/delete-cover-letter';
export const cover_letter_collection = 'cover_letter';

// Security Module

// MRF Government Paper
export const securityModuleMRFFileURL = '/api/security-module/upload-mrf-government-file';
export const securityModuleMRFDeleteFileURL = '/api/security-module/delete-mrf-government-file';
export const securityModuleMRFFileCollection = 'security_module_mrf_government_files';

// TAR Government Paper
export const securityModuleTARFileURL = '/api/security-module/upload-tar-government-file';
export const securityModuleTARDeleteFileURL = '/api/security-module/delete-tar-government-file';
export const securityModuleTARFileCollection = 'security_module_tar_government_files';

//Default params approved travel request for calendar
export const defaultApprovedTravel = '?date=null&travelTypes[]=INT&travelTypes[]=DOM AIR&travelTypes[]=DOM GROUND&travelTypes[]=DOM AIR AND GROUND';
export const securityLinkRiskLevels = {
  title: 'SEC iMMAP Security Risk Levels.docx',
  link: 'https://immap.sharepoint.com/:w:/s/iMMAPGlobalLibrary/ETPlVNSHDIhPtknA1g0y4gcBCdqzmr-fq5WKbQp44Ub2Yw?e=I89fcd&CID=18072c2f-495e-f5ad-3740-57cc21425fc0'
}

