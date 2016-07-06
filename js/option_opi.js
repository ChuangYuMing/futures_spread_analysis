$(function () {
  var data_year = ["14", "15", "16"];
  option_opi(data_year);
  weighted_index(data_year);

  $('.menu span').click(function(){
    year = $(this).data("year");
    $("#year-" + year).show();
    $("#year-" + year).siblings(".item").hide();
  })
}) //end main


function weighted_index(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/weighted_index/20" + s_year + ".json", function( data ) {
      var datas = [];
      $.each( data, function( key, val ) {
        obj = {}
        obj.y = parseInt(val.w_index)
        obj.x = Date.parse(key)
        obj.date = key
        obj.w_index = val.w_index
        datas.push(obj);
      });

      create_common_hightstock("w-index", "加權指數", "價位", s_year, datas)

    }) //end get data
  }) //end each year
}


function option_opi(data_year){
  $.each(data_year, function( key, s_year ) {
    $.getJSON( "../data/three_corporate_option_opi/20" + s_year + ".json", function( data ) {
      var fbc_datas = [];
      var fbca_datas = [];
      var fbp_datas = [];
      var fbpa_datas = [];
      var fsc_datas = [];
      var fsca_datas = [];
      var fsp_datas = [];
      var fspa_datas = [];

      var items = [
        {
          name: "外資Buy Call未平倉量",
          class: "buy-call",
          data: fbc_datas
        },{
          name: "外資Buy Call未平倉金額",
          class: "buy-call-amount",
          data: fbca_datas
        },{
          name: "外資Buy Put未平倉量",
          class: "buy-put",
          data: fbp_datas
        },{
          name: "外資Buy Put未平倉金額",
          class: "buy-put-amount",
          data: fbpa_datas
        },{
          name: "外資Sell Call未平倉量",
          class: "sell-call",
          data: fsc_datas
        },{
          name: "外資Sell Call未平倉金額",
          class: "sell-call-amount",
          data: fsca_datas
        },{
          name: "外資Sell Put未平倉量",
          class: "sell-put",
          data: fsp_datas
        },{
          name: "外資Sell Put未平倉金額",
          class: "sell-put-amount",
          data: fspa_datas
        }]


      $.each( data, function( key, val ) {
        fbc = {}
        fbc.y = parseInt(val.f_buy_call)
        fbc.x = Date.parse(key)
        fbc.date = key
        fbc_datas.push(fbc);

        fbca = {}
        fbca.y = parseInt(val.f_buy_call_amount)
        fbca.x = Date.parse(key)
        fbca.date = key
        fbca_datas.push(fbca);

        fbp = {}
        fbp.y = parseInt(val.f_buy_put)
        fbp.x = Date.parse(key)
        fbp.date = key
        fbp_datas.push(fbp);

        fbpa = {}
        fbpa.y = parseInt(val.f_buy_put_amount)
        fbpa.x = Date.parse(key)
        fbpa.date = key
        fbpa_datas.push(fbpa);

        fsc = {}
        fsc.y = parseInt(val.f_sell_call)
        fsc.x = Date.parse(key)
        fsc.date = key
        fsc_datas.push(fsc);

        fsca = {}
        fsca.y = parseInt(val.f_sell_call_amount)
        fsca.x = Date.parse(key)
        fsca.date = key
        fsca_datas.push(fsca);

        fsp = {}
        fsp.y = parseInt(val.f_sell_put)
        fsp.x = Date.parse(key)
        fsp.date = key
        fsp_datas.push(fsp);

        fspa = {}
        fspa.y = parseInt(val.f_sell_put_amount)
        fspa.x = Date.parse(key)
        fspa.date = key
        fspa_datas.push(fspa);
      });

      $.each(items, function(key, item) {
        create_common_hightstock(item.class, item.name, "值", s_year, item.data)
      })

    }) //end get data
  }) //end each year
}


function create_common_hightstock(type, subject, y_name, year, datas) {
  var container = "#year-" + year + " ." + type
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
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%m/%d}',
            rotation: 45,
            align: 'left'
        }
      },
     rangeSelector : {
          selected : 5
      },
      tooltip: {
          valueSuffix: '',
          useHTML: true,
          formatter: function() {
            console.log(this);
            html = '<span>日期：<span>' + this.points[0].point.date + '<br>' +
              '<span>' +y_name+ ': <span>' + this.points[0].point.y + '<br>' ;

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
          turboThreshold: 0,
          name: subject,
          data: datas
      }]
  });
}
