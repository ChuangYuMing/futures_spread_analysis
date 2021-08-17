(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{41:function(e,t,n){},66:function(e,t,n){},67:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(34),l=n.n(c),i=(n(41),n(17)),o=n(3),s=n(2),u=n(9),d=n.n(u),f=n(10),j=n.n(f),b=n(35),h=n.n(b).a.create({baseURL:"https://storage.googleapis.com/jamie_stock/"}),p=function(e){return h.get("weighted_index/".concat(e,".json")).then((function(e){return e.data}))},m=function(e){return h.get("three_corporate_option_opi/".concat(e,".json")).then((function(e){return e.data}))},x=function(e){return h.get("three_corporate_open_interest/".concat(e,".json")).then((function(e){return e.data}))},O=function(e){return h.get("tx_open_interest/".concat(e,".json")).then((function(e){return e.data}))},v=function(){return h.get("securities_loan_and_stock_lending/loan-and-lending.json").then((function(e){return e.data}))},y=function(){return h.get("stock_futures_list/stock_futures_list.json").then((function(e){return e.data}))};function _(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3;return function(){for(var a=arguments.length,r=new Array(a),c=0;c<a;c++)r[c]=arguments[c];clearTimeout(t),t=setTimeout((function(){e.apply(void 0,r)}),n)}}function g(e){return(e||0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}var N=function(e){var t=e.subject,n=e.yName,a=e.year,r=e.data,c=e.seriesType,l=void 0===c?"line":c,i=e.handleHoverDate,o=void 0===i?function(){}:i;return{title:{text:"".concat(a," ").concat(t),x:-20},subtitle:{text:"",x:-20},yAxis:{title:{text:n},plotLines:[{value:0,width:1,color:"#808080"}]},xAxis:{type:"datetime",labels:{format:"{value:%m/%d}",rotation:45,align:"left"}},rangeSelector:{selected:5},tooltip:{valueSuffix:"",useHTML:!0,formatter:function(){o(this.points[0].point.date,"".concat(a," ").concat(t));var e="<span>\u65e5\u671f\uff1a<span>".concat(this.points[0].point.date,"<br>")+"<span>".concat(n,": <span>").concat(g(this.points[0].point.y),"<br>");return!0===this.points[0].point.is_settle&&(e+='<span style="color: red">\u7d50\u7b97\u65e5<span>'),e}},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},plotOptions:{candlestick:{color:"green",upColor:"red"}},series:[{type:l,turboThreshold:0,name:t,data:r}]}},S=function(e,t,n,a){return{title:{text:"".concat(n," ").concat(e),x:-20},subtitle:{text:"",x:-20},rangeSelector:{selected:5},yAxis:{title:{text:t},plotLines:[{value:0,width:1,color:"#808080"}]},xAxis:{type:"datetime",labels:{format:"{value:%m/%d}",rotation:45,align:"left"}},useHTML:!0,tooltip:{valueSuffix:"",formatter:function(){var e=this.points.reduce((function(e,t){return"".concat(e,'<span style="color:').concat(t.color,'">').concat(t.point.series.name,"</span>: <b>").concat(g(t.y),"</b><br>")}),""),t="<span>\u65e5\u671f\uff1a</span>".concat(this.points[0].point.date,"<br>").concat(e);return!0===this.points[0].point.is_settle&&(t+='<span style="color: red">\u7d50\u7b97\u65e5<span>'),t}},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:a}},V=function(e){if(e&&(null===e||void 0===e?void 0:e.series)&&(null===e||void 0===e?void 0:e.series[0])){var t=e.series[0],n=e.xAxis[0],a=t.xData[0],r=t.xData[t.xData.length-1];n.setExtremes(a,r)}},k=n(0);var w=function(e){var t=e.year,n=Object(a.useRef)(null),r=Object(a.useState)({}),c=Object(s.a)(r,2),l=c[0],i=c[1];return Object(a.useEffect)((function(){p(t).then((function(e){var a,r=[];for(var c in e){var l=e[c],o={};o.x=Date.parse(c),o.close=parseInt(l.w_index),o.open=parseInt(l.open),o.high=parseInt(l.high),o.low=parseInt(l.low),o.date=c,o.is_settle=l.is_settle,r.push(o)}var s=N({subject:"\u52a0\u6b0a\u6307\u6578",yName:"\u50f9\u4f4d",year:t,data:r,seriesType:"candlestick"});i(s),V(null===n||void 0===n||null===(a=n.current)||void 0===a?void 0:a.chart)}))}),[t]),Object(k.jsx)(j.a,{ref:n,highcharts:d.a,constructorType:"stockChart",options:l})};var C=function(e){var t=e.defaultYear,n=e.year,a=e.handler,r=Array(5).fill().map((function(e,n){return t-n})).map((function(e){return Object(k.jsx)("option",{value:e,children:e},e)}));return Object(k.jsxs)("div",{className:"year-selector",children:[Object(k.jsx)("label",{htmlFor:"year",children:"Choose a \byear:"}),Object(k.jsx)("select",{className:"ml-2 text-orange-700 outline-none",name:"year",value:n,onChange:function(e){a(e.target.value)},children:r})]})},D=n(16),I=n.n(D),T=n(18),E=n(12);function B(e){var t=e.itemMap,n=e.selectedChartTypes,a=e.handler,r=e.splitItem,c=void 0===r?"":r,l=function(e){var r=e.target.dataset.value,c=Object(T.a)(n);n.includes(r)?c.splice(n.indexOf(r),1):c.push(r);var l=t.map((function(e){return e.name})).filter((function(e){return c.includes(e)}));a(l)},i=t.findIndex((function(e){return e.name===c}));i=-1===i?t.length:i;var o=t.slice(0,i),s=t.slice(i,t.length),u=function(e,t){var a=n.includes(e.name);return Object(k.jsx)("span",{tabIndex:t,className:Object(E.a)("inline-flex","items-center","justify-center","py-1","px-2","border","cursor-pointer","mr-1","mt-1",a?"border-blue-800":"border-blue-600",a?"text-white":"text-blue-600",a&&"bg-blue-800"),"data-value":e.name,onClick:l,onKeyDown:l,role:"button",children:e.name},e.name)},d=o.map((function(e,t){return u(e,t)})),f=s.map((function(e,t){return u(e,t)}));return Object(k.jsxs)("div",{className:"flex flex-wrap",children:[Object(k.jsx)("div",{className:"mb-4",children:d}),Object(k.jsx)("div",{className:"mb-4",children:f})]})}B.defaultProps={splitItem:""};var A=B;I()(d.a);var P=function(e){var t=e.year,n=[{name:"\u5916\u8cc7 Buy Call \u672a\u5e73\u5009\u91cf",targetValue:"f_buy_call"},{name:"\u5916\u8cc7 Buy Call \u672a\u5e73\u5009\u91d1\u984d",targetValue:"f_buy_call_amount"},{name:"\u5916\u8cc7 Buy Put \u672a\u5e73\u5009\u91cf",targetValue:"f_buy_put"},{name:"\u5916\u8cc7 Buy Put \u672a\u5e73\u5009\u91d1\u984d",targetValue:"f_buy_put_amount"},{name:"\u5916\u8cc7 Sell Call \u672a\u5e73\u5009\u91cf",targetValue:"f_sell_call"},{name:"\u5916\u8cc7 Sell Call \u672a\u5e73\u5009\u91d1\u984d",targetValue:"f_sell_call_amount"},{name:"\u5916\u8cc7 Sell Put \u672a\u5e73\u5009\u91cf",targetValue:"f_sell_put"},{name:"\u5916\u8cc7 Sell Put \u672a\u5e73\u5009\u91d1\u984d",targetValue:"f_sell_put_amount"},{name:"\u5916\u8cc7\u591a\u65b9\u53e3\u6578",targetValue:"f_long"},{name:"\u5916\u8cc7\u591a\u65b9\u5951\u7d04\u91d1\u984d",targetValue:"f_long_amount"},{name:"\u5916\u8cc7\u7a7a\u65b9\u53e3\u6578",targetValue:"f_short"},{name:"\u5916\u8cc7\u7a7a\u65b9\u5951\u7d04\u91d1\u984d",targetValue:"f_short_amount"},{name:"\u5916\u8cc7\u591a\u7a7a\u6de8\u984d\u53e3\u6578",targetValue:"f_net"},{name:"\u5916\u8cc7\u591a\u7a7a\u6de8\u984d\u5951\u7d04\u91d1\u984d",targetValue:"f_net_amount"},{name:"\u81ea\u71df Buy Call \u672a\u5e73\u5009\u91cf",targetValue:"self_buy_call"},{name:"\u81ea\u71df Buy Call \u672a\u5e73\u5009\u91d1\u984d",targetValue:"self_buy_call_amount"},{name:"\u81ea\u71df Buy Put \u672a\u5e73\u5009\u91cf",targetValue:"self_buy_put"},{name:"\u81ea\u71df Buy Put \u672a\u5e73\u5009\u91d1\u984d",targetValue:"self_buy_put_amount"},{name:"\u81ea\u71df Sell Call \u672a\u5e73\u5009\u91cf",targetValue:"self_sell_call"},{name:"\u81ea\u71df Sell Call \u672a\u5e73\u5009\u91d1\u984d",targetValue:"self_sell_call_amount"},{name:"\u81ea\u71df Sell Put \u672a\u5e73\u5009\u91cf",targetValue:"self_sell_put"},{name:"\u81ea\u71df Sell Put \u672a\u5e73\u5009\u91d1\u984d",targetValue:"self_sell_put_amount"},{name:"\u81ea\u71df\u591a\u65b9\u53e3\u6578",targetValue:"self_long"},{name:"\u81ea\u71df\u591a\u65b9\u5951\u7d04\u91d1\u984d",targetValue:"self_long_amount"},{name:"\u81ea\u71df\u7a7a\u65b9\u53e3\u6578",targetValue:"self_short"},{name:"\u81ea\u71df\u7a7a\u65b9\u5951\u7d04\u91d1\u984d",targetValue:"self_short_amount"},{name:"\u81ea\u71df\u591a\u7a7a\u6de8\u984d\u53e3\u6578",targetValue:"self_net"},{name:"\u81ea\u71df\u591a\u7a7a\u6de8\u984d\u5951\u7d04\u91d1\u984d",targetValue:"self_net_amount"}],r=Object(a.useState)([]),c=Object(s.a)(r,2),l=c[0],i=c[1],o=Object(a.useRef)([]),u=Object(a.useState)({}),f=Object(s.a)(u,2),b=f[0],h=f[1],p=Object(a.useState)([]),x=Object(s.a)(p,2),O=x[0],v=x[1];function y(){v([])}var S="",w=_((function(e,t){var n=o.current.filter((function(e){return e}));n.forEach((function(e){e.chart.removeAnnotation(S)})),n.forEach((function(n){var a=n.chart;if(a.options.title.text!==t){var r=a.get(e).y;a.addAnnotation({id:e,labelOptions:{y:15,verticalAlign:"bottom",distance:25},labels:[{point:e,text:"".concat(g(r))}]})}})),S=e}),100);return Object(a.useEffect)((function(){m(t).then((function(e){h(e)}))}),[t]),Object(a.useEffect)((function(){var e=O.map((function(e){return function(e){var a=n.filter((function(t){return t.name===e}))[0],r=a.name,c=a.targetValue,l=[];for(var i in b){var o=b[i],s={};s.y=parseInt(o[c]),s.x=Date.parse(i),s.date=i,s.is_settle=o.is_settle,s.id=i,l.push(s)}return N({subject:r,yName:"\u503c",year:t,data:l,handleHoverDate:w})}(e)}));i(e),o.current.forEach((function(e){var t;V(null===e||void 0===e||null===(t=e.current)||void 0===t?void 0:t.chart)}))}),[O,b]),Object(k.jsxs)("div",{className:"md:pb-96",children:[Object(k.jsxs)("div",{className:"inline-flex items-center justify-center my-4",children:[Object(k.jsx)("span",{className:"text-2xl",children:"\u9078\u64c7\u6b0a\u672a\u5e73\u5009"}),Object(k.jsx)("span",{className:"px-2 py-1 ml-4 text-red-500 border border-red-500 cursor-pointer",onClick:y,onKeyDown:y,role:"button",tabIndex:"0",children:"\u6e05\u7a7a"})]}),Object(k.jsx)(A,{itemMap:n,handler:v,selectedChartTypes:O,splitItem:"\u81ea\u71df Buy Call \u672a\u5e73\u5009\u91cf"}),l.map((function(e,t){return Object(k.jsx)(j.a,{ey:e.title.text,ref:function(e){return o.current[t]=e},highcharts:d.a,constructorType:"stockChart",options:e})}))]})};var F=function(){var e=(new Date).getFullYear(),t=Object(a.useState)(String(e)),n=Object(s.a)(t,2),r=n[0],c=n[1];return Object(k.jsxs)("div",{className:"option-open-interest",children:[Object(k.jsx)(C,{defaultYear:e,year:r,handler:c}),Object(k.jsx)(w,{year:r}),Object(k.jsx)(P,{year:r})]})};var M=function(e){var t=e.year,n=[{name:"\u591a\u65b9\u53e3\u6578",targetValue:["bull_foreign","bull_self"]},{name:"\u591a\u65b9\u91d1\u984d",targetValue:["bull_foreign_amount","bull_self_amount"]},{name:"\u7a7a\u65b9\u53e3\u6578",targetValue:["bear_foreign","bear_self"]},{name:"\u7a7a\u65b9\u91d1\u984d",targetValue:["bear_foreign_amount","bear_self_amount"]},{name:"\u591a\u7a7a\u6de8\u984d\u53e3\u6578",targetValue:["diff_foreign","diff_self"]},{name:"\u591a\u7a7a\u6de8\u984d\u91d1\u984d",targetValue:["diff_foreign_amount","diff_self_amount"]}],r=Object(a.useState)([]),c=Object(s.a)(r,2),l=c[0],i=c[1],o=Object(a.useRef)([]),u=Object(a.useState)({}),f=Object(s.a)(u,2),b=f[0],h=f[1],p=Object(a.useState)([]),m=Object(s.a)(p,2),O=m[0],v=m[1];function y(){v([])}return Object(a.useEffect)((function(){x(t).then((function(e){h(e)}))}),[t]),Object(a.useEffect)((function(){function e(e,t){var n=[],a=t.filter((function(t){return t.includes(e)}))[0];for(var r in b){var c=b[r],l={},i=parseInt(c[a]);"total"===e&&(i=parseInt(c[t[0]])+parseInt(c[t[1]])),l.y=i,l.x=Date.parse(r),l.date=r,l.is_settle=c.is_settle,l.id=r,n.push(l)}return n}var a=O.map((function(a){return function(a){var r=n.filter((function(e){return e.name===a}))[0],c=r.name,l=r.targetValue,i=[{name:"\u5916\u8cc7",targetPropertyCheck:"foreign",color:"#054099"},{name:"\u81ea\u71df",targetPropertyCheck:"self",color:"#a86206"},{name:"\u7e3d\u548c",targetPropertyCheck:"total",color:"#207506"}].map((function(t){return{name:t.name,data:e(t.targetPropertyCheck,l),color:t.color}}));return S(c,"\u503c",t,i)}(a)}));i(a),o.current.forEach((function(e){var t;V(null===e||void 0===e||null===(t=e.current)||void 0===t?void 0:t.chart)}))}),[O,b]),Object(k.jsxs)("div",{children:[Object(k.jsxs)("div",{className:"inline-flex items-center justify-center my-4",children:[Object(k.jsx)("span",{className:"text-2xl",children:"\u671f\u8ca8\u672a\u5e73\u5009"}),Object(k.jsx)("span",{className:"px-2 py-1 ml-4 text-red-500 border border-red-500 cursor-pointer",onClick:y,onKeyDown:y,role:"button",tabIndex:"0",children:"\u6e05\u7a7a"})]}),Object(k.jsx)(A,{itemMap:n,handler:v,selectedChartTypes:O}),l.map((function(e,t){return Object(k.jsx)(j.a,{ref:function(e){return o.current[t]=e},highcharts:d.a,constructorType:"stockChart",options:e},e.title.text)}))]})};var L=function(){var e=(new Date).getFullYear(),t=Object(a.useState)(String(e)),n=Object(s.a)(t,2),r=n[0],c=n[1];return Object(k.jsxs)("div",{className:"futures-open-interest",children:[Object(k.jsx)(C,{defaultYear:e,year:r,handler:c}),Object(k.jsx)(w,{year:r}),Object(k.jsx)(M,{year:r})]})};I()(d.a);var R=function(e){var t=e.year,n=[{name:"\u8cb7\u65b9-\u524d\u4e94\u5927\u4ea4\u6613\u4eba",targetValue:"buy_top_five",color:"#c0110b"},{name:"\u8cb7\u65b9-\u524d\u5341\u5927\u4ea4\u6613\u4eba",targetValue:"buy_top_ten",color:"#e75427"},{name:"\u8ce3\u65b9-\u524d\u4e94\u5927\u4ea4\u6613\u4eba",targetValue:"sell_top_five",color:"#0f740c"},{name:"\u8ce3\u65b9-\u524d\u5341\u5927\u4ea4\u6613\u4eba",targetValue:"sell_top_ten",color:"#19c962"},{name:"\u5e02\u5834\u672a\u5e73\u5009",targetValue:"total",color:"#021f9e"}],r=Object(a.useState)([]),c=Object(s.a)(r,2),l=c[0],i=c[1],o=Object(a.useState)([]),u=Object(s.a)(o,2),f=u[0],b=u[1],h=Object(a.useRef)([]),p=Object(a.useRef)({}),m=Object(a.useState)({}),x=Object(s.a)(m,2),v=x[0],y=x[1],w=Object(a.useState)([]),C=Object(s.a)(w,2),D=C[0],I=C[1];function T(){I([])}var E="",B=_((function(e,t){var n=h.current.filter((function(e){return e}));n.forEach((function(e){e.chart.removeAnnotation(E)})),n.forEach((function(n){var a=n.chart;if(a.options.title.text!==t){var r=a.get(e).y;a.addAnnotation({id:e,labelOptions:{y:15,verticalAlign:"bottom",distance:25},labels:[{point:e,text:"".concat(g(r))}]})}})),E=e}),100);return Object(a.useEffect)((function(){O(t).then((function(e){y(e)}))}),[t]),Object(a.useEffect)((function(){var e=D.map((function(e){return function(e){var a=n.filter((function(t){return t.name===e}))[0],r=a.name,c=a.targetValue,l=[];for(var i in v){var o=v[i],s={};s.y=parseInt(o[c]),s.x=Date.parse(i),s.date=i,s.is_settle=o.is_settle,s.id=i,l.push(s)}return N({subject:r,yName:"\u503c",year:t,data:l,handleHoverDate:B})}(e)}));i(e),h.current.forEach((function(e){var t;V(null===e||void 0===e||null===(t=e.current)||void 0===t?void 0:t.chart)}))}),[D,v]),Object(a.useEffect)((function(){function e(e){var t=[];for(var n in v){var a=v[n],r={};r.y=parseInt(a[e]),r.x=Date.parse(n),r.date=n,r.is_settle=a.is_settle,r.id=n,t.push(r)}return t}var a=function(){var a=n.map((function(t){return{name:t.name,data:e(t.targetValue),color:t.color}}));return S("\u671f\u8ca8\u5927\u984d\u4ea4\u6613\u4eba\u672a\u6c96\u92b7\u90e8\u4f4d","\u503c",t,a)}();b(a),setTimeout((function(){var e;V(null===p||void 0===p||null===(e=p.current)||void 0===e?void 0:e.chart)}),0)}),[v]),Object(k.jsxs)("div",{children:[Object(k.jsxs)("div",{className:"inline-flex items-center justify-center my-4",children:[Object(k.jsx)("span",{className:"text-2xl",children:"\u671f\u8ca8\u5927\u984d\u4ea4\u6613\u4eba\u672a\u6c96\u92b7\u90e8\u4f4d"}),Object(k.jsx)("span",{className:"px-2 py-1 ml-4 text-red-500 border border-red-500 cursor-pointer",onClick:T,onKeyDown:T,role:"button",tabIndex:"0",children:"\u6e05\u7a7a"})]}),Object(k.jsx)(A,{itemMap:n,handler:I,selectedChartTypes:D}),Object(k.jsx)(j.a,{ref:p,highcharts:d.a,constructorType:"stockChart",options:f}),l.map((function(e,t){return Object(k.jsx)(j.a,{ref:function(e){return h.current[t]=e},highcharts:d.a,constructorType:"stockChart",options:e},e.title.text)}))]})};var Y=function(){var e=(new Date).getFullYear(),t=Object(a.useState)(String(e)),n=Object(s.a)(t,2),r=n[0],c=n[1];return Object(k.jsxs)("div",{className:"futures-big-open-interest",children:[Object(k.jsx)(C,{defaultYear:e,year:r,handler:c}),Object(k.jsx)(w,{year:r}),Object(k.jsx)(R,{year:r})]})};var K=function(){var e=[{text:"\u9078\u64c7\u6b0a\u672a\u5e73\u5009",route:"option-open-interest",isMatch:!!Object(o.f)("/option-open-interest")},{text:"\u671f\u8ca8\u672a\u5e73\u5009",route:"futures-open-interest",isMatch:!!Object(o.f)("/futures-open-interest")},{text:"\u671f\u8ca8\u5927\u984d\u4ea4\u6613\u4eba\u672a\u6c96\u92b7",route:"futures-big-open-interest",isMatch:!!Object(o.f)("/futures-big-open-interest")},{text:"\u878d\u5238(\u501f\u5238\u8ce3\u51fa)\u5206\u6790",route:"loan-and-lending-analysis",isMatch:!!Object(o.f)("/loan-and-lending-analysis")}];return Object(k.jsx)("div",{className:"sticky top-0 z-10 flex items-center justify-start pb-1 mb-5 bg-white border-b border-gray-500",children:e.map((function(e){return Object(k.jsx)(i.b,{className:Object(E.a)("px-4 py-2 text-lg  hover:text-orange-700",e.isMatch?"text-orange-700":"text-coolGray-700"),to:"/".concat(e.route),children:e.text},e.text)}))})},H=n(23),G=function(e,t){var n=t.day;return e.filter((function(e){var t=e.credit_data,a=(t=Object.keys(t).map((function(e){return t[e]}))).length;if(a<n)return!1;for(var r=a-1;r>=a-n;r-=1){if(0===t[r].bw_sell_on_day)return!1}return!0}))},J=function(e,t){var n=t.day;return e.filter((function(e){var t=e.credit_data,a=(t=Object.keys(t).map((function(e){return t[e]}))).length;if(a<n)return!1;for(var r=a-1;r>=a-n;r-=1){var c=t[r];if(c.bw_return_on_day-c.bw_sell_on_day<=0)return!1}return!0}))},W=function(e){return function(t){return t.filter((function(t){return-1!==e.findIndex((function(e){return e.code===t.code}))}))}};var $=function(e){var t=e.ruleName,n=e.toggleRule,r=e.text,c=e.actionType,l=Object(a.useState)(!1),i=Object(s.a)(l,2),o=i[0],u=i[1],d=Object(a.useState)(""),f=Object(s.a)(d,2),j=f[0],b=f[1];return Object(a.useEffect)((function(){n({ruleName:t,isEnable:o,data:{day:j}})}),[j]),Object(k.jsxs)("div",{className:"inline-flex items-center justify-center mr-4",children:[Object(k.jsx)("input",{className:"mr-1",name:t,type:"checkbox",checked:o,onChange:function(e){var a=e.target,r="checkbox"===a.type?a.checked:a.value;u(r),n({ruleName:t,isEnable:r,data:{day:j}})}}),"byDay"===c?Object(k.jsxs)("div",{className:"inline-block",children:[Object(k.jsx)("input",{className:"w-12 pr-1 text-right text-orange-700 border-b border-gray-800 outline-none",name:"dayInput",type:"text",onChange:function(e){var t=e.target.value;b(t)}}),Object(k.jsx)("span",{children:"\u5929\u9023\u7e8c"})]}):null,Object(k.jsx)("span",{children:r})]})};n(66);var z=function(){var e=Object(a.useState)([]),t=Object(s.a)(e,2),n=t[0],r=t[1];Object(a.useEffect)((function(){y().then((function(e){r(e)}))}),[]);var c=[{ruleName:"LendingByDay",text:"\u501f\u5238\u8ce3\u51fa",callBack:G,actionType:"byDay"},{ruleName:"LendingBalanceReduceByDay",text:"\u501f\u5238\u8ce3\u51fa\u9918\u984d\u6e1b\u5c11",callBack:J,actionType:"byDay"},{ruleName:"FilterStockFuturesList",text:"\u904e\u6ffe\u80a1\u7968\u671f\u8ca8",callBack:W(n),actionType:"check"}],l=Object(a.useState)([]),i=Object(s.a)(l,2),o=i[0],u=i[1],d=Object(a.useState)({}),f=Object(s.a)(d,2),j=f[0],b=f[1],h=Object(a.useState)([]),p=Object(s.a)(h,2),m=p[0],x=p[1],O=Object(a.useState)([]),_=Object(s.a)(O,2),g=_[0],N=_[1],S=Object(a.useState)(null),V=Object(s.a)(S,2),w=V[0],C=V[1],D=Object(a.useState)(""),I=Object(s.a)(D,2),B=I[0],A=I[1];function P(e){var t=e.ruleName,n=e.isEnable,a=Object(T.a)(o);if(n){var r=c.find((function(e){return e.ruleName===t})),l=o.findIndex((function(e){return e.ruleName===t})),i=-1!==l,s=Object(H.a)(Object(H.a)({},r),e);i?a[l]=s:a.push(s)}else{var d=o.findIndex((function(e){return e.ruleName===t}));a.splice(d,1)}u(a)}function F(){var e=o.reduce((function(e,t){return t.callBack(e,t.data)}),m);N(e),C(null),A("")}function M(e){return+parseFloat(e/1e3).toFixed(0)}return Object(a.useEffect)((function(){C(j[B])}),[B]),Object(a.useEffect)((function(){v().then((function(e){var t=Object.keys(e).map((function(t){return e[t]}));b(e),x(t)}))}),[]),Object(k.jsxs)("div",{className:"flex flex-col",children:[Object(k.jsxs)("div",{className:"flex flex-col",children:[Object(k.jsx)("div",{children:c.map((function(e){return Object(k.jsx)($,{ruleName:e.ruleName,text:e.text,toggleRule:P,actionType:e.actionType},e.ruleName)}))}),Object(k.jsx)("span",{className:"self-start inline-block w-auto px-2 py-1 mt-5 border rounded cursor-pointer border-warmGray-600",role:"button",tabIndex:"0",onClick:F,onKeyDown:F,children:"\u53d6\u5f97\u7d50\u679c"})]}),Object(k.jsx)("div",{className:Object(E.a)("flex flex-wrap justify-start mt-10 p-5 border border-gray-800 rounded-lg",!g.length&&"hidden"),children:g.map((function(e){return Object(k.jsxs)("span",{className:B===e.code?"active":"",role:"button",tabIndex:"0",onClick:function(){return A(e.code)},onKeyDown:function(){return A(e.code)},children:[e.code," ",e.name]},e.code)}))}),Object(k.jsx)("div",{className:"stock-info ".concat(w?"":"hidden"),children:Object(k.jsxs)("table",{className:"info-table",children:[Object(k.jsxs)("thead",{children:[Object(k.jsxs)("tr",{role:"row",children:[Object(k.jsxs)("th",{rowSpan:"2",children:[null===w||void 0===w?void 0:w.code," ",null===w||void 0===w?void 0:w.name]}),Object(k.jsx)("th",{colSpan:"6",children:"\u878d\u5238"}),Object(k.jsx)("th",{colSpan:"6",children:"\u501f\u5238\u8ce3\u51fa"})]}),Object(k.jsxs)("tr",{role:"row",children:[Object(k.jsx)("th",{children:"\u524d\u65e5\u9918\u984d"}),Object(k.jsx)("th",{children:"\u8ce3\u51fa"}),Object(k.jsx)("th",{children:"\u8cb7\u9032"}),Object(k.jsx)("th",{children:"\u73fe\u5238"}),Object(k.jsx)("th",{children:"\u4eca\u65e5\u9918\u984d"}),Object(k.jsx)("th",{children:"\u9650\u984d"}),Object(k.jsx)("th",{children:"\u524d\u65e5\u9918\u984d"}),Object(k.jsx)("th",{children:"\u7576\u65e5\u8ce3\u51fa"}),Object(k.jsx)("th",{children:"\u7576\u65e5\u9084\u5238"}),Object(k.jsx)("th",{children:"\u7576\u65e5\u8abf\u6574"}),Object(k.jsx)("th",{children:"\u7576\u65e5\u9918\u984d"}),Object(k.jsx)("th",{children:"\u6b21\u4e00\u71df\u696d\u65e5\u53ef\u9650\u984d"})]})]}),Object(k.jsx)("tbody",{children:Object.keys((null===w||void 0===w?void 0:w.credit_data)||{}).sort((function(e,t){return new Date(t)-new Date(e)})).map((function(e){var t=w.credit_data[e];return Object(k.jsxs)("tr",{children:[Object(k.jsx)("td",{children:e}),Object(k.jsx)("td",{children:M(t.sl_preDay_balance)}),Object(k.jsx)("td",{children:M(t.sl_sell)}),Object(k.jsx)("td",{children:M(t.sl_buy)}),Object(k.jsx)("td",{children:M(t.sl_cash_stock)}),Object(k.jsx)("td",{children:M(t.sl_day_balance)}),Object(k.jsx)("td",{children:M(t.sl_limit)}),Object(k.jsx)("td",{children:M(t.bw_preDay_balance)}),Object(k.jsx)("td",{children:M(t.bw_sell_on_day)}),Object(k.jsx)("td",{children:M(t.bw_return_on_day)}),Object(k.jsx)("td",{children:M(t.bw_adjust_on_day)}),Object(k.jsx)("td",{children:M(t.bw_day_balance)}),Object(k.jsx)("td",{children:M(t.bw_limit_on_next_business_day)})]},e)}))})]})})]})};var U=function(){return Object(k.jsx)("div",{className:"App",children:Object(k.jsxs)(i.a,{children:[Object(k.jsx)(K,{}),Object(k.jsx)("div",{className:"p-5",children:Object(k.jsxs)(o.c,{children:[Object(k.jsx)(o.a,{path:"/option-open-interest",children:Object(k.jsx)(F,{})}),Object(k.jsx)(o.a,{path:"/futures-open-interest",children:Object(k.jsx)(L,{})}),Object(k.jsx)(o.a,{path:"/futures-big-open-interest",children:Object(k.jsx)(Y,{})}),Object(k.jsx)(o.a,{path:"/loan-and-lending-analysis",children:Object(k.jsx)(z,{})}),Object(k.jsx)(o.a,{path:"/",children:Object(k.jsx)(F,{})})]})})]})})},q=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,68)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,l=t.getTTFB;n(e),a(e),r(e),c(e),l(e)}))};l.a.render(Object(k.jsx)(r.a.StrictMode,{children:Object(k.jsx)(U,{})}),document.getElementById("root")),q()}},[[67,1,2]]]);
//# sourceMappingURL=main.acf983c1.chunk.js.map