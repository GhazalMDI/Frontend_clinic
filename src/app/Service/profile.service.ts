import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http:HttpClient,private authService:AuthService) { }


  GetProfileData():Observable<any>{
    const url =  'http://127.0.0.1:8000/API/Accounts/profile/'
    let accessToken = this.authService.getAccessToken()
    console.log('you is profile service')
    console.log(accessToken)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    console.log(headers)
    return this.http.get(url,{headers})

  }
}

