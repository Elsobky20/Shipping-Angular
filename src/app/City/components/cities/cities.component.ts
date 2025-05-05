import { Component, OnInit } from '@angular/core';
import { ICityGetDTO } from '../../Interfaces/icity-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cities',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {
  /* ============================================ Start Properties & Constructor ============================== */
  searchForm: FormGroup;
  cities!:ICityGetDTO[];
  isLoading = false;
  errorMessage: string | null = null;
  destroy$ = new Subject<void>();
  mySubscribe: any;
  ExistCitiesNumber:number = 0;
  totalCitiesNumber:number = 0;
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
    this.loadAllCities(this.selectedPageSize, this.pageNumber);
    // إعداد البحث التفاعلي
    this.setupSearch(this.selectedPageSize, this.pageNumber);
    // المدن الموجودة في الخدمة
    this.loadExistCities();
  }

  loadAllCities(size:number, pageNum?:number): void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('city', 'all', {pageSize:size, page:pageNum})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.handleSuccessResponse(response)
        this.totalCitiesNumber = response.data.totalCitiess;
        this.numberOfPages = this.totalCitiesNumber / this.selectedPageSize;
      },
      error: (error) => this.handleError(error)
    });
  }

  loadExistCities():void {
    this.isLoading = true;
    this.mySubscribe = this.httpReqService.getAll('city', 'exist')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.ExistCitiesNumber = response.data.totalCitiess;
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
            return this.httpReqService.getAll('City', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
              catchError(error => {
                this.handleError(error);
                return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
              })
            );
          } else {
            return this.httpReqService.getAll('City', 'all', {pageSize: size, page: pageNum});
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
    this.cities = response.data?.cities || [];
    this.sortCities();
  }

  handleCustomError(response: any): void {
    this.isLoading = false;
    this.cities = []; // إفراغ القائمة عند الخطأ
    this.errorMessage = response.message || 'Error on geting data!';
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.cities = []; // إفراغ القائمة عند الخطأ

    if (error.status === 404) {
      this.errorMessage = 'Not Found';
    } else {
      this.errorMessage = 'Error on server!';
    }
  }

  sortCities(): void {
    this.cities = this.cities.sort((a, b) =>
      a.governmentName.localeCompare(b.governmentName));
  }

  get searchControl(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }
  /* ============================================ Start Number Of Rows ======================================= */
  updateSelectedValue(value: number) {
    this.selectedPageSize = value;
    this.loadAllCities(value);
    this.setupSearch(value);
  }
  updatePageNumber(value:number){
    this.pageNumber = value;
    this.loadAllCities(this.selectedPageSize, value);
    this.setupSearch(this.selectedPageSize, value);
  }
  /* ============================================ End Number Of Rows ========================================= */
  
  /* ============================================ Start Delete =============================================== */
  deleteCity(id:number):void{
    const city = this.cities.find(c => c.id === id);
    if (city?.isDeleted) {
      Swal.fire({
        title: "Can't delete city.",
        text: 'This city is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    // تأكيد الحذف للمدينة النشطة
    this.httpReqService.confirmAndDelete('city', id).subscribe({
      next: () => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'City deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        const index = this.cities.findIndex(c => c.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.cities = [...this.cities];
          this.cities[index].isDeleted = true;
          this.cities.sort((a, b) => a.governmentName.localeCompare(b.governmentName));
          this.loadExistCities();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting city.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  /* ============================================ End Delete ================================================= */
}
