import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { IEmployeeGetInTableDTO } from '../../Interfaces/employee-interfaces';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class EmployeeListComponent implements OnInit {
 /* ============================================ Start Properties & Constructor ============================== */
  searchForm: FormGroup;
  employees!:IEmployeeGetInTableDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistEmployeesNumber:number = 0;
  totalEmployeesNumber:number = 0;
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
    // جلب جميع المدن عند التهيئة
    this.loadAllEmployees(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    // المدن الموجودة في الخدمة
    this.loadExistEmployees();
  }

  loadAllEmployees(size:number, pageNum?:number): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('employee', 'all', {pageSize:size, page:pageNum})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.handleSuccessResponse(response)
        this.totalEmployeesNumber = response.data.items;
        this.numberOfPages = this.totalEmployeesNumber / this.selectedPageSize;
      },
      error: (error) => this.handleError(error)
    });
  }

  loadExistEmployees():void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('employee', 'exist')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.ExistEmployeesNumber = response.data.totalCount;
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
            return this.httpReqService.getAll('employee', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY;
              })
            );
          } else {
            return this.httpReqService.getAll('employee', 'all', {pageSize: size, page: pageNum});
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
    this.employees = response.data?.items || [];
    this.sortEmployees();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.employees = []; // إفراغ القائمة عند الخطأ
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.employees = []; // إفراغ القائمة عند الخطأ

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortEmployees(): void {
    this.employees = this.employees.sort((a, b) =>
      a.branchName.localeCompare(b.branchName));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }

  getRolesAsString(emp: IEmployeeGetInTableDTO): string {
    return Object.values(emp.roles).join(' & ');
  }

  ngOnDestroy(): void {
    // تنظيف الاشتراكات
    this.destroy$.next();
    this.destroy$.complete();

    if (this.mySubscribe) {
      this.mySubscribe.unsubscribe();
    }
  }
  /* ============================================ Start Number Of Rows ======================================= */
  updateSelectedValue(value: number) {
    this.selectedPageSize = value;
    this.loadAllEmployees(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadAllEmployees(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */

  /* ============================================ Start Delete =============================================== */
  deleteMerchant(id:number):void{
    const emps = this.employees.find(c => c.id === id);
    if (emps?.isDeleted) {
      Swal.fire({
        title: "Can't delete employee.",
        text: 'This employee is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    // تأكيد الحذف للمدينة النشطة
    this.httpReqService.confirmAndDelete('employee', id).subscribe({
      next: () => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'Employee deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.employees.findIndex(c => c.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.employees = [...this.employees];
          this.employees[index].isDeleted = true;
          this.employees.sort((a, b) => a.branchName.localeCompare(b.branchName));
          this.loadExistEmployees();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting merchant.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  /* ============================================ End Delete ================================================= */
}
