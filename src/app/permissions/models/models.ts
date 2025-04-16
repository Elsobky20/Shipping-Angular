export interface CreatePermissionDTO {
    name: string;
  }
  
  export interface PermissionDTO {
    id: number;
    name: string;
    isDeleted: boolean;
  }
  
  export interface CreateRolePermissionDTO {
    permissionId: number;
    roleId: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
  }
  
  export interface RolePermissionDTO {
    permissionId: number;
    roleId: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
    isDeleted: boolean;
  }
  
  export interface UpdateRolePermissionDTO {
    roleId: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
  }
  