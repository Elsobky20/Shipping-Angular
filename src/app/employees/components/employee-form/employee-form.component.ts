import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ICreateEmployeeDTO } from '../../Interfaces/ICreateEmployeeDTO';
import { IUpdateEmployeeDTO } from '../../Interfaces/IUpdateEmployeeDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../Roles/services/role.service';
import { IRoleDTO } from '../../../Roles/Interfaces/roles.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [RoleService]
})
export class EmployeeFormComponent implements OnInit {
  employee: ICreateEmployeeDTO = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: '',
    branchId: 0,
  };
  roles: IRoleDTO[] = [];
  id: number | null = null;
  isEditMode: boolean = false;
  errorMessage: string = '';
  formErrors: { [key: string]: string } = {};

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        // فلترة الأدوار اللي بتبدأ بـ "employee" (case-insensitive) ومش محذوفة
        this.roles = roles.filter(role => 
          !role.isDeleted && 
          role.name.toLowerCase().startsWith('employee')
        );
        console.log('Filtered roles:', this.roles);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        this.errorMessage = 'Failed to load roles.';
      }
    });

    this.id = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    if (this.id) {
      this.isEditMode = true;
      this.employeeService.getEmployeeById(this.id).subscribe({
        next: (data) => {
          this.employee = {
            name: data.name || '',
            email: data.email || '',
            password: '',
            confirmPassword: '',
            phone: data.phone || '',
            address: data.address || '',
            role: data.role || '',
            branchId: data.branchId || 0,
          };
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
          this.errorMessage = 'Failed to load employee data.';
        }
      });
    }
  }

  validateField(field: string): void {
    this.formErrors[field] = ''; // Reset error for this field

    if (field === 'name' && !this.employee.name) {
      this.formErrors['name'] = 'Name is required.';
    }

    if (field === 'email') {
      if (!this.employee.email) {
        this.formErrors['email'] = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.employee.email)) {
        this.formErrors['email'] = 'Invalid email format.';
      }
    }

    if (field === 'password' && !this.isEditMode) {
      if (!this.employee.password) {
        this.formErrors['password'] = 'Password is required.';
      } else if (this.employee.password.length < 6) {
        this.formErrors['password'] = 'Password must be at least 6 characters.';
      }
    }

    if (field === 'confirmPassword' && !this.isEditMode) {
      if (!this.employee.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Confirm Password is required.';
      } else if (this.employee.password !== this.employee.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Passwords do not match.';
      }
    }

    if (field === 'phone' && this.employee.phone && !/^\d{10,15}$/.test(this.employee.phone)) {
      this.formErrors['phone'] = 'Phone number must be between 10 and 15 digits.';
    }

    if (field === 'branchId' && (!this.employee.branchId || this.employee.branchId <= 0)) {
      this.formErrors['branchId'] = 'Branch ID must be a positive number.';
    }

    if (field === 'role' && !this.employee.role) {
      this.formErrors['role'] = 'Role is required.';
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.employee.name) {
      this.formErrors['name'] = 'Name is required.';
      isValid = false;
    }

    if (!this.employee.email) {
      this.formErrors['email'] = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.employee.email)) {
      this.formErrors['email'] = 'Invalid email format.';
      isValid = false;
    }

    if (!this.isEditMode) {
      if (!this.employee.password) {
        this.formErrors['password'] = 'Password is required.';
        isValid = false;
      } else if (this.employee.password.length < 6) {
        this.formErrors['password'] = 'Password must be at least 6 characters.';
        isValid = false;
      }

      if (!this.employee.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Confirm Password is required.';
        isValid = false;
      } else if (this.employee.password !== this.employee.confirmPassword) {
        this.formErrors['confirmPassword'] = 'Passwords do not match.';
        isValid = false;
      }
    }

    if (this.employee.phone && !/^\d{10,15}$/.test(this.employee.phone)) {
      this.formErrors['phone'] = 'Phone number must be between 10 and 15 digits.';
      isValid = false;
    }

    if (!this.employee.branchId || this.employee.branchId <= 0) {
      this.formErrors['branchId'] = 'Branch ID must be a positive number.';
      isValid = false;
    }

    if (!this.employee.role) {
      this.formErrors['role'] = 'Role is required.';
      isValid = false;
    }

    return isValid;
  }

  saveEmployee(): void {
    if (!this.validateForm()) {
      return;
    }

    if (this.isEditMode && this.id) {
      const updateData: IUpdateEmployeeDTO = {
        name: this.employee.name,
        email: this.employee.email,
        phone: this.employee.phone,
        address: this.employee.address,
        role: this.employee.role,
        branchId: this.employee.branchId,
      };
      this.employeeService.updateEmployee(this.id, updateData).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.errorMessage = 'Failed to update employee.';
        }
      });
    }  else {
      this.employeeService.createEmployee(this.employee).subscribe({
          next: () => {
              this.router.navigate(['/employees']);
          },
          error: (error) => {
              console.error('Error creating employee:', error);
              const errorMsg = error.error?.Error || error.error?.Message || 'Failed to create employee.';
              this.errorMessage = errorMsg;
          }
      });
  }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}