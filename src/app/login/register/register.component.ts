import { Component } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { error } from 'console';
import { response } from 'express';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
is_send : boolean=false;
phone_number:string = ''
otp_code:string = ''
tempToken:string = ''
message:string = ''


constructor(private authSerice:AuthService){}
onRegister(){
 
  this.authSerice.register(this.phone_number).subscribe(
    (response) =>{
      this.is_send = true
      this.tempToken = response.temp_token;
      this.message = response.message;
      console.log(this.message)
      console.log(this.tempToken)
    },
    (error)=>{
      this.message = error.error.message || 'خطایی رخ داده است'
    }
  )
}

// onVerifyRegister(){
//   this.authSerice.verifyRegister(this.tempToken,this.otp_code).subscribe(
//     // console.log('tempToken:', this.tempToken);

//     (response)=>{
//     console.log('the token is currect')
//      console.log(response.token)
//       this.message = response.message;
//     },
//     (error) => {
//       this.message = error.error.message || 'خطایی رخ داده است';
//     }
//   )
// }


onVerifyRegister() {
  console.log('tempToken:', this.tempToken);

  this.authSerice.verifyRegister(this.tempToken, this.otp_code).subscribe(
    // (response)=>{
    //   console.log(response.token)

    // }
    (response) => {
      console.log('Verification successful');
      console.log('Received token:', response.token);
      this.message = response.message;
    },
    (error) => {
      console.error('Verification failed:', error);
      this.message = error.error.message || 'خطایی رخ داده است';
    }
  );
}
}
