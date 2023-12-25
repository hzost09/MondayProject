import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceService } from './Service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
 private baseUrl:string = "https://localhost:7079/api/Admin/";
//  private baseUrl:string = "https://localhost:7079/api/User/";
constructor(private http:HttpClient) {}


getAlluser(){
  return this.http.get<any>(`${this.baseUrl}Getalluser`);
}

deleteUser(id:number){
  console.log(id)
  return this.http.delete<number>(`${this.baseUrl}delUser/${id}`).subscribe(res => {
    console.log(res)
  });
}
}
