$(function () {
  var data_year = ["11", "12", "13", "14", "15", "16"];
  weighted_index(data_year);
  tx_open_interest(data_year);
  three_opi_bull(data_year);
  three_opi_bear(data_year);
  other_opi_bull(data_year);
  other_opi_bear(data_year);
}) //end main

function other_opi_bear(data_year){
  $.each(data_year, function( key, s_year ) {
    var res_obj = {}
    $.getJSON( "../data/three_corporate_open_interest/20" + s_year + ".json", function( data ) {

      $.each( data, function( key, val ) {
        res_obj[key] = {}
        res_obj[key].total = val.bear_total
        res_obj[key].foreign = val.bear_foreign
      });

      $.getJSON( "../data/tx_open_interest/20" + s_year + ".json", function( data ) {

        $.each( data, function( key, val ) {
          // res_obj[key] = {}
          res_obj[key].tx_open_interest = val.open_interest
        });


        var other_all_datas = [];
        var other_f_datas = [];
        $.each( res_obj, function( key, val ) {
          var other_all = {} //台指未沖銷 -  三大法人總合
          var other_f = {}  //台指未沖銷 -  外資

          other_all.y = parseInt(val.tx_open_interest) - parseInt(val.total)
          other_all.date = key
          other_all.amount = parseInt(val.tx_open_interest) - parseInt(val.total)
          other_all_datas.push(other_all);

          other_f.y = parseInt(val.tx_open_interest) - parseInt(val.foreign)
          other_f.date = key
          other_f.amount = parseInt(val.tx_open_interest) - parseInt(val.foreign)
          other_f_datas.push(other_f);
        });


        $("#year-" + s_year + " .other-bear-opi").highcharts({
          title: {
              text: '20' + s_year + '空方其他未平倉',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '量'
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
                  '<span>量: <span>' + this.point.amount + '<br>' ;

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
              name: '台指未沖銷 - 三大法人總合',
              data: other_all_datas
          }, {
              name: '台指未沖銷 - 外資',
              data: other_f_datas
          }]
        });

      }) //end get data
    }) //end get data
  }) //end each year
}


function other_opi_bull(data_year){
  $.each(data_year, function( key, s_year ) {
    var res_obj = {}
    $.getJSON( "../data/three_corporate_open_interest/20" + s_year + ".json", function( data ) {

      $.each( data, function( key, val ) {
        res_obj[key] = {}
        res_obj[key].total = val.bull_total
        res_obj[key].foreign = val.bull_foreign
      });

      $.getJSON( "../data/tx_open_interest/20" + s_year + ".json", function( data ) {

        $.each( data, function( key, val ) {
          // res_obj[key] = {}
          res_obj[key].tx_open_interest = val.open_interest
        });


        var other_all_datas = [];
        var other_f_datas = [];
        $.each( res_obj, function( key, val ) {
          var other_all = {} //台指未沖銷 -  三大法人總合
          var other_f = {}  //台指未沖銷 -  外資

          other_all.y = parseInt(val.tx_open_interest) - parseInt(val.total)
          other_all.date = key
          other_all.amount = parseInt(val.tx_open_interest) - parseInt(val.total)
          other_all_datas.push(other_all);

          other_f.y = parseInt(val.tx_open_interest) - parseInt(val.foreign)
          other_f.date = key
          other_f.amount = parseInt(val.tx_open_interest) - parseInt(val.foreign)
          other_f_datas.push(other_f);
        });


        $("#year-" + s_year + " .other-bull-opi").highcharts({
          title: {
              text: '20' + s_year + '多方其他未平倉',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '量'
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
                  '<span>量: <span>' + this.point.amount + '<br>' ;

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
              name: '台指未沖銷 - 三大法人總合',
              data: other_all_datas
          }, {
              name: '台指未沖銷 - 外資',
              data: other_f_datas
          }]
        });

      }) //end get data
    }) //end get data
  }) //end each year
}


function three_opi_bear(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/three_corporate_open_interest/20" + s_year + ".json", function( data ) {
      var self_datas = [];
      var trust_datas = [];
      var foreign_datas = [];
      var total_datas = [];
      $.each( data, function( key, val ) {
        self_obj = {}
        self_obj.y = parseInt(val.bear_self)
        self_obj.amount = val.bear_self
        self_obj.date = key

        trust_obj = {}
        trust_obj.y = parseInt(val.bear_trust)
        trust_obj.amount = val.bear_trust
        trust_obj.date = key

        foreign_obj = {}
        foreign_obj.y = parseInt(val.bear_foreign)
        foreign_obj.amount = val.bear_foreign
        foreign_obj.date = key

        total_obj = {}
        total_obj.y = parseInt(val.bear_total)
        total_obj.amount = val.bear_total
        total_obj.date = key

        self_datas.push(self_obj);
        trust_datas.push(trust_obj);
        foreign_datas.push(foreign_obj);
        total_datas.push(total_obj);
      });

      $("#year-" + s_year + " .bear-opi").highcharts({
          title: {
              text: '20' + s_year + '空方未平倉',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '量'
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
                  '<span>量: <span>' + this.point.amount + '<br>' ;

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
              name: '自營',
              data: self_datas
          }, {
              name: '投信',
              data: trust_datas
          }, {
              name: '外資',
              data: foreign_datas
          }, {
              name: '總和',
              data: total_datas
          }]
      });

    }) //end get data
  }) //end each year
}


function three_opi_bull(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/three_corporate_open_interest/20" + s_year + ".json", function( data ) {
      var self_datas = [];
      var trust_datas = [];
      var foreign_datas = [];
      var total_datas = [];
      $.each( data, function( key, val ) {
        self_obj = {}
        self_obj.y = parseInt(val.bull_self)
        self_obj.amount = val.bull_self
        self_obj.date = key

        trust_obj = {}
        trust_obj.y = parseInt(val.bull_trust)
        trust_obj.amount = val.bull_trust
        trust_obj.date = key

        foreign_obj = {}
        foreign_obj.y = parseInt(val.bull_foreign)
        foreign_obj.amount = val.bull_foreign
        foreign_obj.date = key

        total_obj = {}
        total_obj.y = parseInt(val.bull_total)
        total_obj.amount = val.bull_total
        total_obj.date = key

        self_datas.push(self_obj);
        trust_datas.push(trust_obj);
        foreign_datas.push(foreign_obj);
        total_datas.push(total_obj);
      });

      $("#year-" + s_year + " .bull-opi").highcharts({
          title: {
              text: '20' + s_year + '多方未平倉',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '量'
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
                  '<span>量: <span>' + this.point.amount + '<br>' ;

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
              name: '自營',
              data: self_datas
          }, {
              name: '投信',
              data: trust_datas
          }, {
              name: '外資',
              data: foreign_datas
          }, {
              name: '總和',
              data: total_datas
          }]
      });

    }) //end get data
  }) //end each year
}

function tx_open_interest(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/tx_open_interest/20" + s_year + ".json", function( data ) {
      var datas = [];
      $.each( data, function( key, val ) {
        obj = {}
        obj.y = parseInt(val.open_interest)
        // obj.x = String(key)
        obj.date = key
        obj.open_interest = val.open_interest
        datas.push(obj);
      });

      $("#year-" + s_year + " .tx-opi").highcharts({
          title: {
              text: '20' + s_year + '台指期未平倉',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '量'
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
                  '<span>量: <span>' + this.point.open_interest + '<br>' ;

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
              name: '台指期未平倉',
              data: datas
          }]
      });

    }) //end get data
  }) //end each year
}

function weighted_index(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/weighted_index/20" + s_year + ".json", function( data ) {
      var datas = [];
      $.each( data, function( key, val ) {
        obj = {}
        obj.y = parseInt(val.w_index)
        // obj.x = String(key)
        obj.date = key
        obj.w_index = val.w_index
        datas.push(obj);
      });

      $("#year-" + s_year + " .w-index").highcharts({
          title: {
              text: '20' + s_year + '加權指數',
              x: -20 //center
          },
          subtitle: {
              text: '',
              x: -20
          },
          yAxis: {
              title: {
                  text: '價位'
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
                  '<span>股價: <span>' + this.point.w_index + '<br>' ;

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
              name: '加權指數',
              data: datas
          }]
      });

    }) //end get data
  }) //end each year
}

