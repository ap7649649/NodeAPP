export enum Emplevels {
  manager = "Manager",
  developer = "Developer",
  tester = "Tester",
  intern = "Intern"
}
export enum EmpMaritalStatus {
  single = "Single",
  married = "Married",
  divorced = "Divorced",
  widowed = "Widowed"
}
export enum EmpGender {
  male = "Male",
  female = "Female"
}

export interface PersonalDetails {
  gender: string;
  blood_group: string;
  marital_status: string;
  international_worker: boolean;
  dob: Date;
  physically_disabled: boolean;
}

export interface PersonalDetailsData {
  [id: number]: PersonalDetails;
}

export interface EmploymentDetails {
  employer: string;
  designation: string;
  location: string;
  department: string;
  reporting_manager: string;
  doj: Date;
}

export interface EmploymentDetailsData {
  [id: number]: EmploymentDetails;
}

export interface EmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  level: Emplevels;
  supervisor?: string;
  personal_details?: PersonalDetailsData;
  employment_details?: EmploymentDetailsData;
}

export interface Employee extends EmployeeData {
  id: number;
}