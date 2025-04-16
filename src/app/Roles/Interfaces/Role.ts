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
  rolePermissions: RolePermissionDTO[];
}

export interface CreateRoleDTO {
  id: string;
  name: string;
  isDeleted: boolean;
  normalizedName: string;
}

export interface UpdateRoleDTO {
  name: string;
}