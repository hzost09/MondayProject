import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resetpass } from '../Model/resetpass';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetService {
  private baseUrl:string = "https://localhost:7079/api/User/";
constructor(private http:HttpClient,private rout:Router) { }

sendlink(email:string){
  this.http.post(`${this.baseUrl}sendLink`,email).subscribe((res:any) => {
    console.log(res)
    if(res['statusCode'] == 200){
        alert('da gui mail thanh cong')
    }
  });
}

sendReset(item:resetpass){
  this.http.post<any>(`${this.baseUrl}resetPassword`,item).subscribe({
    next:(res)=>{
      alert('đã thay đổi thành công');
      this.rout.navigate(['login'])
    },
    error:(error)=>{
      alert(error.error.mess)
      console.log(error.error.mess)

    }

  });
}
}
