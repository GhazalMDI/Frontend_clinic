import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com', // URL گوگل
  clientId: '971156426829-l5np1sfkm6hbu3ku2i1glbia08t0udte.apps.googleusercontent.com',     // کلاینت آی‌دی که در گوگل ساختید
  redirectUri: 'http://localhost:4200',   // آدرس فعلی (مثلاً http://localhost:4200)
  responseType: 'code',                  // برای کد OAuth2
  scope: 'openid profile email',         // محدوده دسترسی
  strictDiscoveryDocumentValidation: false,
};
