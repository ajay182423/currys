import { Component, HostListener, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { IEmailList } from '../../interfaces/email-param';
import { IGraphToken } from '../../interfaces/graph/graphtoken-param';
import { IMailboxList } from '../../interfaces/mailbox-param';
import { SlaPerformance } from '../../interfaces/slaPerformance';
import { IStatsList } from '../../interfaces/Stats-param';
import { ITATPerformance } from '../../interfaces/tat-performance-param';
import { ITeamStatsList } from '../../interfaces/teamstats-param';
import { DashboardService } from '../../services/dashboard.service';
import { finalize } from 'rxjs/operators';
import { FormService } from '../../services/settings/form.service';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ChartPopupComponent } from './chartPopup/chart-popup.component';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { FormsDataPopupComponent } from './formsDataPopup/forms-data-popup.component';
import { Router } from '@angular/Router';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {



  // New Dashboard Properties


  pageNumber: number = 1;
  pageSize: number = 10;

  fileUrl: string = environment.fileUrl;
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
  userAssignClass: string = "nav-link user-link";
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
  monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Updated Properties

  auditFormList: any = [];
  auditParameterResultList: any = [];
  totalAuditRecords: number;
  completedAuditRecords: number;
  pendingAuditRecords: number;
  callAuditedHours: number;
  averageScore: number;
  callAuditedMins: any;
  inventoryDayChartObj: { labels: string[], data: any[] } = { labels: [], data: [] };
  inventoryMonthChartObj: { labels: string[], data: any[] } = { labels: [], data: [] };
  parameterMonthChartObj: { labels: string[], data: any[] } = { labels: [], data: [] };
  parameterDayChartObj: { labels: string[], data: any[] } = { labels: [], data: [] };
  sectionAuditFailedDayChartShow: boolean;
  sectionAuditFailedMonthChartShow: boolean;
  AHT: any;
  agentData: any;
  formList: any[]

  agentJsonUrl: string = environment.jsonFilesUrl + 'dashboard-agent-table.json';


  tableMessage: any = {};
  isLoading: boolean = false;

  tableHeaders: any = [
    { id: 1, name: "Agent Name", order: 'desc', type: 'string', class: 'th-sort' },
    { id: 2, name: "No. of Calls", order: 'desc', type: 'number', class: 'th-sort' },
    { id: 3, name: "Total Score", order: 'desc', type: 'number', class: 'th-sort' },
    { id: 4, name: "Agent Scored", order: 'desc', type: 'number', class: 'th-sort' },
    { id: 5, name: "Quality", order: 'desc', type: 'number', class: 'th-sort' },
    { id: 6, name: "No. of Form", order: 'desc', type: 'number', class: 'th-sort' },
    { id: 7, name: "AHT", order: 'desc', type: 'number', class: 'th-sort' },
  ];
  tableData: any = [];




  constructor(
    private dashboardService: DashboardService,
    private FormService: FormService,
    private toastrService: ToastrService,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private helperService: HelperService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAuditRecordsData();
    // this.getAuditFormData();
    this.getAverageScore();
    this.SelectPerformanceGraphShow('Day');
    this.sectionAuditFailed('day');
    this.openTab('IdvCompliance');
    this.fillTableRows();
    this.getAllForms();
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

  getAllForms() {
    this.FormService.getFormList().subscribe(data => {
      this.formList = data.filter(f => f.id == 1 && f.id == 2).map(m => ({
        id: m.id,
        formName: m.formName
      }))
    })
  }

  getAuditRecordsData() {
    this.dashboardService.getAuditRecordsForSetup().subscribe(response => {
      console.log(response);
      this.totalAuditRecords = response.length;
      this.completedAuditRecords = response.filter(f => f.status.toLowerCase() == "completed").length;
      this.pendingAuditRecords = response.filter(f => f.status.toLowerCase() == "pending").length;

      let audioList = []
      response.forEach(item => {

        audioList.push(item.callDuration)
        // Create an empty array of number
        var hrsArray = [];
        var minArray = [];

        // Store length of array of string
        // in variable length
        length = audioList.length;


        for (var i = 0; i < length; i++) {

          hrsArray.push(parseInt(audioList[i].split(":")[0]));
          minArray.push(parseInt(audioList[i].split(":")[1]));
        }


        function sum_reducer(accumulator, currentValue) {
          // console.log(accumulator);
          return accumulator + currentValue;
        }
        var callAuditedHours = hrsArray.reduce(sum_reducer, 0);
        var callAuditedMins = minArray.reduce(sum_reducer, 0);
        if (this.callAuditedMins > 60) {
          callAuditedHours = (callAuditedHours + Math.floor(callAuditedMins / 60));
          callAuditedMins = callAuditedMins % 60
        }
        this.AHT = (((callAuditedHours * 60) + callAuditedMins) / 60) / response.length
        this.callAuditedHours = callAuditedHours / 60
        this.callAuditedMins = callAuditedMins
      })
    })
  }

  getAverageScore() {
    this.dashboardService.getDashboardResult().subscribe(response => {
      this.averageScore = response.quality
      this.auditFormList = response.formCount
      this.auditParameterResultList = response.auditParmCount
    })
  }



  openFormList() {
    this.openFormsDataPopup()
  }


  fillTableRows() {
    this.helperService.getJSON(this.agentJsonUrl).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text: '' };
    })).subscribe(response => {
      if (response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x, i) => i + 1),
          tableRows: response.result.map(m => ({
            0: { value: m.agentName },
            1: { value: m.agentName, link: m.agentId, class: 'primary_link', linkable: true },
            2: { value: m.noOfCalls },
            3: { value: m.totalScore },
            4: { value: m.agentScored },
            5: { value: m.averagePercentage },
            6: { value: m.noOfForms },
            7: { value: m.aht }
          }))
        };


      }
      else {
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }
    });
  }


  searchKey(event) {
    if (event) {
      this.isLoading = true;
      this.dashboardService.getSearchedTableData(event, this.pageNumber, this.pageSize).pipe(finalize(() => {
        this.isLoading = false;
        this.tableMessage = { isUpdating: false, text: '' };
      })).subscribe(response => {
        if (response.result.length > 0) {
          this.tableData = {
            currentPage: response.pagination.currentPage,
            itemsPerPage: response.pagination.itemsPerPage,
            totalItems: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
            pageNumbers: Array(response.pagination.totalPages).fill(0).map((x, i) => i + 1),
            tableRows: response.result.map(m => ({
              0: { value: m.agentName },
              1: { value: m.agentName, link: m.agentId, class: 'primary_link', linkable: true },
              2: { value: m.noOfCalls },
              3: { value: m.totalScore },
              4: { value: m.agentScored },
              5: { value: m.averagePercentage },
              6: { value: m.noOfForms },
              7: { value: m.aht }
            }))
          };


        }
        else {
          this.tableData = {
            fileUrl: environment.fileUrl,
            tableRows: []
          };
        }
      });
    }
    else {
      this.fillTableRows();
    }
  }

  getAgentId(id: any) {
    console.log(id)
    // this.router.navigate(['/agent-dashboard'],
    // { queryParams: { agentId: id}
    // })
  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }



  openTab(tabName: string) {
    this.SelectGraphShow(tabName);
  }

  SelectGraphShow(graphName: string) {
    if (graphName === 'Section') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = false;
      this.sectionChartShow = true;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = false;

      this.inventoryDayChartObj.labels = []
      this.inventoryDayChartObj.data = []
      //   this.helperService.getJSON(environment.jsonFilesUrl + 'chartData.json').subscribe(data => {
      //   this.sectionService.GetAllSection().subscribe(data => {
      this.dashboardService.getSections().subscribe(data => {
        console.log(data);
        data = data.filter(f => f.sectionId != 4)
        var sectionIds = [];
        for (var key in data) {
          this.inventoryDayChartObj.labels.push(data[key].section)
          this.inventoryDayChartObj.data.push(data[key].countResult);
          sectionIds.push(data[key].sectionId);
        }
        this.sectionCardChart(sectionIds, this.inventoryDayChartObj.labels, this.inventoryDayChartObj.data);
      })
      // this.ChartToDisplay='chart_Status
    }
    else if (graphName === 'queryStatus') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = true;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = false;

      this.dashboardService.getQueryStatus().subscribe(data => {
        var labels = data.map(m => { return m.query })
        var dataValues = data.map(m => { return m.value })

        this.queryStatusCardChart(labels.reverse(), dataValues.reverse());
      })

    }
    else if (graphName === 'IdvCompliance') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = true;
      this.pciComplianceChartShow = false;

      this.dashboardService.getIDVComplianceData().subscribe(data => {
        var labels = data.map(m => { return m.sectionstatus })
        var dataValues = data.map(m => { return m.value })

        this.IdvComplianceCardChart(labels, dataValues);
      })

    }

    else if (graphName === 'PciCompliance') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = true;

      this.dashboardService.getPCIComplianceData().subscribe(data => {
        var labels = data.map(m => { return m.sectionstatus })
        var dataValues = data.map(m => { return m.value })

        this.PciComplianceCardChart(labels, dataValues);

      })

    }

  }

  openAuditPassDataPopup(sectionName: any, sectionId: number, data: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      sectionId: sectionId,
      popupPosition: 'center',
      heading: sectionName,
      width: '90vw',
      height: '90vh',
      popup: ChartPopupComponent
    });
  }

  openFormsDataPopup() {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      popupPosition: 'center',
      heading: 'Forms Data',
      width: '90vw',
      height: '90vh',
      popup: FormsDataPopupComponent
    });
  }

  openUserMenu(e: MouseEvent) {
    this.isItFirstTime = true;
    if (this.isUserMenuOpened) {
      this.isUserMenuOpened = false;
    }
    else {
      this.isUserMenuOpened = true;
    }
  }

  @HostListener('document:click')
  public onDocumentClick() {
    if (this.isUserMenuOpened && !this.isItFirstTime) {
      this.isUserMenuOpened = false;
    }
    else {
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






  CreateDailyPerformanceGraph(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('chart_DailyPerformance');
    const ctx = canvas?.getContext('2d');

    let bgC1 = [];
    labels.forEach(element => {
      return bgC1.push('hsl(123, 40%, 46%)');
    });
    let bgC2 = [];
    labels.forEach(element => {
      return bgC2.push('hsl(4, 89%, 55%)');
    });

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'Completed',
          data: data.completed,
          backgroundColor: bgC1,
          barThickness: 20,
        },
        {
          label: 'Pending',
          data: data.pending,
          backgroundColor: bgC2,
          barThickness: 20,
        }
      ]
    }

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: dataObj,
      options: {
        plugins: {
          labels: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
              // stepSize:30,
              // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
              // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
            },
            scaleLabel: {
              display: true,
              labelString: 'No. of transaction'
            }
          }]

        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true,//This will hide the label above the graph
          position: 'bottom',

        },


      }

    });
  }

  CreateMonthlyPerformanceGraph(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('chart_MonthlyPerformance');

    // console.log(inventoryChartObj);

    const ctx = canvas?.getContext('2d');
    let bgC1 = [];
    labels.forEach(element => {
      return bgC1.push('hsl(123, 40%, 46%)');
    });
    let bgC2 = [];
    labels.forEach(element => {
      return bgC2.push('hsl(4, 89%, 55%)');
    });

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'Completed',
          data: data.completed,
          backgroundColor: bgC1,
          barThickness: 20,
        },
        {
          label: 'Pending',
          data: data.pending,
          backgroundColor: bgC2,
          barThickness: 20,
        }
      ]
    }

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: dataObj,
      options: {
        plugins: {
          labels: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
              // stepSize:30,
              // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
              // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
            },
            scaleLabel: {
              display: true,
              labelString: 'No. of transaction'
            }
          }]

        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true,//This will hide the label above the graph
          position: 'bottom',

        },


      }

    });
  }


  sectionCardChart(sectionIds: number[], labels: string[], data: number[]) {
    console.log(sectionIds)
    var canvas = document.getElementById('chart_section') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'No. of Sections',
          data: data,
          pointRadius: sectionIds,
          backgroundColor: [
            'hsl(205, 100%, 25%)',
            'hsl(205, 100%, 45%)',
            'hsl(205, 100%, 65%)'
          ],
        }]
      },
      options: {
        plugins: {
          labels: [

            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            }
          ]
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black'
          },
          display: true, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'No. of Audit Passed'
        },
        tooltips: {
          enabled: true
        },
        responsive: true,
        onClick: (e) => {
          var label = labels[chartStatus.getElementsAtEvent(e)[0]['_index']]
          let sectionId = chartStatus.getElementsAtEvent(e)[0]['_chart']['config']['data']['datasets'][0]['pointRadius'][chartStatus.getElementsAtEvent(e)[0]['_index']]
          var section_data = data[chartStatus.getElementsAtEvent(e)[0]['_index']]
          this.openAuditPassDataPopup(label, sectionId, section_data)
          console.log(chartStatus.getElementsAtEvent(e)[0]['_chart']['config']['data']['datasets'][0]['pointRadius'][chartStatus.getElementsAtEvent(e)[0]['_index']]);

          //   console.log(item);
        },
      },
    });
  }
  queryStatusCardChart(labels: string[], data: number[]) {
    var canvas = document.getElementById('chart_queryStatus') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Numbers',
          data: data,
          backgroundColor: [
            'hsl(205, 100%, 25%)',
            'hsl(205, 100%, 45%)',
            'hsl(205, 100%, 65%)',
            'hsl(205, 100%, 85%)',
            'hsl(205, 100%, 30%)',
            'hsl(213, 5%, 44%)',
          ],
        }]
      },
      options: {
        plugins: {
          labels: [

            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            }
          ]
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black'
          },
          display: true, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'Customer Query Status'
        },
        tooltips: {
          enabled: true
        },
        responsive: true
      }
    });
  }

  // auditFormCardChart(labels:string[], data:number[]){
  //     var canvas = document.getElementById('chart_auditForm') as HTMLCanvasElement;
  //     var ctx = canvas.getContext('2d')
  //     var chartStatus = new Chart(ctx, {
  //         type: 'doughnut',
  //         data: {
  //             labels: labels ,
  //               datasets: [{
  //                 label: 'Weightage',
  //                 data: data,
  //                 backgroundColor: [
  //                     'hsl(205, 100%, 25%)',
  //                     'hsl(205, 100%, 45%)',
  //                     'hsl(205, 100%, 65%)',
  //                     'hsl(205, 100%, 85%)',
  //                     'hsl(205, 100%, 30%)',
  //                     'hsl(213, 5%, 44%)',
  //                 ],
  //               }]
  //         },
  //         options: {
  //             plugins:{
  //                 labels:{
  //                     fontColor: '#fff',
  //                     arc: false,
  //                     position: 'outside',
  //                 }
  //             },
  //             legend: {
  //                 labels : {
  //                 usePointStyle: true,
  //                 // boxWidth:8,
  //                 fontSize:10,
  //                 fontColor:'black'
  //                 },
  //               display: true, //This will hide the label above the graph
  //               position:'right',
  //            },
  //            title: {
  //             display: true,
  //             text: 'Audit Form'
  //           },
  //            tooltips: {
  //               enabled: true
  //           },
  //           responsive: true
  //         }
  //     });
  // }

  IdvComplianceCardChart(labels: string[], data: number[]) {
    var canvas = document.getElementById('chart_idv_compliance') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weightage',
          data: data,
          backgroundColor: [
            'hsl(123, 40%, 46%)',
            'hsl(4, 89%, 55%)',
            'hsl(36, 100%, 47%)',
          ],
        }]
      },
      options: {
        plugins: {
          labels: [

            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            }
          ]
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black'
          },
          display: true, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'Compliance - ID&V'
        },
        tooltips: {
          enabled: true
        },
        responsive: true
      }
    });
  }

  PciComplianceCardChart(labels: string[], data: number[]) {
    var canvas = document.getElementById('chart_pci_compliance') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weightage',
          data: data,
          backgroundColor: [
            'hsl(123, 40%, 46%)',
            'hsl(4, 89%, 55%)',
            'hsl(36, 100%, 47%)',
          ],
        }]
      },
      options: {
        plugins: {
          labels: [

            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
            }
          ]
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:8,
            fontSize: 10,
            fontColor: 'black'
          },
          display: true, //This will hide the label above the graph
          position: 'right',
        },
        title: {
          display: true,
          text: 'Compliance - PCI-DSS'
        },
        tooltips: {
          enabled: true
        },
        responsive: true
      }
    });
  }



  key: string = 'id';
  reverse: boolean = false;

  sort(key: string) {

    this.key = key;
    this.reverse = !this.reverse;

  }

  sectionAuditFailed(graphName: string) {
    if (graphName === 'day') {
      this.sectionAuditFailedDayChartShow = true; this.sectionAuditFailedMonthChartShow = false;

      this.dashboardService.getSectionsFailedByDay().subscribe(response => {

        const data = response.sort((a, b) => { return a.day - b.day })

        const groupBy = keys => array =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
          }, {});

        const day = groupBy(['day']);
        const status = groupBy(['sectionId']);

        const ts_day = day(data.map(m => ({
          day: m.day + ' ' + this.monthArray[m.month - 1].slice(0, 3)
        })));

        var value = status(data)


        value[10] = value[10] || [0]
        value[11] = value[11] || [0]
        value[12] = value[12] || [0]


        const idv = value[10].map(m => { return m.countResult })
        const pci = value['11'] != undefined ? value[11].map(m => { return m.countResult }) : value[10].map(m => { return 0 })
        const phraseDetection = value['12'] != undefined ? value[12].map(m => { return m.countResult }) : value[10].map(m => { return 0 })

        const labels = Object.keys(ts_day)

        var datavalue = { idv: idv, pci: pci, phraseDetection: phraseDetection }

        this.FailedAuditDayChart(labels, datavalue);
      });

      // this.ChartToDisplay='chart_Status
    } else if (graphName === 'month') {
      this.sectionAuditFailedDayChartShow = false; this.sectionAuditFailedMonthChartShow = true;

      this.dashboardService.getSectionsFailedByMonth().subscribe(response => {
        console.log(response);

        const data = response.sort((a, b) => { return a.month - b.month })

        const groupBy = keys => array =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
          }, {});

        const month = groupBy(['month']);
        const status = groupBy(['sectionId']);

        const ts_day = month(data.map(m => ({
          month: this.monthArray[m.month - 1].slice(0, 3) + ' ' + m.year
        })));

        var value = status(data)

        value[10] = value[10] || [0]
        value[11] = value[11] || [0]
        value[12] = value[12] || [0]


        const idv = value[10].map(m => { return m.countResult })
        const pci = value['11'] != undefined ? value[11].map(m => { return m.countResult }) : value[10].map(m => { return 0 })
        const phraseDetection = value['12'] != undefined ? value[12].map(m => { return m.countResult }) : value[10].map(m => { return 0 })

        const labels = Object.keys(ts_day)

        var datavalue = { idv: idv, pci: pci, phraseDetection: phraseDetection }


        this.FailedAuditMonthChart(labels, datavalue);
      })

    }

  }

  SelectPerformanceGraphShow(graphName: string) {
    if (graphName === 'Month') {
      this.MonthChartShow = true;
      this.WeekChartShow = false;
      this.dashboardService.getMonthTransactions().subscribe(response => {


        const data = response.sort((a, b) => { return a.month - b.month })

        const groupBy = keys => array =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
          }, {});

        const month = groupBy(['month']);
        const status = groupBy(['status']);

        var value = status(data)

        value.completed = value.completed || [0]
        value.pending = value.pending || [0]

        // console.log(value)
        const completed = value.completed.map(m => { return m.value })
        const pending = value.pending.map(m => { return m.value })

        const ts_day = month(data.map(m => ({
          month: this.monthArray[m.month - 1].slice(0, 3) + ' ' + m.year
        })));


        const labels = Object.keys(ts_day)


        var datavalue = { completed: completed, pending: pending }

        // console.log(labels);
        // console.log(datavalue);

        this.CreateMonthlyPerformanceGraph(labels, datavalue)
      })
      //this.ngOnChanges();
      // this.ChartToDisplay='chart_Status
    }
    if (graphName === 'Day') {
      this.MonthChartShow = false;
      this.WeekChartShow = true;
      this.dashboardService.getDayWiseTransactions().subscribe(response => {

        const data = response.sort((a, b) => { return a.day - b.day && a.month - b.month })

        const groupBy = keys => array =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
          }, {});

        const day = groupBy(['day']);
        const status = groupBy(['status']);



        const ts_day = day(data.map(m => ({
          day: m.day + ' ' + this.monthArray[m.month - 1].slice(0, 3)
        })));

        var value = status(data)

        value.completed = value.completed || [0]
        value.pending = value.pending || [0]

        const completed = value.completed.map(m => { return m.value })
        const pending = value['pending'] != undefined ? value.pending.map(m => { return m.value }) : value.completed.map(m => { return 0 })

        const labels = Object.keys(ts_day)


        var datavalue = { completed: completed, pending: pending }

        // console.log(labels);
        // console.log(datavalue);


        this.CreateDailyPerformanceGraph(labels, datavalue)
      });
    }

  }

  GetDashboardData(timePeriod) {
    console.log(timePeriod)
  }


  GetDataByTime(timespan: string) {
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
    if (this.timePeriod == "Today") {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService.getStatsbyMailbox(timespan).subscribe(data => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (timespan == "All") {
            this.dashboardService.getStatsAvgTATToday(timespan).subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Today", timespan).subscribe(data => this.setimentData = data);
          }
          else {
            this.dashboardService.getStatsAvgTATToday(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Today", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
          }

        });
      });
      this.dashboardService.getStatsbyMailbox(timespan).subscribe(data => {
        this.pending = data.pendingCount;
        this.completed = data.completedCount;
        this.total = data.totalCount;
        this.pendingStat = data.pendingCount;
        this.completedStat = data.completedCount;
        this.totalStat = data.totalCount;
        this.hold = data.holdCount;
        this.slaMissed = data.slaMissed;
        this.actionOriented = data.actionOriented;
        this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
        this.pendingPercentage = (this.pending / this.total) * 100;
        this.completedPercentage = (this.completed / this.total) * 100;
        this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
        this.StatusChart(this.total, this.completed, this.pending);
        if (timespan == "All") {
          this.dashboardService.getStatsAvgTATToday(timespan).subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Today", timespan).subscribe(data => this.setimentData = data);
        }
        else {
          this.dashboardService.getStatsAvgTATToday(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Today", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
        }
      });
    }
    else if (this.timePeriod == "Total") {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService.getStatsbyMailboxTotal(timespan).subscribe(data => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (timespan == "All") {
            this.dashboardService.getStatsAvgTATTotal(timespan).subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Total", timespan).subscribe(data => this.setimentData = data);
          }
          else {
            this.dashboardService.getStatsAvgTATTotal(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Total", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
          }
        });
      });
      this.dashboardService.getStatsbyMailboxTotal(timespan).subscribe(data => {
        this.pending = data.pendingCount;
        this.completed = data.completedCount;
        this.total = data.totalCount;
        this.hold = data.holdCount;
        this.slaMissed = data.slaMissed;
        this.actionOriented = data.actionOriented;
        this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
        this.pendingPercentage = (this.pending / this.total) * 100;
        this.completedPercentage = (this.completed / this.total) * 100;
        this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
        this.StatusChart(this.total, this.completed, this.pending);
        if (timespan == "All") {
          this.dashboardService.getStatsAvgTATTotal(timespan).subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Total", timespan).subscribe(data => this.setimentData = data);
        }
        else {
          this.dashboardService.getStatsAvgTATTotal(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Total", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
        }
      });
    }
    else if (this.timePeriod == "Monthly") {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService.getStatsbyMailboxMonthly(timespan).subscribe(data => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (timespan == "All") {
            this.dashboardService.getStatsAvgTATMonth(timespan).subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Monthly", timespan).subscribe(data => this.setimentData = data);
          }
          else {
            this.dashboardService.getStatsAvgTATMonth(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Monthly", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
          }
        });
      });
      this.dashboardService.getStatsbyMailboxMonthly(timespan).subscribe(data => {
        this.pending = data.pendingCount;
        this.completed = data.completedCount;
        this.total = data.totalCount;
        this.hold = data.holdCount;
        this.slaMissed = data.slaMissed;
        this.actionOriented = data.actionOriented;
        this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
        this.pendingPercentage = (this.pending / this.total) * 100;
        this.completedPercentage = (this.completed / this.total) * 100;
        this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
        this.StatusChart(this.total, this.completed, this.pending);
        if (timespan == "All") {
          this.dashboardService.getStatsAvgTATMonth(timespan).subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Monthly", timespan).subscribe(data => this.setimentData = data);
        }
        else {
          this.dashboardService.getStatsAvgTATMonth(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Monthly", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
        }
      });
    }
    else if (this.timePeriod == "Weekly") {
      this.dashboardService.refreshNeeded$.subscribe(() => {
        this.dashboardService.getStatsbyMailboxWeekly(timespan).subscribe(data => {
          this.pending = data.pendingCount;
          this.completed = data.completedCount;
          this.total = data.totalCount;
          this.hold = data.holdCount;
          this.slaMissed = data.slaMissed;
          this.actionOriented = data.actionOriented;
          this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
          this.pendingPercentage = (this.pending / this.total) * 100;
          this.completedPercentage = (this.completed / this.total) * 100;
          this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
          this.StatusChart(this.total, this.completed, this.pending);
          if (timespan == "All") {
            this.dashboardService.getStatsAvgTATWeek(timespan).subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Weekly", timespan).subscribe(data => this.setimentData = data);
          }
          else {
            this.dashboardService.getStatsAvgTATWeek(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);
            this.dashboardService.getSentimentDetails("Weekly", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
          }
        });
      });
      this.dashboardService.getStatsbyMailboxWeekly(timespan).subscribe(data => {
        this.pending = data.pendingCount;
        this.completed = data.completedCount;
        this.total = data.totalCount;
        this.hold = data.holdCount;
        this.slaMissed = data.slaMissed;
        this.actionOriented = data.actionOriented;
        this.actionOrientedPercentage = (this.actionOriented / this.total) * 100;
        this.pendingPercentage = (this.pending / this.total) * 100;
        this.completedPercentage = (this.completed / this.total) * 100;
        this.slaMissedPercentage = (this.slaMissed / this.total) * 100;
        this.StatusChart(this.total, this.completed, this.pending);
        if (timespan == "All") {
          this.dashboardService.getStatsAvgTATWeek(timespan).subscribe(data => this.avgTAT = data);
          this.dashboardService.getSentimentDetails("Weekly", timespan).subscribe(data => this.setimentData = data);
        }
        else {
          this.dashboardService.getStatsAvgTATWeek(timespan + '@exlservice.com').subscribe(data => this.avgTAT = data);

          this.dashboardService.getSentimentDetails("Weekly", timespan + '@exlservice.com').subscribe(data => this.setimentData = data);
        }
      });
    }

    this.dashboardService.getStatsbyMailbox("All").subscribe(data => {
      this.pendingmail = data.pendingCount;
      this.completedmail = data.completedCount;
      this.totalmail = data.totalCount;
    });
    this.SentimentChart(1, 1, 1);
  }

  // FailedAuditDayChart(labels:any, data :any){

  //     const canvas = <HTMLCanvasElement> document.getElementById('FailedAuditDayChart') ;


  //     let bgC1 = [];
  //     let bgC2 = [];
  //     let bgC3 = [];

  //     labels.forEach(element => {
  //         return bgC1.push('hsl(205, 100%, 25%)');
  //     });
  //     labels.forEach(element => {
  //         return bgC2.push('hsl(205, 100%, 65%)');
  //     });
  //     labels.forEach(element => {
  //         return bgC3.push('hsl(205, 100%, 45%)');
  //     });


  //     const ctx = canvas?.getContext('2d');
  //     let dataObj={
  //         labels: labels,
  //         datasets: [
  //             {
  //                 label: 'ID&V',
  //                 data: data.idv,
  //                 backgroundColor: bgC1,
  //                 barThickness: 20,
  //               },
  //               {
  //                 label: 'PCI-DSS',
  //                 data: data.pci,
  //                 backgroundColor: bgC2,
  //                 barThickness: 20,
  //               },
  //               {
  //                 label: 'Phrase/Text detection',
  //                 data: data.phraseDetection,
  //                 backgroundColor: bgC3,
  //                 barThickness: 20,
  //               }
  //             ]
  //         }

  // var myChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: dataObj,
  //   options: {
  //     plugins:{
  //         labels: false
  //         // {
  //         //     render: 'value',
  //         //     fontSize: 11,
  //         //     fontStyle: 'bold',
  //         //     fontColor: '#fff',
  //         //     position: 'center',
  //         //     overlap: false,
  //         // }
  //     },
  //       scales: {
  //         xAxes: [{
  //             stacked: true,
  //             gridLines: {
  //                 color: "rgba(0, 0, 0, 0)",
  //             }
  //         }],
  //         yAxes: [{
  //             stacked: true,
  //             gridLines: {
  //                 color: "rgba(0, 0, 0, 0)",
  //             } ,
  //             ticks: {
  //                 beginAtZero: true,
  //                 // stepSize: 100,
  //                 // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
  //                 // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
  //               },
  //             scaleLabel: {
  //             display: true,
  //             labelString: 'No. of Sections'
  //             }
  //         }]

  //       },
  //       legend: {
  //         labels : {
  //             usePointStyle: true,
  //             boxWidth:2,
  //             fontSize:13,
  //             fontColor:'rgba(0, 0, 0, 1)',
  //         },
  //         display: true ,//This will hide the label above the graph
  //         position:'bottom',

  //      },


  //   }

  // });

  //   }


  //   FailedAuditMonthChart(labels:any, data :any){

  //     const canvas = <HTMLCanvasElement> document.getElementById('FailedAuditMonthChart') ;


  //     const ctx = canvas?.getContext('2d');
  //     let dataObj={
  //         labels: labels,
  //         datasets: [
  //             {
  //                 label: 'ID&V',
  //                 data: data.idv,
  //                 backgroundColor: [
  //                     'hsl(205, 100%, 25%)',
  //                     'hsl(205, 100%, 25%)',
  //                     'hsl(205, 100%, 25%)'
  //                 ],
  //                 barThickness: 20,
  //               },
  //               {
  //                 label: 'PCI-DSS',
  //                 data: data.pci_dss,
  //                 backgroundColor: [
  //                     'hsl(205, 100%, 65%)',
  //                     'hsl(205, 100%, 65%)',
  //                     'hsl(205, 100%, 65%)',
  //                     ],
  //                 barThickness: 20,
  //               },
  //               {
  //                 label: 'Phrase/Text detection',
  //                 data: data.phraseDetection,
  //                 backgroundColor: [
  //                     'hsl(205, 100%, 45%)',
  //                     'hsl(205, 100%, 45%)',
  //                     'hsl(205, 100%, 45%)',
  //                     ],
  //                 barThickness: 20,
  //               }
  //             ]
  //         }

  // var myChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: dataObj,
  //   options: {
  //     plugins:{
  //       labels: false
  //     },
  //       scales: {
  //         xAxes: [{
  //             stacked: true,
  //             gridLines: {
  //                 color: "rgba(0, 0, 0, 0)",
  //             }
  //         }],
  //         yAxes: [{
  //             stacked: true,
  //             gridLines: {
  //                 color: "rgba(0, 0, 0, 0)",
  //             } ,
  //             ticks: {
  //                 beginAtZero: true,
  //                 // stepSize:500,
  //                 // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
  //                 // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
  //               },
  //             scaleLabel: {
  //             display: true,
  //             labelString: 'No. of Sections'
  //             }
  //         }]

  //       },
  //       legend: {
  //         labels : {
  //             usePointStyle: true,
  //             boxWidth:2,
  //             fontSize:13,
  //             fontColor:'rgba(0, 0, 0, 1)',
  //         },
  //         display: true ,//This will hide the label above the graph
  //         position:'bottom',

  //      },


  //   }

  // });

  //   }


  FailedAuditDayChart(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('FailedAuditDayChart');
    const ctx = canvas?.getContext('2d');

    // 'hsl(354, 68%, 48%)',
    // 'hsl(301, 17%, 46%)',
    // 'hsl(24, 93%, 56%)'

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'ID&V',
          data: data.idv,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(354, 68%, 48%)',
        },
        {
          label: 'PCI-DSS',
          data: data.pci,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(301, 17%, 46%)',
        },
        {
          label: 'Text/Phrase Detection',
          data: data.phraseDetection,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(24, 93%, 56%)',
        }
      ]
    }

    var myChart = new Chart(ctx, {
      type: 'line',
      data: dataObj,
      options: {
        plugins: {
          labels: {
            render: 'value',
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
              // stepSize:30,
              // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
              // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
            },
            scaleLabel: {
              display: true,
              labelString: 'No. of transaction'
            }
          }]

        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true,//This will hide the label above the graph
          position: 'bottom',

        },


      }

    });

  }


  FailedAuditMonthChart(labels: any, data: any) {

    const canvas = <HTMLCanvasElement>document.getElementById('FailedAuditMonthChart');
    const ctx = canvas?.getContext('2d');
    // 'hsl(354, 68%, 48%)',
    // 'hsl(301, 17%, 46%)',
    // 'hsl(24, 93%, 56%)'

    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: 'ID&V',
          data: data.idv,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(354, 68%, 48%)',
        },
        {
          label: 'PCI-DSS',
          data: data.pci,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(301, 17%, 46%)',
        },
        {
          label: 'Text/Phrase Detection',
          data: data.phraseDetection,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(24, 93%, 56%)',
        }
      ]
    }

    var myChart = new Chart(ctx, {
      type: 'line',
      data: dataObj,
      options: {
        plugins: {
          labels: {
            render: 'value',
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
              // stepSize:30,
              // stepSize:Math.round((Math.max(inventoryChartObj?.total)+5)/3),
              // max:Math.round(Math.max(inventoryChartObj?.total)+Math.round((Math.max(inventoryChartObj?.total)+5)/3))
            },
            scaleLabel: {
              display: true,
              labelString: 'No. of transaction'
            }
          }]

        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: true,//This will hide the label above the graph
          position: 'bottom',

        },


      }

    });

  }

  SLAMissedChart() {
    const ctx = document.getElementById('SLAMissedChart') as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.slaChartLabel,
        datasets: [{
          label: 'Pending',
          data: this.pendingSlaDataValue,
          backgroundColor: "hsl(205, 100%, 50%)",
          borderWidth: 4,
          barPercentage: 0.4,
          pointRadius: 2,
          fill: true,
          borderColor: "hsl(205, 100%, 50%)",
          barThickness: 20,
          maxBarThickness: 20,
          minBarLength: 2,

        },
        {
          label: 'Completed',
          data: this.completedSlaDataValue,
          backgroundColor: "hsl(23, 100%, 51%)",
          borderWidth: 4,
          barPercentage: 0.4,
          pointRadius: 2,
          fill: true,
          borderColor: "hsl(23, 100%, 51%)",
          barThickness: 20,
          maxBarThickness: 20,
          minBarLength: 1,

        }]
      },
      options: {
        responsive: true,
        plugins: {
          labels: {
            render: 'value',
            textMargin: 4
          }
        },
        onClick: (e) => {
          let points: any = {}
          points = myChart.getElementAtEvent(e);
          let arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          if (points[0]._datasetIndex == 0) {
            this.pendingSlaPopUpData = [];
            let labelMonth = points[0]._view.label.slice(0, 3);
            this.pendingSlaPopUpDataCopy.forEach(element => {
              if (labelMonth == arr[element.mailRecievedTime.slice(6, 7) - 1]) {
                let index = (arr.indexOf(labelMonth)) + 1;
                this.pendingSlaPopUpData = this.pendingSlaPopUpDataCopy.filter(res => {
                  let data = res;
                  if (data.mailRecievedTime.slice(6, 7) == index) {
                    return res;
                  }
                });
              }
            });

            this.showSLAMissedPopup = true;
          } else if (points[0]._datasetIndex == 1) {
            this.completedSlaPopUpData = [];
            let labelMonth = points[0]._view.label.slice(0, 3);
            this.completedSlaPopUpDataCopy.forEach(element => {
              if (labelMonth == arr[element.mailRecievedTime.slice(6, 7) - 1]) {
                let index = (arr.indexOf(labelMonth)) + 1;
                this.completedSlaPopUpData = this.completedSlaPopUpDataCopy.filter(res => {
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
          xAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",

            },
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
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
              labelString: 'No. of transactions'
            }
          }]

        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 2,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true,//This will hide the label above the graph
          position: 'bottom',

        },
        maintainAspectRatio: true,
      }
    });
  }

  openPopupTATStats() {
    this.showTATPopup = true;
    this.dashboardService.getCountofTATPerformanceChart().subscribe(data => {
      this.tatperformanceChart = data
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
    console.log("hi")
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
    var chartStatus = new Chart("chart_Status", {
      type: 'doughnut',
      data: {
        labels: [
          'Completed',
          'Pending',
          'Hold'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [completed, pending, this.hold],
          backgroundColor: [
            'hsl(205, 100%, 30%)',
            'hsl(205, 100%, 60%)',
            'hsl(213, 5%, 54%)',
          ],
        }]
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'outside',
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true
        },
        responsive: true
      }
    });
  }

  MailboxChart() {
    var ctx = document.getElementById('chart_mailbox');
    var chartStatus = new Chart("chart_mailbox", {
      type: 'doughnut',
      data: {
        labels: this.mailboxChart?.dataLabel,
        datasets: [{
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
            'hsl(23, 100%, 91%)', ,
          ],
        }]
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'outside',
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true
        },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }



  IntentSentimentChart() {
    this.ngOnChanges();
    var ctx = document.getElementById('chart_intentSentiment');
    var chartStatus = new Chart("chart_intentSentiment", {
      type: 'doughnut',
      data: {

        labels: [this.intentChart?.dataLabel[1], this.intentChart?.dataLabel[3], this.intentChart?.dataLabel[4]],
        // labels: this.intentChart ?.dataLabel,
        datasets: [{
          label: 'My First Dataset',
          //data: [30,25,25,15,5],
          // data:this.intentChart?.dataValue,
          data: [this.intentChart?.dataValue[1], this.intentChart?.dataValue[3], this.intentChart?.dataValue[4]],
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
        ]
      },
      options: {
        plugins: {

          labels: {
            fontFamily: 'Roboto',
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true
        },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }
  ngOnChanges() {
    throw new Error('Method not implemented.');
  }

  SentimentChart(total: number, completed: number, pending: number) {
    var ctx = document.getElementById('chart_Sentiment');
    var chartStatus = new Chart("chart_Sentiment", {
      type: 'doughnut',
      data: {
        labels: this.setimentData.dataLabel,
        datasets: [{
          label: 'My First Dataset',
          data: this.setimentData.dataValue,
          backgroundColor: [
            'hsl(205, 100%, 60%)',
            'hsl(213, 5%, 54%)',
            'hsl(23, 100%, 61%)'
          ],
        }]
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true
        },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }

  PriorityChart() {  //prahlad
    var ctx = document.getElementById('chart_priority');
    var chartStatus = new Chart("chart_priority", {
      type: 'doughnut',
      data: {
        // labels:this.PriorityChartData.dataLabel,
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          label: 'My First Dataset',
          // data: this.PriorityChartYearData.dataValue,
          data: [this.PriorityChartYearData?.dataValue, this.PriorityChartMonthData?.dataValue, this.PriorityChartDayData?.dataValue],
          // data: [52, 20, 200],
          backgroundColor: [
            'hsl(205, 100%, 60%)',
            'hsl(213, 5%, 54%)',
            'hsl(23, 100%, 61%)'
          ],
        }]
      },
      options: {
        plugins: {
          labels: {
            fontColor: '#fff',
            arc: false,
            // position: 'border',
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            fontSize: 15,
            fontFamily: 'Roboto',
            fontColor: 'black'

          },
          display: true, //This will hide the label above the graph
          position: 'bottom',
        },
        tooltips: {
          enabled: true
        },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }

}
