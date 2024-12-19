import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare const google: any;


@Injectable({
  providedIn: 'root',
})

export class GoogleAuthService {
  private clientId = '971156426829-l5np1sfkm6hbu3ku2i1glbia08t0udte.apps.googleusercontent.com'; // جایگزین کنید با Client ID که از گوگل دریافت کرده‌اید

  constructor(private http:HttpClient,private router:Router) {}

  initializeGoogleSignIn(onSuccess: (token: string) => void): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        const token = response.credential; // توکن گوگل
        this.sendTokenToBackend(token).subscribe({
          next: (res: any) => {
            console.log('Response from backend:', res);
            const accessToken = res.tokens?.access;
            const refreshToken = res.tokens?.refresh;
              if (accessToken && refreshToken) {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              console.log('Tokens stored successfully');
              this.router.navigate([''])
            } else {
              console.error('Access or Refresh token not found in response');
            }
          },
          error: (err) => {
            console.error('Error sending token to backend:', err);
          },
        });
      },
    });
  

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
  }


  sendTokenToBackend(token: string) {
    return this.http.post('http://127.0.0.1:8000/API/Accounts/GoogleLogin/', { token });
  }
}
