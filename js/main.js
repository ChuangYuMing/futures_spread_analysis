$(function () {
  var data_year = ["15", "14", "13", "12"];
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "./data" + s_year + ".json", function( data ) {
      var datas = [];
      var all_settle_spread = 0;
      var settle_count = 0;
      var data_months = new Array();
      for (var i = 0; i < 12; i++) {
        data_months[i] = [];
      }
      // console.log(data)
      $.each( data, function( key, val ) {
        obj = {}
        obj.y = val.spread
        // obj.x = String(key)
        obj.date = key
        obj.close_month = val.close_month
        obj.close_month_price = val.close_month_price
        obj.is_settle = val.is_settle
        obj.next_month = val.next_month
        obj.next_month_price = val.next_month_price
        if (obj.is_settle == true) {
          settle_count++;
          all_settle_spread = all_settle_spread + parseInt(val.spread);
        }

        month = key.slice(5, 7);
        month = month.slice(0,1) == "0" ? parseInt(month.slice(1,2)) : parseInt(month);
        data_months[month-1].push(obj);
        datas.push(obj);
      });

      $.each( data_months, function(m_key, m_arr) {
        mon = m_key + 1;
        mon_html = '<div class="per_month m' + mon + '"></div>';
        console.log(mon_html);
        $('#months_year' + s_year).append(mon_html);
        $("#months_year" + s_year + ' .m' + mon).highcharts({
            title: {
                text: '20' + s_year + '-' + mon + '小台指期',
                x: -20 //center
            },
            subtitle: {
                text: '目的: 價差分析',
                x: -20
            },
            yAxis: {
                title: {
                    text: '價差'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            xAxis: {
                visible: false
            },
            useHTML: true,
            tooltip: {
                valueSuffix: '',
                formatter: function() {
                  console.log(this);
                  html = '<span>日期：<span>' + this.point.date + '<br>' +
                    '<span>近月小台： <span>' + this.point.close_month +
                    '<span> 成交價<span>' + this.point.close_month_price + '<br>' +
                    '<span>次月小台： <span>' + this.point.next_month +
                    '<span> 成交價<span>' + this.point.next_month_price + '<br>' +
                    '<span>價差：<span>' + this.point.y + '<br>' ;

                  if (this.point.is_settle == true) {
                    html = html + '<span style="color: red">結算日<span>';
                  }
                  return html;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: '小台',
                data: m_arr
            }]
        });
      })

      $("#container" + s_year).highcharts({
          title: {
              text: '20' + s_year + '小台指期',
              x: -20 //center
          },
          subtitle: {
              text: '目的: 價差分析',
              x: -20
          },
          yAxis: {
              title: {
                  text: '價差'
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          },
          xAxis: {
              visible: false
          },
          useHTML: true,
          tooltip: {
              valueSuffix: '',
              formatter: function() {
                console.log(this);
                html = '<span>日期：<span>' + this.point.date + '<br>' +
                  '<span>近月小台： <span>' + this.point.close_month +
                  '<span> 成交價<span>' + this.point.close_month_price + '<br>' +
                  '<span>次月小台： <span>' + this.point.next_month +
                  '<span> 成交價<span>' + this.point.next_month_price + '<br>' +
                  '<span>價差：<span>' + this.point.y + '<br>' ;

                if (this.point.is_settle == true) {
                  html = html + '<span style="color: red">結算日<span>';
                }
                return html;
              }
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: '小台',
              data: datas
          }]
      });

      averge_settle_spread = all_settle_spread / settle_count;
      $('.all_settle_spread' + s_year).text(averge_settle_spread);

    }) //end get data
  }) //end each year
}) //end main
