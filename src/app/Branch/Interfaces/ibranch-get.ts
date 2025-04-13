export interface IBranchDTO {
    id: number;
    name: string;
    mobile: string;
    isDeleted: boolean;
    location: string;
    createdDate: Date

  }
  export interface IBranchResponseData {
    totalBranches: number;
    page: number;
    pageSize: number;
    branches: IBranchDTO[]
  }
  export interface IBranchCreateDTO {
    id: number;
    name: string;
    mobile: string;
    location: string
  }

  export interface IPagination {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }

  export interface IBranchEditDTO {
    id: number;
    name: string;
    isDeleted:boolean;
    mobile: string;
    location: string
  }
  
