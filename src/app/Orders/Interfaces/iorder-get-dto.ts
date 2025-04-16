export interface IOrderGetDTO {
  id: number;
  branch_Id: number;
  serialNumber: string;
  createdDate: string;
  clientData: string;
  governrate: string;
  city: string;
  orderCost: number;
  orderStatus: string;
  isDeleted: boolean
}
export interface DeliveryGet {
  id: number;
  name: string;
}
