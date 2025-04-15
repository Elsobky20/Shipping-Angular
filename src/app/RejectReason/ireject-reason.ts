
// export interface IRejectReasonGetDTO {
//     id: number;
//     isDeleted: boolean;
//     reason: string;
    
 
//   }
//   export interface IRejectReasonResponseData {
//     totalReasons: number;
//     page: number;
//     pageSize: number;
//     reasons: IRejectReasonGetDTO[]
//   }
//   export interface IRejectReasonCreateDTO {
    
//     reason: string;
//     isDeleted: boolean;
   

//   }
//   export interface IRejectReasonEditDTO {
   
//     reason: string;
//     isDeleted: boolean;
  
//   }
  
  
  /////////////////////////

  export interface IRejectReasonGetDTO {
    id: number;
    isDeleted: boolean;
    reason: string;
  }
  
  export interface IRejectReasonResponseData {
    totalReasons: number;  
    page: number;
    pageSize: number;
    reasons: IRejectReasonGetDTO[];  // هذه المصفوفة تحتوي على البيانات الخاصة بكل سبب
  }
  
  export interface IRejectReasonCreateDTO {
    reason: string;
    isDeleted: boolean;
  }
  
  export interface IRejectReasonEditDTO {
    reason: string;
    isDeleted: boolean;
  }
  