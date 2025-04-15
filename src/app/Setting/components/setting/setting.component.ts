import { Component , OnDestroy, OnInit  } from '@angular/core';
import { SettingService }from '../../services/setting.service';
import { ISettingDTO } from '../../Interfaces/isetting-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink ,Router,RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  imports: [CommonModule, ReactiveFormsModule, RouterLink,RouterModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {

  constructor(private settingService:SettingService, private httpReqervice:HttpReqService,private router:Router){}
  settings!:ISettingDTO[];
  mySubsribe:any;
  ngOnInit(): void {
    this.settingService.getAllSetting().subscribe({
      next: (response) => {
        console.log(response);
        this.settings = response.data; // ✅ كده تمام، لأن data هي المصفوفة مباشرة
      },
      error: (error) => {
        console.error('Error fetching settings:', error);
      }
    });

    // this.mySubsribe = this.httpReqervice.getAll('Setting','all').subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.settings = response.data.settings;
    //     console.log(this.settings)
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // })
  }
  editSetting(id:number):void
  {
    this.router.navigate(['/seting/edit',id])
  }
}





