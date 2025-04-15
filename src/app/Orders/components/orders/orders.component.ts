import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { IOrderGetDTO } from '../../Interfaces/iorder-get-dto';
import { OrderService } from '../../services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  searchForm: FormGroup;
  orders!:IOrderGetDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistOrdersNumber:number = 0;
  totalOrdersNumber:number = 0;
  pageNumber:number = 1;
  selectedPageSize: number = 10;
  numberOfPages!:number;
  values: number[] = [5, 10, 25, 50];

  statuses: string[] = [
    'All',
    'New',
    'Pending',
    'DeliveredToAgent',
    'Delivered',
    'CanceledByRecipient',
    'PartiallyDelivered',
    'Postponed',
    'CannotBeReached',
    'RejectedAndNotPaid',
    'RejectedWithPartialPayment',
    'RejectedWithPayment'
  ];

  statusLabels: { [key: string]: string } = {
    All: 'All',
    New: 'New',
    Pending: 'Pending',
    DeliveredToAgent: 'Delivered to Agent',
    Delivered: 'Delivered',
    CanceledByRecipient: 'Canceled by Recipient',
    PartiallyDelivered: 'Partially Delivered',
    Postponed: 'Postponed',
    CannotBeReached: 'Cannot be Reached',
    RejectedAndNotPaid: 'Rejected and Not Paid',
    RejectedWithPartialPayment: 'Rejected with Partial Payment',
    RejectedWithPayment: 'Rejected with Payment'
  };

  selectedStatus: string = 'New';

  constructor(private orderService:OrderService){
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }
  /* ============================================ End Properties & Constructor ================================ */
  ngOnInit(): void {
    // جلب جميع المدن عند التهيئة
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageNumber = 1;
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
  }

  loadExistOrders(size:number, pageNum?:number): void {
      this.isLoading = true;
      this.mySubscribe = this.orderService.getAllOrders(this.selectedStatus, 'exist', { pageSize: size, page: pageNum })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response)
          this.totalOrdersNumber = response.data.totalOrders;
          this.numberOfPages = this.totalOrdersNumber / this.selectedPageSize;
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
              return this.orderService.getAllOrders(this.selectedStatus, 'exist', {
                searchTxt: query,
                pageSize: size,
                page: pageNum
              }).pipe(
                catchError(error => {
                  this.handleError(error);
                  return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
                })
              );
            } else {
              return this.orderService.getAllOrders(this.selectedStatus, 'exist', {
                pageSize: size,
                page: pageNum
              });            }
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
      this.orders = response.data?.orders || [];
      this.sortOrders();
    }

    handleCustomError(response: any): void {
      this.isLoading = false;
      this.orders = []; // إفراغ القائمة عند الخطأ
      this.errorMessage = response.message || 'Error on geting data!';
    }

    handleError(error: any): void {
      this.isLoading = false;
      this.orders = []; // إفراغ القائمة عند الخطأ

      if (error.status === 404) {
        this.errorMessage = 'Not Found';
      } else {
        this.errorMessage = 'Error on server!';
      }
    }

    sortOrders(): void {
      this.orders = this.orders.sort((a, b) =>
        a.serialNumber.localeCompare(b.serialNumber));
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
    this.loadExistOrders(value);
    this.setupSearch(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadExistOrders(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */

  /* ============================================ Start Delete =============================================== */
  


  deleteCity(id:number):void{
      // const order = this.orders.find(c => c.id === id);
      // if (true) {
      //   Swal.fire({
      //     title: "Can't delete city.",
      //     text: 'This city is already deleted!',
      //     icon: 'error',
      //     confirmButtonText: 'Ok'
      //   });
      //   return;
      // }
      // // تأكيد الحذف للمدينة النشطة
      // this.httpReqService.confirmAndDelete('city', id).subscribe({
      //   next: () => {
      //     // عند نجاح الحذف
      //     Swal.fire({
      //       title: 'Deleted successfully!',
      //       text: 'City deleted successfully!',
      //       icon: 'success',
      //       confirmButtonText: 'Ok'
      //     });

      //     const index = this.orders.findIndex(c => c.id === id);
      //     if (index !== -1) {
      //       // 2. إنشاء نسخة جديدة من المصفوفة
      //       this.orders = [...this.orders];
      //       //this.orders[index].isDeleted = true;
      //       //this.orders.sort((a, b) => a.governmentName.localeCompare(b.governmentName));
      //       this.loadExistCities();
      //     }
      //   },
      //   error: (error) => {
      //     console.log(error);
      //     Swal.fire({
      //       title: 'Error!',
      //       text: 'Failed deleting city.',
      //       icon: 'error',
      //       confirmButtonText: 'Ok'
      //     });
      //   }
      // });
    }
    /* ============================================ End Delete ================================================= */
}
