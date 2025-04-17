export interface ICityGetDTO {
  id: number;
  name: string;
  governmentName: string;
  isDeleted: boolean;
  standardShipping: number
}
export interface ICityResponseData {
  totalCitiess: number;
  page: number;
  pageSize: number;
  cities: ICityGetDTO[]
}
export interface ICityCreateDTO {
  government_Id: number;
  name: string;
  standardShipping: number
}
export interface ICityEditDTO {
  government_Id: number;
  name: string;
  isDeleted:boolean;
  standardShipping: number
}


