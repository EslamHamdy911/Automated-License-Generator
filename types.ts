export enum ProjectType {
  EXPERIMENTAL = 'experimental',
  COMMERCIAL = 'commercial',
  OPEN_SOURCE = 'opensource'
}

export enum LicenseType {
  CC_BY_SA_4 = 'cc-by-sa-4.0',
  MIT = 'mit'
}

export interface GeneratedDocs {
  readmeContent: string;
  licenseContent: string;
}

export interface FormData {
  projectName: string;
  projectDescription: string;
  projectType: ProjectType;
  licenseType: LicenseType;
  authorName: string;
}