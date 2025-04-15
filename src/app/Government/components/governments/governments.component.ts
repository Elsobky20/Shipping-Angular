// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-governments',
//   imports: [],
//   templateUrl: './governments.component.html',
//   styleUrl: './governments.component.css'
// })
// export class GovernmentsComponent {

// }
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GovernmentServiceService } from '../../services/government.service.service';
import { IGovernmentGetDTO } from '../../Interfaces/igovernment';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, observable, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-governments',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './governments.component.html',
  styleUrl: './governments.component.css'
})
export class GovernmentsComponent implements OnInit {
  /* ============================================ Start Properties & Constructor ============================== */
  searchForm: FormGroup;
  governments!:IGovernmentGetDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistGovernmentsNumber:number = 0;
  totalGovernmentsNumber:number = 0;
  pageNumber:number = 1;
  selectedPageSize: number = 10;
  numberOfPages!:number;
  values: number[] = [5, 10, 25, 50];
  constructor(private governmentService:GovernmentServiceService, private httpReqService:HttpReqService){
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }
  /* ============================================ End Properties & Constructor ================================ */
  ngOnInit(): void {
    // جلب جميع المحافاظات عند التهيئة
    this.loadAllGovernments(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    // المحافظات الموجودة في الخدمة
    this.loadExistGovernments();
  }

  loadAllGovernments(size:number, pageNum?:number): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('government', 'all', {pageSize:size, page:pageNum})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.handleSuccessResponse(response)
        this.totalGovernmentsNumber = response.data.totalGovernments;
        this.numberOfPages = this.totalGovernmentsNumber / this.selectedPageSize;
        console.log(this.numberOfPages)
      },
      error: (error) => this.handleError(error)
    });
  }

  loadExistGovernments():void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('government', 'exist')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.ExistGovernmentsNumber = response.data.totalGovernments;
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
            return this.httpReqService.getAll('Government', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
              })
            );
          } else {
            return this.httpReqService.getAll('Government', 'all', {pageSize: size, page: pageNum});
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
    this.governments = response.data?.governments || [];
    this.sortGovernments();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.governments = []; // إفراغ القائمة عند الخطأ
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.governments = []; // إفراغ القائمة عند الخطأ

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortGovernments(): void {
    this.governments = this.governments.sort((a, b) =>
      a.name.localeCompare(b.name));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
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
    this.loadAllGovernments(value);
    this.setupSearch(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadAllGovernments(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }


  /* ============================================ End Number Of Rows ========================================= */

  /* ============================================ Start Delete =============================================== */
  deleteGovernment(id:number):void{
    const government = this.governments.find(g => g.id === id);
    if (government?.isDeleted) {
      Swal.fire({
        title: "Can't delete government.",
        text: 'This government is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    // تأكيد الحذف للمدينة النشطة
    this.httpReqService.confirmAndDelete('government', id).subscribe({
      next: () => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'government deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.governments.findIndex(g => g.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.governments = [...this.governments];
          this.governments[index].isDeleted = true;
          this.governments.sort((a, b) => a.name.localeCompare(b.name));
          this.loadExistGovernments();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting government',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  /* ============================================ End Delete ================================================= */
}
