import { Component, OnInit } from '@angular/core';
import { AppRoleDTO, RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})

export class RoleListComponent implements OnInit {
  roles: AppRoleDTO[] = [];

  constructor(private roleService: RoleService) {}
  ngOnInit(): void {
    this.roleService.getRoles(false).subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
      },
    });
  }
  

}
