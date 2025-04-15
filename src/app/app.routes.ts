import { Routes } from '@angular/router';
import { BranchesComponent } from './Branch/components/branches/branches.component';
import { SettingComponent } from './Setting/components/setting/setting.component';
import { SettingFormComponent } from './Setting/components/setting-form/setting-form/setting-form.component';
import { BranchFormComponent } from './Branch/components/branch-form/branch-form.component';

export const routes: Routes = [
    {path :'branch' , component: BranchesComponent},
    {path:'branch/add' , component:BranchFormComponent},
    {path :'setting' , component: SettingComponent},
    {path:'setting/add' , component:SettingFormComponent},
    {path:'seting/edit/:id',component:SettingFormComponent}
];
  