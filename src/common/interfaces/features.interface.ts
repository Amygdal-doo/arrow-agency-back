interface SubscriptionPlanFeatures {
  cvCreations: number | null; // Number of allowed CV creations (null for unlimited)
  jobUploads: number | null; // Number of allowed job uploads (null for unlimited)
  cvEdits: number | null; // Number of allowed CV edits (null for unlimited)
  accessToAllJobPostings: boolean; // Whether the user can access all job postings
  advancedCandidateFilteringAndSearch: boolean; // Whether advanced candidate filtering/search is enabled
  unlimitedCVScanningTools: boolean; // Whether unlimited CV scanning tools are available
  unlimitedCvStorage: boolean; // Whether unlimited CV storage is available
}
