import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public avail: boolean = false;
  public msg: string = "";
  private baseUri: string = "http://localhost:3000/admin/";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient, private router: Router) { }

  addfood(body: any) {
    return this.http.post(this.baseUri + "addfood", body);
  }

  getAllFood() {
    return this.http.get(this.baseUri + "getallfooditem", { headers: this.headers });
  }
}