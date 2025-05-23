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
export interface OrderReportGetDTO {
  serialNumber: string;
  orderStatus: string;
  merchantName: string;
  clientName: string;
  clientPhone: string;
  governrate: string;
  city: string;
  orderCost: number;
  shippingCost: number;
  deliveryRight?: number;
  companyRight?: number;
  createdDate: string;
}

export interface OrderReportResponseData {
  totalOrders: number;
  page: number;
  pageSize: number;
  orders: OrderReportGetDTO[];
}


