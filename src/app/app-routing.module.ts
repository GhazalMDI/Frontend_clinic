import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
  {path:'login/register/', component: RegisterComponent },
  {path:'list/:id',component:DepartmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
