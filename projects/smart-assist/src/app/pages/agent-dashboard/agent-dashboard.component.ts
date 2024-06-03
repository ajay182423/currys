import { Component, HostListener, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { IEmailList } from '../../interfaces/email-param';
import { IGraphToken } from '../../interfaces/graph/graphtoken-param';
import { IMailboxList } from '../../interfaces/mailbox-param';
import { SlaPerformance } from '../../interfaces/slaPerformance';
import { IStatsList } from '../../interfaces/Stats-param';
import { ITATPerformance } from '../../interfaces/tat-performance-param';
import { ITeamStatsList } from '../../interfaces/teamstats-param';
import { AgentDashboardService } from '../../services/agent-dashboard.service';
import { finalize } from 'rxjs/operators';
import { HelperService } from 'common_modules/services/helper.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ChartPopupComponent } from '../dashboard/chartPopup/chart-popup.component';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { FormsDataPopupComponent } from '../dashboard/formsDataPopup/forms-data-popup.component';
import { ActivatedRoute, Router } from '@angular/Router';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AgentDashboardComponent implements OnInit {



  // New Dashboard Properties


  pageNumber: number = 1;
  pageSize: number = 10;
  jsonUrl: String;
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

  tableMessage: any = {};
  isLoading: boolean = false;

  tableHeaders: any = [
    { id: 1, name: "Id", order: 'asc', type: '', sort: 'Id', class: 'th-sort-asc' },
    { id: 2, name: "Call Duration", order: 'desc', type: '', sort: 'CallDuration', class: 'th-sort' },
    { id: 3, name: "Quality", order: 'desc', type: '', sort: 'Quality', class: 'th-sort' },
    { id: 4, name: "Flagged", order: 'desc', type: '', sort: 'Flag', class: 'th-sort' },
    { id: 5, name: "Status", order: 'desc', type: '', sort: 'Status', class: 'th-sort' },
    { id: 6, name: "Call Date", order: 'desc', type: 'date', sort: 'CallDate', class: 'th-sort' },
    { id: 7, name: "Audited Date", order: 'desc', type: 'date', sort: 'AuditedDate', class: 'th-sort' },
  ];
  tableData: any = [];
  agentId: number;
  transactionId1: any;
  id: number;
  agentName: string = '';
  agentManagerName: string = '';
  agentDepartment: string = '';



  constructor(
    private agentDashboardService: AgentDashboardService,
    private auditRecordsService: AuditRecordsService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.agentId != null) {
          this.agentId = params.agentId;
          this.setJsonUrlByAgentId(params.agentId);
          this.getAgentDataById();
          this.fillTableRows();
          this.getAuditRecordsData();
          this.getAverageScore();
          this.showAgentPerformance();
          this.openTab('IdvCompliance');
          this.SelectPerformanceGraphShow('Day');
          this.sectionAuditFailed('day');
        }
      })
  }

  setJsonUrlByAgentId(agentId){
    if(agentId == 74){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-74.json';
    }else if(agentId == 50){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-50.json';
    }else if(agentId == 123){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-123.json';
    }else if(agentId == 91){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-91.json';
    }else if(agentId == 66){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-66.json';
    }else if(agentId == 19){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-19.json';
    }else if(agentId == 60){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-60.json';
    }else if(agentId == 79){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-79.json';
    }else if(agentId == 85){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-85.json';
    }else if(agentId == 43){
      this.jsonUrl =  environment.jsonFilesUrl + 'agent-dashboard-43.json';
    }
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

  getAgentDataById() {
    this.helperService.getJSON(this.jsonUrl).subscribe(data => {
      this.agentName = data.agentName;
      this.agentManagerName = data.managerName;
      this.agentDepartment = data.departmentName;
    })
  }

  getAuditRecordsData() {
    this.helperService.getJSON(this.jsonUrl).subscribe(data => {
      let response = data.dashboardData.tableData.content.body.data;
      this.totalAuditRecords = response.length;
      this.completedAuditRecords = response.filter(f => f.status.toLowerCase() == "completed").length;
      this.pendingAuditRecords = response.filter(f => f.status.toLowerCase() == "pending").length;

      let audioList = []
      response.forEach(item => {
        if (item.callDuration != null) {
          audioList.push(item.callDuration)
        }
        // Create an empty array of number
        var hrsArray = [];
        var minArray = [];

        // console.log(audioList);

        // Store length of array of string
        // in variable length
        length = audioList.length;


        for (var i = 0; i < length; i++) {
          hrsArray.push(parseInt(audioList[i].split(":")[0]));
          minArray.push(parseInt(audioList[i].split(":")[1]));
        }

        function sum_reducer(accumulator, currentValue) {
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
    this.helperService.getJSON(this.jsonUrl).subscribe(data => {
      let response = data.dashboardData.tableData.content.body.data;
      let totalScoreList = [];
      response.forEach(item => {
        totalScoreList.push(item.quality);
      })

      function sum_reducer(accumulator, currentValue) {
        return accumulator + currentValue;
      }
      let totalScore = totalScoreList.reduce(sum_reducer, 0);
      this.averageScore = (totalScore / response.length)
    })
  }


  openFormList() {
    this.openFormsDataPopup()
  }

  sortByData(sortBy) {
    this.isLoading = true;
    this.agentDashboardService.getSortedRecordsListByAgentId(sortBy.sortParam, sortBy.order, this.agentId, this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.tableMessage = { isUpdating: true, text: 'Please wait..' };
    })).subscribe(response => {
      if (response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x, i) => i + 1),
          tableRows: response.result.map(m => ({
            0: { value: m.id },
            1: { value: m.id },
            2: { value: m.callDuration },
            3: { value: m.quality },
            4: { value: m.flag },
            5: { value: m.status, class: m.status.toLowerCase() },
            6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
            7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
          }))
        };
        this.isLoading = false;
      }
      else {
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }

    });
  }


  fillTableRows() {
    this.agentDashboardService.getRecordsListByAgentId(this.agentId, this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            0: { value: m.id },
            1: { value: m.id },
            2: { value: m.callDuration },
            3: { value: m.quality },
            4: { value: m.flag },
            5: { value: m.status, class: m.status.toLowerCase() },
            6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
            7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
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
      this.agentDashboardService.getSearchedTableData(event, this.pageNumber, this.pageSize).pipe(finalize(() => {
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
              0: { value: m.id },
              1: { value: m.id },
              2: { value: m.callDuration },
              3: { value: m.quality },
              4: { value: m.flag },
              5: { value: m.status, class: m.status.toLowerCase() },
              6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
              7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
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


  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }

  receiveRowClickRequest($event) {
    this.auditRecordsService.getRecord($event).subscribe(trnId => {
      if (trnId.status == 'PENDING') {
        this.toastrService.error('No data available since transaction is pending');
        return
      } else {
        this.transactionId1 = trnId.transactionId;
        this.id = trnId.id;
        this.router.navigate(['/call-audit'],
          {
            queryParams: { transactionId: this.transactionId1, ID: this.id }
          })
      }
    })
  }



  openTab(tabName: string) {
    this.SelectGraphShow(tabName);
  }

  showAgentPerformance() {
    this.helperService.getJSON(this.jsonUrl).subscribe(d => {
      var data = d.dashboardData.card4.content;
      var labels = data.map(m => { return m.query })
      var dataValues = data.map(m => { return m.value })

      this.queryStatusCardChart(labels.reverse(), dataValues.reverse());
    })
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
        this.helperService.getJSON(this.jsonUrl).subscribe(d => {
          let response = d.dashboardData.widget1.tab3.content.body.data;
        let data = response.filter(f => f.sectionId != 4)
        data = response.sort((a, b) => { return b.day - a.day && b.month - a.month })

        const groupBy = keys => array =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
          }, {});

        const day = groupBy(['day']);
        const section = groupBy(['section']);



        const ts_day = day(data.map(m => ({
          day: m.day + ' ' + this.monthArray[m.month - 1].slice(0, 3)
        })));

        var value = section(data)

        value['ID&V'] = value['ID&V'] || [0]
        value['PCI-DSS'] = value['PCI-DSS']
        value['Phrase/Text detection'] = value['Phrase/Text detection']

        const idv = value['ID&V'].map(m => { return m.countResult })
        const pci_dss = value['PCI-DSS'] != undefined ? value['PCI-DSS'].map(m => { return m.countResult }) : value['ID&V'].map(m => { return 0 })
        const text_detection = value['Phrase/Text detection'] != undefined ? value['Phrase/Text detection'].map(m => { return m.countResult }) : value['ID&V'].map(m => { return 0 })

        const labels = Object.keys(ts_day)


        var datavalue = { idv: idv.reverse(), pci_dss: pci_dss.reverse(), text_detection: text_detection.reverse() }
        this.sectionCardChart(labels.reverse(), datavalue);
      })
    }
    else if (graphName === 'queryStatus') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = true;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = false;
    }
    else if (graphName === 'IdvCompliance') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = true;
      this.pciComplianceChartShow = false;

      this.helperService.getJSON(this.jsonUrl).subscribe(d => {
        let response = d.dashboardData.widget1.tab1.content.body.data;
        const data = response.sort((a, b) => { return b.day - a.day && b.month - a.month })

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

        value.Pass = value.Pass || [0]
        value.Exception = value.Exception

        const pass = value.Pass.map(m => { return m.value })
        const fail = value['Fail'] != undefined ? value.Fail.map(m => { return m.value }) : value.Pass.map(m => { return 0 })
        const ecxeption = value['Exception'] != undefined ? value.Exception.map(m => { return m.value }) : value.Pass.map(m => { return 0 })

        const labels = Object.keys(ts_day)


        var datavalue = { pass: pass.reverse(), fail: fail.reverse(), ecxeption: ecxeption.reverse() }
        this.IdvComplianceCardChart(labels.reverse(), datavalue);
      })

    }

    else if (graphName === 'PciCompliance') {
      this.auditFormChartShow = false;
      this.queryStatusChartShow = false;
      this.sectionChartShow = false;
      this.idvComplianceChartShow = false;
      this.pciComplianceChartShow = true;

      this.helperService.getJSON(this.jsonUrl).subscribe(d => {
        let response = d.dashboardData.widget1.tab2.content.body.data;
        const data = response.sort((a, b) => { return b.day - a.day && b.month - a.month })

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

        value.Pass = value.Pass || [0]
        value.Exception = value.Exception //|| [0]

        const pass = value.Pass.map(m => { return m.value })
        const fail = value['Fail'] != undefined ? value.Fail.map(m => { return m.value }) : value.Pass.map(m => { return 0 })
        const ecxeption = value['Exception'] != undefined ? value.Exception.map(m => { return m.value }) : value.Pass.map(m => { return 0 })

        const labels = Object.keys(ts_day)


        var datavalue = { pass: pass.reverse(), fail: fail.reverse(), ecxeption: ecxeption.reverse() }

        this.PciComplianceCardChart(labels.reverse(), datavalue);

      })

    }

  }

  openAuditPassDataPopup(sectionName: any, sectionId: number, data: any, agentId: number) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      sectionId: sectionId,
      agentId: agentId,
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



  sectionCardChart(labels: string[], data: any) {

    const canvas = <HTMLCanvasElement>document.getElementById('chart_section');
    const ctx = canvas?.getContext('2d');

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
          borderColor: 'hsl(205, 100%, 25%)',
        },
        {
          label: 'PCI-DSS',
          data: data.pci_dss,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 65%)',
        },
        {
          label: 'Phrase/Text Detection',
          data: data.text_detection,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 45%)',
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
          }
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
          display: false,
          text: 'Customer Query Status'
        },
        tooltips: {
          enabled: true
        },
        responsive: true
      }
    });
  }


  IdvComplianceCardChart(labels: string[], data: any) {
    // var canvas = document.getElementById('chart_idv_compliance') as HTMLCanvasElement;
    const canvas = <HTMLCanvasElement>document.getElementById('chart_idv_compliance');


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
          label: 'Pass',
          data: data.pass,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(123, 40%, 46%)',
        },
        {
          label: 'Fail',
          data: data.fail,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(4, 89%, 55%)',
        },
        {
          label: 'Ecxeption',
          data: data.ecxeption,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(36, 100%, 47%)',
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
          }
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

  PciComplianceCardChart(labels: string[], data: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('chart_pci_compliance');

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
          label: 'Pass',
          data: data.pass,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(123, 40%, 46%)',
        },
        {
          label: 'Fail',
          data: data.fail,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(4, 89%, 55%)',
        },
        {
          label: 'Ecxeption',
          data: data.ecxeption,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(36, 100%, 47%)',
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
          }
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



  key: string = 'id';
  reverse: boolean = false;

  sort(key: string) {

    this.key = key;
    this.reverse = !this.reverse;

  }

  sectionAuditFailed(graphName: string) {
    if (graphName === 'day') {
      this.sectionAuditFailedDayChartShow = true;
      this.sectionAuditFailedMonthChartShow = false;

      this.helperService.getJSON(this.jsonUrl).subscribe(d => {
        let response = d.dashboardData.widget3.tab1.content.body.data;
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
        const pci_dss = value['11'] != undefined ? value[11].map(m => { return m.countResult }) : value[10].map(m => { return 0 })
        const text_detection = value['12'] != undefined ? value[12].map(m => { return m.countResult }) : value[10].map(m => { return 0 })

        const labels = Object.keys(ts_day)

        var datavalue = { idv: idv, pci_dss: pci_dss, text_detection: text_detection }

        this.FailedAuditDayChart(labels, datavalue);
      });

      // this.ChartToDisplay='chart_Status
    } else if (graphName === 'month') {
      this.sectionAuditFailedDayChartShow = false; this.sectionAuditFailedMonthChartShow = true;

      this.helperService.getJSON(this.jsonUrl).subscribe(d => {
        let response = d.dashboardData.widget3.tab2.content.body.data;

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
        const pci_dss = value['11'] != undefined ? value[11].map(m => { return m.countResult }) : value[10].map(m => { return 0 })
        const text_detection = value['12'] != undefined ? value[12].map(m => { return m.countResult }) : value[10].map(m => { return 0 })

        const labels = Object.keys(ts_day)

        var datavalue = { idv: idv, pci_dss: pci_dss, text_detection: text_detection }


        this.FailedAuditMonthChart(labels, datavalue);
      })

    }

  }

  SelectPerformanceGraphShow(graphName: string) {
    if (graphName === 'Day') {
      this.MonthChartShow = false;
      this.WeekChartShow = true;
      this.helperService.getJSON(this.jsonUrl).subscribe((data) => {
        let widget1_tab1ChartData = data.dashboardData.widget2.tab1.content;

        const canvas = <HTMLCanvasElement>(
          document.getElementById('chart_DailyPerformance')
        );
        const ctx = canvas?.getContext('2d');

        var datasetsArray = widget1_tab1ChartData.body.data.map((m) => ({
          label: m.name,
          data: m.values,
          backgroundColor: m.bg,
          barThickness: 20,
        }));

        let dataObj = {
          labels: widget1_tab1ChartData.body.legends,
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
                    labelString: widget1_tab1ChartData.body.chartTitle,
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
        let widget1_tab2ChartData = data.dashboardData.widget2.tab2.content;

        const canvas = <HTMLCanvasElement>(
          document.getElementById('chart_MonthlyPerformance')
        );
        const ctx = canvas?.getContext('2d');

        var datasetsArray = widget1_tab2ChartData.body.data.map((m) => ({
          label: m.name,
          data: m.values,
          backgroundColor: m.bg,
          barThickness: 20,
        }));

        let dataObj = {
          labels: widget1_tab2ChartData.body.legends,
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
                    labelString: widget1_tab2ChartData.body.chartTitle,
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



  FailedAuditDayChart(labels: any, data: any) {

    const canvas = <HTMLCanvasElement>document.getElementById('FailedAuditDayChart');
    const ctx = canvas?.getContext('2d');

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
          borderColor: 'hsl(205, 100%, 25%)',
        },
        {
          label: 'PCI-DSS',
          data: data.pci_dss,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 65%)',
        },
        {
          label: 'Phrase/Text Detection',
          data: data.text_detection,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 45%)',
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
          }
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
          borderColor: 'hsl(205, 100%, 25%)',
        },
        {
          label: 'PCI-DSS',
          data: data.pci_dss,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 65%)',
        },
        {
          label: 'Phrase/Text Detection',
          data: data.text_detection,
          backgroundColor: "rgba(0, 0, 0, 0)",
          fill: false,
          borderDash: [2, 3],
          tension: 0.4,
          barThickness: 20,
          borderColor: 'hsl(205, 100%, 45%)',
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
          }
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
    this.agentDashboardService.getCountofTATPerformanceChart().subscribe(data => {
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

