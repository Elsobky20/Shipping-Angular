import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { IProfileDto } from '../../Interfaces/iprofile-get';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { error } from 'console';

@Component({
  selector: 'app-profile',
  imports: [CommonModule ,FormsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profile!: IProfileDto;
  selectedFile!: File;
 // userId: string = '6092b766-67e6-4847-9bb4-72488b9e4a2f'; // هتحط ID المستخدم هنا أو تجيبه من JWT مثلاً
  userId: string = '';
  constructor(private profileService: ProfileService,private http:HttpReqService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    this.userId = storedUserId;
    this.getProfileData();
  } else {
    console.error('User ID not found in localStorage');
  }
    // this.getProfileData();
  }

  getProfileData() {
    // this.profileService.getUserById(this.userId).subscribe({
    //   next: (res) => {
    //     this.profile = res.data;
    //     console.log(this.profile);
    //   },
    //   error: (err) => console.error(err)
    // });
    this.http.getById('Profile',this.userId).subscribe(
      {
        next: (res)=>{
          this.profile = res.data;
         console.log(this.profile);
        },
        error:(error)=> console.log(error)
      }
    )
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadImage() {
    if (this.selectedFile) {
      this.profileService.uploadProfileImage(this.userId, this.selectedFile).subscribe({
        next: (res) => {
          Swal.fire('Success', res.message, 'success');
          this.getProfileData(); // refresh image
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Upload failed', 'error');
        }
      });
    }
  }
}


