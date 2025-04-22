import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterModule  } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovernmentService } from '../../services/goverbment.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Government, GovernmentCreateDTO } from '../../Interfaces/government.model';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-government-form',
  templateUrl: './government-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
})
export class GovernmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  id?: number;
  branches: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private governmentService: GovernmentService,
    private http: HttpReqService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      branch_Id: [null, Validators.required] // Changed to null initially
    });
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.id = +idParam;
        this.loadGovernmentData(this.id);
      }
    });
  }

  private loadGovernmentData(id: number): void {
    this.isLoading = true;
    this.governmentService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (gov: Government) => {
          this.form.patchValue({
            name: gov.name,
            branch_Id: gov.branch_Id
          });
        },
        error: (err) => {
          console.error('Failed to load government data:', err);
          // يمكنك إضافة رسالة خطأ للمستخدم هنا
        }
      });
  }

  loadBranches(): void {
    this.isLoading = true;
    this.http.getAll('Branch', 'all')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.branches = res.data.branches
            .sort((a: { name: string }, b: { name: string }) => 
              a.name.localeCompare(b.name));
          
          // Set default branch if not in edit mode and branches exist
          if (!this.isEditMode && this.branches.length > 0) {
            this.form.patchValue({ branch_Id: this.branches[0].id });
          }
        },
        error: (err) => {
          console.error('Failed to load branches:', err);
          // يمكنك إضافة رسالة خطأ للمستخدم هنا
        }
      });
  }

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const dto: GovernmentCreateDTO = this.form.value;

    const action = this.isEditMode && this.id != null
      ? this.governmentService.update(this.id, dto)
      : this.governmentService.create(dto);

    action.pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/government']);
          // يمكنك إضافة رسالة نجاح هنا
        },
        error: (err) => {
          console.error('Operation failed:', err);
          // يمكنك إضافة رسالة خطأ للمستخدم هنا
        }
      });
  }

  onCancel() {
    this.router.navigate(['/government']);
  }
}