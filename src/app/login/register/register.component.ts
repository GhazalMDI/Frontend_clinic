import { Component } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
[x: string]: any;
is_send : boolean=false;
phone_number:string = ''
otp_code:string = ''
tempToken:string = ''
message:string = ''


constructor(private authSerice:AuthService,private router: Router,private http:HttpClient,private socialservice:SocialAuthService){}


signInWithGoogle():void{
  console.log('hiii')
  this.socialservice.signIn(GoogleLoginProvider.PROVIDER_ID).then((user:SocialUser)=>{
    console.log('hiiiiii')
    console.log(user);
    this.http.post('http://127.0.0.1:8000/API/Accounts/GoogleLogin/',{token:user.idToken}).subscribe((response:any)=>{
      console.log(response)
      this.authSerice.setToken(response.tokens.access,response.tokens.refresh)
      this.router.navigate(['']);
    })
  })
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
}
