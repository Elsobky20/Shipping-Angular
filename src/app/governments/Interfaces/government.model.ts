export interface IGetGovernrate {
  id: number;
  name: string;
  branchName: string;
  isDeleted: boolean;
}
export interface GovernratesReportResponseData {
  totalGovernments: number;
  page: number;
  pageSize: number;
  governments: IGetGovernrate[];
}

export interface GovernmentCreateDTO {
  name: string;
  branch_Id: number;
}

