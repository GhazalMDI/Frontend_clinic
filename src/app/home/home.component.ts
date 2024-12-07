import { Component, OnInit } from '@angular/core';
import { HomeserviceService } from './homeservice.service';
import { error } from 'console';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  banners:any[]=[];
  abouts:any[]=[];
  department:any[]=[];
  constructor(private homeService:HomeserviceService,private route:Router){}


  ngOnInit(): void {
    this.homeService.getData().subscribe(
      (response)=>{
        this.banners = response.data.banners;
        this.abouts = response.data.abouts;
      },
      (error)=>{
        console.error('error fatching data',error);
      }
    )
  }

  GoToDepartmentDetail(d_id:number){
    this.route.navigate(['list',d_id])

  }

}
