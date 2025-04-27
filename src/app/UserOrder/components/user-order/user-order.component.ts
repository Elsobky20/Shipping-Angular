import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserOrderService } from '../../services/user-order.service';


@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})
export class UserOrderComponent implements OnInit {
  orders: any[] = [];
  totalOrdersNumber: number = 0;
  errorMessage: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  allOrExist: string = 'all'; // Assuming this is a filter option
  numberOfPages: number = 0;
  selectedPageSize: number = 10;
  values: number[] = [5, 10, 20, 50];
  
  // تعريف الـ OrderStatus كما هو مذكور في الـ Backend
  statuses: string[] = [
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
    New: 'New',
    Pending: 'Pending',
    DeliveredToAgent: 'Delivered to Agent',
    Delivered: 'Delivered',
    CanceledByRecipient: 'Canceled by Recipient',
    PartiallyDelivered: 'Partially Delivered',
    Postponed: 'Postponed',
    CannotBeReached: 'Cannot Be Reached',
    RejectedAndNotPaid: 'Rejected and Not Paid',
    RejectedWithPartialPayment: 'Rejected with Partial Payment',
    RejectedWithPayment: 'Rejected with Payment'
  };

  selectedStatus: string = '';
  searchForm: FormGroup;
  UserId: string = '';
  Id: number = 0;
  
  constructor(
    private orderService: UserOrderService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); 

    if (userId) {
      this.UserId = userId;
      this.getUserId(); // استدعاء getUserId هنا
    } else {
      this.errorMessage = 'User not found in localStorage';
    }

    this.searchForm.get('search')?.valueChanges.subscribe(() => {
      this.pageNumber = 1;
      this.getOrders();
    });
  }
  getUserId(): void {
    this.orderService.getUserId(this.UserId, 'Delivery').subscribe({
      next: (res: any) => {
        console.log('response from getUserId:', res); // هنا شوفي إيه اللي بيرجع فعلاً
        this.Id = res.userId; // أو res.data.userId لو محتاجة
        console.log('Extracted Id:', this.Id);
  
        if (this.Id) {
          this.getOrders();  // بس لما Id يكون valid
        } else {
          this.errorMessage = 'User ID returned is invalid';
        }
      },
      error: () => {
        this.errorMessage = 'Error while fetching user ID';
      }
    });
  }
  

  getOrders(): void {
    const filters = {
      deliveryId: this.Id,
      orderStatus: this.selectedStatus,
      allOrExist: this.allOrExist,
      search: this.searchForm.value.search,
      page: this.pageNumber,
      pageSize: this.pageSize
    };

    this.orderService.getOrdersByDelivery(filters).subscribe({
      next: (res: any) => {
        console.log('Orders response:', res); // هنا شوفي إيه اللي بيرجع فعلاً
        this.orders = res.orders;
        this.totalOrdersNumber = res.totalCount;
        this.numberOfPages = Math.ceil(res.totalCount / this.pageSize);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error while fetching orders';
      }
    });
  }

  updatePageNumber(page: number): void {
    this.pageNumber = page;
    this.getOrders();
  }

  updateSelectedValue(value: number): void {
    this.pageSize = value;
    this.selectedPageSize = value;
    this.pageNumber = 1;
    this.getOrders();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageNumber = 1;
    this.getOrders();
  }

}

