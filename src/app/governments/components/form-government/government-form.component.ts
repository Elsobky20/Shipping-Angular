import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovernmentService } from '../../services/goverbment.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Government, GovernmentCreateDTO } from '../../Interfaces/government.model';

@Component({
  standalone: true,
  selector: 'app-government-form',
  templateUrl: './government-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class GovernmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private governmentService: GovernmentService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      branch_Id: [1, Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.id = +idParam;
        this.governmentService.getById(this.id).subscribe((gov: Government) => {
          this.form.patchValue({
            name: gov.name,
            branch_Id: gov.branch_Id,
          });
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const dto: GovernmentCreateDTO = this.form.value;

    const action = this.isEditMode && this.id != null
      ? this.governmentService.update(this.id, dto)
      : this.governmentService.create(dto);

    action.subscribe(() => this.router.navigate(['/government']));
  }

  onCancel() {
    this.router.navigate(['/government']);
  }
  

}
