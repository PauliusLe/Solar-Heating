(function () {
    // variables for the first series 
    var channel_id = 106292;
    var read_key = 'M6HP7CPSF8JAE2G7';
    var dataCount = 720;

    var series_1_field_number = 1;
    var series_1_color = '#ff0000';

    // variables for the second series
    var series_2_field_number = 3;
    var series_2_color = '#0000ff';

    // variables for the third series
    var series_3_field_number = 2;
    var series_3_color = '#00ff00';

    // variables for the forth series
    var series_4_field_number = 4;
    var series_4_color = '#dce222';

    var getLastRequest = "https://api.thingspeak.com/channels/106292/feeds/last?key=" + read_key;
    // user's timezone offset
    var my_offset = new Date().getTimezoneOffset();
    // chart variable
    var my_chart;

    var collectorTemp;
    var boilerMidTemp;
    var boilerBottomTemp;
    var pump;
    var col, b1, b2, air
    // add a blank chart
    addChart();
    // add the first series
    addSeries(channel_id, series_1_field_number, read_key, dataCount, series_1_color);
    // add the second series
    addSeries(channel_id, series_2_field_number, read_key, dataCount, series_2_color);
    // add the third series
    addSeries(channel_id, series_3_field_number, read_key, dataCount, series_3_color);
    // add the forth series
    addSeries(channel_id, series_4_field_number, read_key, dataCount, series_4_color);

    loadMonitoring();
    // add the base chart
    function addChart() {
        // specify the chart options
        var chartOptions = {
            chart: {
                renderTo: 'graph-container',
                defaultSeriesType: 'spline',
                backgroundColor: '#ffffff',
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        setInterval(function () {
                            fetch(getLastRequest, {
                                method: 'get'
                            })
                                .then(r => r.json())
                                .then((data) => {
                                    var point = new Highcharts.Point();
                                    // set the proper values
                                    collectorTemp = data["field1"];
                                    point.x = getChartDate(data.created_at);
                                    point.y = parseFloat(collectorTemp, true, true);
                                    my_chart.get("collector").addPoint(point);

                                    boilerMidTemp = data["field2"];
                                    point.x = getChartDate(data.created_at);
                                    point.y = parseFloat(boilerMidTemp, true, true);
                                    my_chart.get("boiler_mid").addPoint(point);

                                    boilerBottomTemp = data["field3"];
                                    point.x = getChartDate(data.created_at);
                                    point.y = parseFloat(boilerBottomTemp, true, true);
                                    my_chart.get("boiler_bottom").addPoint(point);

                                    airTemp = data["field4"];
                                    point.x = getChartDate(data.created_at);
                                    point.y = parseFloat(airTemp, true, true);
                                    my_chart.get("air").addPoint(point);

                                    var point = col.series[0].points[0];
                                    point.update(parseFloat(collectorTemp));

                                    point = b1.series[0].points[0];
                                    point.update(parseFloat(boilerMidTemp));

                                    point = b2.series[0].points[0];
                                    point.update(parseFloat(boilerBottomTemp));

                                    point = air.series[0].points[0];
                                    point.update(parseFloat(airTemp));

                                    updateInfo(data);
                                })
                        }, 120000);
                    }
                }
            },
            title: null,
            plotOptions: {
                series: {
                    marker: {
                        radius: 3
                    },
                    animation: false,
                    step: false,
                    borderWidth: 0,
                    turboThreshold: 0
                }
            },
            tooltip: {
                animation: false,
                // reformat the tooltips so that local times are displayed
                formatter: function () {
                    var d = new Date(this.x + (my_offset * 60000));
                    var n = (this.point.name === undefined) ? '' : '<br>' + this.point.name;
                    return this.series.name + ':<b>' + this.y + '</b>' + n + '<br>' + d.toLocaleDateString('lt-LT') + '<br>' + d.toTimeString().replace(/\(.*\)/, "").substring(0, 8);
                },
                hideDelay: 0,
                followTouchMove: false,
            },
            xAxis: {
                type: 'datetime',
                title: false
            },
            yAxis: {
                title: false
            },
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        };

        // draw the chart
        my_chart = new Highcharts.Chart(chartOptions);
    }

    // add a series to the chart
    function addSeries(channel_id, field_number, api_key, results, color) {
        var field_name = 'field' + field_number;
        var fname;
        // get the data with a webservice call
        var url = 'https://api.thingspeak.com/channels/' + channel_id + '/fields/' + field_number + '.json?offset=0&round=2&results=' + results + '&api_key=' + api_key + '&min=-50';
        fetch(url, {
            method: 'get'
        })
            .then(r => r.json())
            .then((data) => {

                // blank array for holding chart data
                var chart_data = [];

                // iterate through each feed
                data.feeds.forEach( (feed) => {
                    var point = new Highcharts.Point();
                    // set the proper values
                    var value = feed[field_name];
                    point.x = getChartDate(feed.created_at);
                    point.y = parseFloat(value);
                    // add location if possible
                    if (feed.location) {
                        point.name = feed.location;
                    }
                    // if a numerical value exists add it
                    if (!isNaN(parseInt(value))) {
                        chart_data.push(point);
                    }
                });
                if (data.channel[field_name] === "boiler_mid")
                    fname = "Boilerio vidurys";
                else if (data.channel[field_name] === "boiler_bottom") {
                    fname = "Boilerio apačia";
                } else if (data.channel[field_name] === "collector") {
                    fname = "Kolektorius";
                } else if (data.channel[field_name] === "air") {
                    fname = "Oras";
                } else {
                    fname = data.channel[field_name];
                }
                // add the chart data
                my_chart.addSeries({
                    data: chart_data,
                    name: fname,
                    color: color,
                    id: data.channel[field_name]
                });
            });
    }
    // converts date format from JSON
    function getChartDate(d) {
        // offset in minutes is converted to milliseconds and subtracted so that chart's x-axis is correct
        return Date.parse(d) - (my_offset * 60000);
    }

    function loadMonitoring() {
        fetch(getLastRequest, {
            method: 'get'
        })
            .then(r => r.json())
            .then((data) => {
                collectorTemp = data["field1"];
                boilerMidTemp = data["field2"];
                boilerBottomTemp = data["field3"];
                airTemp = data["field4"];
                var collercorOptions = getDefaultYAxisOption();
                collercorOptions.min = -30; 
                collercorOptions.plotBands.push({
                    from: -30,
                    to: 0,
                    color: '#6298f0' // blueish
                }); 
                col = addGauge("Kolektorius", parseFloat(collectorTemp), "collector-container", collercorOptions);
                b1 = addGauge("Boilerio vidurys", parseFloat(boilerMidTemp), "boiler1-container", getDefaultYAxisOption());
                b2 = addGauge("Boilerio apačia", parseFloat(boilerBottomTemp), "boiler2-container", getDefaultYAxisOption());
                air = addGauge("Oras", parseFloat(airTemp), "air-container", {
                    min: -30,
                    max: 30,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 0
                    },
                    title: {
                        text: '°C',
                        y: 100
                    },
                    plotBands: [{
                        from: -30,
                        to: 0,
                        color: '#6298f0'
                    },
                    {
                        from: 0,
                        to: 30,
                        color: '#ffb5b5'
                    },
                ]
                });
                updateInfo(data);
            })
    }

    function updateInfo(data) {
        pump = data["field5"];
        var created_at = data["created_at"];
        var updatedAgo = Math.round(Math.abs(getChartDate(created_at) - getChartDate(new Date())) / 60000);
        var info = "Siurbliukas: ";
        info += pump == 1 ? "Įjungtas" : "Išjungtas";
        info += ", atnaujinta prieš " + updatedAgo + " min.";
        document.getElementById("info").innerHTML = info
    }

    function getDefaultYAxisOption() {
        return {
            min: 0,
            max: 120,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 0
            },
            title: {
                text: '°C',
                y: 100
            },
            plotBands: [{
                from: 80,
                to: 90,
                color: '#DDDF0D' // yellow
            }, {
                from: 90,
                to: 120,
                color: '#DF5353' // red
            }]
        }
    }

    function addGauge(title, value, renderTo, yAxisOptions) {
        var chartOptions = {
            chart: {
                renderTo: renderTo,
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                backgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                borderRadius: 0,
                margin: [30, 0, 0, 0],
                spacingTop: 20,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
                width: 220,
                height: 220
            },

            title: {
                text: title
            },

            pane: {
                startAngle: -120,
                endAngle: 120,
                background: [{
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '100%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

            // the value axis
            yAxis: yAxisOptions,

            series: [{
                name: 'Temperatura',
                data: [value],
            }],
            tooltip: false,
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }

        };
        return new Highcharts.Chart(chartOptions);
    }
})();