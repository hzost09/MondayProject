
import { Component, OnInit } from '@angular/core';
import { resetpass } from '../Model/resetpass';
import { ActivatedRoute } from '@angular/router';
import { ResetService } from '../service/Reset.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit{
 public email!:string;
 public newpassword!:string;
  public confirmPassword!:string;
  public isValidEmail!:boolean
public samePassword:boolean = true;

public reset = new resetpass;
/**
 *
 */
constructor(private active:ActivatedRoute,private resetSer:ResetService) {

}
  ngOnInit(): void {
  this.active.queryParams.subscribe(val =>{
    this.reset.email = val['email'];
    this.reset.emailToken = val['code'];
    this.reset.emailToken.replace(/ /g,'+');


  })

  }
  // validate form
  checkValidEmail(event:string){
    const val = event;
    const pattern =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(val);
    return this.isValidEmail;
  }

  checksamepasswordforbutton(){
    if(this.confirmPassword === this.newpassword &&
       (this.confirmPassword != null &&  this.newpassword != null)){
      this.samePassword = true;
    }
   else
   {
      this.samePassword = false;
    }
    return this.samePassword;
  }

  checksamepassword(){
    if(this.confirmPassword === this.newpassword){
      this.samePassword = true;
    }
   else
   {
      this.samePassword = false;
    }
    return this.samePassword;
  }
/*********** */

//sendresetpassword
sendResetPassword(){
  this.reset.PasswordReset = this.newpassword;
  this.reset.confirmPassWord = this.confirmPassword;
  const item = this.reset
  this.resetSer.sendReset(item);
}
}
