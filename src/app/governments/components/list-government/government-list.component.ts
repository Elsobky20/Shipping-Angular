import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GovernmentService } from '../../services/goverbment.service';
import { Government } from '../../Interfaces/government.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { IBranchDTO } from '../../../Branch/Interfaces/model';
import { finalize } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-government-list',
  templateUrl: './government-list.component.html',
  styleUrl: './government-list.component.css',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
})
export class GovernmentListComponent implements OnInit {
  governments: Government[] = [];
  branchesMap: { [key: number]: string } = {}; // خريطة لتخزين أسماء الفروع
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  isLoading = false;
  pageSizes = [10, 20, 30]; // الأحجام المختلفة للصفحات
  searchControl: FormControl;

  constructor(
    private governmentService: GovernmentService,
    private router: Router,
    private http: HttpReqService
  ) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
  this.loadGovernments(); // تحميل الحكومات عند بدء التشغيل
    this.loadBranches(); // تحميل الفروع عند بدء التشغيل
    
    // إضافة debounce و distinctUntilChanged للبحث
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // تأخير 300 ملي ثانية
      distinctUntilChanged(), // التأكد من أن القيمة تغيرت
      switchMap(searchTerm => {
        this.pageIndex = 1; // إعادة تعيين الصفحة إلى 1 عند تغيير البحث
        return this.governmentService.getAll(this.pageIndex, this.pageSize, searchTerm);
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        if (res && (res.governments || res.Governments)) {
          this.governments = res.governments || res.Governments;
          this.totalCount = res.totalCount || 0;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          console.error('Invalid response structure for governments:', res);
        }
      },
      error: (err) => {
        console.error('Failed to load governments:', err);
      }
    });
  }
  
  
  // تعديل دالة loadBranches لاستخدام subscribe مباشرة
  private loadBranches(): void {
    this.isLoading = true;
    this.http.getAll('Branch', 'all').subscribe({
      next: (response) => {
        if (response && response.data && response.data.branches) {
          response.data.branches.forEach((branch: IBranchDTO) => {
            this.branchesMap[branch.id] = branch.name;
          });
        }
      },
      error: (err) => {
        console.error('Failed to load branches:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  


  loadGovernments() {
    this.isLoading = true;
    const searchTerm = this.searchControl.value || ''; // الحصول على قيمة البحث أو تعيينها إلى فارغ
    this.governmentService.getAll(this.pageIndex, this.pageSize, searchTerm)  // تمرير قيمة البحث
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res && (res.governments || res.Governments)) {
            this.governments = res.governments || res.Governments;
            this.totalCount = res.totalCount || 0;
            this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          } else {
            console.error('Invalid response structure for governments:', res);
          }
        },
        error: (err) => {
          console.error('Failed to load governments:', err);
        }
      });
  }
  
  
  // دالة لتغيير الصفحة
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.loadGovernments();
    }
  }

  // تغيير حجم الصفحة
  changePageSize(size: number) {
    this.pageSize = size;
    this.pageIndex = 1; // العودة إلى الصفحة الأولى عند تغيير الحجم
    this.loadGovernments();
  }

  // الانتقال إلى الصفحة التالية
  nextPage() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadGovernments();
    }
  }

  // الانتقال إلى الصفحة السابقة
  previousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadGovernments();
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/government/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this government?')) {
      this.isLoading = true;
      this.governmentService.delete(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => this.loadGovernments(),
          error: (err) => console.error('Failed to delete government:', err)
        });
    }
  }

  onAdd() {
    this.router.navigate(['/government/add']);
  }

  // دالة مساعدة للحصول على اسم الفرع من المعرف
  getBranchName(branchId: number): string {
    return this.branchesMap[branchId] || 'Unknown Branch';
  }
}
