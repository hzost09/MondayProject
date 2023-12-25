import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { TableComponent } from './table/table.component';
import { ResetComponent } from './reset/reset.component';
import { IndexComponent } from './Index/Index.component';
import { SearchservicePipe } from './service/searchservice.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TableComponent,
    ResetComponent,
    IndexComponent,
    SearchservicePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule

  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      // provide: HTTP_INTERCEPTORS nghĩa là chúng ta đang cung cấp một giá trị cho token HTTP_INTERCEPTORS
       provide:HTTP_INTERCEPTORS,
       //sử dụng lớp Token để tạo ra giá trị cho token này
       useClass: TokenInterceptor,
       //có thể cung cấp nhiều giá trị cho token này
       multi:true
   },
   SearchservicePipe
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
