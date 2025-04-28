export interface ISettingDTO {
    id: number;
    shippingToVillageCost :number;
    deliveryAutoAccept: boolean;
    isDeleted: boolean;
  }

  export interface ISettingResponseData {
    shippingToVillageCost: any;
    deliveryAutoAccept: any;
    totalSettings: number;
    page: number;
    pageSize: number;
    settings: ISettingDTO[]
  }

  export interface ISettingCreateDTOS {
    shippingToVillageCost :number;
    deliveryAutoAccept: boolean;
  }

  export interface ISettingEditDTO {
    id: number;
    shippingToVillageCost :number;
    isDeleted:boolean;
    deliveryAutoAccept: boolean;
  }
