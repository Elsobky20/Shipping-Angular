import { Component, OnDestroy, OnInit  } from '@angular/core';
import { BranchService }from '../../services/branch.service';
import { IBranchDTO } from '../../Interfaces/ibranch-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, observable, Observable, Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-branches',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})

export class BranchesComponent implements OnInit {
/* ============================================ Start Properties & Constructor ============================== */
searchForm: FormGroup;
branches!:IBranchDTO[];
isLoading = false;
errorMessage: string | null = null;
destroy$ = new Subject<void>();
mySubscribe: any;
ExistBranchesNumber:number = 0;
totalBranchesNumber:number = 0;
pageNumber:number = 1;
selectedPageSize: number = 10;
numberOfPages!:number;
values: number[] = [5, 10, 25, 50];
constructor(private branchService:BranchService, private httpReqService:HttpReqService,private router:Router){
  this.searchForm = new FormGroup({
    search: new FormControl('')
  });
}
/* ============================================ End Properties & Constructor ================================ */
ngOnInit(): void {
  // جلب جميع الفروع عند التهيئة
  this.loadAllBranches(this.selectedPageSize, this.pageNumber);
  // إعداد البحث التفاعلي
  this.setupSearch(this.selectedPageSize, this.pageNumber);
  // الفروع الموجودة في الخدمة
  this.loadExistBranches();
}

loadAllBranches(size:number, pageNum?:number): void {
  this.isLoading = true;
  this.mySubscribe = this.httpReqService.getAll('branch', 'all', {pageSize:size, page:pageNum})
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      console.log("Exist Branches Response: ", response);
      this.handleSuccessResponse(response)
      this.totalBranchesNumber = response.data.totalBranches;
      this.numberOfPages = this.totalBranchesNumber / this.selectedPageSize;
      console.log(this.numberOfPages)
    },
    error: (error) => this.handleError(error)
  });
}

loadExistBranches():void {
  this.isLoading = true;
  this.mySubscribe = this.httpReqService.getAll('branch', 'exist')
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      this.ExistBranchesNumber = response.data.totalBranches;
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
          return this.httpReqService.getAll('Branch', 'all', { searchTxt: query, pageSize: size, page: pageNum }).pipe(
            catchError(error => {
              this.handleError(error);
              return EMPTY; // أو return of([]) لإرجاع مصفوفة فارغة
            })
          );
        } else {
          return this.httpReqService.getAll('Branch', 'all', {pageSize: size, page: pageNum});
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
  this.branches = response.data?.branches || [];
  this.sortBranches();
}

handleCustomError(response: any): void {
  this.isLoading = false;
  this.branches = []; // إفراغ القائمة عند الخطأ
  this.errorMessage = response.message || 'Error on geting data!';
}

handleError(error: any): void {
  this.isLoading = false;
  this.branches = []; // إفراغ القائمة عند الخطأ

  if (error.status === 404) {
    this.errorMessage = 'Not Found';
  } else {
    this.errorMessage = 'Error on server!';
  }
}

sortBranches(): void {
  this.branches = this.branches.sort((a, b) =>
    a.mobile.localeCompare(b.mobile));
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
editbranch(id: number): void {
  this.router.navigate(['/branch', id]); // الانتقال لصفحة التعديل
}
/* ============================================ Start Number Of Rows ======================================= */
updateSelectedValue(value: number) {
  this.selectedPageSize = value;
  this.loadAllBranches(value);
  this.setupSearch(value);
}
updatePageNumber(value:number){
  this.pageNumber = value;
  this.loadAllBranches(this.selectedPageSize, value);
  this.setupSearch(this.selectedPageSize, value);
}


/* ============================================ End Number Of Rows ========================================= */

/* ============================================ Start Delete =============================================== */
deleteBranch(id:number):void{
  const branch= this.branches.find(c => c.id === id);
  if (branch?.isDeleted) {
    Swal.fire({
      title: "Can't delete branch.",
      text: 'This branch is already deleted!',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    return;
  }
  // تأكيد الحذف للمدينة النشطة
  this.httpReqService.confirmAndDelete('branch', id).subscribe({
    next: () => {
      // عند نجاح الحذف
      Swal.fire({
        title: 'Deleted successfully!',
        text: 'branch deleted successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      const index = this.branches.findIndex(c => c.id === id);
      if (index !== -1) {
        // 2. إنشاء نسخة جديدة من المصفوفة
        this.branches = [...this.branches];
        this.branches[index].isDeleted = true;
        this.branches.sort((a, b) => a.mobile.localeCompare(b.mobile));
        this.loadExistBranches();
      }
    },
    error: (error) => {
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed deleting branch.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  });
}
/* ============================================ End Delete ================================================= */
}