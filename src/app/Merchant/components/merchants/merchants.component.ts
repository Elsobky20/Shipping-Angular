import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IMerchntGetInTableDTO } from '../../Interfaces/imerchnt-all';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchants',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.css'
})
export class MerchantsComponent implements OnInit {
   /* ============================================ Start Properties & Constructor ============================== */
  searchForm: FormGroup;
  merchants!:IMerchntGetInTableDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistMerchantsNumber:number = 0;
  totalMerchantsNumber:number = 0;
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
    this.loadAllMerchants(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    // المدن الموجودة في الخدمة
    this.loadExistMerchants();
  }

  loadAllMerchants(size:number, pageNum?:number): void {
      this.isLoading = true;
      this.mySubscribe = this.httpReqService.getAll('merchant', 'all', {pageSize:size, page:pageNum})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response)
          console.log(response)
          this.totalMerchantsNumber = response.data.totalMerchants;
          this.numberOfPages = this.totalMerchantsNumber / this.selectedPageSize;
        },
        error: (error) => this.handleError(error)
      });
    }

    loadExistMerchants():void {
      this.isLoading = true;
      this.mySubscribe = this.httpReqService.getAll('city', 'exist')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ExistMerchantsNumber = response.data.totalCitiess;
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
                return this.httpReqService.getAll('merchant', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
                  catchError(error => {
                    this.handleError(error);
                    return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
                  })
                );
              } else {
                return this.httpReqService.getAll('merchant', 'all', {pageSize: size, page: pageNum});
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
        this.merchants = response.data?.merchants || [];
        this.sortCities();
      }

      handleCustomError(response: any): void {
        this.isLoading = false;
        this.merchants = []; // إفراغ القائمة عند الخطأ
        this.errorMessage = response.message || 'Error on geting data!';
      }

      handleError(error: any): void {
        this.isLoading = false;
        this.merchants = []; // إفراغ القائمة عند الخطأ

        if (error.status === 404) {
          this.errorMessage = 'Not Found';
        } else {
          this.errorMessage = 'Error on server!';
        }
      }

      sortCities(): void {
        this.merchants = this.merchants.sort((a, b) =>
          a.government.localeCompare(b.government));
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
        this.loadAllMerchants(value);
        this.setupSearch(value);
      }
      updatePageNumber(value:number){
        this.pageNumber = value;
        this.loadAllMerchants(this.selectedPageSize, value);
        this.setupSearch(this.selectedPageSize, value);
      }
      /* ============================================ End Number Of Rows ========================================= */

      /* ============================================ Start Delete =============================================== */
        deleteMerchant(id:number):void{
          const city = this.merchants.find(c => c.id === id);
          if (city?.isDeleted) {
            Swal.fire({
              title: "Can't delete merchant.",
              text: 'This merchant is already deleted!',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            return;
          }
          // تأكيد الحذف للمدينة النشطة
          this.httpReqService.confirmAndDelete('merchant', id).subscribe({
            next: () => {
              // عند نجاح الحذف
              Swal.fire({
                title: 'Deleted successfully!',
                text: 'Merchant deleted successfully!',
                icon: 'success',
                confirmButtonText: 'Ok'
              });

              const index = this.merchants.findIndex(c => c.id === id);
              if (index !== -1) {
                // 2. إنشاء نسخة جديدة من المصفوفة
                this.merchants = [...this.merchants];
                this.merchants[index].isDeleted = true;
                this.merchants.sort((a, b) => a.government.localeCompare(b.government));
                this.loadExistMerchants();
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
