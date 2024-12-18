import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { OAuthService } from 'angular-oauth2-oidc';
import { GoogleAuthService } from '../../Service/google-auth.service';
// import { authConfig } from '../../auth.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit {
[x: string]: any;
is_send : boolean=false;
phone_number:string = ''
otp_code:string = ''
tempToken:string = ''
message:string = ''


constructor(private authSerice:AuthService,private router: Router,private http:HttpClient,private googleAuthService: GoogleAuthService){
}

ngAfterViewInit(): void {
  this.googleAuthService.initializeGoogleSignIn((token) => {
    console.log('Google Token:', token);
    this.sendTokenToBackend(token);
  });
}

sendTokenToBackend(token: string): void {
  this.authSerice.sendToken(token).subscribe(
      (response) => {
        console.log('Backend Response:', response);
        this.message = 'ورود با موفقیت انجام شد!';
        this.authSerice.setToken(response.tokens.access,response.tokens.refresh);
        console.log(response.tokens.access)
        console.log(response.tokens.refresh)
        this.router.navigate([''])
      },
      (error) => {
        console.error('Error:', error);
        this.message = 'مشکلی در ورود با گوگل پیش آمد.';
      }
    );
}

onVerifyRegister() {

  this.authSerice.verifyRegister(this.tempToken, this.otp_code).subscribe(
    (response) => {
      this.message = response.message;
      this.authSerice.setToken(response.tokens.access,response.tokens.refresh);
      console.log(response.tokens.access)
      console.log(response.tokens.refresh)

      this.router.navigate(['']);
      this.authSerice.login()

    },
    (error) => {
      console.error('Verification failed:', error);
      this.message = error.error.message || 'خطایی رخ داده است';
    }
  );
}


goToLoginRegister() {
  this.router.navigate(['/loginRegister']);
}

onRegister(){
 
  this.authSerice.register(this.phone_number).subscribe(
    (response) =>{
      this.is_send = true
      this.tempToken = response.temp_token;
      this.message = response.message;
    },
    (error)=>{
      this.message = error.error.message || 'خطایی رخ داده است'
    }
  )
}


}
