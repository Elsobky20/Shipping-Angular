export interface IEmployeeGetInTableDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  isDeleted: boolean;
  branch_Id:number;
  branchName:string;
  roles:{ [key: string]: string }
}

export interface IEmployeeResponseData {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: IEmployeeGetInTableDTO[]
}
