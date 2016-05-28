  $(function () {
    $.getJSON( "./data.json", function( data ) {
    var datas = [];
    var all_settle_spread = 0;
    var settle_count = 0;
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
        console.log("@@");
        settle_count++;
        all_settle_spread = all_settle_spread + parseInt(val.spread);
      }
      datas.push(obj);
    });

    $('#container').highcharts({
        title: {
            text: '2015小台指期',
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
    console.log(all_settle_spread);
    console.log(settle_count);
    $('.all_settle_spread').text(averge_settle_spread);
  });

    $.getJSON( "./data2.json", function( data ) {
    var datas = [];
    var all_settle_spread = 0;
    var settle_count = 0;
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
        console.log("@@");
        settle_count++;
        all_settle_spread = all_settle_spread + parseInt(val.spread);
      }
      datas.push(obj);
    });

    $('#container2').highcharts({
        title: {
            text: '2015小台指期',
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
    console.log(all_settle_spread);
    console.log(settle_count);
    $('.all_settle_spread2').text(averge_settle_spread);
  });


});
