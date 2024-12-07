import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base_url = 'http://127.0.0.1:8000/API/Accounts'

  // http://127.0.0.1:8000/API/Accounts/register/

  constructor(private http:HttpClient) { }

  register(phone_number:string): Observable<any>{
    const url = `${this.base_url}/register/`;
    return this.http.post(url,{phone_number:phone_number});
  }


  
   verifyRegister(tempToken:string,code:string):Observable<any>{
    const url = `${this.base_url}/verify/register/`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${tempToken}`
    });
    console.log(headers)
    return this.http.post(url,{code},{headers});
   }

   


}
