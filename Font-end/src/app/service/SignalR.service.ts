import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
public connection:signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl('https://localhost:7079/hub').configureLogging(signalR.LogLevel.Information).build();

// public messages:any[] = [];
// public user:string[]=[];

constructor() {

}

  // start connection
  // public async starting(){
  //   try{
  //     await this.connection.start().then(()=>{
  //       this.sendmess();
  //       this.sendList();
  //       console.log("connected");
  //     }).catch(err =>{
  //       console.log(err);
  //     });

  //   }
  //   catch(err){
  //     console.log(err);
  //     setTimeout(() => {
  //       this.starting();
  //     }, 50000);
  //   }
  // }
//
test(){
  this.connection.on("recivemess",(message:string)=>{
    console.log( message);
  })
}


  //join the room
  public async joinRoom(user:string,roomName:string){
  return await this.connection.invoke("joinRoom",{user,roomName});

  }
  //send message
  public async sendmess(){
    return await this.connection.on('recivemessage',(message:string,date:string)=>{

        console.log(message);
        console.log(date);
    });
  }
  public async sendList(){
    return await this.connection.on('recivelist',(list:string[])=>{
    console.log(list);
    });
  }
  // leave chat
  public async leavechat(){
    return await this.connection.stop();
  }


}


