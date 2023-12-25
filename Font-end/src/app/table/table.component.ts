
import { Observable, switchMap, tap, pipe, Subject, Subscriber } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {TableModel } from '../Model/TableModel';
import { TableServiceService } from '../service/TableService.service';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { TokenModel } from '../Model/tokenmodel';
import { ServiceService } from '../service/Service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SearchservicePipe } from '../service/searchservice.pipe';
import { SignalRService } from '../service/SignalR.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{

  //for table modify
  public p:number = 1;
  public bton:boolean = false;
  public hideSoTT:boolean = false;
  public user:TableModel[] = [];
  public test:TableModel = new TableModel;
  public Datecheck:boolean = true;
  selectoption2:string = 'done';
  selectoption:string = 'on-going'
  alltoken!:TokenModel;
  public sreachName = '';
  addnewbtn:boolean = false;

  //cho thay đổi email và name
  public isFormshow:boolean = false;
  public inputEmail!:string;
  public inputName!:string;
  public checkdirtyEmail:boolean = false;
  public checkdirtyName:boolean = false;
  public checkvalidateEmail!:boolean;
  public checkvalidateName!:boolean;


    constructor(private service:TableServiceService,private auth:ServiceService, private route:Router,private sreachpipe:SearchservicePipe,private hub:SignalRService) {


    }
  async ngOnInit(): Promise<void> {
    //---for tracking user on/off---//
    await this.hub.connection.start().then(()=>{
      console.log("connected");
     }).catch(err =>{
      console.log(err);
     })
    const roomName = "test";
    const user =  this.auth.getUserName();
   this.hub.joinRoom(user,roomName).then( ()=>{
    console.log('ket noi vao room');
    this.hub.connection.on('recivemess',(message:string)=>{
      console.log(message);
    })
    }).catch( async err => {
      if(err){
        const roomName = "test";
         const user =  this.auth.getUserName();
        await this.hub.joinRoom(user,roomName)

      }
      console.log(err);
    });
//--end tracking --//
    this.getAll();
}

    // thêm dòng
    addFeild(){
        let newField = new TableModel();
        this.user.push(newField);
        this.bton = true
    }
    //nut edit
    onEdit(item:any){
    this.user.forEach(e => {
          e.isEdit = false
      });
        item.isEdit = true;
    }
    //nút Cancel
    Cancel(item:any){
      item.isEdit = false;
      window.location.reload();
    }
   //nut save + APIcreate
    Create(item:any){
      if(item.Task == '' && item.Note == '' && item.Status == ''){
        alert('điền thông tin');
        return;
      }
      if(item.DateEnd <= item.Datebegin){
        alert('dateEnd > dateBegin')
        return;
      }
      else {
        alert('table create')
        this.service.createTable(item);
      }
    return this.getAll();
    }



//APIgetall
    async getAll(){
     return await this.service.GetTable().subscribe((data:any)=> {
        this.user = data;
        if(this.user == null){
          return;
        }
        this.user.forEach((item:TableModel) => {
          const today = new Date();
          today.setHours(0,0,0,0)
         const test = new Date( item.DateEnd);
         test.setHours(0,0,0,0);
          if(test <= today){
            console.log(test);
               item.ishighlight = true;

          }
          else{
            console.log(test);
           item.ishighlight = false;
          }

        });
      })
    }

    //APIupdate
    Update(items:TableModel){
      if(items.DateEnd <= items.Datebegin){
        alert('dateEnd > dateBegin')
        return;
      }
      this.service.updateTable(items);
      console.log(items)
      alert('success')
    return  this.getAll();
    }

    //APIdelete
    delTable(item:number){
      console.log(item);
      this.service.deltable(item);
      this.getAll();
    }

    // logout
    Logout(){
      this.hub.leavechat().then(()=>{
        console.log('leaved');
      }).catch(err => {
        console.log(err);
      });
      this.service.signout();
    }
    //kiem tra ngay nhap
    validateDate(event:any){
      const today = new Date();
      console.log(typeof event)
      today.setHours(0,0,0,0);
      if(event < today.toISOString()){
        event = new Date();
        this.Datecheck = false;
        alert('date >= now');
      }
      else{
        this.Datecheck = true;
      }
      console.log(event)
      return event
}
//searching
searching(item:any[],searchtext:string){

  return this.sreachpipe.transform(item,searchtext);
}

//-----for change email/pass---//
showForm(){
  this.isFormshow = !this.isFormshow;
}

//change username + email
checkvalidName(event:string){
  const val = event;
  console.log(val);
  if(val.length <= 0){
      this.checkvalidateName = false;
  }
  else{
    this.checkvalidateName = true;
  }
}
//check valid mail
checkValidEmail(event:string){
  const val = event;
  const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if(val.length<=0){
    this.checkvalidateEmail = false;
  }
  else if(!pattern.test(val)){
    this.checkvalidateEmail = false;
  }
  else{
    this.checkvalidateEmail = true;
  }
  }

  //
  UserNameAndEmail(){
      if(this.checkvalidateEmail != true && this.checkvalidateName != true){
          alert('yêu cầu nhập email và tên')
          return;
      }
      else{
        this.service.changeUserNameandEmail(this.inputName,this.inputEmail);

      }
  }
//---------------------

}
