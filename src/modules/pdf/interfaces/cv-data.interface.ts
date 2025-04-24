export enum EfficiencyLevel {
  null = "null",
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
  expert = "expert",
}

export interface IExperience {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface IProject {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  url?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface ISocial {
  name: string;
  url: string;
}

export interface ICourse {
  name: string;
  url: string;
  startDate: string;
  endDate?: string;
}

export interface ICvLanguage {
  name: string;
  efficiency: string; // default 'null' EfficiencyLevel
}

export interface ICertificate {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  url?: string;
}

export interface skills {
  name: string;
  efficiency: string; // default 'null' EfficiencyLevel
  efficiencyTypeNumber: boolean;
}

export interface ICvData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyLogoUrl: string;
  email: string;
  phone: string;
  summary: string;
  educations: IEducation[];
  hobies: string[];
  languages: ICvLanguage[];
  socials: ISocial[];
  courses: ICourse[];

  certificates: ICertificate[];
  skills: skills[];
  projects: IProject[];

  experience: IExperience[];
}

export interface ICvDataExtended extends ICvData {
  primaryColor: string;
  secondaryColor: string;
  fontSize: string;
  tertiaryColor: string;
  showCompanyInfo: boolean;
  showPersonalInfo: boolean;
}
