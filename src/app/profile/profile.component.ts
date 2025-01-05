import { Component } from '@angular/core';
import { ProfileService } from '../Service/profile.service';
import { response } from 'express';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
Accesstoken:string=''
information : any[] = []


 constructor( private prof:ProfileService){}

 showProfile(){
  console.log('you is here')
  this.prof.GetProfileData().subscribe(
    (response)=>{
      console.log(response.data)
      this.information = this.information = Array.isArray(response.data) ? response.data : [response.data];
      console.log(response)
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  )
 }

}
