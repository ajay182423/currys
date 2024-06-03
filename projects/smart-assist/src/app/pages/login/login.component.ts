import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { AccountService } from '../../services/account.service';
import { ThemeService } from 'common_modules/services/theme.service';
import { NavbarService } from 'common_modules/services/navbar.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideUp]
})
export class LoginComponent implements OnInit {

  isLoading: boolean = true;
  spinnerOptions: any = {};

  loginMessage: string = "We are signing you in, please wait...";

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    public navbarService: NavbarService,
  ) { }

  ngOnInit(): void {
    this.navbarService.showHideNavbar(false);
    //queryParams
    this.route.queryParams.subscribe(params => {
      if (params['layout'] !== undefined && params['theme'] !== undefined && params['appinitials'] !== undefined && params['appname'] !== undefined) {
        if (params['layout'] === 'frame') {
          this.spinnerOptions = {
            appInitials: params['appinitials'],
            appName: params['appname'],
            showPlatformLogo: false,
            fileUrl: environment.fileUrl,
            platformName: environment.platformName
          }
        } else {
          this.spinnerOptions = {
            appInitials: params['appinitials'],
            appName: params['appname'],
            showPlatformLogo: true,
            fileUrl: environment.fileUrl,
            platformName: environment.platformName
          }
        }
        //set theme
        if (params['theme'] === 'dark') {
          this.themeService.setDarkMode(true);
        } else {
          this.themeService.setDarkMode(false);
        }
        //try login
        this.accountService.login({ loginId: params['id'] }).subscribe(response => {
          console.log(response)
          if (response !== undefined) {
            this.accountService.setCurrentUser(response);
            this.router.navigate(['/front-office-dashboard']);
            this.isLoading = false;
            if (params['layout'] === 'full') {
              this.navbarService.showHideNavbar(true);
            }
          }
        });
      }
      else {
        this.router.navigate(['/error/404']);
      }
    });
  }

}
