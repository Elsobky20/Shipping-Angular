import { Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';
import { GovernmentFormComponent } from './Government/components/government-form/government-form.component';
import { GovernmentsComponent } from './Government/components/governments/governments.component';
import { RejectReasonComponen } from './RejectReason/reject-reason/reject-reason.component';
import { RegectReasonformComponent } from './RejectReason/rejectReason-form/regect-reasonform/regect-reasonform.component';
export const routes: Routes = [
  {path: '', redirectTo: 'city', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'city', component: CitiesComponent},
  {path: 'city/:id', component: CityFormComponent},
  
  {path:'government/:id', component:GovernmentFormComponent},
  {path:'government',component:GovernmentsComponent},
  {path:'rejectReason/:id' , component:RegectReasonformComponent},
  {path:'rejectreason' , component:RejectReasonComponen},
  {path: '**', component: NotFoundComponent},

];
