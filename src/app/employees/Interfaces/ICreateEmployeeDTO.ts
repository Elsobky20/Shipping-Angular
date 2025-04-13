export interface ICreateEmployeeDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: string;
  // roleId: string;
  branchId: number;
}