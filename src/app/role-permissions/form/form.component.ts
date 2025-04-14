import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RolePermissionService } from '../services/role-permission.service';
import { CreateRolePermissionDTO, RolePermissionDTO, UpdateRolePermissionDTO } from '../models/models';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-role-permission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'] 
})
export class FormComponent implements OnInit {
  form: FormGroup;
  permissions: RolePermissionDTO[] = [];
  selectedRoleId: string = '';
  selectedPermissionId: number = 0;

  constructor(
    private fb: FormBuilder,
    private rolePermissionService: RolePermissionService,
    private route: ActivatedRoute  , private router: Router
  ) {
    this.form = this.fb.group({
      roleId: [''],
      permissions: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const roleId = params.get('roleId');
      const permissionIdParam = params.get('permissionId');  
  
      if (roleId && permissionIdParam) {
        const permissionId = +permissionIdParam;  
        if (!isNaN(permissionId)) {  
          this.selectedRoleId = roleId;
          this.selectedPermissionId = permissionId;
          this.form.get('roleId')?.setValue(roleId);
          console.log("Loaded with Role ID:", roleId, "and Permission ID:", permissionId);
          this.loadPermissions();
        } else {
          console.error("Invalid Permission ID:", permissionIdParam);
        }
      } else {
        console.error("Role ID or Permission ID is missing");
      }
    });
  }
  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  loadPermissions() {
    this.rolePermissionService.getById(this.selectedRoleId, this.selectedPermissionId).subscribe(
      (data: RolePermissionDTO) => {
        console.log("Permissions data:", data);
        this.permissions = [data]; 
        this.buildFormArray(); 
      },
      error => {
        console.error("Error fetching role permission data:", error);
      }
    );
  }
  
  buildFormArray() {
    this.permissionsArray.clear();
    this.permissions.forEach(permission => {
      this.permissionsArray.push(this.fb.group({
        permissionId: [permission.permission_Id],
        canView: [permission.canView],
        canEdit: [permission.canEdit],
        canAdd: [permission.canAdd],
        canDelete: [permission.canDelete],
      }));
    });
  }

  onSubmit() {
    const roleId = this.form.value.roleId;
    console.log('Submitting form for roleId:', roleId);
    console.log('Permissions array:', this.permissionsArray.value);
  
    this.permissionsArray.value.forEach((perm: any, index: number) => {
      if (!perm.permissionId) {
        console.error(` permissionId is missing for permission at index ${index}`);
        return;
      }
  
      const dto: UpdateRolePermissionDTO = {
        role_Id: roleId,
        permission_Id: perm.permissionId,
        canView: perm.canView,
        canEdit: perm.canEdit,
        canAdd: perm.canAdd,
        canDelete: perm.canDelete
      };
  
      console.log(`Sending request for RoleID ${roleId}, PermissionID ${perm.permissionId}`, dto);
  
      this.rolePermissionService.update(roleId, perm.permissionId, dto).subscribe({
        next: () => {
          console.log(` Saved permissionId: ${perm.permissionId}`);
        },
        error: (err) => {
          console.error(` Error saving permissionId ${perm.permissionId}:`, err);
        }
      });
    });
  
    alert('saved successfully');
    this.router.navigate(['/role-permissions']);
  }
  
  





}  