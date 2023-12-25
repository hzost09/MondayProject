import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminguardGuard } from './Guard/adminguard.guard';
import { TableComponent } from './table/table.component';
import { userguardGuard } from './Guard/userguard.guard';
import { ResetComponent } from './reset/reset.component';
import { IndexComponent } from './Index/Index.component';

const routes: Routes = [
  {
    path:'',component:IndexComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'signup',component:RegisterComponent
  },
  {
    path:'dashboard',component:DashboardComponent,canActivate:[adminguardGuard]
  },
  {
    path:'table',component:TableComponent,canActivate:[userguardGuard]
  },
  {
    path:'reset',component:ResetComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
