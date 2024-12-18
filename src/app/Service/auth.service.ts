import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base_url = 'http://127.0.0.1:8000/API/Accounts'
  private isLoggedIn = false;



  constructor(private http:HttpClient) { }


  setToken(access: string,refresh:string): void {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken',refresh)
    this.isLoggedIn = true;
  }
  clearToken():void{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedIn = false;
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  

  register(phone_number:string): Observable<any>{
    const url = `${this.base_url}/register/`;
    return this.http.post(url,{phone_number:phone_number});
  }

  sendToken(token:string):Observable<any>{
    const url = 'http://127.0.0.1:8000/API/Accounts/GoogleLogin/'
    return this.http.post(url,{token:token})
  }


  
   verifyRegister(tempToken:string,code:string):Observable<any>{
    const url = `${this.base_url}/verify/register/`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${tempToken}`
    });
    return this.http.post(url,{code},{headers});
   }

  isUserLoggedIn(): boolean {
   return !!localStorage.getItem('accessToken')
  }

  login(): void {
    this.isLoggedIn = true;
  }

  // خروج کاربر
  logout(): void {
    this.clearToken()
    this.isLoggedIn = false;
  }

   


}
