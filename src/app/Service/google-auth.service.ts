import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare const google: any;


@Injectable({
  providedIn: 'root',
})

export class GoogleAuthService {
  private clientId = '971156426829-l5np1sfkm6hbu3ku2i1glbia08t0udte.apps.googleusercontent.com'; // جایگزین کنید با Client ID که از گوگل دریافت کرده‌اید

  constructor(private http:HttpClient) {}

  initializeGoogleSignIn(onSuccess: (token: string) => void): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        const token = response.credential; // توکن گوگل
        this.sendTokenToBackend(token).subscribe((res) => {
          console.log('Response from backend:', res);
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
