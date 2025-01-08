import { Component } from '@angular/core';
import { ProfileService } from '../Service/profile.service';
import { response } from 'express';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
Accesstoken:string=''
information : any[] = []
DoctorprofileForm!:FormGroup
ProfileForm!:FormGroup
is_doctor:Boolean=true;
image!:String;

 constructor(private fb:FormBuilder, private prof:ProfileService){}

  ngOnInit(){
    this.DoctorprofileForm = this.fb.group({
      first_name:[''],
      last_name:[''],
      birthday:[''],
      national_code:[''],
      bio:[''],
      landline_phone:[''],
      medical_license_number:['']

    })
    this.ProfileForm = this.fb.group({
      first_name:[''],
      last_name:[''],
      birthday:[''],
      national_code:[''],
    })
    this.showProfile();
  }

 showProfile(){
  this.prof.GetProfileData().subscribe(
    (response)=>{
      console.log(response.data)
      const userData = response.data.user;
      if (response.data.status_doctor == true) {
        this.is_doctor = true
        this.DoctorprofileForm.patchValue({
          first_name:userData.user.first_name,
          last_name:userData.user.last_name,
          birthday:userData.user.birthday,
          national_code:userData.user.national_code,
          bio:userData.bio,
          landline_phone:userData.landline_phone,
          medical_license_number:userData.medical_license_number
        })
        this.image = userData.image
      }
      else if (response.data.status_doctor == false){
        console.log('the user')
        console.log(response.data.status_doctor)

        this.is_doctor = false
        this.ProfileForm.patchValue({
          first_name:userData.first_name,
          last_name:userData.last_name,
          birthday:userData.birthday,
          national_code:userData.national_code,
        })

      }
      this.information = this.information = Array.isArray(response.data) ? response.data : [response.data];

    },
    (error) => {
      console.error('Error occurred:', error);
    }
  )
 }

 editProfile(){
  alert('hiiii')
  const formData = this.is_doctor ? this.DoctorprofileForm.value : this.ProfileForm.value;
  this.prof.editProfile(formData).subscribe(
    (response)=>{
      console.log('profile updated successfuly',response);
    },
    (error)=>{
      console.log('Error updating',error);
    }
  )
 }

}
