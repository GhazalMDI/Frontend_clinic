import { Component } from '@angular/core';
import { ProfileService } from '../Service/profile.service';
import { response } from 'express';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Console, error } from 'console';
import { Router } from '@angular/router';
import { window } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  Accesstoken: string = ''
  information: any[] = []
  DoctorprofileForm!: FormGroup
  ProfileForm!: FormGroup
  WorkingHoursForm!:FormGroup
  EducationForm!:FormGroup
  CertificationForm!:FormGroup
  modalWorkScheduleArray!: any[] 
  is_doctor: Boolean = true;
  image!: String;
  toastMessage!: { message: string; type: 'success' | 'error' };
  isToastVisible!: boolean;
  workSchedule !: []
  empty_hours:boolean= false

  DAYS_MAP: { [key: string]: string } = {
    "5": "شنبه",
    "6": "یکشنبه",
    "0": "دوشنبه",
    "1": "سه‌شنبه",
    "2": "چهارشنبه",
    "3": "پنجشنبه",
    "4": "جمعه"
  };




  constructor(private fb: FormBuilder, private prof: ProfileService, private router: Router) { }



  ngOnInit() {





    this.DoctorprofileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      birthday: [''],
      national_code: [''],
      bio: [''],
      landline_phone: [''],
      medical_license_number: ['']
    })
    this.WorkingHoursForm = this.fb.group({
      workSchedule: this.fb.array([]) // باید مقدار اولیه داده شود
    });

    this.addWorkSchedule();

    this.EducationForm = this.fb.group({
      doctorEducation:this.fb.array([])
    })
  
    this.CertificationForm = this.fb.group({
      doctorCertification:this.fb.array([])
    })


    this.ProfileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      birthday: [''],
      national_code: [''],
    })
    this.showProfile();
  }


  openModal() {
    this.modalWorkScheduleArray = JSON.parse(JSON.stringify(this.workScheduleArray));
  }

  showProfile() {


   
    this.prof.GetProfileData().subscribe(
      (response) => {
        const userData = response.data.user;
        const work_hours = response.data.work_hours;
        const educ = response.data.education;
        const certi = response.data.certificates;

        console.log(work_hours)

        if (response.data.status_doctor == true) {
          this.is_doctor = true
          this.DoctorprofileForm.patchValue({
            first_name: userData.user.first_name,
            last_name: userData.user.last_name,
            birthday: userData.user.birthday,
            national_code: userData.user.national_code,
            bio: userData.bio,
            landline_phone: userData.landline_phone,
            medical_license_number: userData.medical_license_number
          })
          this.image = userData.image

          if (certi.length>0){
            const certi_array = this.CertificationForm.get('doctorCertification') as FormArray;
            certi.forEach((e:any)=>{
              certi_array.push(this.fb.group({
                certificate_name :  new FormControl(e.certificate_name),
                issuing_institution : new FormControl(e.issuing_institution),
                date_issue : new FormControl(e.date_issue),
                expiration_date : new FormControl(e.expiration_date),
                additional_details : new FormControl(e.additional_details)
              }))
            })
          }

          if (educ.length>0){
            const education_array = this.EducationForm.get('doctorEducation') as FormArray;
            educ.forEach((e:any)=>{
              education_array.push(this.fb.group({
                field : new FormControl(e.academic_field['name']),
                country : new FormControl(e.country),
                university : new FormControl(e.university),
                graduation_year : new FormControl(e.graduation_year)
              }))
            })
          }


          if (work_hours.length > 0) {
            const workScheduleArray = this.WorkingHoursForm.get('workSchedule') as FormArray; 

            work_hours.forEach((wh:any) => {
              workScheduleArray.push(this.fb.group({
                id: new FormControl(wh.id),
                day: new FormControl(this.DAYS_MAP[wh.day] || "نامشخص"),
                start_time: new FormControl(wh.start_time),
                end_time: new FormControl(wh.end_time)
              }));
              


            });


        }
      }
        else if (response.data.status_doctor == false) {
          console.log('the user')
          console.log(response.data.status_doctor)

          this.is_doctor = false
          this.ProfileForm.patchValue({
            first_name: userData.first_name,
            last_name: userData.last_name,
            birthday: userData.birthday,
            national_code: userData.national_code,
          })

        }
        this.information = this.information = Array.isArray(response.data) ? response.data : [response.data];
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    )
  }

  get workScheduleArray(): FormArray {
    return this.WorkingHoursForm.get('workSchedule') as FormArray;
  }

  get education_array():FormArray{
    return this.EducationForm.get('doctorEducation') as FormArray
  }

  get certi_array():FormArray{
    return this.CertificationForm.get('doctorCertification') as FormArray
  }


  removeSchedule(index: number) {
    console.log('Current workScheduleArray:', this.workScheduleArray.value);
    console.log('Trying to remove index:', index);
  
    if (!this.workScheduleArray || index < 0 || index >= this.workScheduleArray.length) {
      console.error('Invalid index:', index);
      return;
    }
  
    const schedule = this.workScheduleArray.at(index);
    if (!schedule) {
      console.error('Schedule not found at index:', index);
      return;
    }
  
    const id = schedule.value?.id; // بررسی مقدار id
    console.log('Schedule to be deleted:', schedule.value);
    if (id !== undefined && id !== null) {
      console.log('Deleting record with ID:', id);
      this.prof.deleteWorkingHour(id).subscribe(() => {
        this.workScheduleArray.removeAt(index);
        if (this.workScheduleArray.length < 0){
          this.empty_hours = true;
        }

      }, error => {
        alert('خطا در حذف رکورد');
      });
    } else {
      console.log('Removing unsaved record at index:', index);
      this.workScheduleArray.removeAt(index);
    }
  }
  

  editProfile() {
    const formData = this.is_doctor ? this.DoctorprofileForm.value : this.ProfileForm.value;
    this.prof.editProfile(formData).subscribe(
      (response) => {
        console.log('profile updated successfuly', response);
        this.showToast('اطلاعات شما با موفقیت ذخیره شد', 'success');
      },
      (error) => {
        console.log('Error updating', error);
        this.showToast('خطا در ذخیره تغییرات رخ داده است، لطفاً دوباره تلاش کنید.', 'error'); // نمایش پیام خطا
      }
    )
  }


  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = { message, type }; // تنظیم پیام و نوع آن
    this.isToastVisible = true;
    if (type == "success") {
      setTimeout(() => {
        this.isToastVisible = false; // حذف پیام بعد از 5 ثانیه
        // window.location.reload();
      }, 3000);
    }


    else {
      setTimeout(() => {
        this.isToastVisible = false; // حذف پیام بعد از 5 ثانیه
      }, 5000);
    }

  }
  submitWokingForm(){
    if (this.WorkingHoursForm.valid) {
      console.log(this.WorkingHoursForm.value.workSchedule)
      const payload = {
        work_hours: this.WorkingHoursForm.value.workSchedule
      };

      
      // console.log(payload)
      // console.log("🔍 داده‌های ارسالی به بک‌اند:", JSON.stringify(payload, null, 2));



      this.prof.createWorkingHour(payload).subscribe(
        response => {
          console.log('داده‌ها با موفقیت ارسال شدند', response);
        },
        error => {
          console.error('خطا در ارسال داده‌ها', error);
        }
      );
    } else {
      console.error('فرم نامعتبر است');
    }
  }

  addWorkSchedule(){
    const newWorkSchedule = this.fb.group({
      day: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });
  
    this.workScheduleArray.push(newWorkSchedule);
  }

  workHour = {
    day: '',
    start_time: '',
    end_time: ''
  };


  onSubmit(){
    console.log(this.workHour)

    this.prof.createWorkingHour(this.workHour)
      .subscribe(
        (response) => {
          console.log('داده‌ها با موفقیت ارسال شدند:', response);
          alert('داده‌ها با موفقیت ارسال شدند');
        },
        (error) => {
          console.error('خطا در ارسال داده‌ها:', error);
          alert('خطا در ارسال داده‌ها');
        }
      );
  }

  onSubmit1(){
    // const workScheduleData = this.WorkingHoursForm.get('workSchedule').value;
    // const newEntries = workScheduleData.filter(item => !item.id);
    // const formData = this.WorkingHoursForm.value;
    const formData: { workSchedule: { id?: number }[] } = this.WorkingHoursForm.value;
    console.log(formData)

    const newSchedules = formData.workSchedule.filter(schedule => !schedule.id); // فیلتر داده‌های بدون id
    console.log(newSchedules)


    // if (this.WorkingHoursForm.invalid) {
    //   alert('لطفاً تمام فیلدها را پر کنید!');
    //   return;
    // }
    this.prof.createWorkingHour(newSchedules).subscribe(
      (response) => {
        console.log('داده‌ها ارسال شدند:', response);
        alert('ساعات کاری با موفقیت ثبت شدند');
        // this.WorkingHoursForm.reset();  // فرم را پاک کن
        // this.workScheduleArray.clear(); // لیست را خالی کن
        this.addWorkSchedule();  // یک ورودی جدید ایجاد کن
      },
      (error) => {
        console.error('خطا در ارسال داده‌ها:', error);
        alert('خطایی رخ داد');
      }
    );
  }


  workSchedules1: any[] = [{ day: '', start_time: '', end_time: '' }]; // شروع با یک سطر
  addRow() {
    this.workSchedules1.push({ day: '', start_time: '', end_time: '' });
  }

  submitAll() {
    // if (this.workSchedules1.some(schedule => !schedule.day || !schedule.start_time || !schedule.end_time)) {
    //   alert('لطفاً تمام فیلدها را پر کنید.');
    //   return;
    // }
    console.log(this.workSchedules1)
    this.prof.createWorkingHour(this.workSchedules1).subscribe(
      response => {
        console.log('داده‌ها ارسال شد:', response);
        alert('ساعات کاری با موفقیت ثبت شدند.');
        this.workSchedules1 = [{ day: '', start_time: '', end_time: '' }]; // پاک کردن فرم بعد از ثبت
      },
      error => {
        console.error('خطا در ارسال داده‌ها:', error);
        alert('خطایی رخ داده است.');
      }
    );
  }
}




    


    

