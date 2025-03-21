import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormGroup, FormControl, FormArray, NgForm, FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig,GoogleSigninButtonModule  } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider} from '@abacritt/angularx-social-login';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { DepartmentComponent } from './department/department.component';
import { RegisterComponent } from './login/register/register.component'; 
import { authConfig } from './auth.config';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DepartmentComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    OAuthModule.forRoot(),
    GoogleSigninButtonModule,
    OAuthModule,
    SocialLoginModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule  {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
  }
  
 }
