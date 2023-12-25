import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/Service.service';
import { Router } from '@angular/router';
import { ResetService } from '../service/Reset.service';
import { loginModel } from '../Model/loginModel';
import { SignalRService } from '../service/SignalR.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit {
  //validate cho login
  //email
  public Email:string = '';
  public errorMessageEmail:string = '';
  public errorsEmail!:boolean;
  //password
  public Password:string = '';
  public errorMessagePassword:string = '';
  public errorsPassword!:boolean;
  // Username
  public UserName:string = '';
  public errorMessage:string = '';
  public errors!:boolean;
  //--------
  // đổi mật khẩu
  public inputData!:string;
  public isFormshow:boolean = false;
  //
  loginUser = new loginModel();

  constructor(private formbluider:FormBuilder,private service:ServiceService,private route:Router,private reset:ResetService,private hub:SignalRService) {

    }
  ngOnInit(): void {

  }


  //       if(this.loginform.valid){
  //         this.service.Login(this.loginform.value).subscribe({
  //           //success
  //           next:(res)=>{
  //             alert('success login')
  //             console.log(this.loginform.value);
  //             this.loginform.reset();
  //             this.service.StoreToken(res.token);
  //             console.log(res.token)
  //             this.service.StoreRefreshtoken(res.rToken);
  //             const takeToken = this.service.getRole();

  //             if(takeToken == 'Admin'){
  //                 this.route.navigate(['dashboard'])
  //            }
  //            else if(takeToken == 'User'){
  //             this.route.navigate(['table'])
  //            }
  //            else{
  //             this.route.navigate(['/login']);
  //             alert('khong ton tai tai khoan')
  //            }
  //           },
  //           error:(err) =>{
  //             alert( err.error.message);
  //           }
  //         });
  //       }

  //   }

    //validate name
    checkvalidName(event:string){
      const val = event;
      if(val.length <= 0 ){
        this.errors= false;
        this.errorMessage  = "UserName require"
      }
      else if(val.length > 20){
        this.errors = false;
        this.errorMessage = "<20";
      }
      else{
        this.errors = true;
      }
    }
    //validate password
    checkvalidatePassword(event:string){
      const val = event;

      if(val.length<= 0){
          this.errorsPassword = false;
         this.errorMessagePassword = "Password require";
      }
      else{
        this.errorsPassword = true;
      }

    }
    //validate mail
    checkValidEmail(event:string){
      const val = event;
      const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if(val.length<= 0){
          this.errorsEmail = false;
         this.errorMessageEmail = "Email require";
      }
      else if(!pattern.test(val)){
          this.errorsEmail = false;
          this.errorMessageEmail = "Invalid Email";
      }
      else{
        this.errorsEmail = true;
      }

    }

    //login
 onLogin(){
      if(this.errors != true || this.errorsEmail != true || this.errorsPassword != true){
        alert('không hợp lệ')
        return;
      }
      else{
        this.loginUser.UserName = this.UserName;
        this.loginUser.Password = this.Password;
        this.loginUser.Email = this.Email

        this.service.Login(this.loginUser).subscribe({
          //success
          next:async (res)=>{
            alert('success login');
            this.service.StoreToken(res.token);
            this.service.StoreRefreshtoken(res.rToken);
            const takeToken = this.service.getRole();
            if(takeToken == 'Admin'){
                this.route.navigate(['dashboard']);

           }
           else if(takeToken == 'User'){
            this.route.navigate(['table']);

           }
           else{
            this.route.navigate(['/login']);
            alert('khong ton tai tai khoan');
           }
          },
          error:(err) =>{
            alert( err.error.message);
          }
        });
      }
    }

    showForm(){
      this.isFormshow = !this.isFormshow;
    }

    //reset password + send email
    SendEmaillink(mail:string){
      this.reset.sendlink(mail)
      this.isFormshow = true;
    }


}
