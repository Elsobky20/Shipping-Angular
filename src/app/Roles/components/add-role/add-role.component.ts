import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { AppRoleDTO, CreateRoleDTO, UpdateRoleDTO, RolePermissionDTO } from '../../Interfaces/Role';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type PermissionKey = 'canView' | 'canEdit' | 'canDelete' | 'canAdd' | 'isDeleted';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  createRole: CreateRoleDTO = {
    id: '',
    name: '',
    isDeleted: false,
    normalizedName: ''
  };

  updateRole: UpdateRoleDTO = {
    name: ''
  };

  roleId?: string;
  isEditMode: boolean = false;
  errorMessage: string = '';
  permissions: { id: string, name: string }[] = [];
  rolePermissions: RolePermissionDTO[] = [];

  permissionKeys: PermissionKey[] = ['canView', 'canEdit', 'canDelete', 'canAdd', 'isDeleted'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id') || undefined;

    this.permissions = [
      { id: 'perm1', name: 'Manage Users' },
      { id: 'perm2', name: 'Manage Roles' },
      { id: 'perm3', name: 'Manage Shipments' }
    ];

    this.rolePermissions = this.permissions.map(p => ({
      permission_Id: p.id,
      role_Id: '',
      canView: false,
      canEdit: false,
      canDelete: false,
      canAdd: false,
      isDeleted: false
    }));

    if (this.roleId) {
      this.isEditMode = true;
      this.loadRole(this.roleId);
    }
  }

  loadRole(id: string): void {
    this.roleService.getRoleById(id).subscribe({
      next: (data: AppRoleDTO) => {
        this.createRole = {
          id: data.id,
          name: data.name,
          isDeleted: data.isDeleted,
          normalizedName: data.name.toUpperCase()
        };
        this.updateRole = {
          name: data.name
        };

        if (data.rolePermissions && data.rolePermissions.length > 0) {
          this.rolePermissions = this.permissions.map(perm => {
            const existingPerm = data.rolePermissions.find(rp => rp.permission_Id === perm.id);
            return existingPerm || {
              permission_Id: perm.id,
              role_Id: id,
              canView: false,
              canEdit: false,
              canDelete: false,
              canAdd: false,
              isDeleted: false
            };
          });
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching role: ' + (err.error || err.message);
        console.error('Error fetching role:', err);
      }
    });
  }

  saveRole(): void {
    if (this.isEditMode && this.roleId) {
      if (!this.updateRole.name || this.updateRole.name.trim() === '') {
        this.errorMessage = 'Role name is required.';
        return;
      }

      this.roleService.updateRole(this.roleId, this.updateRole).subscribe({
        next: () => {
          this.router.navigate(['/Roles']);
        },
        error: (err: any) => {
          this.errorMessage = 'Error updating role: ' + (err.error || err.message);
          console.error('Error updating role:', err);
        }
      });
    } else {
      if (!this.createRole.name || this.createRole.name.trim() === '') {
        this.errorMessage = 'Role name is required.';
        return;
      }

      this.createRole.id = Math.random().toString(36).substring(2, 10); // توليد ID مؤقت

      const newRole: CreateRoleDTO = {
        ...this.createRole,
        normalizedName: this.createRole.name.toUpperCase()
      };

      this.roleService.addRole(newRole).subscribe({
        next: (response: AppRoleDTO) => {
          console.log('Role added:', response);
          this.router.navigate(['/Roles']);
        },
        error: (err: any) => {
          this.errorMessage = 'Error creating role: ' + (err.error || err.message);
          console.error('Error creating role:', err);
        }
      });
    }
  }
  get roleNameProxy(): string {
    return this.isEditMode ? this.updateRole.name : this.createRole.name;
  }
  
  set roleNameProxy(value: string) {
    if (this.isEditMode) {
      this.updateRole.name = value;
    } else {
      this.createRole.name = value;
    }
  }
  
  cancel(): void {
    this.router.navigate(['/Roles']);
  }
}
