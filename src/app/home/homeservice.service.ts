import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Banner {
  description:string;
  image:string;
}

interface About{
  title:string;
  description:string
}


interface ApiResponse{
  data:{
      banners:Banner[];
      abouts:About[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class HomeserviceService {
  private ApiUrl = 'http://127.0.0.1:8000/API/';
  constructor(private http:HttpClient) { 

  
  }
  getData():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.ApiUrl);
  }
}
