// // export interface Igovernment {
// // }
// export interface IGovernmentGetDTO {
//     id: number;
//     name: string;
//     isDeleted: boolean;
//     branch_Id:number;
 
//   }
//   export interface IGovernmentResponseData {
//     totalGovernments: number;
//     page: number;
//     pageSize: number;
//     governments: IGovernmentGetDTO[]
//   }
//   export interface IGovernmentCreateDTO {
    
//     name: string;
//     isDeleted: boolean;
//     branch_Id:number;

//   }
//   export interface IGovernmentEditDTO {
   
//     name: string;
//     isDeleted: boolean;
//     branch_Id:number;
//   }
  
  
export interface IGovernmentGetDTO {
  id: number;
  name: string;
  isDeleted: boolean;
  branch_Id: number;
}

export interface IGovernmentResponseData {
  totalGovernments: number;
  page: number;
  pageSize: number;
  governments: IGovernmentGetDTO[]
}

export interface IGovernmentCreateDTO {
  name: string;
  isDeleted: boolean;
  branch_Id: number;
}

export interface IGovernmentEditDTO {
  name: string;
  isDeleted: boolean;
  branch_Id: number;
}