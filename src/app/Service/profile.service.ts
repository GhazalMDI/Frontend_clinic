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
  editProfile(data:any):Observable<any>{
    const url = 'http://127.0.0.1:8000/API/Accounts/profile/'
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.patch(url,data,{headers})
  }

  deleteWorkingHour(id: number): Observable<any> {
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    const  url = 'http://127.0.0.1:8000/API/Accounts/profile/'
    return this.http.delete(`${url}?working_hour_id=${id}`,{headers});
  }

  createWorkingHour(data: any): Observable<any>{
    const  url = 'http://127.0.0.1:8000/API/Accounts/profile/'

    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}` // اگر نیاز به احراز هویت دارید
    });

    return this.http.post(`${url}`, data, { headers });
  }
}

