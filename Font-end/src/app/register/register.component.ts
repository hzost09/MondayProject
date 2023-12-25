import { ServiceService } from './../service/Service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerForm!:FormGroup;
  public isValid!:boolean;
  public event!:string

  /**
   *
   */
  constructor(private formbuilder:FormBuilder,private service:ServiceService,private route:Router) {


  }
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group(
      {
          username:['',Validators.required],
          password:['',Validators.required],
          // email:['',Validators.required]
         email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
         acceptTerm:[false, Validators.requiredTrue]
      });
  }

  // signup
  onsignUp(){
      if(this.registerForm.valid){
        // phải có .value để lọc đc giá trị truyền vào của form
        // nếu ko có value sẽ không định dạng được dữ liệu truyền vào
          this.service.signup(this.registerForm.value).subscribe({
            next:(res)=>{
              alert('sigup success')
              this.route.navigate(['login'])
              console.log(this.registerForm.value)

            },
            error:(err)=>{

              alert(err.error.message)
              console.log(this.registerForm.value)
            }
          })
      }
  }

  // checkValidEmail(event:string){
  //   const val = event;
  //   const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
  //   this.isValid = pattern.test(val);
  //   return this.isValid;
  // }
}
