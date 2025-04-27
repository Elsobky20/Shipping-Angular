import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-government-form',
  templateUrl: './government-form.component.html',
  styleUrl: './government-form.component.css',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class GovernmentFormComponent implements OnInit {
  governrateId!:number;
  allBranches!: any[];
  theBranch!: any;
  checkGovernrateDeleted!:boolean;
  constructor(
    private httpReqService:HttpReqService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  governrateForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    branch_Id: new FormControl('', [Validators.required]),
    isDeleted: new FormControl(false)
  })

  get getName() {
    return this.governrateForm.controls['name'];
  }
  get getBranch() {
    return this.governrateForm.controls['branch_Id'];
  }
  get getIsDeleted() {
    return this.governrateForm.controls['isDeleted'];
  }

  ngOnInit(): void {
    // Step 1: Load Governrates
    this.httpReqService.getAll('branch', 'exist').subscribe({
      next: (response) => {
        this.allBranches = response.data.branches;
      },
      error: (error) => {
        console.log(error)
      }
    })
    /* ================================================ */
    // Step 2: Load city info if editing
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.governrateId = Number(params.get('id'));
        this.getName.setValue('');
        this.getBranch.setValue('');
        this.getIsDeleted.setValue(false);

        if (this.governrateId != 0) {
          this.httpReqService.getById('Government',this.governrateId).subscribe({
            next: (response) => {
              this.getName.setValue(response.name);
              this.getBranch.setValue(response.branch_Id);
              this.getIsDeleted.setValue(!response.isDeleted);
            },
            error: () => {},
          });
        }
      }
    })
  }

  governrateHandler():void {
    if (this.governrateForm.status == 'VALID') {
      if (this.governrateId == 0) {
        this.httpReqService.create('government', this.governrateForm.value).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Governrate added!',
              text: `"${this.getName.value}" has been added successfully✔.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/governrate'])
          },
          error: (error) => {
            if (error.error.error === "Government is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Governrate',
                text: `The governrate "${this.getName.value}" already exists🙄.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the governrate❌.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      } else {
        const newEditParam = {
          ...this.governrateForm.value,
          isDeleted: !this.getIsDeleted.value
        }
        this.httpReqService.editById('government', this.governrateId, newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Governrate updated!',
              text: `"${this.getName.value}" has been updated successfully✔.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/governrate'])
          },
          error: (error) => {
            if (error.error.error === "Government is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Governrate',
                text: `The governrate "${this.getName.value}" already exists🙄.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the governrate❌.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        })
      }
    }
  }

  cancelHandeler():void {
    if (this.governrateId == 0) {
      this.governrateForm.reset({
        name: '',
        branch_Id: '',
      });
    }
    else
      this.router.navigate(['governrate'])
  }
}
