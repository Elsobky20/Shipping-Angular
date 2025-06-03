export interface IMerchntGetInTableDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  government: string;
  city: string;
  isDeleted: boolean;
}
export interface IMerchntGetInDetailsDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  government: string;
  city: string;
  storeName: string;
  pickupCost: number;
  rejectedOrderPercentage: number;
  branchsNames: string;
  isDeleted: boolean;
}
export interface IMerchantResponseData {
  totalCitiess: number;
  page: number;
  pageSize: number;
  cities: IMerchntGetInTableDTO[]
}

export interface AllBranches {
  id: number;
  name: string;
}
