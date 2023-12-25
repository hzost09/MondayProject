import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtHelperService} from  '@auth0/angular-jwt';
import { TokenModel } from '../Model/tokenmodel';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private Playload:any;

private baseUrl:string = "https://localhost:7079/api/User/";

constructor(private http:HttpClient,private jwt:JwtHelperService,private router:Router) {

 }

//tạo method kiểm tra người dùng login để sử dụng cho router guard trong adminguard floder
isLogIn():boolean{
  // nếu người dùng đăng nhập rồi sẽ tồn tại token
  return !!localStorage.getItem('Token');
}

  //test2
Login(userobj:any){
  return this.http.post<any>(`${this.baseUrl}login`,userobj);
}

signup(signupobj:any){
  console.log(signupobj)
  return this.http.post<any>(`${this.baseUrl}register`,signupobj);
}

//method để lưu token khi method đc gọi
// lưu token
StoreToken(tokenvalue:string){
  localStorage.setItem('Token',tokenvalue);
}
StoreRefreshtoken(tokenvalue:string){
  localStorage.setItem('refreshToken',tokenvalue)
}

//method cho lấy token
GetToken(){
    return localStorage.getItem('Token');
}
GetRefreshToken(){
  return localStorage.getItem('refreshToken');
}

// send token kiểm tra hết hạn hay chưa
sendtoken(token:TokenModel){
  console.log("ok");
  return this.http.post<any>(`${this.baseUrl}checktoken`,token)
}




// token decode + get role từ token
decodedToken(){
  const jwtHelper = new JwtHelperService();
   const Thetoken = this.GetToken()!;
    return jwtHelper.decodeToken(Thetoken);
  }
// lấy username từ token
 getUserName(){
  this.Playload = this.decodedToken();
  if(this.Playload)
      return  this.Playload.unique_name;
}
// lấy role từ token
getRole(){
  this.Playload = this.decodedToken();
  if(this.Playload)
  return this.Playload.role;
}
// lấy thời gian hết hạn jwt
getEndtime(){
  this.Playload = this.decodedToken();
  if(this.Playload.exp === undefined){
    return;
  }
  else{
    const datejwt = new Date(this.Playload.exp);
    datejwt.setHours(0,0,0,0);
  return datejwt;
  }
}
}

