export const hightChartCommon = (
  subject,
  yName,
  year,
  data,
  handleHoverDate = () => {}
) => ({
  title: {
    text: `${year} ${subject}`,
    x: -20 // center
  },
  subtitle: {
    text: '',
    x: -20
  },
  yAxis: {
    title: {
      text: yName
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: '#808080'
      }
    ]
  },
  xAxis: {
    type: 'datetime',
    labels: {
      format: '{value:%m/%d}',
      rotation: 45,
      align: 'left'
    }
  },
  rangeSelector: {
    selected: 5
  },
  tooltip: {
    valueSuffix: '',
    useHTML: true,
    formatter() {
      handleHoverDate(this.points[0].point.date, `${year} ${subject}`)

      let html =
        `<span>日期：<span>${this.points[0].point.date}<br>` +
        `<span>${yName}: <span>${this.points[0].point.y}<br>`

      if (this.points[0].point.is_settle === true) {
        html += '<span style="color: red">結算日<span>'
      }
      return html
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    borderWidth: 0
  },
  series: [
    {
      turboThreshold: 0,
      name: subject,
      data
    }
  ]
})

export const temp = () => {
  console.log(123)
}
