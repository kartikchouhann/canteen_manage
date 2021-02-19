import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  public orders: any[];
  public errorMessage: any;
  public styl: any;
  public empty: any = false;
  constructor(private authService: AuthService, private router: Router, private webSocketService: WebsocketService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.check()
    this.getOrder();

    this.webSocketService.listen('neworderplaced').subscribe(
      (data) => {
        this.getOrder();
      }
    )
    this.webSocketService.listen('orderdelete').subscribe(
      (data) => {
        this.getOrder();
      }
    )
  }


getOrder() {
  this.adminService.getAllOrder().subscribe(
    data => {
      if (data['msg']) {
        this.orders = data['msg'];
        if (this.orders.length == 0) {
          this.empty = true;
        }
        // console.log(this.orders);
      }
      if (data['errormsg']) {
        this.setMessage(data['errormsg'], "#f04747");
      }
    },
    (error) => {

      if (error instanceof HttpErrorResponse) {
        this.authService.logoutUser();
        this.router.navigate(['/error'])
      }
      console.log(error);
    }
  )
}

check() {
  this.authService.check().subscribe(
    data => {
      console.log(data);
    },
    (error) => {
      if (error instanceof HttpErrorResponse) {
        this.authService.logoutUser();
        this.router.navigate(['/error'])
      }
      console.log(error);
    }
  )
}
setMessage(msg: any, color: any) {
  this.errorMessage = msg;
  this.styl = {
    backgroundColor: color,
  }
  setTimeout(() => {
    this.errorMessage = null;
  }, 4000);
}

changeStatus(newstatus, item) {
  console.log(item.useremail);
  this.adminService.updateOrderstatus({ id: item._id, status: newstatus,email:item.useremail }).subscribe(
    data => {
      if (data['msg']) {
        this.setMessage(data['msg'], "#43b581");
        this.getOrder();
      }
      if (data['errormsg']) {
        this.setMessage(data['errormsg'], "#f04747");
      }
    },
    (error) => {

      if (error instanceof HttpErrorResponse) {
        this.authService.logoutUser();
        this.router.navigate(['/error'])
      }
      console.log(error);
    }
  )
}

deleteorder(item){
  this.adminService.deleteOrder(item._id).subscribe(
    data => {
      if (data['msg']) {
        this.setMessage(data['msg'], "#f04747");
        this.getOrder();
      }
      if (data['errormsg']) {
        this.setMessage(data['errormsg'], "#f04747");
      }
    },
    (error) => {

      if (error instanceof HttpErrorResponse) {
        this.authService.logoutUser();
        this.router.navigate(['/error'])
      }
      console.log(error);
    }
  )
}

vieworder(item)
{

  this.adminService.setOrderid(item._id);
  this.router.navigate(['/admin/vieworder'])

}

viewuser(item)
{
  this.adminService.setUserid(item.userid);
  this.router.navigate(['/admin/viewuser'])
}
}
