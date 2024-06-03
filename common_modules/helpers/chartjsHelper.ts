export function getDoughnutChartOptions(isThemeDark: boolean) {
  let doughnutChartOptions = {
    cutoutPercentage: 70,
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
      position: 'bottom',
      align: 'center',
      fullWidth: true,
      labels: {
        fontColor: '#000',
        fontSize: 12,
        padding: 20,
        usePointStyle: true,
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
  };

  if (isThemeDark){
    doughnutChartOptions.legend.labels.fontColor = '#000';
  }
  
  return doughnutChartOptions;
}

export function getDoughnutChartColors(isThemeDark: boolean) {
  let doughnutChartColors = [{
    backgroundColor: ['#808080', '#ababab', '#dbdbdb', '#e6e6e6'],
  }];

  if (isThemeDark){
    doughnutChartColors[0].backgroundColor = ['rgb(99, 99, 99)', 'rgb(87, 87, 87)', 'rgb(74, 74, 74)', 'rgb(61, 61, 61)'];
  }

  return doughnutChartColors;
}

export function getLineChartOptions(isThemeDark: boolean) {
  let lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: { display: false },
    title: {
      display: false,
      text: 'Daily Productivity'
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: true,
          color: '#f5f5f8',
          zeroLineColor: '#eaeaee'
        },
      }],
      yAxes: [{
        gridLines: {
          display: true,
          color: '#f5f5f8',
          zeroLineColor: '#eaeaee'
        },
        ticks: { beginAtZero: true }
      }],
    }
  };
  
  if (isThemeDark){
    lineChartOptions.scales.xAxes[0].gridLines.color = 'rgb(61, 61, 61)';
    lineChartOptions.scales.xAxes[0].gridLines.zeroLineColor = 'rgb(99, 99, 99)';
    lineChartOptions.scales.yAxes[0].gridLines.color = 'rgb(61, 61, 61)';
    lineChartOptions.scales.yAxes[0].gridLines.zeroLineColor = 'rgb(99, 99, 99)';
  }

  return lineChartOptions;
}