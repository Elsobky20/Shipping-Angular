export interface IEmployeeDTO {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  branchName: string;
  branchId: number; 
  role: string;
  roleId: string;  
  isDeleted: boolean;
}