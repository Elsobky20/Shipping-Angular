export interface IOrderGetDTO {
  id: number;
  serialNumber: string;
  createdDate: string;
  clientData: string;
  governrate: string;
  city: string;
  orderCost: number;
  isDeleted: boolean
}
