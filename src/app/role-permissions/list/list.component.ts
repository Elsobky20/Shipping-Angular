import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../services/role-permission.service';
import { RolePermissionDTO } from '../models/models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-role-permission-list',
  templateUrl: './list.component.html',
  imports: [CommonModule,RouterModule],

  styleUrls: ['./list.component.css']
})
export class RolePermissionListComponent implements OnInit {
  rolePermissions: RolePermissionDTO[] = [];

  constructor(private rolePermissionService: RolePermissionService,private router: Router) {}

  ngOnInit(): void {
    console.log('ngOnInit - Component Initialized');
    this.loadRolePermissions();
  }
  
  loadRolePermissions(): void {
    console.log('Loading Role Permissions...');
    this.rolePermissionService.getAll(false).subscribe(
      (data) => {
        console.log('Role Permissions Data Received:', data);
        this.rolePermissions = data;
      },
      (error) => {
        console.error('Error fetching role permissions:', error);
      }
    );
  }


  editRolePermission(rolePermission: RolePermissionDTO) {
    console.log('Editing Role Permission:', rolePermission);
  
    if (rolePermission.role_Id && rolePermission.permission_Id) {  
      this.router.navigate([`/role-permissions/${rolePermission.role_Id}/${rolePermission.permission_Id}`]);
    } else {
      console.error('Invalid roleId or permissionId');
    }
  }
  
  



}  