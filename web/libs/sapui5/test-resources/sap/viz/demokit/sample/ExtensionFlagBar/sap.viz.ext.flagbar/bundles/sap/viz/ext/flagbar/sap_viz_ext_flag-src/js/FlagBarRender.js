define("sap_viz_ext_flag-src/js/FlagBarRender",["sap_viz_ext_flag-src/js/utils/util"], function(_util) {
    var render = function(data, vis, width, height, colorPalette, properties, dispatch) {
        //fetch data from imported data (in crosstable format) and convert them.
        var dses = _util._extractDimSets(data), mses = _util._extractMeasureSets(data);
        //if you are not familiar with cross table, you can convert it to flatten table as follow
        var fdata = _util._toFlattenTable(data);

        function convert(from) {
            var to = [];
            for (var i = 0; i < from.length; i++)
                to.push(from[i].val?from[i].val:from[i]);
            return to;
        }

        var medalType = data.getAnalysisAxisDataByIdx?convert(data.getAnalysisAxisDataByIdx(0).values[0].rows):data.dataset.data().analysisAxis[0].data[0].values; //medal dimension
        var countries = data.getAnalysisAxisDataByIdx?convert(data.getAnalysisAxisDataByIdx(1).values[0].rows):data.dataset.data().analysisAxis[1].data[0].values; //country dimension
        var getImageUrl = function (imgID) {
            return sap.viz.api.env.Resource.path('sap.viz.ext.flagbar.ImgLoadPath')[0] + imgID + '.png';
        };
        var years = []; //year dimension
        var plotData = []; //value
        //var rawData = data.getMeasureValuesGroupDataByIdx(0).values;
        var rawData = data.getMeasureValuesGroupDataByIdx?data.getMeasureValuesGroupDataByIdx(0).values:data.dataset.data().measureValuesGroup[0].data;

        var i, j, k;
        //the input data are organized in 3 level: year > country > medal,
        //convert it to medal > year > country so it's convenient to draw.

        for ( i = 0; i < rawData.length; i++) {
            years.push(rawData[i].col?rawData[i].col:rawData[i].name);
            var countryLevel = rawData[i].rows?rawData[i].rows:rawData[i].values;
            for ( j = 0; j < countryLevel.length; j++) {
                var medalLevel = convert(countryLevel[j]);
                for ( k = 0; k < medalLevel.length; k++) {
                    plotData[k] = plotData[k] || [];
                    plotData[k][i] = plotData[k][i] || [];
                    plotData[k][i].push(medalLevel[k]);
                }
            }
        }
        //prepare canvas, scales
        var w = width - 100,
            h = height - 60,
            padding = 30;
        if(w <= 0 || h <= 0) {
            return;
        }
        
        var canvas = d3.select(this).append('g')
                        .attr('class', 'vis')
                        .attr('width', w)
                        .attr('height', h)
                        .attr('transform', 'translate(' + padding + ',' + padding + ')');
        var x1 = d3.scale.ordinal()
                    .domain(d3.range(medalType.length))
                    .rangeBands([0, w], .1);
        var x1Padding = x1.rangeBand() / 0.9 * .1;
        var x2 = d3.scale.ordinal()
                    .domain(d3.range(years.length))
                    .rangeBands([0, x1.rangeBand()], .1);
        var x2Padding = x2.rangeBand() / 0.9 * .1;
        var x3 = d3.scale.ordinal()
                    .domain(d3.range(countries.length))
                    .rangeBands([0, x2.rangeBand()]);
        var ymax = d3.max(plotData, function(d) {
                    return d3.max(d, function(dd) {
                        return d3.max(dd);
                    });
                }) * 1.2;
        var y = d3.scale.linear().
                    domain([0, ymax])
                    .range([h, 0]);
        //ticks & lines of y axis
        var yticks = y.ticks(6);
        var tickDistance = y(yticks[0]) - y(yticks[1]);
        var rules = canvas.selectAll('g.rule')
                        .data(yticks)
                        .enter()
                        .append('g')
                        .attr('transform', function(d, i) {
                            return 'translate(0,' + y(d) + ')';
                        });
        rules.append('line')//y ticks
            .attr('x1', 5)
            .attr('y1', 0)
            .attr('x2', x1(0) - x1Padding / 2)
            .attr('y2', 0)
            .attr('stroke', 'black');
        rules.append('text')//y ticks text
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', -10)
            .attr('dy', 5)
            .attr('fill', 'black')
            .style('font-size', '12px')
            .text(function(d, i) {
                return d;
            });
        rules.append('rect')//rect stripe
            .attr('x', x1(0) - x1Padding / 2)
            .attr('y', 0)
            .attr('width', w - x1Padding)
            .attr('height', tickDistance)
            .attr('fill', function(d, i) {
                return i % 2 ? '#ddd' : 'white';
            });
        rules.append('line')//top line under medal icon and text
            .attr('x1', x1(0) - x1Padding / 2)
            .attr('y1', 0)
            .attr('x2', w - x1Padding / 2)
            .attr('y2', 0)
            .attr('stroke', function(d, i) {
                return i ? '#ddd' : 'black';
            });

        //x1 - medals (medal is indicated on top of chart using icon and text)
        var x1Groups = canvas.selectAll('g.x1')
                        .data(plotData)
                        .enter()
                        .append('g')
                        .attr('class', 'x1')
                        .attr('transform', function(d, i) {
                            return 'translate(' + x1(i) + ',0)';
                        });
        x1Groups.append('line')//x1 (medal) verizonal tick line
            .attr('class', 'x1')
            .attr('stroke', 'black')
            .attr('x1', -x1Padding / 2)
            .attr('y1', -10)
            .attr('x2', -x1Padding / 2)
            .attr('y2', h + 20);
        var xMax = x1.range()[x1.range().length - 1] + x1.rangeBand() + x1Padding / 2;
        canvas.append('line')//rightmost verizonal tick line
            .attr('class', 'x1')
            .attr('stroke', 'black')
            .attr('x1', xMax)
            .attr('y1', -10)
            .attr('x2', xMax)
            .attr('y2', h + 20);
        x1Groups.append('text')//medal text
            .attr('class', 'medal')
            .attr('fill', 'black')
            .attr('x', function(d, i) {
                return (x1.rangeBand()) / 2;
            })
            .attr('y', 0)
            .attr('dx', 15)
            .style('font-family', 'Tahoma')
            .style('font-size', '12px')
            .attr('text-anchor', 'middle')
            .text(function(d, i) {
                return medalType[i];
            });
        x1Groups.append('image')//medal icon
            .attr('x', function(d, i) {
                return (x1.rangeBand()) / 2 - 30;
            })
            .attr('y', -18)
            .attr('width', 24)
            .attr('height', 24)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('xlink:href', function(d, i) {
                return getImageUrl(medalType[i]);
            });

        //x2 - years
        var x2Groups = x1Groups.selectAll('g.x2')
                            .data(function(d, i) {
                                return d;
                            })
                            .enter()
                            .append('g')
                            .attr('class', 'x2')
                            .attr('transform', function(d, i) {
                                return 'translate(' + x2(i) + ',0)';
                            });
        x2Groups.append('text')//year title
            .attr('class', 'year')
            .attr('fill', 'black')
            .attr('x', function(d, i) {
                return (x2.rangeBand()) / 2;
            })
            .attr('y', h)
            .attr('dy', 15)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Tahoma')
            .style('font-size', '11px')
            .text(function(d, i) {
                return years[i];
            });
        x2Groups.append('line')//year tick line - the short verizonal line between years on x axis
            .attr('x1', -x2Padding / 2)
            .attr('x2', -x2Padding / 2)
            .attr('y1', h)
            .attr('y2', h + 5)
            .attr('stroke', function(d, i) {
                return i ? 'black' : 'white';
            });

        //x3 - country
        var x3Groups = x2Groups.selectAll('g.x3')
                        .data(function(d, i) {
                            return d;
                        })
                        .enter()
                        .append('g')
                        .attr('class', 'x3')
                        .attr('transform', function(d, i) {
                            return 'translate(' + x3(i) + ',0)';
                        });
        x3Groups.append('line')//dashed lines connecting flag with x axis
            .attr('class', 'x3')
            .attr('x1', (x3.rangeBand() - 2) / 2)
            .attr('y1', function(d, i) {
                return y(d);
            })
            .attr('x2', (x3.rangeBand() - 2) / 2)
            .attr('y2', h)
            .attr('stroke', '#aaa')
            .attr('stroke-width', 3)
            .style('stroke-dasharray', '2,5');
        x3Groups.append('image')//flag icon
            .attr('x', 0)
            .attr('y', function(d, i) {
                return y(d);
            })
            .attr('width', x3.rangeBand() - 2)
            .attr('height', 50)
            .attr('preserveAspectRatio', 'xMidYMin meet')
            .attr('xlink:href', function(d, i) {
                return getImageUrl(countries[i]);
            });

        //legend
        var legends = canvas.selectAll('g.legend')
                        .data(countries)
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                            return 'translate(' + w + ',' + (50 + 20 * i) + ')';
                        });
        legends.append('image')//flag
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 13)
            .attr('height', 9)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('xlink:href', function(d, i) {
                return getImageUrl(d);
            });
        legends.append('text')//country name
            .attr('class', 'legend')
            .attr('fill', 'black')
            .attr('x', 15)
            .attr('y', 0)
            .attr('dy', 8)
            .attr('text-anchor', 'start')
            .style('font-family', 'Tahoma')
            .style('font-size', '11px')
            .text(function(d, i) {
                return d;
            });
        dispatch.initialized({
            name : 'initialized'
        });
    }
    return render;
});