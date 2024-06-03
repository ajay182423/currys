import { Component, HostListener, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import 'chartjs-plugin-labels';
import { IEmailList } from '../../interfaces/email-param';
import { IGraphToken } from '../../interfaces/graph/graphtoken-param';
import { IMailboxList } from '../../interfaces/mailbox-param';
import { SlaPerformance } from '../../interfaces/slaPerformance';
import { IStatsList } from '../../interfaces/Stats-param';
import { ITATPerformance } from '../../interfaces/tat-performance-param';
import { ITeamStatsList } from '../../interfaces/teamstats-param';
import { DashboardService } from '../../services/dashboard.service';
import { finalize } from 'rxjs/operators';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { Router } from '@angular/Router';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ChartPopupComponent } from '../dashboard/chartPopup/chart-popup.component';
import { FormsDataPopupComponent } from '../dashboard/formsDataPopup/forms-data-popup.component';

@Component({
  selector: 'app-front-office-dashboard',
  templateUrl: './front-office-dashboard.component.html',
  styleUrls: ['./front-office-dashboard.component.scss'],
})
export class FrontOfficeDashboardComponent implements OnInit {
  // Chart.register(ChartDataLabels);
  // New Dashboard Properties

  // Local JsonFile
  jsonUrl: string = environment.jsonFilesUrl + 'front-office-dashboard.json';
  jsonAgentData: string = environment.jsonFilesUrl + 'agentData.json';

  // Server Json File
  fileUrl: string = environment.fileUrl + 'front-office-dashboard.json';
  fileAgentData: string = environment.fileUrl + 'agentData.json';

  pageNumber: number = 1;
  pageSize: number = 10;

  userFirstName: string;
  isNotificationOpened: boolean = false;
  isUserMenuOpened: boolean = false;
  isItFirstTime: boolean = false;
  usersList: any;
  statsItemsList: IStatsList[] = [];
  mailBoxList: IMailboxList[] = [];
  teamStatsList: ITeamStatsList[] = [];
  pending: number = 0;
  total: number = 0;
  completed: number = 0;
  pendingStat: number = 0;
  totalStat: number = 0;
  completedStat: number = 0;
  hold: number = 0;
  slaMissed: number = 0;
  actionOriented: number = 0;
  pendingGraph: number = 0;
  totalGraph: number = 0;
  completedGraph: number = 0;
  tatNumber: number = 0;
  totalDataLabel: string[];
  totalDataValue: number[];
  timePeriod: string;
  avgTAT: any;
  mailboxChart: any;
  intentChart: any;
  setimentData: any;
  slaPerformanceChart: any;
  tatperformanceChart: ITATPerformance;
  pendingDataLabel: string[];
  pendingDataValue: number[];
  completedDataLabel: string[];
  completedDataValue: number[];
  TransactionsTableList: IEmailList[];
  actionOrientedPercentage: number = 0;
  pendingPercentage: number = 0;
  completedPercentage: number = 0;
  slaMissedPercentage: number = 0;
  ownerChartLabel: Array<string> = [];
  ownerChartdata: Array<number> = [];
  slaChartLabel: Array<string> = [];
  slaChartdata: Array<number> = [];
  graphToken: IGraphToken;
  userAssignClass: string = 'nav-link user-link';
  dayActive: boolean = true;
  weekActive: boolean = false;
  monthActive: boolean = false;
  historyActive: boolean = false;
  auditFormChartShow: boolean = false;
  sectionChartShow: boolean = true;
  queryStatusChartShow: boolean = false;
  idvComplianceChartShow: boolean = false;
  pciComplianceChartShow: boolean = false;
  priorityChartShow: boolean = false;
  PriorityChartYearData: any;
  PriorityChartMonthData: any;
  PriorityChartDayData: any;
  SLAChartShow: boolean = true;
  TATChartShow: boolean = false;
  MonthChartShow: boolean = false;
  WeekChartShow: boolean = true;
  showSLAMissedPopup: boolean = false;
  showTATPopup: boolean = false;
  showUserPopup: boolean = false;
  showIntentCountonTotalPopup: boolean = false;
  ChartToDisplay: string = '';
  DashDetailsData: any;
  mailAddressList: any = [];
  monthlyTotal: Array<number> = [50, 39];
  monthlyCompleted: Array<number> = [48, 39];
  monthlyPending: Array<number> = [2, 0];
  totalmail: number;
  completedmail: number;
  pendingmail: number;
  intentDistributionList: any;
  completedSlaPopUpData: any = [];
  pendingSlaPopUpData: any = [];
  completedSlaPopUpDataCopy: any = [];
  pendingSlaPopUpDataCopy: any = [];
  pendingSlaData: SlaPerformance[] = [];
  completedSlaData: SlaPerformance[] = [];
  completedSlaDataValue: Array<number> = [];
  pendingSlaDataValue: Array<number> = [];
  SlaPopUpData: any = [];
  showCompletedSLAPopup: boolean;
  mailboxAddress: string;
  monthArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Updated Properties

  auditFormList: any = [];
  auditParameterResultList: any = [];
  totalAuditRecords: number;
  completedAuditRecords: number;
  pendingAuditRecords: number;
  callAuditedHours: number;
  averageScore: number;
  callAuditedMins: any;
  inventoryDayChartObj: { labels: string[]; data: any[] } = {
    labels: [],
    data: [],
  };
  inventoryMonthChartObj: { labels: string[]; data: any[] } = {
    labels: [],
    data: [],
  };
  parameterMonthChartObj: { labels: string[]; data: any[] } = {
    labels: [],
    data: [],
  };
  parameterDayChartObj: { labels: string[]; data: any[] } = {
    labels: [],
    data: [],
  };
  sectionAuditFailedDayChartShow: boolean;
  sectionAuditFailedMonthChartShow: boolean;
  AHT: any;
  agentData: any;

  agentJsonUrl: string = environment.jsonFilesUrl + 'dashboard-agent-table.json';

  tableMessage: any = {};
  isLoading: boolean = false;

  tableHeaders: any = [
    {
      id: 1,
      name: 'Agent Name',
      order: 'desc',
      type: 'string',
      class: 'th-sort',
    },
    {
      id: 2,
      name: 'No. of Calls',
      order: 'desc',
      type: 'number',
      class: 'th-sort',
    },
    {
      id: 3,
      name: 'Total Score',
      order: 'desc',
      type: 'number',
      class: 'th-sort',
    },
    {
      id: 4,
      name: 'Agent Scored',
      order: 'desc',
      type: 'number',
      class: 'th-sort',
    },
    { id: 5, name: 'Quality', order: 'desc', type: 'number', class: 'th-sort' },
    {
      id: 6,
      name: 'No. of Form',
      order: 'desc',
      type: 'number',
      class: 'th-sort',
    },
    { id: 7, name: 'AHT', order: 'desc', type: 'number', class: 'th-sort' },
    // {id: 8, name: "Confidence", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 9, name: "Audit Result", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 8, name: "Created On", order: 'desc', type: 'date',  class: 'th-sort'},
    // {id: 9, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'},
  ];
  tableData: any = [];
  positiveSentiment: any;
  negativeSentiment: any;
  neutralSentiment: any;
  categorizationJourneyChartShow: boolean;
  categorizationSubJourneyChartShow: boolean;
  categorizationCustomerIntentChartShow: boolean;
  categorizationCallDriversChartShow: boolean;
  widget1_tab1ChartData: any;
  widget1_tab2ChartData: any;
  widget2_tab1ChartData: any;
  widget2_tab2ChartData: any;
  widget2_tab3ChartData: any;
  widget2_tab4ChartData: any;
  widget3_tab1ChartData: any;
  widget3_tab2ChartData: any;
  widget3_tab3ChartData: any;
  widget3_tab4ChartData: any;
  card1Data: any;
  card2Data: any;
  card3Data: any;
  card4Data: any;
  card5Data: any;
  card6Data: any;
  card7Data: any;
  card8Data: any;

  constructor(
    private dashboardService: DashboardService,
    private helperService: HelperService,
    private router: Router,
    private toastrService: ToastrService,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService
  ) { }

  ngOnInit(): void {
    this.getAuditRecordsData();
    this.SelectPerformanceGraphShow('Day');

    this.categorizationChart('callDrivers');
    this.openTab('IdvCompliance');
    this.fillTableRows();
  }
  RefreshPage() {
    this.ngOnInit();
  }
  batchRun() {
    this.CallAuditService.batchRun().subscribe((data) => {
      const batchRundata = data.file_to_be_processed;
      this.toastrService.success(batchRundata);
    });
  }

  getAuditRecordsData() {
    // this.dashboardService.getAuditRecordsForSetup().subscribe(response => {
    this.helperService.getJSON(this.jsonUrl).subscribe((response) => {
      this.card1Data = response.card1;
      this.card2Data = response.card2;
      this.card3Data = response.card3;
      this.card4Data = response.card4;
      this.card5Data = response.card5;
      this.card6Data = response.card6;
      this.card7Data = response.card7;
      this.card8Data = response.card8;
    });
  }

  openFormList() {
    this.openFormsDataPopup();
  }

  fillTableRows() {
    this.helperService.getJSON(this.agentJsonUrl).pipe(finalize(() => {
          this.isLoading = false;
          this.tableMessage = { isUpdating: false, text: '' };
        })
      )
      .subscribe((response) => {
        console.log(response);
        if (response.result.length > 0) {
          this.tableData = {
            currentPage: response.pagination.currentPage,
            itemsPerPage: response.pagination.itemsPerPage,
            totalItems: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
            pageNumbers: Array(response.pagination.totalPages)
              .fill(0)
              .map((x, i) => i + 1),
            tableRows: response.result.map((m) => ({
              0: { value: m.agentName },
              1: {
                value: m.agentName,
                link: m.agentId,
                class: 'primary_link',
                linkable: true,
              },
              2: { value: m.noOfCalls },
              3: { value: m.totalScore },
              4: { value: m.agentScored },
              5: { value: m.averagePercentage },
              6: { value: m.noOfForms },
              7: { value: m.aht },
            })),
          };
        } else {
          this.tableData = {
            fileUrl: environment.fileUrl,
            tableRows: [],
          };
        }
      });
  }

  searchKey(event) {
    if (event) {
      this.isLoading = true;
      this.dashboardService
        .getSearchedTableData(event, this.pageNumber, this.pageSize)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.tableMessage = { isUpdating: false, text: '' };
          })
        )
        .subscribe((response) => {
          if (response.result.length > 0) {
            this.tableData = {
              currentPage: response.pagination.currentPage,
              itemsPerPage: response.pagination.itemsPerPage,
              totalItems: response.pagination.totalItems,
              totalPages: response.pagination.totalPages,
              pageNumbers: Array(response.pagination.totalPages)
                .fill(0)
                .map((x, i) => i + 1),
              tableRows: response.result.map((m) => ({
                0: { value: m.agentName },
                1: {
                  value: m.agentName,
                  link: m.agentId,
                  class: 'primary_link',
                  linkable: true,
                },
                2: { value: m.noOfCalls },
                3: { value: m.totalScore },
                4: { value: m.agentScored },
                5: { value: m.averagePercentage },
                6: { value: m.noOfForms },
                7: { value: m.aht },
              })),
            };
          } else {
            this.tableData = {
              fileUrl: environment.fileUrl,
              tableRows: [],
            };
          }
        });
    } else {
      this.fillTableRows();
    }
  }

  getAgentId(id: any) {
    this.router.navigate(['/agent-dashboard'], {
      queryParams: { agentId: id },
    });
  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }

  openTab(tabName: string) {
    this.SelectGraphShow(tabName);
  }

  openAuditPassDataPopup(sectionName: any, sectionId: number, data: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      sectionId: sectionId,
      popupPosition: 'center',
      heading: sectionName,
      width: '90vw',
      height: '90vh',
      popup: ChartPopupComponent,
    });
  }

  openFormsDataPopup() {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      popupPosition: 'center',
      heading: 'Forms Data',
      width: '90vw',
      height: '90vh',
      popup: FormsDataPopupComponent,
    });
  }

  openUserMenu(e: MouseEvent) {
    this.isItFirstTime = true;
    if (this.isUserMenuOpened) {
      this.isUserMenuOpened = false;
    } else {
      this.isUserMenuOpened = true;
    }
  }

  @HostListener('document:click')
  public onDocumentClick() {
    if (this.isUserMenuOpened && !this.isItFirstTime) {
      this.isUserMenuOpened = false;
    } else {
      this.isItFirstTime = false;
    }
  }
  showStats(dateFilter: string) {
    // if (dateFilter === 'Today'){
    //   this.dayActive = true; this.weekActive = false; this.monthActive = false;this.historyActive=false;
    // } else if(dateFilter === 'Weekly'){
    //   this.dayActive = false; this.weekActive = true; this.monthActive = false;this.historyActive=false;
    // } else if (dateFilter === 'Monthly'){
    //   this.dayActive = false; this.weekActive = false; this.monthActive = true;this.historyActive=false;
    // }
    // else if (dateFilter === 'Total'){
    //     this.dayActive = false; this.weekActive = false; this.monthActive = false;this.historyActive=true;
    // }
    // this.SetReportTime(dateFilter);
    this.GetDashboardData(dateFilter);
  }

  key: string = 'id';
  reverse: boolean = false;

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  SelectPerformanceGraphShow(graphName: string) {
    if (graphName === 'Day') {
      this.MonthChartShow = false;
      this.WeekChartShow = true;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget1_tab1ChartData = data.widget1.tab1.content;

        const canvas = <HTMLCanvasElement>(
          document.getElementById('widget1_tab1Chart')
        );
        const ctx = canvas?.getContext('2d');

        var datasetsArray = this.widget1_tab1ChartData.body.data.map((m) => ({
          label: m.name,
          data: m.values,
          backgroundColor: m.bg,
          barThickness: 20,
        }));

        let dataObj = {
          labels: this.widget1_tab1ChartData.body.legends,
          datasets: datasetsArray,
        };

        var myChart = new Chart(ctx, {
          type: 'bar',
          data: dataObj,
          options: {
            plugins: {
              labels: false,
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                },
              ],
              yAxes: [
                {
                  stacked: true,
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: this.widget1_tab1ChartData.body.chartTitle,
                  },
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                boxWidth: 2,
                fontSize: 13,
                fontColor: 'rgba(0, 0, 0, 1)',
              },
              display: true, //This will hide the label above the graph
              position: 'bottom',
            },
          },
        });
      });
    }
    if (graphName === 'Month') {
      this.MonthChartShow = true;
      this.WeekChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget1_tab2ChartData = data.widget1.tab2.content;

        const canvas = <HTMLCanvasElement>(
          document.getElementById('widget1_tab2Chart')
        );
        const ctx = canvas?.getContext('2d');

        var datasetsArray = this.widget1_tab2ChartData.body.data.map((m) => ({
          label: m.name,
          data: m.values,
          backgroundColor: m.bg,
          barThickness: 20,
        }));

        let dataObj = {
          labels: this.widget1_tab2ChartData.body.legends,
          datasets: datasetsArray,
        };

        var myChart = new Chart(ctx, {
          type: 'bar',
          data: dataObj,
          options: {
            plugins: {
              labels: false,
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                },
              ],
              yAxes: [
                {
                  stacked: true,
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: this.widget1_tab2ChartData.body.chartTitle,
                  },
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                boxWidth: 2,
                fontSize: 13,
                fontColor: 'rgba(0, 0, 0, 1)',
              },
              display: true, //This will hide the label above the graph
              position: 'bottom',
            },
          },
        });
      });
    }
  }

  SelectGraphShow(graphName: string) {
    if (graphName === 'IdvCompliance') {
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = true;
      this.pciComplianceChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget2_tab1ChartData = data.widget2.tab1.content;

        var canvas = document.getElementById(
          'widget2_tab1Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget2_tab1ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget2_tab1ChartData.body.chartTitle,
                data: this.widget2_tab1ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget2_tab1ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget2_tab1ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'PciCompliance') {
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = true;

      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget2_tab2ChartData = data.widget2.tab2.content;
        var canvas = document.getElementById(
          'widget2_tab2Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget2_tab2ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget2_tab2ChartData.body.chartTitle,
                data: this.widget2_tab2ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget2_tab2ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget2_tab2ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'Section') {
      this.queryStatusChartShow = false;
      this.sectionChartShow = true;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = false;

      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget2_tab3ChartData = data.widget2.tab3.content;
        var canvas = document.getElementById(
          'widget2_tab3Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget2_tab3ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget2_tab3ChartData.body.chartTitle,
                data: this.widget2_tab3ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget2_tab3ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget2_tab3ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'queryStatus') {
      this.queryStatusChartShow = true;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget2_tab4ChartData = data.widget2.tab4.content;

        var canvas = document.getElementById(
          'widget2_tab4Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget2_tab4ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget2_tab4ChartData.body.chartTitle,
                data: this.widget2_tab4ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget2_tab4ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget2_tab4ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    }
  }

  categorizationChart(graphName: string) {
    if (graphName === 'journey') {
      this.categorizationJourneyChartShow = true;
      this.categorizationSubJourneyChartShow = false;
      this.categorizationCustomerIntentChartShow = false;
      this.categorizationCallDriversChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget3_tab1ChartData = data.widget3.tab1.content;

        var canvas = document.getElementById(
          'widget3_tab1Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget3_tab1ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget3_tab1ChartData.body.chartTitle,
                data: this.widget3_tab1ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget3_tab1ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget3_tab1ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'subJourney') {
      this.categorizationJourneyChartShow = false;
      this.categorizationSubJourneyChartShow = true;
      this.categorizationCustomerIntentChartShow = false;
      this.categorizationCallDriversChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget3_tab2ChartData = data.widget3.tab2.content;

        var canvas = document.getElementById(
          'widget3_tab2Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget3_tab2ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget3_tab2ChartData.body.chartTitle,
                data: this.widget3_tab2ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget3_tab2ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget3_tab2ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'customerIntent') {
      this.categorizationJourneyChartShow = false;
      this.categorizationSubJourneyChartShow = false;
      this.categorizationCustomerIntentChartShow = true;
      this.categorizationCallDriversChartShow = false;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget3_tab3ChartData = data.widget3.tab3.content;

        var canvas = document.getElementById(
          'widget3_tab3Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget3_tab3ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget3_tab3ChartData.body.chartTitle,
                data: this.widget3_tab3ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget3_tab3ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                // boxWidth:8,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget3_tab3ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
            onClick: (e) => {
              console.log(
                chartStatus.getElementsAtEvent(e)[0]['_chart']['config'][
                'data'
                ]['datasets'][0]['pointRadius'][
                chartStatus.getElementsAtEvent(e)[0]['_index']
                ]
              );
            },
          },
        });
      });
    } else if (graphName === 'callDrivers') {
      this.categorizationJourneyChartShow = false;
      this.categorizationSubJourneyChartShow = false;
      this.categorizationCustomerIntentChartShow = false;
      this.categorizationCallDriversChartShow = true;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        this.widget3_tab4ChartData = data.widget4.tab1.content;

        var canvas = document.getElementById(
          'widget3_tab4Chart'
        ) as HTMLCanvasElement;
        var ctx = canvas.getContext('2d');
        var chartStatus = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.widget3_tab4ChartData.body.data.map((m) => {
              return m.name;
            }),
            datasets: [
              {
                label: this.widget3_tab4ChartData.body.chartTitle,
                data: this.widget3_tab4ChartData.body.data.map((m) => {
                  return m.values.reduce((arr, item) => {
                    return arr + item;
                  });
                }),
                backgroundColor: this.widget3_tab4ChartData.body.data.map(
                  (m) => {
                    return m.bg;
                  }
                ),
              },
            ],
          },
          options: {
            plugins: {
              labels: [
                {
                  render: 'label',
                  position: 'outside',
                  fontSize: 11,
                  offset: 5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                },
                {
                  render: 'percentage',
                  fontColor: '#fff',
                  fontSize: 10,
                },
              ],
            },
            legend: {
              labels: {
                usePointStyle: true,
                fontSize: 10,
                fontColor: 'black',
              },
              display: false, //This will hide the label above the graph
              position: 'right',
            },
            title: {
              display: true,
              text: this.widget3_tab4ChartData.body.chartTitle,
            },
            tooltips: {
              enabled: true,
            },
            responsive: true,
          },
        });
      });
    }
  }

  GetDashboardData(timePeriod) {
    console.log(timePeriod);
  }

  GetStatsMailboxAddress(mailboxAd: string) {
    // if (mailboxAd != "All") {
    //     this.mailboxAddress = mailboxAd.toLowerCase() + '@exlservice.com';
    //     this.Transactionservice.getDashboardDetailsbyMailbox(this.mailboxAddress).subscribe(data => {
    //         this.DashDetailsData = data;
    //     });
    // }
    // else {
    //     this.mailboxAddress = mailboxAd.toLowerCase();
    //     this.Transactionservice.getDashboardDetailsbyMailboxAll().subscribe(data => {
    //         this.DashDetailsData = data;
    //     });
    // }
    if (this.timePeriod == 'Today') {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService.getStatsbyMailbox(mailboxAd).subscribe((data) => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage =
            (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (mailboxAd == 'All') {
            this.dashboardService
              .getStatsAvgTATToday(mailboxAd)
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Today', mailboxAd)
              .subscribe((data) => (this.setimentData = data));
          } else {
            this.dashboardService
              .getStatsAvgTATToday(mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Today', mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.setimentData = data));
          }
        });
      });
      this.dashboardService.getStatsbyMailbox(mailboxAd).subscribe((data) => {
        this.pending = data.pendingCount;
        this.completed = data.completedCount;
        this.total = data.totalCount;
        this.pendingStat = data.pendingCount;
        this.completedStat = data.completedCount;
        this.totalStat = data.totalCount;
        this.hold = data.holdCount;
        this.slaMissed = data.slaMissed;
        this.actionOriented = data.actionOriented;
        this.actionOrientedPercentage =
          (this.actionOriented / this.total) * 100;
        this.pendingPercentage = (this.pending / this.total) * 100;
        this.completedPercentage = (this.completed / this.total) * 100;
        this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
        this.StatusChart(this.total, this.completed, this.pending);
        if (mailboxAd == 'All') {
          this.dashboardService
            .getStatsAvgTATToday(mailboxAd)
            .subscribe((data) => (this.avgTAT = data));
          this.dashboardService
            .getSentimentDetails('Today', mailboxAd)
            .subscribe((data) => (this.setimentData = data));
        } else {
          this.dashboardService
            .getStatsAvgTATToday(mailboxAd + '@exlservice.com')
            .subscribe((data) => (this.avgTAT = data));
          this.dashboardService
            .getSentimentDetails('Today', mailboxAd + '@exlservice.com')
            .subscribe((data) => (this.setimentData = data));
        }
      });
    } else if (this.timePeriod == 'Total') {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService
          .getStatsbyMailboxTotal(mailboxAd)
          .subscribe((data) => {
            this.pending = data.pendingCount;
            this.completed = data.completedCount;
            this.total = data.totalCount;
            this.hold = data.holdCount;
            this.slaMissed = data.slaMissed;
            this.actionOriented = data.actionOriented;
            this.actionOrientedPercentage =
              (this.actionOriented / this.total) * 100;
            this.pendingPercentage = (this.pending / this.total) * 100;
            this.completedPercentage = (this.completed / this.total) * 100;
            this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
            this.StatusChart(this.total, this.completed, this.pending);
            if (mailboxAd == 'All') {
              this.dashboardService
                .getStatsAvgTATTotal(mailboxAd)
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Total', mailboxAd)
                .subscribe((data) => (this.setimentData = data));
            } else {
              this.dashboardService
                .getStatsAvgTATTotal(mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Total', mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.setimentData = data));
            }
          });
      });
      this.dashboardService
        .getStatsbyMailboxTotal(mailboxAd)
        .subscribe((data) => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage =
            (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (mailboxAd == 'All') {
            this.dashboardService
              .getStatsAvgTATTotal(mailboxAd)
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Total', mailboxAd)
              .subscribe((data) => (this.setimentData = data));
          } else {
            this.dashboardService
              .getStatsAvgTATTotal(mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Total', mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.setimentData = data));
          }
        });
    } else if (this.timePeriod == 'Monthly') {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService
          .getStatsbyMailboxMonthly(mailboxAd)
          .subscribe((data) => {
            this.pending = data.pendingCount;
            this.completed = data.completedCount;
            this.total = data.totalCount;
            this.hold = data.holdCount;
            this.slaMissed = data.slaMissed;
            this.actionOriented = data.actionOriented;
            this.actionOrientedPercentage =
              (this.actionOriented / this.total) * 100;
            this.pendingPercentage = (this.pending / this.total) * 100;
            this.completedPercentage = (this.completed / this.total) * 100;
            this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
            this.StatusChart(this.total, this.completed, this.pending);
            if (mailboxAd == 'All') {
              this.dashboardService
                .getStatsAvgTATMonth(mailboxAd)
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Monthly', mailboxAd)
                .subscribe((data) => (this.setimentData = data));
            } else {
              this.dashboardService
                .getStatsAvgTATMonth(mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Monthly', mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.setimentData = data));
            }
          });
      });
      this.dashboardService
        .getStatsbyMailboxMonthly(mailboxAd)
        .subscribe((data) => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage =
            (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (mailboxAd == 'All') {
            this.dashboardService
              .getStatsAvgTATMonth(mailboxAd)
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Monthly', mailboxAd)
              .subscribe((data) => (this.setimentData = data));
          } else {
            this.dashboardService
              .getStatsAvgTATMonth(mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Monthly', mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.setimentData = data));
          }
        });
    } else if (this.timePeriod == 'Weekly') {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService
          .getStatsbyMailboxWeekly(mailboxAd)
          .subscribe((data) => {
            this.pending = data.pendingCount;
            this.completed = data.completedCount;
            this.total = data.totalCount;
            this.hold = data.holdCount;
            this.slaMissed = data.slaMissed;
            this.actionOriented = data.actionOriented;
            this.actionOrientedPercentage =
              (this.actionOriented / this.total) * 100;
            this.pendingPercentage = (this.pending / this.total) * 100;
            this.completedPercentage = (this.completed / this.total) * 100;
            this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
            this.StatusChart(this.total, this.completed, this.pending);
            if (mailboxAd == 'All') {
              this.dashboardService
                .getStatsAvgTATWeek(mailboxAd)
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Weekly', mailboxAd)
                .subscribe((data) => (this.setimentData = data));
            } else {
              this.dashboardService
                .getStatsAvgTATWeek(mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.avgTAT = data));
              this.dashboardService
                .getSentimentDetails('Weekly', mailboxAd + '@exlservice.com')
                .subscribe((data) => (this.setimentData = data));
            }
          });
      });
      this.dashboardService
        .getStatsbyMailboxWeekly(mailboxAd)
        .subscribe((data) => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage =
            (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (mailboxAd == 'All') {
            this.dashboardService
              .getStatsAvgTATWeek(mailboxAd)
              .subscribe((data) => (this.avgTAT = data));
            this.dashboardService
              .getSentimentDetails('Weekly', mailboxAd)
              .subscribe((data) => (this.setimentData = data));
          } else {
            this.dashboardService
              .getStatsAvgTATWeek(mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.avgTAT = data));

            this.dashboardService
              .getSentimentDetails('Weekly', mailboxAd + '@exlservice.com')
              .subscribe((data) => (this.setimentData = data));
          }
        });
    }

    this.dashboardService.getStatsbyMailbox('All').subscribe((data) => {
      this.pendingmail = data.pendingCount;
      this.completedmail = data.completedCount;
      this.totalmail = data.totalCount;
    });
    this.SentimentChart(1, 1, 1);
  }

  FailedAuditDayChart(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('FailedAuditDayChart')
    );
    const ctx = canvas?.getContext('2d');

    // 'hsl(354, 68%, 48%)',
    // 'hsl(301, 17%, 46%)',
    // 'hsl(24, 93%, 56%)'

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'Billing',
          data: data.value1,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(354, 68%, 48%)',
        },
        {
          label: 'Invoice',
          data: data.value2,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(301, 17%, 46%)',
        },
        {
          label: 'Finance',
          data: data.value3,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(24, 93%, 56%)',
        },
      ],
    };

    var myChart = new Chart(ctx, {
      type: 'line',
      data: dataObj,
      options: {
        plugins: {
          labels: false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                beginAtZero: true,
                // stepSize:30,
                // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
                // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
              },
              scaleLabel: {
                display: true,
                labelString: 'No. of transaction',
              },
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
      },
    });
  }

  FailedAuditMonthChart(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>(
      document.getElementById('FailedAuditMonthChart')
    );
    const ctx = canvas?.getContext('2d');
    // 'hsl(354, 68%, 48%)',
    // 'hsl(301, 17%, 46%)',
    // 'hsl(24, 93%, 56%)'

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'Billing',
          data: data.value1,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(354, 68%, 48%)',
        },
        {
          label: 'Invoice',
          data: data.value2,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(301, 17%, 46%)',
        },
        {
          label: 'Finance',
          data: data.value3,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(24, 93%, 56%)',
        },
      ],
    };

    var myChart = new Chart(ctx, {
      type: 'line',
      data: dataObj,
      options: {
        plugins: {
          labels: false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                beginAtZero: true,
                // stepSize:30,
                // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
                // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
              },
              scaleLabel: {
                display: true,
                labelString: 'No. of transaction',
              },
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
      },
    });
  }

  categorizationJourneyChart(labels: any, data: any) {
    var canvas = document.getElementById(
      'categorizationJourneyChart'
    ) as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'No of Transaction',
            data: data,
            backgroundColor: [
              'hsl(123, 40%, 46%)',
              'hsl(4, 89%, 55%)',
              'hsl(36, 100%, 47%)',
              'hsl(211, 54%, 41%)',
              'hsl(3, 100%, 77%)',
              'hsl(73, 100%, 97%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: [
            {
              render: 'label',
              position: 'outside',
              fontSize: 11,
              offset: 5,
              fontStyle: 'bold',
              fontColor: '#000',
            },
            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black',
          },
          display: false, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'No. of Records',
        },
        tooltips: {
          enabled: true,
        },
        responsive: true,
      },
    });
  }
  categorizationSubJourneyChart(labels: any, data: any) {
    var canvas = document.getElementById(
      'categorizationSubJourneyChart'
    ) as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'No of Transaction',
            data: data,
            backgroundColor: [
              'hsl(123, 40%, 46%)',
              'hsl(4, 89%, 55%)',
              'hsl(36, 100%, 47%)',
              'hsl(211, 54%, 41%)',
              'hsl(3, 100%, 77%)',
              'hsl(73, 100%, 97%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: [
            {
              render: 'label',
              position: 'outside',
              fontSize: 11,
              offset: 5,
              fontStyle: 'bold',
              fontColor: '#000',
            },
            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black',
          },
          display: false, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'No. of Records',
        },
        tooltips: {
          enabled: true,
        },
        responsive: true,
      },
    });
  }
  categorizationCustomerIntentChart(labels: any, data: any) {
    var canvas = document.getElementById(
      'categorizationCustomerIntentChart'
    ) as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'No of Transaction',
            data: data,
            backgroundColor: [
              'hsl(123, 40%, 46%)',
              'hsl(4, 89%, 55%)',
              'hsl(36, 100%, 47%)',
              'hsl(211, 54%, 41%)',
              'hsl(272, 100%, 50%)',
              'hsl(341, 100%, 50%)',
              'hsl(22, 100%, 41%)',
              'hsl(81, 100%, 26%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: [
            {
              render: 'label',
              position: 'outside',
              fontSize: 11,
              offset: 5,
              fontStyle: 'bold',
              fontColor: '#000',
            },
            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black',
          },
          display: false, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'No. of Records',
        },
        tooltips: {
          enabled: true,
        },
        responsive: true,
      },
    });
  }

  SLAMissedChart() {
    const ctx = document.getElementById('SLAMissedChart') as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.slaChartLabel,
        datasets: [
          {
            label: 'Pending',
            data: this.pendingSlaDataValue,
            backgroundColor: 'hsl(205, 100%, 50%)',
            borderWidth: 4,
            barPercentage: 0.4,
            pointRadius: 2,
            fill: true,
            borderColor: 'hsl(205, 100%, 50%)',
            barThickness: 20,
            maxBarThickness: 20,
            minBarLength: 2,
          },
          {
            label: 'Completed',
            data: this.completedSlaDataValue,
            backgroundColor: 'hsl(23, 100%, 51%)',
            borderWidth: 4,
            barPercentage: 0.4,
            pointRadius: 2,
            fill: true,
            borderColor: 'hsl(23, 100%, 51%)',
            barThickness: 20,
            maxBarThickness: 20,
            minBarLength: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          labels: {
            render: 'value',
            textMargin: 4,
          },
        },
        onClick: (e) => {
          let points: any = {};
          points = myChart.getElementAtEvent(e);
          let arr = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];

          if (points[0]._datasetIndex == 0) {
            this.pendingSlaPopUpData = [];
            let labelMonth = points[0]._view.label.slice(0, 3);
            this.pendingSlaPopUpDataCopy.forEach((element) => {
              if (labelMonth == arr[element.mailRecievedTime.slice(6, 7) - 1]) {
                let index = arr.indexOf(labelMonth) + 1;
                this.pendingSlaPopUpData = this.pendingSlaPopUpDataCopy.filter(
                  (res) => {
                    let data = res;
                    if (data.mailRecievedTime.slice(6, 7) == index) {
                      return res;
                    }
                  }
                );
              }
            });

            this.showSLAMissedPopup = true;
          } else if (points[0]._datasetIndex == 1) {
            this.completedSlaPopUpData = [];
            let labelMonth = points[0]._view.label.slice(0, 3);
            this.completedSlaPopUpDataCopy.forEach((element) => {
              if (labelMonth == arr[element.mailRecievedTime.slice(6, 7) - 1]) {
                let index = arr.indexOf(labelMonth) + 1;
                this.completedSlaPopUpData =
                  this.completedSlaPopUpDataCopy.filter((res) => {
                    let data = res;
                    if (data.mailRecievedTime.slice(6, 7) == index) {
                      return res;
                    }
                  });
              }
            });
            this.showCompletedSLAPopup = true;
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                beginAtZero: true,
                //    stepSize:2,
                //max:Math.max(this.slaPerformanceChart.dataValue)+5,
                //stepSize:Math.round((Math.max(this.slaChartdata[0],this.slaChartdata[1])+5)/3)
                //max:Math.max(this.slaChartdata[0],this.slaChartdata[1])+Math.round((Math.max(this.slaChartdata[0],this.slaChartdata[1])+5)/3)
              },
              scaleLabel: {
                display: true,
                labelString: 'No. of transactions',
              },
            },
          ],
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        maintainAspectRatio: true,
      },
    });
  }

  openPopupTATStats() {
    this.showTATPopup = true;
    this.dashboardService.getCountofTATPerformanceChart().subscribe((data) => {
      this.tatperformanceChart = data;
      //   this.TATChart();
    });
  }

  openPopupUserStats() {
    this.showUserPopup = true;
  }

  closeUserPopup() {
    this.showUserPopup = false;
  }

  openIntentCountDistributionPopup() {
    this.showIntentCountonTotalPopup = true;
  }

  closeIntentCountDistributionPopup() {
    this.showIntentCountonTotalPopup = false;
  }

  openSlaPopup() {
    this.showSLAMissedPopup = true;
    console.log('hi');
  }

  openCompletedSlaPopup() {
    this.showCompletedSLAPopup = true;
  }

  closeSlaPopup() {
    this.showSLAMissedPopup = false;
  }

  closeCompletedSlaPopup() {
    this.showCompletedSLAPopup = false;
  }

  // SyncScheduler()
  // {
  //   //this is to run scheduler on Demand
  //   this.graphtokenService.runScheduler().subscribe(data => data);
  //   this.graphtokenService.getGraphToken().subscribe(data => this.graphToken =data);
  //     this.ngOnInit();
  // }

  SetReportTime(timePeriod: string) {
    this.timePeriod = timePeriod;
  }

  // UpdateStatsChart(monthlyChartObj:any)
  // {
  //     var ctx = document.getElementById('chart_DailyPerformance');
  //     var myChart = new Chart("chart_DailyPerformance", {
  //         type: 'bar',
  //         data: {
  //             labels: monthlyChartObj.labels,
  //             // labels:["Sep 21","Oct 21","Nov 21"],
  //             datasets: [{
  //               label: 'Total',
  //             //   data: [50,29,this.totalmail],
  //             data:monthlyChartObj.total,
  //             // data: [398,442,63],
  //             //   backgroundColor: [
  //             //       'rgba(0, 0, 255, 0.2)',
  //             //       'rgba(0, 0, 255, 0.2)',
  //             //       'rgba(0, 0, 255, 0.2)',

  //             //   ],
  //             //   borderColor: [
  //             //       'rgba(0, 0, 255, 1)',
  //             //       'rgba(0, 0, 255, 1)',
  //             //       'rgba(0, 0, 255, 1)',

  //             //   ],
  //             backgroundColor:"hsl(213, 5%, 54%,0.8)",
  //               borderWidth: 1,
  //               barPercentage: 20,
  //               barThickness: 20,
  //               maxBarThickness: 20,
  //               minBarLength: 2,
  //           },
  //           {
  //             label: 'Completed',
  //             // data: [48,13,this.completedmail],
  //             data:monthlyChartObj.completed,
  //             // data:this.DashDetailsData[0]?.completed,
  //             // data :[370,397,12],
  //             // backgroundColor: [
  //             //     'rgba(0, 255, 0, 0.2)',
  //             //     'rgba(0, 255, 0, 0.2)',
  //             //     'rgba(0, 255, 0, 0.2)',

  //             // ],
  //             // borderColor: [
  //             //     'rgba(0, 255, 0, 1)',
  //             //     'rgba(0, 255, 0, 1)',
  //             //     'rgba(0, 255, 0, 1)',

  //             // ],
  //             backgroundColor:"hsl(23, 100%, 51%)",
  //             borderWidth: 1,
  //             barPercentage: 20,
  //             barThickness: 20,
  //             maxBarThickness: 20,
  //             minBarLength: 2,
  //         },
  //         {
  //             label: 'Pending',
  //             // data:[2,16,this.pendingmail] ,
  //             data: monthlyChartObj.pending,
  //             // data:this.DashDetailsData[0]?.pending+this.DashDetailsData[0]?.hold,
  //             // data:[28,45,51],
  //             // backgroundColor: [
  //             //     'rgba(255, 0, 0, 0.2)',
  //             //     'rgba(255, 0, 0, 0.2)',
  //             //     'rgba(255, 0, 0, 0.2)',

  //             // ],
  //             // borderColor: [
  //             //     'rgba(255, 0, 0, 1)',
  //             //     'rgba(255, 0, 0, 1)',
  //             //     'rgba(255, 0, 0, 1)',

  //             // ],
  //             backgroundColor:"hsl(205, 100%, 50%)",
  //             borderWidth: 1,
  //             barPercentage: 20,
  //             barThickness: 20,
  //             maxBarThickness: 20,
  //             minBarLength: 2,
  //         }
  //          ]
  //         },
  //         options: {
  //             plugins:{
  //                 labels:{
  //                     render: 'value',
  //                     fontSize: 10,
  //                 }
  //             },
  //             scales: {
  //               xAxes: [{
  //                   gridLines: {
  //                       color: "rgba(0, 0, 0, 0)",
  //                   }
  //               }],
  //               yAxes: [{
  //                   gridLines: {
  //                       color: "rgba(0, 0, 0, 0)",
  //                   } ,
  //                   ticks: {
  //                     // max:Math.max(monthlyChartObj.total)+5,
  //                     // stepSize:Math.round((Math.max(monthlyChartObj.total)+5)/3),
  //                     stepSize:Math.round((Math.max(monthlyChartObj.total)+5)/3),
  //                     // max:Math.round(Math.max(monthlyChartObj.total)+Math.round((Math.max(monthlyChartObj.total)+5)/3)),
  //                     beginAtZero: true,
  //                   },
  //                   scaleLabel: {
  //                     display: true,
  //                     labelString: 'No. of transactions'
  //                   }
  //               }]
  //             },
  //             legend: {
  //             labels : {
  //             usePointStyle: true,
  //             boxWidth:4,
  //             fontSize:15,
  //             fontFamily:'Roboto',
  //             fontColor:'black'

  //         },
  //               display: true, //This will hide the label above the graph
  //               position:'bottom',
  //            },
  //            tooltips: {
  //               enabled: true
  //           },
  //           maintainAspectRatio: true,
  //           responsive: true
  //         }
  //     });
  // }

  StatusChart(total: number, completed: number, pending: number) {
    var ctx = document.getElementById('chart_Status');
    var chartStatus = new Chart('chart_Status', {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending', 'Hold'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [completed, pending, this.hold],
            backgroundColor: [
              'hsl(205, 100%, 30%)',
              'hsl(205, 100%, 60%)',
              'hsl(213, 5%, 54%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'outside',
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true,
        },
        responsive: true,
      },
    });
  }

  MailboxChart() {
    var ctx = document.getElementById('chart_mailbox');
    var chartStatus = new Chart('chart_mailbox', {
      type: 'doughnut',
      data: {
        labels: this.mailboxChart?.dataLabel,
        datasets: [
          {
            label: 'My First Dataset',
            //data: [92,112,108,129],
            data: this.mailboxChart?.dataValue,
            backgroundColor: [
              'hsl(205, 100%, 25%)',
              'hsl(205, 100%, 45%)',
              'hsl(205, 100%, 65%)',
              'hsl(205, 100%, 85%)',
              'hsl(205, 100%, 30%)',
              'hsl(213, 5%, 44%)',
              'hsl(213, 5%, 64%)',
              'hsl(213, 5%, 84%)',
              'hsl(23, 100%, 51%)',
              'hsl(23, 100%, 71%)',
              'hsl(23, 100%, 91%)',
              ,
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'outside',
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: true,
        responsive: true,
      },
    });
  }

  IntentSentimentChart() {
    this.ngOnChanges();
    var ctx = document.getElementById('chart_intentSentiment');
    var chartStatus = new Chart('chart_intentSentiment', {
      type: 'doughnut',
      data: {
        labels: [
          this.intentChart?.dataLabel[1],
          this.intentChart?.dataLabel[3],
          this.intentChart?.dataLabel[4],
        ],
        // labels: this.intentChart ?.dataLabel,
        datasets: [
          {
            label: 'My First Dataset',
            //data: [30,25,25,15,5],
            // data:this.intentChart?.dataValue,
            data: [
              this.intentChart?.dataValue[1],
              this.intentChart?.dataValue[3],
              this.intentChart?.dataValue[4],
            ],
            backgroundColor: [
              'hsl(205, 100%, 25%)',
              'hsl(205, 100%, 45%)',
              'hsl(205, 100%, 65%)',
              'hsl(205, 100%, 85%)',
              'hsl(205, 100%, 30%)',
              'hsl(213, 5%, 44%)',
              'hsl(213, 5%, 64%)',
              'hsl(213, 5%, 84%)',
              'hsl(23, 100%, 51%)',
              'hsl(23, 100%, 71%)',
              'hsl(23, 100%, 91%)',
            ],
          },
          //     {
          //     label: 'My First Dataset',
          //     data: [70,10,20],
          //     backgroundColor: [
          //         'rgb(69, 184, 69)',
          //       'grey',
          //       'rgb(219, 98, 98)'
          //     ],
          //   }
        ],
      },
      options: {
        plugins: {
          labels: {
            fontFamily: 'Roboto',
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: true,
        responsive: true,
      },
    });
  }
  ngOnChanges() {
    throw new Error('Method not implemented.');
  }

  SentimentChart(total: number, completed: number, pending: number) {
    var ctx = document.getElementById('chart_Sentiment');
    var chartStatus = new Chart('chart_Sentiment', {
      type: 'doughnut',
      data: {
        labels: this.setimentData.dataLabel,
        datasets: [
          {
            label: 'My First Dataset',
            data: this.setimentData.dataValue,
            backgroundColor: [
              'hsl(205, 100%, 60%)',
              'hsl(213, 5%, 54%)',
              'hsl(23, 100%, 61%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: true,
        responsive: true,
      },
    });
  }

  PriorityChart() {
    //prahlad
    var ctx = document.getElementById('chart_priority');
    var chartStatus = new Chart('chart_priority', {
      type: 'doughnut',
      data: {
        // labels:this.PriorityChartData.dataLabel,
        labels: ['Low', 'Medium', 'High'],
        datasets: [
          {
            label: 'My First Dataset',
            // data: this.PriorityChartYearData.dataValue,
            data: [
              this.PriorityChartYearData?.dataValue,
              this.PriorityChartMonthData?.dataValue,
              this.PriorityChartDayData?.dataValue,
            ],
            // data: [52, 20, 200],
            backgroundColor: [
              'hsl(205, 100%, 60%)',
              'hsl(213, 5%, 54%)',
              'hsl(23, 100%, 61%)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true,
        },
        maintainAspectRatio: true,
        responsive: true,
      },
    });
  }
}
