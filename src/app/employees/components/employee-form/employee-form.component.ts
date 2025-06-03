import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup ,ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ICityGetDTO } from '../../../City/Interfaces/icity-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { AllBranches } from '../../../Merchant/Interfaces/imerchnt-all';
import { OrderService } from '../../../Orders/services/order.service';
import { AppRoleDTO } from '../../../Roles/Interfaces/Role';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule,ReactiveFormsModule, NgSelectModule],
})
export class EmployeeFormComponent implements OnInit {
  employeeId!:number;
  mySubscribe!:any;
  allBranches!: AllBranches[];
  theBranches!:number[];
  allRoles!:AppRoleDTO[];
  filteredCities!:any[];
  filteredCitiesList: ICityGetDTO[][] = [];

  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute:ActivatedRoute,
      private router:Router,
      private orderService:OrderService
    ) {}
  /* ========================================================================================================= */

  /* ========================================================================================================= */
  passwordMatchValidator = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
    address: new FormControl(''),
    branch_Id: new FormControl('', [Validators.required]),
    isDeleted: new FormControl(false),
    roles_Id: new FormControl<string[]>([], [Validators.required])
  }, { validators: this.passwordMatchValidator })

  get getName() {
    return this.employeeForm.controls['name'];
  }
  get getEmail() {
    return this.employeeForm.controls['email'];
  }
  get getPassword() {
    return this.employeeForm.controls['password'];
  }
  get getConfirmPassword() {
    return this.employeeForm.controls['confirmPassword'];
  }
  get getPhone() {
    return this.employeeForm.controls['phone'];
  }
  get getAddress() {
    return this.employeeForm.controls['address'];
  }
  get getBranchId() {
    return this.employeeForm.controls['branch_Id'];
  }
  get getRolesId() {
    return this.employeeForm.controls['roles_Id'];
  }
  get getIsDeleted() {
    return this.employeeForm.controls['isDeleted'];
  }

  ngOnInit(): void {
    forkJoin({
      branches: this.orderService.getExistingBranches(),
      roles: this.httpReqService.getAll('role', 'exist', {pageSize:100}),
    }).subscribe({
      next: ({ branches, roles }) => {
        this.allBranches = branches.data.branches;
        this.allRoles = roles.data.roles.filter(
            (role: { name: string; }) =>
            role.name.toLowerCase() !== 'admin' &&
            role.name.toLowerCase() !== 'merchant'
        );

        this.activatedRoute.paramMap.subscribe({
          next: (params) => {
            this.employeeId = Number(params.get('id'));

    /* ================================================ */
            this.employeeForm = new FormGroup({
              name: new FormControl('', [Validators.required, Validators.minLength(5)]),
              email: new FormControl('', [Validators.required, Validators.email]),
              password: new FormControl(''),
              confirmPassword: new FormControl(''),
              phone: new FormControl('', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
              address: new FormControl(''),
              branch_Id: new FormControl('', [Validators.required]),
              isDeleted: new FormControl(false),
              roles_Id: new FormControl<string[]>([], [Validators.required])
            }, { validators: this.passwordMatchValidator });

            if (this.employeeId === 0) {
              this.getPassword.setValidators([Validators.required, Validators.minLength(5)]);
              this.getConfirmPassword.setValidators([Validators.required]);
            }

            if (this.employeeId != 0) {
              this.mySubscribe = this.httpReqService.getById('employee', this.employeeId).subscribe({
                next: (response) => {
                  const data = response.data;
                  // Set main form values
                  this.getName.setValue(data.name);
                  this.getEmail.setValue(data.email);
                  this.getPhone.setValue(data.phone);
                  this.getAddress.setValue(data.address);
                  this.getIsDeleted.setValue(!data.isDeleted);
                  this.getBranchId.setValue(data.branch_Id);
                  const selectedRoleIds = Object.keys(data.roles);
                  this.getRolesId.setValue(selectedRoleIds);

                  this.getPassword.updateValueAndValidity();
                  this.getConfirmPassword.updateValueAndValidity();
                },
                error: (error) => {
                  console.log(error);
                },
              });
            }
          }
        })
      },
      error: (err) => console.error('Error loading initial data', err)
      });
  }


  employeeHandler():void {
      if (this.employeeForm.status == 'VALID') {
        if (this.employeeId == 0) {

          this.httpReqService.create('employee', this.employeeForm.value).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Employee added!',
                text: `"${this.getName.value}" has been added successfully✔.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['/employees'])
            },
            error: (error) => {
              if (error.error.error === "Employee is already exist❌.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Employee',
                  text: `The employee "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the Employee🙄.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          });
        } else {
          const formValue = this.employeeForm.value;
          if (!formValue.password) {
            delete formValue.confirmPassword;
            delete formValue.password;
          }
          const newEditParam = {
            ...formValue,
            isDeleted: !this.getIsDeleted.value,
            currentPassword: this.getPassword.value,
            newPassword: this.getConfirmPassword.value
          }
          this.httpReqService.editById('employee', this.employeeId, newEditParam).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Employee updated!',
                text: `"${this.getName.value}" has been updated successfully.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['employees'])
            },
            error: (error) => {
              if (error.error.error === "Employee is already exist.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Employee',
                  text: `The employee "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the Employee.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          })
        }
      }
    }

  cancelHandeler():void {
    if (this.employeeId == 0) {
      this.employeeForm.reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        branch_Id: '',
        roles_Id: []
      });
    }
    else
      this.router.navigate(['employees'])
  }
}
