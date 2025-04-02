import { ChangeDetectorRef, Component } from '@angular/core';
import { ProfileService } from '../Service/profile.service';
import { response } from 'express';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
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
  WorkingHoursForm!: FormGroup
  EducationForm!: FormGroup
  EditEducationForm!:FormGroup
  CertificationForm!: FormGroup
  academic_fields:{name:string,id:number}[] = []
  modalWorkScheduleArray!: any[]
  is_doctor: Boolean = true;
  image!: String;
  toastMessage!: { message: string; type: 'success' | 'error' };
  isToastVisible!: boolean;
  educationId !: number 
  workSchedule !: []
  empty_hours: boolean = false
  waiting_delete: boolean = false
  maxFileSize = 150 * 1024; // 150KB (حداکثر حجم مجاز برای آپلود)
  maxUploadSize = 10 * 1024 * 1024; // 10MB (حداکثر حجم مجاز برای فشرده‌سازی)

  DAYS_MAP: { [key: string]: string } = {
    "5": "شنبه",
    "6": "یکشنبه",
    "0": "دوشنبه",
    "1": "سه‌شنبه",
    "2": "چهارشنبه",
    "3": "پنجشنبه",
    "4": "جمعه"
  };

  contries: { value: string; display: string }[] = [];
  univercities: { name: string; country: string }[] = [];
  filteredUniversities: { name: string }[] = [];
  selectedCountry: string = '';

  constructor(private fb: FormBuilder, private prof: ProfileService, private router: Router, private cd: ChangeDetectorRef) { }



  onCountryChange(edu: any): void {
    console.log('Selected Country:', edu.country);
  
    // استخراج نام انگلیسی کشور از فرمت "نیوزیلند (New Zealand)"
    const match = edu.country.match(/\(([^)]+)\)/);
    const englishName = match ? match[1] : edu.country.trim();
  
    console.log('Extracted English Country Name:', englishName);
  
    // فیلتر کردن دانشگاه‌ها بر اساس کشور انتخاب شده
    this.filteredUniversities = this.univercities.filter(
      (uni) => uni.country.trim().toLowerCase() === englishName.toLowerCase()
    );
  }


  ngOnInit() {

 this.EditEducationForm = this.fb.group({
      country: [''],
      univercity: [''],
      graduation_year: [''],
      academic_field: [''],
      educationId:['']
    });
    

    this.prof.getCountries().subscribe((data) => {
      this.contries = data
    })
    this.prof.getUniversities().subscribe((data) => {
      this.univercities = data
    })



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


    this.EducationForm = this.fb.group({
      doctorEducation: this.fb.array([])
    })

    this.CertificationForm = this.fb.group({
      doctorCertification: this.fb.array([])
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
        console.log("Response Data: ", response.data);


        const userData = response.data.user;
        const work_hours = response.data.work_hours;
        const educ = response.data.education;
        const certi = response.data.certificates;
        this.academic_fields = response.data.academic_field
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

          if (certi.length > 0) {
            const certi_array = this.CertificationForm.get('doctorCertification') as FormArray;
            certi.forEach((e: any) => {
              certi_array.push(this.fb.group({
                certificate_name: new FormControl(e.certificate_name),
                issuing_institution: new FormControl(e.issuing_institution),
                date_issue: new FormControl(e.date_issue),
                expiration_date: new FormControl(e.expiration_date),
                additional_details: new FormControl(e.additional_details)
              }))
            })
          }
          if (educ.length > 0) {
            const education_array = this.EducationForm.get('doctorEducation') as FormArray;
            educ.forEach((e: any) => {
              education_array.push(this.fb.group({
                id:new FormControl(e.id),
                academic_field: new FormControl(e.academic_field?.name || ''), // مقدار مستقیم
                country: new FormControl(e.country),
                university: new FormControl(e.university),
                graduation_year: new FormControl(e.graduation_year)
              }));
            });
          }
        
          if (work_hours.length > 0) {
            const workScheduleArray = this.WorkingHoursForm.get('workSchedule') as FormArray;
            work_hours.forEach((wh: any) => {
              console.log(wh.delete_record)

              workScheduleArray.push(this.fb.group({
                id: new FormControl(wh.id),
                day: new FormControl(this.DAYS_MAP[wh.day] || "نامشخص"),
                start_time: new FormControl(wh.start_time),
                end_time: new FormControl(wh.end_time)
              }));


              if (wh.delete_record === 'WAITING') {
                this.waiting_delete = true;
              }
              else if (wh.delete_record === 'ACCEPTED' || wh.delete_record === 'NOT_ACCEPTED') {
                this.waiting_delete = false;
              }
            });
          }
        }
        else if (response.data.status_doctor == false) {
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

  get education_array(): FormArray {
    return this.EducationForm.get('doctorEducation') as FormArray
  }

  get certi_array(): FormArray {
    return this.CertificationForm.get('doctorCertification') as FormArray
  }

  removeSchedule(index: number) {
    if (!this.workScheduleArray || index < 0 || index >= this.workScheduleArray.length) {
      console.error('Invalid index:', index);
      return;
    }

    const schedule = this.workScheduleArray.at(index);
    console.log(schedule)
    if (!schedule) {
      console.error('Schedule not found at index:', index);
      return;
    }

    const id = schedule.value?.id; // بررسی مقدار id
    console.log(id)
    if (id !== undefined && id !== null) {
      this.prof.deleteWorkingHour(id).subscribe(() => {
        this.workScheduleArray.removeAt(index);
        if (this.workScheduleArray.length < 0) {
          this.empty_hours = true;
        }
      }, error => {
        alert('خطا در حذف رکورد');
      });
    } else {
      this.workScheduleArray.removeAt(index);
    }
  }

  removeEducation(index:number){
    if (!this.education_array || index < 0 || index >= this.education_array.length) {
      console.error('Invalid index:', index);
      return;
    }

    const edu = this.education_array.at(index);
    console.log(edu)
    if (!edu) {
      console.error('Schedule not found at index:', index);
      return;
    }

    const id = edu.value?.id; // بررسی مقدار id
    console.log(id)
    if (id !== undefined && id !== null) {
      this.prof.deleteEducation(id).subscribe(() => {
        this.education_array.removeAt(index);
      }, error => {
        alert('خطا در حذف رکورد');
      });
    } else {
      this.education_array.removeAt(index);
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

  editeducation(e:number){
   this.prof.editEducation(e).subscribe(
    (response)=>{

      this.EditEducationForm.patchValue({
        country: response.data.country,
        univercity: response.data.university,
        academic_field: response.data.academic_field,
        graduation_year: response.data.graduation_year,
      })
      this.educationId = response.data.id

      console.log(response)
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



  submitEducationForm(){
    if (this.EducationForm.valid){
      console.log(this.EducationForm.value.doctorEducation)
      const payload = {
        type:'Educations',
        education : this.EducationForm.value.doctorEducation
      };
      this.prof.createEducations(payload).subscribe(
        response =>{
          console.log('داده ها با موفقیت ارسال شد',response);
        },
        error=>{
          console.error('خطا در ارسال داده ها',error)
        }
      );
      }
      else{
        console.error('فرم نامعتبر است')
      }
    }
  

  addWorkSchedule() {
    const newWorkSchedule = this.fb.group({
      day: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });

    this.workScheduleArray.push(newWorkSchedule);
  }

  workSchedules1: any[] = [{ day: '', start_time: '', end_time: '' }]; // شروع با یک سطر
  addRow() {
    this.workSchedules1.push({ day: '', start_time: '', end_time: '' });
  }

  submitAll() {
    console.log(this.workSchedules1)
    const convertedSchedules = this.workSchedules1.map(schedule => {
      const dayValue = schedule.day?.trim(); // حذف فاصله‌های اضافی
      const convertedDay = Object.keys(this.DAYS_MAP).find(key => this.DAYS_MAP[key] === dayValue);
      return {
        ...schedule,
        day: convertedDay !== undefined ? convertedDay : schedule.day
      };
    });

    const requestData = {
      schedules: convertedSchedules
    };


    this.prof.createWorkingHour(requestData).subscribe(
      response => {
        console.log('داده‌ها ارسال شد:', response);
        setTimeout(() => {
          (window as any).location.reload();
        }, 100);
        // this.workSchedules1 = [{ day: '', start_time: '', end_time: '' }]; // پاک کردن فرم بعد از ثبت

      },
      error => {
        console.error('خطا در ارسال داده‌ها:', error);
      }
    );
  }




  addEducation() {
    const educationRow = this.fb.group({
      academic_field: ['', Validators.required],
      university: ['', Validators.required],
      graduation_year: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.educations1.push(educationRow);
  }


  educations1: any[] = [{ academic_field: '', university: '', graduation_year: '', country: '' }]; // شروع با یک سطر
  addEducationRow() {
    this.educations1.push({ academic_field: '', university: '', graduation_year: '', country: '' });
  }

  submitEducation() {

    const requestData = {
      Educations: this.educations1
    };
    console.log(requestData)


    this.prof.createWorkingHour(requestData).subscribe(
      response => {
        console.log('داده‌ها ارسال شد:', response);
        setTimeout(() => {
          (window as any).location.reload();
        }, 100);

      },
      error => {
        console.error('خطا در ارسال داده‌ها:', error);
      }
    );
  }


  submitEditEducation(): void {
    if (this.EditEducationForm.valid) {
      const updatedData = this.EditEducationForm.value; // مقادیر فرم را دریافت می‌کنیم
      updatedData.edit_edu = this.educationId; // ID رکوردی که قرار است ویرایش شود را اضافه می‌کنیم
  
      this.prof.submitEducation(updatedData).subscribe(
        (response) => {
          this.showToast('اطلاعات شما با موفقیت ذخیره شد', 'success');
          console.log('داده‌ها با موفقیت به‌روزرسانی شد:');
        },
        (error) => {
          console.error('خطا در آپدیت داده‌ها:');
        }
      );
    } else {
      console.log('فرم معتبر نیست:', this.EditEducationForm.errors);
    }
  }
  




  // توابع مربوط به آپلود عکس

  onFileSelected(event: any) {
    const file = event.target.files[0]; // دریافت فایل انتخاب‌شده توسط کاربر
    console.log(file.size)
    if (file) {
      if (file.size > this.maxUploadSize) { // بررسی محدودیت حجم 10MB
        alert('حجم فایل نباید بیشتر از 10MB باشد.');
        return;
      }
      // اگر فایل بزرگ‌تر از ۱۵۰KB باشد، فشرده‌سازی اجرا شود
      if (file.size > this.maxFileSize) {
        this.compressImage(file, 0.7, (compressedFile) => { // فشرده‌سازی تصویر
          console.log(compressedFile.size)
          this.uploadImage(compressedFile); // ارسال تصویر به سرور
        });
      } else {
        console.log(file.size)
        this.uploadImage(file); // ارسال فایل در صورت نداشتن نیاز به فشرده‌سازی
      }
    }
  }




  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file); // اضافه کردن فایل فشرده‌شده یا اصلی به FormData

    this.prof.updateProfileImage(formData).subscribe({
      next: (response) => {
        console.log('تصویر با موفقیت آپلود شد', response);
        this.image = response.data.image_url
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('خطا در آپلود تصویر', error);
      }
    });
  }

  compressImage(file: File, quality: number, callback: (compresFile: File) => void) {
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');
        const maxWidth = 800
        const scaleSize = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleSize;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() })
            callback(compressedFile)
          }
        }, 'image/jpeg', quality)
      }
    }
  }


  

}









