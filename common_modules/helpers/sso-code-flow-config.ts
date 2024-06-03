import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://login.microsoftonline.com/{0}/v2.0',
  
  clientId: 'ad96f7c6-95e2-45cd-b5dd-2eca3eea1534',
  
  responseType: 'code',
  
  scope: 'openid profile email offline_access',
  
  redirectUri: window.location.origin + '/sso-login',
  
  postLogoutRedirectUri: window.location.origin + '/login',
  
  //logoutUrl: window.location.origin + '/sso/logout',
  
  //oidc: true,
  //requireHttps: false,
  showDebugInformation: true,
};