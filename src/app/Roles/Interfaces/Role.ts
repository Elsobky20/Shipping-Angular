export interface RolePermissionDTO {
  permission_Id: string; // اختر string أو number بناءً على الـ Backend
  role_Id: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  isDeleted: boolean;
}

export interface AppRoleDTO {
  id: string;
  name: string;
  isDeleted: boolean;
  createdDate: string;
  rolePermissions: RolePermissionDTO[]
}

export interface RoleResponseData {
  totalOrders: number;
  page: number;
  pageSize: number;
  roles: AppRoleDTO[];
}

export interface CreateRoleDTO {
  name: string
}

export interface UpdateRoleDTO {
  name: string;
  isDeleted: boolean
}
