import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/Router';
//Guards
import { AuthGuard } from './guards/auth.guard';
import { CanAccessPageGuard } from './guards/can-access-page.guard';
//LoggedIn User Pages
import { LoginComponent } from 'projects/smart-assist/src/app/pages/login/login.component';
import { AppUserSettingComponent } from './pages/settings/app-user/app-user-setting/app-user-setting.component';
import { SettingsLinksPageComponent } from './pages/settings/settings-links-page/settings-links-page.component';
import { ErrorPageComponent } from 'common_modules/pages/error-page/error-page.component';
import { RoleSettingComponent } from './pages/settings/app-role/app-role-setting/app-role-setting.component';
import { UserGroupSettingComponent } from './pages/settings/user-group/user-group-setting/user-group-setting.component';
import { HelpLandingPageComponent } from 'projects/smart-assist/src/app/pages/help/help-landing-page/help-landing-page.component';
import { HelpDocComponent } from 'projects/smart-assist/src/app/pages/help/help-doc/help-doc.component';
import { CustomerManagementComponent } from './pages/settings/customer-management/customer-management.component';
import { SectionManagementComponent } from './pages/settings/section-management/section-management.component';
import { ProcessManagementComponent } from './pages/settings/process-management/process-management.component';
import { AuditParameterComponent } from './pages/settings/audit-parameter/audit-parameter.component';
import { AuditStatusComponent } from './pages/settings/audit-status/audit-status.component';
import { AuditParameterTypeComponent } from './pages/settings/audit-parameter-type/audit-parameter-type.component';
import { RuleEngineComponent } from './pages/settings/transactionManagement/rule-engine/rule-engine.component';
import { CallAuditComponent } from './pages/call-audit/call-audit.component';
import { AuditParameterResultComponent } from './pages/audit-parameter-result/audit-parameter-result.component';
import { AuditRecordComponent } from './pages/audit-record/audit-record.component';
import { FrontOfficeComponent } from './pages/front-office/front-office.component';
import { AuditParameterFormComponent } from './pages/settings/audit-parameter-form/audit-parameter-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgentDashboardComponent } from './pages/agent-dashboard/agent-dashboard.component'
import { VulnerableCustomerComponent } from './pages/vulnerable-customer/vulnerable-customer.component';
import { BackOfficeRecordsComponent } from './pages/back-office-records/back-office-records.component';
import { FrontOfficeDashboardComponent } from './pages/front-office-dashboard/front-office-dashboard.component';
import { BackOfficeDashboardComponent } from './pages/back-office-dashboard/back-office-dashboard.component';
import { LiveCallAuditComponent } from './pages/live-call-audit/live-call-audit.component';
import { LiveAuditRecordsComponent } from './pages/live-audit-records/live-audit-records.component';
import { FrontOfficeRecordsComponent } from './pages/front-office-records/front-office-records.component';
import { BackOfficeComponent } from './pages/back-office/back-office.component';
import { ProceduralGuidanceComponent } from './pages/procedural-guidance/procedural-guidance.component';
import { UiCustomizationComponent } from './pages/settings/ui-customization/ui-customization.component';
import { LiveCallAuditNewComponent } from './pages/live-call-audit-new/live-call-audit-new.component';
import { LiveCallAuditHomePageNewComponent } from './pages/live-call-audit-home-page-new/live-call-audit-home-page-new.component';
import { LiveCallAuditHomePageNewTwoComponent } from './pages/live-call-audit-home-page-new-two/live-call-audit-home-page-new-two.component';
import { CallTranscriptNewComponent } from './pages/live-call-audit-new/call-transcript-new/call-transcript-new.component';
import { CallInformationNewComponent } from './pages/live-call-audit-new/call-information-new/call-information-new.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'help', component: HelpLandingPageComponent, data: {id:'GEN', title: 'Help'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'call-audit', component: CallAuditComponent, data: {id:'GEN', title: 'Call Audit'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'live-call-audit', component: LiveCallAuditComponent, data: {id:'GEN', title: 'Live Agent Assist'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'live-call-audit-new', component: LiveCallAuditNewComponent, data: {id:'GEN', title: ''}, runGuardsAndResolvers: 'always'},
  { path: 'live-audit-records', component: LiveAuditRecordsComponent, data: {id:'GEN', title: 'Live Agent Assist Records'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'audit-parameter-result', component: AuditParameterResultComponent, data: {id:'GEN', title: 'Audit Parameter Result'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'audit-record', component: AuditRecordComponent, data: {id:'GEN', title: 'Audit Records'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'front-office', component: FrontOfficeComponent, data: {id:'GEN', title: 'Front Office'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'back-office', component: BackOfficeComponent, data: {id:'GEN', title: 'Back Office'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'front-office-records', component: FrontOfficeRecordsComponent, data: {id:'GEN', title: 'front Office Records'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'back-office-records', component: BackOfficeRecordsComponent, data: {id:'GEN', title: 'Back Office Records'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'vulnerable-customer', component: VulnerableCustomerComponent, data: {id:'GEN', title: 'vulnerable customer'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'dashboard', component: DashboardComponent, data: {id:'GEN', title: 'Dashboard'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'agent-dashboard', component: AgentDashboardComponent, data: {id:'GEN', title: 'Agent Dashboard'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'front-office-dashboard', component: FrontOfficeDashboardComponent, data: {id:'GEN', title: 'Front Office Dashboard'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'back-office-dashboard', component: BackOfficeDashboardComponent, data: {id:'GEN', title: 'Back Office Dashboard'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'procedural-guidance', component: ProceduralGuidanceComponent, data: {id:'GEN', title: 'Procedural Guidance'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'help/doc/:id', component: HelpDocComponent, data: {id:'GEN', title: 'Help'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard]},
  { path: 'settings', component: SettingsLinksPageComponent, data: {id:'SET', title: 'Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/users', component: AppUserSettingComponent, data: {id:'USE', title: 'Users Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/user-roles', component: RoleSettingComponent, data: {id:'ROL', title: 'User Role Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/user-groups', component: UserGroupSettingComponent, data: {id:'USE', title: 'User Groups Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/customer-management', component: CustomerManagementComponent, data: {id:'USE', title: 'Custometer Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/audit-parameter', component: AuditParameterComponent, data: {id:'ROL', title: 'Audit Parameter Setting'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/audit-parameter-form', component: AuditParameterFormComponent, data: {id:'ROL', title: 'Audit Parameter Form Setting'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/audit-status', component: AuditStatusComponent, data: {id:'ROL', title: 'Audit Status Setting'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/process-management', component: ProcessManagementComponent, data: {id:'USE', title: 'Process Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/section-management', component: SectionManagementComponent, data: {id:'ROL', title: 'Section Management Setting'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/ui-customization', component: UiCustomizationComponent, data: {id:'USE', title: 'Ui Customization Settings'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/audit-parameter-type', component: AuditParameterTypeComponent, data: {id:'ROL', title: 'Audit Parameter Type Setting'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'settings/transactionManagement/rule-engine', component: RuleEngineComponent, data: {id:'ROL', title: 'Rule Engine'}, runGuardsAndResolvers: 'always', canActivate: [AuthGuard, CanAccessPageGuard] },
  { path: 'login', component: LoginComponent, data: {title: 'Login'} },
  { path: 'error/:code', component: ErrorPageComponent, data: {title: 'Error'} },
  { path: 'live-call-audit-home-page-new', component: LiveCallAuditHomePageNewComponent, data: {id:'GEN', title: 'Home Page'}, runGuardsAndResolvers: 'always'},
  { path: 'live-call-audit-home-page-new-two', component: LiveCallAuditHomePageNewTwoComponent, data: {id:'GEN', title: 'Home Page 2'}, runGuardsAndResolvers: 'always'},
  { path: 'call-transcript-new', component: CallTranscriptNewComponent, data: {id:'GEN', title: 'Call transcript'}, runGuardsAndResolvers: 'always'},
  { path: 'call-information-new', component: CallInformationNewComponent, data: {id:'GEN', title: 'Call information'}, runGuardsAndResolvers: 'always'},
  { path: '**', component: ErrorPageComponent, data: {title: 'Error'}, pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
