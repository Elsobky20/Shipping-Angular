export interface ShowDeliveryDto {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  branchName: string;
  governmentName: string[];
  discountType: string;
  companyPercentage: number;
  isDeleted: boolean;
}
export interface DeliveryCreateDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  branchId: number;
  governmentsId: number[];
  discountType: string;
  companyPercentage: number;
}