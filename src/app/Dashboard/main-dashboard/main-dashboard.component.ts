import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from '../../Orders/services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit, OnDestroy {
  userRole!:any;
  userId!:any;
  specialId!:number;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  numberOfAllOrders!:number;

  allStatuses: string[] = [
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
    CannotBeReached: 'Cannot be Reached',
    RejectedAndNotPaid: 'Rejected and Not Paid',
    RejectedWithPartialPayment: 'Rejected with Partial Payment',
    RejectedWithPayment: 'Rejected with Payment'
  };

  statuses: string[] = []; // دي اللي هنعرضها فعليًا
  statusCounts: { [key: string]: number } = {};

  constructor(private orderService: OrderService){}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRoles');

    // حدد الـ statuses حسب الدور
    if (this.userRole?.toLowerCase() === 'delivery') {
      this.statuses = this.allStatuses.filter(status =>
        !['New', 'Pending', 'CanceledByRecipient'].includes(status)
      );
    } else {
      this.statuses = [...this.allStatuses]; // باقي الأدوار تاخد الكل
    }

    this.mySubscribe = this.orderService.getUserByRole(this.userId, this.userRole).subscribe({
      next: (response) => {
        this.specialId = response.userId;

        // نجيب الـ count لكل status
        this.statuses.forEach(status => {
          this.orderService.getOrdersCountByStatus(this.userRole!, this.specialId, status).subscribe({
            next: (res) => {
              this.statusCounts[status] = res.data;
            },
            error: (err) => {
              console.log('Error fetching count for', status, err);
              this.statusCounts[status] = 0;
            }
          });
        });

        // نجيب عدد كل الطلبات (لو حابب تحتفظ بيه لأي سبب)
        this.orderService.getOrdersCountByStatus(this.userRole!, this.specialId, 'All').subscribe({
          next: (res) => {
            this.numberOfAllOrders = res.data;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
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
}
