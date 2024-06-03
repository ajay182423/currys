import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
} from 'chart.js';

import { default as Annotation } from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() chartData: any[];
  @Input() slaData: any;
  @Input() annotation: any;
  @Output() chartClickEvent = new EventEmitter();

  constructor() {
    Chart.register(Annotation);
    Chart.register(ChartDataLabels);
    Chart.register(zoomPlugin);
  }
  ngOnInit(): void {
    let annotationRecord = [];
    for (var i = 0; i < this.annotation.length; i++) {
      let borderColor;
      if (this.annotation[i].levelName == 'Expected') {
        borderColor = 'orange';
      } else if (this.annotation[i].levelName == 'Minimum') {
        borderColor = 'red';
      } else if (this.annotation[i].levelName == 'Target') {
        borderColor = 'blue';
      } else {
        borderColor = 'green';
      }
      annotationRecord.push({
        type: 'line',
        borderColor: borderColor,
        borderWidth: 1,
        yMin: this.annotation[i].levelValue,
        yMax: this.annotation[i].levelValue,
        label: {
          position: 'center',
          color: 'black',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          display: false,
          content: this.annotation[i].levelName,
          font: {
            weight: 'bold',
            size: 12,
          },
        },
      });

      // var chartData = this.chartData.map(m => {return Math.round(m.slaValue/10) * 10})
      var levelValue = this.annotation.map((m) => {
        return Math.round(m.levelValue / 10) * 10;
      });
      var slaValue = this.chartData.map((m) => {
        return Math.round(m.slaValue / 10) * 10;
      });

      var levelvalueCheck = Math.min(...levelValue);
      var slavalueCheck = Math.min(...slaValue);

      var chartData;
      if (slavalueCheck < levelvalueCheck) {
        chartData = slaValue;
      } else {
        chartData = levelValue;
      }
      var min_data_point = chartData.length > 0 ? Math.min(...chartData) : 10;

      if (min_data_point <= 10) {
        min_data_point = 10;
      }
    }

    var levels = [];
    this.slaData.serviceLevelRecords.forEach(item => {
      levels.push(item.levelValue)
    })
    this.sortNumbers(levels);
    var dataLabelColor = this.chartData.map((m) => {
      if(m.slaValue < levels[0]  ) {
        return 'red';
      }
      else if(m.slaValue < levels[1] ) {       
        return 'orange';
      }
      else {
        return 'green';
      }
    });
    var labelColor = this.chartData.map((m) => {
      return m.isSlaMissed ? 'grey' : 'grey';
    });

    this.lineChartData = {
      labels: this.chartData.map((m) => {
        var month = m.month;
        var label;
        if (m.month.length > 4) {
          label = month.slice(0, 3) + ' ' + m.year;
        } else {
          if (month == undefined) {
            label = m.year;
          } else {
            label = month + ' ' + m.year;
          }
        }
        return label;
      }),
      // color: 'red',
      datasets: [
        {
          data: this.chartData.map((m) => m.slaValue),
          label: 'Calculated Value',
          backgroundColor: 'rgba(148,159,177,0)',
          borderColor: 'rgba(148,159,177,.6)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
      ],
    };
    this.lineChartOptions = {
      elements: {
        line: {
          tension: 0.1,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        x: {
          grid: {
            display: true,
          },
          ticks: {
            color: labelColor,
          },
        },
        y: {
          beginAtZero: true,
          position: 'left',
          max: 100,
          min: min_data_point - 10,
          ticks: {
            stepSize: 5,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        annotation: {
          annotations: annotationRecord,
        },

        //   tooltip: {
        //     enabled: true,
        //     callbacks: {
        //         label: function(context) {
        //             let label = context.dataset.label || '';

        //             if (label) {
        //                 label += ': ';
        //             }
        //             return label;
        //         }
        //     }
        // },
        datalabels: {
          anchor: 'end',
          align: () => {
            if (min_data_point <= 20) {
              return 'top';
            } else {
              return 'bottom';
            }
          },
          color: dataLabelColor,
          labels: {
            title: {
              font: {
                weight: 'bold',
                size: 11,
              },
            },
          },
          formatter: (value) => {
            return value + '%';
          },
        },
        zoom: {
          zoom: {
            mode: 'y',
            overScaleMode: 'y',
          },
          limits: {
            y: {
              min: 80,
              max: 100,
            },
          },
        },
      },
    };
  }

  public sortNumbers(array) {
    array.sort((a, b) => {
      return a -b
    })
} 

  // Doughnut
  public doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [350, 450, 100] },
      { data: [50, 150, 120] },
      { data: [250, 130, 70] },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  // Line

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {};

  public lineChartType: ChartType = 'line';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    //console.log(event, active);
  }

  public chartClickedEvent(data, options) {
    this.chartClickEvent.emit([data, options]);
  }
}
