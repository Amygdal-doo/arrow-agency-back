export interface ICvData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
}
