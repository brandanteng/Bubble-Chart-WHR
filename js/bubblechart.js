 var selectedYear = 2015;
 var selectedIndicator = 'GDP';
 var selectedCountry = 'Singapore';
 
 var indicatorToLabel = {
     GDP: 'Levels of GDP',
     SocialSupport: 'Social Support',
     LifeExpectancy: 'Life Expectancy',
     Freedom: 'Freedom',
     Generosity: 'Generosity',
     Corruption: 'Corruption',
     DystopiaResidual: 'Dystopia Residual'
 };
 
 var highlighted = 1;
 var visible = 0.8;
 var invisible = 0.3;
 
 // Creates a bootstrap-slider element
 $("#yearSlider").bootstrapSlider({
     tooltip: 'always',
     tooltip_position:'bottom'
 });
 
 // Listens to the on "change" event for the slider
 $("#yearSlider").on('change', function(event){
     // Update the chart on the new value
     selectedYear = event.value.newValue;
     updateCountryDetailsOnYearChange();
     updateChart(selectedYear, selectedIndicator);
 });
 
 var svg = d3.select('#bubble_chart svg');
 
 var svgWidth = +svg.attr('width');
 var svgHeight = +svg.attr('height');
 
 var padding = {t: 60, r: 40, b: 60, l: 50};
 var colors = {white: '#fff', lightGray: '#888', yellow: '#F8CF46'};
 
 var chartWidth = (svgWidth * 2/3) - padding.l - padding.r;
 var chartHeight = svgHeight - padding.t - padding.b;
 
 var bubbleChartG = svg.append('g')
     .attr('transform', 'translate(' + [padding.l, padding.t] + ')');
 
 var detailsGroup = svg.append('g')
     .attr('transform', 'translate(' + [padding.l*2 + chartWidth, padding.t] + ')');
 
 // Filters for happiness indicators
 var filtersGroup = detailsGroup.append('g');
 filtersGroup.append('text')
     .text('Showing data for:');
 
 var GDPFilter = filtersGroup.append('g')
     .attr('class', 'filter selected')
     .attr('value', 'GDP')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
     GDPFilter.append('rect')
     .attr('height', 20)
     .attr('width', 50)
     .attr('x', 3)
     .attr('y', 5)
     .attr('rx', 3)
     .attr('ry', 3);
     GDPFilter.append('text')
     .attr('x', 15)
     .attr('dy', '1.7em')
     .text('GDP');
 
 var SocialSupportFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'SocialSupport')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
     SocialSupportFilter.append('rect')
     .attr('height', 20)
     .attr('width', 90)
     .attr('x', 56)
     .attr('y', 5)
     .attr('rx', 3)
     .attr('ry', 3);
     SocialSupportFilter.append('text')
     .attr('x', 62)
     .attr('dy', '1.7em')
     .text('Social Support');
 
 var LifeExpectancyFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'LifeExpectancy')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
     LifeExpectancyFilter.append('rect')
     .attr('height', 20)
     .attr('width', 90)
     .attr('x', 151)
     .attr('y', 5)
     .attr('rx', 3)
     .attr('ry', 3);
     LifeExpectancyFilter.append('text')
     .attr('x', 155)
     .attr('dy', '1.7em')
     .text('Life Expectancy');
 
 var freedomFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'Freedom')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
 freedomFilter.append('rect')
     .attr('height', 20)
     .attr('width', 60)
     .attr('x', 3)
     .attr('y', 30)
     .attr('rx', 3)
     .attr('ry', 3);
 freedomFilter.append('text')
     .attr('x', 10)
     .attr('dy', '4em')
     .text('Freedom');
 
 var generosityFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'Generosity')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
 generosityFilter.append('rect')
     .attr('height', 20)
     .attr('width', 65)
     .attr('x', 68)
     .attr('y', 30)
     .attr('rx', 3)
     .attr('ry', 3);
 generosityFilter.append('text')
     .attr('x', 72)
     .attr('dy', '4em')
     .text('Generosity');
 
 var CorruptionFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'Corruption')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
     CorruptionFilter.append('rect')
     .attr('height', 20)
     .attr('width', 65)
     .attr('x', 138)
     .attr('y', 30)
     .attr('rx', 3)
     .attr('ry', 3);
     CorruptionFilter.append('text')
     .attr('x', 142)
     .attr('dy', '4em')
     .text('Corruption');
 
 var dystopiaFilter = filtersGroup.append('g')
     .attr('class', 'filter')
     .attr('value', 'DystopiaResidual')
     .on('click', function() {
         onFilterChanged(d3.select(this));
     });
 dystopiaFilter.append('rect')
     .attr('height', 20)
     .attr('width', 105)
     .attr('x', 209)
     .attr('y', 30)
     .attr('rx', 3)
     .attr('ry', 3);
 dystopiaFilter.append('text')
     .attr('x', 214)
     .attr('dy', '4em')
     .text('Dystopia Residual');
 
 // Country details on bubble chart hover
 var countryDetailsWidth = (svgWidth * 1/3) - padding.l;
 var countryDetailsHeight = chartHeight * 4/5;
 var countryDetailsX = (((svgWidth * 1/3) - padding.l) / 2) - (countryDetailsWidth/2);
 var countryDetailsY = chartHeight - (chartHeight * 3/4) - padding.b;
 
 var countryDetailsGroup = detailsGroup.append('g')
     .attr('class', 'countryDetails')
     .attr('transform', 'translate(' + [countryDetailsX, countryDetailsY] + ')');
 
 var countryDetailsBarChartG = countryDetailsGroup.append('g')
     .attr('transform', 'translate(' + [countryDetailsX, 3.8*countryDetailsY] + ')');
 
 var barChartWidth = countryDetailsWidth;
 var barChartHeight = countryDetailsHeight / 1.8;
 
 var years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
 
 // Color mapping by region
 var regionColors = {'America': '#49f47f', 'Europe': '#bd94b4', 'Africa': '#49c9f4', 'Asia/ Oceania': '#f4b642', 'Singapore': '#C73b3C'};
 
 var radius = 6;
 
 d3.csv('./data/bubblechart.csv',
     function(d) {
         return {
             country: d['Country'],
             year: +d['Year'],
             happiness: +d['Happiness Rank'],
             // rank
             sum: +d['Sum'],
             // score
             GDP: +d['Levels of GDP'],
             SocialSupport: +d['Social Support'],
             LifeExpectancy: +d['Life Expectancy'],
             Freedom: +d['Freedom'],
             Corruption: +d['Corruption'],
             Generosity: +d['Generosity'],
             DystopiaResidual: +d['Dystopia Residual'],
             region: d.Region,
             factors: [
                +d['Levels of GDP'],
                +d['Social Support'],
                +d['Life Expectancy'],
                +d['Freedom'],
                +d['Corruption'],
                +d['Generosity'],
                +d['Dystopia Residual']
             ]
         }
     },
     function(error, dataset) {
         if (error) {
             console.error('Error while loading datasets.');
             console.error(error);
             return;
         }
 
         dataByCountry = d3.nest()
             .key(function(d) {
                 return d.country;
             })
             .entries(dataset);
 
         dataByRegion = d3.nest()
             .key(function(d) {
                 return d.region;
             })
             .entries(dataset);
 
         allData = dataset;
 
         // Create bubble chart
 
         // x-axis
         xScale = d3.scaleLinear()
             .domain(d3.extent(allData, function(d) {
                 return 100*d.GDP/d.sum;
             }))
             .range([0, chartWidth]);
         xAxis = d3.axisBottom(xScale).tickFormat(function(d) { return d + '%'; });
         xAxisG = bubbleChartG.append('g')
             .attr('transform', 'translate(' + [0, chartHeight] + ')')
             .attr('class', 'x axis')
             .call(xAxis);
 
         // y-axis
         yScale = d3.scaleLinear()
             .domain([0, 10])
             .range([chartHeight, 0]);
 
         var yAxis = d3.axisLeft(yScale).ticks(10);
         var yAxisG = bubbleChartG.append('g')
             .attr('class', 'axis')
             .call(yAxis);
 
         // axis labels
         xAxisLabel = bubbleChartG.append('text')
             .attr('class', 'axis-label')
             .attr('transform', 'translate(' + [chartWidth/2, chartHeight + padding.t - padding.b/3] + ')')
             .text('\ Percent Contribution to Happiness Score');
 
         bubbleChartG.append('text')
             .attr('class', 'axis-label')
             .attr('transform', 'translate(' + [padding.l/2, -padding.t / 4] + ')')
             .text('Happiness Score');
 
         updateChart(2015, 'GDP');
         showCountryDetails(dataByCountry[0].values[0]);
         updateCountryDetails(dataByCountry[0].values[0]);
         selectedCountry = dataByCountry[0].values[0].country;
     });
 
 /** Helper functions **/
 
 function updateChart(year, indicator) {
     d3.selectAll('.d3-tip').remove();
 
     var yearData = allData.filter(function(d) {
         return d.year == year;
     });
 
     var circles = bubbleChartG.selectAll('.country')
         .data(yearData, function(d) {
             return d.country; // Object constancy by country
         });
 
     var circleEnter = circles.enter()
         .append('g')
         .attr('class', 'country');
 
     circleEnter.append('circle')
         .attr('fill', function(d) {
             if (regionColors[d.region]) {
                 return regionColors[d.region];
             }
             return colors.white;
         })
         .style('stroke', colors.lightGray);
 
     var tip = d3.tip()
       .attr('class', 'd3-tip')
       .html(function(d) {
           return "<strong>" + d.country + "</strong>";
       });
 
     circles.merge(circleEnter).call(tip);
 
     circles.merge(circleEnter)
         .select('circle')
         .on('mouseenter', tip.show)
         .on('mouseleave', tip.hide)
         .on('mouseover', function(d) {
             selectedCountry = d.country;
             updateCountryDetails(d);
             bubbleChartG.selectAll('circle')
                 .attr('opacity', function(e) {
                     return d.country == e.country ? highlighted : invisible;
                 });
         })
         .on('mouseout', function(d) {
             bubbleChartG.selectAll('circle').attr('opacity', visible);
         })
         .transition()
         .duration(750)
         .attr('opacity', visible)
         .attr('r', radius)
         .attr('cx', function(d) {
             return xScale(100*d[indicator]/d.sum)
         })
         .attr('cy', function(d) {
             return yScale(d.sum)
         });
 
     // Remove some countries for which data in a given year might not be present
     circles.exit().remove();
 }
 
 function onFilterChanged(newFilter) {
     d3.select('.filter.selected').classed('selected', false);
     newFilter.classed('selected', true);
     selectedIndicator = newFilter.attr('value');
     updateXAxis(selectedIndicator);
     updateChart(selectedYear, selectedIndicator);
 }
 
 function updateXAxis(indicator) {
     xAxisLabel.text(indicatorToLabel[indicator] + ' Percent Contribution to Happiness Score');
     xScale.domain(d3.extent(allData, function(d) {
         return 100*d[indicator]/d.sum;
     }));
     xAxisG.transition().duration(750).call(xAxis);
 }
 
 function showCountryDetails(countryData) {
     countryDetailsGroup.append('image')
         .attr('class', 'countryFlag')
         .attr('xlink:href', function() {
             return './img/' + countryData.country + '.png';
         })
         .attr('width', 130)
         .attr('height', 130)
         .attr('x', countryDetailsWidth / 2 - 65)
         .attr('y', padding.t/2);
 
     countryDetailsYear = countryDetailsGroup.append('text')
         .attr('class', 'countryDetails')
         .attr('id', 'year')
         .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*3] + ')')
         .text('Year ' + selectedYear);
 
     countryDetailsGroup.append('text')
         .attr('class', 'countryDetails')
         .attr('id', 'happiness')
         .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*3.5] + ')')
         .text('Rank: ' + countryData.happiness);
 
     countryDetailsGroup.append('text')
         .attr('class', 'countryDetails')
         .attr('id', 'happinessScore')
         .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t*4] + ')')
         .text('Happiness Score: ' + countryData.sum);
 
     countryDetailsGroup.append('text')
         .attr('class', 'countryName')
         .text('What makes ' + countryData.country + ' happy?')
         .attr('transform', 'translate(' + [countryDetailsWidth / 2, padding.t/2] + ')');
 
     // x-axis
     xScaleDetails = d3.scaleLinear()
         // .domain(d3.extent(countryData.factors))
         .domain([0, 4])
         .range([0, barChartWidth - padding.l*2]);
     xAxisDetails = d3.axisBottom(xScaleDetails).ticks(5);//.tickSizeOuter(0);
     xAxisDetailsG = countryDetailsGroup.append('g')
         .attr('transform', 'translate(' + [padding.l*2, countryDetailsHeight + 35] + ')')
         .attr('class', 'x axis')
         .call(xAxisDetails);
 
     countryDetailsGroup.append('text')
         .attr('class', 'axis-label-small')
         .attr('transform', 'translate(' + [countryDetailsWidth/1.45, countryDetailsHeight + 36*2] + ')')
         .text('Factor Contribution to Happiness Score');
 
     countryDetailsGroup.append('text')
         .attr('class', 'axis-label-small')
         .attr('transform', 'translate(' + [countryDetailsWidth/1.45, countryDetailsHeight + 36*2.4] + ')')
         .text('Points | Percent of Score');
 
 
     factorsLabels = countryDetailsGroup.selectAll('#indicatorLabel')
         .data(countryData.factors)
         .enter()
         .append('g')
         .attr('id', 'indicatorLabel');
 
     factorsLabels.append('text').text(function(d, i) {
             key = Object.keys(indicatorToLabel)[i];
             return indicatorToLabel[key];
         })
         .attr('class', 'detailsBarLabel')
         .style('text-anchor', 'end')
         .attr('x', padding.l * 1.9)
         .attr('y', function(d, i) {
             return 250 + 26.5 + (i*21);
         });
 
 }
 
 function updateCountryDetails(countryData) {
     countryDetailsGroup.select('.countryName').text('What makes ' + countryData.country + ' happy?');
     countryDetailsGroup.select('.countryFlag')
         .attr('xlink:href', function() {
             return './img/' + countryData.country + '.png';
         });
     countryDetailsGroup.select('#happiness').text('Happiness: ' + countryData.happiness);
     countryDetailsGroup.select('#happinessScore').text('Happiness Score: ' + countryData.sum);
 
     var bars = countryDetailsGroup.selectAll('.bar')
         .data(countryData.factors, function(d, i) {
             return countryData.country + i;
         });
 
     var barEnter = bars.enter()
         .append('g')
         .attr('class', 'bar');
 
     barEnter.append('rect')
         .style('fill', function() { return colors.yellow; })
         .attr('rx', 3);
 
     barEnter.append('text');
 
     bars.merge(barEnter)
         .select('rect')
         .attr('x', padding.l*2)
         .attr('y', function(d, i) {
             return 250 + 15 + (i*21);
         })
         .transition().duration(450)
         .attr('width', function(d) { return xScaleDetails(d); })
         .attr('height', 15);
 
     bars.merge(barEnter)
         .select('text')
         .text(function(d) {
             return d.toFixed(2) + ' | ' + (100*d/countryData.sum).toFixed(0) + '%';
         })
         .attr('class', 'detailsBarLabel')
         .attr('id', 'factorContribution')
         .style('text-anchor', 'start')
         .transition().duration(450)
         .attr('x', function(d) { return padding.l * 2 + xScaleDetails(d) + 3; })
         .attr('y', function(d, i) {
             return 250 + 26.5 + (i*21);
         });
 }
 
 function updateCountryDetailsOnYearChange() {
     yearToIdx = {2015:0, 2016:1, 2017:2, 2018:3, 2019:4, 2020:5};
     countryDetailsGroup.select('#year').text('Year ' + selectedYear);
 
     var country = dataByCountry.find(function(d) {
         return d.key == selectedCountry;
     });
     if (country) {
         var selectedYearData = country.values.find(function(d) {
             return d.year == selectedYear;
         });
         if (selectedYearData) {
             updateCountryDetails(selectedYearData);
             return;
         }
     }
     selectedCountry = dataByCountry[0].values[yearToIdx[selectedYear]].country;
     updateCountryDetails(dataByCountry[0].values[yearToIdx[selectedYear]]);
 }