import { TokenModel } from '../Model/tokenmodel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceService } from './Service.service';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { loginModel } from '../Model/loginModel';
import { changeModel } from '../Model/changeModel';
import { TableModel } from '../Model/TableModel';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

  private dataSubject = new Subject<any>();
  dataObservable = this.dataSubject.asObservable();
  private baseUrl:string = "https://localhost:7079/api/Table/";
constructor(private http:HttpClient,private service:ServiceService,private route:Router) {}

//get
  GetTable(){
  const headers = new HttpHeaders().append('Content-Type','application/json');
  let username:string = this.service.getUserName()
  console.log(username);
  return this.http.get<TableModel>(`${this.baseUrl}Getdata/${username}`,{headers});

}

//create
createTable(object:any){
  let username:string = this.service.getUserName()
  console.log(username);
   this.http.post<any>(`${this.baseUrl}Create/${username}`,object).subscribe(res => {
     console.log(res)
   });
   console.log(object)
}

//update
updateTable(object:any){
   let username:string = this.service.getUserName()
   console.log(username);
    this.http.put<any>(`${this.baseUrl}update/${username}`,object).subscribe(res => {
      console.log(res)
    });
    console.log(object)
  }

//delete
deltable(object:number){
  let username:string = this.service.getUserName()
  console.log(object);
   this.http.delete<any>(`${this.baseUrl}delTable/${username}/${object}`).subscribe(res => {
     console.log(res)
   });
   console.log(object)
}

//kiểm tra để gửi thông báo(thay đổi password)
pushnotification():Observable<any>{
  const name = this.service.getUserName();
  console.log(name);
 return this.http.get<any>(`${this.baseUrl}checkmessage/${name}`)
}

//signout
signout(){
    localStorage.clear();
    this.route.navigate(['/login']);
}

//đổi UserName
changeUserNameandEmail(name:string,email:string){
    const username = this.service.getUserName();
    const obj = new changeModel();
    obj.Email = email;
    obj.UserName = name
    console.log(obj);
   return this.http.put<any>(`${this.baseUrl}NewNameAndEmail/${username}`,obj).subscribe(res =>{
    alert(res.message);
   });
}

}

