export interface IRoleDTO {
    id: string;
    name: string;
    isDeleted: boolean;
    rolePermissions: IRolePermissionDTO[];
  }
  
  export interface IRolePermissionDTO {
    permissionId: number;
    roleId: string;
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isDeleted: boolean;
  }