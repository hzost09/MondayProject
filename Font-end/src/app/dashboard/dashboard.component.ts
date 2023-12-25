import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ServiceService } from '../service/Service.service';
import { AdminServiceService } from '../service/adminService.service';
import { TokenModel } from '../Model/tokenmodel';
import { catchError, throwError, Subscriber, Subscription, filter } from 'rxjs';
import { SearchservicePipe } from '../service/searchservice.pipe';
import { SignalRService } from '../service/SignalR.service';
import { TableModel } from '../Model/TableModel';
import { UserModel } from '../Model/UserModels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
@HostListener('window:beforeunload', ['$event'])
export class DashboardComponent implements OnInit {

  public sreachName = '';
  public p:number = 1;
  public tables:TableModel[] = [];
  public users:UserModel[] = [];

  //for tracking user on/off
  public list:string[]=[];
  public mess:string = 'null';

  constructor(private adminservice:AdminServiceService,private route:Router,private sreachpipe:SearchservicePipe,private hub:SignalRService,private service:ServiceService,
    private cd:ChangeDetectorRef
    ) {

  }
  async ngOnInit(){
  //---tracking user on/off---//
 await this.hub.connection.start().then(()=>{
  console.log("connected");
  this.sendList();
  this.cd.detectChanges();
 }).catch(err =>{
  console.log(err);
 });
  const roomName = "test";
  const user =  this.service.getUserName();
 this.hub.joinRoom(user,roomName).then( ()=>{
  console.log('ket noi vao room');
  this.sendList();
  }).catch( async err => {
    if(err){
      const roomName = "test";
       const user =  this.service.getUserName();
      await this.hub.joinRoom(user,roomName)
    }
    console.log(err);
  });

//-------end of tracking----//
   this.GetAll();

}


//getuser
GetAll(){
  this.adminservice.getAlluser().subscribe(res => {
    this.users = res;
    this.cd.detectChanges();
  });
  return this.users;
}

//delete
delUser(item:any){
if(window.confirm('delete User?')){
  this.adminservice.deleteUser(item)
}
else{
  console.log('deny delete')
}
}

//searching
searchingName(item:any[],searchtext:string){
  return this.sreachpipe.transform(item,searchtext);
}

//logout
loggingOut(){
    localStorage.clear();
    this.hub.leavechat().then(()=>{
      console.log('leaved');
    }).catch(err => {
      console.log(err);
    });
    this.route.navigate(['/login'])
  }

  //tracking user on/off
  //take list user connect
  public async  sendList(){
    return await this.hub.connection.on('recivelist',(thelist:string[])=>{
      this.list = thelist;
      this.cd.detectChanges();
    });
  }

  //making symbol for admin to know
  lap(mess:string){
    this.users.forEach(e => {
        if(this.list.includes(e.userName)){
         e.onOFF = "Active"
        }
        else{
          e.onOFF = "NON"
        }
    });
    return mess;
  }


}
