import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  ProfileUrl = 'http://127.0.0.1:8000/API/Accounts/profile/'


  getAcademicFields(): Observable<any[]> {
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.get<any[]>(this.ProfileUrl);
  }

  

  GetProfileData(): Observable<any> {
    // const url = 'http://127.0.0.1:8000/API/Accounts/profile/'
    let accessToken = this.authService.getAccessToken()
    console.log('you is profile service')
    console.log(accessToken)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.get(this.ProfileUrl, { headers })

  }
  editProfile(data: any): Observable<any> {
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.patch(this.ProfileUrl, data, { headers })
  }

  deleteWorkingHour(id: number): Observable<any> {
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.delete(`${this.ProfileUrl}?working_hour_id=${id}`, { headers });
  }

  deleteEducation(id:number):Observable <any>{
    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.delete(`${this.ProfileUrl}?education_id=${id}`, { headers });
  }

  createWorkingHour(data: any): Observable<any> {

    let accessToken = this.authService.getAccessToken()
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}` // اگر نیاز به احراز هویت دارید
    });

    return this.http.post(`${this.ProfileUrl}`, data, { headers });
  }

  createEducations(data: any):Observable <any>{
    let accessToken = this.authService.getAccessToken()

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}` // اگر نیاز به احراز هویت دارید
    })
    return this.http.post(`${this.ProfileUrl}`,data,{headers})
    

  }


  updateProfileImage(data: FormData): Observable<any> {
    const url = 'http://127.0.0.1:8000/API/Accounts/profile/';
    let accessToken = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}` // احراز هویت
    });

    return this.http.put(url, data, { headers });
  }


  getCountries(): Observable<{ value: string; display: string }[]> {
    const apiUrl = 'https://restcountries.com/v3.1/all'
    return this.http.get<any[]>(apiUrl).pipe(
      map((countries) =>
        countries.map((country) => {
          const commonName = country?.name?.common || 'Unknown';
          const persianName =
            country?.translations?.per?.common || commonName;
          return {
            value: `${commonName} - ${persianName}`,
            display: `${persianName} (${commonName})`
          };
        })
      )
    );
  }


  getUniversities(): Observable<{ name: string; country: string }[]> {

    const apiUrl = 'https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json'

    return this.http.get<any[]>(apiUrl).pipe(
      map((universities) =>
        universities.map((uni) => ({
          name: uni.name,
          country: uni.country
        }))
      )
    );
  }

  

}

