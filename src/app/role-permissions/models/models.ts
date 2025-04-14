export interface CreateRolePermissionDTO {
  permission_Id: number;
    role_Id: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
  }
  
  export interface RolePermissionDTO {
    permission_Id: number;
    role_Id: string;
    roleName: string;
      permissionName: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
    isDeleted: boolean;
  }
  
  export interface UpdateRolePermissionDTO {
    role_Id: string;
    permission_Id: number;

    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
  }
  