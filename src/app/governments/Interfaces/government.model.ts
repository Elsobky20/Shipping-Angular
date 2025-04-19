export interface Government {
  id: number;
  name: string;
  branch_Id: number;
  isDeleted?: boolean;
}

export interface GovernmentCreateDTO {
  name: string;
  branch_Id: number;
}
