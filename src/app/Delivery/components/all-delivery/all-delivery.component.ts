import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShowDeliveryDto } from '../../Interfaces/delivery.model';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { RouterModule,Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-delivery',
  templateUrl: './all-delivery.component.html',
  styleUrls: ['./all-delivery.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class AllDeliveryComponent implements OnInit {
  deliveries: ShowDeliveryDto[] = [];
  filteredDeliveries: ShowDeliveryDto[] = [];
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  pageSizes: number[] = [5, 10, 20];
  
  // Search control
  searchControl = new FormControl('');
  
  constructor(
    private cityService: DeliveryService,
    private httpReqervice: HttpReqService,
    private cdr: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.filterDeliveries();
      });
  }

  loadDeliveries(): void {
    this.httpReqervice.getAll('Delivery', 'all').subscribe({
      next: (response) => {
        this.deliveries = response;
        this.totalItems = this.deliveries.length;
        this.filterDeliveries();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  filterDeliveries(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    if (searchTerm) {
      this.filteredDeliveries = this.deliveries.filter(delivery =>
        delivery.name.toLowerCase().includes(searchTerm) ||
        delivery.phone.toLowerCase().includes(searchTerm) ||
        delivery.email.toLowerCase().includes(searchTerm) ||
        delivery.address.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredDeliveries = [...this.deliveries];
    }
    
    this.totalItems = this.filteredDeliveries.length;
  }

  get paginatedDeliveries(): ShowDeliveryDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDeliveries.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePageSize(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteDelivery(id: number): void {
    const delivery = this.deliveries.find(c => c.id === id);
    
    if (delivery?.isDeleted) {
      Swal.fire({
        title: "Can't delete Delivery.",
        text: 'This Delivery is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    
    this.httpReqervice.confirmAndDelete('Delivery', id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'Delivery deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.loadDeliveries(); // Reload data after deletion
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting Delivery.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  //Update Delivery
  // UpdateDelivery(id: number): void {
  //   this.httpReqervice.getById('Delivery', id).subscribe({
  //     next: (response) => {
  //       // Navigate to the update page with the delivery ID
  //       this.httpReqervice.editById('Delivery', id,response).subscribe({
  //         next: (res) => {
  //           Swal.fire({
  //             title: 'Updated successfully!',
  //             text: 'Delivery updated successfully!',
  //             icon: 'success',
  //             confirmButtonText: 'Ok'
  //             });
  //           this.loadDeliveries(); // Reload data after update
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       Swal.fire({
  //         title: 'Error!',
  //         text: 'Failed to fetch Delivery details for update.',
  //         icon: 'error',
  //         confirmButtonText: 'Ok'
  //       });
  //     }
  //   });
  // }

  editDelivery(id: number): void {
    this.router.navigate(['/delivery/edit', id]); // الانتقال لصفحة التعديل
  }
}