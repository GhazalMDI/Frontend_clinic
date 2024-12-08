import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm } from '@angular/forms'
import { AuthService } from './Service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  constructor(public authService:AuthService,private router:Router,private http:HttpClient){}
 
  logOut(): void {
    const refreshToken = this.authService.getRefreshToken();
    console.log(refreshToken);
  
    // اگر توکن موجود نبود، به صفحه ورود هدایت می‌شود
    if (!refreshToken) {
      this.router.navigate(['/loginRegister']);
      return;
    }
  
    // ارسال درخواست خروج به سرور
    this.http.post('http://127.0.0.1:8000/API/Accounts/logout/', { refresh_token: refreshToken })
      .subscribe(
        (response) => {
          console.log('Logout successful', response);
          // پاک کردن توکن‌ها پس از موفقیت آمیز بودن خروج
          this.authService.clearToken(); // پاک کردن accessToken از localStorage
          this.router.navigate(['/loginRegister']); // هدایت به صفحه ورود
        },
        (error) => {
          console.error('Logout failed', error);
        }
      );
  }
  

 
}

