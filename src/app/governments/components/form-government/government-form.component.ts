import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovernmentService } from '../../services/goverbment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-government-form',
  templateUrl: './government-form.component.html',
  imports: [CommonModule ,FormsModule],
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

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = +params['id'];
        this.governmentService.getById(this.id).subscribe((gov) => {
          this.form.patchValue(gov);
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.isEditMode && this.id != null) {
      this.governmentService.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/governments']);
      });
    } else {
      this.governmentService.create(this.form.value).subscribe(() => {
        this.router.navigate(['/governments']);
      });
    }
  }
}
