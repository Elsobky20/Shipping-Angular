import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { DeliveryGet, IOrderGetDTO } from '../../Interfaces/iorder-get-dto';
import { OrderService } from '../../services/order.service';
import Swal from 'sweetalert2';
import { DeliveryService } from '../../../Delivery/services/delivery.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
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
  userId!:any;
  userRole!:any;
  specialId!:number;

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

  selectedStatus!: string;
  // الحالات اللي التاجر يقدر يختارها
  allowedStatusesForMerchant: string[] = ['Pending', 'CanceledByRecipient'];
  allowedStatusesForDelivery: string[] = [
    'DeliveredToAgent',
    'Delivered',
    'PartiallyDelivered',
    'Postponed',
    'CannotBeReached',
    'RejectedAndNotPaid',
    'RejectedWithPartialPayment',
    'RejectedWithPayment'];

  constructor(private orderService:OrderService, private deliveryService:DeliveryService){
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchForm: FormGroup;
  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }
  /* ============================================ End Properties & Constructor ================================ */
  get filteredStatuses(): string[] {
    if (this.userRole === 'delivery') {
      return this.statuses.filter(
        status => !['New', 'Pending', 'CanceledByRecipient'].includes(status)
      );
    }
    return this.statuses;
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRoles');
    if(this.userRole !== 'delivery'){
      this.selectedStatus = 'New';
    } else {
      this.selectedStatus = 'DeliveredToAgent';
    }
    this.mySubscribe = this.orderService.getUserByRole(this.userId, this.userRole).subscribe({
      next: (response) => {
        this.specialId = response.userId;
        // جلب جميع المدن عند التهيئة
        this.loadExistOrders(this.selectedPageSize, this.pageNumber);
        // إعداد البحث التفاعلي
        this.setupSearch(this.selectedPageSize, this.pageNumber);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageNumber = 1;
    this.loadExistOrders(this.selectedPageSize, this.pageNumber);
    this.setupSearch(this.selectedPageSize, this.pageNumber);
  }

  loadExistOrders(size:number, pageNum?:number): void {
      this.isLoading = true;
      if(this.userRole === 'merchant'){
        this.mySubscribe = this.orderService.getAllOrdersByMerchant(this.specialId ,this.selectedStatus, 'exist', { pageSize: size, page: pageNum })
      }
      else if (this.userRole === 'delivery'){
        this.mySubscribe = this.orderService.getAllOrdersByDelivery(this.specialId ,this.selectedStatus, 'exist', { pageSize: size, page: pageNum })
      }
      else{
        this.mySubscribe = this.orderService.getAllOrdersByEmployee(this.selectedStatus, 'exist', { pageSize: size, page: pageNum })
      }
      this.mySubscribe.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: { data: { totalOrders: number; }; }) => {
          this.handleSuccessResponse(response)
          this.totalOrdersNumber = response.data.totalOrders;
          this.numberOfPages = this.totalOrdersNumber / this.selectedPageSize;
        },
        error: (error: any) => this.handleError(error)
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
            if(this.userRole === 'merchant'){
              this.mySubscribe = this.orderService.getAllOrdersByMerchant(this.specialId ,this.selectedStatus, 'exist',
                {
                  searchTxt: query,
                  pageSize: size,
                  page: pageNum
                })
            } else if (this.userRole === 'delivery'){
              this.mySubscribe = this.orderService.getAllOrdersByDelivery(this.specialId ,this.selectedStatus, 'exist',
                {
                searchTxt: query,
                pageSize: size,
                page: pageNum
                })
            } else{
              this.mySubscribe = this.orderService.getAllOrdersByEmployee(this.selectedStatus, 'exist',
                {
                  searchTxt: query,
                  pageSize: size,
                  page: pageNum
                })
            }
            return this.mySubscribe.pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY;
              })
            );
          } else {
            if(this.userRole === 'merchant'){
              this.mySubscribe = this.orderService.getAllOrdersByMerchant(this.specialId ,this.selectedStatus, 'exist',
                {
                  pageSize: size,
                  page: pageNum
                })
            } else if (this.userRole === 'delivery'){
              this.mySubscribe = this.orderService.getAllOrdersByDelivery(this.specialId ,this.selectedStatus, 'exist',
                {
                pageSize: size,
                page: pageNum
                })
            } else{
              this.mySubscribe = this.orderService.getAllOrdersByEmployee(this.selectedStatus, 'exist',
                {
                  pageSize: size,
                  page: pageNum
                })
            }
            return this.mySubscribe;
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
    this.orders = response.data?.orders || [];
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
    this.setupSearch(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadExistOrders(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */


  /* ============================================ Start Delete =============================================== */
  deleteOrder(id: number): void {
    const order = this.orders.find(o => o.id === id);

    if (!this.userId || !order) {
      Swal.fire({
        title: "Can't delete order.",
        text: 'User or Order not found!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete or reject this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.orderService.deleteOrRejectOrder(id, this.userId).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Done!',
              text: this.userRole === 'delivery' ? 'Order rejected successfully✔.' : 'Order deleted successfully✔.',
              icon: 'success',
              confirmButtonText: 'Ok'
            });

            const index = this.orders.findIndex(o => o.id === id);
            if (index !== -1) {
              // ممكن تحدث القائمة بعد الحذف
              this.orders = [...this.orders];
              this.loadExistOrders(this.selectedPageSize, this.pageNumber); // تحديث القائمة
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error!',
              text: err.error?.message || 'Failed to delete/reject the order.',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }

  /* ============================================ End Delete ================================================= */

  /* ============================================ Start Update Status ======================================== */
  updateStatus(orderId: number) {
    if(this.userRole != 'delivery'){
      var selectHtml = `
      <div class="mb-3 text-start">
        <label for="orderStatus" class="form-label fw-bold">Choose Status</label>
        <select id="orderStatus" class="form-select" style="width: 100%;">
            ${this.statuses
            .filter(status => status !== 'All')
            .map(
              status => `
            <option value="${status}" ${this.allowedStatusesForMerchant.includes(status) ? '' : 'disabled'}>
              ${this.statusLabels[status]}
            </option>
          `
            ).join('')}
        </select>
      </div>

      <div class="mb-3 text-start">
        <label for="note" class="form-label fw-bold">Merchant Notes</label>
        <textarea id="note" class="form-control" placeholder="Enter your notes here..." rows="4" style="width: 100%;"></textarea>
      </div>
      `;
    } else {
      var selectHtml = `
      <div class="mb-3 text-start">
        <label for="orderStatus" class="form-label fw-bold">Choose Status</label>
        <select id="orderStatus" class="form-select" style="width: 100%;">
            ${this.statuses
            .filter(status => status !== 'All')
            .map(
              status => `
            <option value="${status}" ${this.allowedStatusesForDelivery.includes(status) ? '' : 'disabled'}>
              ${this.statusLabels[status]}
            </option>
          `
            ).join('')}
        </select>
      </div>

      <div class="mb-3 text-start">
        <label for="note" class="form-label fw-bold">Delivery Notes</label>
        <textarea id="note" class="form-control" placeholder="Enter your notes here..." rows="4" style="width: 100%;"></textarea>
      </div>
      `;
    }

  Swal.fire({
    title: 'Change Order Status',
    html: selectHtml,
    showCancelButton: true,
    confirmButtonText: 'Change',
    focusConfirm: false,
    preConfirm: () => {
      const selectedStatus = (document.getElementById('orderStatus') as HTMLSelectElement).value;
      const note = (document.getElementById('note') as HTMLTextAreaElement).value.trim() || "";
      if (this.userRole !== 'delivery' && !this.allowedStatusesForMerchant.includes(selectedStatus)) {
        Swal.showValidationMessage('This status is not allowed for Merchants!');
        return false;
      }
      if (this.userRole === 'delivery' && !this.allowedStatusesForDelivery.includes(selectedStatus)) {
        Swal.showValidationMessage('This status is not allowed for Deliveries!');
        return false;
      }
      return { selectedStatus, note };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const { selectedStatus, note } = result.value;
      this.orderService.changeOrderStatus(orderId, this.userId, selectedStatus, note).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Order status updated successfully.', 'success');
            this.orders = [...this.orders];
            this.loadExistOrders(this.selectedPageSize, this.pageNumber); // تحديث القائمة
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Something went wrong!', 'error');
        }
      });
    }
  });
  }
  /* ============================================ End Update Status ========================================= */


  /* ============================================ Start Assign Order To Delivery Status ===================== */
  assignOrderToAgent(orderId: number, branchId: number): void {
    this.deliveryService.getDeliveriesByBranch(branchId).subscribe({
      next: (deliveries: DeliveryGet[]): void => {
        if (!deliveries.length) {
          Swal.fire('No Deliveries', 'No delivery agents found for this branch.', 'info');
          return;
        }

        const selectOptions = deliveries.map((d) => `
          <option value="${d.id}">${d.name}</option>
        `).join('');

        Swal.fire({
          title: 'Assign Order to Delivery',
          html: `
            <label for="deliverySelect" class="form-label">Choose a Delivery Agent</label>
            <select id="deliverySelect" class="form-select">
              ${selectOptions}
            </select>
          `,
          confirmButtonText: 'Assign',
          showCancelButton: true,
          focusConfirm: false,
          preConfirm: () => {
            const selectedId = (document.getElementById('deliverySelect') as HTMLSelectElement)?.value;
            if (!selectedId) {
              Swal.showValidationMessage('Please select a delivery agent.');
              return;
            }
            return selectedId;
          }
        }).then(result => {
          if (result.isConfirmed && result.value) {
            const deliveryId = Number(result.value);
            this.orderService.assignOrderToDelivery(orderId, deliveryId).subscribe({
              next: () => {
                Swal.fire('Assigned!', 'Order assigned successfully.', 'success');

                this.orders = [...this.orders];
                this.loadExistOrders(this.selectedPageSize, this.pageNumber); // تحديث القائمة
              },
              error: () => {
                Swal.fire('Error', 'Failed to assign the order.', 'error');
              }
            });
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to load delivery agents.', 'error');
      }
    });
  }
  /* ============================================ End Assign Order To Delivery Status ======================= */
}
