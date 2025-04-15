import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { PermissionDTO } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
  standalone: true,
  imports:[FormsModule,CommonModule,RouterLink]
})
export class PermissionListComponent implements OnInit {
  permissions: PermissionDTO[] = [];

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (err) => {
        console.error('Error loading permissions:', err);
      }
    });
  }



  deletePermission(id: number): void {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => {
          this.permissions = this.permissions.filter(permission => permission.id !== id);          console.log('Permission deleted:', id);
        },
        error: (err) => {
          console.error('Error deleting permission:', err);
        }
      });
    }
  }

}
