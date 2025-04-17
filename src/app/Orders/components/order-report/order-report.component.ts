import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IOrderGetDTO } from '../../Interfaces/iorder-get-dto';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { DeliveryService } from '../../../Delivery/services/delivery.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css'],
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
})
export class OrderReportComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  orders: IOrderGetDTO[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  selectedStatus: string = 'All';
  ExistOrdersNumber: number = 0;
  totalOrdersNumber: number = 0;
  pageNumber: number = 1;
  selectedPageSize: number = 10;
  numberOfPages: number = 0;
  values: number[] = [5, 10, 25, 50];

  constructor(
    private orderService: OrderService,
    private deliveryService: DeliveryService
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageNumber = 1;
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
  }

  loadExistOrders(size: number, pageNum: number = 1): void {
    this.isLoading = true;
    this.orderService.getAllOrders(this.selectedStatus, 'exist', { pageSize: size, page: pageNum })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.totalOrdersNumber = response.data.totalOrders;
          this.numberOfPages = Math.ceil(this.totalOrdersNumber / this.selectedPageSize);
        },
        error: (error) => this.handleError(error)
      });
  }

  setupSearch(size: number, pageNum: number = 1): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          this.isLoading = true;
          this.errorMessage = null;
          if (query && query.trim()) {
            return this.orderService.getOrderReports(
              query,            // searchTxt
              undefined,        // startDate
              undefined,        // endDate
              'all',            // orderStatus
              pageNum,          // page
              size              // pageSize
          ).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY;
              })
            );
          } else {
            return this.orderService.getAllOrders(this.selectedStatus, 'exist', {
              pageSize: size,
              page: pageNum
            });
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
    if (!response.isSuccess) {
      this.handleCustomError(response);
      return;
    }
    this.orders = response.data?.orders || [];
    this.sortOrders();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.orders = [];
    this.errorMessage = response.message || 'Error retrieving data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.orders = [];
    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Server error!';
    }
  }

  sortOrders(): void {
    this.orders.sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }

  updateSelectedValue(value: number): void {
    this.selectedPageSize = value;
    this.pageNumber = 1;
    this.loadExistOrders(value, this.pageNumber);
    this.setupSearch(value, this.pageNumber);
  }

  updatePageNumber(value: number): void {
    this.pageNumber = value;
    this.loadExistOrders(this.selectedPageSize, value);
  }
}
