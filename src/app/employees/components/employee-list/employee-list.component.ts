import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { IEmployeeDTO } from '../../Interfaces/IEmployeeDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class EmployeeListComponent implements OnInit {
  employees: IEmployeeDTO[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  roleName: string = '';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;
  includeDeleted: boolean = true; 

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.searchTerm = '';
    this.roleName = '';
    this.getAllEmployees();
  }
  toggleDeleted(): void {
    this.includeDeleted = !this.includeDeleted;
   console.log(`${this.includeDeleted}  changedeeeeeeeee`)
   
    this.getAllEmployees();
  }
  
  getAllEmployees(): void {
    this.errorMessage = '';
    if (this.searchTerm || this.roleName) {
      this.employees = [];
      this.totalCount = 0;
      this.totalPages = 0;
      return;
    }
    console.log(`${this.includeDeleted} 2 changedeeeeeeeee`)

    this.employeeService.getAllEmployees(this.includeDeleted, this.pageIndex, this.pageSize).subscribe(
      (data) => {
        console.log(`${this.includeDeleted}  changedeeeeeeeee`)

        this.employees = data.items || [];
        this.totalCount = data.totalCount || 0;
        this.pageIndex = data.pageIndex || 1;
        this.pageSize = data.pageSize || 10;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        if (!this.employees.length) {
          this.errorMessage = 'No employees found.';
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.employees = [];
        this.totalCount = 0;
        this.errorMessage = 'Failed to fetch employees. Please try again later.';
      }
    );
  }
  searchEmployees(): void {
    this.errorMessage = '';
    this.employeeService.searchByName(this.searchTerm).subscribe(
      (data) => {
        this.employees = data || [];
        if (!this.employees.length) {
          this.errorMessage = 'No employees found with this name.';
        }
      },
      (error) => {
        console.error('Error searching employees:', error);
        this.employees = [];
        this.errorMessage = 'Failed to search employees. Please try again later.';
      }
    );
  }

  getEmployeesByRole(): void {
    this.errorMessage = '';
    this.employeeService.getEmployeesByRole(this.roleName).subscribe(
      (data) => {
        this.employees = data || [];
        if (!this.employees.length) {
          this.errorMessage = 'No employees found with this role.';
        }
      },
      (error) => {
        console.error('Error fetching employees by role:', error);
        this.employees = [];
        this.errorMessage = 'Failed to fetch employees by role. Please try again later.';
      }
    );
  }

  previousPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.getAllEmployees();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.getAllEmployees();
    }
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(
        () => {
          this.getAllEmployees();
        },
        (error) => {
          console.error('Error deleting employee:', error);
          this.errorMessage = 'Failed to delete employee. Please try again later.';
        }
      );
    }
  }
}