$(function() {
  var data_year = ['14', '15', '16', '17']
  weighted_index(data_year)
  tx_open_interest(data_year)
  three_opi_bull(data_year)
  three_opi_bear(data_year)
  three_opi_diff(data_year)

  $('.menu span').click(function() {
    year = $(this).data('year')
    $('#year-' + year).show()
    $('#year-' + year).siblings('.item').hide()
  })
}) //end main

function create_common_hightstock(type, subject, y_name, year, datas) {
  var container = '#year-' + year + ' .' + type
  $(container).highcharts('StockChart', {
    title: {
      text: '20' + year + subject,
      x: -20 //center
    },
    subtitle: {
      text: '',
      x: -20
    },
    yAxis: {
      title: {
        text: y_name
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
      formatter: function() {
        console.log(this)
        html =
          '<span>日期：<span>' +
          this.points[0].point.date +
          '<br>' +
          '<span>' +
          y_name +
          ': <span>' +
          this.points[0].point.y +
          '<br>'

        if (this.points[0].point.is_settle == true) {
          html = html + '<span style="color: red">結算日<span>'
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
        data: datas
      }
    ]
  })
}

function create_opi_hightstock(params) {
  var year = params.year
  var subject = params.subject
  var series = params.series
  var container = params.container
  $(container).highcharts('StockChart', {
    title: {
      text: '20' + year + subject,
      x: -20 //center
    },
    subtitle: {
      text: '',
      x: -20
    },
    rangeSelector: {
      selected: 5
    },
    yAxis: {
      title: {
        text: '量'
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
    useHTML: true,
    tooltip: {
      valueSuffix: '',
      formatter: function() {
        console.log(this)
        html =
          '<span>日期：</span>' +
          this.points[0].point.date +
          '<br>' +
          '<span style="color:' +
          this.points[0].color +
          '">' +
          this.points[0].point.series.name +
          '</span>: <b>' +
          this.points[0].y +
          '</b><br>' +
          '<span style="color:' +
          this.points[1].color +
          '">' +
          this.points[1].point.series.name +
          '</span>: <b>' +
          this.points[1].y +
          '</b><br>' +
          '<span style="color:' +
          this.points[2].color +
          '">' +
          this.points[2].point.series.name +
          '</span>: <b>' +
          this.points[2].y +
          '</b><br>' +
          '<span style="color:' +
          this.points[3].color +
          '">' +
          this.points[3].point.series.name +
          '</span>: <b>' +
          this.points[3].y +
          '</b>'

        if (this.points[0].point.is_settle == true) {
          html = html + '<span style="color: red">結算日<span>'
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
        name: series.total.name,
        data: series.total.data
      },
      {
        name: series.foreign.name,
        data: series.foreign.data
      },
      {
        name: series.trust.name,
        data: series.trust.data
      },
      {
        name: series.self.name,
        data: series.self.data
      }
    ]
  })
}

function three_opi_bear(data_year) {
  $.each(data_year, function(key, s_year) {
    $.getJSON(
      '../data/three_corporate_open_interest/20' + s_year + '.json',
      function(data) {
        var self_datas = []
        var trust_datas = []
        var foreign_datas = []
        var total_datas = []
        $.each(data, function(key, val) {
          self_obj = {}
          self_obj.y = parseInt(val.bear_self)
          self_obj.x = Date.parse(key)
          self_obj.is_settle = val.is_settle
          self_obj.date = key

          trust_obj = {}
          trust_obj.y = parseInt(val.bear_trust)
          trust_obj.x = Date.parse(key)
          trust_obj.is_settle = val.is_settle
          trust_obj.date = key

          foreign_obj = {}
          foreign_obj.y = parseInt(val.bear_foreign)
          foreign_obj.x = Date.parse(key)
          foreign_obj.is_settle = val.is_settle
          foreign_obj.date = key

          total_obj = {}
          total_obj.y = parseInt(val.bear_total)
          total_obj.x = Date.parse(key)
          total_obj.is_settle = val.is_settle
          total_obj.date = key

          self_datas.push(self_obj)
          trust_datas.push(trust_obj)
          foreign_datas.push(foreign_obj)
          total_datas.push(total_obj)
        })

        var params = {
          year: s_year,
          subject: '空方未平倉',
          series: {
            self: {
              name: '自營',
              data: self_datas
            },
            trust: {
              name: '投信',
              data: trust_datas
            },
            foreign: {
              name: '外資',
              data: foreign_datas
            },
            total: {
              name: '總和',
              data: total_datas
            }
          },
          container: '#year-' + s_year + ' .bear-opi'
        }
        create_opi_hightstock(params)
      }
    ) //end get data
  }) //end each year
}

function three_opi_bull(data_year) {
  $.each(data_year, function(key, s_year) {
    $.getJSON(
      '../data/three_corporate_open_interest/20' + s_year + '.json',
      function(data) {
        var self_datas = []
        var trust_datas = []
        var foreign_datas = []
        var total_datas = []
        $.each(data, function(key, val) {
          self_obj = {}
          self_obj.y = parseInt(val.bull_self)
          self_obj.x = Date.parse(key)
          self_obj.is_settle = val.is_settle
          self_obj.date = key

          trust_obj = {}
          trust_obj.y = parseInt(val.bull_trust)
          trust_obj.x = Date.parse(key)
          trust_obj.is_settle = val.is_settle
          trust_obj.date = key

          foreign_obj = {}
          foreign_obj.y = parseInt(val.bull_foreign)
          foreign_obj.x = Date.parse(key)
          foreign_obj.is_settle = val.is_settle
          foreign_obj.date = key

          total_obj = {}
          total_obj.y = parseInt(val.bull_total)
          total_obj.x = Date.parse(key)
          total_obj.is_settle = val.is_settle
          total_obj.date = key

          self_datas.push(self_obj)
          trust_datas.push(trust_obj)
          foreign_datas.push(foreign_obj)
          total_datas.push(total_obj)
        })

        var params = {
          year: s_year,
          subject: '多方未平倉',
          series: {
            self: {
              name: '自營',
              data: self_datas
            },
            trust: {
              name: '投信',
              data: trust_datas
            },
            foreign: {
              name: '外資',
              data: foreign_datas
            },
            total: {
              name: '總和',
              data: total_datas
            }
          },
          container: '#year-' + s_year + ' .bull-opi'
        }
        create_opi_hightstock(params)
      }
    ) //end get data
  }) //end each year
}

// 多空淨額
function three_opi_diff(data_year) {
  $.each(data_year, function(key, s_year) {
    $.getJSON(
      '../data/three_corporate_open_interest/20' + s_year + '.json',
      function(data) {
        var self_datas = []
        var trust_datas = []
        var foreign_datas = []
        var total_datas = []
        $.each(data, function(key, val) {
          self_obj = {}
          self_obj.y = parseInt(val.diff_self)
          self_obj.x = Date.parse(key)
          self_obj.is_settle = val.is_settle
          self_obj.date = key

          trust_obj = {}
          trust_obj.y = parseInt(val.diff_trust)
          trust_obj.x = Date.parse(key)
          trust_obj.is_settle = val.is_settle
          trust_obj.date = key

          foreign_obj = {}
          foreign_obj.y = parseInt(val.diff_foreign)
          foreign_obj.x = Date.parse(key)
          foreign_obj.is_settle = val.is_settle
          foreign_obj.date = key

          total_obj = {}
          total_obj.y = parseInt(val.diff_total)
          total_obj.x = Date.parse(key)
          total_obj.is_settle = val.is_settle
          total_obj.date = key

          self_datas.push(self_obj)
          trust_datas.push(trust_obj)
          foreign_datas.push(foreign_obj)
          total_datas.push(total_obj)
        })

        var params = {
          year: s_year,
          subject: '多空淨額',
          series: {
            self: {
              name: '自營',
              data: self_datas
            },
            trust: {
              name: '投信',
              data: trust_datas
            },
            foreign: {
              name: '外資',
              data: foreign_datas
            },
            total: {
              name: '總和',
              data: total_datas
            }
          },
          container: '#year-' + s_year + ' .diff-opi'
        }
        create_opi_hightstock(params)
      }
    ) //end get data
  }) //end each year
}

function tx_open_interest(data_year) {
  $.each(data_year, function(key, s_year) {
    $.getJSON('../data/tx_open_interest/20' + s_year + '.json', function(data) {
      var datas = []
      $.each(data, function(key, val) {
        obj = {}
        obj.y = parseInt(val.open_interest)
        obj.x = Date.parse(key)
        obj.date = key
        obj.open_interest = val.open_interest
        obj.is_settle = val.is_settle
        datas.push(obj)
      })

      create_common_hightstock('tx-opi', '台指未平倉', '量', s_year, datas)
    }) //end get data
  }) //end each year
}

function weighted_index(data_year) {
  $.each(data_year, function(key, s_year) {
    $.getJSON('../data/weighted_index/20' + s_year + '.json', function(data) {
      var datas = []
      $.each(data, function(key, val) {
        obj = {}
        obj.y = parseInt(val.w_index)
        obj.x = Date.parse(key)
        obj.date = key
        obj.w_index = val.w_index
        obj.is_settle = val.is_settle
        datas.push(obj)
      })

      create_common_hightstock('w-index', '加權指數', '價位', s_year, datas)
    }) //end get data
  }) //end each year
}
