import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppRoleDTO } from '../../Interfaces/Role';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  /* ============================================ Start Properties & Constructor ============================== */
  searchForm: FormGroup;
  roles!:AppRoleDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistRolesNumber:number = 0;
  totalRolesNumber:number = 0;
  pageNumber:number = 1;
  selectedPageSize: number = 10;
  numberOfPages!:number;
  values: number[] = [5, 10, 25, 50];
  constructor(private httpReqService:HttpReqService){
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }
  /* ============================================ End Properties & Constructor ================================ */
  ngOnInit(): void {
    this.loadAllRoles(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    this.loadExistRoles();
  }

  loadAllRoles(size:number, pageNum?:number): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('role', 'all', {pageSize:size, page:pageNum})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.handleSuccessResponse(response)
        this.totalRolesNumber = response.data.totalRoles;
        this.numberOfPages = this.totalRolesNumber / this.selectedPageSize;
      },
      error: (error) => this.handleError(error)
    });
  }

  loadExistRoles():void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('role', 'exist')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.ExistRolesNumber = response.data.totalRoles;
      },
      error: (error) => this.handleError(error)
    });
  }

  setupSearch(size:number, pageNum?:number): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          this.isLoading = true;
          this.errorMessage = null;
          if (query && query.trim()) {
            return this.httpReqService.getAll('role', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY;
              })
            );
          } else {
            return this.httpReqService.getAll('role', 'all', {pageSize: size, page: pageNum});
          }
        }),
        takeUntil(this.destroy$)
      )
    .subscribe({
      next: (response) => this.handleSuccessResponse(response),
      error: (error) => this.handleError(error)
    });
  }

  handleSuccessResponse(response: any): void {
    this.isLoading = false;
    this.errorMessage = null;
    if (response.isSuccess === false) {
      this.handleCustomError(response);
      return;
    }
    this.roles = response.data?.roles || [];
    this.sortRoles();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.roles = []; // إفراغ القائمة عند الخطأ
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.roles = []; // إفراغ القائمة عند الخطأ

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortRoles(): void {
    this.roles = this.roles.sort((a, b) =>
      a.name.localeCompare(b.name));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }
  /* ============================================ Start Number Of Rows ======================================= */
  updateSelectedValue(value: number) {
    this.selectedPageSize = value;
    this.loadAllRoles(value);
    this.setupSearch(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadAllRoles(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */

  /* ============================================ Start Delete =============================================== */
  deleteRole(id:string):void{
    const role = this.roles.find(c => c.id === id);
    console.log(role);
    if (role?.isDeleted) {
      Swal.fire({
        title: "Can't delete role.",
        text: 'This role is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    this.httpReqService.confirmAndDelete('role', id).subscribe({
      next: () => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'Role deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.roles.findIndex(c => c.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.roles = [...this.roles];
          this.roles[index].isDeleted = true;
          this.roles.sort((a, b) => a.name.localeCompare(b.name));
          this.loadExistRoles();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting role.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  /* ============================================ End Delete ================================================= */
}
