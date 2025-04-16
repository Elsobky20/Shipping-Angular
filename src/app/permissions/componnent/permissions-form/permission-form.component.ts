import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { CreatePermissionDTO,PermissionDTO } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router ,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css'],
  standalone: true,
  imports:[FormsModule,CommonModule]
})
export class PermissionFormComponent implements OnInit {
  permission: CreatePermissionDTO = { name: '' };
  loading: boolean = false;
  errorMessage: string = '';
  isEditMode: boolean = false;
  permissionId: number | null = null;
  constructor(private permissionService: PermissionService,private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {


  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.isEditMode = true;
      this.permissionId = +id; // تحويل الـ id من string لـ number
      this.loadPermission();
    }
  });
}
loadPermission(): void {
  if (this.permissionId) {
    this.loading = true;
    this.permissionService.getPermissionById(this.permissionId).subscribe({
      next: (data: PermissionDTO) => {
        this.permission = { name: data.name }; // ملء الـ form ببيانات الـ Permission
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load permission. Please try again.';
        console.error('Error loading permission:', err);
      }
    });
  }
}

savePermission(): void {
  this.loading = true;
  this.errorMessage = '';
  const request = this.isEditMode && this.permissionId
    ? this.permissionService.updatePermission(this.permissionId, this.permission)
    : this.permissionService.createPermission(this.permission);

  request.subscribe({
    next: (data) => {
      this.loading = false;
      console.log(this.isEditMode ? 'Permission updated:' : 'Permission created:', data);
      this.router.navigate(['/permissions']);
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = 'Failed to save permission. Please try again.';
      console.error('Error saving permission:', err);
    }
  });
}



  cancel(): void {
    this.router.navigate(['/permissions']);
  }
}
