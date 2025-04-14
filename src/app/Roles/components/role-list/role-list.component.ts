import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AppRoleDTO } from '../../Interfaces/Role';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  roles: AppRoleDTO[] = [];
  searchText: string = '';
  errorMessage: string = '';

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (res: AppRoleDTO[]) => {

        this.roles = (res || []).filter(role => !role.isDeleted);
      },
      error: (err: any) => {
        console.error('Failed to load roles:', err);
        this.errorMessage = 'Failed to load roles. Please try again later.';
        this.roles = [];
      },
    });
  }

  filteredRoles(): AppRoleDTO[] {
    return this.roles.filter(role =>
      role.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  deleteRole(id: string): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.getRoles();
        },
        error: (err: any) => {
          console.error('Error deleting role:', err);
          this.errorMessage = 'Error deleting role';
        }
      });
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/roles', id, 'details']);
  }
}