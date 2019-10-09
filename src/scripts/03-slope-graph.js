import * as d3 from 'd3'

const margin = { top: 60, left: 50, right: 150, bottom: 30 }

const height = 600 - margin.top - margin.bottom
const width = 450 - margin.left - margin.right

const svg = d3
  .select('#slope-graph')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scalePoint()
  .domain(['2015', '2016'])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 36])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .domain([
    'Maryland',
    'Delaware',
    'Maine',
    'Florida',
    'Illinois',
    'Alaska',
    'Arkansas',
    'Colorado',
    'Indiana',
    'Iowa',
    'Kentucky',
    'Louisiana',
    'Minnesota',
    'Missouri',
    'Nebraska',
    'North Dakota',
    'Texas',
    'Virginia',
    'Washington',
    'Wyoming'
  ])
  .range([
    '#4cc1fc',
    '#4cc1fc',
    '#4cc1fc',
    '#4cc1fc',
    '#4cc1fc',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333',
    '#333333'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.deaths_per_100k)
  })

d3.csv(require('../data/overdoses.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.deaths_per_100k = Math.round(d.deaths / d.population / 10)
  })

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.year)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.deaths_per_100k)
    })
    .attr('fill', function(d) {
      return colorScale(d.state)
    })
    .attr('class', d => {
      return d.state.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .on('mouseover', d => {
      const className = d.state.toLowerCase().replace(/[^a-z]*/g, '')
      svg
        .selectAll('path.' + className)
        .attr('stroke', 'red')
        .raise()
      svg
        .selectAll('circle.' + className)
        .attr('fill', 'red')
        .raise()
      svg
        .selectAll('text.' + className)
        .attr('fill', 'red')
        .raise()
    })
    .on('mouseout', d => {
      const className = d.state.toLowerCase().replace(/[^a-z]*/g, '')
      svg.selectAll('path.' + className).attr('stroke', colorScale(d.state))
      svg.selectAll('circle.' + className).attr('fill', colorScale(d.state))
      svg.selectAll('text.' + className).attr('fill', 'black')
    })

  const nested = d3
    .nest()
    .key(function(d) {
      return d.state
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('class', d => {
      return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .on('mouseover', d => {
      const className = d.key.toLowerCase().replace(/[^a-z]*/g, '')
      svg
        .selectAll('path.' + className)
        .attr('stroke', 'red')
        .raise()
      svg
        .selectAll('circle.' + className)
        .attr('fill', 'red')
        .raise()
      svg
        .selectAll('text.' + className)
        .attr('fill', 'red')
        .raise()
    })
    .on('mouseout', d => {
      const className = d.key.toLowerCase().replace(/[^a-z]*/g, '')
      svg.selectAll('path.' + className).attr('stroke', colorScale(d.key))
      svg.selectAll('circle.' + className).attr('fill', colorScale(d.key))
      svg.selectAll('text.' + className).attr('fill', 'black')
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('font-size', 12)
    .attr('fill', '#333333')
    .attr('x', xPositionScale('2016'))
    .attr('dx', 5)
    .attr('y', function(d) {
      return yPositionScale(d.values[1].deaths_per_100k)
    })
    .text(function(d) {
      return d.values[1].deaths_per_100k + ' ' + d.key
    })
    .attr('dy', function(d) {
      if (d.key === 'Texas') {
        return 18
      }
      if (d.key === 'Virginia') {
        return -12
      }
      return 3
    })
    .attr('class', d => {
      return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .on('mouseover', d => {
      const className = d.key.toLowerCase().replace(/[^a-z]*/g, '')
      svg
        .selectAll('path.' + className)
        .attr('stroke', 'red')
        .raise()
      svg
        .selectAll('circle.' + className)
        .attr('fill', 'red')
        .raise()
      svg
        .selectAll('text.' + className)
        .attr('fill', 'red')
        .raise()
    })
    .on('mouseout', d => {
      const className = d.key.toLowerCase().replace(/[^a-z]*/g, '')
      svg.selectAll('path.' + className).attr('stroke', colorScale(d.key))
      svg.selectAll('circle.' + className).attr('fill', colorScale(d.key))
      svg.selectAll('text.' + className).attr('fill', 'black')
    })

  const xAxis = d3.axisBottom(xPositionScale)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([5, 10, 15, 20, 25, 30, 35])
    .tickSize(-width)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  svg.selectAll('.y-axis path').remove()
  svg.selectAll('.y-axis text').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}
