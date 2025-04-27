import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGetGovernrate } from '../../Interfaces/government.model';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-government-list',
  templateUrl: './government-list.component.html',
  styleUrl: './government-list.component.css',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
})
export class GovernmentListComponent implements OnInit {
  searchForm: FormGroup;
  governrates!: IGetGovernrate[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistGovernratesNumber:number = 0;
  totalGovernratesNumber:number = 0;
  pageNumber:number = 1;
  selectedPageSize: number = 10;
  numberOfPages!:number;
  values: number[] = [5, 10, 25, 50];

  constructor(private httpReqService: HttpReqService) {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }

  ngOnInit(): void {
    // جلب جميع المدن عند التهيئة
    this.loadAllGovernrates(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    // المدن الموجودة في الخدمة
    this.loadExistGovernrates();
  }
  
  loadAllGovernrates(size:number, pageNum?:number) {
    this.isLoading = true;
      this.mySubscribe = this.httpReqService.getAll('Government', 'all', {pageSize:size, page:pageNum})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response)
          this.totalGovernratesNumber = response.totalGovernments;
          this.numberOfPages = this.totalGovernratesNumber / this.selectedPageSize;
        },
        error: (error) => this.handleError(error)
      });
  }

  loadExistGovernrates():void {
      this.isLoading = true;
      this.mySubscribe = this.httpReqService.getAll('Government', 'exist')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ExistGovernratesNumber = response.totalGovernments;
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
    this.governrates = response?.governments || [];
    this.sortGovernrates();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.governrates = []; // إفراغ القائمة عند الخطأ
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.governrates = []; // إفراغ القائمة عند الخطأ

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortGovernrates(): void {
    this.governrates = this.governrates.sort((a, b) =>
      a.branchName.localeCompare(b.branchName));
  }
  /* ============================================ Start Number Of Rows ======================================= */
  updateSelectedValue(value: number) {
    this.selectedPageSize = value;
    this.loadAllGovernrates(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadAllGovernrates(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */

  /* ============================================ Start Delete =============================================== */
  deleteGovernrate(id:number):void{
    const city = this.governrates.find(c => c.id === id);
    if (city?.isDeleted) {
      Swal.fire({
        title: "Can't delete governrate.",
        text: 'This governrate is already deleted🙄',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    // تأكيد الحذف للمدينة النشطة
    this.httpReqService.confirmAndDelete('Government', id).subscribe({
      next: () => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'Governrate deleted successfully✔',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.governrates.findIndex(c => c.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.governrates = [...this.governrates];
          this.governrates[index].isDeleted = true;
          this.governrates.sort((a, b) => a.branchName.localeCompare(b.branchName));
          this.loadExistGovernrates();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting governrate❌.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  /* ============================================ End Delete ================================================= */
}
