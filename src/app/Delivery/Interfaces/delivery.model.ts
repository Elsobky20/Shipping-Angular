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