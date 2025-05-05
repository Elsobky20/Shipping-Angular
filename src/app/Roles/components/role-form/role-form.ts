import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';

type PermissionKey = 'canView' | 'canEdit' | 'canDelete' | 'canAdd' | 'isDeleted';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './role-form.html',
  styleUrls: ['./role-form.css']
})
export class RoleFormComponent implements OnInit {
  roleId!:string;
  checkCityDeleted!:boolean;
  constructor(
    private httpReqService:HttpReqService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  roleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    isDeleted: new FormControl(false)
  })

  get getName() {
    return this.roleForm.controls['name'];
  }
  get getIsDeleted() {
    return this.roleForm.controls['isDeleted'];
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.roleId = String(params.get('id'));
        this.getName.setValue('');

        if (this.roleId !== '0') {
          this.httpReqService.getById('role',this.roleId).subscribe({
            next: (response) => {
              this.getName.setValue(response.name);
              this.getIsDeleted.setValue(!response.isDeleted);
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      }
    })
  }

  roleHandler():void {
      if (this.roleForm.status == 'VALID') {
        if (this.roleId === '0') {

          const editedForm = {
            name: this.getName.value
          }

          this.httpReqService.create('role', editedForm).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Role added!',
                text: `"${this.getName.value}" has been added successfully.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['/Role'])
            },
            error: (error) => {
              if (error.error.message == "Role is already exist.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Role',
                  text: `The role "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the role.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          });
        } else {
          const editedForm = {
            ...this.roleForm.value,
            isDeleted: !this.getIsDeleted.value
          }
          this.httpReqService.editById('role', this.roleId, editedForm).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Role updated!',
                text: `"${this.getName.value}" has been updated successfully.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['/Role'])
            },
            error: (error) => {
              if (error.error.message === "Role is already exist.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Role',
                  text: `The role "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the city.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          })
        }
      }
    }

  cancelHandeler():void {
    if (this.roleId == '0') {
      this.roleForm.reset({
        name: '',
      });
    }
    else
      this.router.navigate(['Role'])
  }
}
