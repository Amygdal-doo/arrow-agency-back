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
  efficiency: string;
}

export interface ICertificate {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  url?: string;
}

export interface ICvData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  summary: string;

  skills: string[];
  hobies: string[];
  experience: IExperience[];
  projects: IProject[];
  educations: IEducation[];
  certificates: ICertificate[];

  languages: ICvLanguage[];
  socials: ISocial[];
  courses: ICourse[];
}
