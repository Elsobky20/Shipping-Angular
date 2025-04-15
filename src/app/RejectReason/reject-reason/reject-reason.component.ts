

// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { RejectReassonserviceService } from '../reject-reassonservice.service';
// import { IRejectReasonGetDTO } from '../ireject-reason';
// import { HttpReqService } from '../../GeneralSrevices/http-req.service';
// import { CommonModule } from '@angular/common';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import Swal from 'sweetalert2';
// import { catchError, debounceTime, distinctUntilChanged, EMPTY, observable, Observable, Subject, switchMap, takeUntil } from 'rxjs';

// @Component({
 
//   selector: 'app-reject-reason',
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './reject-reason.component.html',
//   styleUrl: './reject-reason.component.css'
// })
// export class  RejectReasonComponen implements OnInit {
//   /* ============================================ Start Properties & Constructor ============================== */
//   searchForm: FormGroup;
//   rejectReasons!:IRejectReasonGetDTO[];
//   isLoading = false;
//   errorMessage: string | null = null;
//   destroy$ = new Subject<void>();
//   mySubscribe: any;
//   ExistrejectReasonsNumber:number = 0;
//   totalrejectReasonsNumber:number = 0;
//   pageNumber:number = 1;
//   selectedPageSize: number = 10;
//   numberOfPages!:number;
//   values: number[] = [5, 10, 25, 50];
//   constructor(private rejectReasonService:RejectReassonserviceService, private httpReqService:HttpReqService){
//     this.searchForm = new FormGroup({
//       search: new FormControl('')
//     });
//   }
//   /* ============================================ End Properties & Constructor ================================ */
//   ngOnInit(): void {
//     // جلب جميع المحافاظات عند التهيئة
//     this.loadAllRejectReasons(this.selectedPageSize, this.pageNumber);
//     // إعداد البحث التفاعلي
//     this.setupSearch(this.selectedPageSize, this.pageNumber);
//     // المحافظات الموجودة في الخدمة
//     this.loadExistRejectReasons();
//   }

//   loadAllRejectReasons(size:number, pageNum?:number): void {
//     this.isLoading = true;
//     this.mySubscribe = this.httpReqService.getAll('rejectReason', 'all', {pageSize:size, page:pageNum})
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: (response) => {
//         this.handleSuccessResponse(response)
//         this.totalrejectReasonsNumber = response.data.totalReasons;
//         this.numberOfPages = this.totalrejectReasonsNumber / this.selectedPageSize;
//         console.log(this.numberOfPages)
//       },
//       error: (error) => this.handleError(error)
//     });
//   }

//   loadExistRejectReasons():void {
//     this.isLoading = true;
//     this.mySubscribe = this.httpReqService.getAll('rejectReason', 'exist')
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: (response) => {
//         this.ExistrejectReasonsNumber = response.data.totalReasons;
//       },
//       error: (error) => this.handleError(error)
//     });
//   }

//   setupSearch(size:number, pageNum?:number): void {
//     this.searchForm.get('search')?.valueChanges
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         switchMap(query => {
//           this.isLoading = true;
//           this.errorMessage = null;
//           if (query && query.trim()) {
//             return this.httpReqService.getAll('RejectReason', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
//               catchError(error => {
//                 this.handleError(error);
//                 return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
//               })
//             );
//           } else {
//             return this.httpReqService.getAll('RejectReason', 'all', {pageSize: size, page: pageNum});
//           }
//         }),
//         takeUntil(this.destroy$)
//       )
//       .subscribe({
//         next: (response) => this.handleSuccessResponse(response),
//         error: (error) => this.handleError(error)
//       });
//   }

//   handleSuccessResponse(response: any): void {
//     this.isLoading = false;
//     this.errorMessage = null;
//     if (response.isSuccess === false) {
//       this.handleCustomError(response);
//       return;
//     }
//     this.rejectReasons = response.data?.rejectReasons || [];
//     this.sortRejectReasons();
//   }

//   handleCustomError(response: any): void {
//     this.isLoading = false;
//     this.rejectReasons = []; // إفراغ القائمة عند الخطأ
//     this.errorMessage = response.message || 'Error on geting data!';
//   }

//   handleError(error: any): void {
//     this.isLoading = false;
//     this.rejectReasons = []; // إفراغ القائمة عند الخطأ

//     if (error.status === 404) {
//       this.errorMessage = 'Not Found';
//     } else {
//       this.errorMessage = 'Error on server!';
//     }
//   }

//   sortRejectReasons(): void {
//     this.rejectReasons = this.rejectReasons.sort((a, b) =>
//       a.reason.localeCompare(b.reason));
//   }

//   get searchControl(): FormControl {
//     return this.searchForm.get('search') as FormControl;
//   }

//   ngOnDestroy(): void {
//     // تنظيف الاشتراكات
//     this.destroy$.next();
//     this.destroy$.complete();

//     if (this.mySubscribe) {
//       this.mySubscribe.unsubscribe();
//     }
//   }
//   /* ============================================ Start Number Of Rows ======================================= */
//   updateSelectedValue(value: number) {
//     this.selectedPageSize = value;
//     this.loadAllRejectReasons(value);
//     this.setupSearch(value);
//   }
//   updatePageNumber(value:number){
//     this.pageNumber = value;
//     this.loadAllRejectReasons(this.selectedPageSize, value);
//     this.setupSearch(this.selectedPageSize, value);
//   }


//   /* ============================================ End Number Of Rows ========================================= */

//   /* ============================================ Start Delete =============================================== */
//   deleteRejectReason(id:number):void{
//     const rejectReason = this.rejectReasons.find(r => r.id === id);
//     if (rejectReason?.isDeleted) {
//       Swal.fire({
//         title: "Can't delete rejectReason.",
//         text: 'This rejectReason is already deleted!',
//         icon: 'error',
//         confirmButtonText: 'Ok'
//       });
//       return;
//     }
//     // تأكيد الحذف للمدينة النشطة
//     this.httpReqService.confirmAndDelete('rejectReason', id).subscribe({
//       next: () => {
//         // عند نجاح الحذف
//         Swal.fire({
//           title: 'Deleted successfully!',
//           text: 'rejectReason deleted successfully!',
//           icon: 'success',
//           confirmButtonText: 'Ok'
//         });

//         const index = this.rejectReasons.findIndex(r => r.id === id);
//         if (index !== -1) {
//           // 2. إنشاء نسخة جديدة من المصفوفة
//           this.rejectReasons = [...this.rejectReasons];
//           this.rejectReasons[index].isDeleted = true;
//           this.rejectReasons.sort((a, b) => a.reason.localeCompare(b.reason));
//           this.loadExistRejectReasons();
//         }
//       },
//       error: (error) => {
//         console.log(error);
//         Swal.fire({
//           title: 'Error!',
//           text: 'Failed deleting government',
//           icon: 'error',
//           confirmButtonText: 'Ok'
//         });
//       }
//     });
//   }
//   /* ============================================ End Delete ================================================= */
// }
/////////////////////////////////

import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { RejectReassonserviceService } from '../reject-reassonservice.service';
import { IRejectReasonGetDTO, IRejectReasonResponseData } from '../ireject-reason';
import { HttpReqService } from '../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reject-reason',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.css']
})
export class RejectReasonComponen implements OnInit, OnDestroy, AfterViewInit {
  searchForm: FormGroup;
  rejectReasons: IRejectReasonGetDTO[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistrejectReasonsNumber: number = 0;
  totalrejectReasonsNumber: number = 0;
  pageNumber: number = 1;
  selectedPageSize: number = 10;
  numberOfPages!: number;
  values: number[] = [5, 10, 25, 50];

  constructor(private rejectReasonService: RejectReassonserviceService, private httpReqService: HttpReqService) {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadAllRejectReasons(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    this.loadExistRejectReasons();
  }

  ngAfterViewInit(): void {
    // تأكد من أنه بعد تحميل الـ DOM يمكن التفاعل معه
    setTimeout(() => {
      console.log('DOM is ready');
    }, 0);
  }

  loadAllRejectReasons(size: number, pageNum?: number): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('rejectReason', 'all', { pageSize: size, page: pageNum })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IRejectReasonResponseData) => {
          this.handleSuccessResponse(response);
          this.totalrejectReasonsNumber = response.totalReasons;
          this.numberOfPages = Math.ceil(this.totalrejectReasonsNumber / this.selectedPageSize);  // استخدم القسمة بشكل صحيح
        },
        error: (error) => this.handleError(error)
      });
  }

  loadExistRejectReasons(): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('rejectReason', 'exist')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IRejectReasonResponseData) => {
          this.ExistrejectReasonsNumber = response.totalReasons;
        },
        error: (error) => this.handleError(error)
      });
  }

  setupSearch(size: number, pageNum?: number): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          this.isLoading = true;
          this.errorMessage = null;
          if (query && query.trim()) {
            return this.httpReqService.getAll('RejectReason', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
              })
            );
          } else {
            return this.httpReqService.getAll('RejectReason', 'all', { pageSize: size, page: pageNum });
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: IRejectReasonResponseData) => this.handleSuccessResponse(response),
        error: (error) => this.handleError(error)
      });
  }

  handleSuccessResponse(response: IRejectReasonResponseData): void {
    this.isLoading = false;
    this.errorMessage = null;

    if (response.totalReasons !== undefined) {
      this.rejectReasons = response.reasons || [];
      this.totalrejectReasonsNumber = response.totalReasons;
      this.numberOfPages = Math.ceil(this.totalrejectReasonsNumber / this.selectedPageSize);
      this.sortRejectReasons();
    } else {
      this.handleCustomError({ message: 'Data format error!' });
    }
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.rejectReasons = [];
    this.errorMessage = response.message || 'Error on getting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.rejectReasons = [];

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortRejectReasons(): void {
    this.rejectReasons = this.rejectReasons.sort((a, b) => a.reason.localeCompare(b.reason));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.mySubscribe) {
      this.mySubscribe.unsubscribe();
    }
  }

  updateSelectedValue(value: number) {
    this.selectedPageSize = value;
    this.loadAllRejectReasons(value);
    this.setupSearch(value);
  }

  updatePageNumber(value: number) {
    this.pageNumber = value;
    this.loadAllRejectReasons(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }

  deleteRejectReason(id: number): void {
    const rejectReason = this.rejectReasons.find(r => r.id === id);
    if (rejectReason?.isDeleted) {
      Swal.fire({
        title: "Can't delete rejectReason.",
        text: 'This rejectReason is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.httpReqService.confirmAndDelete('rejectReason', id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'RejectReason deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.rejectReasons.findIndex(r => r.id === id);
        if (index !== -1) {
          this.rejectReasons = [...this.rejectReasons];
          this.rejectReasons[index].isDeleted = true;
          this.rejectReasons.sort((a, b) => a.reason.localeCompare(b.reason));
          this.loadExistRejectReasons();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting rejectReason',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}
