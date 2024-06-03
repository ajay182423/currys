// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  platformName: {
    part1: 'Digital',
    part2: 'X-Studio'
  },
  appName: {
    part1: '',
    part2: 'Smart Agent Assist'
  },
  pageSize: 100, //max is 100 from server side
  localStorageUserItem: 'SMAT_user',
  localStorageHelpDocEditor: 'SMAT_helpDocEditor',
  localStorageNavbarOptionsItem: 'SMAT_navbarOptions',
  jsonFilesUrl: './assets/json-files/',
  imgFilesUrl: './assets/images/',
  platformUrl: 'https://finance-exleratortest1.exlservice.com/platform/v4',
  apiUrl:'https://finance-exleratortest1.exlservice.com/s4/smart-audit-api/api/',
  
  // apiUrl:'https://finance-exleratortest1.exlservice.com/s4/smart-assist-demo-api/api/',
  // apiUrl:'https://finance-exleratortest1.exlservice.com/s4/smart-assist-dev-api/api/', //demo-purpose

  fileUrl: 'https://finance-exleratortest1.exlservice.com/platform-api/v2/',
  SMAT_fileUrl: 'https://localhost:44392/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
