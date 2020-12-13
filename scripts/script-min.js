!function(){var t,e,i,o,n,r,a,l,s,c,d="M6HP7CPSF8JAE2G7",h="https://api.thingspeak.com/channels/106292/feeds/last?key="+d,p=(new Date).getTimezoneOffset();function m(e,i,o,n,r){var a,l="field"+i;fetch("https://api.thingspeak.com/channels/"+e+"/fields/"+i+".json?offset=0&round=2&results="+n+"&api_key="+o+"&min=-50",{method:"get"}).then(t=>t.json()).then(e=>{var i=[];e.feeds.forEach(t=>{var e=new Highcharts.Point,o=t[l];e.x=f(t.created_at),e.y=parseFloat(o),t.location&&(e.name=t.location),isNaN(parseInt(o))||i.push(e)}),a="boiler_mid"===e.channel[l]?"Boilerio vidurys":"boiler_bottom"===e.channel[l]?"Boilerio apačia":"collector"===e.channel[l]?"Kolektorius":"air"===e.channel[l]?"Oras":e.channel[l],t.addSeries({data:i,name:a,color:r,id:e.channel[l]})})}function f(t){return Date.parse(t)-6e4*p}function u(t){n=t.field5;var e=t.created_at,i=Math.round(Math.abs(f(e)-f(new Date))/6e4),o="Siurbliukas: ";o+=1==n?"Įjungtas":"Išjungtas",o+=", atnaujinta prieš "+i+" min.",document.getElementById("info").innerHTML=o}function k(t,e,i,o){var n={chart:{renderTo:i,type:"gauge",plotBackgroundColor:null,plotBackgroundImage:null,backgroundColor:null,plotBorderWidth:0,plotShadow:!1,borderRadius:0,margin:[30,0,0,0],spacingTop:20,spacingBottom:0,spacingLeft:0,spacingRight:0,width:220,height:220},title:{text:t},pane:{startAngle:-120,endAngle:120,background:[{backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#333"]]},borderWidth:0,outerRadius:"100%"},{},{backgroundColor:"#DDD",borderWidth:0,outerRadius:"105%",innerRadius:"103%"}]},yAxis:o,series:[{name:"Temperatura",data:[e]}],tooltip:!1,exporting:{enabled:!1},legend:{enabled:!1},credits:{enabled:!1}};return new Highcharts.Chart(n)}c={chart:{renderTo:"graph-container",defaultSeriesType:"spline",backgroundColor:"#ffffff",events:{load:function(){setInterval(function(){fetch(h,{method:"get"}).then(t=>t.json()).then(n=>{var c=new Highcharts.Point;e=n.field1,c.x=f(n.created_at),c.y=parseFloat(e,!0,!0),t.get("collector").addPoint(c),i=n.field2,c.x=f(n.created_at),c.y=parseFloat(i,!0,!0),t.get("boiler_mid").addPoint(c),o=n.field3,c.x=f(n.created_at),c.y=parseFloat(o,!0,!0),t.get("boiler_bottom").addPoint(c),airTemp=n.field4,c.x=f(n.created_at),c.y=parseFloat(airTemp,!0,!0),t.get("air").addPoint(c);var c=r.series[0].points[0];c.update(parseFloat(e)),(c=a.series[0].points[0]).update(parseFloat(i)),(c=l.series[0].points[0]).update(parseFloat(o)),(c=s.series[0].points[0]).update(parseFloat(airTemp)),u(n)})},12e4)}}},title:null,plotOptions:{series:{marker:{radius:3},animation:!1,step:!1,borderWidth:0,turboThreshold:0}},tooltip:{animation:!1,formatter:function(){var t=new Date(this.x+6e4*p),e=void 0===this.point.name?"":"<br>"+this.point.name;return this.series.name+":<b>"+this.y+"</b>"+e+"<br>"+t.toLocaleDateString("lt-LT")+"<br>"+t.toTimeString().replace(/\(.*\)/,"").substring(0,8)},hideDelay:0,followTouchMove:!1},xAxis:{type:"datetime",title:!1},yAxis:{title:!1},exporting:{enabled:!1},legend:{enabled:!1},credits:{enabled:!1}},t=new Highcharts.Chart(c),m(106292,1,d,720,"#ff0000"),m(106292,3,d,720,"#0000ff"),m(106292,2,d,720,"#00ff00"),m(106292,4,d,720,"#dce222"),fetch(h,{method:"get"}).then(t=>t.json()).then(t=>{e=t.field1,i=t.field2,o=t.field3,airTemp=t.field4;var n={min:-30,max:120,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:0},title:{text:"°C",y:100},plotBands:[{from:80,to:90,color:"#DDDF0D"},{from:90,to:120,color:"#DF5353"}]};n.plotBands.push({from:-30,to:0,color:"#6298f0"}),r=k("Kolektorius",parseFloat(e),"collector-container",n),a=k("Boilerio vidurys",parseFloat(i),"boiler1-container",{min:0,max:120,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:0},title:{text:"°C",y:100},plotBands:[{from:80,to:90,color:"#DDDF0D"},{from:90,to:120,color:"#DF5353"}]}),l=k("Boilerio apačia",parseFloat(o),"boiler2-container",{min:0,max:120,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:0},title:{text:"°C",y:100},plotBands:[{from:80,to:90,color:"#DDDF0D"},{from:90,to:120,color:"#DF5353"}]}),s=k("Oras",parseFloat(airTemp),"air-container",{min:-30,max:30,minorTickInterval:"auto",minorTickWidth:1,minorTickLength:10,minorTickPosition:"inside",minorTickColor:"#666",tickPixelInterval:30,tickWidth:2,tickPosition:"inside",tickLength:10,tickColor:"#666",labels:{step:2,rotation:0},title:{text:"°C",y:100},plotBands:[{from:-30,to:0,color:"#6298f0"},{from:0,to:30,color:"#ffb5b5"}]}),u(t)})}();