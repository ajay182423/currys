import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/Router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//3rd Party Packages
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AngularEmojisModule } from 'angular-emojis';
//Components
import { PlatformLogoComponent } from 'common_modules/components/platform-logo/platform-logo.component';
import { AppSpinnerComponent } from 'common_modules/components/app-spinner/app-spinner.component';
import { AppLeftNavbarComponent } from './components/app-left-navbar/app-left-navbar.component';
import { AppUserAccountComponent } from './components/app-user-account/app-user-account.component';
import { AppLogoComponent } from 'common_modules/components/app-logo/app-logo.component';
import { AppPageHeaderComponent } from './components/app-page-header/app-page-header.component';
import { MobileHiddenNavbarComponent } from 'common_modules/components/mobile-hidden-navbar/mobile-hidden-navbar.component';
import { DialogContainerComponent } from 'common_modules/components/dialog-container/dialog-container.component';
import { ConfirmDialogComponent } from 'common_modules/components/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'common_modules/components/input-dialog/input-dialog.component';
import { ModalPopupComponent } from 'common_modules/components/modal-popup/modal-popup.component';
import { FullPageTableComponent } from 'common_modules/components/full-page-table/full-page-table.component';
import { MultiSelectDropdownComponent } from 'common_modules/components/multi-select-dropdown/multi-select-dropdown.component';
import { LoadingSpinnerComponent } from 'common_modules/components/loading-spinner/loading-spinner.component';
import { SettingsLinksComponent } from 'common_modules/components/settings-links/settings-links.component';
import { ContextMenuComponent } from 'common_modules/components/context-menu/context-menu.component';
import { PopupMenuComponent } from 'common_modules/components/popup-menu/popup-menu.component';
import { FolderFileViewComponent } from 'common_modules/components/folder-file-view/folder-file-view.component';
import { FolderFileTreeComponent } from 'common_modules/components/folder-file-tree/folder-file-tree.component';
//Forms
import { TextInputComponent } from 'common_modules/forms/text-input/text-input.component';
import { SingleSelectDropdownComponent } from 'common_modules/forms/single-select-dropdown/single-select-dropdown.component';

import { TextareaInputComponent } from 'common_modules/forms/textarea-input/textarea-input.component';
import { ToggleInputComponent } from 'common_modules/forms/toggle-input/toggle-input.component';
//Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoadingInterceptor } from 'common_modules/interceptors/loading.interceptor';
//directives
import { CanAccessPageDirective } from './directives/can-access-page.directive';
import { SanitizeHtmlPipe } from 'common_modules/helpers/sanitize-html';
//Pages-Initials
import { ErrorPageComponent } from 'common_modules/pages/error-page/error-page.component';
import { LoginComponent } from 'projects/smart-assist/src/app/pages/login/login.component';
import { HelpLandingPageComponent } from 'projects/smart-assist/src/app/pages/help/help-landing-page/help-landing-page.component';
import { HelpDocComponent } from 'projects/smart-assist/src/app/pages/help/help-doc/help-doc.component';
//Pages-Settings
import { SettingsLinksPageComponent } from './pages/settings/settings-links-page/settings-links-page.component';
import { AppUserSettingComponent } from './pages/settings/app-user/app-user-setting/app-user-setting.component';
import { AppUserSetupComponent } from './pages/settings/app-user/app-user-setup/app-user-setup.component';
import { RoleSettingComponent } from './pages/settings/app-role/app-role-setting/app-role-setting.component';
import { RoleSetupComponent } from './pages/settings/app-role/app-role-setup/app-role-setup.component';
import { UserGroupSettingComponent } from './pages/settings/user-group/user-group-setting/user-group-setting.component';
import { UserGroupSetupComponent } from './pages/settings/user-group/user-group-setup/user-group-setup.component';
import { CustomerManagementComponent } from './pages/settings/customer-management/customer-management.component';
import { AuditParameterComponent } from './pages/settings/audit-parameter/audit-parameter.component';
import { ProcessManagementComponent } from './pages/settings/process-management/process-management.component';
import { SectionManagementComponent } from './pages/settings/section-management/section-management.component';
import { AuditStatusComponent } from './pages/settings/audit-status/audit-status.component';
import { AuditParameterSetupComponent } from './pages/settings/audit-parameter/audit-parameter-setup/audit-parameter-setup.component';
import { AuditStatusSetupComponent } from './pages/settings/audit-status/audit-status-setup/audit-status-setup.component';
import { CustomerManagementSetupComponent } from './pages/settings/customer-management/customer-management-setup/customer-management-setup.component';
import { ProcessManagementSetupComponent } from './pages/settings/process-management/process-management-setup/process-management-setup.component';
import { SectionManagementSetupComponent } from './pages/settings/section-management/section-management-setup/section-management-setup.component';
import { AuditParameterTypeComponent } from './pages/settings/audit-parameter-type/audit-parameter-type.component';
import { RuleEngineComponent } from './pages/settings/transactionManagement/rule-engine/rule-engine.component';
import { RuleEngineSetupComponent } from './pages/settings/transactionManagement/rule-engine/rule-engine-setup/rule-engine-setup.component';
import { AuditParameterTypeSetupComponent } from './pages/settings/audit-parameter-type/audit-parameter-type-setup/audit-parameter-type-setup.component';
//Services
import { GlobalVarService } from 'common_modules/services/global-var.service';
import { FolderFileViewService } from 'common_modules/services/folder-file-view.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { InputDialogService } from 'common_modules/services/input-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AppUserService } from 'projects/smart-assist/src/app/services/settings/app-user.service';
import { AppRoleService } from './services/settings/app-role.service';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { UserGroupService } from './services/settings/user-group.service';
import { ThemeService } from 'common_modules/services/theme.service';
import { NavbarService } from 'common_modules/services/navbar.service';
import { DragService } from 'common_modules/services/drag.service';
import { CallAuditComponent } from './pages/call-audit/call-audit.component';
import { AuditParameterResultComponent } from './pages/audit-parameter-result/audit-parameter-result.component';
import { AuditParameterFormComponent } from './pages/settings/audit-parameter-form/audit-parameter-form.component';
import { AuditParameterFormSetupComponent } from './pages/settings/audit-parameter-form/audit-parameter-form-setup/audit-parameter-form-setup.component';
// import { HelpTextComponent } from './pages/call-audit/help-text/help-text.component';
import { AuditRecordComponent } from './pages/audit-record/audit-record.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavbarNewComponent } from './components/navbar-new/navbar-new.component';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { FilterCustomAuditPipe } from 'common_modules/pipes/custom-audit.pipe';
import { ChartPopupComponent } from './pages/dashboard/chartPopup/chart-popup.component';
import { FormsDataPopupComponent } from './pages/dashboard/formsDataPopup/forms-data-popup.component';
import { FormTableComponent } from './components/form-table/form-table.component';
import { AgentDashboardComponent } from './pages/agent-dashboard/agent-dashboard.component';
import { FilterAuditRecordsPipe } from 'common_modules/pipes/audit-records.pipe';
import { SafePipe } from 'common_modules/pipes/safe.pipe';
import { BackOfficeComponent } from './pages/back-office/back-office.component';
import { FrontOfficeComponent } from './pages/front-office/front-office.component';
import { VulnerableCustomerComponent } from './pages/vulnerable-customer/vulnerable-customer.component';
import { FrontOfficeRecordsComponent } from './pages/front-office-records/front-office-records.component'
import { BackOfficeRecordsComponent } from './pages/back-office-records/back-office-records.component'
import { FrontOfficeDashboardComponent } from './pages/front-office-dashboard/front-office-dashboard.component';
import { BackOfficeDashboardComponent } from './pages/back-office-dashboard/back-office-dashboard.component';
import { LiveCallAuditComponent } from './pages/live-call-audit/live-call-audit.component';
import { LiveAuditRecordsComponent } from './pages/live-audit-records/live-audit-records.component';
import { CommonModule } from '@angular/common';
import { HelpTextComponent } from './pages/front-office/help-text/help-text.component';
import { AudioDetailsComponent } from './pages/front-office/audio-details/audio-details.component';
import { ProceduralGuidanceComponent } from './pages/procedural-guidance/procedural-guidance.component';
import { ReferencePopupComponent } from './pages/procedural-guidance/reference-popup/reference-popup.component';
import { DriverPopupComponent } from './pages/live-call-audit/driver-popup/driver-popup.component';
import { AsociatedTranscriptComponent } from './pages/front-office/asociated-transcript/asociated-transcript.component';
import { UiCustomizationComponent } from './pages/settings/ui-customization/ui-customization.component';
import { LiveCallAuditNewComponent } from './pages/live-call-audit-new/live-call-audit-new.component';
import { DriverPopupNewComponent } from './pages/live-call-audit-new/driver-popup-new/driver-popup-new.component';
import { CallInformationComponent } from './pages/live-call-audit/call-information/call-information.component';
import { CallTranscriptComponent } from './pages/live-call-audit/call-transcript/call-transcript.component';
import { AIEntityExtractComponent } from './pages/live-call-audit/ai-entity-extract/ai-entity-extract.component';
import { EntityPopupComponent } from './pages/live-call-audit/entityPopup/entity-popup.component';
import { LiveCallAuditHomePageNewComponent } from './pages/live-call-audit-home-page-new/live-call-audit-home-page-new.component';
import { LiveCallAuditHomePageNewTwoComponent } from './pages/live-call-audit-home-page-new-two/live-call-audit-home-page-new-two.component';
import { CallTranscriptNewComponent } from './pages/live-call-audit-new/call-transcript-new/call-transcript-new.component';
import { CallInformationNewComponent } from './pages/live-call-audit-new/call-information-new/call-information-new.component';
import { AIEntityExtractNewComponent } from './pages/live-call-audit-new/ai-entity-extract-new/ai-entity-extract-new/ai-entity-extract-new.component';
import { EntityPopupNewComponent } from './pages/live-call-audit-new/entity-popup-new/entity-popup-new.component';
import { AiRecommendationsComponent } from './pages/live-call-audit-new/ai-recommendations/ai-recommendations.component';
import { CallWrapUpComponent } from './pages/live-call-audit-new/call-wrap-up/call-wrap-up.component';
import { KnowledgeShowComponent } from './pages/live-call-audit-new/knowledge-show/knowledge-show.component';
import { SliderMenuComponent } from './pages/live-call-audit-new/slider-menu/slider-menu.component';
import { MapPopupComponent } from './pages/live-call-audit/map-popup/map-popup.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    //Components
    ErrorPageComponent,
    DialogContainerComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    ModalPopupComponent,
    ChartPopupComponent,
    AudioDetailsComponent,
    FullPageTableComponent,
    MultiSelectDropdownComponent,
    FormsDataPopupComponent,
    AppLeftNavbarComponent,
    AppLogoComponent,
    AppUserAccountComponent,
    AppPageHeaderComponent,
    MobileHiddenNavbarComponent,
    AppSpinnerComponent,
    PlatformLogoComponent,
    LoadingSpinnerComponent,
    SettingsLinksComponent,
    ContextMenuComponent,
    PopupMenuComponent,
    FolderFileViewComponent,
    FolderFileTreeComponent,
    NavbarNewComponent,
    TableFilterComponent,
    // TreeComponent,
    // ChartComponent,
    //Forms
    TextInputComponent,
    FormTableComponent,
    SingleSelectDropdownComponent,
    TextareaInputComponent,
    ToggleInputComponent,
    //--Directives+Pipes
    CanAccessPageDirective,
    SanitizeHtmlPipe,
    //Page-Initial
    LoginComponent,
    HelpLandingPageComponent,
    HelpDocComponent,
    //Pages-Settings
    SettingsLinksPageComponent,
    AppUserSettingComponent,
    AppUserSetupComponent,
    RoleSettingComponent,
    RoleSetupComponent,
    UserGroupSettingComponent,
    UserGroupSetupComponent,
    CustomerManagementComponent,
    AuditParameterComponent,
    ProcessManagementComponent,
    SectionManagementComponent,
    AuditStatusComponent,
    AuditParameterSetupComponent,
    AuditStatusSetupComponent,
    CustomerManagementSetupComponent,
    ProcessManagementSetupComponent,
    SectionManagementSetupComponent,
    AuditParameterTypeSetupComponent,
    LiveCallAuditHomePageNewComponent,

    AuditParameterTypeComponent,
    RuleEngineComponent,
    RuleEngineSetupComponent,
    CallAuditComponent,
    AuditParameterResultComponent,
    AuditParameterFormComponent,
    AuditParameterFormSetupComponent,
    HelpTextComponent,
    HelpTextComponent,
    AuditRecordComponent,
    DashboardComponent,
    FrontOfficeDashboardComponent,
    BackOfficeDashboardComponent,
    ProceduralGuidanceComponent,
    LiveCallAuditNewComponent,
    DriverPopupNewComponent,
    MapPopupComponent,

    // New Components

    CallInformationComponent,
    CallTranscriptComponent,
    AIEntityExtractComponent,
    EntityPopupComponent,

    // Pipes
    FilterCustomAuditPipe,
    AgentDashboardComponent,
    FilterAuditRecordsPipe,
    SafePipe,
    BackOfficeComponent,
    FrontOfficeComponent,
    VulnerableCustomerComponent,
    FrontOfficeRecordsComponent,
    BackOfficeRecordsComponent,
    LiveCallAuditComponent,
    LiveAuditRecordsComponent,
    ReferencePopupComponent,
    DriverPopupComponent,
    AsociatedTranscriptComponent,
    UiCustomizationComponent,
    LiveCallAuditHomePageNewTwoComponent,
    CallTranscriptNewComponent,
    CallInformationNewComponent,
    AIEntityExtractNewComponent,
    EntityPopupNewComponent,
    AiRecommendationsComponent,
    CallWrapUpComponent,
    KnowledgeShowComponent,
    SliderMenuComponent
  ],
  imports: [
    RouterModule.forRoot([], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    //3rd Party Packages
    NgCircleProgressModule.forRoot({
      radius: 60,
      outerStrokeWidth: 10,
      innerStrokeWidth: 5,
      showBackground: false,
      responsive: false
    }),
    ChartsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    PerfectScrollbarModule,
    AngularEmojisModule,
    CommonModule,
    // PdfViewerModule,
  ],
  providers: [
    Title,
    CookieService,
    //Services
    FolderFileViewService,
    ConfirmDialogService,
    InputDialogService,
    ModalPopupService,
    AccountService,
    AppUserService,
    AppRoleService,
    UserGroupService,
    ThemeService,
    NavbarService,
    GlobalVarService,
    DragService,
    //Other
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
