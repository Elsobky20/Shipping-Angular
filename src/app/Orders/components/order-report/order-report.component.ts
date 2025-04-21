import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderReportGetDTO } from '../../Interfaces/iorder-get-dto';
import { APIResponse } from '../../../AllModel/api-response';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css'],
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
})
export class OrderReportComponent implements OnInit, OnDestroy {
  orders!:OrderReportGetDTO[];
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

  constructor(private orderService: OrderService)
  {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchForm: FormGroup;
  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }
  /* ============================================ End Properties & Constructor ================================ */
  ngOnInit(): void {
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    this.setupSearch(); // فقط مرة واحدة هنا
  }


  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageNumber = 1;
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
  }

  loadExistOrders(size:number, pageNum?:number): void {
      this.isLoading = true;
      this.orderService.getOrderReports({ pageSize: size, page: pageNum, orderStatus: this.selectedStatus})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.totalOrdersNumber = response.data.totalOrders;
          this.numberOfPages = this.totalOrdersNumber / this.selectedPageSize;
        },
        error: (error) => this.handleError(error)
      });
  }

  setupSearch(): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          this.isLoading = true;
          this.errorMessage = null;

          const params: any = {
            pageSize: this.selectedPageSize,
            page: this.pageNumber,
            orderStatus: this.selectedStatus
          };

          if (query && query.trim()) {
            params.searchTxt = query;
          }

          return this.orderService.getOrderReports(params).pipe(
            catchError(error => {
              this.handleError(error);
              return EMPTY;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.totalOrdersNumber = response.data.totalOrders;
          this.numberOfPages = this.totalOrdersNumber / this.selectedPageSize;
        },
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
    this.orders = [...(response.data?.orders || [])];
    this.sortOrders();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.orders = [];
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.orders = [];
    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  parseCustomDate(dateStr: string): Date {
    // "21 Apr 2025 04.51PM" → "21 Apr 2025 04:51 PM"
    const cleaned = dateStr.replace('.', ':').replace(/(AM|PM)/, ' $1');
    return new Date(cleaned);
  }

  sortOrders(): void {
    this.orders.sort((a, b) => {
      const dateA = this.parseCustomDate(a.createdDate);
      const dateB = this.parseCustomDate(b.createdDate);
      return dateB.getTime() - dateA.getTime(); // الأحدث أول
    });
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
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadExistOrders(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */
}
